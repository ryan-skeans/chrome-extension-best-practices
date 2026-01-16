"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceRules = void 0;
exports.performanceRules = [
    {
        id: "performance.programmatic-injection",
        domain: "chrome-extension",
        version: 1,
        category: "performance",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["content_scripts"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["content_scripts"]
        },
        summary: "Prefer programmatic injection for large content scripts",
        rationale: "Declaring static content scripts injects them into every matching page, consuming memory even if not used. Programmatic injection runs code only when needed.",
        recommendation: {
            action: "Use chrome.scripting.executeScript trigger by user action",
            before: "\"content_scripts\": [{ \"js\": [\"heavy.js\"], \"matches\": [\"<all_urls>\"] }]",
            after: "// In background.js: chrome.action.onClicked.addListener((tab) => { chrome.scripting.executeScript(...) });"
        }
    },
    {
        id: "performance.storage-local-vs-sync",
        domain: "chrome-extension",
        version: 1,
        category: "performance",
        impact: "medium",
        confidence: 0.7,
        appliesTo: ["service-worker", "popup"],
        detection: {
            signals: ["chrome.storage.sync.set"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Use storage.local for large data",
        rationale: "chrome.storage.sync has strict quotas (100KB total). Large datasets will cause write failures.",
        recommendation: {
            action: "Use chrome.storage.local for non-settings data",
            before: "chrome.storage.sync.set({ largeCacheData: ... });",
            after: "chrome.storage.local.set({ largeCacheData: ... });"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/storage/#property-sync"]
    },
    {
        id: "performance.offscreen-documents",
        domain: "chrome-extension",
        version: 1,
        category: "performance",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["document.createElement", "DOMParser"],
            filePatterns: ["background.js", "service-worker.js"],
            manifestKeys: []
        },
        summary: "Use offscreen documents for DOM parsing in SW",
        rationale: "Service workers do not have access to the DOM. usage of window or document will fail. Use the Offscreen API.",
        recommendation: {
            action: "Create an offscreen document to parse HTML",
            before: "const doc = new DOMParser().parseFromString(html, 'text/html');",
            after: "await chrome.offscreen.createDocument({ ... }); // Send message to offscreen doc to parse"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/offscreen/"]
    },
    {
        id: "performance.content-script-idle",
        domain: "chrome-extension",
        version: 1,
        category: "performance",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["document_start", "document_end"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["content_scripts"]
        },
        summary: "Execute content scripts at document_idle",
        rationale: "Running scripts at 'document_start' blocks the rendering path. 'document_idle' (default) ensures the page is usable before your script runs, improving perceived performance.",
        recommendation: {
            action: "Use 'document_idle' unless early injection is critical",
            before: "\"run_at\": \"document_start\"",
            after: "\"run_at\": \"document_idle\""
        }
    }
];
