# Chrome Extension Best Practices - Agent Skill

**Production-ready Agent Skill for Chrome Extensions (Manifest V3).**

This package is a **machine-readable skill module** designed to be installed into coding agents (like Cursor, Claude Code, Codex, Opencode) so they can:

1.  **Detect** problematic Chrome extension patterns.
2.  **Name** the violated best practice.
3.  **Explain** why it matters.
4.  **Suggest** concrete fixes.

It exports **44 authoritative rules** based on Google's Chrome Web Store guidelines, MV3 requirements, and security best practices.

## Installation

```bash
npx add-skill ryan-skeans/chrome-extension-best-practices
```

## Rule Categories

| Category | Rules | Description |
|----------|-------|-------------|
| **security** | 10 | CSP, XSS prevention, message passing, web accessible resources |
| **architecture** | 8 | Service worker lifecycle, state management, event handling |
| **permissions** | 5 | Least privilege, activeTab, optional permissions |
| **performance** | 4 | Programmatic injection, storage optimization, offscreen docs |
| **ux** | 7 | Options page, popups, side panels, keyboard shortcuts |
| **privacy** | 2 | Data minimization, permission justification |
| **store-compliance** | 5 | Single purpose, code readability, privacy policy |
| **networking** | 3 | declarativeNetRequest, CORS handling |

## Usage for Agents

This package exports a raw JSON artifact containing all rules, enabling agents to ingest knowledge without parsing prose.

```typescript
import { agentRules, rulesByCategory } from 'chrome-extension-best-practices';

// 1. Ingest Rules
const rules = agentRules; 

// 2. Analyze Code context
// (Agent Logic Here) checks file contents against rule.detection hints...

// 3. Provide Feedback
if (violatedRule) {
  print(rule.summary);
  print(rule.recommendation.action);
  print(rule.recommendation.after);
}
```

### Raw JSON Access

The rules are also available as a static JSON file:

`dist/agent-rules.json`

## Rule Structure

Each rule follows the `AgentRule` schema:

| Field | Description |
|-------|-------------|
| `id` | Stable identifier (e.g., `security.strict-csp`) |
| `category` | `security`, `permissions`, `architecture`, `performance`, `ux`, `privacy`, `store-compliance`, `networking` |
| `impact` | `high`, `medium`, `low` |
| `confidence` | 0-1 score indicating detection reliability |
| `appliesTo` | Contexts: `manifest`, `service-worker`, `content-script`, `popup`, `options-page`, `side-panel` |
| `detection` | Hints for agents (signals, file patterns, manifest keys) |
| `recommendation` | `{ action, before, after }` – actionable fix with examples |
| `references` | Links to official Chrome documentation |

## Example Rules

### security.strict-csp
> Enforce strict Content Security Policy. MV3 requires `script-src` and `object-src` to be `self` or `none`.

### architecture.event-driven-sw
> Service workers terminate after ~30s idle. Use `chrome.alarms` instead of `setTimeout` for scheduling.

### networking.declarative-net-request
> Prefer `declarativeNetRequest` over `webRequest` for better performance and privacy.

## Philosophy

-   **Deterministic over clever**: Rules are simple and explicit.
-   **Declarative**: Metadata-driven, effectively "linting for agents".
-   **Opinionated**: Enforces Manifest V3 and strict security by default.
-   **Current**: Based on Chrome Web Store policies for 2024-2025.

## Contributing

Rules are defined in `src/rules/*.ts`. Run `npm run build` to regenerate `dist/agent-rules.json`.

## License

ISC