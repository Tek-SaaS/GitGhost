#!/usr/bin/env node

const { execSync } = require('child_process');

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

const command = process.argv[2];

if (!command || command === 'help' || command === '--help') {
    console.log(`
${colors.blue}git-ghost v1.0.0${colors.reset}
${colors.gray}Repository cleanup tool${colors.reset}

${colors.yellow}Usage:${colors.reset}
  git-ghost audit               # Detect issues (read-only, no changes)
  git-ghost fix                 # Create local branch with fixes
  git-ghost fix --pr            # Create branch + Pull Request
  git-ghost restore <file>      # Restore a file from .ghost/
  git-ghost history             # Show cleanup history

${colors.yellow}Examples:${colors.reset}
  git-ghost audit
  git-ghost fix --pr
  git-ghost restore styles/old.css
`);
    process.exit(0);
}

try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
    console.log(`${colors.red}❌ Not inside a Git repository${colors.reset}`);
    process.exit(1);
}

switch (command) {
    case 'audit':
        require('../lib/audit')();
        break;
    case 'fix':
        const createPR = process.argv.includes('--pr');
        require('../lib/fix')({ createPR });
        break;
    case 'restore':
        const file = process.argv[3];
        require('../lib/restore')(file);
        break;
    case 'history':
        require('../lib/history')();
        break;
    default:
        console.log(`${colors.red}❌ Unknown command: ${command}${colors.reset}`);
        console.log(`Run 'git-ghost help' to see available commands`);
        process.exit(1);
}