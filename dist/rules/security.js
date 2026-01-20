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
    },
    {
        id: "security.web-accessible-resources-restrict",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["manifest"],
        detection: {
            signals: ["web_accessible_resources", "\"matches\": [\"<all_urls>\"]"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["web_accessible_resources"]
        },
        summary: "Restrict web_accessible_resources to specific origins",
        rationale: "Web accessible resources can be loaded by any website if not restricted, enabling fingerprinting attacks and potential XSS if the resources have vulnerabilities. Always specify exact origin matches and consider using use_dynamic_url for anti-fingerprinting.",
        recommendation: {
            action: "Add matches array to restrict which sites can access resources",
            before: "\"web_accessible_resources\": [{ \"resources\": [\"script.js\"], \"matches\": [\"<all_urls>\"] }]",
            after: "\"web_accessible_resources\": [{ \"resources\": [\"script.js\"], \"matches\": [\"https://trusted-site.com/*\"], \"use_dynamic_url\": true }]"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources"]
    },
    {
        id: "security.externally-connectable-restrict",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["manifest"],
        detection: {
            signals: ["externally_connectable", "\"matches\": [\"*://*/*\"]"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["externally_connectable"]
        },
        summary: "Restrict externally_connectable to specific domains",
        rationale: "The externally_connectable manifest key allows web pages to send messages to your extension. Using broad patterns exposes your extension to attacks from malicious websites. Always specify exact domains that need to communicate with your extension.",
        recommendation: {
            action: "Specify exact domains in externally_connectable matches",
            before: "\"externally_connectable\": { \"matches\": [\"*://*.example.com/*\"] }",
            after: "\"externally_connectable\": { \"matches\": [\"https://app.example.com/*\"] }"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/concepts/messaging#external-webpage"]
    },
    {
        id: "security.avoid-eval-patterns",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 1,
        appliesTo: ["service-worker", "content-script", "popup", "options-page"],
        detection: {
            signals: ["eval(", "new Function(", "setTimeout(\"", "setInterval(\""],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Avoid eval and eval-like patterns",
        rationale: "eval(), new Function(), and setTimeout/setInterval with string arguments execute arbitrary code and are prohibited in MV3. These patterns create security vulnerabilities and will cause CSP violations.",
        recommendation: {
            action: "Replace eval patterns with safe alternatives",
            before: "setTimeout(\"doSomething(\" + id + \")\", 100);",
            after: "setTimeout(() => doSomething(id), 100);"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/migrate/improve-security"]
    },
    {
        id: "security.sanitize-content-script-input",
        domain: "chrome-extension",
        version: 1,
        category: "security",
        impact: "high",
        confidence: 0.8,
        appliesTo: ["content-script"],
        detection: {
            signals: ["document.getElementById", "document.querySelector", "getAttribute"],
            filePatterns: ["content.js", "content-script.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Sanitize all data extracted from web pages",
        rationale: "Content scripts run in the context of potentially malicious web pages. Any data read from the DOM (element text, attributes, etc.) should be treated as untrusted and validated before use, especially before passing to the service worker or using in privileged operations.",
        recommendation: {
            action: "Validate and sanitize DOM-extracted data before use",
            before: "const data = document.getElementById('data').textContent;\nchrome.runtime.sendMessage({ payload: data });",
            after: "const data = document.getElementById('data')?.textContent || '';\nconst sanitized = data.slice(0, 1000); // Limit size\nif (isValidFormat(sanitized)) { chrome.runtime.sendMessage({ payload: sanitized }); }"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#security"]
    }
];
