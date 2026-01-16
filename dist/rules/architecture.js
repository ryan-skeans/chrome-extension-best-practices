"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.architectureRules = void 0;
exports.architectureRules = [
    {
        id: "architecture.event-driven-sw",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["setInterval", "setTimeout"],
            filePatterns: ["background.js", "service-worker.js", "**/*.ts"],
            manifestKeys: ["background"]
        },
        summary: "Ensure service worker is event-driven",
        rationale: "Service workers are ephemeral and terminate when idle (typically after 30 seconds). Using setTimeout or setInterval for longer delays will fail when the worker sleeps.",
        recommendation: {
            action: "Use the chrome.alarms API for scheduling tasks",
            before: "setInterval(checkUpdates, 60000);",
            after: "chrome.alarms.create('checkUpdates', { periodInMinutes: 1 }); chrome.alarms.onAlarm.addListener((a) => { if(a.name === 'checkUpdates') checkUpdates(); });"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/service_workers/"]
    },
    {
        id: "architecture.no-global-state",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "high",
        confidence: 0.8,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["var ", "let ", "const ", "window."],
            filePatterns: ["background.js", "**/*context.js"],
            manifestKeys: []
        },
        summary: "Avoid relying on global variables in service workers",
        rationale: "Service workers restart frequently, wiping global variables. Use 'chrome.storage.session' for in-memory persistence during a browser session, or 'chrome.storage.local' for long-term storage.",
        recommendation: {
            action: "Persist state to storage",
            before: "let userCount = 0;",
            after: "await chrome.storage.session.set({ userCount: 0 });"
        }
    },
    {
        id: "architecture.mv3-manifest-version",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["\"manifest_version\": 2"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["manifest_version"]
        },
        summary: "Must use Manifest V3",
        rationale: "Manifest V2 is deprecated and will be removed. All new extensions must use V3.",
        recommendation: {
            action: "Set manifest_version to 3",
            before: "\"manifest_version\": 2",
            after: "\"manifest_version\": 3"
        }
    },
    {
        id: "architecture.separation-of-concerns",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "medium",
        confidence: 0.6,
        appliesTo: ["content-script"],
        detection: {
            signals: ["chrome.runtime.sendMessage", "inlined logic"],
            filePatterns: ["content.js"],
            manifestKeys: []
        },
        summary: "Separate UI from business logic",
        rationale: "Content scripts should communicate with the background service worker for heavier logic or cross-origin requests, rather than doing everything in the page context.",
        recommendation: {
            action: "Move complex logic to Service Worker and use messaging",
            before: "// Heavy logic in content script",
            after: "chrome.runtime.sendMessage({ type: 'PROCESS_DATA', payload: data });"
        }
    },
    {
        id: "architecture.toplevel-listeners",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "high",
        confidence: 0.7,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["chrome.runtime.onInstalled.addListener", "chrome.runtime.onMessage.addListener"],
            filePatterns: ["background.js", "service-worker.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Register event listeners synchronously at the top level",
        rationale: "Service workers are ceased when idle and restarted on events. If listeners are registered asynchronously (e.g., inside other functions or promises), they may not be attached in time to handle the waking event, causing failure.",
        recommendation: {
            action: "Move all event listeners to the global scope",
            before: "async function init() { chrome.runtime.onMessage.addListener(...) }",
            after: "chrome.runtime.onMessage.addListener(...)"
        }
    }
];
