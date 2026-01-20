export type RuleCategory =
    | "security"
    | "permissions"
    | "architecture"
    | "performance"
    | "ux"
    | "privacy"
    | "store-compliance"
    | "networking";

export type RuleImpact = "high" | "medium" | "low";

export type ExtensionContext =
    | "manifest"
    | "service-worker"
    | "content-script"
    | "popup"
    | "options-page"
    | "side-panel";

export interface DetectionHints {
    signals: string[];
    filePatterns: string[];
    manifestKeys: string[];
}

export interface Recommendation {
    action: string;
    before: string;
    after: string;
}

export interface AgentRule {
    id: string;
    domain: "chrome-extension";
    version: number;
    category: RuleCategory;
    impact: RuleImpact;
    confidence: number;
    appliesTo: ExtensionContext[];
    detection: DetectionHints;
    summary: string;
    rationale: string;
    recommendation: Recommendation;
    references?: string[];
}
