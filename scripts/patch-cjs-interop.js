#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const marker = '__esModule';
const banner = "Object.defineProperty(exports, '__esModule', { value: true });\n";

const patchFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(marker)) {
        return;
    }
    fs.writeFileSync(filePath, banner + content);
};

const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }
        if (entry.name.endsWith('.js') && !entry.name.endsWith('.modern.js')) {
            patchFile(fullPath);
        }
    }
};

if (!fs.existsSync(distDir)) {
    console.error('dist/ not found — run microbundle first');
    process.exit(1);
}

walk(distDir);
console.log('patched CJS __esModule interop in dist/**/*.js');
