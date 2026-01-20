---
name: Chrome Extension Best Practices
version: 1.1.1
description: |
  Activate this skill when the user is building, debugging, or reviewing a Chrome Extension 
  (browser extension). Triggers include: manifest.json files, service workers, content scripts, 
  popup pages, side panels, options pages, or any code using chrome.* APIs. This skill provides 
  44 authoritative rules for Manifest V3 compliance, security, performance, and Chrome Web Store policies.
license: ISC
---

# Chrome Extension Best Practices

This skill provides **44 authoritative rules** for building high-quality Chrome Extensions using Manifest V3.
It is designed to be deterministic, strict, and aligned with Chrome Web Store policies (2024-2025).

## When to Activate

Use this skill when the user is working with:
- `manifest.json` files for Chrome/Chromium extensions
- Service worker scripts (background.js)
- Content scripts that inject into web pages
- Popup, options page, or side panel UI
- Any code using `chrome.*` or `browser.*` APIs
- Extension debugging, review, or migration from MV2 to MV3

## Core Rules

The complete rules are defined in `dist/agent-rules.json`. When helping the user write Chrome Extension code, you **MUST** cross-reference your code against these rules.

### Rule Categories

| Category | Count | Focus |
|----------|-------|-------|
| **security** | 10 | CSP, XSS prevention, message passing, web accessible resources |
| **architecture** | 8 | Service worker lifecycle, state management, event handling |
| **permissions** | 5 | Least privilege, activeTab, optional permissions |
| **performance** | 4 | Programmatic injection, storage optimization, offscreen docs |
| **ux** | 7 | Options pages, popups, side panels, keyboard shortcuts |
| **privacy** | 2 | Data minimization, permission justification |
| **store-compliance** | 5 | Single purpose, code readability, privacy policy |
| **networking** | 3 | declarativeNetRequest, CORS handling |

## How to Use

1. **Analyze Code**: Load and inspect `manifest.json`, background scripts, and content scripts.
2. **Cross-Reference Rules**: Check code patterns against rules in `dist/agent-rules.json`.
3. **Flag Violations**: If a pattern violates a rule, report the `rule.id` and `rule.summary`.
4. **Suggest Fixes**: Use the `recommendation.action` and `recommendation.after` fields.

## Key Rules to Enforce

- **security.strict-csp**: MV3 requires `script-src` and `object-src` to be `self` or `none`.
- **architecture.event-driven-sw**: Service workers terminate after ~30s idle. Use `chrome.alarms` instead of `setTimeout`.
- **permissions.least-privilege**: Request only the minimum permissions needed.
- **networking.declarative-net-request**: Prefer `declarativeNetRequest` over `webRequest`.

## Rule Schema

Each rule in `dist/agent-rules.json` follows this structure:

```json
{
  "id": "category.rule-name",
  "category": "security|permissions|architecture|...",
  "impact": "high|medium|low",
  "confidence": 0.0-1.0,
  "appliesTo": ["manifest", "service-worker", "content-script", ...],
  "detection": { "signals": [...], "filePatterns": [...] },
  "recommendation": { "action": "...", "before": "...", "after": "..." },
  "references": ["https://..."]
}
```
