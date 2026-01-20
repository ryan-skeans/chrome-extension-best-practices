import { AgentRule } from './schema';
import { permissionRules } from './rules/permissions';
import { securityRules } from './rules/security';
import { architectureRules } from './rules/architecture';
import { performanceRules } from './rules/performance';
import { uxRules } from './rules/ux';
import { privacyRules } from './rules/privacy';
import { networkingRules } from './rules/networking';

export * from './schema';

export const agentRules: AgentRule[] = [
    ...permissionRules,
    ...securityRules,
    ...architectureRules,
    ...performanceRules,
    ...uxRules,
    ...privacyRules,
    ...networkingRules
];

export const rulesByCategory = agentRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
        acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
}, {} as Record<string, AgentRule[]>);

export const rulesByImpact = agentRules.reduce((acc, rule) => {
    if (!acc[rule.impact]) {
        acc[rule.impact] = [];
    }
    acc[rule.impact].push(rule);
    return acc;
}, {} as Record<string, AgentRule[]>);
