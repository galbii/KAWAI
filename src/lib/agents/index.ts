/**
 * KAWAI Code Verification Agent - Main Export
 * 
 * A sophisticated, context-aware code verification system tailored to KAWAI Piano Website's
 * multi-application business platform architecture.
 */

import KawaiCodeVerifier from './kawai-code-verifier'
import KawaiVerifierCLI, { runCLI } from './kawai-verifier-cli'
import KawaiVerifierTester, { runTests } from './test-kawai-verifier'

export { KawaiCodeVerifier, KawaiVerifierCLI, KawaiVerifierTester, runCLI, runTests }

export type {
  VerificationIssue,
  VerificationReport,
  ModuleResult
} from './kawai-code-verifier'

// Quick usage examples
export const USAGE_EXAMPLES = {
  // Basic verification
  basic: `
import { KawaiCodeVerifier } from '@/lib/agents'

const verifier = new KawaiCodeVerifier(process.cwd())
const report = await verifier.verify()
console.log('Overall score:', report.summary.score)
`,

  // Target specific files/directories
  targeted: `
import { KawaiCodeVerifier } from '@/lib/agents'

const verifier = new KawaiCodeVerifier(process.cwd())
const report = await verifier.verify(['src/components', 'src/app/(frontend)'])
`,

  // CLI usage
  cli: `
// Command line usage:
bun run verify
bun run verify --json --output report.json
bun run verify --critical --target src/components
`,

  // Test the agent
  testing: `
import { runTests } from '@/lib/agents'

await runTests() // Tests all verification modules
`
}

// Quick start function for immediate verification
export async function quickVerify(projectRoot: string = process.cwd()): Promise<void> {
  console.log('🎹 KAWAI Quick Verification')
  console.log('Scanning your codebase...\n')

  const verifier = new KawaiCodeVerifier(projectRoot)
  const report = await verifier.verify()

  const { summary } = report
  
  if (summary.critical > 0) {
    console.log(`❌ Found ${summary.critical} critical issues that need immediate attention`)
  } else if (summary.warnings > 0) {
    console.log(`⚠️  Found ${summary.warnings} warnings to review`)
  } else {
    console.log(`✅ Great! No critical issues found`)
  }

  console.log(`📊 Overall score: ${summary.score}/100`)
  console.log(`📈 Total issues: ${summary.totalIssues}`)
  
  if (summary.totalIssues > 0) {
    console.log('\nRun the full verification for detailed recommendations:')
    console.log('  bun run verify')
  }
}

/**
 * Agent Configuration and Patterns
 * 
 * The KAWAI Code Verification Agent is designed specifically for the KAWAI Piano Website's
 * architecture and includes these specialized checks:
 * 
 * 🏗️  Architecture Patterns:
 * - Server-first component strategy
 * - 5-layer component architecture
 * - Route group organization
 * - Domain-driven design separation
 * 
 * ⚡ Performance Optimizations:
 * - ISR configuration validation
 * - Media optimization enforcement (MediaRenderer usage)
 * - Bundle optimization patterns
 * - Caching strategies
 * 
 * 🛡️  Type Safety:
 * - Payload CMS types usage
 * - Interface definitions
 * - Runtime type guards
 * - Error handling patterns
 * 
 * 📝 Maintainability:
 * - KAWAI naming conventions
 * - Code organization standards
 * - Testing patterns
 * - Documentation consistency
 * 
 * 🔐 Security & Integration:
 * - Third-party service integration security
 * - API endpoint security
 * - Input validation
 * - Media and storage security
 * 
 * ⚙️  Configuration:
 * - Environment variable validation
 * - TypeScript configuration
 * - Next.js optimization settings
 * - Package management (Bun enforcement)
 */