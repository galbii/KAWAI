#!/usr/bin/env node

/**
 * Install Migration Dependencies
 * 
 * Checks for and installs required dependencies for the CSV migration script
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Checking migration dependencies...')

// Required dependencies for migration
const requiredDeps = [
  'csv-parser'
]

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in current directory')
  process.exit(1)
}

// Read existing package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const existingDeps = {
  ...packageJson.dependencies || {},
  ...packageJson.devDependencies || {}
}

// Check which dependencies are missing
const missingDeps = requiredDeps.filter(dep => !existingDeps[dep])

if (missingDeps.length === 0) {
  console.log('✅ All migration dependencies are already installed')
  process.exit(0)
}

console.log(`📦 Installing missing dependencies: ${missingDeps.join(', ')}`)

try {
  // Install missing dependencies
  const installCommand = `bun add ${missingDeps.join(' ')}`
  console.log(`Running: ${installCommand}`)
  
  execSync(installCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  console.log('✅ Migration dependencies installed successfully')
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message)
  process.exit(1)
}