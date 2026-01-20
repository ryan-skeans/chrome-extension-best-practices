import { AgentRule } from '../schema';

export const networkingRules: AgentRule[] = [
    {
        id: "networking.declarative-net-request",
        domain: "chrome-extension",
        version: 1,
        category: "networking",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["manifest", "service-worker"],
        detection: {
            signals: ["webRequest", "webRequestBlocking", "chrome.webRequest"],
            filePatterns: ["manifest.json", "**/*.js", "**/*.ts"],
            manifestKeys: ["permissions"]
        },
        summary: "Prefer declarativeNetRequest over webRequest for blocking",
        rationale: "The declarativeNetRequest API is the MV3 replacement for blocking webRequest. It offers better performance (browser-native rule evaluation), improved privacy (no access to request content), and doesn't require broad host permissions for basic blocking.",
        recommendation: {
            action: "Migrate from webRequest to declarativeNetRequest API",
            before: "chrome.webRequest.onBeforeRequest.addListener((details) => { return { cancel: true }; }, { urls: ['*://*.ads.com/*'] }, ['blocking']);",
            after: "// Use declarative_net_request in manifest with rule files\n// manifest.json: \"declarative_net_request\": { \"rule_resources\": [{ \"id\": \"ruleset_1\", \"enabled\": true, \"path\": \"rules.json\" }] }"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest"]
    },
    {
        id: "networking.static-rulesets-for-blocklists",
        domain: "chrome-extension",
        version: 1,
        category: "networking",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["declarative_net_request", "updateDynamicRules"],
            filePatterns: ["manifest.json", "**/*.js", "**/*.ts"],
            manifestKeys: ["declarative_net_request"]
        },
        summary: "Use static rulesets for large, stable blocklists",
        rationale: "Static rules (bundled in extension package) have higher limits (up to 330,000 rules across all extensions) compared to dynamic rules (5,000-30,000). Use static rules for core blocking logic that rarely changes, and dynamic rules only for user-configurable or frequently updated filters.",
        recommendation: {
            action: "Define large blocklists as static rulesets in manifest",
            before: "chrome.declarativeNetRequest.updateDynamicRules({ addRules: thousandsOfRules });",
            after: "// manifest.json: \"declarative_net_request\": { \"rule_resources\": [{ \"id\": \"blocklist\", \"enabled\": true, \"path\": \"blocklist_rules.json\" }] }"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#limits"]
    },
    {
        id: "networking.cors-service-worker",
        domain: "chrome-extension",
        version: 1,
        category: "networking",
        impact: "medium",
        confidence: 0.7,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["fetch(", "XMLHttpRequest", "mode: 'no-cors'"],
            filePatterns: ["background.js", "service-worker.js", "**/*.ts"],
            manifestKeys: ["host_permissions"]
        },
        summary: "Handle CORS properly in service worker fetch requests",
        rationale: "Service workers can make cross-origin requests if host_permissions are declared, but the response mode and headers must be handled correctly. Using 'no-cors' mode returns an opaque response that cannot be read.",
        recommendation: {
            action: "Declare proper host_permissions and use standard fetch mode",
            before: "fetch('https://api.example.com/data', { mode: 'no-cors' })",
            after: "// Add \"host_permissions\": [\"https://api.example.com/*\"] to manifest\nfetch('https://api.example.com/data') // CORS works with host_permissions"
        },
        references: ["https://developer.chrome.com/docs/extensions/develop/concepts/network-requests"]
    }
];
