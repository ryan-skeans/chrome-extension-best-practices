"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rulesByImpact = exports.rulesByCategory = exports.agentRules = void 0;
const permissions_1 = require("./rules/permissions");
const security_1 = require("./rules/security");
const architecture_1 = require("./rules/architecture");
const performance_1 = require("./rules/performance");
const ux_1 = require("./rules/ux");
const privacy_1 = require("./rules/privacy");
const networking_1 = require("./rules/networking");
__exportStar(require("./schema"), exports);
exports.agentRules = [
    ...permissions_1.permissionRules,
    ...security_1.securityRules,
    ...architecture_1.architectureRules,
    ...performance_1.performanceRules,
    ...ux_1.uxRules,
    ...privacy_1.privacyRules,
    ...networking_1.networkingRules
];
exports.rulesByCategory = exports.agentRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
        acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
}, {});
exports.rulesByImpact = exports.agentRules.reduce((acc, rule) => {
    if (!acc[rule.impact]) {
        acc[rule.impact] = [];
    }
    acc[rule.impact].push(rule);
    return acc;
}, {});
