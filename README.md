# getuserfeedback.com

The official getuserfeedback.com Agent Plugin brings product feedback into the
agent workflow. It connects to the hosted getuserfeedback.com MCP server and
adds focused skills for collecting feedback, reviewing responses, and following
up with users.

## Install

Use the route for your client. The public product name is always
`getuserfeedback.com`; `getuserfeedback` is the shared technical slug used by
plugin hosts and may appear in install commands or namespaces. Agent Plugins
standardizes the package, but each client still owns installation and
authentication.

Repository: <https://github.com/getuserfeedback/agent-plugin>

### Claude Code

Add the repository as a marketplace, then install the shared technical slug:

```text
/plugin marketplace add getuserfeedback/agent-plugin
/plugin install getuserfeedback@getuserfeedback
```

See the [Claude Code plugin guide](https://code.claude.com/docs/en/discover-plugins).

### VS Code

Open the Command Palette, run **Chat: Install Plugin From Source**, and enter:

```text
https://github.com/getuserfeedback/agent-plugin
```

See [Agent plugins in VS Code](https://code.visualstudio.com/docs/agent-customization/agent-plugins).

### GitHub Copilot CLI

Install directly from GitHub:

```sh
copilot plugin install getuserfeedback/agent-plugin
```

See the [Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference).

### Kiro

Open **Powers** → **Add Custom Power** → **Import power from GitHub**, enter
the repository URL, and choose **Install**. See [Install powers](https://kiro.dev/docs/powers/installation/).

### Cursor

Cursor supports this as a local import. Clone or copy the repository to
`~/.cursor/plugins/local/getuserfeedback`, then restart Cursor or run
**Developer: Reload Window**. See [Test plugins locally](https://cursor.com/docs/plugins).

On Cursor Teams or Enterprise, an administrator must first enable **Allow Local
Plugin Imports** under **Dashboard** → **Settings** → **Security & Identity** →
**Marketplace and Plugins**. The setting is off by default on Enterprise.

```sh
mkdir -p "$HOME/.cursor/plugins/local"
git clone https://github.com/getuserfeedback/agent-plugin "$HOME/.cursor/plugins/local/getuserfeedback"
```

### ChatGPT and Codex

Add the repository as a marketplace:

```sh
codex plugin marketplace add getuserfeedback/agent-plugin
```

In Codex CLI, enter `/plugins`, choose the `getuserfeedback.com` marketplace,
install the plugin, and start a new session.

In the ChatGPT desktop app, restart the app after adding the marketplace, open
the Plugins Directory, choose the `getuserfeedback.com` marketplace, and
install the plugin. Each user completes OAuth for their own getuserfeedback.com
account; the package contains the registered MCP app identifier, not user
credentials.

See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins)
and the [Codex CLI plugin browser](https://learn.chatgpt.com/docs/plugins#plugin-browser-in-codex-cli).

### Grok

Install from GitHub, trust the plugin's skills and MCP configuration, then
enable it:

```sh
grok plugin install getuserfeedback/agent-plugin --trust
grok plugin enable getuserfeedback
```

Start a new session after installation. See the [Grok plugin guide](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/09-plugins.md).

### Current authentication gaps

Hermes, OpenClaw, and NanoClaw can load the package, but cannot currently
complete the OAuth flow required by the hosted getuserfeedback.com MCP server
from this package's metadata. The skills may appear, but the MCP tools will not
be usable. These are not full installation paths yet.

Hermes does not currently expose portable MCP servers to its OAuth login
command. The affected package flow is:

```sh
hermes plugins install getuserfeedback/agent-plugin --no-enable
hermes plugins enable getuserfeedback
```

Track the [Hermes portable OAuth issue](https://github.com/NousResearch/hermes-agent/issues/87253).

For OpenClaw, the bundle can be installed from a local checkout, but its native
`auth: "oauth"` setting is not part of the portable package:

```sh
git clone https://github.com/getuserfeedback/agent-plugin ./getuserfeedback-agent-plugin
openclaw plugins install ./getuserfeedback-agent-plugin
openclaw plugins inspect getuserfeedback
```

See the [OpenClaw bundle guide](https://docs.openclaw.ai/plugins/bundles) and
[native MCP OAuth guide](https://github.com/openclaw/openclaw/blob/main/docs/cli/mcp.md).

NanoClaw accepts Agent Plugins only from its local templates directory. Its
credentials proxy does not provide the MCP OAuth flow required here:

```sh
git clone https://github.com/getuserfeedback/agent-plugin /path/to/nanoclaw/templates/getuserfeedback
ncl groups create --template getuserfeedback --name "getuserfeedback.com"
```

See NanoClaw's [agent template guide](https://github.com/nanocoai/nanoclaw/blob/main/docs/templates.md).

The plugin connects to `https://mcp.getuserfeedback.com/` over Streamable HTTP.
On clients that support OAuth for plugin-declared HTTP MCP servers,
authentication uses the client's OAuth flow. The plugin contains no credentials
or fixed authorization headers.

## License

This plugin is distributed under the MIT License. See [LICENSE](./LICENSE) for
the standard license text and copyright notice.

## Included skills

- `collect-product-feedback` creates and safely updates focused surveys.
- `review-user-feedback` reads responses, inbox items, and weekly digests.
- `follow-up-with-users` drafts and sends approved respondent follow-ups.

The package includes native Claude Code metadata alongside the portable Agent
Plugins v1 manifest. Every variant uses `getuserfeedback` as its technical slug
and presents `getuserfeedback.com` as the product name wherever the host
supports separate display metadata.

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
