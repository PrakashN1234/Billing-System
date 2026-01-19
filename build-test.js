#!/usr/bin/env node

// Build test script for Netlify deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting build test...');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }

  // Check if build script exists
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.scripts || !packageJson.scripts.build) {
    throw new Error('Build script not found in package.json');
  }

  console.log('✅ package.json and build script found');

  // Check Node version
  const nodeVersion = process.version;
  console.log(`📦 Node version: ${nodeVersion}`);

  // Install dependencies
  console.log('📥 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Run build
  console.log('🏗️ Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if build folder exists
  if (!fs.existsSync('build')) {
    throw new Error('Build folder not created');
  }

  // Check if index.html exists in build
  if (!fs.existsSync('build/index.html')) {
    throw new Error('index.html not found in build folder');
  }

  console.log('✅ Build test completed successfully!');
  console.log('📁 Build folder created with index.html');

  // List build contents
  const buildContents = fs.readdirSync('build');
  console.log('📋 Build contents:', buildContents);

} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}