"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyRules = void 0;
exports.privacyRules = [
    {
        id: "privacy.minimize-data-collection",
        domain: "chrome-extension",
        version: 1,
        category: "privacy",
        impact: "high",
        confidence: 0.6,
        appliesTo: ["content-script", "service-worker"],
        detection: {
            signals: ["google-analytics", "mixpanel", "tracking"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "Minimize data collection",
        rationale: "Collect only the minimal amount of data necessary. Excessive tracking can lead to store rejection.",
        recommendation: {
            action: "Review data collection practices and ensure they are disclosed",
            before: "ga('send', 'pageview', window.location.href);",
            after: "// Only track internal interactions, or anonymize URLs"
        }
    },
    {
        id: "store-compliance.single-purpose",
        domain: "chrome-extension",
        version: 1,
        category: "store-compliance",
        impact: "high",
        confidence: 0.5,
        appliesTo: ["manifest"],
        detection: {
            signals: ["description"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["description"]
        },
        summary: "Extension must have a single purpose",
        rationale: "The Chrome Web Store requires extensions to have a single, narrow purpose. Bundling unrelated features violates this policy.",
        recommendation: {
            action: "Split unrelated features into separate extensions",
            before: "// Extension does weather, sports, and stocks",
            after: "// Extension only does weather"
        },
        references: ["https://developer.chrome.com/docs/webstore/program_policies/single_purpose/"]
    },
    {
        id: "store-compliance.meaningful-description",
        domain: "chrome-extension",
        version: 1,
        category: "store-compliance",
        impact: "medium",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["description"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["description"]
        },
        summary: "Provide a meaningful description",
        rationale: "The manifest description must detail what the extension does. 'My Extension' or blank descriptions are grounds for rejection.",
        recommendation: {
            action: "Write a descriptive summary (> 10 words)",
            before: "\"description\": \"My Extension\"",
            after: "\"description\": \"A productivity tool to organize your tabs by domain and frequency.\""
        }
    },
    {
        id: "privacy.permissions-justification",
        domain: "chrome-extension",
        version: 1,
        category: "privacy",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["permissions"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions"]
        },
        summary: "Justify all permissions",
        rationale: "You must justify every permission in the privacy tab of the developer dashboard. Unused permissions should be removed.",
        recommendation: {
            action: "Remove unused permissions",
            before: "\"permissions\": [\"tabs\", \"storage\", \"management\"]",
            after: "\"permissions\": [\"storage\"]"
        }
    }
];
