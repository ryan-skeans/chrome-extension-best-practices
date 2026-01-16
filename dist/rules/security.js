"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRules = void 0;
exports.securityRules = [
    {
        id: "security.no-remote-code",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest", "content-script", "service-worker"],
        detection: {
            signals: ["eval", "new Function", "generated-script"],
            filePatterns: ["**/*.js", "**/*.ts", "manifest.json"],
            manifestKeys: ["content_security_policy"]
        },
        summary: "Remote code execution is prohibited",
        rationale: "Manifest V3 strictly forbids remotely hosted code (including via eval or handling scripts from external servers).",
        recommendation: {
            action: "Bundle all necessary libraries inside the extension package",
            before: "script.src = 'https://cdn.example.com/lib.js';",
            after: "import { lib } from './local-lib.js';"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#remotely-hosted-code"]
    },
    {
        id: "security.strict-csp",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["unsafe-eval", "unsafe-inline", "https:", "http:"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["content_security_policy"]
        },
        summary: "Enforce strict Content Security Policy (CSP)",
        rationale: "Manifest V3 requires 'script-src' and 'object-src' to be 'self' or 'none'. 'unsafe-eval' is only permitted in sandboxed pages, and remote sources are banned.",
        recommendation: {
            action: "Remove remote domains and unsafe policies from CSP",
            before: "\"content_security_policy\": { \"extension_pages\": \"script-src 'self' https://example.com; object-src 'self'\" }",
            after: "\"content_security_policy\": { \"extension_pages\": \"script-src 'self'; object-src 'self'\" }"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/"]
    },
    {
        id: "security.content-script-isolation",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["manifest"],
        detection: {
            signals: ["\"world\": \"MAIN\""],
            filePatterns: ["manifest.json"],
            manifestKeys: ["content_scripts"]
        },
        summary: "Avoid running content scripts in the MAIN world",
        rationale: "Scripts in the MAIN world share the host page's execution environment, allowing the page to interfere with them or steal data. Use the default ISOLATED world for security.",
        recommendation: {
            action: "Remove 'world': 'MAIN' or switch to 'ISOLATED'",
            before: "\"content_scripts\": [{ \"world\": \"MAIN\", ... }]",
            after: "\"content_scripts\": [{ \"world\": \"ISOLATED\", ... }]"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/content_scripts/#isolated_world"]
    },
    {
        id: "security.safe-message-passing",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 0.8,
        appliesTo: ["service-worker", "content-script"],
        detection: {
            signals: ["runtime.onMessage.addListener", "sender.tab", "sender.id"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Validate sender in all message listeners",
        rationale: "Message listeners can receive messages from other extensions or websites if 'externally_connectable' is defined. Even without it, validating 'sender.id' ensures you are only processing trusted checks.",
        recommendation: {
            action: "Check sender.id equals chrome.runtime.id in listeners",
            before: "chrome.runtime.onMessage.addListener((msg) => { doWork(msg); });",
            after: "chrome.runtime.onMessage.addListener((msg, sender) => { if (sender.id !== chrome.runtime.id) return; doWork(msg); });"
        }
    },
    {
        id: "security.https-only",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 1,
        appliesTo: ["service-worker", "content-script"],
        detection: {
            signals: ["http://"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Use HTTPS for all network requests",
        rationale: "Unencrypted HTTP requests are vulnerable to MITM attacks. Chrome extensions should only communicate over secure channels.",
        recommendation: {
            action: "Change all API endpoints to https://",
            before: "fetch('http://api.example.com/data')",
            after: "fetch('https://api.example.com/data')"
        }
    },
    {
        id: "security.inner-html",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "medium",
        confidence: 0.7,
        appliesTo: ["popup", "options-page", "content-script"],
        detection: {
            signals: ["innerHTML", "outerHTML"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Avoid using innerHTML to prevent XSS",
        rationale: "Assigning strings to innerHTML can lead to Cross-Site Scripting (XSS) if the data is not sanitized.",
        recommendation: {
            action: "Use textContent or standard DOM creation methods",
            before: "element.innerHTML = userInput;",
            after: "element.textContent = userInput;"
        }
    }
];
