# Chrome Extension Best Practices - Agent Skill

**Production-ready Agent Skill npm package for Chrome Extensions (Manifest V3).**

This package is not primarily for human reading. It is a **machine-readable skill module** designed to be installed into coding agents (like Cursor, Claude Code, Codex, Opencode) so they can:
1.  **Detect** problematic Chrome extension patterns.
2.  **Name** the violated best practice.
3.  **Explain** why it matters.
4.  **Suggest** concrete fixes.

It exports authoritative, opinionated, and deterministic rules based on Google's Chrome Web Store guidelines and security best practices.

## Installation

```bash
npm install chrome-extension-best-practices
```

Or consume via an Agent Skill loader:

```bash
npx add-skill chrome-extension-best-practices
```

## Usage for Agents

This package exports a raw JSON artifact containing all rules, enabling agents to ingest knowledge without parsing prose.

```typescript
import { agentRules, rulesByCategory } from 'chrome-extension-best-practices';

// 1. Ingest Rules
const rules = agentRules; 

// 2. Analyze Code context
// (Agent Logic Here) checks file contents against rule.detection hints...

// 3. Provide Feedback
if (violated rule) {
  print(rule.summary);
  print(rule.recommendation.action);
  print(rule.recommendation.after);
}
```

### Raw JSON Access

The rules are also available as a static JSON file in the distribution:

`node_modules/chrome-extension-best-practices/dist/agent-rules.json`

## Rule Structure

Each rule follows the `AgentRule` schema:

*   **id**: Stable identifier (e.g., `permissions.no-all-urls`).
*   **category**: `security`, `permissions`, `architecture`, `performance`, `ux`, `privacy`.
*   **impact**: `high` | `medium` | `low`.
*   **detection**: Hints for agents (files to check, regex signals).
*   **recommendation**: `{ action, before, after }` – actionable deterministic fix.

## Philosophy

*   **Deterministic over clever**: Rules are simple and explicit.
*   **Declarative**: Logic is properly metadata, effectively "linting for agents".
*   **Opinionated**: Enforces Manifest V3 and strict security by default.