const fs = require('fs');

const content = fs.readFileSync('scripts/generatedEmployees.txt', 'utf8');
const tsContent = `import { Employee } from "./types";

export const generatedMalaysianEmployees: Employee[] = [
${content}
];
`;

fs.writeFileSync('lib/data/generatedEmployees.ts', tsContent);
console.log('Created generatedEmployees.ts successfully!');
