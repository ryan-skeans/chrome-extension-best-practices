import { AgentRule } from '../schema';

export const uxRules: AgentRule[] = [
    {
        id: "ux.options-ui",
        domain: "chrome-extension",
        version: 1,
        category: "ux",
        impact: "medium",
        confidence: 0.9,
        appliesTo: ["manifest"],
        detection: {
            signals: ["options_ui", "options_page"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["options_ui"]
        },
        summary: "Provide an Options Page for configuration",
        rationale: "Users expect to customize extension behavior via standard Chrome extension management interfaces.",
        recommendation: {
            action: "Define 'options_ui' in manifest",
            before: "// missing options_ui",
            after: "\"options_ui\": { \"page\": \"options.html\", \"open_in_tab\": false }"
        }
    },
    {
        id: "ux.action-popup",
        domain: "chrome-extension",
        version: 1,
        category: "ux",
        impact: "medium",
        confidence: 0.8,
        appliesTo: ["manifest"],
        detection: {
            signals: ["action", "default_popup"],
            filePatterns: ["manifest.json"],
            manifestKeys: ["action"]
        },
        summary: "Use a popup for quick interactions",
        rationale: "Popups provide instant context and control without navigating away from the current page.",
        recommendation: {
            action: "Add a default_popup to the action key",
            before: "\"action\": {}",
            after: "\"action\": { \"default_popup\": \"popup.html\" }"
        }
    },
    {
        id: "ux.clean-context-menus",
        domain: "chrome-extension",
        version: 1,
        category: "ux",
        impact: "low",
        confidence: 0.7,
        appliesTo: ["service-worker"],
        detection: {
            signals: ["chrome.contextMenus.create", "parentId"],
            filePatterns: ["**/*.js", "**/*.ts"],
            manifestKeys: ["permissions"]
        },
        summary: "Group context menu items",
        rationale: "Adding multiple top-level context menu items pollutes the browser UI. Group them under a single parent item.",
        recommendation: {
            action: "Create a parent menu item and attach children to it",
            before: "chrome.contextMenus.create({ id: 'item1' }); chrome.contextMenus.create({ id: 'item2' });",
            after: "chrome.contextMenus.create({ id: 'parent' }); chrome.contextMenus.create({ id: 'item1', parentId: 'parent' });"
        }
    },
    {
        id: "ux.explicit-user-triggers",
        domain: "chrome-extension",
        version: 1,
        category: "ux",
        impact: "medium",
        confidence: 0.6,
        appliesTo: ["content-script"],
        detection: {
            signals: ["window.onload", "document.ready"],
            filePatterns: ["content.js", "**/*.js"],
            manifestKeys: []
        },
        summary: "Avoid auto-triggering actions on load",
        rationale: "Extensions should generally wait for user intent (clicks, keypresses) rather than running immediately upon page load, unless that is the primary purpose.",
        recommendation: {
            action: "Bind functionality to user events",
            before: "runMyLogic(); // at top of file",
            after: "document.addEventListener('click', runMyLogic);"
        }
    },
    {
        id: "ux.accessibility-tabindex",
        domain: "chrome-extension",
        version: 1,
        category: "ux",
        impact: "medium",
        confidence: 0.9,
        appliesTo: ["popup", "options-page"],
        detection: {
            signals: ["tabindex=\"[1-9]\"", "tabindex='[1-9]'"],
            filePatterns: ["**/*.html", "**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
            manifestKeys: []
        },
        summary: "Avoid positive tabindex values",
        rationale: "Positive 'tabindex' values disrupt natural tab order, making keyboard navigation confusing. Use '0' (focusable) or '-1' (not focusable) instead.",
        recommendation: {
            action: "Remove positive tabindex or set to 0",
            before: "<button tabindex='1'>Click</button>",
            after: "<button tabindex='0'>Click</button>"
        }
    }
];
