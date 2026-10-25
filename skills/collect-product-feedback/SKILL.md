---
name: collect-product-feedback
description: Create or edit getuserfeedback.com Flows to collect product feedback. Use when a user wants to ask their users a question or change an existing Flow.
---

# Collect product feedback

Start from what the user wants to learn or decide. When that is clear, propose
a short Flow rather than turning setup into a questionnaire for the user.
Ask about one thing at a time, use neutral wording, and keep the effort
proportionate to the question. Prefer a concrete recent experience over a
hypothetical prediction. A low rating can identify a problem without explaining
its cause; an open question can help uncover what to investigate next.
Keep wording and scales consistent when comparing results over time. Consider
who can see the Flow and when they see it: an in-app question cannot reach
people who never return. Avoid collecting personal information the question
does not need.

When improving an existing Flow, preserve questions and settings unrelated to
the requested change. Distinguish a draft or saved edit from a Flow that is live
and collecting responses. Explain the chosen delivery surface and audience
without assuming they are already configured.

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
