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

## License

This plugin is distributed under the MIT License. See [LICENSE](./LICENSE) for
the standard license text and copyright notice.

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

## Release guarantee budget

Outcome:

- Maintainers can safely turn an approved stable plugin version on public
  `main` into an installable, byte-verifiable release without cross-repository
  credentials or manual repair of matching draft state.

Promised behavior under named conditions:

- Across reruns of the original failed workflow run and GitHub read-after-write
  delay, a matching draft is resumed. Missing assets, interrupted uploads, and
  expected-name assets with mismatched bytes are deleted or uploaded until the
  draft matches. A matching published release is verified and accepted.
- Across overlapping runs, SHA-scoped concurrency does not cancel another
  commit's run, and reconciliation remains scoped to the version-derived tag.
- Across every retry, the release must point to the exact triggering commit,
  use the canonical `getuserfeedback.com` title and version-derived artifact
  names, and contain the exact archive and checksum bytes produced from that
  commit. The workflow fails closed instead of replacing mismatched published
  state.

Accepted failure or uncertainty:

- A commit can be present on public `main` before its release is available.
- A GitHub outage or visibility delay can leave a matching draft that requires
  rerunning the original failed workflow run at its original commit.
- Recovery ends when GitHub no longer permits another rerun of the original
  workflow run or its retry allowance is exhausted.
- Mutated release identity, title, tag target, unexpected asset names, and any
  mismatched published state are unsupported and refused rather than repaired.
- Mirroring source into the public repository is a separate boundary; this
  workflow does not provide a cross-repository transaction.
- Archive production uses the selected GitHub runner's system tools. Toolchain
  changes can produce different bytes and cause a later retry to fail closed.
- Latest-release selection depends on GitHub's legacy SemVer behavior.

Evidence:

- The workflow byte-compares both downloaded assets before and after publication.
- Contract tests in the canonical source repository cover planner decisions for
  initial publication, interrupted-upload and mismatched-byte reconciliation,
  exact release identity, and mismatched-state refusal. A shell harness exercises
  the workflow's bounded visibility-delay polling behavior.
- Contract tests lock the SHA-scoped, non-cancelling concurrency configuration
  and delegation of latest-release selection to GitHub's legacy SemVer mode.

Escalation triggers:

- Revisit this design if releases must recover without rerunning the original
  workflow or beyond GitHub's rerun limits, tolerate refused mutations, publish
  atomically across repositories, reproduce archives across runner-toolchain
  changes, provide immutable attestations, or use latest-release semantics that
  GitHub's legacy SemVer selection cannot express.
