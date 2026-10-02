---
name: review-user-feedback
description: Inspect and synthesize flow responses, inbox items, conversations, and weekly digests from getuserfeedback.com. Use when a user asks what users are saying, wants themes or sentiment, or needs evidence for a product decision.
---

# Review user feedback with getuserfeedback.com

Use getuserfeedback.com as an evidence-reading workflow: establish the organization, retrieve bounded feedback, inspect representative responses, and separate observed signal from interpretation.

## Workflow

1. Call `organizations_list` and confirm the organization before reading its data. If there are several, ask the user to choose rather than guessing.
2. When the user names a flow, resolve it with `flows_list` and use the returned flow ID in `responses_list`. Apply any requested query, sentiment, quality, identity, or limit filters. Follow each nextCursor with the same filters, even when a page's responses is empty, until nextCursor is null. If the requested review intentionally stops at a bounded sample before that point, report that the search is partial and state the reviewed scope. Use `inbox_items_list` when the user asks about follow-up or unread conversations.
3. For important, ambiguous, or representative results, call `response_get`. Use `conversation_get` only when conversation context changes the interpretation.
4. When a time-based roundup is useful, call `weekly_digests_list`, then `weekly_digest_get` for the selected digest. Do not substitute a digest for the underlying responses when the user asks for raw evidence.
5. Summarize counts and recurring themes, distinguish direct answer evidence from inference, note the applied filters, and use returned absolute response/conversation URLs when the user needs traceability.

## Safety rules

- Use only the read tools listed above; do not invent exports, dashboards, sentiment models, or write actions.
- Respect organization authorization. Response tools return approved sanitized feedback and opaque references while withholding respondent identity fields. Do not request or infer personal details to compensate for withheld fields.
- Treat anonymous responses as anonymous and avoid re-identification by combining clues.
- A small or filtered result is not the whole customer base. Say when the evidence is sparse, mixed, low-effort, test data, or not analyzed.

## Example

For “what have users said about onboarding this week,” confirm the organization, call `responses_list` with a focused query and sensible limit, inspect a few with `response_get`, and report themes with the filters and caveats.

## Edge cases

Only after following nextCursor until null, if no responses match, say that no matching responses were returned rather than inferring that users have no opinion. If a response points to a conversation, fetch it only when needed to answer the question.
