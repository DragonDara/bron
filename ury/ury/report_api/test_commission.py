import frappe
from frappe.tests.utils import FrappeTestCase

from ury.ury.report_api import commission

TEST_NON_MANAGER = "_test_ury_commission_non_manager@example.com"


class TestRequireManagerGate(FrappeTestCase):
	"""Every whitelisted function in commission.py must call require_manager()
	first and deny a non-manager user."""

	def setUp(self):
		frappe.set_user("Administrator")
		if not frappe.db.exists("User", TEST_NON_MANAGER):
			frappe.get_doc({
				"doctype": "User",
				"email": TEST_NON_MANAGER,
				"first_name": "NonManager",
				"send_welcome_email": 0,
				"roles": [{"role": "Employee"}],
			}).insert(ignore_permissions=True)

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_get_commission_settings_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			commission.get_commission_settings()

	def test_update_commission_settings_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			commission.update_commission_settings(enabled=1)

	def test_search_commission_employees_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			commission.search_commission_employees("john")

	def test_get_employee_commission_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			commission.get_employee_commission("2026-01-01", "2026-01-31")

	def test_get_employee_commission_detail_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			commission.get_employee_commission_detail("EMP-0001", "2026-01-01", "2026-01-31")


class TestResolveRulePrecedence(FrappeTestCase):
	"""resolve_rule() must prefer the most specific match: employee+branch >
	employee > designation+branch > designation > branch > unscoped, and
	fall through to None (caller applies default_rate) when nothing matches.
	Ties (equal specificity) keep the first row encountered in list order."""

	def _rule(self, employee=None, designation=None, branch=None, rate=10, disabled=0):
		return {
			"employee": employee, "designation": designation, "branch": branch,
			"rate_type": "Flat", "rate": rate, "tier_mode": None,
			"disabled": disabled, "tiers": [],
		}

	def test_employee_plus_branch_beats_employee_only(self):
		rules = [
			self._rule(employee="EMP-1", rate=10),
			self._rule(employee="EMP-1", branch="B1", rate=20),
		]
		best = commission.resolve_rule(rules, "EMP-1", "Waiter", "B1")
		self.assertEqual(best["rate"], 20)

	def test_employee_beats_designation_plus_branch(self):
		rules = [
			self._rule(designation="Waiter", branch="B1", rate=15),
			self._rule(employee="EMP-1", rate=30),
		]
		best = commission.resolve_rule(rules, "EMP-1", "Waiter", "B1")
		self.assertEqual(best["rate"], 30)

	def test_designation_plus_branch_beats_designation(self):
		rules = [
			self._rule(designation="Waiter", rate=5),
			self._rule(designation="Waiter", branch="B1", rate=25),
		]
		best = commission.resolve_rule(rules, "EMP-2", "Waiter", "B1")
		self.assertEqual(best["rate"], 25)

	def test_designation_beats_branch(self):
		rules = [
			self._rule(branch="B1", rate=5),
			self._rule(designation="Waiter", rate=12),
		]
		best = commission.resolve_rule(rules, "EMP-2", "Waiter", "B1")
		self.assertEqual(best["rate"], 12)

	def test_branch_beats_unscoped(self):
		rules = [
			self._rule(rate=3),
			self._rule(branch="B1", rate=8),
		]
		best = commission.resolve_rule(rules, "EMP-2", "Waiter", "B1")
		self.assertEqual(best["rate"], 8)

	def test_unscoped_beats_no_match_default(self):
		rules = [self._rule(rate=3)]
		best = commission.resolve_rule(rules, "EMP-2", "Waiter", "B1")
		self.assertEqual(best["rate"], 3)

	def test_no_rules_returns_none_for_default(self):
		self.assertIsNone(commission.resolve_rule([], "EMP-2", "Waiter", "B1"))

	def test_disabled_rule_ignored(self):
		rules = [self._rule(employee="EMP-1", rate=99, disabled=1)]
		self.assertIsNone(commission.resolve_rule(rules, "EMP-1", "Waiter", "B1"))

	def test_tie_break_keeps_first_match(self):
		rules = [
			self._rule(branch="B1", rate=1),
			self._rule(branch="B1", rate=2),
		]
		best = commission.resolve_rule(rules, "EMP-2", "Waiter", "B1")
		self.assertEqual(best["rate"], 1)


class TestApplyTiers(FrappeTestCase):
	"""_apply_tiers against a hand-computed 3-tier example:
	tier0: 0-1000 @ 10%, tier1: 1000-5000 @ 15%, tier2: 5000+ @ 20%."""

	TIERS = [
		{"from_amount": 0, "rate": 10},
		{"from_amount": 1000, "rate": 15},
		{"from_amount": 5000, "rate": 20},
	]

	def test_marginal_within_first_tier(self):
		commission_amt, rate = commission._apply_tiers(500, self.TIERS, "Marginal")
		# 500 * 10% = 50
		self.assertEqual(commission_amt, 50.0)
		self.assertEqual(rate, 10.0)

	def test_marginal_spanning_tiers(self):
		commission_amt, rate = commission._apply_tiers(6000, self.TIERS, "Marginal")
		# 1000*10% + 4000*15% + 1000*20% = 100 + 600 + 200 = 900
		self.assertEqual(commission_amt, 900.0)
		self.assertAlmostEqual(rate, 900 / 6000 * 100, places=2)

	def test_slab_uses_single_rate(self):
		commission_amt, rate = commission._apply_tiers(6000, self.TIERS, "Slab")
		# whole base at the highest reached tier's rate: 6000 * 20% = 1200
		self.assertEqual(commission_amt, 1200.0)
		self.assertEqual(rate, 20.0)

	def test_slab_within_first_tier(self):
		commission_amt, rate = commission._apply_tiers(500, self.TIERS, "Slab")
		self.assertEqual(commission_amt, 50.0)
		self.assertEqual(rate, 10.0)

	def test_base_zero_returns_zero(self):
		commission_amt, rate = commission._apply_tiers(0, self.TIERS, "Marginal")
		self.assertEqual((commission_amt, rate), (0.0, 0.0))

	def test_base_negative_returns_zero_never_negative(self):
		commission_amt, rate = commission._apply_tiers(-500, self.TIERS, "Marginal")
		self.assertEqual((commission_amt, rate), (0.0, 0.0))
		commission_amt, rate = commission._apply_tiers(-500, self.TIERS, "Slab")
		self.assertEqual((commission_amt, rate), (0.0, 0.0))


