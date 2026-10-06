import frappe
from frappe.utils import flt, get_datetime, now_datetime

from ury.ury.report_api.utils import (
	get_business_day_range_condition,
	report_settings_join,
	require_manager,
	settled_status_condition,
	validate_date_range,
)

# A shift is one POS Opening Entry, running until the POS Closing Entry (or
# URY Sub POS Closing) that references it. An open shift runs until now.
LONG_SHIFT_HOURS = 24
MAX_SHIFT_INVOICES = 5000

# rounded_total is 0 when rounding is disabled on the POS Profile.
_PAID_EXPR = "IF(IFNULL(b.`rounded_total`, 0) <> 0, b.`rounded_total`, b.`grand_total`)"


def _counted_condition(prefix="b"):
	"""Settled or on-credit sales, plus returns so shift totals net out the
	same way the till does."""
	return f"({settled_status_condition(prefix)} OR {prefix}.`is_return` = 1)"


def _closed_invoices_subquery(shift_param="shift"):
	"""Invoice names recorded on the closing documents of a shift. Closing
	only lists invoices created by the closing cashier, so callers union
	this with a time-window match rather than relying on it alone."""
	return f"""(
		SELECT r.`pos_invoice`
		FROM `tabPOS Invoice Reference` r
		INNER JOIN `tabPOS Closing Entry` c ON (c.`name` = r.`parent` AND r.`parenttype` = 'POS Closing Entry')
		WHERE c.`docstatus` = 1 AND c.`pos_opening_entry` = %({shift_param})s
		UNION
		SELECT s.`pos_invoice`
		FROM `tabSub POS Invoices` s
		INNER JOIN `tabSub POS Closing` c ON (c.`name` = s.`parent` AND s.`parenttype` = 'Sub POS Closing')
		WHERE c.`docstatus` = 1 AND c.`pos_opening_entry` = %({shift_param})s
	)"""


def _closing_ends(opening_names):
	"""{opening_name: latest submitted closing period_end_date}."""
	if not opening_names:
		return {}
	rows = frappe.db.sql(
		"""
		SELECT `pos_opening_entry` AS opening, MAX(`period_end_date`) AS period_end
		FROM `tabPOS Closing Entry`
		WHERE `docstatus` = 1 AND `pos_opening_entry` IN %(names)s
		GROUP BY `pos_opening_entry`
		UNION ALL
		SELECT `pos_opening_entry` AS opening, MAX(`period_end_date`) AS period_end
		FROM `tabSub POS Closing`
		WHERE `docstatus` = 1 AND `pos_opening_entry` IN %(names)s
		GROUP BY `pos_opening_entry`
		""",
		{"names": tuple(opening_names)},
		as_dict=True,
	)
	ends = {}
	for r in rows:
		if not r["period_end"]:
			continue
		end = get_datetime(r["period_end"])
		if r["opening"] not in ends or end > ends[r["opening"]]:
			ends[r["opening"]] = end
	return ends


def _shift_window(opening, closing_end, now=None):
	"""(start, end, is_open). An open shift ends now."""
	start = get_datetime(opening["period_start_date"])
	is_open = opening["status"] == "Open" or closing_end is None
	end = (now or now_datetime()) if is_open else closing_end
	return start, end, is_open


def _shift_info(opening, closing_end, now=None):
	start, end, is_open = _shift_window(opening, closing_end, now)
	return {
		"name": opening["name"],
		"branch": opening.get("branch"),
		"pos_profile": opening["pos_profile"],
		"cashier": opening["user"],
		"cashier_name": opening.get("user_name") or opening["user"],
		"start": str(start.replace(microsecond=0)),
		"end": None if is_open else str(end.replace(microsecond=0)),
		"is_open": is_open,
		"is_long": (end - start).total_seconds() > LONG_SHIFT_HOURS * 3600,
	}


def _format_time(value):
	"""posting_time comes back from MariaDB as a timedelta."""
	if value is None:
		return ""
	if hasattr(value, "total_seconds"):
		seconds = int(value.total_seconds())
		return f"{seconds // 3600:02d}:{seconds % 3600 // 60:02d}"
	return str(value)[:5]


def _format_qty(qty):
	qty = abs(flt(qty))
	return int(qty) if qty.is_integer() else qty


