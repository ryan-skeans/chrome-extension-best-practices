import * as fs from 'fs';
import * as path from 'path';
import { agentRules } from './index';

const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const outputPath = path.join(distDir, 'agent-rules.json');
fs.writeFileSync(outputPath, JSON.stringify(agentRules, null, 2));

console.log(`Generated ${outputPath} with ${agentRules.length} rules.`);
