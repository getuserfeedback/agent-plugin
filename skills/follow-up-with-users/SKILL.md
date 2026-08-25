---
name: follow-up-with-users
description: Triage feedback inbox items and draft or send respondent follow-ups through getuserfeedback.com. Use when a user wants to acknowledge feedback, ask a clarifying question, or manage the state of feedback conversations.
---

# Follow up with users through getuserfeedback.com

Treat every respondent message as an external communication. Find the exact feedback and conversation first, draft the proposed reply, and send only after the user authorizes that message and recipient context.

## Workflow

1. Call `list_organizations` and confirm the organization. Then call `list_inbox_items` to find the relevant item; do not choose a recipient from an untrusted name or an unrelated conversation.
2. Call `get_response` for linked response evidence and `get_conversation` for the existing thread. Check the latest messages, respondent identity visibility, and the available action hints.
3. Draft a concise, respectful reply grounded in the feedback. Show the exact draft, intended conversation, and any personal data it would include; ask for explicit approval before sending.
4. For a new thread from a response, call `start_conversation` with the approved message and exact response ID. For an existing thread, call `continue_conversation` with the approved message and exact conversation ID.
5. After sending, report the returned conversation/message result. Only then use `mark_inbox_item_read` if the user asked to mark it read; use `mark_inbox_item_unread` to reverse that state.
6. Use `star_inbox_item` or `unstar_inbox_item` only when the user explicitly requests triage state changes. Use `archive_inbox_item` or `unarchive_inbox_item` only after explicit confirmation because archiving changes what remains in the active inbox.

## Safety rules

- Use only the tools listed above; do not invent email, bulk messaging, contact lookup, or scheduling tools.
- Never send a message, expose a respondent identity, or change inbox state without the user's authorization for that action.
- Keep the organization, response, conversation, and inbox IDs tied to the latest tool output. Stop when IDs are missing or ambiguous.
- Do not promise refunds, product changes, or timelines unless the user supplied and approved those commitments.

## Example

For “reply to the user who reported a broken export,” list the inbox, inspect the linked response and conversation, show a proposed acknowledgement, then call `continue_conversation` only after the user approves the exact text.

## Edge cases

If no conversation exists, ask whether the user wants a new thread before using `start_conversation`. If the user wants to send the same message to several people, stop: this package has no bulk messaging tool, so do not simulate one.
