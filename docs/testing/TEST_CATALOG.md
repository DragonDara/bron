# Каталог тестов URY

Что есть в репозитории, что проверяет каждый тест и где пробелы.
Нижняя часть (между маркерами GENERATED) создаётся автоматически из самих тестов.

## Главные наблюдения (на 2026-10-23)

1. **52 backend-модуля не входят в CI** (список ниже), в том числе много тестов прав
   (`*_permissions`), `test_pos_pin`, `test_pos_billing`, `ury_pos.test_api_cashier_scoping`,
   `ury_pos.test_validate_pos_close`. На PR они не проверяются.
2. Большинство backend-тестов на **моках**. Сквозных сценариев на реальной базе мало:
   нет теста «заказ (`sync_order`) → оплата (`make_invoice`) → закрытие смены → отчёт».
3. Браузерные e2e (`e2e/`, Playwright) есть, но **не запускаются в CI**.
4. `packages/core/src/frappe/roles.test.ts` не тест Vitest, а самописный скрипт
   (`process.exit(1)` при ошибке), поэтому в итогах 0.
5. Тесты в стиле `it.each(...)` (например, `pos/src/components/OrderTypeSelect.test.tsx`)
   в итогах учитываются не полностью.

## Пробелы и план

- [ ] Добавить модули с CI ❌ в шарды `test.yml` (по одному, проверяя, что они зелёные)
- [ ] Сквозные e2e на реальной базе: полная смена, возвраты, отмены, многокассирный режим, права
- [ ] Решить, запускать ли Playwright в CI (отдельной необязательной задачей)

## Как запускать тесты

- Backend (на тестовом сайте, не на рабочем):
  `bench --site test_site run-tests --module <модуль>`
- Frontend: `cd pos && npx vitest run <файл>` (то же для `frontend/`, `self-order/`)
- Playwright: `cd e2e && URY_BASE_URL=http://<сайт> npx playwright test --project pos`

## Как обновить этот каталог

```bash
python3 scripts/generate_test_catalog.py
```

Перезаписывается только сгенерированная часть; текст сверху сохраняется.

## Легенда

| Метка | Значение |
|---|---|
| CI ✅ / CI ❌ | модуль есть / нет в `.github/workflows/test.yml`; модули с ❌ на PR **не запускаются** |
| моки | в файле есть `patch(...)` / `MagicMock`: часть кода подменена, база не трогается |
| реальная БД | в файле есть `.insert(` / `.submit()`: тест пишет в базу |
| от имени пользователя | есть `frappe.set_user(...)`: проверки идут не от Administrator |

Метки ставятся по тексту **всего файла**, это подсказка, а не гарантия для каждого теста.
Полные списки тестов свёрнуты: нажмите на название модуля, чтобы раскрыть.

<!-- BEGIN GENERATED -->
_Сгенерировано `scripts/generate_test_catalog.py`, не редактировать вручную._

## Итоги

| Набор | Файлов | Тестов |
|---|---:|---:|
| Backend (Python) | 170 (в CI: 118) | 2427 |
| Frontend `pos/` (Vitest) | 79 | 590 |
| Frontend `frontend/` (Vitest) | 139 | 930 |
| Frontend `self-order/` (Vitest) | 22 | 226 |
| Frontend `packages/core/` (Vitest) | 1 | 0 |
| Frontend `packages/ui/` (Vitest) | 6 | 47 |
| Frontend `mosaic/` (Vitest) | 0 | 0 |
| Браузерные e2e `e2e/` (Playwright) | 3 | 11 |

## Backend по папкам

| Папка | Модулей | Тестов | Не в CI |
|---|---:|---:|---:|
| `ury/ury/api` | 94 | 1629 | 33 |
| `ury/ury/doctype` | 38 | 397 | 4 |
| `ury/ury/report_api` | 11 | 99 | 2 |
| `ury/ury_pos` | 5 | 76 | 3 |
| `ury/ury/hooks` | 8 | 66 | 6 |
| `ury/ury/services` | 5 | 54 | 2 |
| `ury/ury/controllers` | 2 | 48 | 1 |
| `ury/ury/api/minimal` | 2 | 34 | 0 |
| `ury/ury/ai_tools` | 2 | 8 | 0 |
| `ury/patches/v3_20` | 1 | 7 | 1 |
| `ury/setup` | 1 | 7 | 0 |
| `ury/ury/dev_seed` | 1 | 2 | 0 |

## Backend-модули, которых нет в CI (52)

| Модуль | Тестов | Метки |
|---|---:|---|
| `ury.ury.doctype.ury_order.test_ury_order_billing` | 60 | моки |
| `ury.ury.api.test_self_ordering_session_endpoints` | 39 | моки, реальная БД, от имени пользователя |
| `ury.ury.doctype.ury_pos_shift_report.test_ury_pos_shift_report` | 29 | моки |
| `ury.ury.api.test_ury_stock_policy` | 27 | моки |
| `ury.ury.api.test_ury_production_plan_auto_work_order` | 26 | моки, реальная БД |
| `ury.ury.api.test_ury_production_target_compiler` | 26 | моки |
| `ury.ury.api.test_ury_production_plan_integration` | 25 | моки, реальная БД, от имени пользователя |
| `ury.ury.api.test_ury_prepare_production` | 24 | моки |
| `ury.ury.api.test_ury_order_attribution` | 23 | моки |
| `ury.ury.api.test_ury_pos_invoice_qty_reduction` | 23 | моки |
| `ury.ury.doctype.ury_order.test_ury_order_sync_validation` | 23 | моки |
| `ury.ury.api.test_ury_production_transfer` | 19 | моки |
| `ury.ury.api.test_search_branch_items` | 18 | моки |
| `ury.ury.api.test_ury_bom_tree` | 17 | моки |
| `ury.ury.api.test_ury_kot_cancellation_disposition` | 17 | моки |
| `ury.ury.api.test_ury_sales_plan_production_plan` | 17 | моки |
| `ury.ury.api.test_ury_production_plan_material_request` | 16 | моки |
| `ury.ury.api.test_pos_billing` | 15 | моки |
| `ury.ury.api.test_pos_pin` | 15 | моки |
| `ury.ury.api.test_ury_production_readiness` | 15 | моки, реальная БД |
| `ury.ury_pos.test_api_cashier_scoping` | 15 | моки |
| `ury.ury.hooks.test_ury_pos_closing_reconciliation` | 13 | моки |
| `ury.ury.report_api.test_shift_invoices` | 13 | моки, реальная БД, от имени пользователя |
| `ury.ury.controllers.test_serve_pwa` | 12 | моки |
| `ury.ury.hooks.test_ury_customer` | 12 | моки |
| `ury.ury.api.test_ury_customer_pricing` | 8 | моки |
| `ury.patches.v3_20.test_migrate_stock_authority_flag_to_branch_policy` | 7 | моки |
| `ury.ury.api.test_ury_kot_execution_service_permissions` | 7 | моки |
| `ury.ury.api.test_ury_manufacture_enforcement` | 7 | моки |
| `ury.ury.api.test_ury_production_plan_cancel_hooks` | 7 | моки |
| `ury.ury.api.test_ury_workflow` | 7 | реальная БД, от имени пользователя |
| `ury.ury.api.test_ury_kot_cancellation_service_permissions` | 6 | моки |
| `ury.ury.api.test_ury_kot_item_execution_service_permissions` | 6 | моки |
| `ury.ury.hooks.test_ury_pos_closing_entry` | 6 | моки |
| `ury.ury_pos.test_validate_pos_close` | 6 | моки |
| `ury.ury.api.test_cart_billing_quote` | 5 | моки, от имени пользователя |
| `ury.ury.api.test_ury_production_settings` | 4 | от имени пользователя |
| `ury.ury.api.test_ury_stock_authority_shadow_report` | 4 | моки, реальная БД, от имени пользователя |
| `ury.ury.hooks.test_ury_pos_invoice` | 4 | моки |
| `ury.ury.hooks.test_ury_sales_invoice_returns` | 4 | моки |
| `ury.ury.services.test_currency` | 4 | моки |
| `ury.ury.services.test_yield_branch_scope` | 4 | моки |
| `ury.ury_pos.test_create_pos_opening_entry_permissions` | 4 | моки |
| `ury.ury.api.test_ury_kot_chef_filter_permissions` | 3 | реальная БД, от имени пользователя |
| `ury.ury.api.test_ury_sales_plan_auto_production_plan` | 3 | моки, от имени пользователя |
| `ury.ury.api.test_ury_server_time` | 3 | реальная БД, от имени пользователя |
| `ury.ury.hooks.test_ury_pos_invoice_price_list` | 3 | моки |
| `ury.ury.api.test_ury_kot_notification_permissions` | 2 | реальная БД, от имени пользователя |
| `ury.ury.report_api.test_waiter_service` | 2 | моки |
| `ury.ury.api.test_ury_kot_generate_permissions` | 1 | реальная БД, от имени пользователя |
| `ury.ury.api.test_ury_kot_mto_coexistence` | 1 | моки |
| `ury.ury.doctype.ury_stock_reservation.test_ury_stock_reservation` | 0 |  |

## Все backend-модули

### `ury/patches/v3_20`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_migrate_stock_authority_flag_to_branch_policy` | 7 | ❌ | моки |

<details>
<summary><code>ury.patches.v3_20.test_migrate_stock_authority_flag_to_branch_policy</code> (7)</summary>

> T2 tests for the v3_20 migration patch that seeds `URY Branch Stock Policy` rows from the retired site-wide `pos_stock_authority_v2` flag. Follows the mock-based pattern from `ury.ury.api.test_ury_stock_policy` (no live site/DB needed): every `frappe.db.*` call the patch makes is mocked, so these tests assert the patch's *decision logic* (when it creates rows, with which values, and when it does …

- **TestMigrateStockAuthorityFlagToBranchPolicy**
  - `test_flag_on_migrates_every_branch`
  - `test_flag_off_is_noop`
  - `test_running_twice_is_idempotent`
  - `test_fresh_install_no_old_doctype_is_noop`
  - `test_old_doctype_present_but_field_missing_is_noop`
  - `test_new_doctype_table_missing_is_noop`
  - `test_get_single_value_error_fails_closed`

</details>

### `ury/setup`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_setup_wizard` | 7 | ✅ | моки |

<details>
<summary><code>ury.setup.test_setup_wizard</code> (7)</summary>

- **TestUrySetupStages**
  - `test_empty_without_demo_flag`
  - `test_three_sync_stages_when_demo_requested`
  - `test_accepts_boolean_true`
- **TestNormalizeSetupPayload**
  - `test_forwards_ury_demo_and_omits_erpnext_demo`
  - `test_demo_off_by_default`
- **TestGetSetupProgressSteps**
  - `test_includes_erpnext_then_ury_when_demo_on`
- **TestSubmitSetupPayload**
  - `test_submit_setup_passes_ury_demo_not_erpnext_demo`

</details>

### `ury/ury/ai_tools`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_agent_seeding` | 5 | ✅ | моки, от имени пользователя |
| `test_ury_tools` | 3 | ✅ |  |

<details>
<summary><code>ury.ury.ai_tools.test_agent_seeding</code> (5)</summary>

- **TestAgentSeedingHuf**: Exercises the doctype-touching seeding paths. These require `huf`'s "Agent" / "Agent Tool Function" doctypes to actually be installed on the test site; if huf isn't installed here, skip rather than f…
  - `test_create_ury_dashboard_agent_is_idempotent`
  - `test_seeds_disabled_with_valid_provider_when_nothing_configured`
  - `test_attach_ury_tools_does_not_duplicate_rows`
- **TestAgentSeedingHufNotInstalledGuard**: Tests the guard clause itself (`"huf" not in frappe.get_installed_apps()`) by mocking frappe.get_installed_apps() to simulate huf being absent, regardless of what's actually installed on this test si…
  - `test_after_migrate_returns_early_without_huf`
  - `test_on_ai_provider_update_returns_early_without_huf`

</details>

<details>
<summary><code>ury.ury.ai_tools.test_ury_tools</code> (3)</summary>

- **TestURYToolsSurface**: Static/allowlist-style checks that every function registered in `ury.ury.ai_tools.ury_tools` is read-only in spirit: exactly the expected tool names are whitelisted, and no function in the module's s…
  - `test_whitelisted_functions_match_expected_allowlist`
  - `test_module_source_contains_no_mutating_calls`
  - `test_each_expected_tool_function_is_get_only_and_calls_require_manager`

</details>

### `ury/ury/api`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_button_permission` | 16 | ✅ | моки, реальная БД, от имени пользователя |
| `test_cart_billing_quote` | 5 | ❌ | моки, от имени пользователя |
| `test_dashboard` | 32 | ✅ | моки |
| `test_payment_terminal` | 13 | ✅ | моки |
| `test_pos_billing` | 15 | ❌ | моки |
| `test_pos_extend` | 31 | ✅ | моки, от имени пользователя |
| `test_pos_pin` | 15 | ❌ | моки |
| `test_search_branch_items` | 18 | ❌ | моки |
| `test_seed_v3_demo` | 10 | ✅ |  |
| `test_self_ordering` | 33 | ✅ | моки |
| `test_self_ordering_session_endpoints` | 39 | ❌ | моки, реальная БД, от имени пользователя |
| `test_service_requests` | 21 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_ai_settings` | 11 | ✅ | от имени пользователя |
| `test_ury_availability` | 33 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_batch_manufacture_service` | 17 | ✅ | моки |
| `test_ury_batch_work_order_adapter` | 15 | ✅ | моки, реальная БД |
| `test_ury_bom_compiler` | 20 | ✅ | моки |
| `test_ury_bom_staleness` | 15 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_bom_tree` | 17 | ❌ | моки |
| `test_ury_branch_operational_state` | 11 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_chat` | 31 | ✅ | моки, от имени пользователя |
| `test_ury_comparable_weekday_history` | 9 | ✅ | моки |
| `test_ury_cost_variance_attribution` | 17 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_customer_pricing` | 8 | ❌ | моки |
| `test_ury_dashboard` | 23 | ✅ | моки |
| `test_ury_department_profitability` | 21 | ✅ | моки |
| `test_ury_desk_link` | 29 | ✅ | моки |
| `test_ury_fast_moving` | 20 | ✅ | моки |
| `test_ury_feature_flags` | 24 | ✅ | моки |
| `test_ury_fulfilment_posting_service` | 32 | ✅ | моки |
| `test_ury_insight` | 27 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_insight_rules` | 26 | ✅ | моки, реальная БД |
| `test_ury_inventory_projection` | 9 | ✅ | моки |
| `test_ury_issue_authorization` | 16 | ✅ | моки |
| `test_ury_job_card_controls` | 22 | ✅ | моки, реальная БД |
| `test_ury_kot_cancellation_disposition` | 17 | ❌ | моки |
| `test_ury_kot_cancellation_service` | 10 | ✅ | моки |
| `test_ury_kot_cancellation_service_permissions` | 6 | ❌ | моки |
| `test_ury_kot_chef_filter` | 6 | ✅ | моки |
| `test_ury_kot_chef_filter_permissions` | 3 | ❌ | реальная БД, от имени пользователя |
| `test_ury_kot_display` | 10 | ✅ | моки |
| `test_ury_kot_display_serve_and_list` | 10 | ✅ | моки |
| `test_ury_kot_execution_service` | 11 | ✅ | моки |
| `test_ury_kot_execution_service_permissions` | 7 | ❌ | моки |
| `test_ury_kot_generate` | 37 | ✅ | моки |
| `test_ury_kot_generate_permissions` | 1 | ❌ | реальная БД, от имени пользователя |
| `test_ury_kot_item_execution_service` | 17 | ✅ | моки |
| `test_ury_kot_item_execution_service_permissions` | 6 | ❌ | моки |
| `test_ury_kot_mto_coexistence` | 1 | ❌ | моки |
| `test_ury_kot_notification` | 3 | ✅ | реальная БД, от имени пользователя |
| `test_ury_kot_notification_permissions` | 2 | ❌ | реальная БД, от имени пользователя |
| `test_ury_kot_order_number` | 10 | ✅ | моки |
| `test_ury_kot_reprint` | 4 | ✅ | моки |
| `test_ury_kot_routing` | 11 | ✅ | моки |
| `test_ury_kot_validation` | 20 | ✅ | моки, от имени пользователя |
| `test_ury_manufacture_enforcement` | 7 | ❌ | моки |
| `test_ury_menu_course_validation` | 13 | ✅ | моки, реальная БД |
| `test_ury_mto_fulfilment_service` | 11 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_mto_work_order_service` | 14 | ✅ | моки |
| `test_ury_order_attribution` | 23 | ❌ | моки |
| `test_ury_order_reservation_service` | 20 | ✅ |  |
| `test_ury_pos_invoice_qty_reduction` | 23 | ❌ | моки |
| `test_ury_prepare_production` | 24 | ❌ | моки |
| `test_ury_preproduced_fulfilment_service` | 11 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_print` | 26 | ✅ | моки |
| `test_ury_production_context` | 8 | ✅ | моки |
| `test_ury_production_plan_adapter` | 17 | ✅ | моки |
| `test_ury_production_plan_auto_work_order` | 26 | ❌ | моки, реальная БД |
| `test_ury_production_plan_cancel_hooks` | 7 | ❌ | моки |
| `test_ury_production_plan_integration` | 25 | ❌ | моки, реальная БД, от имени пользователя |
| `test_ury_production_plan_material_request` | 16 | ❌ | моки |
| `test_ury_production_readiness` | 15 | ❌ | моки, реальная БД |
| `test_ury_production_settings` | 4 | ❌ | от имени пользователя |
| `test_ury_production_target_compiler` | 26 | ❌ | моки |
| `test_ury_production_transfer` | 19 | ❌ | моки |
| `test_ury_production_validation` | 26 | ✅ | моки |
| `test_ury_requirements_stock` | 14 | ✅ | моки, от имени пользователя |
| `test_ury_reservation_service` | 48 | ✅ | моки, от имени пользователя |
| `test_ury_reservation_service_expiry` | 4 | ✅ | моки |
| `test_ury_sales_plan` | 72 | ✅ | моки, реальная БД, от имени пользователя |
| `test_ury_sales_plan_auto_production_plan` | 3 | ❌ | моки, от имени пользователя |
| `test_ury_sales_plan_commit` | 13 | ✅ |  |
| `test_ury_sales_plan_production_plan` | 17 | ❌ | моки |
| `test_ury_server_time` | 3 | ❌ | реальная БД, от имени пользователя |
| `test_ury_service_line` | 14 | ✅ | моки, от имени пользователя |
| `test_ury_stock_authority_shadow_report` | 4 | ❌ | моки, реальная БД, от имени пользователя |
| `test_ury_stock_policy` | 27 | ❌ | моки |
| `test_ury_stock_service` | 22 | ✅ | моки |
| `test_ury_waiter_print` | 18 | ✅ | моки |
| `test_ury_wastage` | 17 | ✅ | моки |
| `test_ury_work_order_hooks` | 39 | ✅ | моки |
| `test_ury_workflow` | 7 | ❌ | реальная БД, от имени пользователя |
| `test_ury_workstation_mapping` | 11 | ✅ | моки |
| `test_ury_yield_variance` | 42 | ✅ | моки, реальная БД, от имени пользователя |

<details>
<summary><code>ury.ury.api.test_button_permission</code> (16)</summary>

> Unit tests for button_permission API module. Tests the cancel_check() function which determines whether the current user has permission to cancel a POS Invoice.

- **TestCancelCheckPermission**: Test cancel_check() permission verification.
  - `test_returns_true_when_user_has_cancel_permission`: When user has POS Invoice cancel permission, returns True.
  - `test_returns_false_when_user_lacks_cancel_permission`: When user does not have POS Invoice cancel permission, returns False.
  - `test_uses_raise_exception_false_flag`: Permission check uses raise_exception=False to avoid exceptions.
  - `test_permission_check_targets_pos_invoice_doctype`: Permission check is specifically for POS Invoice doctype.
  - `test_permission_check_targets_cancel_action`: Permission check is specifically for cancel action.
  - `test_handles_permission_check_with_zero_value`: When permission check returns 0, treats as False.
  - `test_handles_permission_check_with_truthy_values`: When permission check returns truthy value, treats as True.
  - `test_permission_check_only_called_once`: Permission is checked exactly once per call.
  - `test_returns_boolean_not_raw_permission_result`: Return value is always a boolean (True/False), not raw permission value.
  - `test_catches_unexpected_exception_from_permission_check`: Function handles exception from permission check gracefully. Even though raise_exception=False is passed, the function should be defensive against unexpected exceptions in the permission layer.
  - `test_idempotent_calls_return_same_result`: Multiple calls with same permission state return consistent results.
- **TestCancelCheckEdgeCases**: Test edge cases and boundary conditions.
  - `test_permission_check_with_none_result`: When permission check returns None, treats as falsy.
  - `test_permission_check_with_empty_string_result`: When permission check returns empty string, treats as falsy.
  - `test_no_additional_side_effects_on_permission_check`: Function does not trigger side effects beyond permission check.
- **TestCancelCheckRealPermissionBoundary**: Real (non-mocked) coverage of cancel_check()'s has_permission() call. Every test above patches frappe.permissions.has_permission itself, so the actual POS Invoice 'cancel' permission-role lookup has …
  - `test_roleless_user_denied_cancel_permission_for_real`
  - `test_administrator_has_cancel_permission_for_real`

</details>

<details>
<summary><code>ury.ury.api.test_cart_billing_quote</code> (5)</summary>

> The register quote uses server prices and never writes an invoice.

- **TestCartBillingQuote**
  - `test_non_administrator_quote_uses_server_price_and_includes_service`
  - `test_non_administrator_cannot_quote_another_branch_profile`
  - `test_disabled_performer_selection_can_quote_without_linked_employee`
  - `test_non_administrator_cannot_quote_another_branch_table`
  - `test_non_finite_quantity_is_rejected`

</details>

<details>
<summary><code>ury.ury.api.test_dashboard</code> (32)</summary>

> Unit tests for ury/ury/api/dashboard.py Tests cover: - get_dashboard_summary: summary stats with and without branch filtering - get_dashboard_charts: chart data endpoint - get_recent_transactions: transaction retrieval with error handling - get_module_records: generic record fetching with branch/doctype validation

- **TestGetDashboardSummary**: Test get_dashboard_summary endpoint.
  - `test_summary_returns_required_fields`: Dashboard summary response includes all required metric fields.
  - `test_summary_counts_ury_table_doctype`: Summary falls back to URY Table count when stats omit total_tables.
  - `test_summary_handles_missing_ury_table_doctype`: Summary returns 0 for table count when URY Table DocType doesn't exist.
  - `test_summary_handles_missing_item_doctype`: Summary returns 0 for item count when Item DocType doesn't exist.
  - `test_summary_counts_active_users`: Summary counts enabled User records.
  - `test_summary_with_branch_parameter_accepted`: Summary forwards branch to get_dashboard_stats.
  - `test_summary_with_all_branch_parameter`: Summary treats branch='all' as unscoped stats.
- **TestGetDashboardCharts**: Test get_dashboard_charts endpoint.
  - `test_charts_returns_all_chart_types`: Charts endpoint returns all required chart data structures.
  - `test_charts_returns_list_values`: Each chart type is initialized as an empty list.
  - `test_charts_with_branch_parameter_accepted`: Charts endpoint accepts optional branch parameter.
  - `test_charts_with_all_branch_parameter`: Charts endpoint handles branch='all'.
- **TestGetRecentTransactions**: Test get_recent_transactions endpoint.
  - `test_transactions_retrieves_pos_invoices`: Transactions endpoint fetches POS Invoice records.
  - `test_transactions_applies_default_limit`: Transactions endpoint applies default limit=10.
  - `test_transactions_respects_custom_limit`: Transactions endpoint respects custom limit parameter.
  - `test_transactions_converts_limit_to_int`: Transactions endpoint converts limit to integer.
  - `test_transactions_sets_default_status_when_missing`: Transactions endpoint sets default status if not present.
  - `test_transactions_sets_default_status_paid_for_submitted`: Transactions sets status='Paid' for submitted (docstatus=1) invoices.
  - `test_transactions_sets_default_order_type_when_missing`: Transactions sets default order_type if not present.
  - `test_transactions_returns_empty_list_when_pos_invoice_missing`: Transactions returns empty list when POS Invoice DocType doesn't exist.
  - `test_transactions_handles_exception_gracefully`: Transactions catches exceptions and returns empty list.
  - `test_transactions_filters_by_docstatus`: Transactions filters for draft (0) and submitted (1) invoices.
  - `test_transactions_orders_by_creation_desc`: Transactions orders results by creation descending.
  - `test_transactions_with_branch_parameter_accepted`: Transactions filters POS Invoice by branch when provided.
- **TestGetModuleRecords**: Test get_module_records endpoint.
  - `test_module_records_returns_all_records_for_doctype`: Module records fetches all records for a given DocType.
  - `test_module_records_returns_empty_when_doctype_missing`: Module records returns empty list when DocType doesn't exist.
  - `test_module_records_handles_exception_gracefully`: Module records catches exceptions and returns empty list.
  - `test_module_records_filters_by_branch_field`: Module records filters by 'branch' field when available.
  - `test_module_records_filters_by_custom_branch_field`: Module records falls back to 'custom_branch' field when 'branch' unavailable.
  - `test_module_records_no_filter_when_branch_field_missing`: Module records doesn't filter branch when field doesn't exist on DocType.
  - `test_module_records_ignores_all_branch_value`: Module records doesn't filter when branch='all' (passes through).
  - `test_module_records_requests_all_fields`: Module records fetches all fields ('*').
  - `test_module_records_with_no_branch_parameter`: Module records works without branch parameter.

</details>

<details>
<summary><code>ury.ury.api.test_payment_terminal</code> (13)</summary>

> Tests for payment_terminal.py's provider registration/switching logic (COVERAGE_GAP_ANALYSIS.md Table 1: `register_simulated_terminal_provider`, "HIGH -- cashier/payment reconciliation", had zero test reference; the `ury_payment_terminal` / `ury_payment_terminal_transaction` doctypes are also empty stubs -- Top 15 item #9). Scope: this module is explicitly documented (see its module docstring) as…

- **TestProviderRegistration**
  - `test_default_provider_is_noop`
  - `test_register_simulated_terminal_provider_switches_active_provider`
  - `test_register_payment_terminal_provider_rejects_non_provider`
  - `test_register_payment_terminal_provider_accepts_valid_subclass`
- **TestNoOpProvider**
  - `test_start_transaction_throws_honest_error`
  - `test_get_transaction_status_throws`
  - `test_cancel_transaction_throws`
- **TestSimulatedProviderStartTransaction**
  - `test_start_transaction_creates_approved_transaction`
  - `test_start_transaction_skips_terminal_update_when_no_terminal_found`
- **TestSimulatedProviderGetAndCancelTransaction**
  - `test_get_transaction_status_returns_status`
  - `test_get_transaction_status_raises_for_unknown_transaction`
  - `test_cancel_transaction_marks_cancelled`
  - `test_cancel_transaction_raises_for_unknown_transaction`

</details>

<details>
<summary><code>ury.ury.api.test_pos_billing</code> (15)</summary>

> Billing invariants around server-owned service and staff adjustments.

- **TestServiceCharge**
  - `test_disabled_profile_keeps_total_unchanged`
  - `test_dine_in_charge_is_after_manual_discount_and_idempotent`
  - `test_configured_percentage_is_applied_to_discounted_pre_tax_net`
  - `test_configured_dine_in_only_type_must_match_order_type`
  - `test_charge_requires_waiter_in_branch`
  - `test_disabled_performer_selection_allows_unassigned_charge_on_save_and_settlement`
  - `test_disabled_performer_selection_still_rejects_wrong_branch_employee`
  - `test_takeaway_has_no_service_charge`
  - `test_direct_manual_amount_without_authorised_percentage_is_rejected`
- **TestStaffPolicy**
  - `test_policy_context_uses_invoice_cashier_and_documents`
  - `test_fixed_discount_only_reduces_eligible_items_and_obeys_cap`
  - `test_period_limit_is_checked_after_policy_row_lock`
- **TestBillingQuote**
  - `test_merged_quote_includes_both_bills_and_their_service_charges`
- **TestERPNextCalculator**
  - `test_receipt_shows_policy_and_tax_exempt_service_charge`
  - `test_full_policy_discount_survives_native_recalculation`

</details>

<details>
<summary><code>ury.ury.api.test_pos_extend</code> (31)</summary>

> Tests for pos_extend API module. Tests for validate_search_input and overrided_past_order_list functions, covering validation logic, filtering, and branch/user isolation.

- **TestValidateSearchInput**: Tests for validate_search_input function.
  - `test_empty_search_term_returns_empty_string`: Empty search term should return empty string.
  - `test_none_search_term_returns_empty_string`: None search term should return empty string.
  - `test_valid_alphanumeric_search_term`: Valid alphanumeric search term should be returned unchanged.
  - `test_search_term_with_spaces`: Search term with spaces should be accepted.
  - `test_search_term_with_hyphens`: Search term with hyphens should be accepted.
  - `test_search_term_with_underscore`: Search term with underscore should be accepted.
  - `test_search_term_with_at_symbol`: Search term with @ symbol should be accepted.
  - `test_search_term_with_dot`: Search term with dot should be accepted.
  - `test_search_term_exceeding_max_length`: Search term exceeding 100 characters should throw.
  - `test_search_term_exactly_at_max_length`: Search term exactly 100 characters should be accepted.
  - `test_search_term_with_invalid_special_characters`: Search term with invalid special characters should throw.
  - `test_search_term_with_exclamation_mark_throws`: Search term with exclamation mark should throw.
  - `test_search_term_with_hashtag_throws`: Search term with hashtag should throw.
  - `test_search_term_with_bracket_throws`: Search term with bracket should throw.
- **TestOverridedPastOrderListValidation**: Tests for validate_search_input integration in overrided_past_order_list.
  - `test_invalid_search_term_throws_before_db_query`: Invalid search term should throw before any database query.
  - `test_long_search_term_throws_before_db_query`: Search term exceeding length limit should throw before database query.
- **TestOverridedPastOrderListNonAdminUser**: Tests for non-Administrator user scenarios.
  - `test_non_admin_user_not_associated_with_branch_throws`: Non-admin user without branch association should throw.
  - `test_non_admin_user_with_valid_branch_queries_db`: Non-admin user with valid branch should proceed with filtered query.
  - `test_non_admin_to_bill_status_filters_correct_invoices`: Non-admin user with 'To Bill' status should filter to Draft invoices with table and no print.
  - `test_non_admin_other_status_filters_correct_invoices`: Non-admin user with non-'To Bill' status should filter invoices without table or with print.
- **TestOverridedPastOrderListAdminUser**: Tests for Administrator user scenarios.
  - `test_admin_to_bill_status_no_branch_filter`: Administrator with 'To Bill' status should see all Draft invoices with table and no print.
  - `test_admin_other_status_no_branch_filter`: Administrator with non-'To Bill' status should see all matching invoices without table or with print.
- **TestOverridedPastOrderListSearchFunctionality**: Tests for search term and status combined filtering.
  - `test_search_term_and_status_searches_by_customer_and_name`: Search with term and status should search both customer and invoice name.
  - `test_search_returns_combined_results_from_customer_and_name_queries`: Search results from customer and name queries should be combined.
  - `test_empty_search_with_status_only_no_search_query`: Empty search term with status should not call search queries.
- **TestOverridedPastOrderListFields**: Tests for correct fields being queried.
  - `test_queries_correct_fields`: Function should query the correct set of fields.
- **TestOverridedPastOrderListEdgeCases**: Tests for edge cases and error scenarios.
  - `test_multiple_invoices_with_mixed_conditions`: Test with multiple invoices having mixed table/print conditions.
  - `test_with_limit_parameter`: Function should accept and pass limit parameter (if implemented).
  - `test_valid_search_special_chars_like_hyphen`: Search term with hyphen should work (valid character).
  - `test_search_with_spaces`: Search term with spaces should work.
- **TestOverridedPastOrderListBranchIsolation**: Tests to ensure branch isolation for non-admin users.
  - `test_non_admin_user_only_sees_own_branch_invoices`: Non-admin user should only see invoices from their assigned branch.

</details>

<details>
<summary><code>ury.ury.api.test_pos_pin</code> (15)</summary>

- **TestPOSPinStatus**
  - `test_status_requires_enrollment_when_no_terminal`
  - `test_status_offers_keypad_on_enrolled_terminal`
- **TestPOSPinLogin**
  - `test_pin_lookup_checks_hashes_until_it_finds_a_match`
  - `test_login_without_enrolled_terminal_is_rejected`
  - `test_invalid_format_is_rejected_before_hash_lookup`
  - `test_locked_terminal_is_rejected_before_hash_lookup`
  - `test_successful_login_creates_session_and_clears_lock`
  - `test_authenticated_user_cannot_switch_without_logout`
- **TestPOSPinLockout**
  - `test_repeated_failures_lock_the_terminal`
  - `test_clear_removes_lock_state`
- **TestTerminalEnrollment**
  - `test_enroll_rejects_unknown_terminal`
  - `test_enroll_with_valid_code_issues_credential_and_cookie`
  - `test_enroll_rejects_bad_code`
- **TestPOSPinSettingsValidation**
  - `test_pin_format_accepts_four_to_six_digits`
  - `test_pin_format_rejects_short_long_and_non_numeric_values`

</details>

<details>
<summary><code>ury.ury.api.test_search_branch_items</code> (18)</summary>

- **TestSearchBranchItems**
  - `test_matching_role_in_branch_gets_results`: Test that a valid in-branch user gets results.
  - `test_out_of_branch_user_without_cross_branch_access_rejected`: Test that users from another branch are rejected unless they have cross-branch access.
  - `test_query_string_uses_or_filters_not_pipe_syntax`: Regression test for bug 1: a non-empty query must be passed via the real `or_filters=` kwarg, never as an invalid "|item_code|item_name" dict filter key (which is not valid Frappe filter syntax and 5…
  - `test_disabled_items_are_excluded`: Test that disabled items are excluded from results.
  - `test_limit_is_capped_at_100`: Test that the limit parameter is capped at 100 to prevent abuse.
  - `test_limit_non_numeric_falls_back_to_default`: Regression test for bug 3: a non-numeric limit must not raise ValueError; it should fall back to the default of 25.
  - `test_limit_negative_clamped_to_floor`: Regression test for bug 3: a negative limit must be clamped to a floor of 1, not passed through as-is or produce an empty page size.
  - `test_production_config_attached_to_results`: Test that department/production_unit from URY Item Production Configuration are attached.
  - `test_production_config_fallback_to_none`: Test that missing production_unit/department fall back to None.
  - `test_results_ordered_by_item_name`: Test that results are ordered by item_name.
  - `test_missing_branch_fails_closed`: Test that missing branch parameter is rejected.
  - `test_permission_denial_fails_before_query`: Test that permission denial fails before querying items.
  - `test_company_mismatch_fails_before_query`: Test that company mismatch fails before querying items.
  - `test_empty_query_string_returns_all_non_disabled_items`: Test that an empty query string returns all non-disabled items.
  - `test_uses_ignore_permissions_for_item_query`: Test that the Item query uses ignore_permissions=True.
  - `test_production_config_query_scoped_to_branch`: Test that the production config query (which now drives the allowed item-code set) filters by branch.
  - `test_no_branch_leakage_when_branch_has_no_configured_items`: Regression test for bug 2: if a branch has no URY Item Production Configuration rows, the endpoint must return an empty list rather than falling through to a site-wide Item query (which would leak th…
  - `test_item_query_scoped_to_branch_configured_item_codes`: Regression test for bug 2: the Item query must restrict item_code to the set of items configured for this specific branch, not the whole site catalog.

</details>

<details>
<summary><code>ury.ury.api.test_seed_v3_demo</code> (10)</summary>

> Tests for the URY V3 demo-data seeder (seed_v3_demo module). These tests verify that the seed_v3_demo module's run() function: 1. Is callable and can be executed 2. Creates expected records when prerequisites exist 3. Is idempotent (does not duplicate records on subsequent runs) 4. Handles missing prerequisites gracefully Tests will pass or skip based on whether the required entities (URY company…

- **TestSeedV3Demo**
  - `test_module_imports_successfully`: The seed_v3_demo module should import without errors.
  - `test_run_function_is_callable`: The run() function should be callable.
  - `test_run_completes_or_reports_missing_prerequisites`: The run() function should complete or clearly report missing prerequisites.
  - `test_departments_created_or_skipped`: After run(), departments should exist or none should be created.
  - `test_item_configurations_created_or_empty`: Item configurations should be created or count should be unchanged.
  - `test_sales_plan_created_or_unchanged`: Sales plan for today should be created or unchanged.
  - `test_seed_is_idempotent_when_possible`: Calling run() multiple times should not duplicate records.
  - `test_departments_when_created_are_enabled`: If departments are created, they should be enabled.
  - `test_sales_plan_status_when_created`: If a sales plan is created, it should be Draft status.
  - `test_sales_plan_has_items_when_created`: If a sales plan is created, it should have items.

</details>

<details>
<summary><code>ury.ury.api.test_self_ordering</code> (33)</summary>

- **TestQRTokenRoundtrip**
  - `test_verify_qr_token_valid_table_token`
  - `test_verify_qr_token_cross_branch_table_rejected`: A correctly-signed token whose table belongs to a DIFFERENT branch than the profile's own branch must still be rejected -- this is the exact live-verified U11 bypass (a leaked/forged token for the wr…
  - `test_verify_qr_token_bad_signature_rejected`
  - `test_verify_qr_token_malformed_rejected`
- **TestAddCustomerItemsAppendOnly**: The core Phase 3 safety guarantee: add_customer_items() only ever appends new rows and re-derives price server-side — it must never trust a client-supplied rate/tax/cost-center, and must never replac…
  - `test_add_customer_items_appends_without_clearing_existing`
  - `test_add_customer_items_skips_reconciliation_when_reservation_control_disabled`: T3: Tier 1 (or any branch with reservation_control_enabled=False) must skip reconcile_order_reservations() entirely from the self-ordering call site too -- no reservation row, no side effects.
  - `test_add_customer_items_skips_reconciliation_for_branch_with_no_policy_row`: A branch with no `URY Branch Stock Policy` row resolves to POLICY_ALL_OFF (T1 fail-closed default) -- must behave identically to the explicit-OFF case above.
  - `test_add_customer_items_sets_restaurant_table_on_new_invoice`: _resolve_or_create_pos_invoice() never sets restaurant_table on a brand-new invoice (that's the caller's job, same as sync_order() does it). Without add_customer_items() also doing it, a SECOND call …
  - `test_add_customer_items_aggregates_past_item_for_repeated_item_code`: Live-testing finding: add_customer_items() always appends a NEW row rather than merging into an existing same-item_code row, so an invoice routinely ends up with MULTIPLE separate rows for the same i…
  - `test_add_customer_items_kot_failure_raises_instead_of_swallowing`: Same class of bug as sa-post-373-review-fixes Blocker 2 in sync_order(): add_customer_items() saved the invoice, then called kot_execute() inside a bare try/except that only logged the exception via …
  - `test_add_customer_items_calls_reservation_gate_for_available_item`: The critical gap this covers: add_customer_items() must route through the SAME reconcile_order_reservations() gate sync_order() uses (ury_order.py ~L1644), so a self-order can never silently bypass t…
  - `test_add_customer_items_rejects_unavailable_item_before_save_and_kot`: An item that is on the menu (menu resolution doesn't know about production/stock state) but unavailable per the reservation gate (PLAN_EXHAUSTED/FG_OUT_OF_STOCK/etc.) must be rejected with a clean cu…
  - `test_add_customer_items_rejects_item_not_on_menu`
  - `test_add_customer_items_rejects_when_running_table_addition_disabled`
  - `test_add_customer_items_rejects_joining_pre_existing_table_order`: session.invoice is None on a session's first call even when the table already has an open invoice from staff or another session — allow_add_to_running_table=False must still block that join, not just…
  - `test_add_customer_items_first_call_proceeds_when_table_free`: Same disabled-flag config, but no pre-existing invoice on the table — the new guard must not block a session's own first order.
- **TestRequestBill**
  - `test_request_bill_creates_service_request`
  - `test_request_bill_idempotent_when_already_open`
- **TestCreatePaymentRequest**
  - `test_create_payment_request_never_trusts_client_amount`: The whitelisted signature is create_payment_request(session) -- there is no amount/currency parameter at all, so a client literally cannot influence what gets charged; make_payment_request() derives …
  - `test_create_payment_request_rejects_when_payment_disabled`
  - `test_create_payment_request_rejects_already_settled_invoice`
  - `test_create_payment_request_survives_missing_gateway`: No Payment Gateway Account configured -> get_payment_url() raises. The Payment Request itself must still be returned (real, valid, just without a link) rather than the whole call failing.
  - `test_create_payment_request_reports_unconfigured_gateway_clearly`: Live-testing finding (two parts): for dt="POS Invoice", ERPNext's get_amount() only recognizes payments rows with type="Phone" matching a configured gateway account -- with none configured (true on a…
- **TestSharePaymentLink**
  - `test_share_payment_link_calls_registered_provider`
  - `test_share_payment_link_rejects_empty_recipient`
- **TestAssignDeviceTable**: assign_device_table(): staff-PIN-authorized table binding for a shared/portable tablet (table_mode="Selectable"). Reuses _resolve_device and _open_session rather than reimplementing device/session ha…
  - `test_assign_device_table_valid_pin_opens_session`
  - `test_assign_device_table_wrong_pin_rejected`
  - `test_assign_device_table_rejects_non_selectable_device`
  - `test_assign_device_table_rejects_unknown_table`
- **TestQRPickup**: QR Pickup mode: no table, but the rest of the ordering flow (add_customer_items, get_customer_order) must work exactly as it does for a table session, and the response must carry a pickup reference.
  - `test_verify_qr_token_pickup_resolves_no_table`
  - `test_add_customer_items_works_without_table_for_pickup`
  - `test_get_customer_order_pickup_code_present_before_order`
- **TestGetPaymentStatus**
  - `test_get_payment_status_no_invoice`

</details>

<details>
<summary><code>ury.ury.api.test_self_ordering_session_endpoints</code> (39)</summary>

- **TestGetOrderingContext**
  - `test_qr_table_token_opens_a_real_active_session`
  - `test_capabilities_reflect_profile_flags`
  - `test_pickup_token_opens_a_tableless_session`
  - `test_no_token_and_no_device_credentials_rejected`
  - `test_device_id_without_credential_rejected`
  - `test_garbage_token_rejected`
  - `test_tampered_signature_rejected`
  - `test_token_signed_with_another_restaurants_secret_rejected`: Cross-restaurant misuse: branch B's secret cannot authorize a branch A profile/table pair.
  - `test_cross_branch_table_token_rejected`: A *correctly signed* profile-A token naming branch B's table must still be rejected by `_verify_qr_token`'s own branch-membership re-check — the defense that does not depend on whoever minted it.
  - `test_nonexistent_table_token_rejected`
  - `test_disabled_profile_rejected`
  - `test_table_ordering_disabled_rejects_table_token`
  - `test_pickup_ordering_disabled_rejects_pickup_token`
  - `test_each_scan_opens_a_distinct_session`
- **TestSessionGate**
  - `test_missing_session_token_rejected_on_every_endpoint`
  - `test_unknown_session_token_rejected_on_every_endpoint`
  - `test_token_hash_is_not_accepted_as_the_token`: Handing back the STORED hash must not authenticate — the lookup hashes whatever it is given, so only the raw pre-image works.
  - `test_expired_status_session_rejected`
  - `test_closed_status_session_rejected`
  - `test_past_expiry_session_rejected_and_flipped_to_expired`: An Active row whose `expires_at` has passed is rejected AND the stored row is durably marked Expired, so it can never be replayed.
  - `test_successful_call_slides_the_expiry_window`
- **TestGetCustomerMenu**
  - `test_table_session_returns_its_own_branch_menu`
  - `test_cross_branch_session_cannot_see_the_other_branchs_menu`: Branch B's session token must resolve to branch B's menu — a session is scoped by the profile recorded on the session row, never by anything the caller supplies.
  - `test_pickup_session_also_resolves_a_menu`
  - `test_menu_rows_carry_only_customer_safe_fields`
  - `test_expired_session_cannot_read_the_menu`
  - `test_guest_user_is_restored_after_the_elevated_block`: `_elevated()` must never leak Administrator into the caller's session — the whole module's trust model depends on that.
- **TestGetCustomerProduct**
  - `test_on_menu_item_returned_with_metadata`
  - `test_description_and_image_suppressed_when_profile_hides_them`
  - `test_item_not_on_this_menu_rejected`: U12: a guest session must not be able to read metadata for an arbitrary Item that simply exists in the system.
  - `test_other_branchs_item_rejected_for_this_session`: Cross-branch read attempt: branch B's real, on-a-menu item is still off THIS session's menu and must be refused.
  - `test_nonexistent_item_code_rejected`
  - `test_expired_session_cannot_read_a_product`
- **TestGetOrderStatus**
  - `test_session_without_invoice_reports_no_order`
  - `test_session_with_unbilled_invoice`
  - `test_billed_flag_follows_invoice_printed`
  - `test_open_service_requests_are_surfaced_and_resolved_ones_are_not`
  - `test_status_does_not_leak_another_sessions_order`: Two live sessions on the same profile: each sees only the invoice recorded on its OWN session row.
  - `test_expired_session_cannot_read_status`

</details>

<details>
<summary><code>ury.ury.api.test_service_requests</code> (21)</summary>

> Unit tests for URY Service Request API endpoints. Tests cover the staff-facing endpoints (list_open_service_requests, acknowledge_service_request, resolve_service_request) that are used by floor staff to manage customer service requests.

- **TestListOpenServiceRequests**: Tests for list_open_service_requests() endpoint.
  - `test_returns_empty_list_when_branch_is_none`: Calling with None branch should short-circuit and return empty list.
  - `test_returns_empty_list_when_branch_is_empty_string`: Calling with empty string branch should short-circuit and return empty list.
  - `test_returns_empty_list_when_no_tables_in_branch`: When the branch has no tables, should return empty list.
  - `test_returns_empty_list_when_no_open_requests`: When branch has tables but no open/acknowledged requests, return empty list.
  - `test_returns_open_requests_ordered_by_requested_at`: Should return open and acknowledged requests, ordered oldest first.
  - `test_filters_by_status_open_and_acknowledged_only`: Should only return Open and Acknowledged requests, not Resolved.
- **TestAcknowledgeServiceRequest**: Tests for acknowledge_service_request() endpoint.
  - `test_changes_status_to_acknowledged`
  - `test_returns_updated_status`
  - `test_saves_after_permission_check_passes`
  - `test_handles_already_acknowledged_request`
- **TestResolveServiceRequest**: Tests for resolve_service_request() endpoint.
  - `test_changes_status_to_resolved`
  - `test_sets_resolved_at_timestamp`
  - `test_sets_resolved_by_current_user`
  - `test_returns_updated_status`
  - `test_saves_after_permission_check_passes`
  - `test_handles_resolving_acknowledged_request`
  - `test_handles_resolving_already_resolved_request`
- **TestServiceRequestRealPermissionBoundary**: Real (non-mocked) coverage of the frappe.PermissionError guards in acknowledge_service_request() and resolve_service_request(). Every test above mocks frappe.has_permission itself (always True), so t…
  - `test_roleless_user_denied_acknowledge_for_real`
  - `test_roleless_user_denied_resolve_for_real`
  - `test_administrator_may_acknowledge_for_real`
  - `test_administrator_may_resolve_for_real`

</details>

<details>
<summary><code>ury.ury.api.test_ury_ai_settings</code> (11)</summary>

- **TestURYAISettingsRoundTrip**
  - `test_set_ai_enabled_round_trip`
  - `test_list_ai_providers_never_exposes_raw_api_key`
- **TestURYAISettingsUpdateAgentConfig**: update_agent_config() must only touch fields explicitly passed. This requires an actual HUF Agent record; skip if huf isn't installed here.
  - `test_update_agent_config_only_changes_passed_fields`
- **TestURYAISettingsPermissions**: Every whitelisted function in this module calls require_manager() first; a non-manager caller must get frappe.PermissionError.
  - `test_non_manager_cannot_get_ai_settings`
  - `test_non_manager_cannot_set_ai_enabled`
  - `test_non_manager_cannot_get_agent_config`
  - `test_non_manager_cannot_update_agent_config`
  - `test_non_manager_cannot_list_ai_providers`
  - `test_non_manager_cannot_list_ai_models`
  - `test_non_manager_cannot_set_provider_api_key`
  - `test_manager_can_get_ai_settings`

</details>

<details>
<summary><code>ury.ury.api.test_ury_availability</code> (33)</summary>

> Tests for ury_availability.get_item_availability. Static-review note: none of these tests have been executed against a live bench/site/DB in this environment -- there is only a detached checkout of the app source, no bench/Docker available. They are written and hand-traced against `ury_availability.py`'s logic, following the same mocking pattern as `test_ury_reservation_service.py`: each test pat…

- **TestGetItemAvailabilityPreProduced**
  - `test_available_happy_path`
  - `test_not_produced`
  - `test_plan_exhausted`
  - `test_fg_out_of_stock`
  - `test_no_active_plan`
- **TestGetItemAvailabilityMadeToOrder**
  - `test_missing_bom`
  - `test_blocking_component`
  - `test_mto_available_capped_by_recipe_capacity`
- **TestGetItemAvailabilityFailClosed**
  - `test_missing_department`
  - `test_department_disabled`
  - `test_production_unit_disabled_pre_produced`
  - `test_production_unit_disabled_made_to_order`
  - `test_configuration_error_when_config_unresolvable`
  - `test_missing_branch_fails_closed`
  - `test_missing_company_fails_closed`
- **TestGetItemAvailabilityBranchIsolation**
  - `test_branch_scope_is_passed_through_to_every_lookup`: Same item_code queried for branch A and branch B must never mix data. `_resolve_production_config`, `project_fg_allocatable`, and `_resolve_plan_remaining` are the only places this module reads depar…
- **TestGetItemAvailabilityDirectRetail**
  - `test_direct_retail_zero_stock`
- **TestAvailabilityProductionContextIntegration**
  - `test_uses_canonical_production_context_resolver`
- **TestControlledBySalesPlanPolarity**: Regression coverage for B-1: `controlled_by_sales_plan` doctype default must be 1 (mandatory plan gating), and the code must keep failing closed for existing/default rows when no plan is active.
  - `test_controlled_by_sales_plan_default_still_fails_closed_pre_produced`
  - `test_controlled_by_sales_plan_explicit_opt_out_skips_gate_pre_produced`
  - `test_controlled_by_sales_plan_default_still_fails_closed_made_to_order`
  - `test_controlled_by_sales_plan_explicit_opt_out_skips_gate_made_to_order`
  - `test_controlled_by_sales_plan_opt_out_ignores_exhausted_plan_pre_produced`
  - `test_controlled_by_sales_plan_opt_out_ignores_exhausted_plan_made_to_order`
- **TestAvailabilityModeOverride**: Regression coverage for B-2: the 'Always Available' override must never force sellable over a structural/config error, but must be able to override a purely commercial not-sellable reason (e.g. FG_OU…
  - `test_always_available_does_not_override_missing_bom`
  - `test_always_available_overrides_fg_out_of_stock`
  - `test_always_available_does_not_override_department_disabled`
- **TestResolvePlanRemainingReflectsCounters**: `_resolve_plan_remaining` must read the real committed_qty/fulfilled_qty counters instead of the old hardcoded committed=fulfilled=0 (which made plan_remaining always equal the full plan_qty, regardl…
  - `test_full_plan_qty_when_nothing_committed_yet`
  - `test_plan_remaining_shrinks_as_committed_and_fulfilled_grow`
  - `test_plan_remaining_can_go_to_zero_when_fully_committed`
  - `test_sums_committed_and_fulfilled_across_matching_rows`
  - `test_no_matching_rows_is_no_active_plan`
- **TestGetItemAvailabilityBranchScopePermissionBoundary**: Real, un-mocked negative-permission coverage for ury_availability.get_item_availability's branch-scope guard (_verify_branch_scope), which the file's own module docstring admits has never been run ag…
  - `test_roleless_user_with_no_branch_assignment_is_rejected`

</details>

<details>
<summary><code>ury.ury.api.test_ury_batch_manufacture_service</code> (17)</summary>

- **TestAuthorization**
  - `test_rejects_actor_without_batch_role`
  - `test_allows_actor_with_batch_role_and_read_permission`
  - `test_rejects_actor_without_read_permission_on_config`
  - `test_administrator_bypasses_role_check`
- **TestLoadAndValidateConfig**
  - `test_rejects_inactive_configuration`
  - `test_rejects_non_pre_produced_policy`
  - `test_rejects_sourcing_mode_mismatch`
  - `test_raises_when_configuration_missing`
- **TestSubmitStockEntryIdempotency**: `_submit_stock_entry` (the plain, non-Work-Order path) is still used by `receive_batch` (Material Receipt, no BOM, unaffected by this migration).
  - `test_replays_existing_stock_entry_for_same_idempotency_key`
  - `test_posts_a_new_stock_entry_when_no_existing_match`
- **TestStartBatch**: IN_HOUSE path: a real Work Order is created+submitted, and the Manufacture Stock Entry is generated via `work_order.make_stock_entry` (never hand-built) -- Track-Item N3.
  - `test_rejects_zero_or_negative_qty`
  - `test_start_batch_creates_submitted_work_order_and_linked_stock_entry`
  - `test_start_batch_idempotent_replay_skips_work_order_creation`
  - `test_start_batch_rejects_external_receipt_configuration`
- **TestReceiveBatch**
  - `test_rejects_in_house_configuration`
  - `test_rejects_missing_external_receiving_warehouse`
  - `test_receive_batch_posts_material_receipt_with_no_components`

</details>

<details>
<summary><code>ury.ury.api.test_ury_batch_work_order_adapter</code> (15)</summary>

> Tests for V3-61 ury_batch_work_order_adapter.py. No bench/DB is available in this worktree (static-review only, per task instructions). These tests use `unittest.mock` to stub out `frappe.db.*` and `frappe.get_meta` so the module's control flow can be exercised without a live site, mirroring V3-60's `test_ury_workstation_mapping.py` disclosure for the same environment constraint. If/when this run…

- **TestIsBatchEligibleStructuralSafeguard**: MADE_TO_ORDER (every-plate) items must never be eligible, no matter what the opt-in flag says -- this is the TODO.md 'must NOT touch: every-plate Work Order' guardrail.
  - `test_made_to_order_never_eligible_when_opted_in`
  - `test_made_to_order_never_eligible_when_not_opted_in`
  - `test_made_to_order_case_insensitive`
- **TestIsBatchEligibleOptIn**
  - `test_pre_produced_with_opt_in_true_is_eligible`
  - `test_pre_produced_with_opt_in_false_is_not_eligible`
  - `test_missing_item_code_is_not_eligible`
  - `test_unset_policy_with_opt_in_is_eligible`
- **TestBuildWorkOrderDraft**
  - `test_produces_correct_field_mapping`
  - `test_workstation_omitted_when_not_supplied`
  - `test_zero_or_negative_qty_throws`
  - `test_no_active_bom_throws`
  - `test_never_calls_any_mutation_api`: Grep-style verification: the module source contains no call to .insert(/.save(/.submit(/set_value( anywhere in build_work_order_draft, and at runtime frappe.get_doc is never invoked by it.
- **TestTraceBatchIntegration**
  - `test_eligible_case_returns_coherent_trace`
  - `test_made_to_order_case_has_no_draft`
  - `test_missing_opt_in_field_fails_closed`

</details>

<details>
<summary><code>ury.ury.api.test_ury_bom_compiler</code> (20)</summary>

- **TestCompileBomVectorSingleLevel**
  - `test_single_level_bom_compiles_correctly`
  - `test_determinism_same_input_twice_identical_output`
- **TestCompileBomVectorNested**
  - `test_nested_bom_falls_back_to_manual_recursion_and_flattens_subassembly`
  - `test_preproduced_subassembly_is_a_stop_point_not_exploded`
- **TestSharedComponentIndex**
  - `test_shared_component_aggregates_across_two_top_level_items`
- **TestSharedComponentIndexPerItemIsolation**: One item with no active BOM must not abort the whole index build. Regression cover for a live-reproduced fragility bug: a single active MADE_TO_ORDER item with no active BOM (a menu item added before…
  - `test_broken_item_is_skipped_and_valid_items_still_indexed`
  - `test_strict_mode_remains_fail_closed_by_default`: Default (skip_invalid_items=False) must still raise. Production-planning / stock-issue callers must never silently omit an item's demand, so graceful degradation is opt-in only.
  - `test_all_items_broken_returns_empty_index_without_raising`
- **TestGetItemsAffectedByComponentIsolatesBrokenItems**: The realtime fan-out lookup must survive one misconfigured branch item.
  - `test_one_item_without_bom_does_not_blind_the_whole_branch`
- **TestNoBomFailsClosed**
  - `test_item_with_no_bom_raises_validation_error`
- **TestBuildDemandVector**
  - `test_demand_vector_shape_matches_v3_31_expectation_and_aggregates_shared_component`
  - `test_direct_retail_lines_excluded_from_demand_vector`
  - `test_demand_vector_determinism`
- **TestGetItemsAffectedByComponent**
  - `test_two_made_to_order_items_sharing_one_component_returns_both`
  - `test_component_used_by_single_made_to_order_item_returns_only_that_item`
  - `test_unused_component_returns_empty_list`
  - `test_no_made_to_order_items_returns_empty_list`
  - `test_missing_component_item_raises_validation_error`
  - `test_missing_branch_raises_validation_error`
  - `test_missing_company_raises_validation_error`

</details>

<details>
<summary><code>ury.ury.api.test_ury_bom_staleness</code> (15)</summary>

- **TestGetStaleDraftBoms**: Test C1 part 1: get_stale_draft_boms detects draft BOMs with stale yield%.
  - `test_returns_empty_list_when_no_draft_boms`: Returns empty list when no draft BOMs exist.
  - `test_calls_require_manager`: Calls require_manager() to gate access.
  - `test_calls_require_scope`: Calls _require_scope(company) to validate company parameter.
  - `test_filters_draft_boms_by_docstatus_0`: Query filters for docstatus=0 (draft) only.
  - `test_filters_draft_boms_by_company`: Query filters for specific company.
  - `test_detects_stale_component_with_different_yield_percent`: Component row stale when stored yield% differs from Item's current value.
  - `test_does_not_report_matching_yield_percent`: Component NOT stale when stored yield% matches Item's current value.
  - `test_ignores_non_tracked_items`: Non-yield-tracked components never reported as stale.
  - `test_ignores_submitted_boms`: Submitted (docstatus=1) BOMs excluded from check.
  - `test_float_tolerance_skips_small_differences`: Differences <= FLOAT_TOLERANCE (0.001) are not reported as stale.
  - `test_reports_stale_when_difference_exceeds_tolerance`: Differences > FLOAT_TOLERANCE (0.001) are reported.
  - `test_handles_missing_item_yield_percent`: Item with missing custom_yield_percent treated as 0.0.
  - `test_one_stale_row_per_result_entry`: BOM with multiple stale rows appears multiple times (one per row).
  - `test_result_includes_all_required_fields`: Result dict includes all required fields.
- **TestGetStaleDraftBomsRealPermissionBoundary**: Real, un-mocked negative-permission coverage for get_stale_draft_boms. Every other test class in this file patches `require_manager` out entirely (`@patch(f"{MOD}.require_manager")`), so the gate its…
  - `test_roleless_user_is_rejected_before_any_bom_query_runs`

</details>

<details>
<summary><code>ury.ury.api.test_ury_bom_tree</code> (17)</summary>

- **TestScalesByBomQuantity**: A BOM producing 5 units per run must scale its lines by that 5, not by 1.
  - `test_quantity_other_than_one_scales_lines_correctly`
  - `test_quantity_of_one_behaves_as_before`
- **TestNestedRecursionAndLeaves**
  - `test_recurses_through_nested_bom_and_marks_leaves`
- **TestCircularReferenceDetection**
  - `test_cycle_raises_naming_the_path_instead_of_recursing_forever`
  - `test_shared_subassembly_in_two_branches_is_not_a_cycle`
- **TestFailsLoudlyOnMissingOrCancelledBom**
  - `test_missing_bom_raises`
  - `test_cancelled_bom_raises`
  - `test_draft_bom_raises`
  - `test_nested_cancelled_bom_raises`
  - `test_required_qty_must_be_positive`
  - `test_missing_bom_no_raises`
- **TestDeterministicOutput**
  - `test_identical_inputs_produce_identical_output`
  - `test_order_follows_bom_item_idx_order`
- **TestNoItemCodeEntryPoint**: Structural guarantee (D3/Agent 1 contract): only `bom_no` gets in.
  - `test_signature_accepts_only_bom_no_required_qty_company`
  - `test_module_has_no_resolve_active_bom_style_helper`
- **TestModuleKnowsNothingAboutUrySemantics**: This module must not import URY doctypes or URY-semantic modules.
  - `test_no_forbidden_imports`
  - `test_no_frappe_db_exists_or_get_all_call_against_a_ury_doctype`: No call in the module queries a `URY *` doctype (belt-and-suspenders). The module docstring itself names the forbidden modules (to document why they must never be imported), so a raw substring scan o…

</details>

<details>
<summary><code>ury.ury.api.test_ury_branch_operational_state</code> (11)</summary>

- **TestBranchOperationalState**
  - `test_missing_schedule_fails_closed`
  - `test_active_service_is_open`
  - `test_closed_exception_wins`
  - `test_overnight_window_open_before_midnight`
  - `test_overnight_window_carries_over_past_midnight`
  - `test_no_carryover_before_todays_future_window_opens`
- **TestBranchOperationalStateRealPermissionBoundary**: Real (non-mocked) coverage of the branch-scope PermissionError guard in `resolve_branch_operational_state()` -- the existing test class above patches `frappe` entirely, which means the actual `getBra…
  - `test_no_branch_assignment_fails_closed`
  - `test_cross_branch_request_rejected_for_non_privileged_user`
  - `test_own_branch_request_does_not_raise_permission_error`
  - `test_implicit_own_branch_default_does_not_raise`
  - `test_system_manager_may_cross_tenant_boundary`

</details>

<details>
<summary><code>ury.ury.api.test_ury_chat</code> (31)</summary>

> Unit tests for ury_chat module - HUF chat API proxy layer. Tests cover: - Report context formatting - Agent name retrieval - Conversation lifecycle (creation, caching) - Message sending with context - Chat history retrieval - Error handling and graceful degradation - All external HUF calls are mocked

- **TestFormatReportContext**: Test report context formatting for chat messages.
  - `test_empty_dict`
  - `test_none`
  - `test_single_key_value`
  - `test_multiple_key_values`
- **TestGetAgentName**: Test agent name configuration retrieval.
  - `test_default_name`
  - `test_custom_name_from_config`
- **TestConversationCacheKey**: Test conversation cache key generation.
  - `test_includes_user`
  - `test_key_format`
- **TestGetOrCreateConversation**: Test conversation creation and retrieval with HUF.
  - `test_huf_not_installed`
  - `test_agent_does_not_exist`
  - `test_agent_disabled`
  - `test_agent_no_provider`
  - `test_create_success`
  - `test_create_name_fallback`: Should fallback to 'name' key when 'conversation_id' missing.
  - `test_create_string_return`: Should handle string response from create_conversation.
  - `test_create_no_id`: Should return unavailable when no id returned.
  - `test_cached_valid`: Should return cached conversation if it exists in DB.
  - `test_exception_handling`: Should catch exceptions and return unavailable.
- **TestSendChatMessage**: Test message sending to HUF conversations.
  - `test_huf_not_installed`
  - `test_success_no_context`: Should send message without context.
  - `test_with_dict_context`: Should include report context in message.
  - `test_with_json_context`: Should parse JSON string context.
  - `test_exception_handling`: Should catch exceptions and return unavailable.
- **TestGetChatHistory**
  - `test_huf_not_installed`
  - `test_default_limit`: Should get history with default limit (50).
  - `test_custom_limit`: Should respect custom limit parameter.
  - `test_string_limit_conversion`: Should convert string limit to int.
  - `test_empty_history`: Should handle empty history.
  - `test_exception_handling`: Should catch exceptions and return unavailable.
- **TestHufUnavailableHelper**: Test error handling helper function.
  - `test_error_structure`: Should return proper error response and log.
  - `test_logging`: Should log with correct title.

</details>

<details>
<summary><code>ury.ury.api.test_ury_comparable_weekday_history</code> (9)</summary>

- **TestComparableWeekdayHistory**
  - `test_query_is_scoped_and_excludes_plan_date`
  - `test_missing_scope_fails_closed`
  - `test_permission_denial_fails_before_query`
  - `test_missing_company_fails_before_query`
  - `test_unassigned_branch_fails_before_query`
  - `test_company_mismatch_fails_before_query`
  - `test_multiple_item_filter_is_parameterized`
  - `test_return_net_quantity_sql_contract`
  - `test_response_wraps_rows_into_expected_shape`

</details>

<details>
<summary><code>ury.ury.api.test_ury_cost_variance_attribution</code> (17)</summary>

- **TestComputeTheoreticalCost**
  - `test_theoretical_cost_is_sum_of_qty_times_rate`
  - `test_missing_company_fails_closed`
  - `test_missing_valuation_rate_treated_as_zero_not_crash`
- **TestComputePostedCost**
  - `test_unposted_fulfilment_has_no_posted_cost`
  - `test_posted_cost_reads_submitted_posting`
  - `test_missing_company_fails_closed`
  - `test_company_mismatch_fails_closed`
  - `test_no_matching_record_fails_closed`
- **TestComputeVariance**
  - `test_variance_is_provisional_until_posting_exists`
  - `test_positive_variance_when_counted_qty_exceeds_expected`
  - `test_negative_variance_when_counted_qty_below_expected`
  - `test_zero_qty_fails_closed`
  - `test_negative_counted_qty_fails_closed`
  - `test_missing_company_fails_closed`
  - `test_persist_true_inserts_snapshot_doc`
  - `test_persist_false_never_touches_db`
- **TestComputeVarianceRealPermissionBoundary**: Real, un-mocked negative-permission coverage for compute_variance. None of this file's other tests mock or otherwise exercise `require_manager()` (it is called for real, but only ever under the defau…
  - `test_roleless_user_is_rejected_before_any_cost_computation_runs`

</details>

<details>
<summary><code>ury.ury.api.test_ury_customer_pricing</code> (8)</summary>

- **TestGetCustomerPriceMenu**
  - `test_returns_menu_and_price_list`
  - `test_no_customer`
  - `test_unknown_customer`
  - `test_no_default_price_list`
  - `test_price_list_without_menu`
  - `test_disabled_or_buying_price_list`
  - `test_menu_of_other_branch_or_disabled`
- **TestValidateSyncItemsAgainstCustomerMenu**
  - `test_explicit_menu_skips_room_resolution`

</details>

<details>
<summary><code>ury.ury.api.test_ury_dashboard</code> (23)</summary>

- **TestGetDashboardStats**
  - `test_cache_hit_returns_immediately`
  - `test_cache_miss_with_branch`
  - `test_cache_miss_zero_invoices_no_division_error`
  - `test_cache_miss_no_branch`
- **TestGetNeedsAttention**
  - `test_cache_hit_returns_immediately`
  - `test_cache_miss_with_pending_payments`
  - `test_cache_miss_all_empty`
  - `test_pending_payment_query_is_capped_to_business_day_window`: Regression test for the unpaid-orders age-cap bug: the pending- payment query must bound `creation` on both sides (>= shift_start, < shift_end), not just the 15-minute-old lower bound — otherwise a m…
  - `test_business_day_window_excludes_old_draft_includes_recent_one`: Focused unit test of the date-window condition itself (no DB): a draft created before `shift_start` must fall outside the [shift_start, shift_end) window used by the pending-payment query, while one …
- **TestGetShiftMetrics**
  - `test_cache_hit_returns_immediately`
  - `test_cache_miss_with_metrics`
  - `test_cache_miss_zero_covers_no_division_error`
- **TestGetDepartmentActivity**
  - `test_cache_hit_returns_immediately`
  - `test_combines_kot_and_work_order_rows_for_the_same_department`
  - `test_department_with_only_kot_activity_has_zeroed_production_fields`: A department can fire/serve KOTs without a Work Order ever completing in the window (e.g. a DIRECT_RETAIL department) -- that must render as zero, not be dropped or crash on a missing key.
  - `test_department_with_only_production_has_zeroed_kot_fields`
  - `test_no_activity_returns_empty_rows_not_an_error`
  - `test_rows_are_sorted_by_department`
- **TestGetBaseline**
  - `test_empty_rows_returns_zeros`
  - `test_three_rows_median_calculation`
  - `test_two_rows_median_average_of_two_middle_values`
- **TestGetFloorLoad**
  - `test_floor_load_returns_waiter_data`
  - `test_floor_load_cache_hit`

</details>

<details>
<summary><code>ury.ury.api.test_ury_department_profitability</code> (21)</summary>

- **TestPermissionTiers**
  - `test_cashier_denied_outright`
  - `test_captain_denied_outright`
  - `test_chef_gets_quantities_only_cost_keys_absent`
  - `test_finance_gets_full_cost_fields`
  - `test_unposted_cost_yields_theoretical_only_not_a_crash`: The real V3-74 contract: posted_cost is None until a fulfilment Stock Entry is posted. That must produce a theoretical-only row flagged UNATTRIBUTED_COST, never a TypeError on `float - None`.
  - `test_unposted_cost_still_strips_every_cost_field_for_chef`
  - `test_missing_theoretical_cost_falls_back_to_missing_cost_attribution`
- **TestBranchAndCompanyScope**
  - `test_ury_manager_own_branch_ok`
  - `test_ury_manager_other_branch_fails_closed`
  - `test_branch_not_in_company_fails_closed`: Branch exists but belongs to a different company than requested.
  - `test_same_branch_name_two_companies_does_not_aggregate`: Plans/invoice reads are filtered by company in the frappe.get_all filters dict / SQL params -- this test asserts the company filter is actually passed through, so a same-named branch in another compa…
- **TestDepartmentManagerScope**
  - `test_department_manager_sees_only_own_department`
  - `test_department_manager_other_branch_fails_closed`
  - `test_department_manager_requesting_other_department_fails_closed`
- **TestUnattributedAndMissingCost**
  - `test_missing_department_mapping_returns_unattributed_revenue`
  - `test_missing_cost_attribution_marks_row_provisional`
  - `test_no_approved_plan_fails_closed`
- **TestMissingScope**
  - `test_missing_company_fails_closed`
  - `test_missing_branch_fails_closed`
- **TestPlanVsActual**
  - `test_plan_vs_actual_compares_planned_and_sold_qty`
  - `test_plan_vs_actual_missing_plan_fails_closed`

</details>

<details>
<summary><code>ury.ury.api.test_ury_desk_link</code> (29)</summary>

> Tests for ury_desk_link API module. This module provides a batched, doctype-level permission probe for the frontend's "Open in Desk" links. Tests cover the parsing logic and the main permission-checking endpoint.

- **TestParseDoctypes**: Tests for _parse_doctypes normalisation function.
  - `test_parse_single_string_doctype`: Single doctype name as string input.
  - `test_parse_whitespace_stripped`: Whitespace around doctype names is trimmed.
  - `test_parse_python_list`: Python list of doctype names.
  - `test_parse_python_tuple`: Python tuple of doctype names.
  - `test_parse_json_array_string`: JSON array encoded as a string (how frappe.call serialises it).
  - `test_parse_json_array_with_whitespace`: JSON array string with surrounding whitespace.
  - `test_parse_deduplicates_repeated_doctypes`: Repeated doctypes appear only once in output.
  - `test_parse_truncates_at_max_doctypes`: Exceeding MAX_DOCTYPES_PER_CALL truncates the result.
  - `test_parse_skips_non_string_entries_in_list`: Non-string entries in list input are skipped.
  - `test_parse_skips_empty_strings`: Empty strings and whitespace-only strings are skipped.
  - `test_parse_non_list_input_returns_empty`: Non-string, non-list input returns empty list.
  - `test_parse_invalid_json_string_treated_as_plain_string`: String that looks like JSON but isn't valid is treated as a plain doctype name.
  - `test_parse_empty_json_array`: Empty JSON array string.
  - `test_parse_empty_list`: Empty Python list.
- **TestGetDeskPermissions**: Tests for the get_desk_permissions endpoint.
  - `test_rejects_guest_user`: Guest user is rejected with PermissionError.
  - `test_rejects_none_user`: None user is rejected with PermissionError.
  - `test_returns_read_and_write_permissions`: Returns both read and write permission flags for each doctype.
  - `test_returns_false_for_no_permissions`: Returns False/False when user has no permissions.
  - `test_returns_asymmetric_permissions`: Correctly reports read-only (no write) permission.
  - `test_multiple_doctypes_in_batch`: Batches multiple doctype permission checks.
  - `test_unknown_doctype_returns_false_false`: Unknown/non-existent doctype returns False/False, not error.
  - `test_fails_closed_on_has_permission_hook_error`: When has_permission hook raises, entry fails closed to False/False.
  - `test_batch_partial_failure_continues`: If one doctype fails, batch continues with other doctypes.
  - `test_coerces_permissions_to_bool`: Permission values are always coerced to strict boolean.
  - `test_accepts_json_array_string_input`: Accepts JSON array format (how frappe.call sends lists from JS).
  - `test_respects_max_doctypes_limit`: Batch is silently truncated at MAX_DOCTYPES_PER_CALL.
  - `test_deduplicates_repeated_doctypes_in_batch`: Duplicate doctype names in input are de-duplicated.
  - `test_handles_empty_doctype_list`: Empty input results in empty output, not error.
  - `test_handles_whitespace_only_doctype_names`: Whitespace-only doctype names are filtered out.

</details>

<details>
<summary><code>ury.ury.api.test_ury_fast_moving</code> (20)</summary>

> Tests for ury_fast_moving.get_fast_moving_items. Tests cover: - Default and custom window_days parameters - Branch filtering - Permission enforcement (require_manager) - Sell rate calculation and sorting - Edge cases (zero/negative window_days, float conversion) - Result capping at 20 items - SQL query parameter safety

- **TestGetFastMovingItemsHappyPath**: Test normal operation with various parameters.
  - `test_default_window_days_single_day`: Test with default window_days=1 (24 hours).
  - `test_seven_day_window`: Test with window_days=7 (168 hours).
  - `test_with_branch_filter`: Test query when branch parameter is provided.
  - `test_without_branch_filter`: Test query when branch parameter is None (all branches).
- **TestGetFastMovingItemsEdgeCases**: Test boundary conditions and edge cases.
  - `test_window_days_zero_normalized_to_one`: Test that window_days=0 is normalized to 1.
  - `test_window_days_negative_normalized_to_one`: Test that negative window_days is normalized to 1.
  - `test_window_days_float_converted_to_int`: Test that float window_days is converted to int.
- **TestGetFastMovingItemsSellRateCalculation**: Test sell rate calculation and sorting.
  - `test_sell_rate_per_hour_calculation`: Test that sell_rate_per_hour is calculated correctly.
  - `test_results_sorted_by_sell_rate_descending`: Test that results are sorted by sell_rate_per_hour in descending order.
  - `test_sell_rate_rounded_to_three_decimals`: Test that sell_rate_per_hour is rounded to 3 decimal places.
  - `test_qty_sold_none_treated_as_zero`: Test that None qty_sold is treated as 0.
- **TestGetFastMovingItemsResultLimits**: Test result capping and limits.
  - `test_results_capped_at_twenty_items`: Test that only top 20 items are returned.
  - `test_empty_result_set`: Test handling of empty result set.
  - `test_fewer_than_twenty_items_returned_as_is`: Test that fewer than 20 items are returned as-is.
- **TestGetFastMovingItemsPermissions**: Test permission enforcement.
  - `test_permission_denied`: Test that permission denial is propagated.
  - `test_permission_check_happens_before_query`: Test that permission is checked before any database query.
- **TestGetFastMovingItemsQuerySafety**: Test SQL query parameterization and safety.
  - `test_query_uses_parameterized_statements`: Test that query uses parameterized statements, not string interpolation.
  - `test_query_status_filter`: Test that query filters for correct POS Invoice statuses.
  - `test_query_includes_necessary_joins`: Test that query includes all necessary table joins.
  - `test_query_timestamp_comparison`: Test that query uses TIMESTAMP for proper datetime comparison.

</details>

<details>
<summary><code>ury.ury.api.test_ury_feature_flags</code> (24)</summary>

> V3-73 tests: POS stock authority feature flag read path. These are static/unit tests using mocks -- no bench/site required to reason about them, but they follow this repo's existing FrappeTestCase + mock pattern (see ury/ury/doctype/ury_order/test_ury_order.py) so they run under `bench run-tests` in a real environment.

- **TestPosStockAuthorityFlagDefaultsSafe**: The single most important test in this task: the flag must default to False/off whenever it is unset, or whenever reading it fails for any reason (missing doctype, DB error, etc). It must never fail …
  - `test_flag_defaults_false_when_unset`
  - `test_flag_defaults_false_when_no_policy_row`
  - `test_flag_defaults_false_when_no_branch_given`
  - `test_flag_fails_closed_on_missing_doctype_or_db_error`
  - `test_flag_true_only_when_explicitly_enabled`
  - `test_flag_false_in_reservations_only_state`
  - `test_flag_accepts_optional_scope_args_without_changing_default`
- **TestMaybeWireFulfilmentOnSubmit**: Flag-on invoice-submit gate. Under the flag this VERIFIES that the fulfilment posting service already posted; it never posts anything itself.
  - `test_noop_when_flag_off`
  - `test_verifies_when_flag_on`
  - `test_verification_failure_is_propagated`
  - `test_noop_when_invoice_has_no_kots`
- **TestFulfilmentVerificationGate**: G-07: a POSTED intent for the right kot_item is not on its own proof that what was posted is what is being invoiced.
  - `test_matching_posted_intent_passes`
  - `test_missing_intent_blocks_submit`
  - `test_stale_revision_blocks_submit`: A re-fired item whose new READY transition never created an intent would otherwise pass on the previous fire's POSTED intent. `bump_item_execution_revision` moved the line from rev-1 to rev-2, so the…
  - `test_served_unedited_item_is_not_reported_stale`: Regression for the false "stale production posting" block. `idempotency_key` is a per-RPC replay token: Mosaic mints a fresh UUID for `mark_item_ready` and another for `serve_item_execution`, and `_t…
  - `test_missing_revision_key_skips_revision_check_only`: A row seeded before `revision_key` existed and not yet backfilled carries no revision claim, so there is nothing for the revision half to compare. It is skipped rather than guessed at -- such a row c…
  - `test_quantity_increased_after_ready_blocks_submit`: Order edited 1 -> 3 after READY: one was produced, three are sold.
  - `test_unproduced_item_is_skipped_not_blocked`: An item the kitchen has not finished is a workflow question, not a stock one, and must not refuse payment at the till.
  - `test_closing_reconciliation_disabled_still_throws`: Safety net preserved: if T5's real enforcement is not active for this branch (closing_reconciliation_enabled is False), the till-time gate remains the sole protection and must still block the submit.
  - `test_closing_reconciliation_enabled_is_advisory_not_blocking`: I-11: with T5 genuinely active for the branch, a final posting failure after the synchronous retry logs instead of throwing, and the invoice is allowed to submit.
  - `test_strict_ignores_closing_reconciliation_advisory_downgrade`: The composition bug this parameter exists to prevent: T5's closing check calls this function with strict=True precisely because closing_reconciliation_enabled is True for the branch it's running agai…
  - `test_retry_still_fires_before_either_outcome`: The synchronous retry must run exactly once regardless of which branch (advisory or strict) decides the final outcome.
  - `test_retry_success_is_unaffected_by_policy`: When the retry actually posts the intent, behaviour is unchanged from today regardless of closing_reconciliation_enabled: no log, no throw.
  - `test_non_made_to_order_item_requires_no_intent`: Pre-produced and direct-retail items post nothing at READY, so demanding an intent for them would block every submit.

</details>

<details>
<summary><code>ury.ury.api.test_ury_fulfilment_posting_service</code> (32)</summary>

- **TestCreatePostingIntent**
  - `test_end_users_can_read_and_report_but_cannot_directly_mutate_intents`
  - `test_posting_service_rejects_actor_without_operational_role`
  - `test_create_intent_refuses_when_pos_stock_authority_flag_is_off`
  - `test_ready_creates_one_intent_with_frozen_payload`
  - `test_pre_produced_ready_creates_no_intent_and_posts_nothing`: Production posting is for MADE_TO_ORDER only. A pre-produced item's Manufacture entry was already posted, ahead of time, by the batch path, into the same warehouse the sale deducts from at closing. P…
  - `test_direct_retail_ready_creates_no_intent`: Direct-retail items are not produced at all; the sale deducts them once, at closing.
  - `test_ready_uses_next_sequence_for_new_reservation_group`
  - `test_ready_reuses_sequence_for_same_reservation_group_replay`
  - `test_ready_replay_returns_existing_intent`
- **TestStockEntryType**: Regression for the MTO bug: the posting worker always created a 'Material Issue' Stock Entry, which deducts raw-material components but never produces (receives) the finished selling item. MADE_TO_OR…
  - `test_mto_stock_rows_include_finished_item_target_warehouse`
  - `test_issuing_the_selling_item_is_structurally_refused`: The no-self-issue invariant: the production event may only consume items strictly below the selling item in the BOM. A row issuing the selling item itself would be deducted twice -- once here and aga…
  - `test_self_issue_is_refused_for_made_to_order_too`: The assertion is structural, not policy-scoped: an MTO payload whose BOM explosion somehow yielded the selling item is refused just the same, so the bug class cannot return through another route.
  - `test_submit_stock_entry_uses_manufacture_for_made_to_order`
  - `test_submit_stock_entry_refuses_a_non_made_to_order_payload`: The pipeline only ever emits Manufacture entries. The old 'Material Issue' branch existed solely for PRE_PRODUCED / DIRECT_RETAIL, which now post nothing at READY at all -- their stock is created ahe…
- **TestProcessPostingIntent**
  - `test_worker_submits_stock_then_fulfils_reservation_and_marks_posted`
  - `test_replay_after_reservation_fulfilled_delegates_to_idempotent_guard`: A replay whose reservation group is already Fulfilled must still post successfully and must not re-transition the group. The "don't re-transition" half of that rule now lives in ONE place -- `ury_res…
  - `test_ready_or_served_is_required`
  - `test_stock_failure_marks_failed_and_does_not_fulfil_reservation`
  - `test_recovery_reenqueues_only_due_or_stale_intents`
  - `test_stock_failure_past_max_attempts_gives_up`
- **TestReservationLineScoping**: B03: two live KOTs for the same item_code on one order must each draw from their OWN reservation group, in either serving order. Before this fix, `_reservation_rows` filtered only on `(order_ref, ite…
  - `test_two_kots_same_item_are_bound_to_their_own_groups_original_first`
  - `test_two_kots_same_item_are_bound_to_their_own_groups_delta_first`
  - `test_single_kot_single_group_is_unaffected_by_line_scoping`
  - `test_legacy_reservations_without_a_frozen_line_key_still_resolve`: Reservations created before `reservation_line_key` was frozen carry no line key. A KOT item that does have one must fall back to the old `(order_ref, item_code)` behaviour rather than finding nothing.
  - `test_legacy_kot_item_without_a_line_key_keeps_todays_behaviour`
  - `test_legacy_kot_item_with_two_live_groups_still_fails_closed`: Unchanged pre-B03 behaviour for a KOT item with no line key at all: two candidate groups remain genuinely ambiguous and must still be refused rather than silently picking one.
  - `test_no_reserved_rows_at_all_still_raises_reservation_not_found`
- **TestSharedReservationGroupComponentScaling**: B03b: two KOT items sharing ONE reservation group must each freeze only their own share of its components. B03 bound each KOT item to its own line's reservation group. But a straight quantity bump on…
  - `test_each_of_two_kots_sharing_a_group_consumes_only_its_own_half`
  - `test_an_uneven_bump_scales_each_kot_to_its_own_quantity`: Coffee 1 -> 3: the delta KOT is for 2, the original for 1, against one group reserving 3.
  - `test_a_single_kot_covering_the_whole_group_is_unscaled`: The ordinary no-bump case. The share is exactly 1.0, and `x * 1.0 == x` for floats, so the frozen component quantities are bit-identical to what this froze before B03b.
  - `test_a_legacy_group_with_no_frozen_reserved_qty_is_unscaled`: Reservations created before `reserved_top_level_qty` was frozen carry no divisible total, so the freeze must fall back to today's exact whole-group behaviour rather than inventing a ratio.
  - `test_a_kot_item_claiming_more_than_its_group_reserved_fails_closed`: Posting it would consume beyond the reservation; silently scaling it down would under-produce against the ticket. Neither is a defensible guess, so the intent must fail observably instead.

</details>

<details>
<summary><code>ury.ury.api.test_ury_insight</code> (27)</summary>

> Unit tests for ury_insight API module. Tests the get_active_insights() and dismiss_insight() endpoints which provide a read-only dashboard feed of non-dismissed insights scoped to branch and time window, and a dismiss endpoint for user interactions.

- **TestGetActiveInsightsHappyPath**: Test get_active_insights() in nominal conditions.
  - `test_returns_all_active_insights_when_not_filtered`: get_active_insights() returns all non-dismissed insights.
  - `test_returns_only_non_dismissed_insights`: Dismissed insights are excluded from results.
  - `test_returns_insights_with_required_fields`: Result includes all documented fields.
  - `test_filters_by_branch_when_specified`: get_active_insights(branch='X') returns only insights from branch X.
  - `test_branch_filter_returns_empty_when_no_match`: Filtering by nonexistent branch returns empty list.
  - `test_respects_max_age_hours_parameter`: Insights older than max_age_hours are excluded.
  - `test_default_max_age_hours_is_24`: max_age_hours defaults to 24 when not specified.
  - `test_orders_by_creation_desc`: Results are ordered by creation date, newest first.
  - `test_filters_by_branch_and_respects_max_age_hours_together`: Branch and max_age_hours filters work together.
- **TestGetActiveInsightsPermissions**: Test permission checks in get_active_insights().
  - `test_non_manager_cannot_call_get_active_insights`: Non-manager users get PermissionError when calling get_active_insights().
  - `test_manager_can_call_get_active_insights`: URY Manager users can call get_active_insights().
  - `test_administrator_can_call_get_active_insights`: Administrator users can call get_active_insights().
  - `test_system_manager_can_call_get_active_insights`: System Manager role allows access to get_active_insights().
- **TestDismissInsightHappyPath**: Test dismiss_insight() in nominal conditions.
  - `test_marks_insight_as_dismissed`: dismiss_insight() sets dismissed flag to 1.
  - `test_records_dismissed_by_user`: dismiss_insight() records current user in dismissed_by field.
  - `test_dismiss_insight_idempotent`: Calling dismiss_insight() twice does not error.
  - `test_dismiss_updates_only_target_insight`: dismiss_insight() only affects the specified insight, not others.
- **TestDismissInsightPermissions**: Test permission checks in dismiss_insight().
  - `test_non_manager_cannot_dismiss_insight`: Non-manager users get PermissionError when calling dismiss_insight().
  - `test_manager_can_dismiss_insight`: URY Manager users can call dismiss_insight().
  - `test_administrator_can_dismiss_insight`: Administrator users can call dismiss_insight().
- **TestGetActiveInsightsEdgeCases**: Test edge cases and boundary conditions.
  - `test_empty_result_when_no_active_insights_exist`: get_active_insights() returns empty list when no insights exist.
  - `test_branch_parameter_is_optional`: get_active_insights() works without branch parameter.
  - `test_max_age_hours_accepts_large_values`: get_active_insights() accepts large max_age_hours values.
  - `test_max_age_hours_accepts_small_values`: get_active_insights() accepts small max_age_hours values like 1.
  - `test_handles_max_age_hours_as_string_or_int`: get_active_insights() converts max_age_hours to int.
- **TestDismissInsightEdgeCases**: Test edge cases for dismiss_insight().
  - `test_dismiss_nonexistent_insight_raises_error`: dismiss_insight() with invalid insight name raises error.
  - `test_dismiss_already_dismissed_insight`: Dismissing an already-dismissed insight is idempotent.

</details>

<details>
<summary><code>ury.ury.api.test_ury_insight_rules</code> (26)</summary>

- **TestUpsertInsight**: Test _upsert_insight deduplication and creation/update behavior.
  - `test_upsert_creates_new_insight_when_none_exists`: New insight should be created when none exists for this rule_key+branch.
  - `test_upsert_dedupes_within_window`: Second call within DEDUPE_WINDOW_MINUTES should not create duplicate.
  - `test_upsert_respects_dismissed_filter`: Dismissed insights should not be deduped; create new one instead.
  - `test_upsert_different_branches_do_not_dedupe`: Insights for different branches should not dedupe each other.
  - `test_upsert_different_rule_keys_do_not_dedupe`: Insights for different rule_keys should not dedupe each other.
- **TestRunExceptionRules**: Test run_exception_rules endpoint with role checking.
  - `test_run_exception_rules_calls_require_manager`: run_exception_rules should enforce require_manager check.
  - `test_run_exception_rules_returns_inner_result`: run_exception_rules should return result from _run_exception_rules.
- **TestRunExceptionRulesInner**: Test _run_exception_rules orchestration logic.
  - `test_inner_gets_all_branches`: _run_exception_rules should fetch all branches.
  - `test_inner_runs_all_four_rules`: _run_exception_rules should call all four rule functions.
  - `test_inner_falls_back_to_none_branch_when_no_branches`: _run_exception_rules should use [None] when no branches exist.
- **TestRuleLongOpenTickets**: Test _rule_long_open_tickets logic.
  - `test_returns_empty_when_no_old_tickets`: No insights created when no tickets exist beyond threshold.
  - `test_creates_insight_when_tickets_exist`: Insight created when old tickets are found.
  - `test_includes_branch_in_query_conditions`: Branch parameter should be included in query.
- **TestRuleAgingUnpaidOrders**: Test _rule_aging_unpaid_orders logic.
  - `test_returns_empty_when_no_pending_payment`: No insights when there are no pending payment items.
  - `test_creates_insight_for_pending_payment`: Insight created when pending_payment item exists.
  - `test_severity_warning_for_non_high_severity`: Severity should be Warning when item severity is not 'high'.
  - `test_passes_branch_to_get_needs_attention`: Branch parameter should be passed to get_needs_attention.
- **TestRuleNotableCancellations**: Test _rule_notable_cancellations logic.
  - `test_returns_empty_when_today_count_below_min`: No insights when today's cancellation count is below minimum.
  - `test_returns_empty_when_below_baseline_multiplier`: No insights when today is not significantly above baseline.
  - `test_creates_insight_when_spike_detected`: Insight created when cancellations spike above baseline.
  - `test_creates_insight_when_no_baseline_but_count_meets_minimum`: Insight created when no baseline exists but count meets minimum.
- **TestRuleAgingStock**: Test _rule_aging_stock logic.
  - `test_returns_empty_when_no_aging_stock`: No insights when no aging stock movements exist.
  - `test_creates_insights_for_each_aging_item`: Insight created for each aging stock item.
  - `test_includes_branch_in_query_conditions`: Branch parameter should be included in query.
  - `test_calculates_net_quantity_correctly`: Net quantity should be receipt_qty - return_qty.
- **TestIntegrationScenario**: Integration tests with real database operations.
  - `test_upsert_insight_full_lifecycle`: Test complete lifecycle of creating, updating, and deduping insights.

</details>

<details>
<summary><code>ury.ury.api.test_ury_inventory_projection</code> (9)</summary>

- **TestGetAllocatableQty**
  - `test_allocatable_qty_from_bin_projected_qty_zero_reservations`
  - `test_allocatable_qty_missing_bin_returns_zero`
- **TestProjectFgAllocatable**
  - `test_fg_allocatable_matches_bin_projected_qty_minus_reservations`
- **TestProjectComponentAllocatable**
  - `test_maps_multiple_components_to_their_own_allocatable_qty`
  - `test_duplicate_components_are_deduped_and_queried_once`
- **TestReconcileProjection**
  - `test_no_drift_returns_none`
  - `test_drift_detected_when_cached_and_actual_differ`
  - `test_missing_bin_treated_as_zero_actual_qty_and_reported_as_drift`
  - `test_missing_bin_with_zero_cached_qty_is_no_drift`

</details>

<details>
<summary><code>ury.ury.api.test_ury_issue_authorization</code> (16)</summary>

- **TestURYIssueAuthorization**
  - `test_authorizes_within_entitlement`
  - `test_rejects_when_exceeding_remaining_entitlement`
  - `test_exact_demand_never_exceeds_required_qty_across_authorizations`
  - `test_rejects_unapproved_plan`
  - `test_rejects_plan_missing_approval_snapshot`
  - `test_branch_mismatch_fails_closed`
  - `test_company_scope_ambiguity_fails_closed`
  - `test_permission_check_blocks_unauthorized_actor`
  - `test_missing_frozen_demand_fails_closed`
- **TestListIssueAuthorizations**
  - `test_lists_records_scoped_by_branch`
  - `test_missing_branch_fails_closed`
  - `test_optional_department_and_date_filters_narrow_results`
- **TestRemainingEntitlementFormula**
  - `test_formula_matches_v3_30_contract`
  - `test_formula_floors_at_zero`
- **TestAttachYieldCheckAndWastageFlags**: F3 fix: each authorization row should know whether a Yield Check and/or an Issue Wastage record already exists for it, so the frontend can hide whichever action is no longer valid (mirrors the server…
  - `test_flags_set_correctly_per_row`
  - `test_no_op_for_empty_rows`

</details>

<details>
<summary><code>ury.ury.api.test_ury_job_card_controls</code> (22)</summary>

> Tests for V3-62 ury_job_card_controls.py. No bench/DB is available in this worktree (static-review only, per task instructions). These tests use `unittest.mock` to stub out `frappe.db.*`, `frappe.get_doc`, and `frappe.get_roles` so the module's control flow can be exercised without a live site, mirroring V3-61's `test_ury_batch_work_order_adapter.py` disclosure for the same environment constraint…

- **TestIsJobCardEligibleStructuralSafeguard**: MADE_TO_ORDER (every-plate) items must never be eligible for Job Card usage, no matter what the opt-in flag says -- mirrors V3-61's is_batch_eligible safeguard, since is_job_card_eligible is a strict…
  - `test_made_to_order_never_eligible_when_opted_in`
  - `test_made_to_order_never_eligible_when_not_opted_in`
  - `test_made_to_order_case_insensitive`
- **TestIsJobCardEligibleStrictSubsetOfBatchEligibility**: is_job_card_eligible must never return True where is_batch_eligible (V3-61) would return False -- Job Card usage is a strict subset of batch eligibility, never broader, never mandatory.
  - `test_batch_eligible_and_opted_in_is_job_card_eligible`
  - `test_batch_ineligible_due_to_no_opt_in_is_job_card_ineligible`
  - `test_delegates_directly_to_batch_adapter`: Byte-identical parity by construction: is_job_card_eligible must call V3-61's is_batch_eligible rather than reimplementing it.
  - `test_exhaustive_parity_with_batch_eligibility_matrix`: For every combination of policy/opt-in, is_job_card_eligible's boolean result must exactly match is_batch_eligible's.
- **TestLogChefTime**
  - `test_successful_log_by_chef`
  - `test_successful_log_by_manager`
  - `test_from_time_not_before_to_time_raises`
  - `test_equal_from_and_to_time_raises`
  - `test_bad_actor_role_fails_closed`
  - `test_no_roles_fails_closed`
  - `test_role_lookup_error_fails_closed`: Ambiguous scope (role lookup raising) must never be treated as an implicit allow.
  - `test_missing_actor_raises_before_permission_check`
  - `test_missing_job_card_ref_raises`
- **TestBuildJobCardDraft**
  - `test_produces_correct_field_mapping_with_explicit_bom`
  - `test_optional_fields_omitted_when_not_supplied`
  - `test_resolves_bom_when_not_supplied`
  - `test_zero_or_negative_for_quantity_throws`
  - `test_no_active_bom_throws_when_not_supplied`
  - `test_never_calls_any_mutation_api`: Grep-style verification: the module source for build_job_card_draft contains no call to .insert(/.save(/.submit(/ set_value(/get_doc(, and at runtime frappe.get_doc/set_value are never invoked by it.

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_cancellation_disposition</code> (17)</summary>

> Tests for resolve_cancellation_disposition in ury_kot_cancellation_service. Covers item-level disposition resolution for cancelled KOT items: 1. Return-to-stock disposition sets URY KOT Items.disposition without creating wastage. 2. Waste disposition creates exactly one URY Issue Wastage record with correct qty, item, and actor. 3. Resolving an already-resolved row raises ALREADY_RESOLVED. 4. Inv…

- **TestReturnToStockDisposition**
  - `test_return_to_stock_sets_disposition_no_wastage`: Return-to-stock disposition sets the disposition field and creates no wastage record.
  - `test_return_to_stock_accepts_valid_qty_less_than_available`: Qty validation passes when qty is less than available.
- **TestWasteDisposition**
  - `test_waste_creates_issue_wastage_record`: Waste disposition creates exactly one URY Issue Wastage record with correct fields.
  - `test_waste_uses_reason_category_when_valid`: Reason category is used when it matches a valid Select option.
  - `test_waste_defaults_to_other_for_invalid_reason_category`: Unknown reason falls back to 'Other'.
  - `test_waste_uses_cancelled_qty_when_available`: When cancelled_qty is set, it's used for validation instead of quantity.
- **TestAlreadyResolvedError**
  - `test_already_returned_to_stock_raises_already_resolved`: Resolving a row that is already Returned to Stock raises ALREADY_RESOLVED.
  - `test_already_wasted_raises_already_resolved`: Resolving a row that is already Wasted raises ALREADY_RESOLVED.
- **TestInvalidDispositionError**
  - `test_invalid_disposition_value_raises_error`: Disposition value that is not 'return_to_stock' or 'waste' raises INVALID_DISPOSITION.
  - `test_empty_disposition_raises_error`: Empty disposition string raises INVALID_DISPOSITION.
- **TestKotItemNotFoundError**
  - `test_nonexistent_item_row_name_raises_error`: KOT item row with specified name not found raises KOT_ITEM_NOT_FOUND.
  - `test_empty_kot_items_raises_error`: KOT with no items raises KOT_ITEM_NOT_FOUND for any row name.
- **TestInvalidQtyError**
  - `test_zero_qty_raises_invalid_qty`: qty=0 raises INVALID_QTY.
  - `test_negative_qty_raises_invalid_qty`: qty < 0 raises INVALID_QTY.
  - `test_non_numeric_qty_raises_invalid_qty`: Non-numeric qty raises INVALID_QTY.
  - `test_qty_exceeding_available_raises_invalid_qty`: qty > resolvable_qty raises INVALID_QTY.
  - `test_qty_equal_to_available_succeeds`: qty == resolvable_qty succeeds.

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_cancellation_service</code> (10)</summary>

> Tests for ury_kot_cancellation_service. Static-review note: none of these tests have been executed in this environment -- there is no live bench/site/DB available, only a detached checkout of the app source. They are written and hand-traced to the same mocking pattern used by `ury/ury/api/test_ury_kot_execution_service.py` and `test_ury_reservation_service.py` (patching `frappe.db.sql`, `frappe.d…

- **TestCancelBeforeStartReleasesReservation**
  - `test_cancel_before_start_calls_release_reservation_not_stock`: Cancel-before-start releases reservation eligibility only through the reservation-service contract; this module never mutates stock directly. Verifies `release_reservation` is called (mocked) and tha…
  - `test_cancel_before_start_rejects_non_queued_state`
- **TestCancelAfterStartNoMaterialRestore**
  - `test_cancel_after_start_requires_manager_and_does_not_restore_materials`
  - `test_cancel_after_start_without_manager_role_rejected`
  - `test_cancel_after_start_wrong_state_rejected`
- **TestCancelAfterReadyMarksStateOnly**
  - `test_cancel_after_ready_only_marks_state`
- **TestCancelPartialFailsClosed**
  - `test_cancel_partial_fails_closed_with_item_level_state_required`
  - `test_cancel_partial_fails_closed_even_without_item_states`
- **TestManagerConfirmationVerifiedServerSide**
  - `test_manager_confirmed_by_cannot_impersonate_another_user`: A client claiming a DIFFERENT user confirmed the cancellation than the actual session user is rejected -- manager_confirmed_by is never trusted from client input alone.
  - `test_manager_confirmation_falls_back_to_session_user_when_omitted`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_cancellation_service_permissions</code> (6)</summary>

> Permission/authorization tests for `ury_kot_cancellation_service.py`'s manager-confirmation gate (`_verify_manager_confirmation`), which guards the whitelisted `cancel_after_start`/`cancel_after_ready`/`cancel_partial` entrypoints. This module had zero permission coverage before this file (see TRACK.md Phase 4). Mock-based unit tests, matching the established pattern in this package. Pinned here …

- **TestVerifyManagerConfirmation**
  - `test_non_manager_session_user_denied`
  - `test_manager_session_user_allowed_and_returned`
  - `test_manager_confirmed_by_matching_session_manager_allowed`
  - `test_manager_confirmed_by_naming_a_different_user_is_rejected`: Anti-spoofing: even though 'realmanager@ury.test' really is a manager, a non-manager session cannot claim their confirmation by naming them in manager_confirmed_by.
  - `test_non_manager_confirmed_by_self_still_denied`
- **TestCancelBeforeStartIsIntentionallyUngated**: cancel_before_start is documented as not requiring manager confirmation (QUEUED == nothing produced/consumed yet). Confirmed by source read: it never calls _is_manager or _verify_manager_confirmation…
  - `test_cancel_before_start_never_checks_manager_role`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_chef_filter</code> (6)</summary>

- **TestGetFilteredKotList**: Static, mock-based tests for the additive V3-52 chef/manager KDS filter module. These do not require a running bench/site -- all `frappe.*` calls are mocked. Validated by hand-tracing the mocked call…
  - `test_assigned_chef_sees_only_their_unit_kots`
  - `test_lead_chef_sees_their_unit_kots`
  - `test_branch_manager_sees_all_units_in_branch`
  - `test_cashier_with_no_assignment_gets_no_chef_visibility`
  - `test_client_production_unit_cannot_expose_another_branch`
  - `test_order_type_filtering_applies_alongside_chef_filtering`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_chef_filter_permissions</code> (3)</summary>

> Real (non-mock), live-DB negative-permission tests for `get_filtered_kot_list()` in `ury_kot_chef_filter.py` (Phase 4 round 4). This module implements a fail-closed, non-throwing access-control contract (see the module's own docstring): a caller with no chef/manager relationship to any branch must get an EMPTY result, not an exception and not another user's data. These tests exercise that contrac…

- **TestGetFilteredKotListFailsClosed**: A user with zero role/unit relationship anywhere must never see any branch's KOT board, no matter what branch/company/production_unit hints they pass -- the server-derived scope resolution must win o…
  - `test_plain_user_with_no_branch_hint_gets_empty_result`
  - `test_plain_user_cannot_use_branch_hint_to_expand_scope`
  - `test_plain_user_cannot_use_production_unit_hint_to_expand_scope`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_display</code> (10)</summary>

- **TestServeKotBlocksCancelled**
  - `test_serve_rejects_cancelled_kot`
  - `test_serve_rejects_partially_cancelled_kot`
  - `test_serve_allows_non_cancelled_kot`
- **TestGetCancelConfirmedOriginalKots**
  - `test_collects_and_splits_original_kot_names`
  - `test_no_cancel_confirmed_kots_returns_empty_set`
- **TestURYKOTDisplaySEC06**
  - `test_normal_user_without_manager_role`
  - `test_manager_success`
  - `test_document_permission_fails`
  - `test_branch_permission_fails`
  - `test_administrator_bypasses_branch`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_display_serve_and_list</code> (10)</summary>

> Tests for the kitchen-display-facing endpoints in ury_kot_display.py that had zero test reference (COVERAGE_GAP_ANALYSIS.md Table 1, Top 15 item #6): `serve_kot`, `get_site_name`, `kot_list`, `served_kot_list`. This is an ironic gap: the KOT generation/execution pipeline is heavily tested elsewhere, but the actual display layer the kitchen screen calls was not. `confirm_cancel_kot` already has co…

- **TestGetSiteName**
  - `test_returns_current_site`
- **TestBuildDashboardSummary**: Pure function -- no mocking needed.
  - `test_empty_list_returns_empty_summary`
  - `test_kots_without_production_are_skipped`
  - `test_groups_by_production_and_counts_ready_vs_pending`
- **TestServeKot**
  - `test_serve_kot_updates_status_and_timing`
  - `test_serve_kot_raises_without_write_permission`
  - `test_serve_kot_rejects_non_post_requests`
- **TestServeKotEnsuresReadyBeforeServe**: Regression: an order must never reach "Served" while its item execution rows never went READY. The READY transition is what attaches the real-time production posting intent -- without it, MTO Work Or…
  - `test_pending_rows_are_marked_ready_before_serve`
  - `test_no_pending_rows_skips_ready_transition`
  - `test_ready_failure_does_not_block_serve`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_execution_service</code> (11)</summary>

> Tests for ury_kot_execution_service. Static-review note: none of these tests have been executed in this environment -- there is no live bench/site/DB available, only a detached checkout of the app source. They are written and hand-traced to the same mocking pattern used by `ury/ury/api/test_ury_reservation_service.py` (patching `frappe.db.sql`, `frappe.db.exists`, `frappe.db.get_value`, `frappe.g…

- **TestQueuedMapping**
  - `test_kot_with_no_execution_row_is_implicitly_queued`: A KOT with no `URY KOT Execution` row yet is treated as QUEUED -- this is the documented mapping for 'KOT submitted maps to QUEUED', since actual KOT-submission wiring to eagerly insert a row is out …
- **TestStartRecordsActorOnce**
  - `test_start_records_actor_and_timestamp`
- **TestDoubleStartSameKey**
  - `test_double_start_with_same_idempotency_key_returns_original`: A second call with the SAME idempotency_key must return the original transition result, not a duplicate state change -- the dedup lookup (`_find_prior_result`) short-circuits before any lock or write.
- **TestDoubleCompleteNoDuplicate**
  - `test_double_serve_with_same_key_does_not_duplicate`
  - `test_repeat_serve_different_key_returns_existing_state_without_mutating`: A second serve_execution call for an already-SERVED KOT, but with a DIFFERENT idempotency_key than the one that produced SERVED, must return the existing state as a stable already-applied response --…
- **TestCompleteWithoutStart**
  - `test_mark_ready_without_start_fails_closed`
  - `test_mark_ready_without_start_succeeds_with_manager_override`
  - `test_manager_override_rejected_for_non_manager`
  - `test_manager_override_cannot_be_spoofed_via_actor_kwarg`: N1 regression guard: start_execution/mark_ready/serve_execution must not accept a caller-supplied `actor` at all -- passing one (as a real attacker would have, pre-fix) must raise TypeError, not sile…
- **TestReverseTransitionGuard**
  - `test_start_on_already_ready_kot_fails_closed_and_preserves_state`: There is no public function whose target_state is QUEUED, so a literal READY/SERVED -> QUEUED call cannot be expressed through this module's API by construction. This test instead proves the guard's …
- **TestConcurrency**
  - `test_concurrent_start_by_two_chefs_not_executed`: Two chefs call start_execution on the same KOT 'simultaneously'; exactly one must be accepted as the recorded actor and the other must see the already-transitioned state as an idempotent/no-op result…

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_execution_service_permissions</code> (7)</summary>

> Permission/authorization tests for `ury_kot_execution_service.py`'s three whitelisted transition endpoints (`start_execution`, `mark_ready`, `serve_execution`) -- this module had zero permission coverage before this file (see TRACK.md Phase 4). Mock-based unit tests (frappe.db.* / frappe.get_roles / frappe.session), matching the established pattern in this package (`ury/ury/hooks/test_ury_pos_clo…

- **TestMarkReadyManagerOverrideGate**: `mark_ready(..., manager_override=True)` must reject a non-manager and allow a real manager through to the transition attempt.
  - `test_non_manager_with_override_denied`
  - `test_manager_with_override_is_not_rejected_by_the_gate`
  - `test_no_override_never_consults_manager_roles`
- **TestBranchScopeGapFinding**: Covers the branch-scope guard's own logic and, below, that it is actually wired into `_transition()` -- see module docstring above for the gap this closes.
  - `test_branch_scope_helper_itself_is_correct`: The helper's own logic is sound in isolation: a non-privileged user whose active branch differs from the KOT's branch is rejected. This proves the gap below is a wiring omission, not a broken helper.
  - `test_branch_scope_helper_allows_matching_branch`
  - `test_transition_now_enforces_branch_scope_guard`: FIXED: start_execution now rejects a KOT scoped to "Branch A" when the caller's active branch is "Branch B" (a different tenant's branch) -- `_require_kot_branch_scope` is invoked by `_transition` ri…
  - `test_transition_allows_caller_in_the_same_branch`: A caller whose active branch matches the KOT's branch is not rejected by the guard and reaches the write path.

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_generate</code> (37)</summary>

> Tests for ury_kot_generate. Tests cover the KOT generation workflow including item processing, KOT document creation, cancellation, array comparison utilities, and the item-to-production-unit routing integration (ury_kot_routing).

- **TestLoadJson**: Tests for load_json utility function.
  - `test_load_json_from_string`: Test loading JSON from a string.
  - `test_load_json_returns_dict_as_is`: Test that a dict is returned unchanged.
  - `test_load_json_with_list_string`: Test loading JSON array from string.
  - `test_load_json_with_empty_dict`: Test loading empty dict.
- **TestCreateOrderItems**: Tests for create_order_items function.
  - `test_create_order_items_basic`: Test creating order items from input items.
  - `test_create_order_items_fallback_to_item_code`: Test fallback to item_code when item field is missing.
  - `test_create_order_items_empty_comments`: Test handling items with no comments.
  - `test_create_order_items_multiple_items`: Test creating multiple order items.
  - `test_create_order_items_from_items_list`: Verify items are transformed correctly (alternate 'comments' key).
- **TestCompareArrays**: Tests for compare_two_array function.
  - `test_compare_arrays_identical`: Test comparing identical arrays returns empty.
  - `test_compare_arrays_with_quantity_difference`: Test array comparison with quantity changes.
  - `test_compare_arrays_with_new_item`: Test comparison when array1 has new items not in array2.
  - `test_compare_arrays_with_negative_qty`: Test array comparison when quantity decreases below array2.
- **TestGetRemovedItems**: Tests for get_removed_items function.
  - `test_get_removed_items_none`: Test when no items are removed.
  - `test_get_removed_items_one_removed`: Test detecting single removed item.
  - `test_get_removed_items_multiple_removed`: Test detecting multiple removed items.
- **TestGetAllProductionItemGroups**: Tests for get_all_production_item_groups function.
  - `test_get_production_item_groups_single_unit`: Test getting item groups from a single production unit.
  - `test_get_production_item_groups_multiple_units`: Test getting item groups from multiple production units.
  - `test_get_production_item_groups_no_units`: Test when no production units exist for branch.
  - `test_get_production_item_groups_empty_item_groups`: Test production unit with no item groups.
- **TestCreateKotDoc**: Tests for create_kot_doc function.
  - `test_create_kot_doc_with_table`: Test creating a KOT document with a restaurant table: branch/menu is derived from the table's room/restaurant, never from getBranch() (removed -- see the comment in create_kot_doc for why session-bra…
  - `test_create_kot_doc_without_table`: Test creating a KOT document without a restaurant table (takeaway): menu is derived from the INVOICE's own branch (pos_invoice.branch), not from the acting user's session branch.
- **TestCreateCancelKotDoc**: Tests for create_cancel_kot_doc function.
  - `test_create_cancel_kot_doc_success`: Test successfully creating a cancel KOT document. Branch/menu is derived from the table (with-table path never used getBranch); no getBranch mock needed (removed -- see the comment in create_cancel_k…
- **TestProcessItemsForKot**: Integration tests for process_items_for_kot() wired to the unified resolver. Tests verify that: 1. The resolver is called for each item with correct company/branch 2. Items are grouped by resolved pr…
  - `test_items_routed_via_resolver_to_correct_production_units`: Verify resolver is called and items grouped correctly by production unit.
  - `test_routing_not_configured_error_fails_the_batch`: ROUTING_NOT_CONFIGURED for a controlled item must fail the whole KOT batch closed (sa-post-373-review-fixes Blocker 2), not be silently skipped -- a customer must never be charged for an item the kit…
  - `test_direct_retail_item_is_exempt_without_raising`: A DIRECT_RETAIL item (resolve_production_units returning []) does not raise and does not get a KOT -- it genuinely has no production routing requirement.
  - `test_validation_dedup_key_set_for_first_kot_only`: validation_dedup_key is only set for the first KOT per invoice+production.
  - `test_existing_kot_uses_order_modified_type`: When KOT already exists, subsequent KOTs use 'Order Modified' type.
  - `test_no_production_units_raises_error`: If no production units exist for branch, error is raised.
- **TestProcessItemsForCancelKot**: Integration tests for process_items_for_cancel_kot() wired to the unified resolver.
  - `test_cancel_items_routed_via_resolver`: Verify resolver is called for cancel items and KOTs are created.
  - `test_cancel_routing_not_configured_fails_the_batch`: ROUTING_NOT_CONFIGURED for a controlled cancel item must fail closed too, for the same reason as the New/Modified path (sa-post-373-review- fixes Blocker 2).
- **TestCreateOrderItemsPreserved**: Tests for create_order_items() helper (preserved functionality).
  - `test_create_order_items_from_items_list`: Verify items are transformed correctly.
- **TestLineKeyedItems**: Regression tests for _line_keyed_items(): the stable per-line key that replaced bare item_code matching for KOT delta/cancellation (sa-architecture-closure). Core scenario from the review: "2x Chicke…
  - `test_two_identical_item_lines_get_distinct_keys`
  - `test_explicit_reservation_line_key_is_respected`
  - `test_plain_duplicate_lines_with_no_context_still_get_distinct_keys`: Same item, same (empty) comment/course, added twice separately -- the occurrence counter must still keep them apart.
- **TestKotExecuteLineIdentity**: End-to-end regression: cancelling one of two identical-item lines must only affect that line's KOT delta, never the sibling line.
  - `test_removing_one_of_two_identical_lines_cancels_only_that_line`
- **TestCreateCancelKotDocLineIdentity**: Regression: create_cancel_kot_doc() must attach the cancellation to the exact original KOT line (by reservation_line_key), not to every KOT line sharing the same item_code -- and must not duplicate t…
  - `test_cancel_only_matches_the_tagged_line`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_generate_permissions</code> (1)</summary>

> Real (non-mock), live-DB negative-permission test for `kot_execute()` in `ury_kot_generate.py` (Phase 4 round 4). `kot_execute` is the whitelisted entrypoint that turns a POS Invoice's current/previous item diff into KOT documents. It explicitly checks `frappe.has_permission("POS Invoice", "write", doc=pos_invoice)` and throws `frappe.PermissionError` before doing any item-diffing or KOT creation…

- **TestKotExecutePermission**
  - `test_plain_user_without_pos_invoice_write_access_is_rejected`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_item_execution_service</code> (17)</summary>

- **TestKotItemExecutionAuthorization**
  - `test_doctype_denies_direct_create_and_write`
  - `test_transition_is_service_owned_and_uses_permission_bypass`
- **TestServeItemExecutionBlocksCancelledKot**
  - `test_rejects_cancelled_kot`
  - `test_rejects_partially_cancelled_kot`
  - `test_allows_non_cancelled_kot`
- **TestKotItemExecution**
  - `test_seed_creates_one_row_per_kot_item_and_is_idempotent`
  - `test_item_transitions_update_aggregate_state`
  - `test_revision_key_is_stamped_at_seed_and_differs_from_idempotency_key`
  - `test_state_transitions_never_advance_revision_key`: The bug: `_transition` rewrites `idempotency_key` on EVERY state change, including READY -> SERVED, and the G-07 gate was reading that field as the line's revision. The client sends a different key p…
  - `test_bump_advances_revision_key_for_a_genuine_re_fire`: The only writer of `revision_key`: a real edit / re-fire of the line. This is what keeps G-07's revision half meaningful after the fix -- a posting frozen against the previous revision is still corre…
  - `test_seed_on_submit_uses_kot_name_not_document`: Regression: the URY KOT on_submit hook was calling seed_kot_item_executions(doc) with the full Document instead of doc.name. seed_kot_item_executions()/_kot_items() feed that value straight into frap…
- **TestAttachReadyPostingIntent**: sa-architecture-closure (Gap A): `mark_item_ready` must never let both native POS deduction and fulfilment posting become authoritative for the same item. `_attach_ready_posting_intent` is the sole c…
  - `test_skips_posting_intent_when_flag_is_off`
  - `test_skips_posting_intent_when_branch_has_no_policy_row`: A branch with no stock-policy row resolves to all-gates-off (Tier 1 default), which must still skip posting quietly -- same behaviour as an explicit False.
  - `test_skips_posting_intent_when_reservations_only_tier`: reservation_control_enabled=True but realtime_production_posting_enabled still False (the 'reservations only' tier) must also skip posting.
  - `test_creates_posting_intent_when_flag_is_on`
  - `test_made_to_order_only_restriction_still_holds_with_gate_on`: Even with realtime_production_posting_enabled=True, a PRE_PRODUCED item must not post -- that decision belongs solely to `create_or_get_posting_intent_for_ready` (Phase 0/1 fix), which this repoint m…
  - `test_idempotent_replay_never_touches_posting_intent`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_item_execution_service_permissions</code> (6)</summary>

> Permission/authorization tests for `ury_kot_item_execution_service.py`'s `_require_execution_actor()` gate, which guards the whitelisted `start_item_execution`/`mark_item_ready`/`serve_item_execution` entrypoints. This module had zero permission coverage before this file (see TRACK.md Phase 4). Unlike its sibling `ury_kot_execution_service.py` (see `test_ury_kot_execution_service_permissions.py`'…

- **TestRequireExecutionActor**
  - `test_administrator_always_allowed_without_role_or_branch_check`
  - `test_user_without_execution_role_denied`
  - `test_user_with_execution_role_but_wrong_branch_denied`: Role alone is not enough -- a Chef assigned to Branch B must still be rejected for a KOT scoped to Branch A (the branch-scope guard is actually invoked, not just the role check).
  - `test_user_with_execution_role_and_matching_branch_allowed`
  - `test_missing_company_denied_even_with_role_and_branch_ok`
  - `test_manager_roles_are_also_execution_roles`: EXECUTION_ROLES = MANAGER_ROLES | {Chef, URY Chef, Production Manager} -- a manager can execute items directly, not just chefs.

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_mto_coexistence</code> (1)</summary>

> N8: coexistence test for the Work-Order path (N4, `ury_mto_work_order_service.create_work_orders_for_kot`) and the existing reservation-based MTO fulfilment path (`ury_reservation_service`). Scope note (documented per this task's instructions): `ury_reservation_service.create_reservation` takes a row lock on `tabBin` via a raw DB connection (`committed_read_connection`/`_lock_bin_row`) and resolv…

- **TestKotMtoCoexistence**
  - `test_work_order_creation_does_not_touch_existing_reservation`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_notification</code> (3)</summary>

- **TestCreateSystemNotification**: `create_system_notification` must dedupe on (for_user, subject) within a short recent window before inserting a new `Notification Log`, rather than blindly inserting on every call (the bug fixed in t…
  - `test_duplicate_call_within_window_is_not_inserted_twice`
  - `test_different_subject_is_not_deduped`
- **TestOrderDelayNotificationPermissionBoundary**: order_delay_notification gates on frappe.has_permission("URY KOT", "write", doc=kot_doc) and raises frappe.PermissionError (not a generic ValidationError) when the calling user lacks write access to …
  - `test_roleless_user_cannot_send_notification_for_kot_they_cannot_write`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_notification_permissions</code> (2)</summary>

> Real (non-mock), live-DB negative-permission test for `order_delay_notification()` in `ury_kot_notification.py` (Phase 4 round 4). `order_delay_notification` loads the target `URY KOT` document and then explicitly checks `frappe.has_permission("URY KOT", "write", doc=kot_doc)`, throwing `frappe.PermissionError` if the caller lacks write access. `URY KOT`'s own DocType permission rules (see `ury/u…

- **TestOrderDelayNotificationPermission**
  - `test_plain_user_without_kot_write_role_is_rejected`
  - `test_administrator_is_not_rejected_by_the_permission_gate`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_order_number</code> (10)</summary>

> Tests for ury_kot_order_number. Tests for the KOT order numbering module that assigns sequential order numbers to POS Invoices based on the POS Opening Entry last invoice tracking. Covers: 1. Order number calculation when last invoice exists (difference or fallback) 2. Order number initialization when no last invoice exists 3. Aggregators order type handling (with "AGR - " prefix) 4. Regular orde…

- **TestSetOrderNumber**: Test set_order_number function for POS Invoice order numbering.
  - `test_calculates_order_number_from_last_invoice_difference`: When last_invoice exists in POS Opening Entry, order number is calculated as the difference between current and last invoice numbers.
  - `test_handles_order_number_rollover`: When current invoice number is less than last invoice number, use current invoice number as the order number instead.
  - `test_aggregators_order_type_with_last_invoice`: Aggregators orders get "AGR - " prefix when last invoice exists.
  - `test_initializes_last_invoice_when_none_exists`: When no last_invoice in POS Opening Entry, initialize it from the last doc in the system and set order number to default.
  - `test_initializes_aggregators_with_default_agr_1`: When initializing Aggregators order with no last invoice, set default to "AGR - 1".
  - `test_pos_profile_determines_sequence`: Order numbers are per POS profile - profiles have independent sequences.
- **TestSetLastInvoiceInPosOpen**: Test set_last_invoice_in_pos_open function for POS Opening Entry.
  - `test_sets_last_regular_invoice`: When creating POS Opening Entry, set custom_ury_last_invoice to the last non-Aggregator POS Invoice for that profile.
  - `test_sets_last_aggregator_invoice`: When creating POS Opening Entry, also set custom_ury_last_aggregator_invoice.
  - `test_handles_no_previous_invoices_gracefully`: When no previous invoices exist, function should not fail.
  - `test_sets_both_invoice_types`: Both regular and aggregator invoices are set when they exist.

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_reprint</code> (4)</summary>

- **TestReprintKOTAuthorization**: Phase 3: reprint_kot() previously only checked printer/config prerequisites. These cover the added invoice-read permission, branch check, and Captain ownership/elevated-access gate.
  - `test_denied_without_read_permission`
  - `test_denied_outside_active_branch`
  - `test_denied_for_another_captains_order_without_elevated_access`
  - `test_allowed_for_owning_captain`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_routing</code> (11)</summary>

- **TestResolveProductionUnits**: Static, mock-based tests for the additive V3-51 routing module. These do not require a running bench/site — all `frappe.db` / `frappe.get_all` / `frappe.get_meta` calls are mocked. Validated by hand-…
  - `test_exact_item_mapping_routes_correctly`
  - `test_item_group_fallback_mirrors_legacy_and_returns_multiple_units`
  - `test_missing_mapping_for_controlled_item_fails_closed`
  - `test_ambiguous_exact_mappings_fail_closed_no_partial_result`
  - `test_disabled_department_blocks_routing`
  - `test_disabled_production_unit_blocks_routing`
  - `test_direct_retail_item_returns_empty_without_explicit_config`
  - `test_direct_retail_item_routes_when_explicitly_configured`
  - `test_direct_retail_item_with_explicit_config_and_no_production_unit_returns_empty`
  - `test_manufactured_item_with_explicit_config_and_no_production_unit_raises`
  - `test_missing_branch_or_company_fails_closed`

</details>

<details>
<summary><code>ury.ury.api.test_ury_kot_validation</code> (20)</summary>

> Tests for URY KOT Validation API module. Tests cover KOT creation workflow, invoice processing, and error log tracking with proper permission handling for the get_kot_errors() API endpoint.

- **TestGetUnprocessedInvoices**: Tests for get_unprocessed_invoices() database query.
  - `test_get_unprocessed_invoices_returns_list`: Should query and return invoices with docstatus=0 within time range.
  - `test_get_unprocessed_invoices_empty_list`: Should return empty list when no unprocessed invoices exist.
  - `test_get_unprocessed_invoices_passes_time_range`: Should pass start and end times to database query.
- **TestGetProductionsForBranch**: Tests for get_productions_for_branch() lookup.
  - `test_get_productions_for_branch_returns_list`: Should fetch production units filtered by branch.
  - `test_get_productions_for_branch_empty_result`: Should return empty list when no production units exist for branch.
- **TestCreateKotLog**: Tests for create_kot_log() function.
  - `test_create_kot_log_inserts_log_entry`: Should create and insert KOT error log document.
  - `test_create_kot_log_publishes_realtime`: Should publish realtime event on dedicated channel.
- **TestCreateKot**: Tests for create_kot() function.
  - `test_create_kot_inserts_and_submits_document`: Should create, populate, insert, and submit KOT document.
  - `test_create_kot_populates_fields`: Should populate all KOT fields with correct values.
  - `test_create_kot_appends_items`: Should append all production items to KOT.
- **TestProcessInvoice**: Tests for process_invoice() workflow.
  - `test_process_invoice_creates_kot_when_none_exists`: Should create KOT if none exists for invoice.
  - `test_process_invoice_skips_when_kot_exists`: Should not create KOT if one already exists for invoice.
- **TestGetKotErrors**: Tests for get_kot_errors() API endpoint with permission checks.
  - `test_get_kot_errors_returns_logs`: Should return KOT error logs filtered by POS Profile.
  - `test_get_kot_errors_throws_when_not_found`: Should throw DoesNotExistError when POS Profile does not exist.
  - `test_get_kot_errors_non_supervisor_branch_check`: Non-supervisor cannot access POS Profile from different branch.
  - `test_get_kot_errors_supervisor_access`: URY Manager can access any branch POS Profile.
  - `test_get_kot_errors_limits_results`: Should limit results to 50 per call.
  - `test_get_kot_errors_filters_correctly`: Should filter logs by branch and pos_profile.
- **TestKotValidationThread**: Tests for kotValidationThread() background task.
  - `test_kot_validation_thread_time_range`: Should fetch invoices within 1-5 minute window.
  - `test_kot_validation_thread_empty_list`: Should handle case when no invoices need processing.

</details>

<details>
<summary><code>ury.ury.api.test_ury_manufacture_enforcement</code> (7)</summary>

- **TestValidateManufactureRequiresWorkOrder**
  - `test_blocks_pre_produced_in_house_finished_item_without_work_order`
  - `test_allows_pre_produced_in_house_finished_item_with_work_order`
  - `test_never_blocks_made_to_order_finished_item_regardless_of_work_order`
  - `test_ignores_non_manufacture_stock_entries`
  - `test_ignores_non_finished_item_rows`
  - `test_allows_bulk_production_originated_entry_without_work_order`
  - `test_no_ops_when_configuration_lookup_raises`

</details>

<details>
<summary><code>ury.ury.api.test_ury_menu_course_validation</code> (13)</summary>

> Unit tests for ury_menu_course_validation API module. Tests the priority validation hook that ensures no two URY Menu Course documents share the same custom_serving_priority value.

- **TestValidatePriority**: Tests for validate_priority function that enforces unique priorities.
  - `test_priority_validation_passes_when_priority_is_unique`: Happy path: new priority doesn't conflict with any existing course.
  - `test_priority_validation_raises_when_priority_exists_on_other_course`: Error case: priority is already assigned to another course.
  - `test_priority_validation_allows_updating_same_course_with_same_priority`: Edge case: updating an existing course with its current priority should pass.
  - `test_priority_validation_handles_none_priority`: Edge case: None/null priority should not trigger validation.
  - `test_priority_validation_checks_correct_doctype_and_fields`: Verify that validation queries the correct DocType and filters.
  - `test_priority_validation_multiple_courses_with_different_priorities`: Multiple courses scenario: each with unique priority should pass.
  - `test_priority_validation_error_message_includes_priority_value`: Error message should clearly indicate which priority caused the conflict.
  - `test_priority_validation_zero_as_valid_priority`: Edge case: zero can be a valid priority value.
  - `test_priority_validation_large_priority_value`: Edge case: large integer priority values should work.
  - `test_priority_validation_duplicate_error_suggests_different_priority`: Error message should help user understand the action needed.
- **TestValidatePriorityIntegration**: Integration-style tests that create actual documents.
  - `test_priority_validation_prevents_duplicate_on_insert`: Integration test: inserting a course with duplicate priority fails.
  - `test_priority_validation_allows_duplicate_on_same_course_update`: Integration test: updating a course's own priority should pass.
  - `test_priority_validation_allows_different_priorities`: Integration test: courses with different priorities coexist.

</details>

<details>
<summary><code>ury.ury.api.test_ury_mto_fulfilment_service</code> (11)</summary>

> Tests for ury_mto_fulfilment_service. Static-review note: none of these tests have been executed in this environment -- there is no live bench/site/DB available, only a detached checkout of the app source. They are written and hand-traced to the exact same mocking pattern used by `ury/ury/api/test_ury_preproduced_fulfilment_service.py` (V3-71): patching `frappe.db.exists`, `frappe.db.get_value`, …

- **TestSuccessfulFulfilment**
  - `test_fulfils_reservation_group_and_creates_fulfilment_record`
  - `test_served_state_also_accepted`
- **TestDuplicateBatchKey**
  - `test_duplicate_batch_key_returns_original_no_double_post`: A second call with the SAME batch_key for an already-fulfilled (kot, item_code) must return the original record unchanged -- no second fulfil_reservation call, no second `URY Fulfilment Record` row.
- **TestRetryAfterFailureThenSuccess**
  - `test_retry_after_simulated_reservation_failure_then_success_posts_exactly_once`: Core exactly-once-under-retry trace: 1. First call with batch_key="X": `fulfil_reservation` is forced to raise (simulating a reservation-group failure, e.g. a row no longer Reserved). No `URY Fulfilm…
- **TestDifferentBatchKeyAgainstAlreadyFulfilled**
  - `test_different_batch_key_against_already_fulfilled_returns_stable_no_op`: A DIFFERENT batch_key against an already-fulfilled (kot, item_code) must not raise and must not double-post -- it returns the existing state as a stable no-op, mirroring V3-71's exact semantics (V3-7…
- **TestRejectedExecutionNotReady**
  - `test_rejects_when_execution_not_ready_or_served`
- **TestRejectsWhenReservationGroupNotReserved**
  - `test_rejects_when_reservation_group_not_reserved`: If the reservation group does not exist, or any row in it is not in Reserved state, `fulfil_reservation` itself raises `frappe.ValidationError` (V3-43's `_transition_group` refuses a partial transiti…
- **TestNoRealStockMutationAPI**
  - `test_source_never_references_real_stock_mutation_apis`: Grep-style static check: this service module and the shared `URY Fulfilment Record` doctype controller must never reference a real ERPNext stock mutation API (`Stock Entry`, `frappe.db.set_value`, or…
- **TestFulfilMtoOrderRealPermissionBoundary**: Real (non-mocked, `frappe.set_user()`-based) negative-permission coverage for `fulfil_mto_order()`'s `_require_create_permission()` gate. Every other test in this file mocks `frappe.has_permission` i…
  - `test_read_only_role_cannot_fulfil_mto_order`
  - `test_no_role_user_cannot_fulfil_mto_order`
  - `test_nonexistent_kot_reports_kot_not_found_even_for_unprivileged_user`: Documents the REAL fail-closed ordering found by this test class: the KOT-existence check runs before the create-permission check, so an unprivileged caller probing a nonexistent KOT sees KOT_NOT_FOU…

</details>

<details>
<summary><code>ury.ury.api.test_ury_mto_work_order_service</code> (14)</summary>

> Tests for ury_mto_work_order_service (N4). Static-review note: no live bench/site/DB is available in this environment -- these tests mock `frappe.db.exists`, `frappe.get_doc`, `frappe.get_meta`, `frappe.db.get_value`, `frappe.db.set_value`, `frappe.db.savepoint`, and `resolve_production_context` at the module boundary, following the same mocking pattern as `test_ury_mto_fulfilment_service.py`.

- **TestCreateWorkOrdersForKot**
  - `test_made_to_order_item_with_bom_creates_submitted_work_order`
  - `test_work_order_is_linked_to_production_plan_and_flagged_from_mto_kot`: The order-triggered Work Order must reference the day's Production Plan and its item's Production Plan Item row -- even when that row is a MADE_TO_ORDER row flagged custom_ury_no_work_order (batch gu…
  - `test_pre_produced_and_direct_retail_items_are_skipped`
  - `test_recall_for_same_kot_does_not_duplicate_work_orders`: A row that already has `custom_ury_work_order` set is skipped on a re-invocation -- idempotency.
  - `test_item_with_no_resolvable_bom_is_recorded_under_errors_without_raising`
  - `test_nonexistent_kot_returns_error_without_raising`
- **TestFirstUsablePlanRow**: Selection rules for the Production Plan Item a Work Order may link to. Unflagged rows always win. Flagged rows (``custom_ury_no_work_order`` -- a MADE_TO_ORDER row's own batch-guard) are returned ONL…
  - `test_flagged_mto_row_alone_returns_none`
  - `test_flagged_row_does_not_shadow_usable_row`
  - `test_usable_row_is_returned`
  - `test_unset_flag_counts_as_usable`
  - `test_empty_and_all_flagged_return_none`
  - `test_allow_flagged_row_when_only_match`: MTO KOT path: an MTO item's own row IS flagged, and that flagged row is the correct link target for the order-triggered Work Order.
  - `test_allow_still_prefers_unflagged_row`
  - `test_allow_empty_returns_none`

</details>

<details>
<summary><code>ury.ury.api.test_ury_order_attribution</code> (23)</summary>

> Tests for ury_order_attribution: who an order is recorded for, and who owes. Covers the fail-closed rules that keep attribution trustworthy: 1. Passing a performer while the POS Profile flag is off is an error, not a silently dropped field. 2. The acting user must hold a role the profile permits. 3. The performer must be an active employee of the order's branch. 4. A profile that requires a perfo…

- **TestResolveOrderPerformer**
  - `test_returns_none_when_no_performer_requested`
  - `test_feature_off_rejects_supplied_performer`
  - `test_role_not_permitted_is_denied`
  - `test_system_manager_bypasses_role_list`
  - `test_unknown_employee_is_rejected`
  - `test_inactive_employee_is_rejected`
  - `test_employee_from_another_branch_is_rejected`
  - `test_happy_path_returns_employee`
  - `test_required_performer_blocks_a_new_order`
  - `test_required_performer_leaves_existing_order_editable`
- **TestResolveLinePerformers**
  - `test_no_line_performers_skips_all_lookups`
  - `test_distinct_employees_are_validated_once_each`
- **TestCreditSettlement**
  - `test_credit_mode_hidden_when_disabled`
  - `test_disabled_profile_rejects_credit`
  - `test_account_from_another_branch_is_rejected`
  - `test_branchless_account_is_allowed_anywhere`
  - `test_disabled_account_is_rejected`
  - `test_charge_within_limit_is_allowed`
  - `test_charge_over_limit_is_rejected`
  - `test_zero_limit_means_unlimited`
- **TestListEligiblePerformers**
  - `test_returns_empty_when_feature_is_off`
  - `test_denies_a_user_without_an_allowed_role`
  - `test_scopes_to_the_profile_branch_and_active_staff`

</details>

<details>
<summary><code>ury.ury.api.test_ury_order_reservation_service</code> (20)</summary>

- **TestOrderReservationLineIsolation**
  - `test_resolve_production_context_uses_existing_config_reader`
  - `test_same_item_distinct_lines_do_not_collapse`
  - `test_active_groups_only_returns_matching_line_key`
  - `test_changed_line_releases_only_its_matching_group_before_recreate`
  - `test_not_sellable_item_is_rejected_before_reservation`: D1: a line the availability engine marks not-sellable must be rejected at reservation time, and must not release/recreate any reservation group.
  - `test_line_removal_is_not_gated_by_availability`: Reducing/removing a line (requested qty <= 0) must still be able to release an existing reservation even if the item has since become not-sellable -- only a net increase should be availability-gated.
  - `test_partial_decrease_of_unsellable_item_is_not_gated`: B-3 regression: reducing a line's qty (but not to zero) on an item that has since become unsellable must NOT be blocked -- only a net INCREASE (accepted_qty > previous_qty) may be gated by availabili…
- **TestReconcileOrderReservationsPreflight**: B-4 regression: a rejected line in a multi-line sync must abort before ANY line's reservation state is mutated -- not mid-loop after earlier lines have already been released/recreated.
  - `test_one_unavailable_line_aborts_before_any_reservation_mutation`
  - `test_mixed_increase_and_decrease_both_apply_when_all_sellable`
- **TestReleaseOrderReservations**: release_order_reservations() -- used by cancel_order() so cancellation does not leak reserved capacity (sa-post-373-review-fixes Blocker 3).
  - `test_releases_every_distinct_active_group_for_the_order`
  - `test_no_active_reservations_is_a_no_op`
  - `test_no_order_ref_is_a_no_op`
  - `test_calling_again_after_already_released_does_not_double_decrement`: Idempotency: the second call must not re-invoke release_reservation (and therefore must not re-apply its committed_qty decrement) once every reservation for the order is already out of Reserved statu…
  - `test_already_fulfilled_group_is_skipped_not_released`: G-09: under POS Stock Authority V2 a made-to-order item's reservation is Fulfilled at production time. Cancelling the order must still complete -- release_reservation would frappe.throw on a group th…
  - `test_partly_fulfilled_group_is_skipped_rather_than_partially_released`: A group with a mix of statuses is exactly what _transition_group refuses; skip it here so the cancellation as a whole still succeeds.
- **TestPlanExhaustedEnforcementMode**: _check_line_availability()'s Hard/Soft/Alert branching on PLAN_EXHAUSTED.
  - `test_hard_mode_returns_rejection`
  - `test_soft_mode_allows_through_with_no_notification`
  - `test_alert_mode_allows_through_and_fires_notification`
  - `test_non_plan_exhausted_reason_is_unaffected_by_enforcement_mode`
  - `test_alert_notification_resolves_branch_scoped_recipients_and_dedupes`

</details>

<details>
<summary><code>ury.ury.api.test_ury_pos_invoice_qty_reduction</code> (23)</summary>

> Tests for ury_pos_invoice_qty_reduction. Tests the qty-reduction API used by both cashier (Register) and captain (order UI) frontends to reduce item quantities on a printed POS Invoice when the order type is configured as allowed in the POS Profile. Static-review note: these tests are hand-traced against the module logic and the sibling ury_kot_generate.py / ury_pos_invoice.py patterns. None have…

- **TestQtyReductionOnAllowedOrderType**: Test successful qty reduction on an order type explicitly allowed by POS Profile.
  - `test_reduce_qty_creates_partial_cancel_kot_with_correct_delta`: Reducing item qty from 2 to 1 should: 1. Update invoice item qty to 1 2. Create a cancel-KOT with cancelled_qty = 1 (the delta) 3. Return invoice state including delta=-1 and cancel_kot_names
  - `test_reduce_qty_to_zero_full_removal`: Reducing qty to 0 should fully remove the item and create cancel-KOT for entire qty.
  - `test_reduce_qty_by_row_name_does_not_remove_other_row_with_same_item_code`: Two rows share the same item_code; reducing one by its row name must leave the other row (and its qty) completely untouched.
  - `test_reduce_qty_bypass_bypasses_validate_invoice_guard`: Qty reduction with frappe.flags.ury_qty_reduction set should bypass validate_invoice's post-print guard (no throw).
- **TestQtyReductionOnDisallowedOrderType**: Test qty reduction rejection on order types NOT in the allow-list.
  - `test_disallowed_order_type_raises_order_type_not_allowed_error`: Order type "Phone In" not in allow-list should raise ORDER_TYPE_NOT_ALLOWED.
  - `test_empty_allowed_order_types_fails_closed`: Empty custom_qty_reduction_allowed_order_types should reject ANY order type.
  - `test_unset_order_type_treated_as_not_allowed`: Invoice with order_type=None should fail when list is non-empty.
- **TestInvalidQtyValidation**: Test qty validation: must satisfy 0 <= new_qty < current_qty, and integral.
  - `test_negative_qty_raises_invalid_qty`: new_qty < 0 should raise INVALID_QTY.
  - `test_qty_equal_to_current_qty_raises_invalid_qty`: new_qty == current_qty is not a reduction (must be < current_qty).
  - `test_qty_greater_than_current_qty_raises_invalid_qty`: new_qty > current_qty is an increase, not a reduction.
  - `test_non_numeric_qty_raises_invalid_qty`: Non-numeric new_qty (e.g. 'two') should raise INVALID_QTY.
  - `test_fractional_qty_raises_invalid_qty`: A fractional new_qty (e.g. 1.5) must be rejected: reduce_order_item_qty only supports whole-number reductions, matching the cancel-KOT row's integer `cancelled_qty` (ury_kot_generate.create_cancel_ko…
- **TestInvoiceAndItemNotFoundErrors**: Test error handling for missing invoices and items.
  - `test_invoice_not_found_raises_invoice_not_found_error`: Non-existent invoice should raise INVOICE_NOT_FOUND.
  - `test_item_not_found_raises_item_not_found_error`: Invoice without the requested item row should raise ITEM_NOT_FOUND.
  - `test_item_code_mismatch_raises_item_not_found_error`: An `item_code` that doesn't match the resolved row's item_code should raise ITEM_NOT_FOUND (the row is the authority; item_code is only a secondary sanity check).
- **TestPermissionChecks**: Test permission validation.
  - `test_no_write_permission_raises_not_permitted_error`: Caller without write permission should raise NOT_PERMITTED.
  - `test_has_permission_is_checked_against_session_user_not_client_supplied_value`: `frappe.has_permission` must be called with `frappe.session.user` -- never a value the client could supply -- since a caller-supplied "actor" would otherwise let anyone forge write access to invoices…
- **TestKOTNamingSeriesValidation**: Test KOT naming series configuration validation.
  - `test_missing_kot_naming_series_raises_error`: POS Profile without custom_kot_naming_series should raise KOT_NAMING_SERIES_MISSING.
- **TestLastItemCannotBeRemoved**: Test that removing the sole remaining item on an invoice is rejected.
  - `test_removing_only_item_raises_last_item_cannot_be_removed`: new_qty=0 on an invoice with exactly one item row should raise LAST_ITEM_CANNOT_BE_REMOVED instead of leaving a zero-item invoice.
  - `test_removing_one_of_several_items_is_allowed`: new_qty=0 is still allowed when other item rows remain on the invoice.
- **TestValidateInvoiceGuardRegression**: Regression test: verify that the validate_invoice guard still blocks direct qty modifications that DON'T go through reduce_order_item_qty.
  - `test_direct_qty_modification_on_printed_invoice_without_flag_should_fail`: Simulating a direct qty modification (not via reduce_order_item_qty) on a printed invoice should fail in validate_invoice because the ury_qty_reduction flag is NOT set. This is a regression test to e…
- **TestActorAuthority**: Test that the actor recorded/authorized is always frappe.session.user, never a client-supplied value -- the actor-as-authority permission bug.
  - `test_actor_is_always_session_user`: The returned `actor` must be frappe.session.user.
  - `test_reduce_order_item_qty_has_no_client_supplied_actor_parameter`: There must be no `actor` parameter a caller could use to forge permission/authority -- it should not appear in the function signature at all.

</details>

<details>
<summary><code>ury.ury.api.test_ury_prepare_production</code> (24)</summary>

> Unit tests for the Prepare Production orchestrator. Same mocking style as ``test_ury_production_transfer.py``: ``FrappeTestCase`` for the test-runner site context, with every frappe call and every collaborator module function (``execute_store_to_department_transfer``, ``execute_department_targets``, ``compile_production_targets``, ``compute_readiness``, ``is_job_enqueued``) patched, so no real Sa…

- **TestPrepareProductionPreflight**: prepare_production -- synchronous preflight + enqueue (D5).
  - `test_not_a_department_plan_throws`
  - `test_unsubmitted_plan_throws`
  - `test_already_processing_is_double_click_guard`
  - `test_store_shortage_blocks_and_sets_awaiting_materials`
  - `test_compiler_blocker_blocks`
  - `test_clean_preflight_enqueues_and_stamps_fields`
- **TestRunPrepareProductionJob**: run_prepare_production_job -- the background job body (D17).
  - `test_stale_attempt_is_a_noop`
  - `test_no_longer_processing_is_a_noop`
  - `test_transfer_blocker_reverts_to_awaiting_materials`
  - `test_success_sets_completed_with_generated_documents`
  - `test_exception_sets_failed_and_reraises`
  - `test_compile_blocker_after_transfer_reverts_to_awaiting_materials`
- **TestGetProductionState**
  - `test_shape_and_blockers_decoded`
  - `test_can_reset_true_only_when_stale_dead_and_system_manager`
  - `test_can_reset_false_when_job_still_running_despite_stale_heartbeat`
  - `test_can_reset_false_for_non_system_manager`
  - `test_processing_prefers_cache_heartbeat_and_step`
- **TestGetSalesPlanProductionStates**
  - `test_merges_link_state_and_execution_state`
- **TestResetStaleExecution**
  - `test_refuses_non_system_manager`
  - `test_refuses_when_not_processing`
  - `test_refuses_when_heartbeat_not_stale`
  - `test_refuses_when_job_still_enqueued_however_stale`
  - `test_resets_when_stale_and_dead`
  - `test_refuses_when_cache_heartbeat_still_fresh`: Live cache heartbeat wins over a stale DB heartbeat (D17).

</details>

<details>
<summary><code>ury.ury.api.test_ury_preproduced_fulfilment_service</code> (11)</summary>

> Tests for ury_preproduced_fulfilment_service. Static-review note: none of these tests have been executed in this environment -- there is no live bench/site/DB available, only a detached checkout of the app source. They are written and hand-traced to the same mocking pattern used by `ury/ury/api/test_ury_kot_execution_service.py` and `ury/ury/api/test_ury_reservation_service.py` (patching `frappe.…

- **TestSuccessfulFulfilment**
  - `test_fulfils_reservation_and_creates_fulfilment_record`
  - `test_served_state_also_accepted`
- **TestRejectedReservationNotReserved**
  - `test_fulfil_reservation_failure_propagates_and_no_record_created`: If the reservation does not exist, or is not in Reserved state, `fulfil_reservation` itself raises `frappe.ValidationError`. This module must let that propagate (fail closed) and must NOT create a `U…
- **TestRejectedExecutionNotReady**
  - `test_rejected_when_queued`
  - `test_rejected_when_in_preparation`
  - `test_rejected_when_no_execution_row_yet`
- **TestIdempotentReplay**
  - `test_repeat_call_same_kot_item_returns_original_no_double_fulfil`: A second call for the same (kot, item_code) that already has a PRE_PRODUCED `URY Fulfilment Record` row must return that row unchanged -- it must NOT re-check execution state, must NOT call `fulfil_r…
- **TestNoRealStockMutationAPI**
  - `test_source_never_references_real_stock_mutation_apis`: Grep-style static check: the service module and its own new doctype controller must never reference a real ERPNext stock mutation API (`Stock Entry`, `frappe.db.set_value(..., "Bin", ...)`, or `.subm…
- **TestFulfilPreproducedOrderRealPermissionBoundary**: Real (non-mocked, `frappe.set_user()`-based) negative-permission coverage for `fulfil_preproduced_order()`'s `_require_create_permission()` gate. Every other test in this file mocks `frappe.has_permi…
  - `test_read_only_role_cannot_fulfil_preproduced_order`
  - `test_no_role_user_cannot_fulfil_preproduced_order`
  - `test_nonexistent_kot_reports_kot_not_found_even_for_unprivileged_user`: Documents the real fail-closed ordering: KOT-existence is checked before create-permission, so an unprivileged caller probing a nonexistent KOT sees KOT_NOT_FOUND, not NOT_PERMITTED. Not a privilege …

</details>

<details>
<summary><code>ury.ury.api.test_ury_print</code> (26)</summary>

- **TestNetworkPrinting**
  - `test_network_printing_success_simple`: Test successful network printing skips cups when not available.
  - `test_network_printing_cups_import_fails`: Test network printing when cups import fails.
  - `test_network_printing_with_update`: Test network printing updates invoice status.
  - `test_network_printing_rejects_a_format_for_another_doctype`: A shift report layout must never print a customer receipt.
- **TestSelectNetworkPrinter**
  - `test_select_network_printer_uses_room_printers`: Test that select_network_printer uses room printers if table has room.
  - `test_select_network_printer_no_printers_found`: Test that select_network_printer returns None when no printers found.
  - `test_select_network_printer_uses_pos_profile_printers`: Test that select_network_printer uses POS profile printers if no table.
  - `test_select_network_printer_permission_denied`: Test that select_network_printer throws on permission denied.
- **TestQzPrintUpdate**
  - `test_qz_print_update_without_table`: Test qz_print_update when invoice has no table.
  - `test_qz_print_update_with_table_and_invoice_not_printed`: Test qz_print_update with table when invoice_printed is 0.
  - `test_qz_print_update_with_table_already_printed`: Test qz_print_update when invoice_printed is already 1.
- **TestPrintPosPage**
  - `test_print_pos_page_success`: Test print_pos_page successfully publishes and updates invoice.
  - `test_print_pos_page_without_table`: Test print_pos_page when invoice has no table.
  - `test_print_pos_page_already_printed_no_release`: Test print_pos_page when invoice already printed.
  - `test_print_pos_page_permission_denied`: Test print_pos_page throws on permission denied.
- **TestQzCertificate**
  - `test_qz_certificate_returns_cert`: Test qz_certificate returns certificate from config.
  - `test_qz_certificate_returns_none_if_not_set`: Test qz_certificate returns None if cert not configured.
  - `test_qz_certificate_guest_denied`: Test qz_certificate denies Guest user.
- **TestSignaturePromise**
  - `test_signature_promise_success`: Test successful signature promise.
  - `test_signature_promise_guest_denied`: Test signature_promise denies Guest user.
  - `test_signature_promise_insufficient_roles`: Test signature_promise denies users without signing roles.
  - `test_signature_promise_missing_payload`: Test signature_promise throws when payload is missing.
- **TestGetQzPrivateKey**
  - `test_get_qz_private_key_from_pem_content`: Test _get_qz_private_key reads PEM content directly.
  - `test_get_qz_private_key_not_configured`: Test _get_qz_private_key throws when not configured.
  - `test_get_qz_private_key_empty_config`: Test _get_qz_private_key with empty string in config.
- **TestQzSigningRoles**
  - `test_qz_signing_roles_contains_expected_roles`: Test that QZ_SIGNING_ROLES contains expected administrator roles.

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_context</code> (8)</summary>

- **TestResolveProductionContext**
  - `test_resolver_normalizes_policy_and_derives_company`
  - `test_direct_retail_still_uses_direct_retail_warehouse`
  - `test_mto_uses_production_unit_warehouse`
  - `test_resolver_derives_disable_flags_from_linked_records`: production_unit_disabled/department_disabled are not real columns on this doctype (N2 fix) -- they must be derived live from the linked URY Production Unit/URY Production Department's own `enabled` f…
  - `test_resolver_respects_department_filter`
  - `test_resolver_returns_none_for_missing_or_ambiguous_rows`
  - `test_resolver_returns_none_without_item_or_branch`
  - `test_resolver_fails_closed_on_company_mismatch`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_plan_adapter</code> (17)</summary>

> Unit tests for the Sales Plan -> Production Plan adapter (V3-24). No live bench/Frappe site is available in this environment, so these tests avoid frappe.tests.UnitTestCase / the ORM entirely. ``FakeDoc`` stands in for a Frappe document, exposing only ``.get(...)`` -- the same surface the adapter uses -- so behaviour is exercised the same way it would be against a real ``frappe.model.document.Doc…

- **AdaptSalesPlanToProductionPlanTests**
  - `test_rejects_plan_with_no_status`
  - `test_rejects_approved_status_without_snapshot`
  - `test_rejects_submitted_for_approval_status`
  - `test_accepts_approved_and_locked_for_production`
  - `test_deterministic_same_input_same_output`
  - `test_preserves_item_qty_and_code_fidelity`
  - `test_preserves_department_grouping`
  - `test_department_index_groups_multiple_items_same_department`
  - `test_unmapped_fields_are_reported_not_guessed`
  - `test_no_erpnext_document_mutation_apis_invoked`: The adapter must never call insert/save/submit/db_set on anything. We patch frappe.get_doc (the only plausible way this module could reach a real document) and assert it is never called; we also conf…
  - `test_accepts_plain_dict_snapshot_not_only_json_string`
  - `test_direct_retail_items_excluded`
  - `test_non_sellable_items_included_when_pre_produced`: A non-sellable kitchen base (no ``is_sales_item`` restriction applies any more) must still reach po_items when PRE_PRODUCED -- it is exactly the kind of row this Production Plan must cover.
  - `test_made_to_order_items_excluded`
  - `test_pre_produced_items_get_warehouse_department_and_start_date`
  - `test_include_exploded_items_is_zero_on_every_row`
  - `test_warehouse_is_none_when_department_unresolved`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_plan_auto_work_order</code> (26)</summary>

> Tests for ury_production_plan_auto_work_order (Agent 7, Production Plan Automation). Following the same mocking convention as ``test_ury_work_order_hooks.py`` and ``test_ury_batch_manufacture_service.py``: no live bench/site DB dependency beyond what ``FrappeTestCase`` gives us. ``frappe.new_doc``/``frappe.get_doc``/ ``frappe.get_all``/``frappe.db.get_value`` are patched at the module boundary ag…

- **TestFindExistingWorkOrder**
  - `test_returns_none_when_nothing_matches`
  - `test_returns_the_single_match`
  - `test_queries_by_the_deterministic_key_and_excludes_cancelled`
  - `test_raises_when_more_than_one_match_is_found`
- **TestVerifyComponentVector**
  - `test_passes_when_rows_match_the_vector`
  - `test_passes_within_floating_point_tolerance`
  - `test_raises_when_an_item_is_missing_from_the_persisted_rows`
  - `test_raises_when_a_quantity_was_silently_reset`
- **TestGetOrCreateWorkOrder**
  - `test_creates_a_new_work_order_with_the_compiled_vector_and_warehouse_policy`
  - `test_reuses_an_existing_submitted_work_order_without_touching_required_items`
  - `test_finishes_a_stray_draft_left_by_an_interrupted_earlier_attempt`
  - `test_second_call_for_the_same_target_reuses_rather_than_duplicates`
- **TestCreateManufactureEntry**
  - `test_produces_the_remaining_quantity_through_make_stock_entry`
  - `test_resumes_from_the_remaining_quantity_on_a_partially_produced_work_order`
  - `test_creates_nothing_when_fully_produced_already`
- **TestExecuteDepartmentTargets**
  - `test_each_target_gets_one_work_order_and_one_manufacture_entry`
  - `test_skip_work_order_target_gets_no_work_order_but_a_result_entry`
  - `test_a_real_targets_dependency_on_a_nested_pre_produced_item_is_still_enforced`
  - `test_rejects_an_mto_consumer_submitted_before_its_real_dependency`
  - `test_dependencies_are_produced_before_their_consumers`
  - `test_rejects_a_consumer_submitted_before_its_dependency`
  - `test_a_dependency_already_fully_produced_by_an_earlier_call_satisfies_the_consumer`
  - `test_rejects_an_external_receipt_target`
  - `test_repeated_execution_never_manufactures_twice`
  - `test_partial_production_resumes_from_the_remaining_quantity`
  - `test_no_work_order_is_created_on_production_plan_submit`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_plan_cancel_hooks</code> (7)</summary>

> Unit tests for the Production Plan cancel guard, including the D6 extension: refuse while Processing, refuse when a submitted Manufacture Stock Entry is linked (naming it), allow (with a message) when only unstarted submitted Work Orders exist. ``frappe.get_all`` is patched rather than requiring real Work Order / Stock Entry fixtures, matching this module's existing test style.

- **TestProductionPlanCancelHooks**
  - `test_adds_sales_plan_when_unset`
  - `test_preserves_existing_entries`
  - `test_idempotent_no_duplicate`
  - `test_no_linked_work_orders_is_a_clean_pass`
  - `test_refuses_while_processing`
  - `test_refuses_when_manufacture_entry_linked_and_names_it`
  - `test_allows_with_only_unstarted_work_orders_and_warns`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_plan_integration</code> (25)</summary>

> Integration and regression tests for the URY Production Plan Automation feature (Agent 10, ``ongoing/production-plan-automation/PLAN.md``). Unlike every other module's own unit tests (all mocked, per those modules' own docstrings -- no bench was available while they were written), these run against the real ``ury.localhost`` site: real Items, BOMs, Warehouses, Bins, Sales Plans, Production Plans,…

- **TestTargetCompilerRealRecords**: Real Items/BOMs/configurations, no mocking -- exercises ``ury_bom_tree.walk_bom_tree`` and ``ury_production_target_compiler`` together, the way the rest of the chain actually calls them.
  - `test_mto_excludes_finished_item_includes_scaled_preproduced_assembly`: Scenario 10: an MTO finished item is excluded; its PRE_PRODUCED assembly is included at the scaled quantity.
  - `test_nested_preproduced_dependency_ordered_before_its_consumer`: Scenario 11/12: the deeper PRE_PRODUCED node appears as its own target, aggregated, in dependency order, and as an item (not exploded) inside the shallower target's own component vector.
  - `test_branch_scoped_configuration_does_not_leak_across_branches`: Scenario 13: a configuration belonging to another branch must not stop traversal -- an item with no config for the branch actually passed is read straight through as a raw material.
  - `test_cross_department_dependency_produces_blocker_not_target`: Scenario 14 (D7): an MTO parent in one department consuming a PRE_PRODUCED component configured for a different department emits a `cross_department_dependency` blocker, never a transfer/target.
  - `test_external_receipt_target_routed_away_from_targets`: Scenario 19 (D19): an EXTERNAL_RECEIPT PRE_PRODUCED row is compiled into `external_receipt_targets`, never `targets` -- so Agent 7's Work Order executor (which only ever consumes `targets`) can never…
  - `test_bom_cycle_is_reported_not_recursed`: Scenario 22 (Agent 1): a structurally circular BOM raises, naming the path, rather than recursing forever. Exercised through the real `walk_bom_tree` a real BOM structure reaches when a BOM Item row …
- **TestProductionPlanCreationRealRecords**
  - `test_creates_one_plan_per_department_with_include_exploded_items_zero`
  - `test_repeated_calls_create_no_duplicate_department_plans`
  - `test_deprecated_singular_pointer_is_never_written`: D11: `URY Sales Plan.custom_ury_production_plan` is never written by the locked, department-plural creation path, against a real Sales Plan row (not a fake dict, unlike Agent 3's own unit test).
- **TestSalesPlanLockCreatesProductionPlans**
  - `test_approving_creates_nothing_locking_with_toggle_on_creates_plans`: Scenario 24.
  - `test_toggle_off_locks_with_nothing_then_manual_route_creates_same_plans`: Scenario 25.
  - `test_creation_failure_with_toggle_on_aborts_lock_leaves_plan_approved`: Scenario 26. Only the compiler call is patched (to simulate a defect that would otherwise be caught upstream) -- the Sales Plan lifecycle itself, and the `before_update_after_submit` hook under test,…
- **TestReadinessAndTransferRealStock**: Fixtures are rebuilt fresh in ``setUp`` (per test method), not ``setUpClass``. ``FrappeTestCase`` only rolls back once, at class teardown (``addClassCleanup(_rollback_db)``) -- it does **not** roll b…
  - `test_store_shortage_blocks_with_zero_writes`: Scenario 3: no Store stock at all -> the transfer executor refuses before creating a single document.
  - `test_two_departments_compete_first_succeeds_second_blocked`: Scenario 6: Store has enough Rice for exactly one department's 10 Kg requirement (qty=1 * bom 10 Kg/unit), not both.
  - `test_partial_prior_transfer_is_respected_on_retry`: Scenario 8: a first transfer moves half; a retry after more Store stock arrives moves only the remainder, never double-moves.
- **TestWorkOrderExecutionRealRecords**
  - `test_happy_path_produces_work_order_and_manufacture_entry`: Scenario 1 (materials layer): all materials already available -> one Work Order, one Manufacture Stock Entry, fully produced.
  - `test_repeated_execution_does_not_manufacture_twice`: Scenario 9 (execution layer): calling execute_department_targets again for an already-fully-produced target reuses the Work Order and creates no second Manufacture Stock Entry.
  - `test_ordinary_non_ury_work_order_is_unaffected`: Scenario 18: a plain ERPNext Work Order with no linked URY Production Plan keeps ERPNext's own warehouse/required_items behaviour -- the D16 safeguard hook must no-op for it.
- **TestCancelGuardsRealRecords**
  - `test_cancel_refused_after_manufacture_entry_posted`
  - `test_cancel_allowed_with_only_unstarted_submitted_work_order`: D6 / scenario 20's second half, as documented: ``ury_production_plan_cancel_hooks``'s own module docstring and PLAN.md both say a submitted Work Order with nothing produced does NOT block cancellatio…
  - `test_processing_state_refuses_cancel`
- **TestMaterialRequestsRealRecords**
  - `test_purchase_and_transfer_material_requests_are_submitted_not_draft`: Scenario 28 (D15). Change 1: ``_locked_plan`` (``create_or_get_department_production_plans``, ``submit=True``) now generates both requests itself as part of plan creation, so calling the generators a…
  - `test_raised_requirement_creates_supplementary_request_not_amendment`: Scenario 28's second half: a second, larger call after the first submitted MR never amends it -- it creates a new supplementary MR for the delta only, and the first MR is untouched. Change 1: the fir…
  - `test_creating_department_plan_generates_submitted_requests_once`: Change 1: ``create_or_get_department_production_plans`` now raises the Purchase and Transfer Material Requests itself, as part of plan creation -- a submitted Transfer request per department plus one…
- **TestFullHappyPathEndToEnd**: Scenario 1, run through the *actual* whitelisted entry points a manager's click would invoke, including the real background job body (``run_prepare_production_job``) -- not the equivalent direct call…
  - `test_lock_to_production_completed_through_the_real_job`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_plan_material_request</code> (16)</summary>

> Unit tests for per-Production-Plan Purchase Material Requests. Same mocking style as ``test_ury_sales_plan_production_plan.py``: ``FrappeTestCase`` for the test-runner site context, with every frappe call patched rather than requiring real Sales Plan / Production Plan / Material Request fixtures.

- **TestAllocatePurchaseRequirement**: Pure allocation math -- no frappe calls at all.
  - `test_zero_requirement_after_outstanding_allocates_nothing`
  - `test_over_covered_by_outstanding_allocates_nothing`
  - `test_single_department_gets_full_requirement`
  - `test_two_departments_split_proportionally_and_sum_exactly`
- **TestGeneratePurchaseMaterialRequest**
  - `test_department_stock_reduces_requirement_end_to_end`
  - `test_shared_raw_material_across_two_targets_is_one_row`
  - `test_two_department_plans_get_separate_purchase_mrs_without_duplicating_store_shortage`
  - `test_every_row_resolves_back_to_a_department_plan`
  - `test_mr_items_warehouse_is_store_not_department`: ERPNext's native Production Plan.make_material_request reads mr_items.warehouse straight onto the Material Request Item it generates. Purchase receive location must stay Store.
  - `test_repeated_call_creates_no_duplicates`
  - `test_raised_requirement_creates_supplementary_request`
  - `test_generated_material_request_is_submitted_not_draft`
  - `test_external_receipt_demand_appears_in_purchase_requirement`: D19: an EXTERNAL_RECEIPT target has no component_vector at all -- its own demand must still reach the Purchase requirement here.
  - `test_missing_department_plan_is_reported_not_silently_dropped`
- **TestExistingPurchaseQtyByItem**
  - `test_empty_plan_list_short_circuits_without_a_query`
  - `test_restricted_to_purchase_type_and_submitted_only`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_readiness</code> (15)</summary>

> Unit tests for the read-only readiness engine. Follows the same mocking style as ``test_ury_sales_plan_production_plan.py``: ``FrappeTestCase`` for the test-runner site context, with ``frappe.db.get_value`` (the engine's only stock read) patched directly rather than requiring real Bin fixtures.

- **TestDepartmentStockReducesRequirement**
  - `test_existing_department_stock_nets_off_before_store`
  - `test_department_stock_fully_covering_requirement_is_zero_shortage`
- **TestNoDuplicateStoreShortageAcrossDepartments**
  - `test_two_departments_share_one_store_shortage_number`
- **TestExternalReceiptDemandIsNotLost**
  - `test_external_receipt_target_becomes_its_own_demand_row`
- **TestMadeToOrderRawMaterialDemandIsNotLost**
  - `test_raw_material_vector_row_becomes_a_demand_row`
  - `test_a_skip_work_order_targets_raw_material_sums_with_a_real_targets`
  - `test_reads_raw_material_vector_never_component_vector`
- **TestStoreWarehouseBlocker**
  - `test_missing_store_warehouse_is_a_blocker_not_an_exception`
  - `test_no_demand_no_store_warehouse_no_blocker`
- **TestSingleDepartmentScope**
  - `test_caller_can_pass_one_department_subset`: Agent 5/8 re-run readiness for one department under Bin locks (D17) -- the engine must not require the full Sales Plan's departments.
- **TestSharedRawMaterialAcrossTargets**
  - `test_two_targets_sharing_one_raw_material_sum_into_one_row`
- **TestFloatResidueIsNotAShortage**
  - `test_near_zero_store_shortfall_rounds_to_zero`
  - `test_store_shortage_blocker_message_is_human_readable`
- **TestNoWrites**: Structural guard: the readiness engine performs zero writes. Grepping the module's own source is the same approach Agent 1 used for the BOM tree service -- an inline mock can never catch a call that …
  - `test_module_source_contains_no_write_calls`
  - `test_no_frappe_whitelist_mutation_verbs_in_module`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_settings</code> (4)</summary>

- **TestURYProductionSettings**
  - `test_defaults_are_falsy`
  - `test_get_store_warehouse_reads_configured_value`
  - `test_auto_production_plan_enabled_reads_configured_value`
  - `test_auto_production_plan_enabled_is_boolean`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_target_compiler</code> (26)</summary>

> Unit tests for the production target compiler (Agent 2). No live bench/Frappe site is available in this worktree, so `walk_bom_tree`, `resolve_production_context` and the handful of `frappe.get_all` / `frappe.db.get_value` calls this module makes are all faked from small, explicit in-test catalogs -- following the same mocking convention as `test_ury_bom_tree.py`. `frappe` itself is imported for …

- **MtoAssemblyTests**
  - `test_mto_row_is_its_own_target_and_pre_produced_assembly_is_a_separate_one`
  - `test_shared_assembly_demand_aggregated_once_within_department`
  - `test_other_branch_configuration_does_not_stop_traversal`
  - `test_mto_item_with_no_pre_produced_stop_point_is_its_own_target`
  - `test_two_mto_rows_each_get_their_own_target_and_raw_material_vector`
  - `test_mto_own_direct_retail_component_is_in_the_raw_material_vector`
  - `test_mto_own_nested_pre_produced_item_never_in_its_own_raw_material_vector`
- **DirectPreProducedTests**
  - `test_direct_pre_produced_row_becomes_a_target_with_its_own_component_vector`
  - `test_same_item_in_two_departments_stays_separate`
  - `test_missing_pinned_bom_on_a_pre_produced_row_fails_loudly`
  - `test_missing_pinned_bom_on_a_made_to_order_row_fails_loudly`
  - `test_non_sales_pre_produced_assembly_is_included`
  - `test_module_never_references_is_sales_item`
- **RawMaterialAndDirectRetailTests**
  - `test_raw_materials_never_become_targets`
  - `test_direct_retail_row_never_becomes_a_target`
  - `test_direct_retail_component_appears_in_vector_but_never_as_a_target`
- **CrossDepartmentBlockerTests**
  - `test_cross_department_pre_produced_dependency_yields_blocker_not_target`
- **ExternalReceiptRoutingTests**
  - `test_external_receipt_target_routed_separately_and_builds_no_work_order_material`
- **AmbiguousConfigurationTests**
  - `test_ambiguous_configuration_yields_a_blocker_and_stops_that_branch`
- **BomCycleTests**
  - `test_bom_cycle_surfaces_as_a_blocker_without_crashing_other_departments`
- **DependencyOrderingTests**
  - `test_nested_pre_produced_dependency_is_ordered_before_its_consumer`
- **UnstockedIntermediatePassThroughTests**
  - `test_unstocked_intermediate_excluded_but_its_raw_materials_and_nested_target_included`
- **BranchIsMandatoryTests**
  - `test_branch_is_required`
  - `test_branch_is_a_positional_argument_with_no_default`
- **SnapshotDecodingTests**
  - `test_accepts_json_string_snapshot_not_only_a_dict`
  - `test_zero_qty_rows_are_ignored`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_transfer</code> (19)</summary>

> Unit tests for the department Transfer Material Request and the Store-to-Department stock transfer executor. Same mocking style as ``test_ury_production_plan_material_request.py``: ``FrappeTestCase`` for the test-runner site context, with every frappe call (``get_doc``, ``db.sql``, document ``insert``/``submit``/``save``) patched rather than requiring real Sales Plan / Production Plan / Material …

- **TestGenerateTransferMaterialRequest**: Module 1 -- Transfer MR creation, one per department plan.
  - `test_quantity_is_department_shortage_not_store_shortage`
  - `test_shared_raw_material_across_two_targets_is_one_row`
  - `test_repeated_call_creates_no_duplicates`
  - `test_raised_requirement_creates_supplementary_request`
  - `test_mr_items_warehouse_is_department_not_store`
  - `test_missing_store_warehouse_blocks_creation`
- **TestExistingTransferQtyByItem**
  - `test_empty_plan_list_short_circuits_without_a_query`
  - `test_restricted_to_transfer_type_and_submitted_only`
- **TestLockStoreBins**: D9 -- deterministic ascending lock order, no Bin row created.
  - `test_locks_are_sorted_ascending_by_item_code`
  - `test_duplicate_item_codes_locked_once`
  - `test_never_creates_a_bin_row_it_only_selects`
- **TestExecuteStoreToDepartmentTransfer**
  - `test_store_shortage_blocks_transfer_before_any_mutation`
  - `test_sufficient_store_stock_executes_and_locks_in_order`
  - `test_no_linked_transfer_request_is_reported_not_silently_skipped`
  - `test_fully_transferred_mr_creates_no_stock_entry`: The mapper returning no items means "nothing left to transfer" -- reused/skipped, not an error, and not a duplicate transfer.
  - `test_missing_store_warehouse_blocks_before_any_lock`
  - `test_department_stock_already_sufficient_needs_no_lock`
  - `test_non_submitted_production_plan_is_rejected`
- **TestRevalidationUnderLock**: D17 -- a picture that changes between preflight and the locked revalidation aborts, having created nothing.
  - `test_store_stock_consumed_between_preflight_and_lock_aborts_with_nothing_created`

</details>

<details>
<summary><code>ury.ury.api.test_ury_production_validation</code> (26)</summary>

- **TestURYProductionValidation**
  - `test_made_to_order_accepts_required_mapping_and_bom`
  - `test_permission_denial_fails_before_configuration_lookup`
  - `test_make_to_order_label_is_accepted_for_existing_doctype_options`
  - `test_make_to_stock_label_maps_to_pre_produced`
  - `test_pre_produced_resolves_department_warehouse_not_direct_retail`: D13: the Department Warehouse is the PRE_PRODUCED stock authority -- `direct_retail_warehouse` must not be read for a PRE_PRODUCED configuration, even when it happens to be populated.
  - `test_manufactured_item_rejects_missing_bom`
  - `test_manufactured_item_rejects_missing_department`
  - `test_manufactured_item_rejects_missing_production_unit`
  - `test_direct_retail_accepts_warehouse_without_manufacturing_route`
  - `test_direct_retail_rejects_missing_warehouse`
  - `test_direct_retail_rejects_bom`
  - `test_missing_active_configuration_fails_closed`
  - `test_multiple_active_configurations_fail_closed`
  - `test_invalid_policy_fails_closed`
  - `test_bom_item_mismatch_fails_closed`
  - `test_bom_company_mismatch_fails_closed`
  - `test_bom_must_be_active_and_submitted`
  - `test_department_branch_mismatch_fails_closed`
  - `test_department_company_mismatch_fails_closed`
  - `test_disabled_department_fails_closed`
  - `test_production_unit_branch_mismatch_fails_closed`
  - `test_production_unit_company_mismatch_fails_closed`
  - `test_direct_retail_warehouse_company_mismatch_fails_closed`
  - `test_branch_without_company_fails_closed`
  - `test_configuration_item_mismatch_fails_closed`
  - `test_configuration_branch_mismatch_fails_closed`

</details>

<details>
<summary><code>ury.ury.api.test_ury_requirements_stock</code> (14)</summary>

> Unit tests for ury.ury.api.ury_requirements_stock.

- **TestGetPlanStockOnHandGuards**
  - `test_requires_manager`
  - `test_returns_empty_when_branch_missing`
  - `test_returns_empty_when_branch_is_all`
  - `test_returns_empty_when_no_pos_profile_warehouse`
  - `test_returns_empty_when_pos_profile_missing_company`
- **TestGetPlanStockOnHandResolution**
  - `test_resolves_department_warehouse_when_configured`
  - `test_falls_back_to_pos_profile_warehouse_when_no_department_match`
  - `test_falls_back_to_pos_profile_warehouse_when_no_department_given`
  - `test_skips_items_without_item_code`
  - `test_parses_items_from_json_string`
  - `test_defaults_items_to_empty_list_when_falsy`
  - `test_caches_result_with_short_ttl`
  - `test_returns_cached_result_without_recomputing`
  - `test_valuation_rate_defaults_to_zero_when_missing`

</details>

<details>
<summary><code>ury.ury.api.test_ury_reservation_service</code> (48)</summary>

> Tests for ury_reservation_service. Static-review note: none of these tests have been executed in this environment -- there is no live bench/site/DB available, only a detached checkout of the app source. They are written and hand-traced to the same mocking pattern used by `ury/ury/api/test_ury_stock_service.py` (patching `frappe.db.sql`, `frappe.db.get_value`, `frappe.get_all`, and `frappe.get_doc…

- **TestCreateReservationSimpleItem**
  - `test_reservation_within_capacity_succeeds`: Plain stock item (no BOM) with enough Bin capacity reserves successfully.
  - `test_reservation_exceeding_capacity_is_rejected`: Requesting more than Bin.projected_qty minus active reservations raises and inserts nothing.
- **TestCreateReservationCompositeItem**
  - `test_all_or_nothing_rejected_when_one_shared_component_short`: Composite item with two components; one has enough capacity, the other does not. Hand-traced trace (also reported to the caller): item MENU-A has an active default BOM exploding to component_item=FLO…
  - `test_composite_reservation_succeeds_when_all_components_have_capacity`
  - `test_nested_sub_assembly_resolves_to_leaf_components_not_the_sub_assembly`: Composite item whose BOM contains a nested sub-assembly. Hand-traced trace: BURGER's BOM (BOM-BURGER-001) has two lines: BUN (a plain/raw component, qty_per_unit=1) and SUB_PATTY (flagged `is_sub_ass…
- **TestCreateReservationProductionPolicy**: Regression coverage: `production_policy` (not "has an active BOM") must decide whether create_reservation checks FG stock directly or explodes the BOM into raw components -- see `_resolve_components`.
  - `test_pre_produced_item_with_active_bom_reserves_own_fg_stock_not_components`: PRNPM-style item: PRE_PRODUCED, has an active default BOM (documents the recipe), but must reserve/check its OWN finished-goods stock, not explode into raw ingredients. If this regresses to the has-B…
  - `test_direct_retail_item_with_active_bom_reserves_own_fg_stock`: Same guard as PRE_PRODUCED, for DIRECT_RETAIL.
  - `test_made_to_order_item_still_reserves_bom_components`: Regression guard: MADE_TO_ORDER items keep exploding into BOM components exactly as before, when production_policy is passed explicitly.
  - `test_no_production_policy_falls_back_to_legacy_has_bom_heuristic`: Backward compatibility: a caller that supplies no production_policy (e.g. not yet updated, or item genuinely unconfigured) keeps the pre-existing has-active-BOM => composite-reservation behaviour.
- **TestReleaseFulfilCancel**
  - `test_fulfilled_rows_are_not_counted_as_reserved_capacity`
  - `test_release_restores_capacity_for_subsequent_reservation`: Releasing a Reserved row transitions it to Released. Capacity restoration is verified indirectly: after release, a subsequent `_active_reservation_qty` sum (used by `get_available_capacity`) would on…
  - `test_cancel_on_reserved_succeeds`
  - `test_cancel_on_fulfilled_is_rejected`
  - `test_fulfil_reserved_succeeds`
  - `test_fulfil_if_pending_transitions_a_reserved_group`
  - `test_fulfil_if_pending_is_a_no_op_on_an_already_fulfilled_group`: The consolidated Sales Invoice close-out and the fulfilment posting service both fulfil the same group and can race; whichever loses must do nothing rather than throw (`fulfil_reservation` would).
  - `test_fulfil_if_pending_skips_a_group_in_a_mixed_or_other_state`: A partly-released / mid-transition group is skipped and logged, not raised: neither caller may abort a submitted stock posting or a submitted Sales Invoice over a reservation row's state.
- **TestSalesPlanCommitWiring**: Sales Plan committed_qty/fulfilled_qty maintenance wired into create_reservation (increment) and _transition_group (decrement on release/cancel/expire, decrement+increment-fulfilled on fulfil).
  - `test_create_reservation_increments_committed_qty_for_matched_plan_item`
  - `test_create_reservation_with_no_plan_match_records_not_applied`
  - `test_release_decrements_committed_qty_by_recorded_amount`
  - `test_fulfil_moves_qty_from_committed_to_fulfilled_in_one_call`
  - `test_no_commit_recorded_means_no_counter_call`: A group whose create predates this feature (no sales_plan_commit in its audit_log) must not touch the counter helper at all.
- **TestRealtimeEventEmission**: Tests for realtime event emissions on reservation create/release.
  - `test_create_reservation_emits_realtime_event_per_component`: create_reservation() emits one ury_component_stock_changed event per component_item.
  - `test_create_reservation_emits_single_event_for_simple_item`: create_reservation() emits one event for a simple (non-composite) item.
  - `test_release_reservation_emits_realtime_events`: release_reservation() emits one ury_component_stock_changed event per component_item.
  - `test_publish_realtime_failure_does_not_abort_reservation`: If frappe.publish_realtime raises, the reservation is still created and not rolled back.
  - `test_create_reservation_emits_rich_fanout_event_with_affected_items`: H1: create_reservation() for a MADE_TO_ORDER item with a shared component also publishes a richer `menu_availability_update_{branch}` event per component, carrying the items resolved by `get_items_af…
  - `test_create_reservation_fanout_lookup_failure_does_not_abort_or_raise`: H1 defensive requirement: if `get_items_affected_by_component` raises, create_reservation() still completes normally (the reservation is created, no exception propagates), and the cheap `ury_componen…
- **TestConcurrency**
  - `test_two_terminal_concurrent_reservation`: Two concurrent callers race to reserve the last unit; exactly one must succeed. NOT EXECUTED -- requires a live Frappe test site/DB. This test is written to demonstrate the shape of a real concurrenc…
- **TestReconciledActiveRows**: Unit coverage for the two-view reconciliation behind `read_committed=True`. These are the cases the four prior review gates had no test for, and are exactly where the F1 (own uncommitted INSERT invis…
  - `test_active_in_both_views_is_counted`
  - `test_own_uncommitted_insert_is_counted`: F1: the row exists only in our transaction, so the fresh connection cannot see it -- but it is real and must count against capacity.
  - `test_release_committed_by_someone_else_is_not_counted`: Same shape as the case above (active for us, not in the committed active set) but the row DOES exist on the other connection, i.e. it was released and committed after our snapshot was pinned. Must no…
  - `test_insert_committed_by_someone_else_is_counted`: The concurrent-oversell case c5e73d299 fixed: committed after our snapshot, so absent from our view entirely. Must still count.
  - `test_own_uncommitted_release_is_not_counted`: F2: we released it in this transaction, so it still reads as Reserved on the fresh connection. It must not be counted against its own replacement.
  - `test_all_five_cases_together`
- **TestSharedGroupPartialFulfilment**: B03b: one reservation group legitimately shared by several fulfillers. A straight quantity bump on ONE POS line (Coffee 1 -> 2) does not create a second reservation group: `ury_order_reservation_serv…
  - `test_original_then_delta_each_fulfil_their_own_share`: The exact reported repro, original KOT served first.
  - `test_delta_then_original_each_fulfil_their_own_share`: Reverse order: the delta KOT is served first. Serving order must not matter -- neither KOT item is privileged over the other.
  - `test_a_replayed_contributor_is_counted_once_and_does_not_close_the_group`: A posting intent is retried on failure, so the same contributor can call twice. Counting it twice would close a half-consumed group early and strand the sibling KOT item.
  - `test_a_contribution_after_the_group_closed_is_a_no_op`
  - `test_a_single_kot_covering_the_whole_group_closes_in_one_shot`: The ordinary case -- one line, one KOT, no quantity bump. Cumulative tracking must be invisible here: the single share equals the reserved total, so the group reaches its terminal status on the first…
  - `test_a_legacy_group_with_no_frozen_reserved_qty_closes_in_one_shot`: A group created before `reserved_top_level_qty` was frozen has no divisible total, so it must keep today's whole-group behaviour rather than being left Reserved forever by an un-completable ledger.
  - `test_the_sales_plan_close_out_still_fulfils_the_whole_group`: `fulfil_reservations_on_consolidation` passes no contributor. It is the backstop that sweeps a group whose contributors never added up (a KOT item cancelled after production, G-08/G-09), so it must s…
  - `test_the_ledger_survives_on_every_row_not_just_one`: The ledger is appended to every row of the group, so no single row is load-bearing, and reading it back de-duplicates by contributor rather than summing the same entry N times.
  - `test_fractional_shares_still_reach_the_terminal_status`: Shares are float quotients, so three thirds can sum a few ulps short of the total. QTY_TOLERANCE must absorb that or the group would never close.
  - `test_cancelling_a_partially_fulfilled_group_still_completes`: G-08/G-09 interaction: a group can now be Reserved yet already partly consumed. Cancellation must not crash over that -- a cancellation must always be able to complete -- and the discrepancy must be …
- **TestCreateReservationRealPermissionBoundary**: Real (non-mocked, `frappe.set_user()`-based) negative-permission coverage for `create_reservation()`'s `_require_create_permission()` gate. Every other test in this file mocks `frappe` entirely (per …
  - `test_read_only_role_cannot_create_reservation`
  - `test_no_role_user_cannot_create_reservation`
  - `test_permission_check_runs_before_scope_validation`: The permission gate must fail closed even when every other argument is also invalid/missing -- i.e. it is genuinely the first check, not incidentally passing because of a later validation error with …

</details>

<details>
<summary><code>ury.ury.api.test_ury_reservation_service_expiry</code> (4)</summary>

> Test for expire_stale_reservations() (COVERAGE_GAP_ANALYSIS.md Table 1, Top 15 item #10: "a scheduled/background job that mutates reservation state with no test"). Mocked per this track's read-path convention: `frappe.get_all` is mocked to avoid a real Stock Reservation fixture set, and `_transition_group` (which performs the actual real DB status mutation and is exercised elsewhere in test_ury_r…

- **TestExpireStaleReservations**
  - `test_no_stale_rows_returns_empty_list_and_transitions_nothing`
  - `test_stale_rows_are_grouped_and_each_group_transitioned_once`
  - `test_cutoff_is_derived_from_ttl_minutes_before_now`
  - `test_defaults_now_to_current_time_when_not_provided`

</details>

<details>
<summary><code>ury.ury.api.test_ury_sales_plan</code> (72)</summary>

- **TestURYSalesPlanContract**: Scope checking, item validation, snapshot freezing, and audit logging run inside URYSalesPlan.validate() (ury/ury/doctype/ury_sales_plan/ ury_sales_plan.py) on every status-changing save, including a…
  - `test_validate_plan_scope_fails_closed_on_mismatch`
  - `test_validate_plan_items_runs_production_configuration_check`
  - `test_validate_plan_items_fails_closed_on_bad_mapping`
  - `test_validate_plan_items_skips_untouched_zero_qty_rows`: A history-suggested row nobody actually planned (qty still 0) must never gate approval on its own production configuration -- see feedback_history_is_suggestion_not_precondition. Only a row with a re…
  - `test_plan_with_no_rows_cannot_leave_draft`: The complement to the test above: skipping qty-0 rows one by one left nothing checking that the plan as a whole plans SOMETHING, so an empty plan walked the entire path to Locked for Production.
  - `test_plan_with_only_zero_qty_rows_cannot_leave_draft`: A plan carrying the full history-suggested catalog, every row still at its default qty 0, plans exactly as much as an empty one.
  - `test_plan_with_one_nonzero_row_can_leave_draft`
  - `test_snapshot_is_immutable_once_created`
  - `test_freeze_approval_snapshot_populates_demand_vector`: The actual bug this task fixes: approval_snapshot["demand_vector"] must be populated at approval time, not left absent -- absence is exactly what made frozen_component_demand() in ury_issue_authoriza…
- **TestGuardBackwardTransition**: _guard_backward_transition() blocks Return to Draft ("Draft") and Supersede/Cancel ("Superseded/Cancelled") once real production has happened, and requires a reason either way -- the actual regressio…
  - `test_forward_targets_are_untouched`
  - `test_reason_required_to_return_to_draft`
  - `test_reason_required_to_cancel`
  - `test_fulfilled_qty_blocks_return_to_draft_even_with_a_reason`
  - `test_fulfilled_qty_blocks_cancel_even_with_a_reason`
  - `test_committed_but_unfulfilled_qty_blocks_return_to_draft_only`
  - `test_zero_committed_and_fulfilled_qty_allows_both`
- **TestValidateNoOverlappingPlanScope**: Approving a plan is rejected if another Approved/Locked-for-Production plan already covers the same item+branch+day scope (decided design -- see item3-sales-plan-capping-plan.md open question #1).
  - `test_no_other_active_plans_is_a_no_op`
  - `test_overlapping_item_on_another_approved_plan_is_rejected`
  - `test_non_overlapping_item_on_another_approved_plan_approves_fine`
  - `test_excludes_the_plan_being_approved_from_the_other_plan_search`
  - `test_no_items_on_the_plan_is_a_no_op`
- **TestURYSalesPlanEndpoints**
  - `test_save_draft_creates_new_plan`
  - `test_save_draft_updates_existing_draft_without_duplicating`
  - `test_save_draft_rejects_mismatched_branch_company`
  - `test_transition_plan_moves_draft_to_proposed`
  - `test_transition_plan_rejects_illegal_jump`
  - `test_get_plan_returns_doc_for_permitted_user`
  - `test_get_plan_status_returns_status_for_existing_plan`
  - `test_get_plan_status_returns_none_when_no_plan_exists`
  - `test_get_plan_status_ignores_a_cancelled_plan_so_a_new_one_can_start`: Regression test for a real live bug: Superseded/Cancelled has no outgoing transitions at all (see ury/fixtures/workflow.json), so if get_plan_status() kept returning it as "the" plan for its branch+d…
  - `test_save_draft_persists_enforcement_mode_on_new_plan`
  - `test_get_plan_status_returns_persisted_enforcement_mode`
  - `test_save_draft_without_enforcement_mode_keeps_existing_value`
- **TestValidateItemsOnActiveMenu**: Menu membership (URY Menu / URY Menu Item), not a separate sub-assembly flag, is the sellable discriminator -- see the docstring on validate_items_on_active_menu. Rows with qty 0 are exempt (untouche…
  - `test_on_menu_item_passes`
  - `test_off_menu_item_blocked_strict`
  - `test_off_menu_item_warns_not_strict`
  - `test_zero_qty_row_is_exempt`
  - `test_setting_off_disables_check`
- **TestPopulateItemProductionContext**
  - `test_populates_fields_when_config_resolves`
  - `test_leaves_row_alone_when_no_config_resolves`
  - `test_does_not_blank_out_field_when_resolved_value_is_falsy`
- **TestFlagStaleBomRevisions**: Test C1 part 2: flag_stale_bom_revisions detects outdated BOM captures.
  - `test_sets_stale_flag_when_bom_revision_differs`: Plan row flagged stale when captured bom_revision differs from BOM's current.
  - `test_clears_stale_flag_when_bom_revision_matches`: Stale flag cleared when captured bom_revision matches BOM's current.
  - `test_sets_stale_0_when_bom_not_found`: Stale flag set to 0 when BOM fetch returns None.
  - `test_handles_missing_bom_field`: Sets stale=0 when row has no BOM assigned.
  - `test_handles_missing_bom_revision_field`: Sets stale=0 when row has no captured bom_revision.
  - `test_handles_multiple_rows_independently`: Each row's stale flag set independently.
  - `test_never_raises_exception`: Function never raises, silently marks rows.
  - `test_handles_empty_items_list`: Function handles plans with no items gracefully.
  - `test_handles_none_items`: Function handles None items list gracefully.
  - `test_function_is_informational_never_blocks`: Function is purely informational, never throws or blocks.
- **TestSalesPlanWorkflowTransitions**: End-to-end regression coverage for routing transition_plan() through Frappe's real Workflow engine (see ury/fixtures/workflow.json and ury.ury.api.ury_sales_plan.transition_sales_plan()). This is the…
  - `test_manager_can_walk_draft_to_approved_and_docstatus_flips_only_then`
  - `test_non_manager_cannot_transition_plan`
  - `test_cancel_from_approved_results_in_real_docstatus_2`
  - `test_cancel_from_locked_for_production_results_in_real_docstatus_2`
  - `test_manager_without_controller_role_cannot_cancel_or_return_to_draft`: URY Manager alone (no URY Sales Plan Controller role) can drive the whole forward path but must not be able to reopen or kill a plan -- Return to Draft/Supersede-Cancel are gated to a narrower role, …
  - `test_controller_can_return_proposed_plan_to_draft_with_a_reason`
  - `test_reason_does_not_leak_into_later_unrelated_transitions_audit_entries`: Regression test for the exact bug an Opus verification pass found: if cancellation_reason were never cleared, every transition AFTER a Return to Draft would wrongly inherit that reason in its own aud…
  - `test_return_to_draft_without_a_reason_is_rejected`
  - `test_cancel_blocked_once_fulfilled_qty_recorded_even_for_controller`: No override, ever: once real production is recorded against a row, neither the manager nor the sales-plan-controller role can reopen or kill the plan -- see _guard_backward_transition().
  - `test_audit_log_records_transitions_across_docstatus_boundaries`: Regression test for the gap before_update_after_submit()/before_cancel() close: validate() never fires once docstatus is 1, so without those two hooks the audit trail would silently stop at "Approved…
- **TestSalesPlanSubmittableLifecycle**: Blocker regression coverage for `URY Sales Plan` being submittable. Frappe routes a save by comparing the STORED docstatus against the in-memory one (`Document.check_docstatus_transition`), which mea…
  - `test_full_walk_to_cancelled_executes_and_audits_every_hop`
  - `test_locked_for_production_hop_is_audited_and_does_not_throw`: Narrow regression for the 1 -> 1 update_after_submit hop alone.
  - `test_approval_snapshot_is_still_frozen_on_the_approved_hop`: freeze_approval_snapshot() lives in validate(), which still runs on the Submitted for Approval (docstatus 0) -> Approved (docstatus 1) hop because that routes to _action == "submit".
  - `test_save_draft_rejects_an_already_submitted_plan_on_the_docstatus_column`: save_draft()'s "still freely editable?" gate now reads the real docstatus column rather than an allow-list of status names.
  - `test_save_draft_rejects_a_proposed_plan_even_though_docstatus_is_0`: Proposed is doc_status 0 (still freely "save"-able as far as Frappe itself is concerned), but save_draft()'s own gate is tighter than the raw docstatus check: per the accepted "items editable only in…
- **TestBackfillSalesPlanDocstatusPatch**: ury.patches.v3_22.backfill_sales_plan_docstatus. Rows written before `URY Sales Plan` became submittable (or by a dev_seed script that assigned `.status` directly) carry a status of "Approved"/"Locke…
  - `test_approved_legacy_row_is_backfilled_to_docstatus_1`
  - `test_locked_for_production_legacy_row_is_backfilled_to_docstatus_1`
  - `test_cancelled_legacy_row_is_backfilled_to_docstatus_2`
  - `test_draft_row_is_left_at_docstatus_0_and_patch_is_idempotent`
  - `test_backfilled_row_can_then_actually_be_cancelled`: The point of the backfill: a status-Approved/docstatus-0 row is permanently un-cancellable (Frappe only permits docstatus 1 -> 2).
- **TestApprovalFreezesDemandVectorForIssueAuthorization**: End-to-end regression coverage for the live bug this task fixes. Before this fix, `freeze_approval_snapshot()` never populated `approval_snapshot["demand_vector"]`, so `frozen_component_demand()` in …
  - `test_full_approval_freezes_demand_vector_and_issue_authorization_succeeds`

</details>

<details>
<summary><code>ury.ury.api.test_ury_sales_plan_auto_production_plan</code> (3)</summary>

- **TestCreateProductionPlansOnLock**
  - `test_setting_disabled_does_not_create_anything`
  - `test_setting_enabled_creates_and_submits_every_department_plan`
  - `test_creation_failure_propagates_and_is_not_swallowed`: D14: with the toggle on, a creation failure must abort the Lock transition, never be logged-and-ignored the way the old Approval-time auto-create used to be.

</details>

<details>
<summary><code>ury.ury.api.test_ury_sales_plan_commit</code> (13)</summary>

> Tests for ury_sales_plan_commit.py's committed/fulfilled counter resolution. Static-review note: mirrors test_ury_reservation_service.py / test_ury_order_ reservation_service.py's pattern of mocking this module's own composed dependencies (`frappe.get_all`, `frappe.db.sql`, `frappe.db.get_value`) directly rather than requiring a live bench/DB -- none of these have been executed against a live sit…

- **TestResolvePlanItemRows**
  - `test_no_matching_plans_returns_empty`
  - `test_matching_plan_scopes_item_rows_by_parent`
- **TestResolveSinglePlanItemRow**
  - `test_single_match_returned`
  - `test_no_match_returns_none`
  - `test_ambiguous_match_logs_and_returns_none_never_guesses`
- **TestResolvePlanEnforcementMode**
  - `test_defaults_to_hard_when_no_match`
  - `test_reads_owning_plans_mode`
  - `test_falls_back_to_hard_when_field_empty`
- **TestApplyCommitDelta**
  - `test_no_op_when_no_deltas`
  - `test_no_match_is_a_safe_no_op`
  - `test_increments_committed_qty_under_lock`
  - `test_fulfilment_transfer_moves_committed_to_fulfilled_in_one_call`
  - `test_counters_clamp_at_zero_never_go_negative`

</details>

<details>
<summary><code>ury.ury.api.test_ury_sales_plan_production_plan</code> (17)</summary>

- **TestCreateOrGetDepartmentProductionPlans**: Material Request generation (``_generate_material_requests``) is patched out in every test here whose subject is plan creation itself -- it now runs for real at the end of ``create_or_get_department_…
  - `test_creates_one_plan_per_department`
  - `test_idempotent_skips_department_with_matching_hash`
  - `test_throws_without_frozen_snapshot`
  - `test_empty_department_produces_no_plan`
  - `test_include_exploded_items_survives_onto_po_items`: D2 / the wiring point Agent 2 flagged: include_exploded_items must reach every Production Plan Item row, or ERPNext silently explodes pre-produced sub-assemblies into raw materials.
  - `test_submit_true_submits_every_created_plan`
  - `test_never_writes_deprecated_sales_plan_link_field`: D11: URY Sales Plan.custom_ury_production_plan is no longer written.
- **TestGetLiveProductionPlans**
  - `test_get_live_production_plans`
  - `test_get_department_production_plan`
  - `test_get_department_production_plan_none`
- **TestGetProductionPlanStates**
  - `test_ineligible_status`
  - `test_stale_when_hash_mismatch`
  - `test_live_when_hash_matches`
- **TestCreateDepartmentProductionPlans**
  - `test_not_locked_throws`
  - `test_locked_delegates_and_submits`
- **TestOpenDepartmentProductionPlan**
  - `test_throws_when_missing`
  - `test_returns_existing`

</details>

<details>
<summary><code>ury.ury.api.test_ury_server_time</code> (3)</summary>

> Tests for ury_server_time.get_server_time(). Phase 4 (sa-comprehensive-test-strategy) round-3 flagged this module as having no test file and no permission logic in source, and asked for a follow-up look at whether that's a real gap or intentionally public. Verified empirically here, not just by reading the source: the function has no @frappe.whitelist(allow_guest=True), so it still requires a log…

- **TestGetServerTime**
  - `test_returns_iso_8601_string_for_administrator`
  - `test_any_authenticated_roleless_user_can_call_it`
  - `test_reflects_real_server_clock_not_a_stub`

</details>

<details>
<summary><code>ury.ury.api.test_ury_service_line</code> (14)</summary>

- **TestGetServiceLine**
  - `test_cache_hit_returns_immediately`
  - `test_unoccupied_table_stage_open`
  - `test_occupied_table_stage_fired_when_kot_not_served`
  - `test_occupied_table_stage_served_when_kot_served`
  - `test_occupied_table_stage_seated_when_no_invoice`
  - `test_take_away_table_is_skipped`
  - `test_table_stage_over_when_minutes_exceed_75`
- **TestGetRunningLow**
  - `test_cache_hit_returns_immediately`
  - `test_running_low_with_items`
  - `test_running_low_negative_stock_flags_data_quality`
  - `test_running_low_no_items_sold`
  - `test_running_low_no_branch`
- **TestServiceLineRealPermissionBoundary**: Real (non-mocked) coverage of `require_manager()` for this module. Every test class above in this file patches `require_manager` out entirely, so the actual permission gate guarding `get_service_line…
  - `test_get_service_line_rejects_user_without_manager_role`
  - `test_get_running_low_rejects_user_without_manager_role`

</details>

<details>
<summary><code>ury.ury.api.test_ury_stock_authority_shadow_report</code> (4)</summary>

- **TestGetShadowComparisonReport**
  - `test_consistent_made_to_order_case`
  - `test_pre_produced_case_is_trivially_consistent_with_no_shadow_entry`
  - `test_inconsistent_case_is_flagged`
- **TestGetShadowComparisonReportPermissionBoundary**: Real, un-mocked negative-permission coverage. Fixed as part of this test round: `get_shadow_comparison_report` had NO permission check at all in source -- confirmed by reading the function directly, …
  - `test_roleless_user_is_rejected_before_any_report_query_runs`

</details>

<details>
<summary><code>ury.ury.api.test_ury_stock_policy</code> (27)</summary>

> T1 (I-1) tests: per-branch POS stock authority tier resolution. Two properties are under test, and they are the two everything downstream (T2-T6) depends on: 1. All four LEGAL states resolve exactly, and the illegal ones are unreachable -- rejected at the doctype validation level, and neutralised at the resolver level if they ever reach the database out of band. 2. Every failure mode falls back t…

- **TestStockPolicyLegalStates**: The four legal states of the tier gate (architecture brief 3.4).
  - `test_state_1_all_off_is_tier_1`
  - `test_state_2_reservations_only`
  - `test_state_3_production_posting_advisory`
  - `test_state_4_tier_2_enforcing`
  - `test_fields_are_strict_bools_not_ints`
- **TestStockPolicyFailsClosed**: Every failure mode must resolve to all-off. Tier 1 is the known-good tier; falling back to anything else is a stock-correctness incident.
  - `test_no_branch_argument`
  - `test_non_string_branch_argument`
  - `test_missing_row`
  - `test_missing_doctype_or_table`
  - `test_db_error`
  - `test_malformed_row_wrong_value_type`
  - `test_malformed_row_unparseable_string`
  - `test_row_missing_expected_keys`
  - `test_string_zero_does_not_fail_open`
  - `test_illegal_production_without_reservation`
  - `test_illegal_closing_without_production`
  - `test_illegal_closing_only`
  - `test_resolver_never_raises`
- **TestStockPolicyRequestCache**
  - `test_repeat_reads_hit_the_db_once`
  - `test_cache_is_per_branch`
  - `test_clearing_the_cache_forces_a_reread`
- **TestBranchStockPolicyDoctypeValidation**: The dependency constraint is a hard validation error, not only a resolver-side neutralisation -- an operator who ticks the wrong box must be told, not silently left on Tier 1.
  - `test_production_without_reservation_is_rejected`
  - `test_closing_without_production_is_rejected`
  - `test_closing_only_is_rejected`
  - `test_legal_states_validate`
  - `test_enabling_stamps_actor_and_time`
  - `test_all_off_does_not_stamp`

</details>

<details>
<summary><code>ury.ury.api.test_ury_stock_service</code> (22)</summary>

- **TestTransferToDepartment**
  - `test_transfer_within_authorized_qty_succeeds`
  - `test_transfer_rejected_when_exceeding_authorized_qty`
  - `test_transfer_rejected_when_authorization_not_authorized`
  - `test_branch_mismatch_fails_closed`
  - `test_company_scope_ambiguity_fails_closed`
  - `test_permission_check_blocks_unauthorized_actor`
  - `test_non_positive_qty_rejected`
- **TestReceiveAtDepartment**
  - `test_receipt_confirms_within_transfer_qty`
  - `test_receipt_rejected_when_exceeding_outstanding_transfer_qty`
  - `test_receipt_rejected_when_referenced_movement_is_not_transfer`
- **TestReturnToCentralStore**
  - `test_return_within_received_holding_succeeds`
  - `test_return_rejected_when_exceeding_effective_holding`
  - `test_return_of_unreceived_material_rejected`
  - `test_branch_mismatch_fails_closed`
- **TestPureFormulas**
  - `test_remaining_transferable_qty_formula`
  - `test_remaining_transferable_qty_floors_at_zero`
  - `test_effective_department_holding_formula`
  - `test_effective_department_holding_floors_at_zero`
- **TestListStockMovements**
  - `test_list_scoped_by_branch_succeeds`
  - `test_missing_branch_fails_closed`
  - `test_department_and_date_filters_narrow_results`
  - `test_permission_check_blocks_unauthorized_actor`

</details>

<details>
<summary><code>ury.ury.api.test_ury_waiter_print</code> (18)</summary>

- **TestURYWaiterPrint**
  - `test_build_combined_kot_doc_merges_multiple_kots`
  - `test_build_combined_kot_doc_aggregates_same_item`
  - `test_build_combined_kot_doc_includes_cancel_lines`
  - `test_first_time_add_shows_single_quantity`
  - `test_existing_item_increase_shows_old_new`
  - `test_existing_item_partial_cancel_shows_old_new`
  - `test_full_cancel_shows_old_to_zero`
  - `test_prints_combined_kot_for_dine_in`
  - `test_skips_when_combined_items_empty`
  - `test_skips_takeaway_tables`
  - `test_skips_without_restaurant_table`
  - `test_skips_when_no_waiter_printers`
  - `test_skips_when_printer_format_not_set`
  - `test_skips_when_format_missing`
  - `test_skips_when_format_wrong_doctype`
  - `test_kot_execute_prints_once_with_all_created_kots`
  - `test_kot_reprint_does_not_call_waiter_print`
  - `test_waiter_format_excludes_pricing_sections`

</details>

<details>
<summary><code>ury.ury.api.test_ury_wastage</code> (17)</summary>

- **TestCaptureWastage**
  - `test_capture_succeeds_within_held_qty`
  - `test_capture_rejected_when_exceeding_held_qty`
  - `test_capture_rejected_when_yield_check_already_exists`: Mirror of `URYYieldCheck.validate_no_duplicate_wastage`, in the reverse order: once a Yield Check already exists for this authorization, capturing wastage against it must fail closed too -- otherwise…
  - `test_branch_mismatch_fails_closed`
  - `test_company_scope_ambiguity_fails_closed`
  - `test_unauthorized_actor_rejected_role_check`
  - `test_unauthorized_actor_rejected_has_permission_false`
  - `test_capture_rejects_unauthorized_issue_authorization_status`
- **TestApproveWastage**
  - `test_draft_wastage_does_not_count_until_approved`
  - `test_approval_requires_correct_permission`
  - `test_approval_succeeds_with_authorized_role_and_flips_status`
  - `test_reject_wastage_leaves_status_rejected`
- **TestValuationHook**
  - `test_valuation_hook_computes_qty_times_rate`
  - `test_valuation_hook_uses_rate_already_on_doc_when_not_passed`
- **TestListWastage**
  - `test_list_scoped_by_branch_succeeds`
  - `test_list_fails_closed_when_branch_missing`
  - `test_list_narrowed_by_department_and_date_filters`

</details>

<details>
<summary><code>ury.ury.api.test_ury_work_order_hooks</code> (39)</summary>

> Tests for ury_work_order_hooks (Agent 6, Production Plan Automation). No live bench/site DB dependency is exercised beyond what FrappeTestCase already gives us -- every Work Order / Production Plan involved is a plain in-memory stand-in (``frappe._dict`` + a couple of small helper classes), following the same mocking pattern as ``test_ury_manufacture_enforcement.py`` and ``test_ury_batch_manufact…

- **TestIsUryWorkOrder**
  - `test_false_when_no_production_plan_linked`
  - `test_false_when_production_plan_has_no_ury_sales_plan`
  - `test_true_when_production_plan_has_ury_sales_plan`
  - `test_production_plan_item_alone_is_not_sufficient`
- **TestGetLinkedProductionPlan**
  - `test_returns_none_without_a_production_plan_link`
  - `test_fetches_the_linked_production_plan_doc`
- **TestApplyUryWarehousePolicy**
  - `test_sets_skip_transfer_and_clears_wip_warehouse`
  - `test_sets_source_and_fg_warehouse_to_department_warehouse`
  - `test_forces_every_existing_required_item_row_source_warehouse`
  - `test_idempotent_on_repeated_calls`
- **TestApplyUryRequiredItems**
  - `test_replaces_rows_wholesale_from_the_component_vector`
  - `test_every_new_row_gets_the_work_orders_source_warehouse`
  - `test_empty_component_vector_clears_required_items`
- **TestRequiredItemsRewriteAllowed**
  - `test_allowed_for_a_clean_draft`
  - `test_allowed_for_a_draft_with_no_required_items_at_all`
  - `test_disallowed_when_submitted`
  - `test_disallowed_when_cancelled`
  - `test_disallowed_when_any_row_has_transferred_qty`
  - `test_disallowed_when_any_row_has_consumed_qty`
- **TestIsNoWorkOrderRow**
  - `test_false_when_no_production_plan_item_linked`
  - `test_false_when_production_plan_item_row_has_no_flag`
  - `test_true_when_production_plan_item_row_is_flagged`
- **TestValidateHook**
  - `test_refuses_a_work_order_against_a_no_work_order_row`
  - `test_refusal_fires_even_for_a_work_order_with_no_ury_sales_plan_link`
  - `test_allows_mto_kot_work_order_against_flagged_row`
  - `test_refusal_still_fires_when_flag_is_falsy`
  - `test_does_not_refuse_a_work_order_with_no_flag_set`
  - `test_noop_for_a_non_ury_work_order_with_no_production_plan`
  - `test_noop_for_a_production_plan_without_a_ury_sales_plan`
  - `test_reasserts_warehouse_policy_for_a_ury_work_order`
  - `test_reasserts_warehouse_policy_even_when_submitted`
  - `test_does_not_touch_required_items_when_no_vector_is_supplied`
  - `test_rewrites_required_items_from_the_flagged_vector_on_a_clean_draft`
  - `test_never_rewrites_required_items_on_a_submitted_work_order`
  - `test_never_rewrites_required_items_with_transferred_qty`
  - `test_never_rewrites_required_items_with_consumed_qty`
- **TestDoesNotRegressExistingCallers**: `ury_mto_work_order_service` and `ury_batch_manufacture_service` both build Work Orders with `wip_warehouse = fg_warehouse = source`, and neither depends on the URY warehouse-policy reassertion in `v…
  - `test_mto_style_work_order_is_not_ury`
  - `test_batch_manufacture_style_work_order_is_not_ury`
  - `test_validate_hook_does_not_touch_an_mto_or_batch_style_work_order`

</details>

<details>
<summary><code>ury.ury.api.test_ury_workflow</code> (7)</summary>

- **TestURYWorkflowGeneric**: get_workflow_status()/apply_workflow_action() are generic, doctype- agnostic wrappers around frappe.model.workflow -- exercised here against "URY Sales Plan" (which already has an active Workflow fix…
  - `test_get_workflow_status_reports_current_state_and_manager_actions`
  - `test_get_workflow_status_hides_actions_for_non_manager`
  - `test_apply_workflow_action_transitions_draft_to_proposed`
  - `test_apply_workflow_action_rejects_non_manager`
  - `test_apply_workflow_action_walks_every_state_to_cancelled`: The generic endpoint must be able to drive EVERY edge declared on the workflow -- including the two that start from an already-submitted doc, which Frappe routes to `update_after_submit` (Approved ->…
  - `test_apply_workflow_action_reports_unknown_action_as_validation_error`
  - `test_unsatisfied_condition_is_a_validation_error_not_a_permission_error`: A transition the user HAS the role for but whose `condition` doesn't hold must not be reported as a permission failure. `get_transitions()` filters on role membership AND condition, so the endpoint's…

</details>

<details>
<summary><code>ury.ury.api.test_ury_workstation_mapping</code> (11)</summary>

> Tests for V3-60 ury_workstation_mapping.py. No bench/DB is available in this worktree (static-review only, per task instructions). These tests use `unittest.mock` to stub out `frappe.db.*`, `frappe.get_meta`, and `frappe.get_roles` so the module's control flow can be exercised without a live site. This mirrors the "no bench -- static review" disclosure used by V3-53's test module for the same env…

- **TestMappingAbsentReturnsNoneGracefully**: Proves the non-breaking default: no field applied yet -> None, no error.
  - `test_field_not_applied_returns_none`
  - `test_missing_production_unit_returns_none`
  - `test_empty_production_unit_returns_none`
  - `test_field_applied_but_unset_returns_none`
- **TestValidateMappingIsOptional**
  - `test_never_raises_for_unmapped_unit`
  - `test_never_raises_for_missing_unit`
- **TestSetWorkstationMappingSuccess**
  - `test_manager_can_set_valid_mapping`
- **TestSetWorkstationMappingNonExistentWorkstation**
  - `test_fails_closed_for_missing_workstation`
- **TestSetWorkstationMappingUnauthorized**
  - `test_non_manager_cannot_set_mapping`
- **TestSetWorkstationMappingCompanyScope**
  - `test_mismatched_company_fails_closed`
- **TestSetWorkstationMappingFieldNotApplied**
  - `test_refuses_write_when_field_not_yet_applied`

</details>

<details>
<summary><code>ury.ury.api.test_ury_yield_variance</code> (42)</summary>

- **TestRecordYieldCheckPermissionGating**: Test record_yield_check permission and scope gating.
  - `test_has_permission_gate_enforced`: record_yield_check requires doctype create permission (I7: relaxed from manager-only to any authenticated user with create permission -- this replaced the old require_manager() gate for this endpoint…
  - `test_require_scope_called_with_company`: record_yield_check calls _require_scope(company).
  - `test_record_yield_check_creates_and_inserts_document`: record_yield_check creates URY Yield Check and inserts it.
  - `test_record_yield_check_with_optional_fields`: record_yield_check includes optional fields when provided.
  - `test_record_yield_check_returns_key_fields`: record_yield_check return dict includes required key fields.
- **TestGetYieldVariancePermissionGating**: Test get_yield_variance permission and scope gating.
  - `test_require_manager_called`: get_yield_variance calls require_manager().
  - `test_require_scope_called_with_company`: get_yield_variance calls _require_scope(company).
  - `test_get_yield_variance_retrieves_all_records_for_company`: get_yield_variance filters by company only.
  - `test_get_yield_variance_with_branch_filter`: get_yield_variance adds branch filter when provided.
  - `test_get_yield_variance_with_item_filter`: get_yield_variance adds item filter when provided.
  - `test_get_yield_variance_ordered_by_checked_on_desc`: get_yield_variance orders results by checked_on descending.
  - `test_get_yield_variance_limited_to_200_records`: get_yield_variance limits results to 200 records.
- **TestGetYieldCheckCompliancePermissionGating**: Test get_yield_check_compliance permission and scope gating.
  - `test_require_manager_called`: get_yield_check_compliance calls require_manager().
  - `test_require_scope_called_with_company`: get_yield_check_compliance calls _require_scope(company).
  - `test_get_yield_check_compliance_returns_list_of_items`: get_yield_check_compliance returns a list of compliance records.
  - `test_branch_scopes_tracked_items_to_bom_usage`: F8 (corrected): when branch is given, only items that resolve via branch_item_codes() (active IPC rows -> their BOM -> BOM Item components) are evaluated — NOT items with a direct IPC row, which per …
  - `test_branch_with_no_bom_usage_returns_empty`: F8 (corrected): a branch that resolves to no BOM-usage items (no active IPC rows, no BOM on those rows, or no BOM components) gets an empty compliance list instead of the unscoped global item set.
- **TestRequireScope**: Test _require_scope helper function.
  - `test_require_scope_throws_when_company_is_none`: _require_scope fails closed when company is None.
  - `test_require_scope_throws_when_company_is_empty_string`: _require_scope fails closed when company is empty string.
  - `test_require_scope_passes_when_company_is_set`: _require_scope passes when company is not empty.
- **TestUserHasBranchAccess**: Test B1: user_has_branch_access permission gating.
  - `test_returns_true_for_administrator`: Administrator user has access to any branch.
  - `test_returns_true_for_system_manager_role`: User with System Manager role has access to any branch.
  - `test_returns_true_when_user_in_branch_table`: User listed in Branch's user child table has access.
  - `test_returns_false_when_user_not_in_branch_table`: User NOT listed in Branch's user table denied access.
  - `test_returns_false_when_user_is_none`: None user has no access.
  - `test_returns_false_when_branch_is_none`: None branch check returns False (guard clause).
  - `test_returns_false_when_both_are_none`: Both None returns False.
  - `test_returns_false_when_empty_string_user`: Empty string user has no access.
  - `test_returns_false_when_empty_string_branch`: Empty string branch check returns False.
- **TestRecordYieldCheckBranchAccessGating**: Test B1: record_yield_check enforces user-branch access.
  - `test_calls_user_has_branch_access`: record_yield_check checks user's branch access.
  - `test_user_has_branch_access_receives_session_user`: record_yield_check passes frappe.session.user to branch access check.
  - `test_throws_permission_error_when_no_branch_access`: record_yield_check raises PermissionError when user lacks branch access.
- **TestYieldCheckComplianceRealDocumentIntegration**: F9: real-document coverage for get_yield_check_compliance -- every other test in this file mocks frappe.get_all/get_value, so none of them inserted an actual Item/URY Issue Authorization/URY Yield Ch…
  - `test_real_compliance_is_null_for_zero_required_count`: DECIDED (TRACK.md F9): required_count == 0 means NOT MEASURABLE, so compliance_percent is None (JSON null), NOT a flattering 100%. An Interval-cadence item with interval_days<=0 is skipped by the cad…
  - `test_real_compliance_computes_from_real_authorizations_and_checks`: Every Issue cadence: 2 real Authorized Issue Authorizations, only 1 with a real Yield Check recorded against it -> required_count=2, completed_count=1, compliance_percent=50.0, computed by the real a…
- **TestUpdateYieldStandardsPermissionGating**: F2: update_yield_standards must be manager-gated -- these are costing-grade fields (drive BOM back-calculation and Yield Check variance baselines) that were previously writable by anyone with plain I…
  - `test_require_manager_called_and_enforced`: A non-manager caller is rejected before anything else runs.
  - `test_manager_write_succeeds_and_saves_fields`: A manager caller passes the gate and the four fields are set + saved.
  - `test_rejects_missing_item`
  - `test_rejects_out_of_range_percent`
  - `test_rejects_invalid_cadence`
- **TestYieldStandardFieldsRawWritePathBlocked**: F2 follow-up (PR #435 adversarial review): the permission-gating tests above only prove that update_yield_standards() calls require_manager() -- they patch require_manager() itself, so they cannot de…
  - `test_nonmanager_cannot_raw_set_value_yield_percent`: A non-manager with plain Item write permission cannot change custom_yield_percent via the raw frappe.client.set_value endpoint -- the same call the frontend used to make before #435, and that any cur…
  - `test_nonmanager_cannot_raw_doc_save_yield_percent`: Same as above but via frappe.get_doc(...).save() directly -- confirms the block is a real permission boundary (permlevel / validate hook), not just something wired into the set_value RPC wrapper spec…
  - `test_manager_can_still_update_via_update_yield_standards`: Regression check: the intended, manager-gated path must keep working after the permlevel change -- managers still need to be able to set these fields through update_yield_standards().

</details>

### `ury/ury/api/minimal`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_business_setup` | 8 | ✅ | моки |
| `test_setup_organization` | 26 | ✅ | моки |

<details>
<summary><code>ury.ury.api.minimal.test_business_setup</code> (8)</summary>

- **TestSubmitConfigureDataGuard**: Guard added to submit_configure_data(): reject Guest callers, and reject any call once URY setup (Step 1 and Step 2) is already complete. System Settings.setup_complete alone is not the guard, becaus…
  - `test_guest_user_is_rejected`
  - `test_setup_already_completed_is_rejected`
  - `test_step1_setup_complete_flag_does_not_block_step2`
  - `test_setup_not_completed_and_authenticated_user_passes_guard`
- **TestSubmitConfigureDataRollback**: Transaction safety: submit_configure_data() wraps the whole configure flow (via the private _run_configure_data helper) in try/except and calls frappe.db.rollback() on any failure, matching the conve…
  - `test_generic_failure_partway_through_triggers_rollback`
  - `test_permission_error_partway_through_triggers_rollback_and_reraises`
  - `test_success_path_never_rolls_back`
- **TestPrepareAndInsertItem**
  - `test_hsn_code_is_set_when_field_exists`

</details>

<details>
<summary><code>ury.ury.api.minimal.test_setup_organization</code> (26)</summary>

- **TestGetSetupDefaults**: Guard added to get_setup_defaults(): reject Guest callers. Happy path returns languages, countries, currencies, and timezones. Tests use mocks to avoid dependency on frappe.geo and pytz data.
  - `test_guest_user_is_rejected`
  - `test_authenticated_user_gets_setup_defaults`
  - `test_guest_country_defaults_rejected`
  - `test_country_defaults_success`
  - `test_normalize_dict_payload`
  - `test_normalize_fy_date_full`
  - `test_progress_cache_key_is_site_wide`
  - `test_remember_dict_message`
  - `test_remember_ignores_non_dict`
  - `test_wizard_status_guest_rejected`
  - `test_wizard_status_both_incomplete`
  - `test_wizard_status_both_complete`
  - `test_run_setup_complete_success`
  - `test_run_setup_retry_deadlock`
  - `test_progress_status_guest_rejected`
  - `test_progress_status_returns_cached`
  - `test_progress_status_empty_when_none`
  - `test_progress_status_reports_ok_from_database`
- **TestRecordSetupFailure**: `setup_wizard_exception` hook: a failed setup must be readable over HTTP, because Frappe announces it only through the realtime socket and the worker process never runs submit_setup()'s publish_realt…
  - `test_failure_is_cached_with_message`
  - `test_failure_without_traceback_still_reports_fail`
  - `test_progress_steps_guest_rejected`
  - `test_progress_steps_returns_list`
  - `test_submit_setup_guest_rejected`
  - `test_submit_setup_already_complete`
  - `test_submit_setup_success`
  - `test_complete_wizard_calls_submit`

</details>

### `ury/ury/controllers`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_serve_pwa` | 12 | ❌ | моки |
| `test_setup_redirect` | 36 | ✅ | моки |

<details>
<summary><code>ury.ury.controllers.test_serve_pwa</code> (12)</summary>

> Tests for Serve PWA headers, SW source policy, and route precedence.

- **TestServeRouteMatching**
  - `test_exact_and_nested_serve_routes`
  - `test_serve_precedes_ury_catchall`
  - `test_hooks_declare_sw_before_spa_catchall`
- **TestServeServiceWorkerHeaders**
  - `test_sets_scope_and_javascript_content_type`
  - `test_ignores_unrelated_paths`
  - `test_www_alias_also_gets_headers`
  - `test_does_not_relabel_error_html_as_javascript`
  - `test_does_not_relabel_login_html_as_javascript`
- **TestServeServiceWorkerSource**
  - `test_loads_workspace_public_sw`
  - `test_activate_only_deletes_ury_serve_prefix_caches`: Regression: must not wipe POS / order / management Cache Storage.
  - `test_sw_script_not_handled_as_navigation_offline_fallback`
  - `test_stale_cache_helper_preserves_foreign_keys`: Run the SW helper in Node so POS/order caches are proven untouched.

</details>

<details>
<summary><code>ury.ury.controllers.test_setup_redirect</code> (36)</summary>

- **TestSetupWizardTarget**
  - `test_starts_at_step_0_when_no_company`
  - `test_resumes_at_step_1_when_company_exists_without_branch`
  - `test_step_0_when_both_company_and_branch_exist`
- **TestShouldRedirect**
  - `test_skips_guest`
  - `test_skips_when_setup_complete`
  - `test_redirects_desk_and_landing_paths`
  - `test_skips_wizard_api_and_login_paths`
- **TestWebsitePathResolver**
  - `test_passes_through_when_setup_complete`
  - `test_passes_through_guest`
  - `test_passes_through_ury_and_api_paths`
  - `test_redirects_app_with_302`
  - `test_redirects_app_setup_wizard`
  - `test_redirects_empty_path`
  - `test_resumes_at_step_1_when_company_exists`
- **TestIsUrySetupComplete**
  - `test_complete_when_frappe_setup_and_branch_exist`
  - `test_incomplete_without_branch`
  - `test_incomplete_when_frappe_setup_not_done`
  - `test_incomplete_on_setup_check_error`
- **TestBootAndSessionHooks**
  - `test_on_session_creation_sets_home_page`
  - `test_on_session_creation_noop_when_complete`
  - `test_extend_bootinfo_sets_ury_flag_and_target`
  - `test_extend_bootinfo_complete_does_not_set_target`
- **TestInterruptedSetupRepair**: A setup stage that fails after earlier stages' DDL has implicitly committed leaves the site reading as complete while Frappe's "Wrapping up" never ran -- Desk home page still the wizard. Desk then bo…
  - `test_detects_wizard_home_page_on_a_complete_site`
  - `test_settled_home_page_is_not_stale`
  - `test_wizard_home_page_is_expected_before_setup_completes`
  - `test_repair_runs_frappes_own_wrap_up`
  - `test_repair_is_a_noop_on_a_healthy_site`
  - `test_repair_does_not_write_on_a_read_only_request`
- **TestBootUnwedgesDesk**: Even before the stored default is rewritten (read-only request, cached boot), the boot handed to Desk must not carry the looping pair.
  - `test_stale_home_page_is_overridden_for_desk`
  - `test_wizard_home_page_is_left_alone_before_setup_completes`
  - `test_normal_home_page_is_untouched`
  - `test_guest_boot_never_repairs`
- **TestRepairIsSingleFlight**: Every parallel boot sees the same stale pair. Without a claim they all write the same row and deadlock on SELECT ... FOR UPDATE -- which is what happened the first time this repair ran against a live…
  - `test_loser_of_the_claim_does_not_write`
  - `test_deadlock_is_not_an_error_for_this_boot`
  - `test_claim_is_taken_only_once`
  - `test_unreachable_cache_means_no_claim`

</details>

### `ury/ury/dev_seed`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_demo_runner` | 2 | ✅ | реальная БД |

<details>
<summary><code>ury.ury.dev_seed.test_demo_runner</code> (2)</summary>

> Tests for the unified URY demo-data runner. These tests hit the real database because the runner itself is a data-seeding script. They assert that the runner completes without errors and that a second run does not duplicate the bulk of the seeded data.

- **TestDemoRunner**
  - `test_seed_all_completes_and_creates_key_records`: seed_all() should run every module without raising and leave the site with the demo records the front-end dashboards/reports expect.
  - `test_seed_all_is_idempotent`: A second run should not blow up and should not duplicate most seeded data. Today's invoices are capped at TODAY_ORDER_COUNT, so a small increase on the first re-run (when the target has not yet been …

</details>

### `ury/ury/doctype`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_alert_settings` | 11 | ✅ | моки |
| `test_bulk_production` | 13 | ✅ | моки |
| `test_menu_for_room` | 0 | ✅ |  |
| `test_staff_discount_policy` | 18 | ✅ | моки |
| `test_stock_correction` | 23 | ✅ | моки, реальная БД |
| `test_sub_pos_closing` | 5 | ✅ | моки |
| `test_sub_pos_closing_lookups` | 4 | ✅ | моки |
| `test_ury_commission_settings` | 20 | ✅ | от имени пользователя |
| `test_ury_daily_p_and_l` | 7 | ✅ | моки |
| `test_ury_daily_p_and_l_get_profit_loss_details` | 1 | ✅ | моки |
| `test_ury_insight` | 7 | ✅ | реальная БД, от имени пользователя |
| `test_ury_item_production_configuration` | 19 | ✅ | моки, реальная БД |
| `test_ury_kot` | 0 | ✅ |  |
| `test_ury_kot_error_log` | 5 | ✅ | реальная БД, от имени пользователя |
| `test_ury_kot_execution` | 4 | ✅ | реальная БД |
| `test_ury_kot_item_execution` | 1 | ✅ | реальная БД |
| `test_ury_menu` | 6 | ✅ | моки, реальная БД |
| `test_ury_menu_course` | 3 | ✅ | реальная БД |
| `test_ury_notification_recipient` | 0 | ✅ |  |
| `test_ury_order` | 62 | ✅ | моки |
| `test_ury_order_billing` | 60 | ❌ | моки |
| `test_ury_order_sync_validation` | 23 | ❌ | моки |
| `test_ury_order_item` | 0 | ✅ |  |
| `test_ury_ordering_device` | 0 | ✅ |  |
| `test_ury_ordering_session` | 0 | ✅ |  |
| `test_ury_payment_terminal` | 5 | ✅ | реальная БД |
| `test_ury_payment_terminal_transaction` | 5 | ✅ | реальная БД |
| `test_ury_pos_shift_report` | 29 | ❌ | моки |
| `test_ury_production_department` | 5 | ✅ | реальная БД |
| `test_ury_production_unit` | 2 | ✅ | реальная БД |
| `test_ury_report_settings` | 5 | ✅ | реальная БД |
| `test_ury_restaurant` | 0 | ✅ |  |
| `test_ury_room` | 0 | ✅ |  |
| `test_ury_self_ordering_profile` | 4 | ✅ | реальная БД |
| `test_ury_service_request` | 0 | ✅ |  |
| `test_ury_stock_reservation` | 0 | ❌ |  |
| `test_ury_table` | 3 | ✅ | реальная БД |
| `test_ury_yield_check` | 47 | ✅ | моки, реальная БД |

<details>
<summary><code>ury.ury.doctype.alert_settings.test_alert_settings</code> (11)</summary>

> Tests for alert_settings.get_alert_rule() and the AlertRule/AlertRuleRole/ AlertSettings controllers. Static-review note: these tests are written and hand-traced against the mocking pattern used by `ury/ury/api/test_ury_daily_p_and_l.py` and `ury/ury/api/test_ury_kot_execution_service.py` (patching `frappe.get_single` so the module under test never touches a real database). `alert_rule.py` and `a…

- **TestGetAlertRule**
  - `test_no_custom_alerts_returns_none`
  - `test_custom_alerts_none_returns_none`
  - `test_branch_specific_rule_takes_priority_over_global`
  - `test_falls_back_to_global_default_when_no_branch_match`
  - `test_no_branch_argument_uses_global_default_directly`
  - `test_disabled_rule_is_ignored_even_on_exact_branch_match`
  - `test_disabled_global_default_is_ignored`
  - `test_no_matching_alert_type_returns_none`
- **TestAlertControllersConstructBare**: alert_rule.py / alert_rule_role.py / alert_settings.py's `Document` subclasses have no custom __init__/validate of their own (verified by direct source read) -- guard that against silent future break…
  - `test_alert_rule_document_constructs`
  - `test_alert_rule_role_document_constructs`
  - `test_alert_settings_document_constructs`

</details>

<details>
<summary><code>ury.ury.doctype.bulk_production.test_bulk_production</code> (13)</summary>

> Tests for bulk_production.py's validation and cost-calculation logic. Static-review note: written and hand-traced against the mocking pattern used by `ury/ury/api/test_ury_daily_p_and_l.py` and `ury/ury/hooks/test_ury_bom.py` (patching `frappe.get_value`/`frappe.db.get_value`/`frappe.throw` directly, never touching a real database). Scope decision, per this track's stated mock-vs-IntegrationTestC…

- **TestValidateItem**
  - `test_negative_qty_raises`
  - `test_zero_qty_is_treated_as_missing_and_raises`
  - `test_inactive_bom_raises`
  - `test_duplicate_item_name_raises`
  - `test_valid_unique_items_do_not_raise`
  - `test_multiple_issues_on_same_row_are_all_reported`
- **TestGetTotalCost**
  - `test_precomputed_cost_is_summed_without_bom_lookup`
  - `test_missing_cost_is_derived_from_bom_total_cost_and_quantity`
- **TestGetBomCost**
  - `test_returns_total_cost_divided_by_quantity`
- **TestFetchLastPurchaseRate**
  - `test_delegates_to_frappe_db_get_value`
- **TestCreateStockEntryExemptsManufactureEnforcement**: create_stock_entry() must mark the Stock Entry it builds as exempt from ury_manufacture_enforcement.validate_manufacture_requires_work_order -- this doctype hand-builds a work_order-less Manufacture …
  - `test_flag_is_set_before_insert`
- **TestEnqueueSaveStockentry**: Queue-vs-inline dispatch logic in enqueue_save_stockentry()/ cancel_stock_entry_queue() -- pure branching on row count, no real Stock Entry writes here (those are covered by save_stockentry/create_st…
  - `test_ten_or_more_items_are_queued_not_run_inline`
  - `test_fewer_than_ten_items_run_inline`

</details>

<details>
<summary><code>ury.ury.doctype.menu_for_room.test_menu_for_room</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.staff_discount_policy.test_staff_discount_policy</code> (18)</summary>

> Tests for staff_discount_policy.py (COVERAGE_GAP_ANALYSIS.md: zero test file on both the doctype AND its whitelisted `get_applicable_policy`, Top 15 item #14 -- "a pricing/discount rule with no coverage in either direction"). Mocked per this track's read-path convention: the module's own private helpers are pure functions over an already-loaded policy doc, and `get_applicable_policy` itself is a …

- **TestIsWithinValidity**
  - `test_no_dates_is_always_valid`
  - `test_before_valid_from_is_invalid`
  - `test_after_valid_to_is_invalid`
  - `test_within_range_is_valid`
- **TestMatchesEligibility**
  - `test_role_match`
  - `test_employee_group_match`
  - `test_customer_group_match`
  - `test_unknown_applies_to_never_matches`
- **TestMatchesItemGroup**
  - `test_no_item_group_requested_always_matches`
  - `test_no_restriction_on_policy_always_matches`
  - `test_matching_item_group`
  - `test_nonmatching_item_group`
- **TestGetApplicablePolicy**
  - `test_equal_priority_matches_are_rejected`
  - `test_no_enabled_policies_returns_none`
  - `test_branch_specific_policy_wins_over_global`
  - `test_policy_for_other_branch_is_excluded`
  - `test_no_matching_role_returns_none`
  - `test_item_group_restriction_excludes_policy`

</details>

<details>
<summary><code>ury.ury.doctype.stock_correction.test_stock_correction</code> (23)</summary>

> Tests for stock_correction.py. Priority-3 audit (sa-comprehensive-test-strategy Phase 2, round 3): `stock_correction` had ZERO test files despite having validate/on_submit/ on_cancel hooks that directly adjust inventory quantities (Table 2 & Table 4 of COVERAGE_GAP_ANALYSIS.md, item #5 of the Top 15). Scope, per this track's mock-vs-IntegrationTestCase split: `validate()`'s five sub-checks are pu…

- **TestValidateReferenceStockReconciliation**
  - `test_no_reference_is_a_noop`
  - `test_nonexistent_reference_raises`
  - `test_unsubmitted_reference_raises`
  - `test_submitted_reference_passes`
- **TestValidateWarehouseBelongsToBranch**
  - `test_missing_branch_or_warehouse_is_a_noop`
  - `test_mismatched_warehouse_raises`
  - `test_matching_warehouse_passes`
  - `test_no_branch_warehouse_mapping_found_passes`
- **TestValidateItems**
  - `test_no_items_raises`
  - `test_zero_qty_row_raises`
  - `test_nonzero_qty_rows_pass`
- **TestValidateSingleDirection**
  - `test_all_positive_passes`
  - `test_all_negative_passes`
  - `test_mixed_signs_raises`
- **TestValidateFullFlow**: validate() calls all four sub-checks in sequence.
  - `test_validate_calls_all_subchecks`
- **TestOnSubmitOnCancel**
  - `test_on_submit_delegates_to_create_and_submit_stock_entry`
  - `test_on_cancel_delegates_to_cancel_stock_entry`
  - `test_cancel_stock_entry_noop_without_linked_entry`
  - `test_cancel_stock_entry_cancels_submitted_linked_entry`
  - `test_cancel_stock_entry_skips_already_cancelled_entry`
- **TestCreateAndSubmitStockEntry**: Split-by-direction dispatch logic -- the actual `_make_stock_entry` call is mocked out since it performs a real ERPNext Stock Entry insert+submit (deferred to the IntegrationTestCase follow-up).
  - `test_only_receipt_items_makes_single_material_receipt_entry`
  - `test_only_issue_items_makes_single_material_issue_entry`
  - `test_no_items_creates_no_stock_entries`

</details>

<details>
<summary><code>ury.ury.doctype.sub_pos_closing.test_sub_pos_closing</code> (5)</summary>

- **TestSubPOSClosingSEC09**
  - `test_normal_cashier_forced_user`
  - `test_normal_cashier_other_branch`
  - `test_invalid_pos_profile`
  - `test_supervisor_requests_another_cashier`
  - `test_administrator_bypass_branch`

</details>

<details>
<summary><code>ury.ury.doctype.sub_pos_closing.test_sub_pos_closing_lookups</code> (4)</summary>

> Tests for the two whitelisted lookup helpers in sub_pos_closing.py that had no test reference anywhere in the suite (COVERAGE_GAP_ANALYSIS.md Table 1, "cashier/payment reconciliation" priority): `get_pos_profile` and `get_cashiers`. Both are thin read-only wrappers, mocked per this track's mock-for-read-paths convention (see test_sub_pos_closing.py alongside this file for the same pattern applied…

- **TestGetPosProfile**
  - `test_resolves_pos_profile_for_session_branch`
  - `test_returns_none_when_no_pos_profile_for_branch`
- **TestGetCashiers**
  - `test_returns_users_from_pos_profile_user`
  - `test_returns_empty_list_when_no_cashiers`

</details>

<details>
<summary><code>ury.ury.doctype.ury_commission_settings.test_ury_commission_settings</code> (20)</summary>

- **TestURYCommissionSettings**
  - `test_default_rate_below_zero_fails`
  - `test_default_rate_above_100_fails`
  - `test_default_rate_zero_passes`
  - `test_default_rate_100_passes`
  - `test_default_rate_50_passes`
  - `test_default_rate_none_passes`
  - `test_duplicate_branch_designation_employee_fails`
  - `test_empty_branch_designation_employee_allowed`
  - `test_flat_rate_below_zero_fails`
  - `test_flat_rate_above_100_fails`
  - `test_flat_rate_50_passes`
  - `test_tiered_rule_with_no_tiers_fails`
  - `test_tiered_rule_first_tier_not_starting_at_zero_fails`
  - `test_tiered_rule_non_ascending_tier_amounts_fails`
  - `test_tiered_rule_duplicate_tier_amounts_fails`
  - `test_tiered_rule_tier_rate_below_zero_fails`
  - `test_tiered_rule_tier_rate_above_100_fails`
  - `test_valid_tiered_rule_with_multiple_tiers_passes`
  - `test_valid_config_with_multiple_rules_passes`
  - `test_valid_single_flat_rule_passes`

</details>

<details>
<summary><code>ury.ury.doctype.ury_daily_p_and_l.test_ury_daily_p_and_l</code> (7)</summary>

> Tests for the disposables-cost addition to cogs_sold()/before_submit(). This module cannot spin up a full bench/DB fixture set here, so it follows this codebase's own established test convention for this class of logic (see ury/ury/doctype/ury_order/test_ury_order.py): mock frappe.db.sql / frappe.db.get_all / frappe.get_doc rather than create real records, and assert against both the computed val…

- **TestCogsSoldDisposables**: cogs_sold(): disposables costing and the double-count/boundary fixes.
  - `test_zero_disposables_regression_baseline`: No disposable rows at all: cogs/remarks behave exactly as before this change — the new disposables machinery must be a no-op for branches that don't use it.
  - `test_disposables_costed_separately_from_cogs`: A disposable item with a set buying price lands in `disposables`, contributes to disposables_cost, and is NOT double-counted into cogs via non_pb_item_sales — this is the exact bug confirmed present …
  - `test_fractional_disposable_qty_not_truncated`: Grillax's reference implementation copied `int(item['Qty'])` from the menu-item costing loop into its disposables loop, which truncates fractional per-portion packaging ratios (a real pattern, per ap…
  - `test_unset_disposable_item_price_gets_its_own_remark_bucket`: A disposable item missing a buying-list Item Price must be flagged under its own "DISPOSABLE ITEMS" remarks bucket, not silently dropped (the pre-fix behavior) and not merged into the generic "ITEMS"…
  - `test_all_four_queries_filter_by_is_disposable`: Regression guard for the double-count bug found in grillax's own reference (non_pb_item_sales/bom_item_sales had no is_disposable filter at all). Every one of the three "sold item" queries must exclu…
  - `test_disposables_query_uses_correct_day_boundary_predicate`: Grillax's own disposables query predicate is missing the `OR rs.hours = 0` arm present on every one of ury's sibling queries in this file — since URY Report Settings.hours defaults to 0 for any branc…
- **TestRemarksParserDisposableBucket**: financial.py's remarks parser must recognize the new fourth bucket.
  - `test_parse_missing_price_remarks_handles_disposable_items_bucket`

</details>

<details>
<summary><code>ury.ury.doctype.ury_daily_p_and_l.test_ury_daily_p_and_l_get_profit_loss_details</code> (1)</summary>

> Test for URYDailyPandL.get_proft_loss_details() (COVERAGE_GAP_ANALYSIS.md Table 1: "P&L financial calculation", HIGH -- Top 15 item #8, note the pre-existing typo in the function name is intentional/load-bearing and must not be "fixed" without a matching JS/API-caller update). Mocked per this track's read-path convention: `frappe.render_template` is a pure read+format call over the doc's own alre…

- **TestGetProftLossDetails**
  - `test_renders_template_with_branch_company_currency`

</details>

<details>
<summary><code>ury.ury.doctype.ury_insight.test_ury_insight</code> (7)</summary>

- **TestURYInsightPermissions**: `URY Insight` grants read/write only to System Manager / URY Manager / Administrator (see ury_insight.json permissions) — no public/guest read. These tests exercise that under real user sessions, not…
  - `test_non_manager_cannot_read`
  - `test_non_manager_cannot_call_get_active_insights`
  - `test_non_manager_cannot_write`
  - `test_non_manager_cannot_create`
  - `test_manager_can_read`
  - `test_manager_can_write`
  - `test_administrator_can_read_and_write`

</details>

<details>
<summary><code>ury.ury.doctype.ury_item_production_configuration.test_ury_item_production_configuration</code> (19)</summary>

- **TestURYItemProductionConfiguration**
  - `test_insert_rejects_bom_item_mismatch`
  - `test_insert_rejects_missing_bom_link`
  - `test_insert_rejects_missing_linked_records_without_typeerror`
  - `test_insert_rejects_bom_missing_company_when_branch_has_company`
  - `test_insert_rejects_bom_company_mismatch`
  - `test_insert_rejects_direct_retail_warehouse_missing_company`
  - `test_insert_rejects_missing_direct_retail_warehouse_link`
  - `test_insert_rejects_direct_retail_warehouse_company_mismatch`
  - `test_insert_rejects_department_missing_company_when_branch_has_company`
  - `test_insert_rejects_missing_department_link`
  - `test_insert_rejects_department_company_mismatch`
  - `test_insert_rejects_production_unit_missing_company_when_branch_has_company`
  - `test_insert_rejects_missing_production_unit_link`
  - `test_insert_rejects_production_unit_company_mismatch`
  - `test_insert_rejects_populated_links_when_branch_has_no_company`
  - `test_insert_and_save_accept_matching_ownership`
  - `test_save_revalidates_after_linked_ownership_changes`
  - `test_mto_with_same_department_bom_accepts`: Same-department BOM components save fine.
  - `test_mto_with_cross_department_bom_rejects`: Cross-department BOM component is rejected.

</details>

<details>
<summary><code>ury.ury.doctype.ury_kot.test_ury_kot</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_kot_error_log.test_ury_kot_error_log</code> (5)</summary>

- **TestGetKOTErrors**: Branch scoping of ``get_kot_errors``. These tests run under a *real* session for a least-privileged user (``URY Cashier`` only, which is the weakest role with read access on ``URY KOT Error Log``) ra…
  - `test_cashier_sees_own_branch_rows`: Control: the cashier session really can read its own branch's rows.
  - `test_branch_a_user_does_not_see_branch_b_rows`
  - `test_branch_b_row_is_readable_but_filtered_out`: The Branch B row is hidden by the branch filter, not by permissions. Read directly under the cashier's own session first: if that row is visible there but absent from get_kot_errors' output, the excl…
  - `test_legacy_null_branch_rows_are_excluded`
  - `test_result_rows_expose_expected_fields`

</details>

<details>
<summary><code>ury.ury.doctype.ury_kot_execution.test_ury_kot_execution</code> (4)</summary>

> Doctype-level tests for `URY KOT Execution` and `URY KOT Item Execution`. Both controllers are pure storage `Document` subclasses (verified by reading `ury_kot_execution.py`/`ury_kot_item_execution.py` in full -- both are `pass`-only; every lifecycle rule lives in `ury.ury.api.ury_kot_execution_service`/`ury_kot_item_execution_service`, already covered by `test_ury_kot_execution_service.py`/ `tes…

- **TestURYKOTExecution**
  - `test_insert_with_mandatory_fields_succeeds`
  - `test_missing_kot_link_is_rejected`
  - `test_invalid_state_value_is_rejected`
  - `test_state_can_be_updated_across_lifecycle_transitions`

</details>

<details>
<summary><code>ury.ury.doctype.ury_kot_item_execution.test_ury_kot_item_execution</code> (1)</summary>

> Doctype-level tests for `URY KOT Execution` and `URY KOT Item Execution`. Both controllers are pure storage `Document` subclasses (verified by reading `ury_kot_execution.py`/`ury_kot_item_execution.py` in full -- both are `pass`-only; every lifecycle rule lives in `ury.ury.api.ury_kot_execution_service`/`ury_kot_item_execution_service`, already covered by `test_ury_kot_execution_service.py`/ `tes…

- **TestURYKOTItemExecution**
  - `test_insert_with_mandatory_fields_succeeds`

</details>

<details>
<summary><code>ury.ury.doctype.ury_menu.test_ury_menu</code> (6)</summary>

- **TestURYMenu**
  - `test_validate_autofills_missing_rate_from_item_standard_rate`
  - `test_validate_does_not_override_explicit_rate`
  - `test_notify_newly_blocked_items_noop_when_no_alert_rule_configured`: Alert Settings has no matching rule by default, so blocking an item must not raise or attempt to notify anyone -- get_alert_rule() returns None and notify_newly_blocked_items() should just return qui…
  - `test_notify_newly_blocked_items_skipped_on_new_document`: is_new() guard: a freshly-inserted menu with an already-disabled item must not attempt notification (nothing "newly" changed).
  - `test_on_update_creates_price_list_and_item_price`
  - `test_on_trash_clears_item_prices`

</details>

<details>
<summary><code>ury.ury.doctype.ury_menu_course.test_ury_menu_course</code> (3)</summary>

- **TestURYMenuCourse**
  - `test_get_menu_courses_returns_icon`
  - `test_get_menu_courses_returns_custom_icon`
  - `test_get_menu_courses_returns_empty_icon_when_not_set`

</details>

<details>
<summary><code>ury.ury.doctype.ury_notification_recipient.test_ury_notification_recipient</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_order.test_ury_order</code> (62)</summary>

- **TestURYOrderSEC11**
  - `test_get_order_invoice_unauthorized`
- **TestURYOrder**
  - `test_sync_order_authorized`
  - `test_sync_order_unauthorized`
  - `test_cancel_order_propagates_kot_cancellation_failure`
  - `test_cancel_order_releases_active_reservations`: cancel_order() must release the order's active stock reservations, not just cancel the KOT/invoice -- otherwise cancellation leaks reserved capacity indefinitely (sa-post-373-review-fixes Blocker 3).
  - `test_cancel_order_unauthorized_permission_error`
  - `test_cancel_order_draft_does_not_submit_unpaid_invoice`
  - `test_cancel_order_already_cancelled_makes_no_changes`
  - `test_sync_order_fake_cashier_waiter_new_invoice`
  - `test_sync_order_reconciles_reservations_for_delta`
  - `test_sync_order_skips_reconciliation_when_reservation_control_disabled`
  - `test_sync_order_skips_reconciliation_for_branch_with_no_policy_row`
  - `test_sync_order_kot_failure_raises_instead_of_swallowing`
  - `test_sync_order_reservation_failure_rolls_back_before_invoice_save`
  - `test_resolve_or_create_pos_invoice_sets_branch_for_no_table_new_invoice`: Regression for the 'Order reservation scope is incomplete' bug: the no-table (Take Away/Delivery) path built a new invoice but never assigned invoice.branch, so downstream reconcile_order_reservation…
  - `test_resolve_or_create_pos_invoice_sets_naming_series_for_no_table_new_invoice`: Regression for B01: a new non-dine-in (Take Away/Aggregator) POS Invoice must resolve `naming_series` from `URY Restaurant. invoice_series_prefix` the same way the dine-in (table) path already does, …
  - `test_resolve_or_create_pos_invoice_naming_series_none_when_unconfigured`: A restaurant with no `invoice_series_prefix` configured must not crash order creation for the non-dine-in path -- mirrors the dine-in path's existing behavior of leaving naming_series as whatever fra…
  - `test_sync_order_allocates_new_invoice_ref_before_reservation`
- **TestPriceItemsForInvoicePhase1**: Phase 1 regression: price_items_for_invoice() must return the same dict shape sync_order() used to build inline, and sync_order() must delegate to it rather than re-deriving prices itself.
  - `test_price_items_for_invoice_shape`
  - `test_commission_base_rate_uses_commission_price_list`
  - `test_commission_base_rate_falls_back_to_charged_rate`
  - `test_price_items_for_invoice_throws_on_missing_price`
  - `test_sync_order_delegates_pricing`
- **TestGetTableOrderContext**: Covers the ownership/permission matrix documented in PHASE0_PERMISSION_MATRIX.md: free table, own order, another Captain's order (with/without elevated access), Cashier access, and cross-branch denia…
  - `test_free_table_no_order`: A free table has no owner to protect: view/modify default open.
  - `test_own_order_is_mine`
  - `test_other_captains_order_without_elevated_access_denied`: Captain A viewing Captain B's table with no transfer/billing access: every permission must be false (the ported V1 ownership check).
  - `test_other_captains_order_with_elevated_access_allowed`: Captain with transfer_role_permissions can view/modify another Captain's table (elevated access).
  - `test_cashier_can_access_any_table`
  - `test_cross_branch_table_denied`: A table outside the session user's active branch must be denied outright, matching get_order_invoice's branch check.
- **TestGetCaptainContext**
  - `test_get_captain_context_shape`
- **TestSyncOrderHardening**: Phase 3: additional server-side authorization added to sync_order() on top of the pre-existing billing-role/write-permission/stale-write checks — ownership, billed-state, role-restricted Dine-In, tab…
  - `test_denies_other_captains_order`
  - `test_denies_modification_of_billed_invoice_for_non_billing_user`
  - `test_denies_dine_in_for_table_order_restricted_role`
  - `test_denies_table_outside_active_branch`
  - `test_denies_table_outside_assigned_room`
  - `test_denies_item_reduction_without_remove_items_permission`
- **TestGetOrderInvoiceOwnership**: Phase 3: get_order_invoice() previously fetched/returned an invoice with only a DocType-level read-permission + branch check. These cover the added Captain/waiter ownership + room-access validation.
  - `test_denies_other_captains_order`
  - `test_allows_elevated_user_without_room_check`
- **TestTableTransfer**: Phase 3: table_transfer() previously had no server-side transfer-role check at all, relying entirely on the frontend's canCaptainTransfer().
  - `test_denied_without_transfer_role`
  - `test_allowed_with_transfer_role`
- **TestCaptainTransfer**: Phase 3: captain_transfer() previously only enforced same-room assignment under multiple_cashier mode. These cover the added transfer-role authorization, invoice-write authorization, branch validatio…
  - `test_denied_without_transfer_role`
  - `test_denied_target_not_in_branch`
  - `test_denied_ineligible_target_role`
  - `test_allowed`
- **TestSplitBillReservations**: sa-arch-splitbill: split_bill() must move reservation coverage (and, where safely determinable, KOT ownership) along with the invoice item rows it relocates to the new sibling invoice -- not just mov…
  - `test_split_bill_reconciles_reservations_for_moved_and_remaining_items`
  - `test_split_bill_reassigns_kot_only_when_fully_moved`
  - `test_split_bill_fulfilment_lookup_no_cross_contamination`: G-14 regression (T9): once split_bill() has re-keyed reservations and reassigned the *fully-moved* KOT's invoice link, simulate both resulting invoices reaching consolidated-submit and confirm each f…
- **TestSyncOrderLineIdentity**: B02b: `sync_order()` must diff previous-vs-current order lines on a STABLE line identity, not on the invoice child row's `name`. The shipped bug: `past_item` keyed each previous line as `item.get("re…
  - `test_previous_snapshot_never_falls_back_to_the_child_row_name`: The regression guard for the actual bug: a row with no persisted key must yield None, NOT its autoname.
  - `test_previous_snapshot_uses_the_persisted_key_when_present`
  - `test_current_items_accept_the_cart_uniqueid_as_a_line_key`
  - `test_current_items_never_adopt_an_echoed_row_name_as_identity`: `name` is in LINE_REF_FIELDS for saved-doc use; a client payload echoing a row name must not turn it into a line identity.
  - `test_quantity_bump_on_an_existing_line_is_a_delta_not_remove_plus_add`
  - `test_a_fresh_item_shows_up_as_an_addition_only`
  - `test_a_dropped_item_shows_up_as_a_removal_only`
  - `test_two_lines_of_the_same_item_with_different_comments_stay_distinct`: The correctness class the reservation-side fix was built for: bumping ONE of two same-item lines must not disturb the other, and must not collapse the two into a single aggregated line.
  - `test_removing_one_of_two_same_item_lines_leaves_the_other_untouched`
  - `test_legacy_unkeyed_previous_line_adopts_the_clients_key`: An order saved BEFORE keys were persisted must not diff as remove+add on its first edit.
  - `test_legacy_backfill_refuses_ambiguous_same_item_lines`: Two unkeyed previous lines of one item_code cannot be attributed to specific client lines, so neither may adopt a key -- guessing would silently fuse two distinct kitchen lines.
  - `test_legacy_backfill_never_steals_a_key_already_held_by_another_line`
- **TestSyncOrderOptionalCustomer**: Customer selection is optional only when the POS Profile opts in, and the fallback must be the profile's own default Customer — never a value the client supplied.
  - `test_missing_customer_rejected_when_flag_off`
  - `test_missing_customer_falls_back_to_profile_default_when_flag_on`
  - `test_flag_on_without_profile_default_still_rejects`

</details>

<details>
<summary><code>ury.ury.doctype.ury_order.test_ury_order_billing</code> (60)</summary>

> Coverage for the live billing/table-lifecycle surface of `ury_order.py`. `test_ury_order.py` already covers `sync_order`, `get_order_invoice`, `table_transfer`/`captain_transfer`, and the *reservation/KOT* half of `split_bill`. It never touches the functions in this file: merge_free_tables / merge_tables_batch, unmerge_tables, release_tables_after_print, pos_opening_check, make_invoice, and split…

- **TestMergeTables**: `merge_free_tables` / `merge_tables_batch`: cluster construction and every guard clause that rejects a merge.
  - `test_merge_writes_symmetric_partner_lists`
  - `test_merge_of_three_tables_gives_every_member_the_other_two`
  - `test_targets_accepted_as_a_json_string`: The whitelisted endpoint is called over HTTP, so `tables` arrives as a JSON string, not a list.
  - `test_merge_free_tables_delegates_to_the_batch_endpoint`
  - `test_duplicate_and_self_targets_are_dropped_before_the_empty_check`
  - `test_rejects_an_empty_target_list`
  - `test_rejects_a_target_list_that_only_names_the_anchor`
  - `test_rejects_an_unknown_anchor_table`
  - `test_rejects_tables_in_different_rooms`: This is also the effective cross-branch guard: `merge_tables_batch` compares `restaurant_room`, never `branch`, so a table in another branch is rejected by virtue of being in another room. A table in…
  - `test_rejects_a_target_that_is_already_part_of_a_merge_cluster`
  - `test_rejects_an_occupied_target`
  - `test_rejects_merging_two_tables_that_each_hold_a_separate_active_order`: Only the *anchor* may carry an active order: an occupied target is already rejected above, but an anchor+target pair that both have an unprinted draft invoice (possible when `occupied` has drifted) w…
  - `test_allows_a_merge_when_only_the_anchor_holds_an_active_order`
  - `test_merge_syncs_the_open_order_and_its_invoice_onto_the_new_cluster`: The two follow-up steps are mocked out in the guard tests above; here they are asserted to actually be invoked with the anchor and the full sorted cluster respectively.
- **TestUnmergeTables**: `unmerge_tables`: the two guards plus the clearing write.
  - `test_unmerges_every_member_of_the_cluster`
  - `test_unmerging_reached_from_any_member_clears_the_whole_cluster`
  - `test_rejects_an_unmerged_table`
  - `test_rejects_unmerging_while_an_unprinted_bill_is_open_on_the_cluster`
  - `test_allows_unmerging_once_the_open_bill_has_been_printed`: `invoice_printed = 1` is the state `release_tables_after_print` acts on; a still-draft but printed invoice no longer blocks unmerge.
  - `test_a_bill_that_only_names_the_table_as_a_merged_partner_also_blocks`: `_has_open_pos_invoices_for_cluster` deliberately checks both `restaurant_table` and the `custom_merged_tables` CSV, so a secondary member of the cluster is protected by the primary's open bill.
- **TestReleaseTablesAfterPrint**: `release_tables_after_print`: the write-permission gate and the set of tables it frees.
  - `test_frees_every_table_in_the_invoices_merge_cluster`
  - `test_releasing_does_not_clear_the_merge_relationship`: A printed bill frees the tables for seating but deliberately leaves `merged_with` intact -- undoing a merge is `unmerge_tables`'s job, and a physically joined table stays joined across bills.
  - `test_a_table_named_only_in_custom_merged_tables_is_still_released`: The invoice's own CSV is unioned with the live cluster, so a partner that has since been unmerged from the table still gets freed rather than being left stuck as occupied.
  - `test_releasing_an_already_released_table_is_idempotent`: There is no "already released" guard by design: the endpoint is fired from the print flow, which can retry. Re-running must stay a no-op rather than throwing.
  - `test_denies_a_caller_without_write_permission_on_the_invoice`
- **TestPosOpeningCheck**: `pos_opening_check`: the three shapes the POS shell branches on.
  - `test_administrator_short_circuits_without_touching_the_branch_lookup`
  - `test_reports_no_opening_entry_when_the_lookup_is_empty`
  - `test_reports_the_cashier_and_profile_of_an_open_entry`
  - `test_an_entry_opened_by_another_cashier_is_still_reported_as_open`: The check is branch+room scoped, not user scoped: a second cashier arriving at the same room must see the existing session (and whose it is) rather than being offered a conflicting new opening entry.
  - `test_only_the_first_of_several_open_entries_is_reported`: Documents the current resolution of a conflicting-state DB: the query can return more than one open entry for the same branch+room (nothing enforces uniqueness), and the endpoint silently takes the f…
- **TestValidateAdditionalDiscount**: `_validate_additional_discount` is `make_invoice`'s authoritative server-side discount gate; it runs before any invoice state is mutated.
  - `test_no_discount_values_normalize_to_zero`
  - `test_a_non_numeric_discount_falls_through_to_no_discount`: The function has an explicit `except (TypeError, ValueError)` -> throw branch for a garbage discount, but it is unreachable: `flt()` swallows the conversion error itself and returns 0.0, so "ten perc…
  - `test_a_none_pos_profile_is_never_loaded_for_a_zero_discount`: The profile lookup sits behind the `discount <= 0` early return, so the no-discount path must not hit the DB at all.
  - `test_a_discount_is_rejected_when_the_profile_does_not_enable_discounts`
  - `test_a_discount_above_the_ceiling_is_rejected`
  - `test_a_discount_is_rejected_for_a_role_not_on_the_allow_list`
  - `test_an_authorized_role_gets_the_sanitized_percentage_back`
- **TestMakeInvoice**: `make_invoice`: payment application, submit, and table release.
  - `test_applies_the_payment_rows_and_submits_the_invoice`
  - `test_multiple_payment_modes_are_all_applied`
  - `test_merged_payment_must_cover_both_recalculated_invoices`
  - `test_any_pre_existing_payment_rows_are_discarded_before_settlement`: The invoice may already carry a provisional payment row written by `split_bill`/`sync_order`; settlement must replace, not append to, it.
  - `test_a_discount_from_an_unauthorized_role_is_rejected_before_any_mutation`
  - `test_a_discount_on_a_profile_without_discounts_enabled_is_rejected`
  - `test_an_authorized_discount_is_written_onto_the_invoice`
  - `test_no_discount_explicitly_zeroes_the_field`: An invoice carrying a stale `additional_discount_percentage` must be reset rather than silently settling at the old discount.
  - `test_a_failure_during_submit_is_surfaced_not_swallowed`
  - `test_a_takeaway_invoice_with_no_table_frees_nothing`
  - `test_a_secondary_merged_bill_releases_the_primary_invoices_tables`: A merged secondary bill carries no `restaurant_table` of its own; the table release has to follow `custom_merged_pos_invoice` back to the primary, or the merged tables stay occupied forever.
  - `test_a_merged_pair_splits_one_tender_across_both_bills`: A single tendered amount larger than the secondary's own total spills over onto the primary, capped at each bill's rounded total -- this is the whole point of the merged-bill branch.
- **TestSplitBillGuards**: `split_bill`'s guard clauses. `TestSplitBillReservations` in `test_ury_order.py` covers the happy-path reservation/KOT side; nothing covered the rejection paths.
  - `test_splits_a_partial_allocation_onto_a_new_sibling_invoice`
  - `test_items_to_move_accepted_as_a_json_string`
  - `test_a_fully_moved_row_is_removed_from_the_source`
  - `test_denies_a_caller_without_write_permission`
  - `test_denies_splitting_an_invoice_from_another_branch`
  - `test_rejects_a_submitted_invoice`
  - `test_rejects_an_empty_allocation`
  - `test_rejects_an_allocation_of_only_zero_quantities`
  - `test_rejects_moving_more_than_the_available_quantity`
  - `test_rejects_an_allocation_naming_a_row_that_is_not_on_the_invoice`: An unknown row name contributes no quantity, so the allocation is empty as far as the source invoice is concerned and is rejected rather than producing an empty sibling bill.
  - `test_rejects_moving_every_item_off_the_original_bill`

</details>

<details>
<summary><code>ury.ury.doctype.ury_order.test_ury_order_sync_validation</code> (23)</summary>

> Focused regression tests for sync_order / split_bill validation (B1–B5). Covers open cashier session, menu/disabled item gates, comment clear semantics, dine-in pax, and split_bill ownership parity with sync_order.

- **TestOpenCashierSessionB1**
  - `test_single_cashier_rejects_closed_branch`
  - `test_single_cashier_allows_open_branch`
  - `test_multi_cashier_rejects_closed_table_room`
  - `test_multi_cashier_allows_open_table_room`
  - `test_multi_billing_takeaway_uses_branch_opening_not_room`
  - `test_opening_room_prefers_table_restaurant_room`
- **TestMenuItemValidationB2**
  - `test_rejects_newly_added_off_menu_item`
  - `test_rejects_newly_added_disabled_item`
  - `test_preserves_historic_off_menu_lines`
  - `test_aggregator_skips_menu_membership`
  - `test_aggregator_still_rejects_disabled_item_master`
- **TestCommentsAndPaxB3B4**
  - `test_dine_in_rejects_zero_pax`
  - `test_dine_in_rejects_none_pax`
  - `test_dine_in_accepts_positive_integer`
  - `test_non_dine_in_skips_pax_gate`
- **TestSyncOrderCommentClearB3**
  - `test_empty_comments_clears_note`
  - `test_omitted_comments_preserves_note`
- **TestSplitBillOwnershipB5**
  - `test_split_bill_calls_enforce_order_access`
  - `test_split_bill_denies_other_captain_unbilled`
- **TestManagerRemoveSentItems**: Managers may correct a sent order even when the profile withholds `remove_items` from ordinary captains.
  - `test_profile_flag_grants_removal_without_touching_ownership`
  - `test_manager_may_remove_without_the_profile_flag`
  - `test_ordinary_captain_still_denied_without_the_flag`
  - `test_no_invoice_falls_back_to_the_profile_flag`

</details>

<details>
<summary><code>ury.ury.doctype.ury_order_item.test_ury_order_item</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_ordering_device.test_ury_ordering_device</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_ordering_session.test_ury_ordering_session</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_payment_terminal.test_ury_payment_terminal</code> (5)</summary>

> Doctype-level coverage for URY Payment Terminal. Added for TRACK.md Phase 2 item 2 (sa-comprehensive-test-strategy): this doctype's controller has no custom hooks at all (`ury_payment_terminal.py` is a bare `pass` -- provider-driving logic lives in `ury.ury.api.payment_terminal`, not here), so this file intentionally tests only what the JSON metadata (`ury_payment_terminal.json`) actually declare…

- **TestURYPaymentTerminal**
  - `test_create_with_defaults`
  - `test_terminal_id_is_the_document_name`
  - `test_terminal_id_uniqueness_enforced`
  - `test_non_default_provider_and_status_are_preserved`
  - `test_invalid_status_option_rejected`

</details>

<details>
<summary><code>ury.ury.doctype.ury_payment_terminal_transaction.test_ury_payment_terminal_transaction</code> (5)</summary>

> Doctype-level coverage for URY Payment Terminal Transaction. Like its parent `URY Payment Terminal`, this controller (`ury_payment_terminal_transaction.py`) is a bare `pass` -- it is a transaction log written by `PaymentTerminalProvider` implementations in `ury.ury.api.payment_terminal`, not a doctype with its own hook logic. Per TRACK.md Phase 2 item 2 this was confirmed a genuine stub (not "cov…

- **TestURYPaymentTerminalTransaction**
  - `test_create_defaults_status_to_pending`
  - `test_autoname_is_random_hash`
  - `test_transaction_id_uniqueness_enforced`
  - `test_status_transition_to_approved_persists`
  - `test_invalid_status_option_rejected`

</details>

<details>
<summary><code>ury.ury.doctype.ury_pos_shift_report.test_ury_pos_shift_report</code> (29)</summary>

> Tests for the internal cash shift report (`ury_cash_shift_report`). Mock-based, like `test_ury_pos_closing_entry.py`: what is pinned here is the aggregation arithmetic and the hook control flow, not ERPNext's closing machinery.

- **TestBuildShiftTotals**
  - `test_splits_sales_and_returns_per_mode`
  - `test_split_payment_counts_invoice_once_in_totals`
  - `test_change_is_taken_off_the_change_account_only`
  - `test_zero_payment_rows_are_skipped`
  - `test_payments_of_invoices_not_in_the_list_are_ignored`
  - `test_empty_shift`
- **TestCreateShiftReport**
  - `test_existing_report_is_not_duplicated`
  - `test_creates_report_with_server_resolved_terminal`
  - `test_failure_is_logged_not_raised`
  - `test_sub_pos_closing_has_no_report_hook`
- **TestCurrentTerminal**
  - `test_no_enrolled_device`
  - `test_terminal_of_the_same_branch`
  - `test_terminal_of_another_branch_is_not_trusted`
- **TestRegenerateShiftReport**
  - `test_rejects_unsubmitted_closing`
  - `test_rebuilds_without_terminal`
- **TestPosProfileSettings**
  - `test_sections_default_to_shown`
  - `test_sections_can_be_turned_off`
  - `test_print_format_falls_back_to_bundled_one`
  - `test_print_format_from_profile`
  - `test_print_time_rejects_a_receipt_format_saved_on_the_profile`
- **TestPrintFormatScope**: Customer receipts and shift reports must never use each other's layout.
  - `test_profile_accepts_matching_formats`
  - `test_receipt_field_rejects_a_shift_report_format`
  - `test_shift_report_field_rejects_a_receipt_format`
  - `test_any_other_doctype_is_rejected_too`
  - `test_unknown_format_is_rejected`
- **TestShiftReportPrintApi**
  - `test_print_info_for_closing_with_report`
  - `test_print_info_without_report`
  - `test_print_info_requires_closing_permission`
  - `test_network_print_needs_a_bill_printer`

</details>

<details>
<summary><code>ury.ury.doctype.ury_production_department.test_ury_production_department</code> (5)</summary>

- **TestURYProductionDepartment**
  - `test_company_ownership_validation_warehouse_on_insert`
  - `test_company_ownership_validation_cost_center_on_save`
  - `test_company_ownership_validation_branch_on_insert`
  - `test_company_ownership_validation_branch_on_save`
  - `test_happy_path_insert_and_save`

</details>

<details>
<summary><code>ury.ury.doctype.ury_production_unit.test_ury_production_unit</code> (2)</summary>

- **TestURYProductionUnit**
  - `test_production_unit_schema_extended`
  - `test_assigned_employees_survives_insert_and_save`

</details>

<details>
<summary><code>ury.ury.doctype.ury_report_settings.test_ury_report_settings</code> (5)</summary>

> Doctype-level coverage for URY Report Settings. TRACK.md Phase 2 item 2 / COVERAGE_GAP_ANALYSIS.md Table 3+4: this doctype's test file existed but had zero `def test_` methods, and its `validate()` hook (the only real logic in the controller -- guards against a zero-value `hours` field when `extended_hours` is enabled) had no reference anywhere else in the suite. This is a genuine gap, not a "cov…

- **TestURYReportSettings**
  - `test_autoname_is_branch`
  - `test_extended_hours_with_zero_hours_is_rejected`
  - `test_extended_hours_with_nonzero_hours_is_allowed`
  - `test_extended_hours_disabled_allows_zero_hours`
  - `test_zero_hours_rejection_also_fires_on_update`

</details>

<details>
<summary><code>ury.ury.doctype.ury_restaurant.test_ury_restaurant</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_room.test_ury_room</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_self_ordering_profile.test_ury_self_ordering_profile</code> (4)</summary>

> Doctype-level coverage for URY Self Ordering Profile. TRACK.md Phase 2 item 2 / COVERAGE_GAP_ANALYSIS.md Table 3+4: the doctype's test file had zero `def test_` methods, and its `before_insert()` hook (the only controller logic -- generates a per-profile `qr_signing_secret` used to sign stateless QR table/pickup tokens per `ury/ury/api/self_ordering.py`) had no reference anywhere else in the suit…

- **TestURYSelfOrderingProfile**
  - `test_before_insert_generates_qr_signing_secret`
  - `test_qr_signing_secret_is_unique_per_profile`
  - `test_explicit_qr_signing_secret_is_not_overwritten`
  - `test_secret_is_not_regenerated_on_update`

</details>

<details>
<summary><code>ury.ury.doctype.ury_service_request.test_ury_service_request</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_stock_reservation.test_ury_stock_reservation</code> (0)</summary>


</details>

<details>
<summary><code>ury.ury.doctype.ury_table.test_ury_table</code> (3)</summary>

> Doctype-level coverage for URY Table. TRACK.md Phase 2 item 2 / COVERAGE_GAP_ANALYSIS.md Table 3: the doctype had no test file at all. Unlike its sibling stubs (`URY Room`, `URY Restaurant`, which are bare `pass` controllers with no logic to test beyond framework CRUD), `URYTable.autoname()` has real logic: it slugifies the linked restaurant's name (collapsing repeated "-" from spaces) and append…

- **TestURYTable**
  - `test_autoname_uses_restaurant_name_as_prefix`
  - `test_autoname_collapses_repeated_dashes_from_spaces`
  - `test_two_tables_for_same_restaurant_get_distinct_names`

</details>

<details>
<summary><code>ury.ury.doctype.ury_yield_check.test_ury_yield_check</code> (47)</summary>

- **TestYieldCheckValidateItemYieldTrackingEnabled**: Test Check 1: validate_item_yield_tracking_enabled
  - `test_throws_when_item_yield_tracked_is_falsy`: Item without yield tracking enabled fails validation.
  - `test_passes_when_item_yield_tracked_is_true`: Item with yield tracking enabled passes validation.
- **TestYieldCheckValidateInputQty**: Test Check 2: validate_input_qty
  - `test_throws_when_input_qty_is_zero`: Input quantity of 0 fails validation.
  - `test_throws_when_input_qty_is_negative`: Negative input quantity fails validation.
  - `test_throws_when_input_qty_is_none`: None input quantity fails validation.
  - `test_passes_when_input_qty_is_positive`: Positive input quantity passes validation.
- **TestYieldCheckValidateOutputQty**: Test Check 2b: validate_output_qty (F1)
  - `test_throws_when_output_qty_is_zero`: Output quantity of 0 fails validation.
  - `test_throws_when_output_qty_is_negative`: Negative output quantity fails validation.
  - `test_throws_when_output_qty_is_none`: None output quantity fails validation.
  - `test_passes_without_warning_when_output_within_input`: Output <= input passes validation with no warning.
  - `test_warns_but_does_not_block_when_output_exceeds_input`: Output > input does not hard-block, but raises a warning (soft-flag).
  - `test_no_warning_when_input_qty_missing`: No output>input warning is attempted when input_qty is falsy (avoids false positives).
- **TestYieldCheckCaptureStandardYieldSnapshot**: Test Check 3: capture_standard_yield_snapshot
  - `test_captures_snapshot_on_first_insert`: Snapshot is captured from Item.custom_yield_percent on insert.
  - `test_not_overwritten_on_later_edit`: Snapshot is not overwritten on a later edit.
  - `test_handles_missing_item_yield_percent`: I6 hardening: a yield-tracked item with no standard yield percent set now throws rather than silently defaulting to 0.0 (PR #375) -- a 0.0 standard would make every future check's variance_percent me…
- **TestYieldCheckComputeYieldAndVariance**: Test Check 4: compute_yield_and_variance
  - `test_actual_yield_percent_computed_correctly`: Actual yield percent = (output_qty / input_qty) * 100.
  - `test_variance_percent_computed_correctly`: Variance = actual - standard.
  - `test_negative_variance_when_actual_below_standard`: Negative variance when yield is below standard.
  - `test_zero_actual_yield_when_zero_output`: Actual yield is 0% when output_qty is 0.
  - `test_handles_zero_input_qty`: When input_qty is 0, actual_yield_percent defaults to 0.0.
- **TestYieldCheckValidateBranchCompanyConsistency**: Test Check 5: validate_branch_company_consistency
  - `test_throws_when_branch_is_missing`: Validation fails if branch is not set.
  - `test_throws_when_branch_has_no_company`: Validation fails if branch is not linked to a company.
  - `test_throws_when_branch_company_mismatches_document_company`: Validation fails if branch's company != document's company.
  - `test_passes_when_branch_company_matches`: Validation passes when branch's company matches document's company.
- **TestYieldCheckValidateStockUomMatch**: Test Check 6: validate_stock_uom_match
  - `test_throws_when_item_is_missing`: Validation fails if item is not set.
  - `test_throws_when_item_has_no_stock_uom`: Validation fails if Item.stock_uom is not set.
  - `test_throws_when_stock_uom_mismatches_item`: Validation fails if document's stock_uom != Item.stock_uom.
  - `test_passes_when_stock_uom_matches`: Validation passes when document's stock_uom == Item.stock_uom.
- **TestYieldCheckValidateIssueAuthorization**: Test Check 7: validate_issue_authorization
  - `test_passes_when_issue_authorization_is_not_set`: Validation passes if issue_authorization is None.
  - `test_throws_when_authorization_not_found`: Validation fails if authorization document doesn't exist.
  - `test_throws_when_component_item_mismatches`: Validation fails when authorization's component_item != yield check's item.
  - `test_throws_when_status_is_not_authorized`: Validation fails when authorization status != 'Authorized'.
  - `test_throws_when_another_yield_check_references_authorization`: Validation fails if another Yield Check already references this authorization.
  - `test_passes_when_authorization_valid_and_unique`: Validation passes when authorization is valid and not referenced elsewhere.
  - `test_defaults_input_qty_from_authorized_qty`: input_qty defaults to authorized_qty if not set.
  - `test_does_not_overwrite_existing_input_qty`: input_qty is not overwritten if already set.
- **TestYieldCheckValidateNoDuplicateWastage**: Test Check 8: validate_no_duplicate_wastage (A3).
  - `test_passes_when_issue_authorization_is_not_set`: Validation passes if issue_authorization is None.
  - `test_passes_when_no_existing_wastage_for_authorization`: Validation passes when issue_authorization has no Issue Wastage records.
  - `test_throws_when_wastage_already_exists`: Validation fails when Issue Wastage already references this authorization.
  - `test_filters_by_issue_authorization`: Query filters for the specific issue_authorization.
  - `test_searches_ury_issue_wastage_doctype`: Query targets URY Issue Wastage doctype.
- **TestYieldCheckIntegrationFullValidate**: Integration tests for full validate() method.
  - `test_all_checks_are_called_in_sequence`: All 8 validation checks are called in the correct order.
- **TestYieldCheckRealDocumentIntegration**: F9: real-document coverage (no mocks) for output_qty bounds (validate_output_qty, F1) and the Yield-Check/Wastage mutual-exclusion guard's reverse direction (F3) -- every prior test in this file patc…
  - `test_real_insert_rejects_zero_output_qty`: F1: a real .insert() with output_qty=0 must fail closed.
  - `test_real_insert_rejects_negative_output_qty`: F1: a real .insert() with a negative output_qty must fail closed.
  - `test_real_insert_allows_output_exceeding_input_with_warning_not_block`: F1: output_qty > input_qty is a soft warning (msgprint), not a hard block -- the real insert must succeed.
  - `test_real_insert_succeeds_with_valid_bounds`
  - `test_real_wastage_capture_blocked_after_real_yield_check_exists`: F3 reverse guard: with a real Issue Authorization and a real Yield Check already inserted against it, a real (unmocked) call to ury.ury.api.ury_wastage.capture_wastage for the same authorization must…

</details>

### `ury/ury/hooks`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_ury_bom` | 15 | ✅ | моки, реальная БД |
| `test_ury_customer` | 12 | ❌ | моки |
| `test_ury_item` | 9 | ✅ | моки |
| `test_ury_pos_closing_entry` | 6 | ❌ | моки |
| `test_ury_pos_closing_reconciliation` | 13 | ❌ | моки |
| `test_ury_pos_invoice` | 4 | ❌ | моки |
| `test_ury_pos_invoice_price_list` | 3 | ❌ | моки |
| `test_ury_sales_invoice_returns` | 4 | ❌ | моки |

<details>
<summary><code>ury.ury.hooks.test_ury_bom</code> (15)</summary>

- **TestApplyYieldBackCalculation**: Test A2: apply_yield_back_calculation distinguishes tracked from non-tracked items. The hardening pass (Track-Item C1, PR #375) switched the item-tracking lookup from frappe.get_doc("Item", ...).cust…
  - `test_skips_non_tracked_items`: Non-tracked items skip yield validation (no custom_yield_qty required).
  - `test_throws_when_tracked_item_missing_custom_yield_qty`: Tracked item without custom_yield_qty throws ValidationError.
  - `test_throws_when_tracked_item_has_zero_yield_percent`: Tracked item with custom_yield_percent=0 throws ValidationError.
  - `test_back_calculates_qty_correctly`: Tracked item: qty = custom_yield_qty / (custom_yield_percent / 100).
  - `test_back_calculates_with_different_yield_percentages`: Qty calculation works correctly with various yield percentages.
  - `test_handles_multiple_rows_mixed_tracked_and_non_tracked`: Multiple rows: tracked items validated and calculated, non-tracked skipped.
- **TestSetBomRevision**: Test C1 part 1: set_bom_revision computes stable hash of BOM components. The hardening pass (Track-Item C1, PR #375) added `uom` to the hashed vector (item_code, qty, uom) to also catch UOM-only chan…
  - `test_computes_hash_from_item_qty_vector`: BOM revision is a hash of sorted (item_code, qty, uom) tuples.
  - `test_revision_differs_when_qty_changes`: Revision changes when a component's qty changes.
  - `test_revision_same_when_order_changes`: Revision is stable regardless of row order (sorted internally).
  - `test_revision_length_is_16_chars`: Revision is always 16 hex characters (MD5 first 16 chars).
  - `test_handles_empty_bom`: Empty BOM produces a valid (but predictable) revision.
  - `test_handles_items_with_none_qty`: Items with qty=None are treated as 0.
  - `test_qty_rounded_to_6_decimals`: Quantities are rounded to 6 decimal places for hash consistency.
- **TestApplyYieldBackCalculationRealDocumentIntegration**: F9: real-document coverage for apply_yield_back_calculation / set_bom_revision -- every other test in this file drives the hook function directly against a MagicMock "doc", so none of them ever inser…
  - `test_real_bom_insert_back_calculates_qty_and_sets_revision`: A real BOM insert against a yield-tracked component runs the real before_validate hook: qty is back-calculated from custom_yield_qty / (custom_yield_percent / 100), and custom_bom_revision is populat…
  - `test_real_bom_insert_rejects_yield_tracked_row_missing_yield_qty`: A real BOM insert for a yield-tracked component with no custom_yield_qty set must fail closed (real ValidationError, not a silent qty=0).

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_customer</code> (12)</summary>

> Tests for `ury_customer.py`'s hook module -- specifically the branch-scoped multi-tenancy boundary `_get_current_user_branches()` and the `validate()` hook that consumes it. Mock-based unit tests (frappe.db.sql / frappe.session.user), matching the established pattern in this package (`test_ury_pos_closing_entry.py`, `test_ury_pos_closing_reconciliation.py`): the behaviour under test is the branch…

- **TestGetCurrentUserBranches**
  - `test_administrator_always_returns_empty_list`
  - `test_user_with_no_branch_rows_returns_empty_list`
  - `test_single_branch_user_returns_only_that_branch`
  - `test_multi_branch_user_returns_exactly_those_branches`
  - `test_different_users_get_different_scoped_results`: Simulates two tenants: querying user A's branches must never return user B's branch, and vice versa -- the mock's return value is keyed off which user was actually passed to the query, so a regressio…
  - `test_rows_with_null_branch_are_filtered_out`
- **TestValidateHookBranchScoping**: validate() must only throw for branches the current user actually belongs to, and only when that branch's alert rule is actually triggered -- never for a branch that belongs to a different tenant.
  - `test_no_branches_resolved_skips_check_silently`
  - `test_throws_only_for_own_branch_when_rule_enabled`
  - `test_does_not_throw_or_mention_other_tenants_branch`: User belongs only to Branch A; even though Branch B (a different tenant/branch) has the rule enabled, it must never be consulted or named -- _get_current_user_branches already scoped this out, so val…
  - `test_existing_customer_untouched_field_never_checked`
  - `test_customer_with_mobile_number_never_checked`
  - `test_bulk_import_flag_skips_check_entirely`

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_item</code> (9)</summary>

- **TestValidateYieldTracking**: Test A1: validate_yield_tracking range checking.
  - `test_passes_when_yield_tracked_is_false`: Validation passes when custom_yield_tracked=0, regardless of yield_percent.
  - `test_passes_when_yield_tracked_is_none`: Validation passes when custom_yield_tracked is None/falsy.
  - `test_throws_when_yield_percent_is_zero`: Validation fails when custom_yield_percent=0 and custom_yield_tracked=1.
  - `test_throws_when_yield_percent_is_negative`: Validation fails when custom_yield_percent < 0 and custom_yield_tracked=1.
  - `test_throws_when_yield_percent_exceeds_100`: Validation fails when custom_yield_percent > 100 and custom_yield_tracked=1.
  - `test_passes_when_yield_percent_is_valid_range_lower_bound`: Validation passes when custom_yield_percent=0.1 (just above 0).
  - `test_passes_when_yield_percent_is_valid_range_mid`: Validation passes when custom_yield_percent=85 (middle of range).
  - `test_passes_when_yield_percent_is_valid_range_upper_bound`: Validation passes when custom_yield_percent=100 (upper bound).
  - `test_throws_when_yield_percent_is_none`: Validation fails when custom_yield_percent is None and custom_yield_tracked=1.

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_pos_closing_entry</code> (6)</summary>

> Tests for `populate_pos_transactions` (item-4-cashier-owner-regression). Mock-based unit tests, matching the established pattern in this package (`test_ury_pos_closing_reconciliation.py`): the behaviour under test is the selection/filter control flow, not ERPNext's invoice/closing-entry machinery. Pinned here: 1. An invoice whose owner == doc.user is included. 2. An invoice whose owner != doc.use…

- **TestPopulatePosTransactions**
  - `test_invoice_with_matching_owner_is_included`
  - `test_invoice_with_different_owner_is_excluded_not_raised`: Simulates the regression: an invoice whose custom `cashier` field equals doc.user but whose real `owner` (creator) does not. Because selection is now by `owner` at the frappe.get_all() level, such a …
  - `test_populate_never_raises_for_mismatched_ownership`
  - `test_already_consolidated_invoice_is_excluded`
  - `test_invoice_outside_period_window_is_excluded`
  - `test_existing_pos_transactions_is_not_overwritten`

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_pos_closing_reconciliation</code> (13)</summary>

> Tests for T5 / I-10: session-scoped closing reconciliation. Mock-based unit tests, matching the established pattern in this package (`test_ury_sales_invoice_returns.py`, `test_ury_fulfilment_posting_service.py`): the behaviour under test is the gate's control flow and its messages, not ERPNext's consolidation machinery. Pinned here: 1. Gate ON, everything posted and every reservation group settle…

- **TestClosingReconciliation**
  - `test_gate_off_is_a_total_no_op`
  - `test_tier_one_branch_is_a_total_no_op`
  - `test_empty_transactions_is_a_trivial_pass`
  - `test_clean_session_closes`
  - `test_stale_intent_blocks_closing_and_names_the_invoice`
  - `test_verification_failure_is_translated_not_swallowed`: The real `_verify_invoice_production`, with the G-07 verification throwing underneath it, yields an invoice-scoped problem string.
  - `test_unreadable_invoice_is_reported_not_crashed`
  - `test_released_reservation_group_blocks_closing`
  - `test_mixed_status_group_blocks_closing`
  - `test_no_reservations_at_all_is_not_a_problem`
  - `test_ungrouped_reservation_row_blocks_closing`
  - `test_unexpected_exception_blocks_with_a_readable_message`
  - `test_unresolvable_policy_is_treated_as_gate_off`

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_pos_invoice</code> (4)</summary>

> Tests for `calculate_and_set_times` (fix-calculate-and-set-times-typeerror). Mock-based unit tests, matching the established pattern in this package (`test_ury_pos_closing_entry.py`): the behaviour under test is time-value coercion, not ERPNext's invoice/submit machinery. Pinned here: 1. `doc.creation` as a string (the state of a freshly inserted-but-not- reloaded document) no longer raises a Typ…

- **TestCalculateAndSetTimes**
  - `test_string_creation_does_not_raise_and_sets_valid_time`: Reproduces the live bug: insert a POS Invoice and call calculate_and_set_times immediately, without an explicit doc.reload() in between, so doc.creation is still a plain string.
  - `test_datetime_creation_still_works`: A loaded invoice retains datetime arithmetic.
  - `test_none_creation_handles_gracefully`: doc.creation is None must fall back to current time without raising TypeError.
- **TestPrintedChargeChange**
  - `test_revised_waiter_charge_requires_reprint`

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_pos_invoice_price_list</code> (3)</summary>

> Tests for `validate_price_list`: the POS Invoice header price list must match the list sync_order priced the lines from.

- **TestValidatePriceList**
  - `test_customer_price_list_is_kept_on_header`
  - `test_customer_without_price_list_uses_active_menu`
  - `test_aggregator_ignores_customer_price_list`

</details>

<details>
<summary><code>ury.ury.hooks.test_ury_sales_invoice_returns</code> (4)</summary>

> Regression tests for G-05: return/credit-note fulfilment reversal policy. Decision under test (see `ury_sales_invoice.fulfil_reservations_on_consolidation` and `ury_fulfilment_posting_service`'s module docstring): a consolidated credit note (`is_return=1`) must never trigger any URY-side production or reservation reversal. Only native ERPNext's own `update_stock=1` sale-side ledger movement (fini…

- **TestReturnsDoNotTriggerReservationCloseOut**
  - `test_return_short_circuits_before_touching_reservations`: A consolidated credit note must never reach reservation close-out.
  - `test_non_return_consolidated_invoice_still_closes_out_reservations`: Sanity check: the guard is specific to `is_return`, not a general regression that disables reservation close-out entirely.
  - `test_non_consolidated_invoice_is_ignored_regardless_of_return_flag`
  - `test_fulfilled_reservation_group_is_not_in_active_statuses`: A group already `Fulfilled` before any return can exist (fulfilment happens at production/first-closing time) is excluded from `ACTIVE_STATUSES` -- there is nothing left for a later return to release…

</details>

### `ury/ury/report_api`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_commission` | 47 | ✅ | реальная БД, от имени пользователя |
| `test_customers` | 4 | ✅ | реальная БД, от имени пользователя |
| `test_day_close` | 2 | ✅ | моки |
| `test_employees` | 3 | ✅ | реальная БД, от имени пользователя |
| `test_financial` | 2 | ✅ | реальная БД, от имени пользователя |
| `test_items` | 5 | ✅ | реальная БД, от имени пользователя |
| `test_operations` | 5 | ✅ | от имени пользователя |
| `test_sales` | 8 | ✅ | реальная БД, от имени пользователя |
| `test_sales_data_logic` | 8 | ✅ | моки, от имени пользователя |
| `test_shift_invoices` | 13 | ❌ | моки, реальная БД, от имени пользователя |
| `test_waiter_service` | 2 | ❌ | моки |

<details>
<summary><code>ury.ury.report_api.test_commission</code> (47)</summary>

- **TestRequireManagerGate**: Every whitelisted function in commission.py must call require_manager() first and deny a non-manager user.
  - `test_get_commission_settings_denied`
  - `test_update_commission_settings_denied`
  - `test_search_commission_employees_denied`
  - `test_get_employee_commission_denied`
  - `test_get_employee_commission_detail_denied`
- **TestResolveRulePrecedence**: resolve_rule() must prefer the most specific match: employee+branch > employee > designation+branch > designation > branch > unscoped, and fall through to None (caller applies default_rate) when noth…
  - `test_employee_plus_branch_beats_employee_only`
  - `test_employee_beats_designation_plus_branch`
  - `test_designation_plus_branch_beats_designation`
  - `test_designation_beats_branch`
  - `test_branch_beats_unscoped`
  - `test_unscoped_beats_no_match_default`
  - `test_no_rules_returns_none_for_default`
  - `test_disabled_rule_ignored`
  - `test_tie_break_keeps_first_match`
- **TestApplyTiers**: _apply_tiers against a hand-computed 3-tier example: tier0: 0-1000 @ 10%, tier1: 1000-5000 @ 15%, tier2: 5000+ @ 20%.
  - `test_marginal_within_first_tier`
  - `test_marginal_spanning_tiers`
  - `test_slab_uses_single_rate`
  - `test_slab_within_first_tier`
  - `test_base_zero_returns_zero`
  - `test_base_negative_returns_zero_never_negative`
- **TestCommissionBaseExpressions**: The 4 commission_base expressions, verified against a fixture-shaped dict emulating a POS Invoice row with a Grand-Total-applied discount -- the case where net_total alone would be wrong for "Net Sal…
  - `test_net_sales_prorates_discount`
  - `test_net_sales_no_discount_falls_back_to_net_total`
  - `test_net_total_expression`
  - `test_item_total_expression`
  - `test_grand_total_expression`
  - `test_base_expr_map_has_all_keys`
- **TestAllocateInvoiceCommission**: Per-invoice commission in get_employee_commission_detail must add up to the period (bucket) commission the summary report shows.
  - `test_flat_rate_is_base_times_rate`
  - `test_tiered_commission_split_by_base`
  - `test_period_that_earned_nothing_gives_zero_per_invoice`
  - `test_invoice_outside_any_bucket_gets_zero`
  - `test_detail_endpoint_invoice_commissions_sum_to_total`
  - `test_paid_amount_is_full_per_invoice_and_split_per_employee`
- **TestIndividualPriceBase**: Runs the real "Individual Price" SQL against a one-row derived table. The per-invoice item subquery is swapped for a plain column so the CASE arithmetic is exercised without POS Invoice Item rows. Ex…
  - `test_walk_in_customer_equals_grand_total`
  - `test_company_price_counted_at_walk_in_price`
  - `test_exclusive_tax_is_included`
  - `test_discount_scales_walk_in_total`
  - `test_invoice_without_walk_in_rates_falls_back_to_grand_total`
  - `test_return_is_negative_walk_in_total`
- **TestAttributionWeights**: _weights_for_row against a single invoice with distinct opener/closer for each of the 4 attribution modes.
  - `test_opener_mode`
  - `test_closer_mode`
  - `test_closer_mode_falls_back_to_opener_when_closer_missing`
  - `test_split_evenly_mode`
  - `test_split_evenly_same_employee_full_weight`
  - `test_split_by_contribution_mode`
  - `test_split_by_contribution_falls_back_to_opener_with_no_item_data`
  - `test_no_opener_or_closer_returns_empty`
- **TestIncludeReturnsDirection**: include_returns toggling should move the total base in the expected direction: a return row (is_return=1, negative base_amount) is only counted when include_returns is on, so turning it on can only l…
  - `test_returns_lower_or_equal_total_base`

</details>

<details>
<summary><code>ury.ury.report_api.test_customers</code> (4)</summary>

- **TestRequireManagerGate**: Every whitelisted function in customers.py must call require_manager() first and deny a non-manager user.
  - `test_search_customers_denied`
  - `test_get_customer_data_denied`
  - `test_get_daywise_customer_details_denied`
  - `test_get_repeated_customers_denied`

</details>

<details>
<summary><code>ury.ury.report_api.test_day_close</code> (2)</summary>

- **TestDayCloseFulfilmentBlocker**
  - `test_unposted_fulfilment_is_a_blocker`
  - `test_posted_fulfilment_does_not_block`

</details>

<details>
<summary><code>ury.ury.report_api.test_employees</code> (3)</summary>

- **TestRequireManagerGate**: Every whitelisted function in employees.py must call require_manager() first and deny a non-manager user.
  - `test_search_employees_denied`
  - `test_get_employee_sales_denied`
  - `test_get_employee_item_wise_sales_denied`

</details>

<details>
<summary><code>ury.ury.report_api.test_financial</code> (2)</summary>

- **TestRequireManagerGate**: Every whitelisted function in financial.py must call require_manager() first and deny a non-manager user.
  - `test_get_daily_pnl_denied`
  - `test_get_daily_pnl_dates_denied`

</details>

<details>
<summary><code>ury.ury.report_api.test_items</code> (5)</summary>

- **TestRequireManagerGate**: Every whitelisted function in items.py must call require_manager() first and deny a non-manager user.
  - `test_get_item_wise_sales_denied`
  - `test_get_item_groups_denied`
  - `test_get_item_wise_purchase_history_denied`
- **TestPurchaseHistoryBranchScope**: Purchase Invoice has no `branch` field. Passing one must not reach SQL as a filter -- it used to, raising OperationalError 1054 ("Unknown column 'a.branch'") on every branch-scoped call, which is eve…
  - `test_branch_is_accepted_and_ignored_not_a_sql_error`
  - `test_response_reports_company_scope_rather_than_a_branch`

</details>

<details>
<summary><code>ury.ury.report_api.test_operations</code> (5)</summary>

- **TestRequireManagerGate**: Every whitelisted function in operations.py must call require_manager() first and deny a non-manager user.
  - `test_get_completed_work_orders_denied`
- **TestCompletedWorkOrderDateBoundary**: `actual_end_date` is a Datetime. A bare `BETWEEN start AND end` compares it against end-of-range MIDNIGHT, so everything completed after 00:00:00 on the last day of the range was silently dropped -- …
  - `test_same_day_range_includes_a_work_order_completed_late_that_day`
  - `test_range_ending_on_that_day_includes_it`
  - `test_range_ending_the_day_before_excludes_it`
  - `test_summary_counts_the_late_completion`

</details>

<details>
<summary><code>ury.ury.report_api.test_sales</code> (8)</summary>

- **TestRequireManagerGate**: Every whitelisted function in sales.py must call require_manager() first and deny a non-manager user.
  - `test_get_today_sales_denied`
  - `test_get_daywise_sales_denied`
  - `test_get_daywise_invoices_denied`
  - `test_get_month_wise_sales_denied`
  - `test_get_time_wise_sales_denied`
  - `test_get_service_wise_sales_denied`
  - `test_get_cancelled_invoices_denied`
  - `test_get_average_bill_value_denied`

</details>

<details>
<summary><code>ury.ury.report_api.test_sales_data_logic</code> (8)</summary>

> Happy-path data-logic tests for report_api/sales.py's financial reporting endpoints (COVERAGE_GAP_ANALYSIS.md Table 1, Top 15 item #11: 8 whitelisted sales-reporting functions with zero test reference; test_sales.py already covers the negative-permission gate for all of them per TRACK.md's stated acceptance criterion, but none of the actual query/normalization logic that feeds the financial dashb…

- **TestGetTodaySalesDataNormalization**
  - `test_null_sums_are_normalized_to_zero_when_no_invoices`
  - `test_populated_row_passes_through_computed_values`
  - `test_branch_scoped_query_includes_branch_filter_and_join`
  - `test_defaults_to_today_when_no_date_given`
- **TestGetCancelledInvoicesPagination**
  - `test_page_and_page_size_are_clamped`
  - `test_summary_nulls_normalized_to_zero`
  - `test_total_pages_computed_via_ceiling_division`
  - `test_row_amount_null_is_normalized_to_zero`

</details>

<details>
<summary><code>ury.ury.report_api.test_shift_invoices</code> (13)</summary>

- **TestRequireManagerGate**
  - `test_get_shifts_denied`
  - `test_get_shift_invoices_denied`
  - `test_get_period_invoices_denied`
- **TestHelpers**
  - `test_format_time_from_timedelta`
  - `test_shift_info_closed`
  - `test_shift_info_open_and_long`
  - `test_attach_items_sums_qty_and_dedupes_courses`
- **TestGetShifts**
  - `test_latest_closing_end_wins_across_closing_doctypes`
  - `test_no_openings_skips_closing_lookup`
- **TestGetShiftInvoices**
  - `test_unknown_shift_raises`
  - `test_rows_numbered_and_summary_excludes_returns_from_count`
- **TestGetPeriodInvoices**
  - `test_row_numbers_continue_across_pages_and_null_totals_are_zero`
  - `test_branch_scoped_query_uses_report_settings`

</details>

<details>
<summary><code>ury.ury.report_api.test_waiter_service</code> (2)</summary>

> Guest-funded waiter service is kept separate from sales commission.

- **TestWaiterServiceReport**
  - `test_unassigned_charges_are_visible_in_summary_and_invoice_detail`
  - `test_groups_submitted_charges_by_credited_waiter`

</details>

### `ury/ury/services`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_bom_cost_resolver` | 8 | ✅ | моки |
| `test_currency` | 4 | ❌ | моки |
| `test_production_unit_department_migration` | 8 | ✅ | моки |
| `test_yield_branch_scope` | 4 | ❌ | моки |
| `test_yield_check_reminders` | 30 | ✅ | моки, реальная БД |

<details>
<summary><code>ury.ury.services.test_bom_cost_resolver</code> (8)</summary>

> Unit tests for BOM cost resolver utilities.

- **TestResolveBOMCost**: Test BOM cost resolution logic.
  - `test_simple_item_without_bom`: Resolve cost for a simple item with only Item Price entry.
  - `test_simple_item_with_qty_multiplier`: Resolve cost with quantity multiplier.
  - `test_missing_item_price`: Handle item with no price in price list.
  - `test_single_level_bom`: Resolve cost for item with a BOM containing simple items.
  - `test_bom_with_non_unity_output_qty`: Resolve BOM cost when BOM output is not 1 unit.
  - `test_depth_limit_prevents_infinite_recursion`: Depth limiting prevents recursion beyond max_depth.
  - `test_product_bundle_simple`: Resolve cost for product bundle with simple items.
  - `test_product_bundle_with_missing_item`: Handle product bundle when one item lacks a price.

</details>

<details>
<summary><code>ury.ury.services.test_currency</code> (4)</summary>

- **TestCurrency**
  - `test_company_currency_takes_precedence_over_country`
  - `test_persisted_site_currency_without_company`
  - `test_country_currency_during_setup`
  - `test_missing_setup_does_not_invent_rupees`

</details>

<details>
<summary><code>ury.ury.services.test_production_unit_department_migration</code> (8)</summary>

- **TestProductionUnitDepartmentMigration**
  - `test_dry_run_is_stable_and_preserves_source_semantics`
  - `test_apply_idempotency_key_changes_with_effective_payload`
  - `test_resolution_stays_empty_until_target_departments_exist`
  - `test_apply_is_noop_when_target_doctype_is_missing`
  - `test_apply_creates_accepted_department_fields_and_is_idempotent`
  - `test_apply_skips_when_company_is_missing_or_ambiguous`
  - `test_kot_routing_still_reads_printers_from_production_unit`
  - `test_apply_skips_when_cost_center_is_missing_or_ambiguous`

</details>

<details>
<summary><code>ury.ury.services.test_yield_branch_scope</code> (4)</summary>

- **TestBranchItemCodes**
  - `test_returns_none_when_branch_is_falsy`: No branch filter requested -> None, distinguishing "no filter" from "branch resolved to nothing".
  - `test_returns_empty_set_when_no_active_ipc_rows`
  - `test_resolves_bom_components_via_ipc_bom_field`: A sellable item's IPC row -> its BOM -> that BOM's raw-ingredient component rows are the items "used at" the branch. This is the anchor a raw ingredient (yield-tracked) can actually reach, unlike a d…
  - `test_returns_empty_set_when_ipc_bom_has_no_components`

</details>

<details>
<summary><code>ury.ury.services.test_yield_check_reminders</code> (30)</summary>

- **TestEvaluateEveryIssue**: Test Every Issue cadence mode.
  - `test_due_when_authorized_issue_exists_without_yield_check`: Item is due when an authorized issue exists with no yield check.
  - `test_not_due_when_yield_check_exists_for_authorization`: Item is not due when a yield check already references the authorization.
  - `test_not_due_when_no_authorized_issues`: Item is not due when no authorized issues exist.
  - `test_multiple_authorizations_first_unchecked_is_due`: When multiple authorizations exist, the first unchecked one makes item due.
- **TestEvaluateInterval**: Test Interval cadence mode.
  - `test_due_immediately_when_never_checked`: Item is due immediately if never checked.
  - `test_not_due_when_within_interval`: Item is not due if last check is within the interval.
  - `test_due_when_overdue_by_interval`: Item is due when last check is older than interval.
  - `test_days_overdue_calculation_correct`: days_overdue is correctly calculated as days_since - interval.
  - `test_not_due_when_interval_is_zero_or_negative`: Item is not due if interval_days is <= 0.
- **TestEvaluateSampled**: Test Sampled cadence mode (deterministic hash-based sampling).
  - `test_sampled_deterministic_same_date_branch_item_same_result`: Sampled evaluation is deterministic: same inputs always give same result.
  - `test_sampled_different_dates_may_differ`: Sampled evaluation may differ for different dates (but is still deterministic).
  - `test_sampled_result_is_boolean`: Sampled evaluation returns either (reason, {}) or (None, None), not a complex object.
  - `test_sampled_different_items_different_results`: Different items may have different sampling outcomes on same day.
- **TestEvaluateCadenceDispatcher**: Test _evaluate_cadence dispatcher function.
  - `test_dispatches_to_every_issue_when_cadence_is_every_issue`: _evaluate_cadence dispatches to _evaluate_every_issue for 'Every Issue' mode.
  - `test_dispatches_to_interval_when_cadence_is_interval`: _evaluate_cadence dispatches to _evaluate_interval for 'Interval' mode.
  - `test_dispatches_to_sampled_when_cadence_is_sampled`: _evaluate_cadence dispatches to _evaluate_sampled for 'Sampled' mode.
  - `test_returns_none_when_cadence_is_unknown`: _evaluate_cadence returns (None, None) for unknown cadence modes.
- **TestGetDueYieldChecksPermissionGating**: Test get_due_yield_checks permission and scope gating.
  - `test_require_manager_called`: get_due_yield_checks calls require_manager().
  - `test_require_scope_fails_when_branch_has_no_company`: get_due_yield_checks fails closed if branch.company is None.
- **TestGetDueYieldChecksIntegration**: Integration tests for get_due_yield_checks. get_due_yield_checks now makes two frappe.get_all-shaped calls in sequence: first (indirectly, via branch_item_codes -> BOM anchor) to resolve the branch-s…
  - `test_returns_list_of_due_items`: get_due_yield_checks returns a list of due items.
  - `test_due_item_includes_cadence_and_reason`: Due items include cadence, item name, and reason.
  - `test_extra_fields_merged_into_due_item`: Extra fields from _evaluate_cadence are merged into the due item.
- **TestGetDueYieldChecksBranchScoping**: F8 (corrected): get_due_yield_checks scopes the tracked-item set to items actually used at the requested branch, anchored via active IPC rows -> their BOM -> that BOM's component items (BOM Item rows…
  - `test_items_not_used_at_branch_are_excluded`: An Item outside the branch's BOM-derived item set never reaches _evaluate_cadence, even if it is globally yield-tracked.
  - `test_no_items_used_at_branch_returns_empty`: If branch_item_codes() resolves to an empty set (no active IPC rows, no BOM, or no BOM components), return an empty list instead of falling through to the global item set.
- **TestBOMHookYieldBackCalculation**: Test BOM Item yield back-calculation hook. This class mirrors ury/ury/hooks/test_ury_bom.py's own TestApplyYieldBackCalculation (see that file's fix, Session 4, for the full explanation) -- both suff…
  - `test_qty_calculated_from_yield_qty_and_percent`: BOM Item qty is calculated as: qty = custom_yield_qty / (custom_yield_percent / 100).
  - `test_qty_not_overwritten_when_yield_tracking_disabled`: BOM Item qty is not recalculated if Item.custom_yield_tracked is False.
  - `test_throws_when_missing_yield_qty`: A yield-tracked row without custom_yield_qty throws (I6 hardening -- this is no longer a silent skip, see the class docstring above).
  - `test_throws_when_zero_yield_percent`: A yield-tracked row with custom_yield_percent=0 throws (guard against division by zero -- I6 hardening, no longer a silent skip).
- **TestGetDueYieldChecksRealDocumentIntegration**: F9: real-document coverage for get_due_yield_checks -- every other test in this file mocks frappe.get_all/db.exists directly, so none of them inserted an actual Item/URY Issue Authorization/URY Yield…
  - `test_real_authorized_issue_without_yield_check_is_due`
  - `test_real_authorized_issue_with_yield_check_is_not_due`

</details>

### `ury/ury_pos`

| Модуль | Тестов | CI | Метки |
|---|---:|:-:|---|
| `test_api` | 50 | ✅ | моки, реальная БД, от имени пользователя |
| `test_api_cashier_scoping` | 15 | ❌ | моки |
| `test_create_pos_opening_entry_permissions` | 4 | ❌ | моки |
| `test_e2e_p0_p1_flow` | 1 | ✅ | реальная БД, от имени пользователя |
| `test_validate_pos_close` | 6 | ❌ | моки |

<details>
<summary><code>ury.ury_pos.test_api</code> (50)</summary>

- **TestOrderPerformerDisplay**
  - `test_order_list_includes_performer_name`
- **TestGetRestaurantMenuPhase1**: Phase 1 regression: getRestaurantMenu() must remain a thin wrapper around resolve_restaurant_menu() with byte-identical behavior for existing (staff) callers.
  - `test_getRestaurantMenu_delegates_with_resolved_branch_and_cashier`
  - `test_getRestaurantMenu_non_cashier_role`
  - `test_getRestaurantMenu_forwards_customer`
- **TestResolveMenuNameForCustomer**: A customer priced from a URY Menu gets that menu ahead of the room / order-type / active menu, except on the Aggregators flow.
  - `test_customer_menu_wins`
  - `test_falls_back_without_customer_menu`
  - `test_aggregators_ignore_customer_menu`
- **TestGetMenuCourses**: getMenuCourses() must be scoped to the menu resolved for the caller's POS Profile, while a bare call keeps the legacy whole-catalog behavior.
  - `test_without_pos_profile_returns_whole_catalog`
  - `test_with_pos_profile_filters_by_resolved_menu`
  - `test_menu_without_courses_returns_empty`
  - `test_pos_profile_from_another_branch_is_rejected`
- **TestMergeBillsSEC07**
  - `test_merge_bills_no_permission_primary`
  - `test_merge_bills_no_permission_secondary`
  - `test_merge_bills_different_branches`
  - `test_merge_bills_success`
- **TestSearchPosInvoiceBranchScoping**
  - `test_normal_user_branch_a`
  - `test_normal_user_branch_b_unbilled`
  - `test_search_text_cannot_bypass_branch`
  - `test_administrator_without_branch`
- **TestURYPosAPI**
  - `test_get_split_group_unauthorized`
  - `test_getPosInvoiceItems_unauthorized`
- **TestCreateCustomerLinkId**: Regression: success payload must expose Customer link `name`, which can differ from display `customer_name` under series naming.
  - `test_returns_inserted_name_distinct_from_display`
- **TestUryPosApi**
  - `test_unauthorized_create_customer`
  - `test_authorized_create_customer`
- **TestGetAllowedPosProfiles**
  - `test_no_company_returns_empty`
  - `test_open_profile_included_when_no_users`
  - `test_matching_user_included`
  - `test_other_user_excluded`
- **TestGetPOSOpeningScreenData**
  - `test_returns_full_context`
  - `test_handles_missing_company_and_profile_gracefully`
- **TestSubmitChecklistSEC10**: Test cases for submit_checklist function.
  - `test_submit_checklist_all_mandatory_checked`: Test that submit_checklist returns status='Complete' when all mandatory items are checked.
  - `test_submit_checklist_mandatory_unchecked`: Test that submit_checklist returns status='In Progress' when at least one mandatory item is unchecked.
  - `test_validate_checklist_branch_cross_branch_rejection`: Test that submit_checklist raises PermissionError when user's branch doesn't match POS Profile branch.
- **TestDependentChecklistBridge**: Role-based Dependent Checklist (grillax port) surfaced through the legacy get_checklist/submit_checklist contract used by all POS frontends. Goals expand into their Quality Goal objectives; submissio…
  - `test_get_checklist_surfaces_objectives_as_items`: A role-matched goal with no Quality Review yet expands into one mandatory item per Quality Goal objective (not the goal doc name), each carrying the goal for submit-time review creation.
  - `test_get_checklist_resurfaces_failed_alongside_unanswered`: While any objective is still unanswered, a Failed one resurfaces next to it with its saved status and remarks -- so reopening shows the previous result.
  - `test_get_checklist_failure_keeps_goal_pending`: A recorded failure does NOT complete the goal: the failed objective resurfaces prefilled and the gate stays open until it is resolved and re-submitted as Passed.
  - `test_get_checklist_open_objective_stays_pending`: An objective still Open (no explicit result) keeps the gate open and resurfaces unanswered.
  - `test_get_checklist_complete_when_all_objectives_passed`: When every objective on the user's review is Passed, nothing surfaces and the gate reports Complete.
  - `test_get_checklist_ignores_goals_for_other_roles`: Goals whose Role is not assigned to the user never surface.
  - `test_submit_checklist_creates_quality_review`: Submitting checked objective items creates a Quality Review whose review rows mirror the user's checkboxes.
  - `test_submit_checklist_updates_existing_review`: A resubmission must update the existing Quality Review (statuses folded into existing rows, missing objectives appended) instead of creating a duplicate.
  - `test_submit_checklist_marks_failed_objective`: An explicit FAIL with remarks is persisted on the review row, and a fully-answered review (Passed or Failed) completes the checklist.
  - `test_submit_checklist_failed_without_remarks_throws`: A FAIL without a remark is rejected before anything is written.
  - `test_submit_checklist_unchecked_objective_stays_pending`: A legacy payload without an explicit status (is_checked only) maps False -> Open, which keeps the overall status In Progress.
  - `test_dependent_option_maps_to_checklist_type`: 'POS Opening Entry' and 'Order Taking' rows surface for the Opening checklist; 'POS Closing Entry' and 'RM Checklist' rows surface for the Closing checklist -- as objective items, nothing leaks acros…
  - `test_order_taking_goal_ignored_for_other_roles`: An 'Order Taking' goal must not surface for users without the configured role, even though the option now maps to Opening.
  - `test_opening_blocked_until_rm_checklist_passed`: Cashier's opening gate stays closed -- with the RM named as the blocker -- until the RM checklist has a fully-Passed review.
  - `test_opening_unblocked_once_rm_passed`: With the RM review Passed, the blocker clears and the cashier's own goal surfaces.
  - `test_submit_blocked_until_predecessor_passed`: The API itself refuses submissions while a predecessor role's checklist is unfinished (no frontend bypass).
  - `test_closing_blocker_runs_in_reverse`: Closing runs Order Taker -> Cashier -> RM: the RM is blocked by the (descending-rank) predecessors, the Order Taker is not.

</details>

<details>
<summary><code>ury.ury_pos.test_api_cashier_scoping</code> (15)</summary>

> Priority-3 whitelisted-function audit: ury_pos/api.py cashier surface. Covers functions with zero prior coverage (per grep against test_api.py): - getInvoiceForCashier: the U27 cashier-scoping security fix (a non-elevated caller must not be able to read another cashier's invoices by simply passing a different `cashier` argument). - searchPosInvoice: branch scoping + Administrator/System Manager b…

- **TestGetInvoiceForCashierScoping**: U27 security fix: `cashier` param must not let a non-elevated caller read another cashier's invoices.
  - `test_non_elevated_user_cannot_read_other_cashier`
  - `test_elevated_role_can_read_other_cashier`
  - `test_own_cashier_value_is_unaffected`
  - `test_pagination_next_flag_true_when_extra_row_returned`
  - `test_pagination_next_flag_false_when_no_extra_row`
  - `test_recently_paid_status_never_sets_next`
- **TestSearchPosInvoiceBranchScoping**: searchPosInvoice(): empty-query short-circuit, branch scoping, and the Administrator/System Manager bypass when getBranch() raises.
  - `test_empty_query_returns_empty_without_touching_db`
  - `test_branch_filter_applied_for_normal_user`
  - `test_administrator_without_branch_searches_all_branches`
  - `test_non_admin_without_branch_reraises`
  - `test_unbilled_status_overrides_filters`
  - `test_next_true_when_page_full`
  - `test_next_false_when_page_not_full`
- **TestGetCashier**: getCashier(): POS Opening Entry -> room -> assigned cashier lookup.
  - `test_returns_cashier_when_open_entry_found`
  - `test_returns_none_when_no_open_entry`

</details>

<details>
<summary><code>ury.ury_pos.test_create_pos_opening_entry_permissions</code> (4)</summary>

> Negative-permission tests for `create_pos_opening_entry()` in `ury/ury_pos/api.py` -- this whitelisted function had zero test coverage before this file (see TRACK.md Phase 2 priority-3 audit, sa-comprehensive- test-strategy). Mock-based, matching the established pattern in this package (`test_api.py`'s other `TestURYPosAPI`-style tests): the behaviour under test is authorization control flow, not…

- **TestCreatePosOpeningEntryPermissions**
  - `test_rejected_when_create_permission_missing`
  - `test_rejected_when_submit_permission_missing`
  - `test_rejected_when_pos_profile_read_permission_missing`
  - `test_allowed_through_when_all_permissions_present`

</details>

<details>
<summary><code>ury.ury_pos.test_e2e_p0_p1_flow</code> (1)</summary>

> End-to-end integration test for the P0/P1 flow verified live on 2026-08-19: opening checklist -> POS opening -> checklist resume/complete -> KOT error visibility -> multi-cashier closing data fetch. This hits the real database (no mocks) via ``FrappeTestCase``, the same way ``ury/ury/doctype/sub_pos_closing/test_sub_pos_closing.py`` and the ``TestUryPosApi`` class in ``ury_pos/test_api.py`` do fo…

- **TestP0P1EndToEndFlow**: Regression coverage for the opening checklist -> POS opening -> closing -> KOT visibility flow, run as a single continuous sequence against real inserted records (Branch, POS Profile, User, POS Openi…
  - `test_opening_checklist_to_kot_visibility_flow`

</details>

<details>
<summary><code>ury.ury_pos.test_validate_pos_close</code> (6)</summary>

> Focused regression tests for validate_pos_close daily-close gate. Covers the 05:00 business-day boundary and older unclosed sessions (equality-on-yesterday missed multi-day-open openings like Aug 31 on Sep 8).

- **TestValidatePosClose**
  - `test_disabled_option_always_success`
  - `test_after_5am_older_unclosed_session_fails`: Sep 8 after 05:00 must fail when Aug 31 (or any prior day) is still open.
  - `test_after_5am_yesterday_unclosed_still_fails`
  - `test_after_5am_no_stale_session_succeeds`
  - `test_before_5am_uses_prior_business_day_cutoff`: Before 05:00 on Sep 8, business day is still Sep 7; stale is posting_date < Sep 7.
  - `test_before_5am_yesterdays_open_session_still_allowed`: Grace until 05:00: an open session dated yesterday is still current business day.

</details>

## Frontend `pos/` (Vitest)

| Файл | Тестов |
|---|---:|
| `pos/src/App.test.tsx` | 3 |
| `pos/src/captain/components/CaptainActionsMenu.test.tsx` | 10 |
| `pos/src/captain/components/CaptainMenu.test.tsx` | 3 |
| `pos/src/captain/components/CaptainOrderLine.test.tsx` | 13 |
| `pos/src/captain/components/CaptainRouteGuard.test.tsx` | 1 |
| `pos/src/captain/components/CaptainTableCard.test.tsx` | 8 |
| `pos/src/captain/components/ServiceRequestPanel.test.tsx` | 7 |
| `pos/src/captain/pages/CaptainOrder.test.tsx` | 1 |
| `pos/src/captain/pages/CaptainTables.test.tsx` | 9 |
| `pos/src/components/AggregatorSelect.test.tsx` | 7 |
| `pos/src/components/AppLayout.test.tsx` | 5 |
| `pos/src/components/AuthGuard.test.tsx` | 7 |
| `pos/src/components/BillMergeDialog.test.tsx` | 6 |
| `pos/src/components/BillSplitDialog.test.tsx` | 8 |
| `pos/src/components/CaptainTransferDialog.test.tsx` | 10 |
| `pos/src/components/ChecklistGateDialog.test.tsx` | 15 |
| `pos/src/components/ClosingPaymentTable.test.tsx` | 7 |
| `pos/src/components/CommentDialog.test.tsx` | 8 |
| `pos/src/components/ConfirmDialog.shared.test.tsx` | 1 |
| `pos/src/components/CustomerPicker.shared.test.tsx` | 5 |
| `pos/src/components/CustomerPicker.test.tsx` | 12 |
| `pos/src/components/CustomerSelect.test.tsx` | 6 |
| `pos/src/components/Footer.test.tsx` | 6 |
| `pos/src/components/Header.test.tsx` | 5 |
| `pos/src/components/HufLogo.test.tsx` | 8 |
| `pos/src/components/InitialLoader.test.tsx` | 6 |
| `pos/src/components/KotAlertListener.test.tsx` | 6 |
| `pos/src/components/LayoutView.test.tsx` | 12 |
| `pos/src/components/MenuCard.test.tsx` | 3 |
| `pos/src/components/MenuItemCard.shared.test.tsx` | 10 |
| `pos/src/components/MenuList.test.tsx` | 10 |
| `pos/src/components/MergeLinkConnector.test.tsx` | 4 |
| `pos/src/components/MergedBillPanel.test.tsx` | 10 |
| `pos/src/components/OrderActionsMenu.test.tsx` | 10 |
| `pos/src/components/OrderPanel.billing.test.tsx` | 6 |
| `pos/src/components/OrderPanel.test.tsx` | 4 |
| `pos/src/components/OrderStatusSidebar.test.tsx` | 5 |
| `pos/src/components/OrderTypeSelect.test.tsx` | 6 |
| `pos/src/components/POSCloseFlow.test.tsx` | 11 |
| `pos/src/components/POSClosingDialog.test.tsx` | 16 |
| `pos/src/components/POSOpeningDialog.test.tsx` | 9 |
| `pos/src/components/POSOpeningPaymentTable.test.tsx` | 8 |
| `pos/src/components/POSOpeningProvider.test.tsx` | 8 |
| `pos/src/components/POSOpeningScreen.test.tsx` | 4 |
| `pos/src/components/PaymentDialog.test.tsx` | 9 |
| `pos/src/components/PerformerSelect.test.tsx` | 6 |
| `pos/src/components/ProductDialog.test.tsx` | 9 |
| `pos/src/components/ScreenSizeDialog.test.tsx` | 10 |
| `pos/src/components/ScreenSizeProvider.test.tsx` | 4 |
| `pos/src/components/SearchBar.test.tsx` | 5 |
| `pos/src/components/Sidebar.test.tsx` | 6 |
| `pos/src/components/SplitGroupPanel.test.tsx` | 6 |
| `pos/src/components/Spotlight.test.tsx` | 5 |
| `pos/src/components/TableActionsMenu.test.tsx` | 8 |
| `pos/src/components/TableCard.test.tsx` | 10 |
| `pos/src/components/TableMergeDialog.test.tsx` | 10 |
| `pos/src/components/TableSelectionDialog.test.tsx` | 13 |
| `pos/src/components/TableShapeIcon.test.tsx` | 6 |
| `pos/src/components/TableTransferDialog.test.tsx` | 10 |
| `pos/src/components/TableUnmergeDialog.test.tsx` | 9 |
| `pos/src/components/chat/ActiveReportContext.test.tsx` | 6 |
| `pos/src/components/chat/AskBar.test.tsx` | 11 |
| `pos/src/components/chat/ChatWidget.test.tsx` | 6 |
| `pos/src/components/dashboard/BaselineComparisonStrip.test.tsx` | 10 |
| `pos/src/components/dashboard/FastMovingItems.test.tsx` | 10 |
| `pos/src/components/dashboard/InsightFeed.test.tsx` | 10 |
| `pos/src/lib/availability-api.test.ts` | 5 |
| `pos/src/lib/category-icons.test.ts` | 1 |
| `pos/src/lib/category-icons.test.tsx` | 15 |
| `pos/src/lib/print.test.ts` | 5 |
| `pos/src/lib/use-menu-availability.test.ts` | 12 |
| `pos/src/main.test.tsx` | 1 |
| `pos/src/pages/Dashboard.test.tsx` | 4 |
| `pos/src/pages/OpenEntries.test.tsx` | 7 |
| `pos/src/pages/Orders.test.tsx` | 9 |
| `pos/src/pages/POS.test.tsx` | 7 |
| `pos/src/pages/Settings.test.tsx` | 5 |
| `pos/src/pages/Table.test.tsx` | 11 |
| `pos/src/store/pos-store.test.ts` | 10 |

<details>
<summary><code>pos/src/App.test.tsx</code> (3)</summary>

- **App**
  - renders toast provider
  - renders auth guard
  - renders app layout

</details>

<details>
<summary><code>pos/src/captain/components/CaptainActionsMenu.test.tsx</code> (10)</summary>

- **CaptainActionsMenu**
  - returns null when no actions are available
  - renders menu button when action is available
  - toggles menu open and closed
  - renders reprint KOT action when enabled
  - renders transfer table action when enabled
  - renders transfer captain action when enabled
  - renders print bill action when enabled
  - calls onReprintKot handler when clicked
  - disables button when loading
  - closes menu when action is clicked

</details>

<details>
<summary><code>pos/src/captain/components/CaptainMenu.test.tsx</code> (3)</summary>

- **CaptainMenu**
  - renders loading state initially
  - calls fetchMenuItems on mount
  - shows no items message when empty

</details>

<details>
<summary><code>pos/src/captain/components/CaptainOrderLine.test.tsx</code> (13)</summary>

- **CaptainOrderLine**
  - renders delta variant with increment/decrement buttons
  - displays item name and price
  - displays comment when present
  - hides comment when not present
  - calls onIncrement when increment button clicked
  - renders minus button for confirmed variant
  - renders trash button for confirmed variant
  - renders undo button for reduction variant
  - disables buttons when disabled prop is true
  - applies blue background for delta variant
  - applies red background for reduction variant
  - applies white background for confirmed variant
  - calls onEditNote when line is clicked

</details>

<details>
<summary><code>pos/src/captain/components/CaptainRouteGuard.test.tsx</code> (1)</summary>

- **CaptainRouteGuard**
  - renders children when context is available

</details>

<details>
<summary><code>pos/src/captain/components/CaptainTableCard.test.tsx</code> (8)</summary>

- **CaptainTableCard**
  - renders table name
  - renders free badge
  - renders mine badge
  - calls onTap when clicked
  - renders owner name when provided
  - renders billed badge
  - shows seat count
  - shows grandTotal

</details>

<details>
<summary><code>pos/src/captain/components/ServiceRequestPanel.test.tsx</code> (7)</summary>

- **ServiceRequestPanel**
  - renders nothing when branch is null
  - renders bell icon when branch provided
  - opens and closes panel
  - displays no requests message when empty
  - shows request count badge
  - polls for requests on interval
  - handles acknowledge action

</details>

<details>
<summary><code>pos/src/captain/pages/CaptainOrder.test.tsx</code> (1)</summary>

- **CaptainOrder**
  - renders loading state

</details>

<details>
<summary><code>pos/src/captain/pages/CaptainTables.test.tsx</code> (9)</summary>

- **CaptainTables**
  - renders tables heading
  - displays room tabs
  - displays refresh button
  - displays table cards when data loads
  - renders sticky header with tables title
  - handles table API calls
  - displays minimum required layout elements
  - renders with proper container structure
  - responds to refresh button click

</details>

<details>
<summary><code>pos/src/components/AggregatorSelect.test.tsx</code> (7)</summary>

- **AggregatorSelect**
  - renders the select component
  - loads aggregators on mount
  - displays aggregators as options
  - handles aggregator selection
  - handles API errors gracefully
  - disables select when disabled prop is true
  - shows loading message initially

</details>

<details>
<summary><code>pos/src/components/AppLayout.test.tsx</code> (5)</summary>

- **AppLayout**
  - renders header and footer
  - renders outlet for page content
  - has proper layout structure
  - has proper styling for screen-height layout
  - content area has proper overflow handling

</details>

<details>
<summary><code>pos/src/components/AuthGuard.test.tsx</code> (7)</summary>

- **AuthGuard**
  - shows loading state while auth is loading
  - shows error message when auth error occurs
  - shows POS profile configuration error
  - shows permission denied when user does not have access
  - renders children when authenticated and authorized
  - calls checkAuth on mount
  - calls fetchPosProfile when user becomes available

</details>

<details>
<summary><code>pos/src/components/BillMergeDialog.test.tsx</code> (6)</summary>

- **BillMergeDialog**
  - does not render when closed
  - renders dialog title when open
  - loads linked merge secondaries
  - displays candidates
  - shows no candidates message
  - closes dialog on cancel

</details>

<details>
<summary><code>pos/src/components/BillSplitDialog.test.tsx</code> (8)</summary>

- **BillSplitDialog**
  - does not render when closed
  - renders dialog title when open
  - displays all items
  - allows item selection and shows qty controls
  - shows same as original customer option
  - validates split amounts
  - calls onConfirm with selected items
  - closes dialog on cancel

</details>

<details>
<summary><code>pos/src/components/CaptainTransferDialog.test.tsx</code> (10)</summary>

- **CaptainTransferDialog**
  - renders dialog when open is true
  - does not render dialog when open is false
  - displays current captain
  - displays title and description
  - displays list of available captains after loading
  - excludes current captain from list
  - disables confirm button when no captain is selected
  - calls onOpenChange when close button is clicked
  - handles empty search results
  - handles db errors gracefully

</details>

<details>
<summary><code>pos/src/components/ChecklistGateDialog.test.tsx</code> (15)</summary>

- **ChecklistGateDialog**
  - displays loading state initially
  - calls onComplete when checklist is already complete
  - renders opening checklist title
  - renders closing checklist title
  - auto-submits empty checklist
  - renders checklist items
  - marks mandatory items with asterisk
  - allows checking items
  - disables submit button when mandatory items have no result
  - enables submit button when all mandatory items are answered
  - blocks submit when FAIL has no remarks
  - prefills a previously saved FAIL result and remarks on reopen
  - shows the blocking role message when a predecessor checklist is unfinished
  - displays error message on load failure
  - submits checklist with explicit PASS results

</details>

<details>
<summary><code>pos/src/components/ClosingPaymentTable.test.tsx</code> (7)</summary>

- **ClosingPaymentTable**
  - renders payment modes table
  - displays amounts in currency format
  - accepts input changes to closing amount
  - prevents negative values from being accepted
  - renders table structure
  - applies styling based on touched modes
  - renders table headers

</details>

<details>
<summary><code>pos/src/components/CommentDialog.test.tsx</code> (8)</summary>

- **CommentDialog**
  - renders nothing when not open
  - renders dialog when open
  - updates textarea value on user input
  - calls onSave and onClose when save button clicked
  - calls onClose and resets comment on cancel button click
  - calls onClose and resets comment on close button click
  - autofocuses textarea when opened
  - preserves initial comment value

</details>

<details>
<summary><code>pos/src/components/ConfirmDialog.shared.test.tsx</code> (1)</summary>

- **ConfirmDialog rejected confirm**
  - keeps the dialog open and does not throw when onConfirm rejects

</details>

<details>
<summary><code>pos/src/components/CustomerPicker.shared.test.tsx</code> (5)</summary>

- **CustomerPicker keyboard and prefill**
  - selects a highlighted result with ArrowDown + Enter
  - moves highlight to Add New with ArrowDown then opens create on Enter
  - prefills phone when opening create from a digits-only query
  - uses Change for selected clear and Cancel in the create dialog
  - shows searchFailed copy for searchError, not noResults

</details>

<details>
<summary><code>pos/src/components/CustomerPicker.test.tsx</code> (12)</summary>

- **CustomerPicker**
  - renders search input when no customer is selected
  - displays selected customer information
  - shows change button when customer is selected
  - clears customer selection when change button is clicked
  - searches customers when typing in search input
  - displays search results after debounce
  - loads latest customers before typing
  - disables search input when disabled prop is true
  - disables change button when disabled prop is true
  - shows add new customer option
  - opens dropdown when input receives focus
  - renders correctly with empty initial state

</details>

<details>
<summary><code>pos/src/components/CustomerSelect.test.tsx</code> (6)</summary>

- **CustomerSelect**
  - renders without crashing
  - renders picker component by default
  - accepts disabled prop
  - handles missing store gracefully
  - marks the picker optional when the POS Profile allows orders without a customer
  - keeps the picker required when the POS Profile flag is off

</details>

<details>
<summary><code>pos/src/components/Footer.test.tsx</code> (6)</summary>

- **Footer**
  - renders all navigation items
  - renders navigation links with correct paths
  - renders in a nav element
  - has proper styling classes
  - renders all links as NavLink components
  - has clickable navigation links

</details>

<details>
<summary><code>pos/src/components/Header.test.tsx</code> (5)</summary>

- **Header**
  - renders the header
  - renders the search bar with appropriate placeholder
  - opens user menu when user button is clicked
  - displays user menu options when menu is open
  - renders logo link to dashboard

</details>

<details>
<summary><code>pos/src/components/HufLogo.test.tsx</code> (8)</summary>

- **HufLogo**
  - renders an SVG element
  - has the correct viewBox
  - has aria-label HUF
  - has role img
  - applies custom className
  - renders with default className including h-3.5 and w-auto
  - contains a path element with the logo design
  - contains a linearGradient definition

</details>

<details>
<summary><code>pos/src/components/InitialLoader.test.tsx</code> (6)</summary>

- **InitialLoader**
  - renders the loader component
  - displays the loading message
  - displays the wait message
  - renders spinner component
  - renders with centered layout
  - has full screen background

</details>

<details>
<summary><code>pos/src/components/KotAlertListener.test.tsx</code> (6)</summary>

- **KotAlertListener**
  - is a headless component
  - loads production units on mount
  - calls useKotErrorChannels hook
  - shows error toast when error occurs
  - handles empty production units
  - handles API errors

</details>

<details>
<summary><code>pos/src/components/LayoutView.test.tsx</code> (12)</summary>

- **LayoutView**
  - renders the layout view header
  - renders tables on the canvas
  - shows edit and layout buttons
  - calls onBackToGrid when grid view button is clicked
  - shows zoom controls
  - toggles edit mode when edit button is clicked
  - selects a table when clicked
  - displays table properties panel when table is selected
  - displays occupied badge for occupied tables
  - loads table order when clicking on occupied table
  - displays bill info for occupied tables
  - hides table panel when X button is clicked

</details>

<details>
<summary><code>pos/src/components/MenuCard.test.tsx</code> (3)</summary>

- **MenuCard availability gating**
  - stays clickable and shows no badge for a sellable item
  - disables the card and shows the reason message for a PLAN_EXHAUSTED item
  - shows the localized daily availability reason

</details>

<details>
<summary><code>pos/src/components/MenuItemCard.shared.test.tsx</code> (10)</summary>

- **MenuItemCard image fallback**
  - shows name initials when the image fails to load
  - renders initials immediately when imageUrl is missing
- **MenuItemCard quantity steppers**
  - shows accessible plus/minus when quantity is positive
  - disables decrement when decrementDisabled is set
  - hides steppers when quantity is zero
  - places quantity controls at the bottom-end corner
- **MenuItemCard configure gestures**
  - announces options and opens on Shift+Enter without quick-add
- **ProductConfigurator mobile image sizing**
  - uses constrained mobile image height instead of min-h-96
  - exposes labeled quantity controls at touch-friendly size
- **SegmentedControl a11y**
  - exposes radiogroup semantics with aria-checked

</details>

<details>
<summary><code>pos/src/components/MenuList.test.tsx</code> (10)</summary>

- **MenuList**
  - renders menu list
  - displays all menu items when no filters applied
  - calls fetchMenuItems on mount
  - shows loading state
  - shows error state
  - shows empty state when no items found
  - calls onItemClick when menu card is clicked
  - filters items by search query
  - disables interaction when isMenuInteractionDisabled is true
  - renders in-stock items before sold out and temporarily unavailable items

</details>

<details>
<summary><code>pos/src/components/MergeLinkConnector.test.tsx</code> (4)</summary>

- **MergeLinkConnector**
  - renders the link icon
  - renders with correct accessibility label
  - includes table names in title attribute
  - renders with correct styling classes

</details>

<details>
<summary><code>pos/src/components/MergedBillPanel.test.tsx</code> (10)</summary>

- **MergedBillPanel**
  - returns null when no merged invoice is present
  - renders merged bill panel when merged invoice exists
  - displays secondary invoice name
  - displays combined total correctly
  - shows loading state while fetching items
  - renders merged items when fetched
  - displays item quantity and rate correctly
  - calls onOpenSecondary when button is clicked
  - handles API errors gracefully
  - handles null custom_merged_total

</details>

<details>
<summary><code>pos/src/components/OrderActionsMenu.test.tsx</code> (10)</summary>

- **OrderActionsMenu**
  - returns null when no actions are available
  - renders toggle button when actions are available
  - opens menu when toggle button is clicked
  - closes menu when toggle button is clicked again
  - displays split bill option when showSplitBill is true
  - displays merge bill option when showMergeBill is true
  - calls onSplitBill when split bill option is clicked
  - calls onMergeBill when merge bill option is clicked
  - closes menu when clicking outside
  - sets aria-expanded correctly based on isOpen

</details>

<details>
<summary><code>pos/src/components/OrderPanel.billing.test.tsx</code> (6)</summary>

- **OrderPanel**
  - shows the server-quoted dine-in service charge and inclusive total
  - quotes the service-inclusive total and submits when performer selection is disabled
  - prompts for the required performer without making failing quote requests
  - does not request or show service charge for takeaway
  - never presents the meal subtotal as payable while quoting or after a failure, and can retry
  - invalidates the previous total immediately when quantities change

</details>

<details>
<summary><code>pos/src/components/OrderPanel.test.tsx</code> (4)</summary>

- **OrderPanel**
  - renders empty cart when no orders
  - renders order type select
  - renders customer select
  - displays pax counter

</details>

<details>
<summary><code>pos/src/components/OrderStatusSidebar.test.tsx</code> (5)</summary>

- **OrderStatusSidebar**
  - renders the status sidebar with title
  - renders status buttons based on configuration
  - calls setSelectedStatus when a status is clicked
  - applies disabled state when disabled prop is true
  - highlights the selected status

</details>

<details>
<summary><code>pos/src/components/OrderTypeSelect.test.tsx</code> (6)</summary>

- **OrderTypeSelect**
  - prompts for a table on entry and after starting the next dine-in order
  - waits until interaction is enabled and respects table-order restrictions
  - renders order type buttons
  - calls setSelectedOrderType when clicking an order type
  - respects disabled prop
  - disables buttons when isUpdatingOrder is true

</details>

<details>
<summary><code>pos/src/components/POSCloseFlow.test.tsx</code> (11)</summary>

- **POSCloseFlow**
  - renders the initial close POS card
  - renders a danger button to close POS
  - opens confirmation dialog when close button is clicked
  - closes confirmation dialog when cancel is clicked
  - opens POSClosingDialog when confirm button is clicked
  - shows success message after closing is submitted
  - shows back to dashboard button after successful close
- **POSCloseFlow shift report reprint**
  - offers to print the shift report again after closing
  - has no print button after a Sub POS Closing
  - tells the cashier when the browser blocks the print window
  - reports a missing shift report without trying to print

</details>

<details>
<summary><code>pos/src/components/POSClosingDialog.test.tsx</code> (16)</summary>

- **POSClosingDialog**
  - renders dialog title when open
  - loads opening entry and invoices on mount
  - displays loading spinner while loading
  - displays error message if no opening entry found
  - displays payment totals
  - renders closing payment table
  - prevents submission if closing amounts are not entered
  - calls onOpenChange with false when cancel is clicked
  - gates closing submission on a pending Closing checklist before creating the doc
- **POSClosingDialog shift report printing**
  - prints the report once after a successful main closing
  - does not print when auto print is off
  - keeps the closing and offers a retry when the printer fails
  - explains a blocked print pop-up and prints on retry
  - can continue without the printout
  - reports a missing shift report without failing the closing
  - never prints a shift report for a Sub POS Closing

</details>

<details>
<summary><code>pos/src/components/POSOpeningDialog.test.tsx</code> (9)</summary>

- **POSOpeningDialog**
  - renders permission denied state
  - renders daily close pending state
  - renders main cashier not open state
  - renders cross company open state
  - renders generic error state
  - calls onRetry when retry button clicked
  - calls onContinue when continue button clicked
  - shows switch to desk button when canAccessDesk is true
  - hides switch to desk button when canAccessDesk is false

</details>

<details>
<summary><code>pos/src/components/POSOpeningPaymentTable.test.tsx</code> (8)</summary>

- **POSOpeningPaymentTable**
  - renders payment table with modes
  - displays opening amounts
  - renders input fields for editing amounts
  - prevents negative values
  - displays total opening balance
  - disables inputs when readOnly is true
  - disables inputs when disabled is true
  - calculates correct total

</details>

<details>
<summary><code>pos/src/components/POSOpeningProvider.test.tsx</code> (8)</summary>

- **POSOpeningProvider**
  - renders loading state initially
  - renders children when no blocking state
  - shows opening screen when no existing entry
  - shows opening screen when check_opening_entry returns an empty list (ERPNext v16)
  - gates the opening screen on a pending Opening checklist when check_opening_entry returns [] (ERPNext v16)
  - gates the opening screen on a pending Opening checklist (no entry yet)
  - shows dialog when permission denied
  - handles cross-company open error

</details>

<details>
<summary><code>pos/src/components/POSOpeningScreen.test.tsx</code> (4)</summary>

- **POSOpeningScreen**
  - renders without crashing
  - calls onSuccess callback if provided
  - calls onError callback if provided
  - handles missing callbacks

</details>

<details>
<summary><code>pos/src/components/PaymentDialog.test.tsx</code> (9)</summary>

- **PaymentDialog**
  - shows the server policy and service charge before payment
  - renders payment dialog
  - displays order summary with subtotal
  - displays payment mode labels
  - renders pay button
  - shows discount section when enable_discount is true
  - hides discount section when enable_discount is false
  - displays table name when provided
  - displays order summary section

</details>

<details>
<summary><code>pos/src/components/PerformerSelect.test.tsx</code> (6)</summary>

- **PerformerSelect**
  - renders nothing when the profile has the feature off
  - renders nothing when the user lacks a permitted role
  - lists eligible employees for a permitted user
  - offers a blank option only when a performer is not required
  - omits the blank option when the profile requires a performer
  - shows no options when the lookup fails

</details>

<details>
<summary><code>pos/src/components/ProductDialog.test.tsx</code> (9)</summary>

- **ProductDialog**
  - renders product dialog
  - displays product name
  - displays quantity control
  - displays total price calculation
  - displays add to order button
  - renders close button
  - renders with initial quantity
  - calls setSelectedItem on mount with selected item
  - renders dialog content when selected item exists

</details>

<details>
<summary><code>pos/src/components/ScreenSizeDialog.test.tsx</code> (10)</summary>

- **ScreenSizeDialog**
  - renders the dialog
  - displays Desktop Only heading
  - displays warning message about screen size
  - displays required screen size
  - displays current screen width
  - renders Switch to Version 1 button
  - opens Version 1 in new tab on button click
  - renders with modal overlay
  - displays modal card with white background
  - renders monitor and smartphone icons

</details>

<details>
<summary><code>pos/src/components/ScreenSizeProvider.test.tsx</code> (4)</summary>

- **ScreenSizeProvider**
  - renders children when screen is large enough
  - shows dialog when screen is too small
  - exempts /order routes from size check
  - responds to window resize events

</details>

<details>
<summary><code>pos/src/components/SearchBar.test.tsx</code> (5)</summary>

- **SearchBar**
  - shows search input when visible
  - calls onVisibilityChange when search button clicked
  - displays current search value
  - disables search when disabled prop is true
  - updates input value on change

</details>

<details>
<summary><code>pos/src/components/Sidebar.test.tsx</code> (6)</summary>

- **Sidebar**
  - renders sidebar container
  - displays categories
  - displays item counts
  - calls setSelectedCategory when clicking a category
  - respects disabled prop
  - renders category names

</details>

<details>
<summary><code>pos/src/components/SplitGroupPanel.test.tsx</code> (6)</summary>

- **SplitGroupPanel**
  - renders without crashing with single invoice
  - accepts invoiceName prop
  - accepts onOpenInvoice callback
  - handles invoice name changes
  - loads split group on mount
  - cleans up subscription on unmount

</details>

<details>
<summary><code>pos/src/components/Spotlight.test.tsx</code> (5)</summary>

- **Spotlight**
  - renders the component without crashing
  - component is mounted and interactive
  - listens for keyboard events
  - handles search with menu items available
  - component manages state properly

</details>

<details>
<summary><code>pos/src/components/TableActionsMenu.test.tsx</code> (8)</summary>

- **TableActionsMenu**
  - renders the menu button
  - opens and closes the menu on button click
  - shows merge option for available table
  - does not show unmerge for available table
  - shows merge and transfer options for occupied table
  - calls onMerge when merge button is clicked
  - closes menu after merge action
  - shows captain transfer option when enabled and provided

</details>

<details>
<summary><code>pos/src/components/TableCard.test.tsx</code> (10)</summary>

- **TableCard**
  - renders table information
  - shows available badge for available table
  - shows occupied badge for occupied table
  - shows preview and print buttons for occupied table
  - does not show preview and print buttons for available table
  - calls onNavigate when available table is clicked
  - does not call onNavigate when occupied table is clicked
  - renders merge group label when provided
  - shows printing state in print button
  - renders take away badge when applicable

</details>

<details>
<summary><code>pos/src/components/TableMergeDialog.test.tsx</code> (10)</summary>

- **TableMergeDialog**
  - returns null when sourceTable is null
  - renders dialog when open and sourceTable provided
  - displays merge candidates (unoccupied tables except source)
  - does not show occupied tables as merge candidates
  - allows selecting a table
  - disables merge button when no tables selected
  - enables merge button when tables are selected
  - calls onConfirm with selected tables
  - calls onOpenChange when dialog closes
  - shows no candidates message when all tables are occupied

</details>

<details>
<summary><code>pos/src/components/TableSelectionDialog.test.tsx</code> (13)</summary>

- **TableSelectionDialog**
  - renders dialog title
  - loads and displays rooms on mount
  - loads tables when a room is selected
  - displays tables in a grid
  - shows occupied badge for occupied tables
  - shows loading spinner while fetching rooms
  - shows loading spinner while fetching tables
  - shows error message when room loading fails
  - shows error message when table loading fails
  - caches rooms in session storage
  - uses cached rooms on subsequent renders
  - calls onClose when close button is clicked
  - caches tables per room

</details>

<details>
<summary><code>pos/src/components/TableShapeIcon.test.tsx</code> (6)</summary>

- **TableShapeIcon**
  - renders a circle icon for Circle shape
  - renders a square icon for Square shape
  - renders a rectangle icon for Rectangle shape
  - defaults to a rectangle icon when no shape is given
  - falls back to a rectangle icon for an unrecognized shape
  - applies the given className to the rendered icon

</details>

<details>
<summary><code>pos/src/components/TableTransferDialog.test.tsx</code> (10)</summary>

- **TableTransferDialog**
  - does not render when open is false
  - renders dialog with title when open
  - displays source table name
  - filters tables by search text
  - shows empty message when no tables match search
  - enables table selection and calls onConfirm when selected and submitted
  - disables submit button when no table is selected
  - closes dialog when cancel button clicked
  - displays table seat count
  - handles error from onConfirm

</details>

<details>
<summary><code>pos/src/components/TableUnmergeDialog.test.tsx</code> (9)</summary>

- **TableUnmergeDialog**
  - does not render when sourceTable is null
  - renders dialog with title and description when sourceTable is provided
  - displays group members in description
  - renders cancel and confirm buttons
  - calls onOpenChange with false when cancel button is clicked
  - calls onConfirm and closes dialog when confirm button is clicked
  - disables buttons while submitting
  - shows loading text while submitting
  - prevents dialog from closing while submitting

</details>

<details>
<summary><code>pos/src/components/chat/ActiveReportContext.test.tsx</code> (6)</summary>

- **ActiveReportContext**
  - provides context to children
  - throws error when useActiveReportContext is used without provider
  - allows setting active report
  - allows clearing active report
  - persists report data across re-renders
  - initializes with null active report

</details>

<details>
<summary><code>pos/src/components/chat/AskBar.test.tsx</code> (11)</summary>

- **AskBar**
  - renders when AI is enabled
  - does not render when AI is disabled
  - displays HUF badge
  - displays keyboard shortcut hint
  - opens chat widget when button is clicked
  - opens chat widget on Cmd+K
  - opens chat widget on Ctrl+K
  - does not open chat on other key combinations
  - prevents default behavior on Cmd+K
  - renders with proper accessibility
  - displays sparkles icon

</details>

<details>
<summary><code>pos/src/components/chat/ChatWidget.test.tsx</code> (6)</summary>

- **ChatWidget**
  - renders floating button when AI is enabled
  - renders floating button even when AI is disabled
  - opens chat panel when button is clicked
  - closes chat panel when X button is clicked
  - displays HUF branding in header
  - displays floating button with message icon

</details>

<details>
<summary><code>pos/src/components/dashboard/BaselineComparisonStrip.test.tsx</code> (10)</summary>

- **BaselineComparisonStrip**
  - renders title
  - displays loading state initially
  - displays no data state when no comparison
  - renders comparison data when loaded
  - displays current covers value
  - shows error message on fetch failure
  - hides component on permission error
  - includes branch in API call when provided
  - displays positive delta in green
  - shows sample days in subtitle when available

</details>

<details>
<summary><code>pos/src/components/dashboard/FastMovingItems.test.tsx</code> (10)</summary>

- **FastMovingItems**
  - renders title
  - displays loading state initially
  - displays empty state when no items
  - renders fast moving items with sell rates
  - shows error message on fetch failure
  - hides component on permission error
  - includes branch in API call when provided
  - renders descriptive text about sell rate
  - limits display to 8 items
  - displays sell rate per hour

</details>

<details>
<summary><code>pos/src/components/dashboard/InsightFeed.test.tsx</code> (10)</summary>

- **InsightFeed**
  - displays loading state initially
  - displays empty state when no insights
  - renders title
  - renders insights when data is loaded
  - shows error message on fetch failure
  - hides component on permission error
  - includes branch in API call when provided
  - renders card component structure
  - calls dismiss_insight when dismiss button clicked
  - removes insight after dismissal

</details>

<details>
<summary><code>pos/src/lib/availability-api.test.ts</code> (5)</summary>

- **availability-api (pos)**
  - fetches availability and passes the server response through verbatim
  - maps every documented reason_code to a user-facing message
  - maps availability reasons to locale keys
  - caches per (item_code, branch, company) key and does not leak across keys
  - skipCache always re-calls the live endpoint, bypassing any cached display value

</details>

<details>
<summary><code>pos/src/lib/category-icons.test.ts</code> (1)</summary>

- **category-icons**
  - should correctly match category names to icons

</details>

<details>
<summary><code>pos/src/lib/category-icons.test.tsx</code> (15)</summary>

- **fuzzyMatchIcon**
  - matches pizza course
  - matches burger course
  - matches ice cream
  - matches soup
  - matches drinks
  - matches proteins
  - matches desserts
  - returns undefined for unknown course
  - returns undefined for empty course
  - handles compound names
- **CategoryIcon**
  - renders icon for known icon name
  - uses fallback when no name provided
  - applies className to icon
  - renders default icon for unknown course
  - handles undefined inputs gracefully

</details>

<details>
<summary><code>pos/src/lib/print.test.ts</code> (5)</summary>

- **printShiftReport**
  - opens the shift report print view in a new tab
  - reports a blocked pop-up instead of claiming success
  - prints over QZ with the shift report format
  - fails clearly when QZ printing has no host
  - prints over the network printer on the server

</details>

<details>
<summary><code>pos/src/lib/use-menu-availability.test.ts</code> (12)</summary>

- **use-menu-availability sorting**
  - **getAvailabilityTier**
    - returns Tier 0 for in-stock items with available_qty > 0
    - returns Tier 0 for unconstrained items where available_qty is null
    - returns Tier 0 (fail-open) for null or undefined availability
    - returns Tier 1 for sold-out items (PLAN_EXHAUSTED)
    - returns Tier 1 for sold-out items (FG_OUT_OF_STOCK)
    - returns Tier 2 for temporarily unavailable items (BLOCKING_COMPONENT)
    - returns Tier 2 for temporarily unavailable items (MISSING_BOM)
    - returns Tier 2 for items not produced today (NOT_PRODUCED)
    - returns Tier 2 for items with CONFIGURATION_ERROR
  - **sortMenuItemsByAvailability**
    - sorts in-stock items first, sold out second, temporarily unavailable last
    - preserves alphabetical ordering within each tier
    - treats items without availability data as Tier 0 fail-open

</details>

<details>
<summary><code>pos/src/main.test.tsx</code> (1)</summary>

- **main.tsx**
  - should export without errors

</details>

<details>
<summary><code>pos/src/pages/Dashboard.test.tsx</code> (4)</summary>

- **Dashboard**
  - renders dashboard title components
  - renders main panels
  - loads with posProfile from store
  - renders dashboard structure

</details>

<details>
<summary><code>pos/src/pages/OpenEntries.test.tsx</code> (7)</summary>

- **OpenEntries**
  - renders the page title
  - shows loading spinner while fetching data
  - shows error message when API fails
  - shows empty state when no entries are returned
  - displays a table with entries when data is available
  - formats dates correctly in the table
  - handles no posProfile gracefully

</details>

<details>
<summary><code>pos/src/pages/Orders.test.tsx</code> (9)</summary>

- **Orders Page**
  - renders the orders page
  - fetches orders on mount
  - shows loading spinner when orders are loading
  - renders with empty orders list initially
  - has OrderStatusSidebar component
  - displays no order message when no order is selected
  - **edit order**
    - opens the order through the store and goes to the register
    - stays on the page when the order is no longer open
  - displays pagination controls

</details>

<details>
<summary><code>pos/src/pages/POS.test.tsx</code> (7)</summary>

- **POS**
  - renders main POS layout
  - renders quick filter buttons
  - renders all components
  - shows InitialLoader when initializing
  - shows error state
  - shows loading state
  - has proper flex layout

</details>

<details>
<summary><code>pos/src/pages/Settings.test.tsx</code> (5)</summary>

- **Settings**
  - renders settings title
  - renders end of day section
  - renders POSCloseFlow component
  - renders coming soon message
  - has proper layout structure

</details>

<details>
<summary><code>pos/src/pages/Table.test.tsx</code> (11)</summary>

- **Table View**
  - renders the table view page
  - shows loading spinner while fetching rooms
  - displays rooms as tab buttons
  - displays room table count as badge
  - loads tables when a room is selected
  - shows loading spinner while fetching tables
  - handles table navigation
  - displays layout view button
  - shows merge dialog component
  - shows transfer dialog component
  - shows empty state when no tables found

</details>

<details>
<summary><code>pos/src/store/pos-store.test.ts</code> (10)</summary>

- **POS currency hydration**
  - loads the current profile despite a stale cached profile and symbol
  - replaces the previous symbol when the profile currency changes
- **usePOSStore customer-priced menu**
  - reloads the menu for the new customer and reprices cart lines
  - does not refetch when the menu already belongs to the selected customer
  - leaves the aggregator menu alone
  - ignores a stale menu response that resolves after a newer one
- **usePOSStore.openOrderForEdit**
  - loads the order with the same state as the table path, including the stale-write stamp
  - keeps each saved line separate with its persisted key, comment and row name
  - does not touch the cart when the order is no longer open
  - propagates load errors instead of treating them as an empty order

</details>

## Frontend `frontend/` (Vitest)

| Файл | Тестов |
|---|---:|
| `frontend/src/components/AuthGuard.test.tsx` | 5 |
| `frontend/src/components/RoleGuard.test.tsx` | 7 |
| `frontend/src/components/setup/ProgressModal.test.tsx` | 5 |
| `frontend/src/context/BranchContext.test.tsx` | 6 |
| `frontend/src/i18n/i18n.test.tsx` | 9 |
| `frontend/src/lib/currency.test.tsx` | 6 |
| `frontend/src/lib/dashboardStatsKpis.test.ts` | 4 |
| `frontend/src/lib/profitabilityReasons.test.ts` | 3 |
| `frontend/src/pages/Dashboard/AggregatorPage.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/AiAssistantSettingsPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/AnalyticsCharts.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/BranchPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/CommissionSettingsPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/DashboardPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/DayClosePage.test.tsx` | 2 |
| `frontend/src/pages/Dashboard/DepartmentProfitabilityPage.test.tsx` | 9 |
| `frontend/src/pages/Dashboard/DepartmentStockPage.test.tsx` | 7 |
| `frontend/src/pages/Dashboard/ItemProductionConfigPage.test.tsx` | 5 |
| `frontend/src/pages/Dashboard/KPIGrid.test.tsx` | 7 |
| `frontend/src/pages/Dashboard/KotErrorLogPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/MenuPage.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/MenuRoutingPage.test.tsx` | 6 |
| `frontend/src/pages/Dashboard/PaymentTerminalPage.test.tsx` | 8 |
| `frontend/src/pages/Dashboard/PosProfilePage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/ProductionDepartmentPage.test.tsx` | 7 |
| `frontend/src/pages/Dashboard/ProductionUnitPage.test.tsx` | 5 |
| `frontend/src/pages/Dashboard/QuickActions.test.tsx` | 1 |
| `frontend/src/pages/Dashboard/ReportSettingsPage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/ReportWidgets.test.tsx` | 5 |
| `frontend/src/pages/Dashboard/RequirementsPage.test.tsx` | 10 |
| `frontend/src/pages/Dashboard/RoomPage.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/SalesPlanPage.test.tsx` | 33 |
| `frontend/src/pages/Dashboard/SelfOrderingProfilePage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/ServicePage.test.tsx` | 9 |
| `frontend/src/pages/Dashboard/StockReservationPage.test.tsx` | 5 |
| `frontend/src/pages/Dashboard/StoreIssuePage.test.tsx` | 4 |
| `frontend/src/pages/Dashboard/TableLayoutView.test.tsx` | 11 |
| `frontend/src/pages/Dashboard/TablePage.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/UserPage.test.tsx` | 3 |
| `frontend/src/pages/Dashboard/WastagePage.test.tsx` | 4 |
| `frontend/src/pages/Pos/PosLayout.test.tsx` | 5 |
| `frontend/src/pages/Pos/captain/components/CaptainActionsMenu.test.tsx` | 12 |
| `frontend/src/pages/Pos/captain/components/CaptainMenu.test.tsx` | 5 |
| `frontend/src/pages/Pos/captain/components/CaptainOrderLine.test.tsx` | 14 |
| `frontend/src/pages/Pos/captain/components/CaptainRouteGuard.test.tsx` | 4 |
| `frontend/src/pages/Pos/captain/components/CaptainSplitOrderDialog.test.tsx` | 12 |
| `frontend/src/pages/Pos/captain/components/CaptainTableCard.test.tsx` | 11 |
| `frontend/src/pages/Pos/captain/components/ServiceRequestPanel.test.tsx` | 4 |
| `frontend/src/pages/Pos/captain/hooks/useCaptainContext.test.ts` | 7 |
| `frontend/src/pages/Pos/captain/hooks/useTableOrderContext.test.ts` | 8 |
| `frontend/src/pages/Pos/captain/lib/captain-table-api.test.ts` | 8 |
| `frontend/src/pages/Pos/captain/pages/CaptainOrder.test.tsx` | 6 |
| `frontend/src/pages/Pos/captain/pages/CaptainTables.test.tsx` | 12 |
| `frontend/src/pages/Pos/components/AggregatorSelect.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/AppLayout.test.tsx` | 4 |
| `frontend/src/pages/Pos/components/AuthGuard.test.tsx` | 2 |
| `frontend/src/pages/Pos/components/BillMergeDialog.test.tsx` | 4 |
| `frontend/src/pages/Pos/components/BillSplitDialog.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/CaptainTransferDialog.test.tsx` | 3 |
| `frontend/src/pages/Pos/components/ChecklistGateDialog.test.tsx` | 11 |
| `frontend/src/pages/Pos/components/ClosingPaymentTable.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/CommentDialog.test.tsx` | 7 |
| `frontend/src/pages/Pos/components/CustomerPicker.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/CustomerSelect.test.tsx` | 6 |
| `frontend/src/pages/Pos/components/Footer.test.tsx` | 4 |
| `frontend/src/pages/Pos/components/Header.test.tsx` | 3 |
| `frontend/src/pages/Pos/components/InitialLoader.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/KotAlertListener.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/LayoutView.test.tsx` | 12 |
| `frontend/src/pages/Pos/components/MenuCard.test.tsx` | 2 |
| `frontend/src/pages/Pos/components/MenuList.test.tsx` | 9 |
| `frontend/src/pages/Pos/components/MergeLinkConnector.test.tsx` | 3 |
| `frontend/src/pages/Pos/components/MergedBillPanel.test.tsx` | 9 |
| `frontend/src/pages/Pos/components/OrderActionsMenu.test.tsx` | 9 |
| `frontend/src/pages/Pos/components/OrderPanel.test.tsx` | 18 |
| `frontend/src/pages/Pos/components/OrderStatusSidebar.test.tsx` | 6 |
| `frontend/src/pages/Pos/components/OrderTypeSelect.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/POSCloseFlow.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/POSClosingDialog.test.tsx` | 13 |
| `frontend/src/pages/Pos/components/POSOpeningDialog.test.tsx` | 7 |
| `frontend/src/pages/Pos/components/POSOpeningEntryDialog.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/POSOpeningProvider.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/PaymentDialog.test.tsx` | 6 |
| `frontend/src/pages/Pos/components/PerformerSelect.test.tsx` | 6 |
| `frontend/src/pages/Pos/components/ProductDialog.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/ScreenSizeDialog.test.tsx` | 7 |
| `frontend/src/pages/Pos/components/ScreenSizeProvider.test.tsx` | 4 |
| `frontend/src/pages/Pos/components/SearchBar.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/Sidebar.test.tsx` | 6 |
| `frontend/src/pages/Pos/components/SplitGroupPanel.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/Spotlight.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/TableActionsMenu.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/TableCard.test.tsx` | 11 |
| `frontend/src/pages/Pos/components/TableMergeDialog.test.tsx` | 7 |
| `frontend/src/pages/Pos/components/TableSelectionDialog.test.tsx` | 8 |
| `frontend/src/pages/Pos/components/TableShapeIcon.test.tsx` | 5 |
| `frontend/src/pages/Pos/components/TableTransferDialog.test.tsx` | 10 |
| `frontend/src/pages/Pos/components/TableUnmergeDialog.test.tsx` | 9 |
| `frontend/src/pages/Pos/lib/availability-api.test.ts` | 4 |
| `frontend/src/pages/Pos/lib/cart-capacity.test.ts` | 10 |
| `frontend/src/pages/Pos/lib/category-icons.test.ts` | 1 |
| `frontend/src/pages/Pos/lib/category-icons.test.tsx` | 15 |
| `frontend/src/pages/Pos/lib/customer-api.test.ts` | 11 |
| `frontend/src/pages/Pos/lib/pos-profile-api.test.ts` | 7 |
| `frontend/src/pages/Pos/lib/print.test.ts` | 5 |
| `frontend/src/pages/Pos/lib/table-utils.test.ts` | 19 |
| `frontend/src/pages/Pos/pages/Dashboard.test.tsx` | 2 |
| `frontend/src/pages/Pos/pages/OpenEntries.test.tsx` | 6 |
| `frontend/src/pages/Pos/pages/Orders.test.tsx` | 7 |
| `frontend/src/pages/Pos/pages/POS.test.tsx` | 8 |
| `frontend/src/pages/Pos/pages/Settings.test.tsx` | 7 |
| `frontend/src/pages/Pos/pages/Table.test.tsx` | 6 |
| `frontend/src/pages/Reports/AverageBillValue.test.tsx` | 5 |
| `frontend/src/pages/Reports/CancelledInvoices.test.tsx` | 5 |
| `frontend/src/pages/Reports/CompletedWorkOrders.test.tsx` | 4 |
| `frontend/src/pages/Reports/CustomerData.test.tsx` | 8 |
| `frontend/src/pages/Reports/DailyPnl.test.tsx` | 5 |
| `frontend/src/pages/Reports/DaywiseCustomerDetails.test.tsx` | 5 |
| `frontend/src/pages/Reports/DaywiseInvoices.test.tsx` | 5 |
| `frontend/src/pages/Reports/DaywiseSales.test.tsx` | 5 |
| `frontend/src/pages/Reports/EmployeeCommission.test.tsx` | 6 |
| `frontend/src/pages/Reports/EmployeeItemWiseSales.test.tsx` | 9 |
| `frontend/src/pages/Reports/EmployeeSales.test.tsx` | 5 |
| `frontend/src/pages/Reports/ItemWisePurchaseHistory.test.tsx` | 7 |
| `frontend/src/pages/Reports/ItemWiseSales.test.tsx` | 5 |
| `frontend/src/pages/Reports/MonthWiseSales.test.tsx` | 4 |
| `frontend/src/pages/Reports/RepeatedCustomers.test.tsx` | 4 |
| `frontend/src/pages/Reports/ReportsHome.test.tsx` | 2 |
| `frontend/src/pages/Reports/ReportsLayout.test.tsx` | 3 |
| `frontend/src/pages/Reports/ServiceWiseSales.test.tsx` | 5 |
| `frontend/src/pages/Reports/ShiftInvoices.test.tsx` | 10 |
| `frontend/src/pages/Reports/TimeWiseSales.test.tsx` | 5 |
| `frontend/src/pages/Reports/TodaysSales.test.tsx` | 5 |
| `frontend/src/pages/Setup/ConfigurePage.test.tsx` | 4 |
| `frontend/src/pages/Setup/SetupPage.test.tsx` | 5 |
| `frontend/src/services/deskLink.test.ts` | 13 |
| `frontend/src/services/linkSearch.test.ts` | 3 |
| `frontend/src/services/salesPlan.test.ts` | 15 |
| `frontend/src/utils/format.test.ts` | 3 |

<details>
<summary><code>frontend/src/components/AuthGuard.test.tsx</code> (5)</summary>

- **AuthGuard**
  - renders a spinner while auth is loading
  - renders Access Denied with the error message when the auth hook errors
  - renders a generic login prompt when there is no user and no error
  - renders Permission Required when logged in but not a manager
  - renders children when the user is loaded, no error, and is a manager

</details>

<details>
<summary><code>frontend/src/components/RoleGuard.test.tsx</code> (7)</summary>

- **RoleGuard**
  - renders a spinner before the role check resolves
  - denies access when there is no logged-in user
  - grants access when the roles response contains a plain-string "URY Manager" role
  - grants access when a role entry is an object with name "URY Manager"
  - denies access when the user has roles but none is URY Manager
  - denies access when roles is missing from the response entirely
  - denies access and logs an error when the role check rejects

</details>

<details>
<summary><code>frontend/src/components/setup/ProgressModal.test.tsx</code> (5)</summary>

- **ProgressModal HTTP fallback**
  - reports a background setup failure that only the poll sees
  - completes from the poll when no setup_task event arrives
  - acts on the terminal status once even if the poll repeats it
  - keeps waiting when the poll itself fails
  - does not poll when no poller is supplied

</details>

<details>
<summary><code>frontend/src/context/BranchContext.test.tsx</code> (6)</summary>

- **resolveActiveBranchId**
  - keeps a stored branch that still exists
  - selects the first branch when nothing is stored
  - selects the only branch instead of All Branches
  - keeps All Branches when multiple branches exist
  - falls back to the first branch when the stored id is stale
  - returns all when there are no branches

</details>

<details>
<summary><code>frontend/src/i18n/i18n.test.tsx</code> (9)</summary>

- **management and embedded POS language**
  - uses the saved choice ahead of the Frappe language in both apps
  - normalizes Russian Frappe locales and falls back to English
  - offers English and Russian with the selected language announced
  - loads Russian before an asynchronous layout effect and interpolates values
  - falls back to the English text for a missing Russian key
- **Russian catalog**
  - covers every embedded POS key and preserves interpolation parameters
  - translates native-dialog copy and preserves unknown user content
  - translates singular and plural upload messages with filenames intact
  - translates newly rendered UI, attributes and dynamic messages without changing form values

</details>

<details>
<summary><code>frontend/src/lib/currency.test.tsx</code> (6)</summary>

- **server-backed currency formatting**
  - works on a fresh browser and survives clearing browser storage
  - tracks server country/currency changes instead of a stale symbol
  - uses profile currency even if its Currency lookup has no symbol
  - resolves guest boot with no Currency documents
  - does not invent a currency before setup
  - renders the Daily P&L currency symbol dynamically

</details>

<details>
<summary><code>frontend/src/lib/dashboardStatsKpis.test.ts</code> (4)</summary>

- **buildDashboardStatsKpiItems**
  - maps live dashboard stats into the shared KPI strip
  - flags near-full floors with a warning tone
  - returns placeholders while loading
- **summaryToDashboardStats**
  - maps management summary fields onto the shared stats shape

</details>

<details>
<summary><code>frontend/src/lib/profitabilityReasons.test.ts</code> (3)</summary>

- **describeProfitabilityReason**
  - translates every documented reason code to a human sentence
  - falls back to the raw code for one not in the map
  - returns an empty string for no reason

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/AggregatorPage.test.tsx</code> (3)</summary>

- **AggregatorPage**
  - shows empty state when no aggregators exist
  - renders component without crashing
  - displays branch information when available

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/AiAssistantSettingsPage.test.tsx</code> (4)</summary>

- **AiAssistantSettingsPage**
  - renders AI Assistant Settings page
  - loads AI settings on mount
  - renders enable toggle and configuration section
  - shows Save Configuration button

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/AnalyticsCharts.test.tsx</code> (3)</summary>

- **AnalyticsCharts**
  - renders without crashing
  - renders analytics charts component
  - displays loading state when loading

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/BranchPage.test.tsx</code> (4)</summary>

- **BranchPage**
  - shows page with buttons
  - renders a list of branches
  - displays branch location information
  - displays branch fiscal identification headers and values in table list

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/CommissionSettingsPage.test.tsx</code> (4)</summary>

- **CommissionSettingsPage**
  - renders page
  - loads settings
  - renders spinners and sections
  - has form elements

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/DashboardPage.test.tsx</code> (4)</summary>

- **DashboardPage**
  - renders the page with KPI grid and report widgets
  - loads summary data on mount
  - loads recent transactions data on mount
  - handles errors gracefully when loading data fails

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/DayClosePage.test.tsx</code> (2)</summary>

- **DayClosePage**
  - renders without crashing
  - renders main content area

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/DepartmentProfitabilityPage.test.tsx</code> (9)</summary>

- **DepartmentProfitabilityPage**
  - renders a loading state before roles resolve
  - renders an empty state when there are no rows
  - renders a populated state with cost columns for an authorized role
  - hides cost/profit columns entirely for a quantity-only role (Chef)
  - translates the report-level reason code instead of showing it raw
  - shows a translated per-row Reason column when a row carries one
  - omits the Reason column entirely when no row carries one
  - falls back to the raw code for a reason not in the translation map
  - denies access outright for Cashier/Captain roles without calling the backend

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/DepartmentStockPage.test.tsx</code> (7)</summary>

- **DepartmentStockPage**
  - denies access for a role outside the allowed set
  - shows a loading state while the role check resolves
  - renders a populated table of issue authorizations and stock movements once a department is chosen
  - shows empty states when no data is returned for the selected department
  - shows capture wastage and request authorization controls for a Production Manager
  - shows approve/reject controls for a Stock Manager and calls the service on click
  - submits a capture wastage form calling captureWastage with the expected params

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ItemProductionConfigPage.test.tsx</code> (5)</summary>

- **ItemProductionConfigPage**
  - renders Item Production Config page
  - loads module records on mount
  - renders Add button
  - displays configurations in table when available
  - opens drawer with autocomplete fields including BOM

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/KPIGrid.test.tsx</code> (7)</summary>

- **KPIGrid**
  - renders loading spinner when loading is true
  - renders KPI data when loading is false
  - displays formatted sales value from shared stats builder
  - displays order count
  - displays active tables as occupied / total
  - renders navigation links to POS and Mosaic
  - handles null summary gracefully

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/KotErrorLogPage.test.tsx</code> (4)</summary>

- **KotErrorLogPage**
  - renders page
  - loads profiles
  - calls service methods
  - has UI elements

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/MenuPage.test.tsx</code> (3)</summary>

- **MenuPage**
  - renders without errors
  - fetches menus on mount
  - renders all buttons on the page

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/MenuRoutingPage.test.tsx</code> (6)</summary>

- **MenuRoutingPage**
  - renders Menu Sellability page
  - resolves default company on mount
  - lists catalog items
  - checks availability for items
  - displays KPI strip with metrics
  - shows Unsellable items in Attention Feed

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/PaymentTerminalPage.test.tsx</code> (8)</summary>

- **PaymentTerminalPage**
  - renders payment terminals section
  - displays list of terminals
  - displays terminal status
  - loads transactions on mount
  - displays transactions list
  - shows loading state while fetching terminals
  - handles error when fetching terminals fails
  - displays different terminal statuses

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/PosProfilePage.test.tsx</code> (4)</summary>

- **PosProfilePage**
  - shows empty state when no profiles exist
  - renders a list of pos profiles
  - displays profile branch information
  - reflects the stored Allow Order Without Customer flag in edit mode

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ProductionDepartmentPage.test.tsx</code> (7)</summary>

- **ProductionDepartmentPage**
  - renders production department list
  - loads departments for the active branch
  - loads lookup data
  - displays departments in table
  - opens add department drawer
  - handles loading state
  - handles error when fetching fails

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ProductionUnitPage.test.tsx</code> (5)</summary>

- **ProductionUnitPage**
  - shows empty state when no production units exist
  - renders a table of production units
  - opens the add unit drawer when Add Production Unit is clicked
  - renders Add button for empty state
  - displays production units with branch information

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/QuickActions.test.tsx</code> (1)</summary>

- **QuickActions**
  - renders without errors

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ReportSettingsPage.test.tsx</code> (4)</summary>

- **ReportSettingsPage**
  - renders the page
  - renders business hours section
  - renders cost configuration section
  - displays page structure

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ReportWidgets.test.tsx</code> (5)</summary>

- **ReportWidgets**
  - renders the transactions table when data is loaded
  - shows loading spinner while loading
  - shows empty message when no transactions
  - displays transaction status badges
  - handles walk-in customers gracefully

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/RequirementsPage.test.tsx</code> (10)</summary>

- **RequirementsPage**
  - renders the requirements page
  - mocks department stock service
  - mocks sales plan service
  - department stock service is callable
  - sales plan service is callable
  - handles empty demand vector
  - **stock-on-hand is fetched for components, not finished goods**
    - requests the component item codes
    - renders the returned quantity instead of Not available
    - de-duplicates a component repeated across production units
  - **production target quantities are read-only**
    - renders the quantity as plain text, not an editable control

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/RoomPage.test.tsx</code> (3)</summary>

- **RoomPage**
  - renders page with buttons
  - renders a list of rooms
  - displays room branch information

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/SalesPlanPage.test.tsx</code> (33)</summary>

- **SalesPlanPage**
  - loads comparable history into an editable plan table
  - opens the history drill-down modal from the history insight
  - saves draft quantities in branch and date scoped browser storage
  - defaults the plan date from the local business date instead of UTC
  - adds a zero-history item via catalog search and renders it in its department table
  - closes the add-item popover on outside click and on Escape
  - collapses Needs Attention by default and expands as an accordion
  - toggles department group collapse/expand with correct aria attributes
  - shows a relative "Today" label paired with the absolute date and branch name
  - shows a relative "Tomorrow" label for the next day
  - shows a weekday+date label (no relative word) and a past-date warning for a date further out
  - truncates a department table past 10 rows and toggles show all/fewer
  - expands truncation and moves focus down when ArrowDown is pressed on the last visible row
  - shows department row count and an issue-count badge when it has blocked items
  - **lifecycle stepper summary**
    - shows the next action for a Draft plan
    - marks a manager-only next action with (manager)
    - hides Save Draft once the plan is past Draft -- items are editable only in Draft
    - hides Add item too once the plan is past Draft, same as Save Draft
    - starts a fresh Draft and explains why when the prior plan for this date was cancelled
    - shows Save Draft for a Draft plan
    - hides Return to Draft/Supersede-Cancel for a user without the URY Sales Plan Controller role
    - lets a URY Sales Plan Controller return a Proposed/Submitted plan to Draft with a reason
    - surfaces the real backend error as a toast on Return to Draft failure
    - refuses to dismiss the modal via Escape while a transition is still in flight
    - after Cancel, switches to a fresh Draft instead of leaving the cancelled plan on screen
    - shows the locked message with no Next for Locked for Production
    - shows no summary line when status is null
- **describeSalesPlanApiError**
  - surfaces the real backend validation message from _server_messages
  - gives a fixed, friendly message for a permission error rather than the raw exception text
  - falls back to a generic message when there is nothing usable on the error
  - falls back to the generic message instead of throwing on a malformed _server_messages payload
  - uses the caller-supplied fallback, not a fixed string, so Save Draft and Approve report failures distinctly
  - strips Frappe HTML tags from _server_messages so toasts show plain text

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/SelfOrderingProfilePage.test.tsx</code> (4)</summary>

- **SelfOrderingProfilePage**
  - shows empty state when no profiles exist
  - renders a table of profiles
  - displays profile branch information
  - shows profile status badge

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/ServicePage.test.tsx</code> (9)</summary>

- **ServicePage**
  - renders the service page
  - loads shift metrics on mount
  - loads needs attention feed
  - displays shift metrics and renders departments table
  - **department tiles show both revenue and genuine activity**
    - loads department activity once the branch company is resolved
    - renders the revenue table and the activity table as separate tiles
    - renders KOT and production activity for a department with no revenue rows
    - surfaces a revenue-table error instead of silently rendering it empty
    - surfaces an activity-table error instead of silently rendering it empty

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/StockReservationPage.test.tsx</code> (5)</summary>

- **StockReservationPage**
  - shows loading state while checking role
  - denies access for non-allowed roles
  - allows access for Production Manager role
  - allows access for Stock Manager role
  - denies access when not logged in

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/StoreIssuePage.test.tsx</code> (4)</summary>

- **StoreIssuePage**
  - renders Store Issue page
  - loads departments on mount
  - loads issue authorizations
  - renders page with filters

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/TableLayoutView.test.tsx</code> (11)</summary>

- **TableLayoutView**
  - renders table layout
  - displays all tables
  - shows edit button
  - shows zoom controls
  - displays zoom percentage
  - toggles edit mode
  - opens properties on click
  - renders empty layout
  - shows zoom out button
  - shows reset zoom button
  - shows all tables

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/TablePage.test.tsx</code> (3)</summary>

- **TablePage**
  - renders page and displays buttons
  - renders a list of tables
  - displays table room information

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/UserPage.test.tsx</code> (3)</summary>

- **UserPage**
  - shows page with buttons
  - displays user email and multiple role badges
  - renders multi-select role dropdown including URY Admin when opening Add User drawer

</details>

<details>
<summary><code>frontend/src/pages/Dashboard/WastagePage.test.tsx</code> (4)</summary>

- **WastagePage**
  - renders page
  - loads departments
  - loads wastage records
  - renders filter elements

</details>

<details>
<summary><code>frontend/src/pages/Pos/PosLayout.test.tsx</code> (5)</summary>

- **PosLayout**
  - renders the layout structure with all providers and chrome components
  - initializes i18n and app store on mount
  - renders with ScreenSizeProvider wrapper for responsive behavior
  - includes KotAlertListener for alerts outside guards
  - renders the outlet for child routes inside the layout

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainActionsMenu.test.tsx</code> (12)</summary>

- **CaptainActionsMenu**
  - returns null when no actions are enabled
  - renders menu trigger button when at least one action is enabled
  - opens and closes menu on button click
  - displays Reprint KOT option when showReprintKot is true
  - displays Transfer Table option when showTransferTable is true
  - displays Transfer Captain option when showTransferCaptain is true
  - displays Print Bill option when showPrintBill is true
  - calls onReprintKot when Reprint KOT is clicked
  - calls onTransferTable when Transfer Table is clicked
  - disables Reprint KOT button when isReprintingKot is true
  - disables Print Bill button when isPrintingBill is true
  - closes menu when an action is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainMenu.test.tsx</code> (5)</summary>

- **CaptainMenu**
  - renders menu with search and category filters
  - shows loading state when menuLoading is true
  - displays menu items in a grid
  - shows warning message when canAddItems is false
  - shows no items message when menu is empty

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainOrderLine.test.tsx</code> (14)</summary>

- **CaptainOrderLine**
  - renders a confirmed order line with quantity
  - renders a delta order line with plus sign
  - renders a reduction order line with minus sign
  - displays item comment when present
  - does not display comment when not present
  - shows increment and decrement buttons for delta variant
  - calls onIncrement when increment button is clicked
  - calls onDecrement when decrement button is clicked
  - shows reduce button for confirmed variant
  - shows remove button for confirmed variant
  - shows restore button for reduction variant
  - disables buttons when disabled prop is true
  - calls onEditNote when line content is clicked
  - displays correct currency format for price

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainRouteGuard.test.tsx</code> (4)</summary>

- **CaptainRouteGuard**
  - renders loading state while context is loading
  - renders error state when context loading fails
  - renders permission denied when user cannot take table orders
  - renders children and service panel when authorized

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainSplitOrderDialog.test.tsx</code> (12)</summary>

- **CaptainSplitOrderDialog**
  - does not render when open is false
  - renders items, and the split button is disabled with nothing selected
  - selecting an item enables the split button and updates the moving/staying totals
  - does not enable quantity adjusters for a qty=1 item, but does for qty>1
  - adjusting quantity down keeps the selection valid and recomputes totals
  - shows an error and does not call onConfirm when nothing valid is selected (moving Rs.0)
  - requires a customer when "same as original" is unchecked
  - calls onConfirm with itemsToMove and no customer when "same as original" stays checked
  - calls onConfirm with the picked customer id when a different customer is chosen
  - surfaces the thrown error message when onConfirm rejects, and keeps the dialog open
  - falls back to a generic error message when onConfirm rejects with a non-Error value
  - resets selection state and closes on cancel

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/CaptainTableCard.test.tsx</code> (11)</summary>

- **CaptainTableCard**
  - renders a free table card
  - renders a mine table card
  - renders owner name for other captain's table
  - shows billed/locked state with icon
  - displays merge partners when present
  - displays grand total when order is present
  - displays number of seats
  - shows elapsed time for occupied table
  - calls onTap when card is clicked
  - displays different colors for different ownership states
  - does not show owner name when ownership is mine

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/components/ServiceRequestPanel.test.tsx</code> (4)</summary>

- **ServiceRequestPanel**
  - returns null when branch is not provided
  - renders bell button when branch is provided
  - calls API to list requests on mount
  - renders component without crashing

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/hooks/useCaptainContext.test.ts</code> (7)</summary>

- **useCaptainContext**
  - starts in a loading state with no context/error
  - fetches on mount and exposes user/roles/branch/rooms/openingState from the response
  - builds the capability-profile shim: role-derived booleans become row arrays containing the user\
  - produces a null posProfile/capabilities but a non-null user when pos_profile is null
  - surfaces the error message and clears context on a rejected fetch
  - falls back to a generic error message when the rejection has no message
  - refetch() re-runs the fetch and can recover from a prior error

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/hooks/useTableOrderContext.test.ts</code> (8)</summary>

- **useTableOrderContext**
  - does nothing when table is undefined: no fetch, stays in initial loading state
  - fetches the table order context on mount and wires the table into pos-store when view is allowed
  - does not wire the table into pos-store when the permission context denies view
  - surfaces a fetch error and clears context, without touching pos-store
  - falls back to a generic error message when the rejection has no message
  - captures a baseline once orderLoading falls from true to false while view is allowed, then computes delta lines
  - refetchContext() re-runs the fetch without touching pos-store
  - clears the table order in pos-store on unmount / table change cleanup

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/lib/captain-table-api.test.ts</code> (8)</summary>

- **getActiveTableOrders**
  - queries active (docstatus=0) POS Invoices for the given branch with the expected fields
  - maps each row to its restaurant_table
  - also indexes merged-table partners under the same invoice info
  - skips indexing under restaurant_table when it is null (take-away/pickup invoices)
  - returns an empty map when no active invoices exist
- **getUserFullNames**
  - returns an empty map without calling the API when given no user names
  - filters out falsy entries and de-duplicates before querying
  - maps user name -> full_name, falling back to the user id when full_name is missing

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/pages/CaptainOrder.test.tsx</code> (6)</summary>

- **CaptainOrder**
  - renders the order page with menu initially for free table
  - shows loading state while context is loading
  - renders order view when table already has items
  - renders actions menu
  - renders without crashing on loading
  - denies access when view permission is false

</details>

<details>
<summary><code>frontend/src/pages/Pos/captain/pages/CaptainTables.test.tsx</code> (12)</summary>

- **CaptainTables**
  - shows loading state initially
  - shows error state when context loading fails
  - renders table grid after loading
  - displays room tabs
  - allows switching between room tabs
  - displays tables for selected room
  - shows no tables message when room is empty
  - shows no rooms message when branch has no rooms
  - loads active orders for branch
  - navigates to table when free table is tapped
  - shows refresh button
  - defaults to captain's assigned room if available

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/AggregatorSelect.test.tsx</code> (8)</summary>

- **AggregatorSelect**
  - renders select component
  - fetches aggregators on mount
  - displays aggregator options after fetching
  - handles fetch errors gracefully
  - disables select when disabled prop is true
  - displays multiple aggregators in options
  - renders without crashing
  - is enabled after loading completes

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/AppLayout.test.tsx</code> (4)</summary>

- **AppLayout**
  - renders layout component
  - has h-screen class
  - has bg-background class
  - renders header and footer mocks

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/AuthGuard.test.tsx</code> (2)</summary>

- **AuthGuard**
  - renders children when user has access
  - renders without error

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/BillMergeDialog.test.tsx</code> (4)</summary>

- **BillMergeDialog**
  - does not render when open is false
  - renders dialog when open is true
  - displays no candidates message when list is empty
  - disables merge button when no candidate is selected

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/BillSplitDialog.test.tsx</code> (10)</summary>

- **BillSplitDialog**
  - does not render when open is false
  - renders dialog when open is true
  - displays all items in the list
  - allows selecting items
  - displays totals that update when items are selected
  - shows customer picker checkbox
  - disables split button when nothing is selected
  - handles split confirmation
  - allows quantity adjustment for multi-quantity items
  - closes dialog on cancel

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/CaptainTransferDialog.test.tsx</code> (3)</summary>

- **CaptainTransferDialog**
  - does not render when open is false
  - renders dialog when open is true
  - displays current captain value

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/ChecklistGateDialog.test.tsx</code> (11)</summary>

- **ChecklistGateDialog**
  - loads and displays checklist items
  - marks mandatory items with asterisk
  - disables submit button until every mandatory item has a result
  - enables submit button when mandatory items are answered
  - submits explicit PASS statuses and calls onComplete
  - blocks submission when FAIL has no remarks
  - allows submission when FAIL carries a remark
  - prefills a previously saved FAIL result and remarks on reopen
  - handles empty checklists by auto-submitting
  - shows the blocking role message when a predecessor checklist is unfinished
  - displays title based on checklist type

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/ClosingPaymentTable.test.tsx</code> (5)</summary>

- **ClosingPaymentTable**
  - renders payment modes in the table
  - renders table with payment rows
  - calls onChange when closing amount input changes
  - renders empty table when no rows provided
  - accepts numeric input in closing amount field

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/CommentDialog.test.tsx</code> (7)</summary>

- **CommentDialog**
  - does not render when isOpen is false
  - renders the dialog when isOpen is true
  - displays the initial comment in the textarea
  - updates the comment value on input change
  - calls onSave and onClose when save button is clicked
  - resets the comment to initial value and calls onClose when cancel is clicked
  - calls onClose when X button is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/CustomerPicker.test.tsx</code> (8)</summary>

- **CustomerPicker**
  - renders search input when no customer selected
  - displays selected customer info
  - calls onChange with null when change button clicked
  - searches customers when input changes
  - shows latest customers on focus before typing
  - disables input when disabled prop is true
  - handles search errors gracefully
  - calls onChange when customer selected

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/CustomerSelect.test.tsx</code> (6)</summary>

- **CustomerSelect**
  - renders CustomerPicker for non-aggregator order types
  - renders AggregatorSelect for aggregator order type
  - passes disabled prop to CustomerPicker
  - disables CustomerPicker when isUpdatingOrder is true
  - marks the picker optional when the POS Profile allows orders without a customer
  - keeps the picker required when the POS Profile flag is off

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/Footer.test.tsx</code> (4)</summary>

- **Footer**
  - renders navigation with all required items
  - renders navigation links with correct paths
  - renders as a nav element
  - shows visual indicator for active route

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/Header.test.tsx</code> (3)</summary>

- **Header**
  - renders header element
  - has background styling
  - renders content

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/InitialLoader.test.tsx</code> (5)</summary>

- **InitialLoader**
  - renders with correct text content
  - has fixed fullscreen positioning
  - centers content
  - displays all text in centered layout
  - renders successfully without errors

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/KotAlertListener.test.tsx</code> (8)</summary>

- **KotAlertListener**
  - renders without crashing
  - returns null (headless component)
  - loads production units on mount
  - subscribes to KOT error channels with production units
  - handles empty production units list
  - handles error when fetching production units
  - handles KOT error payload with message
  - shows unknown error message when payload has no message

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/LayoutView.test.tsx</code> (12)</summary>

- **LayoutView**
  - renders layout view header
  - renders grid view button
  - calls onBackToGrid when grid view button is clicked
  - renders edit layout button
  - renders zoom controls
  - renders all tables as elements
  - shows zoom percentage
  - toggles edit mode when edit button is clicked
  - selects table when clicked
  - shows table info panel when table is selected
  - shows status in table info panel
  - closes table info panel when close button is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/MenuCard.test.tsx</code> (2)</summary>

- **MenuCard availability gating**
  - stays clickable and shows no badge for a sellable item
  - disables the card and shows the reason message for a PLAN_EXHAUSTED item

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/MenuList.test.tsx</code> (9)</summary>

- **MenuList**
  - calls fetchMenuItems on mount
  - displays loading state when menuLoading is true
  - displays error state when error exists
  - displays no items message when filtered items are empty
  - displays menu items when available
  - filters by category
  - calls onItemClick when card is clicked
  - disables interaction when isMenuInteractionDisabled returns true
  - renders in-stock items before sold out and temporarily unavailable items

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/MergeLinkConnector.test.tsx</code> (3)</summary>

- **MergeLinkConnector**
  - renders with correct aria-label and title
  - renders the Link2 icon
  - has correct styling classes

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/MergedBillPanel.test.tsx</code> (9)</summary>

- **MergedBillPanel**
  - returns null when no merged invoice
  - renders panel when merged invoice is present
  - displays merged invoice name
  - displays merged total in formatted currency
  - displays combined total
  - displays loading state while fetching items
  - displays merged items when items are fetched
  - calls onOpenSecondary when button is clicked
  - cancels fetch when component unmounts

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/OrderActionsMenu.test.tsx</code> (9)</summary>

- **OrderActionsMenu**
  - renders nothing when both showSplitBill and showMergeBill are false
  - renders menu button when showMergeBill is true
  - toggles menu open state on button click
  - displays menu items when isOpen is true
  - calls onMergeBill when merge bill is clicked
  - calls onSplitBill when split bill is clicked
  - closes menu after action button click
  - closes menu on outside click
  - has aria-expanded attribute set correctly

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/OrderPanel.test.tsx</code> (18)</summary>

- **OrderPanel**
  - renders the order panel
  - displays the total price of all items
  - shows the server-quoted dine-in service charge and inclusive total
  - quotes the service-inclusive total and submits when performer selection is disabled
  - prompts for the required performer without making failing quote requests
  - does not request or show service charge for takeaway
  - never presents the meal subtotal as payable while quoting or after a failure, and can retry
  - invalidates the previous total immediately when quantities change
  - shows empty cart message when no items
  - displays loading state when orderLoading is true
  - renders order items with quantity and total
  - increments pax count on plus button click
  - shows add new order button in initial state
  - handles validation for no customer selected
  - handles validation for no table selected for dine-in
  - shows comment button
  - blocks submit without a customer when the POS Profile requires one
  - submits an empty customer so the backend resolves the POS Profile default

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/OrderStatusSidebar.test.tsx</code> (6)</summary>

- **OrderStatusSidebar**
  - renders with correct structure
  - renders sidebar container with bg-card class
  - renders buttons for each status type
  - calls setSelectedStatus when a status button is clicked
  - disables sidebar with opacity-50 when disabled prop is true
  - prevents interaction when disabled prop is true

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/OrderTypeSelect.test.tsx</code> (5)</summary>

- **OrderTypeSelect**
  - renders order type buttons
  - renders without crashing when not disabled
  - calls setSelectedOrderType when a button is clicked
  - shows opacity-50 class when disabled prop is true
  - shows correct number of order types

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/POSCloseFlow.test.tsx</code> (10)</summary>

- **POSCloseFlow**
  - renders close pos card with button
  - opens confirmation dialog when close button is clicked
  - closes confirmation dialog when cancel is clicked
  - opens POSClosingDialog when confirm is clicked
  - shows success message after closing is submitted
  - shows back to dashboard button after closing is submitted
- **POSCloseFlow shift report reprint**
  - offers to print the shift report again after closing
  - has no print button after a Sub POS Closing
  - tells the cashier when the browser blocks the print window
  - reports a missing shift report without trying to print

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/POSClosingDialog.test.tsx</code> (13)</summary>

- **POSClosingDialog**
  - renders dialog
  - shows loading state
  - loads and displays totals
  - renders action buttons
  - closes when cancel is clicked
  - gates closing submission on a pending Closing checklist before creating the doc
- **POSClosingDialog shift report printing**
  - prints the report once after a successful main closing
  - hands the closing to the parent once the checklist is done
  - explains a blocked print pop-up and prints on retry
  - does not print when auto print is off
  - keeps the closing and offers a retry when the printer fails
  - can continue without the printout
  - never prints a shift report for a Sub POS Closing

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/POSOpeningDialog.test.tsx</code> (7)</summary>

- **POSOpeningDialog**
  - renders the opening dialog with refresh icon for opening type
  - renders the closing dialog with alert icon for closing type
  - renders the reload button with text for opening type
  - calls onReload when the reload button is clicked
  - displays recovery guidance text
  - renders with destructive-tint background for opening issue
  - renders with warning-tint background for closing issue

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/POSOpeningEntryDialog.test.tsx</code> (5)</summary>

- **POSOpeningEntryDialog**
  - does not render when open is false
  - renders dialog when open is true
  - loads payment modes when dialog opens
  - shows cancel button
  - calls onOpenChange when dialog state changes

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/POSOpeningProvider.test.tsx</code> (10)</summary>

- **POSOpeningProvider**
  - renders children when POS is opened and validated
  - shows opening entry dialog when POS is not opened
  - shows opening entry dialog when check_opening_entry returns an empty list (ERPNext v16)
  - gates the opening entry dialog on a pending Opening checklist (POS not opened)
  - gates on a pending Opening checklist when check_opening_entry returns [] (ERPNext v16)
  - shows loading state while checking POS status
  - shows checklist gate dialog when checklist is incomplete
  - validates POS close when custom_daily_pos_close is enabled
  - handles API errors gracefully
  - shows loading state when posProfile exists

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/PaymentDialog.test.tsx</code> (6)</summary>

- **PaymentDialog**
  - shows the policy and service charge returned by the server
  - renders payment dialog
  - displays grand total
  - initializes with proper structure
  - renders with correct props
  - passes callback functions correctly

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/PerformerSelect.test.tsx</code> (6)</summary>

- **PerformerSelect**
  - renders nothing when the profile has the feature off
  - renders nothing when the user lacks a permitted role
  - lists eligible employees for a permitted user
  - offers a blank option only when a performer is not required
  - omits the blank option when the profile requires a performer
  - shows no options when the lookup fails

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/ProductDialog.test.tsx</code> (5)</summary>

- **ProductDialog**
  - renders product dialog
  - displays product name and code
  - renders quantity input field
  - has add to order button
  - closes dialog when close button is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/ScreenSizeDialog.test.tsx</code> (7)</summary>

- **ScreenSizeDialog**
  - renders with correct title
  - displays messaging about desktop requirement
  - shows current screen info
  - has Switch to Version 1 button and opens URL on click
  - has fixed overlay styling
  - renders icons for mobile and desktop
  - displays content in centered card layout

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/ScreenSizeProvider.test.tsx</code> (4)</summary>

- **ScreenSizeProvider**
  - renders children when screen width is >= 1024px
  - shows ScreenSizeDialog when screen width is < 1024px
  - exempts Captain routes from size check
  - cleans up resize listener on unmount

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/SearchBar.test.tsx</code> (8)</summary>

- **SearchBar**
  - shows the search button when not visible
  - hides the search button when visible
  - shows the input field when visible
  - displays the current value in the input field
  - calls onChange when text is typed in the input
  - clears the input value and hides when X button is clicked
  - disables input and buttons when disabled prop is true
  - calls onVisibilityChange when search button is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/Sidebar.test.tsx</code> (6)</summary>

- **Sidebar**
  - renders sidebar container
  - renders sidebar with correct styling
  - renders category buttons
  - calls setSelectedCategory when category button is clicked
  - disables sidebar when disabled prop is true
  - applies pointer-events-none when disabled

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/SplitGroupPanel.test.tsx</code> (8)</summary>

- **SplitGroupPanel**
  - returns null when there are less than 2 invoices
  - displays related invoices when 2 or more exist
  - marks the current invoice
  - calls onOpenInvoice when another invoice is clicked
  - navigates to previous invoice with prev button
  - navigates to next invoice with next button
  - shows loading state initially
  - shows paid badge for paid invoices

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/Spotlight.test.tsx</code> (10)</summary>

- **Spotlight**
  - does not show dialog on mount
  - opens dialog when Cmd+K is pressed
  - opens dialog when Ctrl+K is pressed
  - closes dialog when Escape is pressed
  - renders menu items
  - filters items by name
  - filters items by category
  - displays item price
  - shows no items message when search returns no results
  - closes dialog after selecting item

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableActionsMenu.test.tsx</code> (10)</summary>

- **TableActionsMenu**
  - renders the menu button
  - shows merge option for available table
  - shows merge option for occupied table
  - shows transfer table option for occupied table
  - calls onMerge when merge button is clicked
  - calls onOpenChange when menu button is clicked
  - hides menu when open prop is false
  - shows transfer captain option when enabled
  - does not render when no available actions
  - closes menu after action is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableCard.test.tsx</code> (11)</summary>

- **TableCard**
  - renders table name
  - renders available badge for free table
  - renders occupied badge for occupied table
  - renders room information
  - renders seat count
  - renders preview and print buttons for occupied tables
  - does not render preview/print buttons for free tables
  - calls onNavigate when clicking free table
  - calls onPreview when clicking preview button
  - calls onPrint when clicking print button
  - disables print button when printing

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableMergeDialog.test.tsx</code> (7)</summary>

- **TableMergeDialog**
  - returns null when sourceTable is null
  - renders dialog when open and sourceTable exists
  - displays available tables for merging
  - disables merge button when no tables selected
  - calls onConfirm when merge button clicked with selection
  - shows merge button text
  - shows cancel button

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableSelectionDialog.test.tsx</code> (8)</summary>

- **TableSelectionDialog**
  - renders dialog with title
  - loads and renders rooms on mount
  - loads and renders tables when room is selected
  - shows occupied badge for occupied tables
  - calls onClose when table is clicked
  - switches between rooms when room button is clicked
  - shows loading state while fetching data
  - renders close button

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableShapeIcon.test.tsx</code> (5)</summary>

- **TableShapeIcon**
  - renders a rectangle icon by default
  - renders a circle icon when shape is Circle
  - renders a square icon when shape is Square
  - applies the provided className
  - falls back to rectangle icon for unknown shape

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableTransferDialog.test.tsx</code> (10)</summary>

- **TableTransferDialog**
  - does not render when open is false
  - renders the dialog when open is true
  - displays the source table name
  - displays available destination tables grouped by room
  - allows selecting a destination table
  - filters tables by search text
  - calls onConfirm when transfer is confirmed
  - shows loading state when loading prop is true
  - shows error message on confirmation failure
  - calls onOpenChange with false when cancel is clicked

</details>

<details>
<summary><code>frontend/src/pages/Pos/components/TableUnmergeDialog.test.tsx</code> (9)</summary>

- **TableUnmergeDialog**
  - renders nothing when sourceTable is null
  - renders dialog title and description
  - renders cancel and unmerge buttons
  - closes dialog when cancel button is clicked
  - calls onConfirm when unmerge button is clicked
  - closes dialog after successful unmerge
  - shows loading state while confirming
  - disables buttons while submitting
  - includes group members in description

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/availability-api.test.ts</code> (4)</summary>

- **availability-api (pos)**
  - fetches availability and passes the server response through verbatim
  - maps every documented reason_code to a user-facing message
  - caches per (item_code, branch, company) key and does not leak across keys
  - skipCache always re-calls the live endpoint, bypassing any cached display value

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/cart-capacity.test.ts</code> (10)</summary>

- **cartQtyForItem**
  - sums quantity only across lines matching the given item_code
  - returns 0 for an empty cart
- **remainingHeadroom**
  - returns undefined ("do not gate") when availability is unknown
  - subtracts the current cart qty from available_qty
  - can go negative when the cart already exceeds known availability (does not clamp)
- **useCartAvailability**
  - does not fetch when branch or company is missing
  - does not fetch when itemCodes is empty
  - fetches availability once per distinct item_code, deduping repeats
  - fails open: a rejected lookup for one item is omitted, not surfaced as an error, and other items still resolve
  - resets to empty and does not re-fetch stale results when the item set changes to empty

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/category-icons.test.ts</code> (1)</summary>

- **fuzzyMatchIcon**
  - should map "${input}" to "${expected}"

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/category-icons.test.tsx</code> (15)</summary>

- **category-icons**
  - **fuzzyMatchIcon**
    - returns undefined for empty or missing courseName
    - matches ice cream variants
    - matches pizza variants
    - matches burger variants
    - matches drink categories
    - matches protein categories
    - matches dish types
    - prioritizes more specific matches
    - handles compound dish names
  - **CategoryIcon component**
    - renders an icon component
    - uses provided name for icon lookup
    - falls back to courseName fuzzy matching
    - applies custom className
    - renders UtensilsCrossed as fallback when icon not found
    - updates icon when name prop changes

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/customer-api.test.ts</code> (11)</summary>

- **getCustomerGroups**
  - queries Customer Group ordered by name ascending
- **getCustomerTerritories**
  - queries Territory ordered by name ascending
- **addCustomer**
  - posts to create_customer and returns the created customer data on success
  - throws and logs when the response message is missing
  - throws when the response status is not "success"
  - re-throws (and logs) when the underlying call rejects
- **searchCustomers**
  - returns latest customers without filters when the search string is blank/whitespace
  - builds a scramble-match "like" pattern across name/customer_name/mobile_number
  - defaults limit to 10 when not provided
  - annotates each result with a human-readable content summary, defaulting missing fields to blank
  - logs and re-throws when the underlying query rejects

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/pos-profile-api.test.ts</code> (7)</summary>

- **getPosProfileLimitedFields**
  - calls getPosProfile and unwraps the message envelope
- **getPosProfileFull**
  - fetches the POS Profile doctype by name
- **getCurrencyInfo**
  - fetches the Currency doctype by code
- **getCombinedPosProfile**
  - fetches the limited profile first, then the full profile by the limited profile\
  - merges the full profile with the limited-only fields, with limited fields taking precedence on overlap
  - propagates a rejection from the limited-profile fetch without calling getDoc
  - propagates a rejection from the full-profile fetch

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/print.test.ts</code> (5)</summary>

- **printShiftReport**
  - opens the shift report print view in a new tab
  - reports a blocked pop-up instead of claiming success
  - prints over QZ with the shift report format
  - fails clearly when QZ printing has no host
  - prints over the network printer on the server

</details>

<details>
<summary><code>frontend/src/pages/Pos/lib/table-utils.test.ts</code> (19)</summary>

- **parseMergedWith**
  - returns [] for null/undefined/empty input
  - splits a comma-separated list and trims whitespace
  - filters out empty segments from trailing/double commas
- **isMergedTable**
  - is false when merged_with is empty/null
  - is true when merged_with names at least one partner
- **getMergeGroupMembers**
  - returns just the table itself when it has no merge partners
  - returns all directly merged partners, sorted
  - transitively follows the merge chain (A-B-C all in one group)
  - ignores a merge_with reference to a table not present in allTables
- **formatMergedTableLabel**
  - returns an empty string when primary is falsy
  - returns just the primary name when there are no merged partners
  - joins primary + sorted partners with " + "
- **formatMergedTableLabelFromGroup**
  - returns an empty string for an empty group
  - sorts and joins all members with " + ", regardless of input order
- **getTableRenderGroups**
  - returns an empty array for an empty table list
  - puts each unmerged table in its own singleton group
  - groups merged tables together as one cluster, sorted by name
  - orders clusters by their first (sorted) member name
- **sortTablesByMergeGroups**
  - flattens render groups back into a single ordered list

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/Dashboard.test.tsx</code> (2)</summary>

- **POS Dashboard branch status**
  - renders the backend-derived branch phase, health, blockers, and progress
  - shows a clear unavailable state when branch status cannot load

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/OpenEntries.test.tsx</code> (6)</summary>

- **OpenEntries**
  - renders the page with title
  - shows loading state initially
  - displays entries in a table when data loads
  - displays no entries message when list is empty
  - displays error message on fetch failure
  - formats date correctly

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/Orders.test.tsx</code> (7)</summary>

- **Orders**
  - renders without crashing
  - renders page structure
  - renders as a React component
  - renders flex layout
  - renders with overflow hidden
  - renders multiple sections
  - renders main content area

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/POS.test.tsx</code> (8)</summary>

- **POS**
  - renders the POS page layout
  - shows loading spinner when loading is true
  - handles item click for adding to order
  - renders quick filter buttons
  - renders product dialog when opened
  - applies disabled state to components when menu interaction is disabled
  - shows error state when error occurs
  - shows initializing loader

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/Settings.test.tsx</code> (7)</summary>

- **Settings**
  - renders the settings page
  - displays the settings title
  - displays the end of day section heading
  - renders POSCloseFlow component
  - displays coming soon message
  - has proper layout structure
  - contains a card component

</details>

<details>
<summary><code>frontend/src/pages/Pos/pages/Table.test.tsx</code> (6)</summary>

- **TableView**
  - renders without crashing
  - renders page structure
  - renders as a React component
  - renders flex container
  - renders with h-full layout
  - renders multiple child components

</details>

<details>
<summary><code>frontend/src/pages/Reports/AverageBillValue.test.tsx</code> (5)</summary>

- **AverageBillValue**
  - renders page title
  - shows loading state
  - displays ABV trend data
  - handles errors
  - renders without crashing on empty data

</details>

<details>
<summary><code>frontend/src/pages/Reports/CancelledInvoices.test.tsx</code> (5)</summary>

- **CancelledInvoices**
  - renders header
  - displays invoice KPI
  - displays cancelled invoices table
  - handles pagination
  - navigates to next page

</details>

<details>
<summary><code>frontend/src/pages/Reports/CompletedWorkOrders.test.tsx</code> (4)</summary>

- **CompletedWorkOrders**
  - renders header
  - displays summary
  - displays work orders table
  - shows empty message

</details>

<details>
<summary><code>frontend/src/pages/Reports/CustomerData.test.tsx</code> (8)</summary>

- **CustomerData**
  - renders header
  - shows suggestions
  - fetches customer data
  - displays KPI
  - clears data on search change
  - **default customer listing**
    - renders every customer who visited in range instead of an empty prompt
    - selects a customer from the listing and loads their history
    - surfaces a listing error instead of silently rendering an empty table

</details>

<details>
<summary><code>frontend/src/pages/Reports/DailyPnl.test.tsx</code> (5)</summary>

- **DailyPnl**
  - renders page title
  - shows loading state
  - displays P&L summary when exists
  - handles errors
  - renders without crashing when P&L does not exist

</details>

<details>
<summary><code>frontend/src/pages/Reports/DaywiseCustomerDetails.test.tsx</code> (5)</summary>

- **DaywiseCustomerDetails**
  - renders header
  - displays customer KPI
  - displays customers table
  - disables export when no data
  - enables export when data available

</details>

<details>
<summary><code>frontend/src/pages/Reports/DaywiseInvoices.test.tsx</code> (5)</summary>

- **DaywiseInvoices**
  - renders page title
  - shows loading state initially
  - displays invoice data when loaded
  - handles API errors gracefully
  - renders without crashing when data is empty

</details>

<details>
<summary><code>frontend/src/pages/Reports/DaywiseSales.test.tsx</code> (5)</summary>

- **DaywiseSales**
  - renders page title
  - shows loading state
  - displays daily sales trend
  - handles errors
  - renders without crashing on empty rows

</details>

<details>
<summary><code>frontend/src/pages/Reports/EmployeeCommission.test.tsx</code> (6)</summary>

- **EmployeeCommission**
  - renders header
  - shows disabled state when commission disabled
  - displays employee commission data
  - shows KPI strip
  - expands an employee into period and invoice breakdowns
  - shows unattributed warning

</details>

<details>
<summary><code>frontend/src/pages/Reports/EmployeeItemWiseSales.test.tsx</code> (9)</summary>

- **EmployeeItemWiseSales**
  - renders page title
  - shows loading state when fetching
  - displays employee search box
  - displays items sold when employee data loads
  - renders without crashing on empty items
  - **default employee listing**
    - renders the sales leaderboard instead of an empty prompt
    - does not list every User account -- only who actually appears in get_employee_sales
    - selects an employee from the listing and loads their item breakdown
    - surfaces a listing error instead of silently rendering an empty table

</details>

<details>
<summary><code>frontend/src/pages/Reports/EmployeeSales.test.tsx</code> (5)</summary>

- **EmployeeSales**
  - renders page title
  - shows loading state
  - displays employee leaderboard
  - handles API errors
  - renders without crashing on empty employees

</details>

<details>
<summary><code>frontend/src/pages/Reports/ItemWisePurchaseHistory.test.tsx</code> (7)</summary>

- **ItemWisePurchaseHistory**
  - renders page title
  - shows loading state
  - displays purchased items
  - handles errors
  - renders without crashing on empty items
  - never sends a branch argument
  - labels the report company-wide

</details>

<details>
<summary><code>frontend/src/pages/Reports/ItemWiseSales.test.tsx</code> (5)</summary>

- **ItemWiseSales**
  - renders header
  - displays KPI summary
  - displays items table
  - filters by search
  - handles pagination

</details>

<details>
<summary><code>frontend/src/pages/Reports/MonthWiseSales.test.tsx</code> (4)</summary>

- **MonthWiseSales**
  - renders header
  - displays KPI strip
  - displays month data table
  - changes month range on select change

</details>

<details>
<summary><code>frontend/src/pages/Reports/RepeatedCustomers.test.tsx</code> (4)</summary>

- **RepeatedCustomers**
  - renders header
  - displays summary KPI
  - displays data table with records
  - shows data when available

</details>

<details>
<summary><code>frontend/src/pages/Reports/ReportsHome.test.tsx</code> (2)</summary>

- **ReportsHome**
  - renders navigation component
  - renders fallback message when no first report

</details>

<details>
<summary><code>frontend/src/pages/Reports/ReportsLayout.test.tsx</code> (3)</summary>

- **ReportsLayout**
  - renders outlet
  - sets active report on mount
  - clears active report on unmount

</details>

<details>
<summary><code>frontend/src/pages/Reports/ServiceWiseSales.test.tsx</code> (5)</summary>

- **ServiceWiseSales**
  - renders page title
  - shows loading state
  - displays service types when data loads
  - handles API errors
  - renders without crashing on empty data

</details>

<details>
<summary><code>frontend/src/pages/Reports/ShiftInvoices.test.tsx</code> (10)</summary>

- **ShiftInvoices**
  - renders page title
  - shows loading state initially
  - loads the newest shift by default and renders invoice columns
  - warns when the shift is still open
  - shows an empty state when there are no shifts in the period
  - switches to period mode with pagination
  - handles API errors gracefully
- **formatShiftLabel**
  - shows only the end time for a same-day shift
  - shows the end date for a shift that crosses midnight, and the branch when asked
  - marks an open shift

</details>

<details>
<summary><code>frontend/src/pages/Reports/TimeWiseSales.test.tsx</code> (5)</summary>

- **TimeWiseSales**
  - renders page title
  - shows loading state
  - displays time intervals when data loads
  - handles errors on API failure
  - renders without crashing on empty data

</details>

<details>
<summary><code>frontend/src/pages/Reports/TodaysSales.test.tsx</code> (5)</summary>

- **TodaysSales**
  - renders page title
  - shows loading state
  - displays todays sales data when loaded
  - handles API errors gracefully
  - renders without crashing on empty data

</details>

<details>
<summary><code>frontend/src/pages/Setup/ConfigurePage.test.tsx</code> (4)</summary>

- **ConfigurePage**
  - renders without crashing
  - renders with provider
  - renders page structure
  - renders the page

</details>

<details>
<summary><code>frontend/src/pages/Setup/SetupPage.test.tsx</code> (5)</summary>

- **SetupPage**
  - renders the setup wizard step 1
  - loads setup defaults on mount
  - renders form fields for company setup
  - has a Continue button for proceeding with setup
  - displays installation type options

</details>

<details>
<summary><code>frontend/src/services/deskLink.test.ts</code> (13)</summary>

- **deskLink helpers**
  - buildDeskUrl slugifies the doctype
  - buildDeskUrl URL-encodes the docname (with spaces and slashes)
  - buildDeskUrl with null docname gives the list route without trailing slash
  - buildDeskUrl without docname gives the list route without trailing slash
  - buildDeskUrl with explicit returnTo includes encoded params
  - withReturnContext appends params with ? when path has no query string
  - withReturnContext appends params with & when path has existing query string
  - isReturnPathAllowed allows valid paths
  - isReturnPathAllowed rejects invalid paths
  - appLabelForPath returns correct labels for paths
  - getCurrentReturnContext returns null when pathname is not an app path
  - getCurrentReturnContext returns the path with query string and correct label
  - getCurrentReturnContext restores properly after test

</details>

<details>
<summary><code>frontend/src/services/linkSearch.test.ts</code> (3)</summary>

- **linkSearch**
  - searches with like or_filters and maps labels
  - omits or_filters when query is empty
  - withSelectedOption prepends missing committed value

</details>

<details>
<summary><code>frontend/src/services/salesPlan.test.ts</code> (15)</summary>

- **salesPlan service helpers**
  - normalizes the accepted V3-21 history response shape
  - uses saved draft quantities before rounded comparable averages
  - stores numeric draft quantities under branch and date scope
  - requires branch, company, and date before building a draft key
- **addManualItemToDraft**
  - adds a new item from search result with proper defaults
  - uses default values when search result has missing fields
  - uses item_code as item_name fallback when item_name is missing
  - prevents duplicate items by item_code
  - appends new item without mutating original array
- **mergeSavedPlanRows**
  - returns the original list untouched when the plan has no rows
  - takes the plan's quantity for an item history already knows
  - appends a planned item that has no comparable history at all
  - renders a whole plan whose branch has an empty history window
  - ignores a row with no item_code
  - keeps the existing quantity when the plan row carries no usable qty

</details>

<details>
<summary><code>frontend/src/utils/format.test.ts</code> (3)</summary>

- **currency formatting**
  - formats the configured currency without browser storage
  - uses the current profile currency
  - uses Russian grouping and abbreviations when no site format is set

</details>

## Frontend `self-order/` (Vitest)

| Файл | Тестов |
|---|---:|
| `self-order/src/App.test.tsx` | 9 |
| `self-order/src/hooks/useDeviceBootstrap.test.tsx` | 5 |
| `self-order/src/hooks/useIdleReset.test.tsx` | 6 |
| `self-order/src/hooks/useOrderingSession.test.tsx` | 21 |
| `self-order/src/layouts/LandscapeKioskLayout.test.tsx` | 13 |
| `self-order/src/layouts/MobileQRLayout.test.tsx` | 16 |
| `self-order/src/layouts/PortableTabletAssignment.test.tsx` | 13 |
| `self-order/src/layouts/PortraitKioskLayout.test.tsx` | 14 |
| `self-order/src/layouts/TabletLayout.test.tsx` | 6 |
| `self-order/src/layouts/shared/CartPage.test.tsx` | 12 |
| `self-order/src/layouts/shared/CartPanel.test.tsx` | 14 |
| `self-order/src/layouts/shared/CategoryTabs.test.tsx` | 8 |
| `self-order/src/layouts/shared/CheckoutScreen.test.tsx` | 15 |
| `self-order/src/layouts/shared/MenuGrid.test.tsx` | 3 |
| `self-order/src/layouts/shared/OrderStatusScreen.test.tsx` | 13 |
| `self-order/src/layouts/shared/ProductCard.test.tsx` | 9 |
| `self-order/src/layouts/shared/ProductDetail.test.tsx` | 12 |
| `self-order/src/layouts/shared/SearchBar.test.tsx` | 10 |
| `self-order/src/lib/api.test.ts` | 14 |
| `self-order/src/lib/availability.test.ts` | 4 |
| `self-order/src/lib/realtime.test.ts` | 8 |
| `self-order/src/main.test.tsx` | 1 |

<details>
<summary><code>self-order/src/App.test.tsx</code> (9)</summary>

- **App**
  - renders MobileQRLayout when not a device
  - shows loading state when device is bootstrapping
  - shows error state when device bootstrap fails
  - shows default error when device context is missing
  - renders Landscape Kiosk layout when specified in context
  - renders Mobile layout when specified in context
  - renders Tablet layout when specified in context
  - renders Portrait Kiosk layout when specified in context
  - passes initialContext to the layout component

</details>

<details>
<summary><code>self-order/src/hooks/useDeviceBootstrap.test.tsx</code> (5)</summary>

- **useDeviceBootstrap**
  - does not treat the browser as a provisioned device when no credentials are stored
  - does not bootstrap when only one of the two credential keys is present
  - bootstraps via the device-credential path when both keys are stored
  - surfaces a friendly error message when bootstrapDevice rejects with an Error
  - falls back to a generic error message when bootstrapDevice rejects with a non-Error value

</details>

<details>
<summary><code>self-order/src/hooks/useIdleReset.test.tsx</code> (6)</summary>

- **useIdleReset**
  - fires onIdle once after timeoutMs of no interaction
  - resets the timer on pointerdown so onIdle does not fire early
  - resets the timer on keydown so onIdle does not fire early
  - always calls the latest onIdle callback even if it changes between renders
  - clears the timer and removes listeners on unmount
  - restarts with the new timeout when timeoutMs changes

</details>

<details>
<summary><code>self-order/src/hooks/useOrderingSession.test.tsx</code> (21)</summary>

- **useOrderingSession**
  - **session bootstrap**
    - uses a device-bootstrapped initialContext without calling bootstrap() or reading stored context
    - filters disabled items out of the loaded menu
    - surfaces a friendly error and stops loading when there is no token and no stored context
    - surfaces the thrown error message when menu/order loading fails
  - **cart management**
    - adds a new item to the cart with qty 1
    - increments qty and keeps prior comment/variant/addons when re-adding without options
    - computes cartCount and cartTotal across multiple lines
    - decrementCart reduces qty by one and removes the line at zero
    - decrementCart on an item not in the cart is a no-op
  - **submitCart availability re-check (B04 cart-capacity risk)**
    - does nothing and returns false when the cart is empty
    - re-checks availability with skipCache:true for every cart line before submitting
    - blocks submission and surfaces a message when live availability says not sellable, without calling addItems
    - skips the availability re-check entirely when context has no restaurant/company
    - clears the cart and updates the order on success
    - surfaces a friendly error and never throws when addItems rejects
  - **resetSession**
    - clears cart/order/session state and sessionStorage, then re-runs init
  - **screen navigation**
    - walks the menu -> detail -> cart -> checkout -> status state machine
  - **handleRequestBill / payOnline**
    - sets billRequested on success
    - surfaces an error when requestBill fails and does not set billRequested
    - payOnline stores the payment request and redirects when a payment_url is returned
    - payOnline surfaces the graceful "not set up" error without redirecting

</details>

<details>
<summary><code>self-order/src/layouts/LandscapeKioskLayout.test.tsx</code> (13)</summary>

- **LandscapeKioskLayout**
  - shows loading state
  - shows error state when context is missing
  - renders menu screen with product grid
  - displays table number in header
  - displays pickup label when no table
  - renders cart page when screen is cart
  - renders checkout screen when screen is checkout
  - renders status screen when screen is status
  - shows New Order button on all screens
  - calls resetSession when New Order is confirmed
  - does not call resetSession when New Order is cancelled
  - registers idle reset hook
  - does not call resetSession during idle warning when submitting

</details>

<details>
<summary><code>self-order/src/layouts/MobileQRLayout.test.tsx</code> (16)</summary>

- **MobileQRLayout**
  - shows loading state
  - shows error state when context is missing
  - renders menu screen by default
  - displays table number in header for dine-in
  - displays pickup label for QR pickup source
  - renders cart page when screen is cart
  - renders checkout screen when screen is checkout
  - renders status screen when screen is status
  - renders detail screen when screen is detail
  - shows Start Over button on menu
  - shows cart summary when order has items
  - shows View Cart button with count and total when items in cart
  - does not show View Cart button when cart is empty
  - calls resetSession when Start Over is confirmed
  - does not call resetSession when Start Over is cancelled
  - registers idle reset hook on mount

</details>

<details>
<summary><code>self-order/src/layouts/PortableTabletAssignment.test.tsx</code> (13)</summary>

- **PortableTabletAssignment**
  - renders PIN entry screen initially
  - displays PIN entry dots
  - allows entering PIN digits
  - allows backspace in PIN entry
  - disables Continue button when PIN is less than 4 digits
  - enables Continue button when PIN has 4+ digits
  - advances to table entry screen when Continue is clicked with valid PIN
  - renders table input field on table step
  - disables Assign Table button when table is empty
  - enables Assign Table button when table name is entered
  - shows error when device is not provisioned
  - shows error from API failure
  - allows going back from table screen to PIN screen

</details>

<details>
<summary><code>self-order/src/layouts/PortraitKioskLayout.test.tsx</code> (14)</summary>

- **PortraitKioskLayout**
  - shows loading state while menu is loading
  - shows error state when no context and error exists
  - renders menu grid with items
  - displays Order for Pickup in header when no table
  - displays table number when set
  - displays New Order button
  - shows All Items category button
  - shows category buttons from menu
  - shows cart bar when items in cart
  - hides cart bar when no items in cart
  - shows checkout screen when screen === checkout
  - shows status screen when screen === status
  - resets session with confirmation
  - cancels reset when user declines

</details>

<details>
<summary><code>self-order/src/layouts/TabletLayout.test.tsx</code> (6)</summary>

- **TabletLayout**
  - shows loading state while menu is loading
  - renders the menu grid with items
  - displays the table number in header
  - displays New Order button
  - shows checkout screen when screen === checkout
  - resets session with confirmation dialog

</details>

<details>
<summary><code>self-order/src/layouts/shared/CartPage.test.tsx</code> (12)</summary>

- **CartPage**
  - renders empty cart state
  - renders cart items with quantities
  - calls onIncrement when + button is clicked
  - calls onDecrement when - button is clicked
  - displays correct cart summary
  - displays singular item when cartCount is 1
  - calls onCheckout when checkout button is clicked
  - disables checkout button when cart is empty
  - calls onBack when back button is clicked
  - shows item notes when itemNotesEnabled and notes exist
  - hides item notes when itemNotesEnabled is false
  - applies custom className when provided

</details>

<details>
<summary><code>self-order/src/layouts/shared/CartPanel.test.tsx</code> (14)</summary>

- **CartPanel**
  - renders empty cart state
  - renders cart items with increment/decrement controls
  - calls onIncrement when + button is clicked
  - calls onDecrement when - button is clicked
  - displays correct cart summary
  - calls onSubmit when Place Order button is clicked
  - shows previous order summary when order is present
  - disables Place Order button when submitting
  - disables Place Order button when cart is empty
  - shows Pay Online button when customer_payment_enabled
  - shows Request Bill button when request_bill_enabled
  - disables Pay Online button when payingOnline
  - disables Request Bill button when billRequested
  - hides payment buttons when order is billed

</details>

<details>
<summary><code>self-order/src/layouts/shared/CategoryTabs.test.tsx</code> (8)</summary>

- **CategoryTabs**
  - renders All button
  - renders category buttons for each category
  - highlights the All button when activeCourse is null
  - highlights the active category button
  - calls onSelect with null when All button is clicked
  - calls onSelect with course code when category is clicked
  - renders with empty categories list
  - includes nav with aria-label

</details>

<details>
<summary><code>self-order/src/layouts/shared/CheckoutScreen.test.tsx</code> (15)</summary>

- **CheckoutScreen**
  - renders order summary with cart items
  - displays item count and total in summary
  - hides payment method section when no payment options enabled
  - shows payment method section when any payment option is enabled
  - shows Pay Online button when enabled
  - shows Pay at Counter button when enabled
  - shows Request Bill button when enabled
  - pays at counter by default when option is enabled
  - calls onSubmitCart when Place Order is clicked
  - allows selecting different payment methods
  - disables Place Order button when cart is empty
  - shows loading state when submitting
  - shows payment method buttons when paying online but pay at counter not enabled
  - disables Request Bill button when bill already requested
  - calls onRequestBill when Request Bill button is clicked

</details>

<details>
<summary><code>self-order/src/layouts/shared/MenuGrid.test.tsx</code> (3)</summary>

- **MenuGrid availability gating (self-order)**
  - keeps a sellable item clickable and shows no unavailable badge
  - disables an unsellable item and shows its reason-code message
  - skips the availability check entirely (renders unattenuated) when company is missing

</details>

<details>
<summary><code>self-order/src/layouts/shared/OrderStatusScreen.test.tsx</code> (13)</summary>

- **OrderStatusScreen**
  - renders the confirmation header
  - displays the pickup code for pickup orders
  - does not display pickup code for dine-in orders
  - shows order status when provided
  - shows bill status when provided
  - shows open service requests
  - renders \
  - does not render \
  - renders \
  - does not render \
  - handles null status gracefully
  - shows \
  - shows \

</details>

<details>
<summary><code>self-order/src/layouts/shared/ProductCard.test.tsx</code> (9)</summary>

- **ProductCard**
  - renders the item name and price
  - shows the item image when showImage is true and an image is set
  - does not render an image when showImage is false
  - shows the in-cart quantity badge when cartQty is greater than zero
  - does not show the in-cart badge when cartQty is zero
  - calls onClick when clicked and not disabled
  - does not call onClick when disabled
  - shows the unavailable message instead of the cart badge when disabled
  - marks the button as disabled and aria-disabled when disabled

</details>

<details>
<summary><code>self-order/src/layouts/shared/ProductDetail.test.tsx</code> (12)</summary>

- **ProductDetail**
  - shows loading state while fetching product details
  - calls onBack from loading state
  - renders product details when loaded
  - displays the product price from menu item
  - shows error message when product fails to load
  - renders variants when available
  - renders addons when available
  - allows selecting a variant
  - allows toggling addons
  - increments and decrements quantity
  - calls onAddToCart with correct parameters
  - calls onBack after adding to cart

</details>

<details>
<summary><code>self-order/src/layouts/shared/SearchBar.test.tsx</code> (10)</summary>

- **SearchBar**
  - renders the input with placeholder text
  - renders with custom placeholder
  - displays the current value
  - updates local state when user types
  - debounces onChange calls
  - shows clear button when input has value
  - hides clear button when input is empty
  - clears input when clear button is clicked
  - updates when parent value prop changes
  - renders search icon

</details>

<details>
<summary><code>self-order/src/lib/api.test.ts</code> (14)</summary>

- **self-order api**
  - **bootstrap()**
    - calls get_ordering_context with a token and persists session+context
  - **bootstrapDevice()**
    - calls get_ordering_context with device credentials and persists the result
  - **assignDeviceTable()**
    - posts device/staff/table params and persists the returned context
  - **getStoredContext()**
    - returns null when nothing is stored
    - returns null (not throw) when stored JSON is corrupt
  - **getMenu()**
    - unwraps the message envelope for get_customer_menu
  - **getCurrentOrder()**
    - unwraps the message envelope for get_customer_order
  - **addItems()**
    - serializes items as a JSON string and unwraps the response
  - **getCustomerProduct()**
    - passes item_code (snake_case) and unwraps the response
  - **requestBill()**
    - posts session and unwraps the response
  - **getStatus()**
    - gets order status and unwraps the response
  - **createPaymentRequest()**
    - posts session and unwraps the payment request result
  - **getPaymentStatus()**
    - gets payment status and unwraps the response
  - **sharePaymentLink()**
    - posts session and recipient, unwraps the response

</details>

<details>
<summary><code>self-order/src/lib/availability.test.ts</code> (4)</summary>

- **availability service (self-order)**
  - fetches availability and passes the server response through verbatim
  - maps every documented reason_code to a user-facing message
  - caches per (item_code, branch, company) key and does not leak across keys
  - skipCache always re-calls the live endpoint, bypassing any cached display value

</details>

<details>
<summary><code>self-order/src/lib/realtime.test.ts</code> (8)</summary>

- **self-order realtime socket**
  - fetches the site name, then connects socket.io against the site-scoped URL
  - returns the same singleton socket on repeated calls without reconnecting
  - rejects and does not cache a broken connection when the site name lookup fails
  - swallows a fetch() rejection and treats it as an empty site name, still throwing the same connect error
  - **useMenuAvailabilityChannel**
    - subscribes to the branch-scoped channel and forwards events to the latest onEvent callback
    - does nothing when branch is undefined
    - unsubscribes the exact handler on unmount
    - silently swallows a subscribe failure instead of throwing

</details>

<details>
<summary><code>self-order/src/main.test.tsx</code> (1)</summary>

- **main.tsx**
  - is a valid entry point that bootstraps the app

</details>

## Frontend `packages/core/` (Vitest)

| Файл | Тестов |
|---|---:|
| `packages/core/src/frappe/roles.test.ts` | 0 |

<details>
<summary><code>packages/core/src/frappe/roles.test.ts</code> (0)</summary>


</details>

## Frontend `packages/ui/` (Vitest)

| Файл | Тестов |
|---|---:|
| `packages/ui/src/components/autocomplete.test.tsx` | 3 |
| `packages/ui/src/components/data-table.test.tsx` | 2 |
| `packages/ui/src/components/date-picker.test.tsx` | 6 |
| `packages/ui/src/components/editable-table.test.tsx` | 28 |
| `packages/ui/src/components/switch-card.test.tsx` | 2 |
| `packages/ui/src/lib/sanitize-message.test.ts` | 6 |

<details>
<summary><code>packages/ui/src/components/autocomplete.test.tsx</code> (3)</summary>

- **Autocomplete**
  - debounces onSearch and fires empty query on focus
  - commits a selected option value
  - shows searching state

</details>

<details>
<summary><code>packages/ui/src/components/data-table.test.tsx</code> (2)</summary>

- **DataTable**
  - renders the expanded content right below the expanded row
  - does not trigger the row click from inside the expanded content

</details>

<details>
<summary><code>packages/ui/src/components/date-picker.test.tsx</code> (6)</summary>

- **DatePicker**
  - exposes the calendar as a labelled grid of day buttons
  - puts exactly one day in the tab order and moves it with the arrow keys
  - pages to the neighbouring month when the focus walks off the end of this one
  - selects the focused day with the keyboard
  - disables days past maxDate instead of silently ignoring the click
  - closes on Escape and hands focus back to the trigger

</details>

<details>
<summary><code>packages/ui/src/components/editable-table.test.tsx</code> (28)</summary>

- **sanitizeCsvCell (formula-injection guard)**
  - prefixes values starting with =, +, -, @, tab, or carriage return
  - does not touch a safe value
- **EditableDataTable — Sales-Plan-shaped fixture**
  - renders context and editable columns
  - focusing a qty input selects its current value, so the first keystroke replaces it (not appends next to a pre-filled 0)
  - wheel-guard blurs a focused number input on wheel instead of blocking page scroll
  - wheel-guard does nothing when the input is not focused
  - wheel-guard listener is actually removed on unmount (no leak)
  - keyboard nav: ArrowDown/ArrowUp move focus within visible rows, stopping at instance edges
  - keyboard nav skips rows the caller marks as filtered-out (only visible rows are passed in)
  - Enter commits and moves focus down one row
  - bulk-set: confirm step names affected row count, applies only to the visible/filtered subset
  - bulk-set: declining the confirm step does not apply
  - CSV export/import round-trip, including unmatched-key reporting
  - CSV import/export is symmetric: a genuine leading-quote value round-trips unchanged
  - CSV import/export is symmetric: a real formula value is guarded on export and restored on import
  - CSV export neutralizes a formula-injection payload in an editable cell
- **EditableDataTable — new API surface**
  - dataRows: CSV export/bulk-set operate on dataRows, not the rendered rows subset
  - dataRows: defaults to rows when omitted (backward compatible)
  - editableColumnIndex: inserts the editable column at the given position instead of appending
  - editableColumnIndex: omitted keeps default append-at-end behavior
  - getAriaLabel: sets aria-label on the rendered input when provided
  - getAriaLabel: omitted leaves inputs without an aria-label (current behavior)
  - onBoundaryReached: fires with 'down' when ArrowDown is pressed past the last row
  - onBoundaryReached: fires with 'up' when ArrowUp is pressed past the first row
  - onBoundaryReached: not fired for in-bounds nav
- **EditableDataTable — Production-Plan-shaped fixture (distinct field names/row key)**
  - renders and edits with a completely different schema, no Sales-Plan path exercised
  - keyboard nav is scoped to this table instance
  - CSV round trip works against this distinct schema and its own row key

</details>

<details>
<summary><code>packages/ui/src/components/switch-card.test.tsx</code> (2)</summary>

- **SwitchCard**
  - toggles when the label or description is clicked
  - does not toggle when disabled

</details>

<details>
<summary><code>packages/ui/src/lib/sanitize-message.test.ts</code> (6)</summary>

- **sanitizeMessageHtml**
  - keeps allowed emphasis tags
  - strips script tags and event handlers
  - strips disallowed tags but keeps their text
  - leaves plain strings unchanged
- **messageToPlainText**
  - strips tags after sanitize
  - does not leave script content

</details>

## Браузерные e2e `e2e/` (Playwright, не в CI)

| Файл | Тестов |
|---|---:|
| `e2e/tests/mosaic.spec.ts` | 3 |
| `e2e/tests/pos.spec.ts` | 5 |
| `e2e/tests/self-order.spec.ts` | 3 |

<details>
<summary><code>e2e/tests/mosaic.spec.ts</code> (3)</summary>

- Mosaic production board
- loads and renders a recognizable app shell
- golden path: dashboard shows production units -> open a board

</details>

<details>
<summary><code>e2e/tests/pos.spec.ts</code> (5)</summary>

- POS app
- loads and renders a recognizable app shell
- captain golden path: login -> tables list -> open a table
- captain golden path: add an item to the cart
- captain golden path: send KOT -> serve -> POS close

</details>

<details>
<summary><code>e2e/tests/self-order.spec.ts</code> (3)</summary>

- Self-order app
- loads and renders a recognizable app shell
- golden path: browse menu -> add to cart -> place order

</details>

<!-- END GENERATED -->
