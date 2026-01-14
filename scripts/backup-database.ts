#!/usr/bin/env tsx

/**
 * Database Backup Script
 *
 * Purpose: Create timestamped backups of the MongoDB database using mongodump
 *
 * Usage:
 *   npm run backup:db
 *   # or with custom DATABASE_URI
 *   DATABASE_URI="mongodb://..." npm run backup:db
 *
 * Requirements:
 *   - mongodump must be installed (part of MongoDB Database Tools)
 *   - Install: https://www.mongodb.com/try/download/database-tools
 *
 * Output:
 *   - Creates a backup in ./backups/backup-YYYYMMDD-HHMMSS/
 *   - Includes all collections and indexes
 *   - Compressed with gzip for smaller file sizes
 *
 * Restore Instructions:
 *   mongorestore --uri="YOUR_DATABASE_URI" --gzip ./backups/backup-YYYYMMDD-HHMMSS
 *
 * Security:
 *   - DATABASE_URI should be stored in .env (never committed to git)
 *   - Backup files contain sensitive data - protect appropriately
 *   - Add backups/ directory to .gitignore
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

const execAsync = promisify(exec)

// ANSI color codes for pretty console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

/**
 * Format timestamp for backup directory name
 * Format: YYYYMMDD-HHMMSS (e.g., 20250114-143022)
 */
function getTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

/**
 * Check if mongodump is installed and available
 */
async function checkMongoDump(): Promise<boolean> {
  try {
    await execAsync('mongodump --version')
    return true
  } catch (error) {
    return false
  }
}

/**
 * Main backup function
 */
async function backupDatabase(): Promise<void> {
  console.log(`${colors.cyan}${colors.bright}╔═══════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.cyan}${colors.bright}║   KAWAI Database Backup Utility       ║${colors.reset}`)
  console.log(`${colors.cyan}${colors.bright}╚═══════════════════════════════════════╝${colors.reset}\n`)

  // Step 1: Get DATABASE_URI from environment
  const databaseUri = process.env.DATABASE_URI

  if (!databaseUri) {
    console.error(`${colors.red}${colors.bright}✗ Error:${colors.reset} DATABASE_URI environment variable not set`)
    console.error(`${colors.yellow}Please set DATABASE_URI in your .env file or pass it as an argument:${colors.reset}`)
    console.error(`  DATABASE_URI="mongodb://..." npm run backup:db\n`)
    process.exit(1)
  }

  // Step 2: Check if mongodump is installed
  console.log(`${colors.blue}[1/4]${colors.reset} Checking mongodump installation...`)
  const hasMongoDump = await checkMongoDump()

  if (!hasMongoDump) {
    console.error(`${colors.red}${colors.bright}✗ Error:${colors.reset} mongodump is not installed or not in PATH`)
    console.error(`${colors.yellow}Install MongoDB Database Tools:${colors.reset}`)
    console.error(`  https://www.mongodb.com/try/download/database-tools`)
    console.error(`\n${colors.yellow}Or install via package manager:${colors.reset}`)
    console.error(`  macOS:  brew install mongodb-database-tools`)
    console.error(`  Ubuntu: sudo apt-get install mongodb-database-tools`)
    console.error(`  Windows: Download from link above\n`)
    process.exit(1)
  }
  console.log(`${colors.green}✓${colors.reset} mongodump found\n`)

  // Step 3: Create backups directory if it doesn't exist
  console.log(`${colors.blue}[2/4]${colors.reset} Preparing backup directory...`)
  const backupsDir = path.join(process.cwd(), 'backups')

  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true })
    console.log(`${colors.green}✓${colors.reset} Created backups directory: ${backupsDir}`)
  } else {
    console.log(`${colors.green}✓${colors.reset} Backups directory exists: ${backupsDir}`)
  }

  const timestamp = getTimestamp()
  const backupPath = path.join(backupsDir, `backup-${timestamp}`)
  console.log(`${colors.green}✓${colors.reset} Backup will be saved to: ${backupPath}\n`)

  // Step 4: Run mongodump
  console.log(`${colors.blue}[3/4]${colors.reset} Running mongodump...`)
  console.log(`${colors.yellow}This may take a few minutes depending on database size...${colors.reset}\n`)

  const mongoDumpCommand = `mongodump --uri="${databaseUri}" --out="${backupPath}" --gzip`

  try {
    const startTime = Date.now()
    const { stdout, stderr } = await execAsync(mongoDumpCommand)

    // mongodump outputs to stderr by default (not an error)
    if (stderr) {
      console.log(stderr)
    }
    if (stdout) {
      console.log(stdout)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`${colors.green}${colors.bright}✓ Backup completed successfully!${colors.reset} (${duration}s)\n`)
  } catch (error) {
    console.error(`${colors.red}${colors.bright}✗ Backup failed:${colors.reset}`, error)
    process.exit(1)
  }

  // Step 5: Display backup information
  console.log(`${colors.blue}[4/4]${colors.reset} Backup Summary:`)
  console.log(`${colors.cyan}  Location:${colors.reset} ${backupPath}`)
  console.log(`${colors.cyan}  Format:${colors.reset}   Gzipped BSON`)
  console.log(`${colors.cyan}  Timestamp:${colors.reset} ${timestamp}\n`)

  // Display restore instructions
  console.log(`${colors.yellow}${colors.bright}Restore Instructions:${colors.reset}`)
  console.log(`${colors.yellow}  mongorestore --uri="YOUR_DATABASE_URI" --gzip "${backupPath}"${colors.reset}\n`)

  console.log(`${colors.green}${colors.bright}✓ Backup process complete!${colors.reset}\n`)
}

// Run the backup
backupDatabase().catch((error) => {
  console.error(`${colors.red}${colors.bright}✗ Unexpected error:${colors.reset}`, error)
  process.exit(1)
})
