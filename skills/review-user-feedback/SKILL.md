---
name: review-user-feedback
description: Inspect and synthesize survey responses, inbox items, conversations, and weekly digests from getuserfeedback.com. Use when a user asks what users are saying, wants themes or sentiment, or needs evidence for a product decision.
---

# Review user feedback with getuserfeedback.com

Use getuserfeedback.com as an evidence-reading workflow: establish the organization, retrieve bounded feedback, inspect representative responses, and separate observed signal from interpretation.

## Workflow

1. Call `list_organizations` and confirm the organization before reading its data. If there are several, ask the user to choose rather than guessing.
2. Start with `list_responses`, using the user's requested survey, query, sentiment, quality, identity, or limit filters. Use `list_inbox_items` when the user asks about follow-up or unread conversations.
3. For important, ambiguous, or representative results, call `get_response`. Use `get_conversation` only when conversation context changes the interpretation.
4. When a time-based roundup is useful, call `list_weekly_digests`, then `get_weekly_digest` for the selected digest. Do not substitute a digest for the underlying responses when the user asks for raw evidence.
5. Summarize counts and recurring themes, distinguish direct answer evidence from inference, note the applied filters, and include response IDs when the user needs traceability.

## Safety rules

- Use only the read tools listed above; do not invent exports, dashboards, sentiment models, or write actions.
- Respect organization authorization and the response identity shown by the tools. Do not reveal personal identity details that are not needed for the user's question.
- Treat anonymous responses as anonymous and avoid re-identification by combining clues.
- A small or filtered result is not the whole customer base. Say when the evidence is sparse, mixed, low-effort, test data, or not analyzed.

## Example

For “what have users said about onboarding this week,” confirm the organization, call `list_responses` with a focused query and sensible limit, inspect a few with `get_response`, and report themes with the filters and caveats.

## Edge cases

If no responses match, say that no matching responses were returned rather than inferring that users have no opinion. If a response points to a conversation, fetch it only when needed to answer the question.
