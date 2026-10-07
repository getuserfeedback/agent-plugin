---
name: collect-product-feedback
description: Create or edit getuserfeedback.com Flows to collect product feedback. Use when a user wants to ask their users a question or change an existing Flow.
---

# Collect product feedback

`flow_templates_list` returns actionable template IDs. `flow_create` accepts
either a template or custom pages, not both. Flow content is page-first; the
schema and editing semantics are at `getuserfeedback://docs/flow-content`.

`flow_get.flow.editableContent` is the safe editing projection. Its `versionId`
is the revision required by `flow_content_update`; null means the content is
unavailable for editing through MCP. `currentVersion` is a read projection and
may contain omissions.

Launch surface, delivery rule, and live window are distinct settings.
`flow_get` exposes them through `launchPlan`, `flowSchedule`, and
`deliveryRuleAuthoring`. Delivery-rule edits replace the complete rule and use
its automation version ID. Launch and rule changes can return
`confirmation_required` when they affect pending deliveries.

A `cacheInvalidationWarning` describes a committed write whose cache refresh
failed, rather than a failed write.