def _attach_items(rows):
	"""Adds `courses` (distinct, first-seen order) and `items` (qty summed per
	item name, first-seen order) to each invoice row."""
	if not rows:
		return rows
	names = [r["invoice"] for r in rows]
	item_rows = frappe.db.sql(
		"""
		SELECT bi.`parent` AS invoice, bi.`item_name`, bi.`qty`, bi.`custom_course` AS course
		FROM `tabPOS Invoice Item` bi
		WHERE bi.`parenttype` = 'POS Invoice' AND bi.`parent` IN %(names)s
		ORDER BY bi.`parent`, bi.`idx`
		""",
		{"names": tuple(names)},
		as_dict=True,
	)

	by_invoice = {}
	for it in item_rows:
		entry = by_invoice.setdefault(it["invoice"], {"courses": [], "items": {}})
		if it["course"] and it["course"] not in entry["courses"]:
			entry["courses"].append(it["course"])
		entry["items"][it["item_name"]] = entry["items"].get(it["item_name"], 0) + flt(it["qty"])

	for r in rows:
		entry = by_invoice.get(r["invoice"], {"courses": [], "items": {}})
		r["courses"] = entry["courses"]
		r["items"] = [
			{"item_name": name, "qty": _format_qty(qty)} for name, qty in entry["items"].items()
		]
	return rows


def _fetch_invoice_rows(where, params, join="", limit=None, offset=0):
	paging = ""
	if limit is not None:
		paging = "LIMIT %(limit)s OFFSET %(offset)s"
		params = {**params, "limit": limit, "offset": offset}

	rows = frappe.db.sql(
		f"""
		SELECT
			b.`name` AS invoice,
			b.`posting_date` AS posting_date,
			b.`posting_time` AS posting_time,
			b.`custom_waiter_employee` AS employee,
			e.`employee_name` AS employee_name,
			{_PAID_EXPR} AS paid_amount,
			b.`is_return` AS is_return,
			IF(b.`custom_settlement_stage` = 'Transferred On Credit', 1, 0) AS on_credit
		FROM `tabPOS Invoice` b
		LEFT JOIN `tabEmployee` e ON (e.`name` = b.`custom_waiter_employee`)
		{join}
		WHERE {where}
		ORDER BY b.`posting_date` ASC, b.`posting_time` ASC, b.`name` ASC
		{paging}
		""",
		params,
		as_dict=True,
	)

	for i, r in enumerate(rows, start=offset + 1):
		r["row_no"] = i
		r["posting_date"] = str(r["posting_date"])
		r["posting_time"] = _format_time(r["posting_time"])
		r["paid_amount"] = flt(r.get("paid_amount"), 2)
		r["is_return"] = bool(r.get("is_return"))
		r["on_credit"] = bool(r.get("on_credit"))
		r["employee_name"] = r.get("employee_name") or r.get("employee")
	return _attach_items(rows)


def _summary(invoice_count, sales_total, total_paid, credit_total):
	invoice_count = int(invoice_count or 0)
	sales_total = flt(sales_total, 2)
	return {
		"invoice_count": invoice_count,
		"total_paid": flt(total_paid, 2),
		"average_ticket": flt(sales_total / invoice_count, 2) if invoice_count else 0,
		"credit_total": flt(credit_total, 2),
	}


def _summary_from_rows(rows):
	sales = [r for r in rows if not r["is_return"]]
	return _summary(
		invoice_count=len(sales),
		sales_total=sum(r["paid_amount"] for r in sales),
		total_paid=sum(r["paid_amount"] for r in rows),
		credit_total=sum(r["paid_amount"] for r in rows if r["on_credit"]),
	)


@frappe.whitelist()
def get_shifts(start_date, end_date, branch=None):
	"""Cashier shifts (POS Opening Entries) opened within a date range,
	newest first. `branch` omitted means all branches."""
	require_manager()
	validate_date_range(start_date, end_date)

	params = {"start_date": start_date, "end_date": end_date}
	branch_filter = ""
	if branch:
		branch_filter = "AND o.`branch` = %(branch)s"
		params["branch"] = branch

	openings = frappe.db.sql(
		f"""
		SELECT
			o.`name`, o.`branch`, o.`pos_profile`, o.`user`, o.`status`,
			o.`period_start_date`, u.`full_name` AS user_name
		FROM `tabPOS Opening Entry` o
		LEFT JOIN `tabUser` u ON (u.`name` = o.`user`)
		WHERE o.`docstatus` = 1
			AND DATE(o.`period_start_date`) BETWEEN %(start_date)s AND %(end_date)s
			{branch_filter}
		ORDER BY o.`period_start_date` DESC
		""",
		params,
		as_dict=True,
	)

	ends = _closing_ends([o["name"] for o in openings])
	now = now_datetime()
	return {
		"branch": branch,
		"start_date": str(start_date),
		"end_date": str(end_date),
		"shifts": [_shift_info(o, ends.get(o["name"]), now) for o in openings],
	}


