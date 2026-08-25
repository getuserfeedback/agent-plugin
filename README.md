# getuserfeedback.com

The official getuserfeedback.com Agent Plugin brings product feedback into the
agent workflow. It connects to the hosted getuserfeedback.com MCP server and
adds focused skills for collecting feedback, reviewing responses, and following
up with users.

## Install

Clients that support Agent Plugins can install or clone this public repository:

```text
https://github.com/getuserfeedback/agent-plugin
```

For Claude Code:

```text
/plugin marketplace add getuserfeedback/agent-plugin
/plugin install getuserfeedback.com@getuserfeedback.com
```

The plugin connects to `https://mcp.getuserfeedback.com/` over Streamable HTTP.
Authentication uses the client's OAuth flow; the plugin contains no credentials
or fixed authorization headers.

## Included skills

- `collect-product-feedback` creates and safely updates focused surveys.
- `review-user-feedback` reads responses, inbox items, and weekly digests.
- `follow-up-with-users` drafts and sends approved respondent follow-ups.

The package includes native Claude Code metadata alongside the portable Agent
Plugins v1 manifest. Claude Code and Claude Desktop accept the exact dotted
identifier `getuserfeedback.com`; claude.ai organization marketplace sync
currently requires kebab-case identifiers and cannot ingest this exact-name
entry.

For help, see [getuserfeedback.com support](https://www.getuserfeedback.com/docs/guides/troubleshooting).
