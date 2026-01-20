import { AgentRule } from '../schema';

export const privacyRules: AgentRule[] = [
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
    },
    {
        id: "store-compliance.no-obfuscated-code",
        domain: "chrome-extension",
        version: 1,
        category: "store-compliance",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest", "service-worker", "content-script", "popup"],
        detection: {
            signals: ["eval", "atob", "String.fromCharCode", "_0x"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: []
        },
        summary: "No obfuscated or minified code that hides functionality",
        rationale: "The Chrome Web Store prohibits code obfuscation. All code must be human-readable. Minification is allowed if it only removes whitespace/comments, but obfuscation that conceals functionality (like variable mangling or string encoding) will result in rejection.",
        recommendation: {
            action: "Use readable code or simple minification without obfuscation",
            before: "var _0x1a2b=['log'];(function(_0x2d8f){...",
            after: "console.log('Hello'); // Clear, readable code"
        },
        references: ["https://developer.chrome.com/docs/webstore/program-policies/code-readability/"]
    },
    {
        id: "store-compliance.privacy-policy-required",
        domain: "chrome-extension",
        version: 1,
        category: "store-compliance",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["storage", "cookies", "history", "tabs"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions"]
        },
        summary: "Privacy policy required when collecting user data",
        rationale: "Extensions that access user data (storage, cookies, browsing history, etc.) must provide a valid privacy policy URL in the Chrome Web Store listing. The policy must describe what data is collected, how it's used, and how it's shared.",
        recommendation: {
            action: "Add privacy policy URL to Chrome Web Store listing",
            before: "// No privacy policy provided",
            after: "// Add privacy policy URL in Developer Dashboard under 'Privacy' tab"
        },
        references: ["https://developer.chrome.com/docs/webstore/program-policies/user-data-faq/"]
    },
    {
        id: "store-compliance.accurate-listing",
        domain: "chrome-extension",
        version: 1,
        category: "store-compliance",
        impact: "high",
        confidence: 0.7,
        appliesTo: ["manifest"],
        detection: {
            signals: ["name", "description"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["name", "description"]
        },
        summary: "Extension behavior must match store listing",
        rationale: "As of 2024, all elements in your product listing (description, screenshots, videos) must accurately represent the extension's functionality. Extensions that behave differently than described face removal from the Chrome Web Store.",
        recommendation: {
            action: "Ensure manifest description and store listing accurately describe all functionality",
            before: "\"description\": \"Simple tab manager\" // but actually injects ads",
            after: "\"description\": \"Tab manager with sponsored suggestions\" // accurately describes behavior"
        },
        references: ["https://developer.chrome.com/docs/webstore/program-policies/listing-requirements/"]
    }
];