@frappe.whitelist()
def get_shift_invoices(shift):
	"""One row per invoice for a single shift.

	An invoice belongs to the shift if it sits on the shift's closing
	documents, or if it was posted on the shift's POS Profile between opening
	and closing (now, for an open shift). The time window catches invoices
	created by users other than the closing cashier, which closing omits.
	"""
	require_manager()
	if not shift:
		frappe.throw("shift is required.")

	opening = frappe.db.sql(
		"""
		SELECT
			o.`name`, o.`branch`, o.`pos_profile`, o.`user`, o.`status`, o.`docstatus`,
			o.`period_start_date`, u.`full_name` AS user_name
		FROM `tabPOS Opening Entry` o
		LEFT JOIN `tabUser` u ON (u.`name` = o.`user`)
		WHERE o.`name` = %(shift)s
		""",
		{"shift": shift},
		as_dict=True,
	)
	if not opening or opening[0]["docstatus"] != 1:
		frappe.throw(f"Shift {shift} not found.", frappe.DoesNotExistError)
	opening = opening[0]

	closing_end = _closing_ends([shift]).get(shift)
	now = now_datetime()
	start, end, _ = _shift_window(opening, closing_end, now)
	params = {"shift": shift, "pos_profile": opening["pos_profile"], "start": start, "end": end}
	where = f"""
		b.`docstatus` = 1
		AND {_counted_condition()}
		AND (
			(b.`pos_profile` = %(pos_profile)s
				AND TIMESTAMP(b.`posting_date`, b.`posting_time`) BETWEEN %(start)s AND %(end)s)
			OR b.`name` IN {_closed_invoices_subquery()}
		)
	"""

	rows = _fetch_invoice_rows(where, params, limit=MAX_SHIFT_INVOICES + 1)
	truncated = len(rows) > MAX_SHIFT_INVOICES
	rows = rows[:MAX_SHIFT_INVOICES]

	return {
		"shift": _shift_info(opening, closing_end, now),
		"invoices": rows,
		"summary": _summary_from_rows(rows),
		"truncated": truncated,
	}


@frappe.whitelist()
def get_period_invoices(start_date, end_date, branch=None, page=1, page_size=50):
	"""One row per invoice across a date range, paginated. Business-day
	boundaries follow URY Report Settings for a single branch, plain calendar
	dates for all branches (same as get_daywise_invoices)."""
	require_manager()
	validate_date_range(start_date, end_date)

	page = max(1, int(page))
	page_size = max(1, min(int(page_size), 200))
	offset = (page - 1) * page_size

	params = {"start_date": start_date, "end_date": end_date}
	if branch:
		condition = get_business_day_range_condition()
		join = report_settings_join()
		params["branch"] = branch
		branch_filter = "b.`branch` = %(branch)s AND"
	else:
		condition = "b.`posting_date` BETWEEN %(start_date)s AND %(end_date)s"
		join = ""
		branch_filter = ""

	where = f"""
		{branch_filter}
		b.`docstatus` = 1
		AND {_counted_condition()}
		AND {condition}
	"""

	totals = frappe.db.sql(
		f"""
		SELECT
			COUNT(*) AS total_rows,
			SUM(CASE WHEN b.`is_return` = 0 THEN 1 ELSE 0 END) AS invoice_count,
			SUM(CASE WHEN b.`is_return` = 0 THEN {_PAID_EXPR} ELSE 0 END) AS sales_total,
			SUM({_PAID_EXPR}) AS total_paid,
			SUM(CASE WHEN b.`custom_settlement_stage` = 'Transferred On Credit' THEN {_PAID_EXPR} ELSE 0 END) AS credit_total
		FROM `tabPOS Invoice` b
		{join}
		WHERE {where}
		""",
		params,
		as_dict=True,
	)[0]
	total_rows = int(totals.get("total_rows") or 0)

	rows = _fetch_invoice_rows(where, params, join=join, limit=page_size, offset=offset)

	return {
		"branch": branch,
		"start_date": str(start_date),
		"end_date": str(end_date),
		"invoices": rows,
		"summary": _summary(
			totals.get("invoice_count"),
			totals.get("sales_total"),
			totals.get("total_paid"),
			totals.get("credit_total"),
		),
		"pagination": {
			"page": page,
			"page_size": page_size,
			"total": total_rows,
			"total_pages": (total_rows + page_size - 1) // page_size if total_rows else 0,
		},
	}
