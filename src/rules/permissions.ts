import { AgentRule } from '../schema';

export const permissionRules: AgentRule[] = [
    {
        id: "permissions.no-all-urls",
        domain: "chrome-extension",
        version: 1,
        category: "permissions",
        impact: "high",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["<all_urls>"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions", "host_permissions"]
        },
        summary: "Avoid requesting <all_urls> permission",
        rationale: "Requesting access to all URLs triggers a separate, more rigorous review process and alarms users during installation. It violates the principle of least privilege.",
        recommendation: {
            action: "Limit host permissions to specific domains",
            before: "\"host_permissions\": [\"<all_urls>\"]",
            after: "\"host_permissions\": [\"https://*.example.com/*\"]"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/permission_warnings/"]
    },
    {
        id: "permissions.minimize-host-permissions",
        domain: "chrome-extension",
        version: 1,
        category: "permissions",
        impact: "high",
        confidence: 0.9,
        appliesTo: ["manifest"],
        detection: {
            signals: ["*://*/*", "http://*/*", "https://*/*"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["host_permissions"]
        },
        summary: "Avoid wildcard host permissions",
        rationale: "Broad wildcard permissions (*://*/*) grant access to every site, presenting a high security risk and reducing user trust.",
        recommendation: {
            action: "Specify exact domains required for functionality",
            before: "\"host_permissions\": [\"*://*/*\"]",
            after: "\"host_permissions\": [\"https://api.myservice.com/*\"]"
        },
        references: ["https://developer.chrome.com/docs/extensions/mv3/declare_permissions/"]
    },
    {
        id: "permissions.active-tab",
        domain: "chrome-extension",
        version: 1,
        category: "permissions",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["tabs"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions"]
        },
        summary: "Prefer activeTab over broad tabs or host permissions",
        rationale: "The activeTab permission grants temporary access to the current tab only when the user invokes the extension (via click, keyboard shortcut, or context menu). This avoids permanent host permissions and reduces user friction. Note: 'tabs' permission is still needed if you require tab.url/title without a user gesture.",
        recommendation: {
            action: "Replace 'tabs' or host permissions with 'activeTab' where interactive access is sufficient",
            before: "\"permissions\": [\"tabs\"]",
            after: "\"permissions\": [\"activeTab\"]"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/tabs#manifest"]
    },
    {
        id: "permissions.clipboard-access",
        domain: "chrome-extension",
        version: 1,
        category: "permissions",
        impact: "medium",
        confidence: 1,
        appliesTo: ["manifest"],
        detection: {
            signals: ["clipboardRead", "clipboardWrite"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions"]
        },
        summary: "Use clipboard permissions only when necessary",
        rationale: "Clipboard access is sensitive. Ensure it is absolutely required for the core feature set.",
        recommendation: {
            action: "Remove clipboard permissions if not critical, or use the standard Clipboard API with user gesture",
            before: "\"permissions\": [\"clipboardRead\"]",
            after: "// Use navigator.clipboard.readText() inside a user-triggered event handler"
        }
    },
    {
        id: "permissions.optional-permissions",
        domain: "chrome-extension",
        version: 1,
        category: "permissions",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["permissions"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["permissions", "optional_permissions"]
        },
        summary: "Use optional_permissions for non-critical features",
        rationale: "Optional permissions are requested at runtime when the user needs the feature, rather than at install time. This reduces friction during installation and follows the principle of least privilege. Users are more likely to install extensions that request fewer upfront permissions.",
        recommendation: {
            action: "Move non-essential permissions to optional_permissions",
            before: "\"permissions\": [\"storage\", \"tabs\", \"downloads\", \"bookmarks\"]",
            after: "\"permissions\": [\"storage\"],\n\"optional_permissions\": [\"tabs\", \"downloads\", \"bookmarks\"]"
        },
        references: ["https://developer.chrome.com/docs/extensions/reference/api/permissions"]
    }
];
