---
name: collect-product-feedback
description: Plan and collect product feedback with getuserfeedback.com by choosing a useful flow, creating it in an authorized organization, and safely reviewing its setup. Use when a user wants to ask users a new product question or improve an existing flow.
---

# Collect product feedback with getuserfeedback.com

Use getuserfeedback.com to turn a concrete product question into a focused flow without guessing the user's organization, audience, or desired launch behavior.

## Workflow

1. Call `organizations_list` and ask the user to choose when more than one organization is available. Never infer an organization ID from its name or from prior context.
2. Call `flow_templates_list` when the user wants help choosing a high-signal question. Explain the selected template and any tailoring before creating anything.
3. Confirm the flow name, question/content, identity setting, and intended launch surface. Before a mutation, obtain the user's authorization for that specific organization and action.
4. Call `flow_create` with only the agreed fields. Report the returned flow ID and organization ID; do not claim that a flow was delivered unless the tool says so.
5. Call `flow_get` or `flows_list` to inspect the created setup. If editing is requested, pass the latest `flow_get` result's `flow.editableContent.versionId` as `flow_content_update.expectedVersionId`; do not overwrite content from memory. Stop if `editableContent` is null.
6. Treat `flow_launch_surface_update` as a separate consequential action. If it returns confirmation_required, show the exact revision and ask for explicit confirmation before resubmitting it.

## Safety rules

- Use only the tools listed above; do not invent delivery, analytics, or targeting tools.
- Preserve the authenticated user's organization access checks. Stop if `organizations_list` does not establish access to the requested organization.
- Ask before creating, replacing, or changing launch behavior. A read request is not authorization for a write.
- Keep flow questions specific and minimize collection of personal information unless the user explicitly needs it.

## Example

For “ask new users why setup was difficult,” list organizations, optionally inspect `flow_templates_list`, present a short proposed question, then create only after the user selects an organization and approves the flow.

## Edge cases

An empty organization list can mean provisioning is still in flight; report that and retry only when the user asks. If a write reports a version conflict or cache warning, report the result and fetch current state before proposing another write; never blindly retry.
