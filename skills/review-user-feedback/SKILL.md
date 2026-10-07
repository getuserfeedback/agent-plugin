---
name: review-user-feedback
description: Inspect getuserfeedback.com Responses, conversations, or weekly digests to answer questions about user feedback.
---

# Review user feedback

`responses_list` provides compact analysis; `response_get` provides approved
answer content and linked conversations. Query matching uses sanitized answer
content within each bounded candidate page, rather than searching all stored
fields. Dedicated contact fields and withheld answers are excluded.

Weekly digests cover the returned closed periods; they do not cover the live
period. `weekly_digests_list` exposes the available recent digest history.

`user_get` opens the current User behind a Response's opaque
`respondentReference`. References are scoped to the organization and may change
after identity deletion or reset. Stored identity, attributes, and dynamic
event properties are withheld from the model. The User UI can show separately
delivered sensitive context, marked with a padlock.
