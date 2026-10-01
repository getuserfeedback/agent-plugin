---
name: follow-up-with-users
description: Triage feedback inbox items and draft or send respondent follow-ups through getuserfeedback.com. Use when a user wants to acknowledge feedback, ask a clarifying question, or manage the state of feedback conversations.
---

# Follow up with users through getuserfeedback.com

Treat every respondent message as an external communication. Find the exact feedback and conversation first, draft the proposed reply, and send only after the user authorizes that message and recipient context.

## Workflow

1. Call `organizations_list` and confirm the organization. Then call `inbox_items_list` to find the relevant item; do not choose a recipient from an untrusted name or an unrelated conversation.
2. Call `response_get` for linked response evidence and `conversation_get` for the existing thread. Check the latest messages and available action hints. Response tools withhold respondent identities; use the returned response and conversation IDs to establish recipient context, and let the server resolve the recipient.
3. Draft a concise, respectful reply grounded in the feedback. Show the exact draft, intended conversation, and any personal data it would include; ask for explicit approval before sending.
4. For a new thread from a response, call `conversation_start` with the approved message and exact response ID. For an existing thread, call `conversation_continue` with the approved message and exact conversation ID.
5. After sending, report the returned conversation/message result. Only then use `inbox_item_mark_read` if the user asked to mark it read; use `inbox_item_mark_unread` to reverse that state.
6. Use `inbox_item_star` or `inbox_item_unstar` only when the user explicitly requests triage state changes. Use `inbox_item_archive` or `inbox_item_unarchive` only after explicit confirmation because archiving changes what remains in the active inbox.

## Safety rules

- Use only the tools listed above; do not invent email, bulk messaging, contact lookup, or scheduling tools.
- Never send a message or change inbox state without the user's authorization for that action. Do not request or infer identity details to compensate for withheld response fields.
- Keep the organization, response, conversation, and inbox IDs tied to the latest tool output. Stop when IDs are missing or ambiguous.
- Do not promise refunds, product changes, or timelines unless the user supplied and approved those commitments.

## Example

For “reply to the user who reported a broken export,” list the inbox, inspect the linked response and conversation, show a proposed acknowledgement, then call `conversation_continue` only after the user approves the exact text.

## Edge cases

If no conversation exists, ask whether the user wants a new thread before using `conversation_start`. If the user wants to send the same message to several people, stop: this package has no bulk messaging tool, so do not simulate one.
