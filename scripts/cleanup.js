#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to remove
const filesToRemove = [
  'V0_Frontend_Monorepo_Migration_Instructions.md',
  'Remaining_Tasks_Actual.md',
  'package-lock.json',
  '.DS_Store',
];

// Directories to clean
const dirsToClean = [
  '.turbo',
  'node_modules/.cache',
  'coverage',
  '.nyc_output',
];

// Function to remove file
function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${filePath}:`, error);
  }
}

// Function to clean directory
function cleanDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Cleaned: ${dirPath}`);
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${dirPath}:`, error);
  }
}

// Function to find and remove .DS_Store files
function removeDSStoreFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removeDSStoreFiles(filePath);
    } else if (file === '.DS_Store') {
      removeFile(filePath);
    }
  });
}

// Main cleanup function
function cleanup() {
  console.log('🧹 Starting cleanup...\n');

  // Remove specific files
  filesToRemove.forEach(file => {
    removeFile(file);
  });

  // Clean directories
  dirsToClean.forEach(dir => {
    cleanDirectory(dir);
  });

  // Remove .DS_Store files recursively
  removeDSStoreFiles('.');

  // Run pnpm clean
  try {
    console.log('\n🧹 Running pnpm clean...');
    execSync('pnpm clean', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error running pnpm clean:', error);
  }

  console.log('\n✨ Cleanup complete!');
}

// Run cleanup
cleanup(); 