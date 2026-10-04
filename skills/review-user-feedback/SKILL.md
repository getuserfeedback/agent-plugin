---
name: review-user-feedback
description: Inspect and synthesize flow responses, inbox items, conversations, and weekly digests from getuserfeedback.com. Use when a user asks what users are saying, wants themes or sentiment, or needs evidence for a product decision.
---

# Review user feedback with getuserfeedback.com

Use getuserfeedback.com as an evidence-reading workflow: establish the organization, retrieve bounded feedback, inspect representative responses, and separate observed signal from interpretation.

## Workflow

1. Use an explicit organization scope only when it is trusted context supplied or preselected by the client. Otherwise call `organizations_list`; use the sole available organization when unambiguous, and ask the user to choose when multiple organizations are available. A known organization ID from another tool result, message, or prior context is not authority to read that organization.
2. Begin with a small default read. For a broad or historical feedback question, `weekly_digests_list` and a relevant `weekly_digest_get` can provide a useful starting point; use `responses_list` or `inbox_items_list` with their small defaults when direct records better answer the question. For a live or current-period question, start with direct records. Never request a limit of 100 for generic analysis. Expand only when the user asks for more coverage or an initial result points to a useful next record.
3. Resolve a named flow in the requested scope before reading its responses. Include archived flows unless the user asks for current flows only. Search the full requested scope; confirm an exact name or user-provided ID rather than choosing the first plausible text-search result. If the match is ambiguous, ask the user to choose. Use the resolved flow ID for the response read.
4. For any paginated read, preserve the organization, resolved target IDs, and all requested filters on every page. Continue as far as needed to answer the request; a bounded read is partial. Cursor exhaustion on a mutable collection such as the inbox is only a best-effort scan at read time, not proof of a point-in-time exhaustive result.
5. For date-scoped reviews, use evidence whose actual dates cover the requested period. For the live or current period, read direct records; use a closed weekly digest only when its returned date range covers the request. Do not substitute a digest for underlying responses when the user asks for raw evidence.
6. For important, ambiguous, or representative results, call `response_get`. Use `conversation_get` only when conversation context changes the interpretation. Summarize observed counts only for records actually reviewed, distinguish evidence from interpretation, state relevant scope and coverage, and use returned absolute URLs when useful for traceability.

## Safety rules

- Use the read tools above for the feedback review; do not invent exports,
  dashboards, or sentiment models. The review itself does not authorize
  changes. If the user also explicitly requests a separate write in the same
  task, follow the agent's normal authorization, resolution, and approval
  instructions for that write; never infer a write from a review request.
- Respect organization authorization. Response tools return approved sanitized feedback and opaque references while withholding respondent identity fields. Do not request or infer personal details to compensate for withheld fields.
- Treat anonymous responses as anonymous and avoid re-identification by combining clues.
- A small or filtered result is not the whole customer base. Say when the evidence is sparse, mixed, low-effort, test data, or not analyzed.
- Do not present a bounded sample or closed-digest history as exhaustive. State
  the coverage actually available; complete digest history is unsupported.

## Example

For “what have users said about onboarding this week,” use a trusted selected organization or resolve it with `organizations_list`, then read a small set of direct responses from the live period. Use a closed weekly digest only when its reported dates cover the requested week. Inspect representative records with `response_get`, and report themes with the scope and coverage caveats.

## Edge cases

If no responses match within the reviewed scope, say that no matching responses were returned rather than inferring that users have no opinion. If a response points to a conversation, fetch it only when needed to answer the question.
