#!/usr/bin/env node

/**
 * Test script for CSV Migration API
 * 
 * Usage:
 * node test-migration-api.js [command] [options]
 * 
 * Commands:
 * - status: Check API status and current database counts
 * - test: Run a dry-run migration with limited items
 * - migrate: Run full migration (use with caution!)
 */

const BASE_URL = 'http://localhost:3001'
const API_KEY = 'kawai-migration-secure-2024-key-change-in-production'

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }
  
  try {
    console.log(`🌐 Making request to: ${url}`)
    console.log(`📋 Method: ${config.method || 'GET'}`)
    if (config.body) {
      console.log(`📦 Body: ${config.body}`)
    }
    console.log('---')
    
    const response = await fetch(url, config)
    const data = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📄 Response:`)
    console.log(JSON.stringify(data, null, 2))
    console.log('='.repeat(80))
    
    return { response, data }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
    return { error }
  }
}

async function checkStatus() {
  console.log('🔍 Checking Migration API Status...')
  return await makeRequest('/api/migrate-csv')
}

async function runDryRun() {
  console.log('🧪 Running Dry Run Test (5 items)...')
  return await makeRequest('/api/migrate-csv', {
    method: 'POST',
    body: JSON.stringify({
      dryRun: true,
      maxItems: 5,
      createProductlines: true,
      onlyParentProducts: true,
      batchSize: 2
    })
  })
}

async function runLimitedTest() {
  console.log('⚠️  Running LIMITED REAL Migration (3 items)...')
  console.log('⚠️  This will create actual database records!')
  
  return await makeRequest('/api/migrate-csv', {
    method: 'POST',
    body: JSON.stringify({
      dryRun: false,
      maxItems: 3,
      createProductlines: true,
      onlyParentProducts: true,
      skipExisting: true,
      batchSize: 1
    })
  })
}

async function runFullMigration() {
  console.log('🚨 Running FULL Migration...')
  console.log('🚨 This will process ALL CSV data!')
  
  return await makeRequest('/api/migrate-csv', {
    method: 'POST',
    body: JSON.stringify({
      dryRun: false,
      createProductlines: true,
      skipExisting: true,
      onlyParentProducts: true,
      batchSize: 10
    })
  })
}

async function main() {
  const command = process.argv[2] || 'status'
  
  console.log('🧪 CSV Migration API Test Tool')
  console.log('=' * 50)
  console.log(`📡 Base URL: ${BASE_URL}`)
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 10)}...`)
  console.log('')
  
  switch (command.toLowerCase()) {
    case 'status':
      await checkStatus()
      break
      
    case 'test':
    case 'dry-run':
      await runDryRun()
      break
      
    case 'limited':
      console.log('⚠️  WARNING: This will create real database records!')
      console.log('⚠️  Are you sure? Press Ctrl+C to cancel, or wait 5 seconds...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      await runLimitedTest()
      break
      
    case 'migrate':
    case 'full':
      console.log('🚨 WARNING: This will run a FULL migration!')
      console.log('🚨 This will process all CSV data and create many database records!')
      console.log('🚨 Press Ctrl+C to cancel, or wait 10 seconds...')
      await new Promise(resolve => setTimeout(resolve, 10000))
      await runFullMigration()
      break
      
    default:
      console.log('❌ Unknown command. Available commands:')
      console.log('  - status: Check API status')
      console.log('  - test: Run dry-run test')
      console.log('  - limited: Run limited real migration (3 items)')
      console.log('  - migrate: Run full migration')
      console.log('')
      console.log('Examples:')
      console.log('  node test-migration-api.js status')
      console.log('  node test-migration-api.js test')
      console.log('  node test-migration-api.js limited')
      break
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error.message)
  process.exit(1)
})

// Run the script
main().catch(console.error)