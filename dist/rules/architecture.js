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
        rationale: "Service workers are ephemeral and terminate after ~30 seconds of inactivity. Individual requests have a 5-minute timeout. Using setTimeout or setInterval for delays beyond these limits will fail when the worker terminates. Use chrome.alarms API for scheduling, and persist state to storage.",
        recommendation: {
            action: "Use the chrome.alarms API for scheduling tasks",
            before: "setInterval(checkUpdates, 60000);",
            after: "chrome.alarms.create('checkUpdates', { periodInMinutes: 1 }); chrome.alarms.onAlarm.addListener((a) => { if(a.name === 'checkUpdates') checkUpdates(); });"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle"]
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
    },
    {
        id: "architecture.use-storage-session",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["chrome.storage.local", "let ", "var "],
            filePatterns: ["background.js", "service-worker.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Use storage.session for service worker state",
        rationale: "chrome.storage.session provides in-memory storage that persists across service worker restarts within the same browser session. Unlike storage.local, it doesn't persist to disk and is cleared when the browser closes, making it ideal for temporary runtime state.",
        recommendation: {
            action: "Use storage.session for transient service worker state",
            before: "let cachedData = null; // Lost on SW restart",
            after: "await chrome.storage.session.set({ cachedData: data });\nconst { cachedData } = await chrome.storage.session.get('cachedData');"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/storage#property-session"]
    },
    {
        id: "architecture.on-installed-handler",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "medium",
        confidence: 0.9,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["chrome.runtime.onInstalled"],
            filePatterns: ["background.js", "service-worker.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Use onInstalled for one-time initialization",
        rationale: "The chrome.runtime.onInstalled event fires once on install, update, or Chrome update. Use it for one-time setup like creating context menus, setting default storage values, or opening an onboarding page. Don't put initialization logic that should run on every service worker start.",
        recommendation: {
            action: "Set up one-time initialization in onInstalled handler",
            before: "// Context menu created every time SW starts\nchrome.contextMenus.create({ id: 'myMenu', title: 'My Menu' });",
            after: "chrome.runtime.onInstalled.addListener(() => {\n  chrome.contextMenus.create({ id: 'myMenu', title: 'My Menu' });\n});"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled"]
    },
    {
        id: "architecture.promise-based-apis",
        domain: "chrome-extension",
        version: 1,
        category: "architecture",
        impact: "low",
        confidence: 0.8,
        appliesTo: ["service-worker", "popup", "options-page", "content-script"],
        detection: {
            signals: ["chrome.", "function(", "callback"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Prefer async/await over callbacks for chrome.* APIs",
        rationale: "All chrome.* APIs in MV3 support Promises. Using async/await leads to cleaner, more maintainable code and better error handling compared to callback-based patterns.",
        recommendation: {
            action: "Use async/await with chrome.* APIs",
            before: "chrome.storage.local.get(['key'], (result) => { console.log(result.key); });",
            after: "const { key } = await chrome.storage.local.get(['key']);\nconsole.log(key);"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/migrate/api-calls"]
    }
];