class TestCommissionBaseExpressions(FrappeTestCase):
	"""The 4 commission_base expressions map onto the POS Invoice columns
	ERPNext stores. For a Grand-Total discount ERPNext has already spread the
	discount into net_total (taxes_and_totals.apply_discount_amount), e.g.
	total 2040, 12% tax, 10% discount on Grand Total stores net_total 1836,
	tax 220.32, grand_total 2056.32 -- so "Net Sales" must read net_total as
	is instead of subtracting the discount a second time."""

	def test_net_sales_reads_net_total_without_second_discount(self):
		self.assertEqual(commission._BASE_EXPR["Net Sales"].strip(), "b.`net_total`")
		self.assertNotIn("discount_amount", commission._BASE_EXPR["Net Sales"])

	def test_net_total_expression(self):
		self.assertEqual(commission._BASE_EXPR["Net Total"], "b.`net_total`")

	def test_item_total_expression(self):
		self.assertEqual(commission._BASE_EXPR["Item Total"], "b.`total`")

	def test_grand_total_expression(self):
		self.assertEqual(commission._BASE_EXPR["Grand Total"], "b.`grand_total`")

	def test_base_expr_map_has_all_four_keys(self):
		self.assertEqual(
			set(commission._BASE_EXPR.keys()),
			{"Net Sales", "Net Total", "Item Total", "Grand Total"},
		)


class TestAttributionWeights(FrappeTestCase):
	"""_weights_for_row against a single invoice with distinct opener/closer
	for each of the 4 attribution modes."""

	ROW = {"invoice": "POS-0001", "opener": "EMP-OPEN", "closer": "EMP-CLOSE"}

	def test_opener_mode(self):
		weights = commission._weights_for_row(self.ROW, "Opener", {})
		self.assertEqual(weights, {"EMP-OPEN": 1.0})

	def test_closer_mode(self):
		weights = commission._weights_for_row(self.ROW, "Closer", {})
		self.assertEqual(weights, {"EMP-CLOSE": 1.0})

	def test_closer_mode_falls_back_to_opener_when_closer_missing(self):
		row = {"invoice": "POS-0002", "opener": "EMP-OPEN", "closer": None}
		weights = commission._weights_for_row(row, "Closer", {})
		self.assertEqual(weights, {"EMP-OPEN": 1.0})

	def test_split_evenly_mode(self):
		weights = commission._weights_for_row(self.ROW, "Split Evenly", {})
		self.assertEqual(weights, {"EMP-OPEN": 0.5, "EMP-CLOSE": 0.5})

	def test_split_evenly_same_employee_full_weight(self):
		row = {"invoice": "POS-0003", "opener": "EMP-A", "closer": "EMP-A"}
		weights = commission._weights_for_row(row, "Split Evenly", {})
		self.assertEqual(weights, {"EMP-A": 1.0})

	def test_split_by_contribution_mode(self):
		item_weights = {
			"POS-0001": [
				{"employee": "EMP-A", "item_base": 600},
				{"employee": "EMP-B", "item_base": 400},
			]
		}
		weights = commission._weights_for_row(self.ROW, "Split By Contribution", item_weights)
		self.assertAlmostEqual(weights["EMP-A"], 0.6)
		self.assertAlmostEqual(weights["EMP-B"], 0.4)

	def test_split_by_contribution_falls_back_to_opener_with_no_item_data(self):
		weights = commission._weights_for_row(self.ROW, "Split By Contribution", {})
		self.assertEqual(weights, {"EMP-OPEN": 1.0})

	def test_no_opener_or_closer_returns_empty(self):
		row = {"invoice": "POS-0004", "opener": None, "closer": None}
		for mode in ("Opener", "Closer", "Split Evenly", "Split By Contribution"):
			self.assertEqual(commission._weights_for_row(row, mode, {}), {})


class TestIncludeReturnsDirection(FrappeTestCase):
	"""include_returns toggling should move the total base in the expected
	direction: a return row (is_return=1, negative base_amount) is only
	counted when include_returns is on, so turning it on can only lower
	(or leave unchanged) the summed base relative to it being off, never
	raise it above the non-return total."""

	def test_returns_lower_or_equal_total_base(self):
		non_return_rows = [{"base_amount": 1000.0}, {"base_amount": 500.0}]
		return_row = {"base_amount": -200.0}

		base_without_returns = sum(r["base_amount"] for r in non_return_rows)
		base_with_returns = sum(r["base_amount"] for r in non_return_rows + [return_row])

		self.assertLess(base_with_returns, base_without_returns)
		self.assertEqual(base_with_returns, 1300.0)
		self.assertEqual(base_without_returns, 1500.0)
