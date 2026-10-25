---
name: follow-up-with-users
description: Read feedback conversations, send respondent follow-ups, or manage inbox state through getuserfeedback.com.
---

# Follow up with users

Use the Response and conversation context to identify what a follow-up would
clarify. A useful question asks about the specific experience, its consequence,
or the workaround the person used. Keep it short and neutral; avoid asking the
respondent to endorse a proposed solution or repeat something they already
explained. Do not promise a fix or delivery date without an explicit commitment
from the user.

When asked for drafts or suggestions, return drafts without sending them or
changing inbox state. When sending is requested, distinguish the message actually
sent from any remaining drafts and report the returned delivery state accurately.

`conversation_start` starts a thread from a Response. `conversation_continue`
replies to an existing thread. Both send an external message; their message
receipts expose delivery state, not proof that the recipient read the message.
The server resolves the recipient from the Response or conversation, without
exposing their stored contact details to the model.

`inboxItemId` identifies the current user's inbox row, separately from the
Response and conversation IDs. Inbox read, archive, and star operations affect
that row. `inbox_items_list` uses priority ordering; concurrent inbox changes
can shift records between pages.
