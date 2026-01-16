---
name: Chrome Extension Best Practices
description: Expert guidance and rules for building Manifest V3 Chrome Extensions (Security, Performance, Architecture).
---

# Chrome Extension Best Practices

This skill provides authoritative rules for building high-quality Chrome Extensions using Manifest V3.
It is designed to be deterministic and strict.

## Core Rules

The rules are defined in `dist/agent-rules.json`.
When helping the user write Chrome Extension code, you MUST cross-reference your code against these rules.

### Categories
- **Security**: Strict CSP, no remote code, safe message passing.
- **Architecture**: Event-driven Service Workers, no global state.
- **Performance**: Lazy-load content scripts, use storage.local.
- **UX**: Accessibility, clean context menus.

## Usage

1. **Analyze Code**: Check `manifest.json`, background scripts, and content scripts.
2. **Apply Rules**: If a pattern violates a rule in `dist/agent-rules.json`, flag it.
3. **Fix**: Use the provided `recommendation` in the rule to suggest a fix.
