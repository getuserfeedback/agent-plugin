---
name: review-user-feedback
description: Inspect getuserfeedback.com Responses to answer questions about user feedback.
---

# Review user feedback

Answer the product question using the feedback actually examined. Group related
problems, explain the evidence behind each theme, and link to the supporting
Responses when their product links are available. Include relevant conflicting
feedback rather than forcing every answer into the dominant theme.
Preserve the wording of permitted answer content when quoting. Label paraphrases
as summaries. Consider the severity of a reported problem as well as how often
it appears.

Separate what users reported from your interpretation and proposed next step.
Feedback can suggest an explanation. It does not by itself establish causation
or represent everyone who uses the product. State the scope and coverage of the
review. Do not describe a page or sample as the complete dataset, count multiple
Responses as distinct people, or turn a few examples into a population percentage.
If the available evidence cannot answer the question, identify the gap and a
focused question that would help resolve it.

`responses_list` provides compact analysis. `response_get` provides approved
answer content. Query matching verifies sanitized answer content permitted for
the model and fills pages with matching responses. Dedicated contact fields and
withheld answers are excluded.

`user_get` opens a User by `userReference`. Responses return the same
`userReference` when a current profile is available. References are scoped to the organization and may change
after identity deletion or reset. Stored identity, attributes, and dynamic
event properties are withheld from the model. The User UI can show separately
delivered sensitive context, marked with a padlock.
