/**
 * KAWAI Code Verification Agent
 * 
 * A sophisticated, context-aware code verification system tailored to KAWAI Piano Website's
 * multi-application business platform architecture. This agent ensures code quality,
 * performance optimization, and architectural compliance.
 * 
 * Features:
 * - Configuration & Environment Integrity verification
 * - Architecture Pattern enforcement (Server-first, 5-layer components, route groups)
 * - Performance & Optimization auditing (ISR, media optimization, caching)
 * - Type Safety validation (Payload types, interfaces, runtime safety)
 * - Maintainability & Organization assessment
 * - Integration & Security monitoring
 */

import { promises as fs } from 'fs'
import path from 'path'

// Verification Result Types
export interface VerificationIssue {
  type: 'critical' | 'warning' | 'suggestion'
  category: 'configuration' | 'architecture' | 'performance' | 'type-safety' | 'maintainability' | 'security'
  message: string
  file?: string
  line?: number
  recommendation: string
  codeExample?: string
}

export interface VerificationReport {
  summary: {
    totalIssues: number
    critical: number
    warnings: number
    suggestions: number
    score: number // 0-100
  }
  issues: VerificationIssue[]
  modules: {
    configuration: ModuleResult
    architecture: ModuleResult
    performance: ModuleResult
    typeSafety: ModuleResult
    maintainability: ModuleResult
    security: ModuleResult
  }
}

export interface ModuleResult {
  passed: boolean
  score: number
  issues: VerificationIssue[]
}

// KAWAI-Specific Patterns and Constants
const KAWAI_PATTERNS = {
  // Route Group Patterns
  ROUTE_GROUPS: {
    frontend: '(frontend)',
    payload: '(payload)'
  },
  
  // Component Layer Architecture
  COMPONENT_LAYERS: {
    1: 'ui', // UI Foundation
    2: 'blocks', // Content Block Renderers
    3: 'layout', // Layout & Integration
    4: 'piano|homepage|products|forms', // Business Domain
    5: 'pages' // Page-Specific
  },
  
  // Required Environment Variables
  REQUIRED_ENV_VARS: [
    'DATABASE_URI',
    'PAYLOAD_SECRET',
    'NEXT_PUBLIC_S3_PUBLIC_URL',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_ENDPOINT',
    'S3_BUCKET'
  ],
  
  // Performance Patterns
  PERFORMANCE_PATTERNS: {
    ISR_PAGES: ['products', 'pianos', 'dealers'],
    MEDIA_COMPONENTS: ['MediaRenderer', 'ResponsiveImage', 'OptimizedImage'],
    PRESETS: ['hero', 'gallery', 'thumbnail', 'card']
  },
  
  // File Naming Conventions
  NAMING_CONVENTIONS: {
    COMPONENTS: /^[A-Z][a-zA-Z0-9]*\.tsx?$/,
    UTILITIES: /^[a-z][a-zA-Z0-9-]*\.ts$/,
    PAGES: /^[a-z][a-z0-9-]*\/page\.tsx$/
  }
}

/**
 * Main KAWAI Code Verification Agent
 */
export class KawaiCodeVerifier {
  private projectRoot: string
  private verificationModules: {
    configuration: ConfigurationVerifier
    architecture: ArchitectureVerifier
    performance: PerformanceVerifier
    typeSafety: TypeSafetyVerifier
    maintainability: MaintainabilityVerifier
    security: SecurityVerifier
  }

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
    this.verificationModules = {
      configuration: new ConfigurationVerifier(projectRoot),
      architecture: new ArchitectureVerifier(projectRoot),
      performance: new PerformanceVerifier(projectRoot),
      typeSafety: new TypeSafetyVerifier(projectRoot),
      maintainability: new MaintainabilityVerifier(projectRoot),
      security: new SecurityVerifier(projectRoot)
    }
  }

  /**
   * Verify entire project or specific files/directories
   */
  async verify(targets?: string[]): Promise<VerificationReport> {
    console.log('🔍 Starting KAWAI Code Verification...')
    
    const results = await Promise.all([
      this.verificationModules.configuration.verify(targets),
      this.verificationModules.architecture.verify(targets),
      this.verificationModules.performance.verify(targets),
      this.verificationModules.typeSafety.verify(targets),
      this.verificationModules.maintainability.verify(targets),
      this.verificationModules.security.verify(targets)
    ])

    const [configuration, architecture, performance, typeSafety, maintainability, security] = results

    const allIssues = [
      ...configuration.issues,
      ...architecture.issues,
      ...performance.issues,
      ...typeSafety.issues,
      ...maintainability.issues,
      ...security.issues
    ]

    const critical = allIssues.filter(i => i.type === 'critical').length
    const warnings = allIssues.filter(i => i.type === 'warning').length
    const suggestions = allIssues.filter(i => i.type === 'suggestion').length

    // Calculate overall score (weighted by module importance)
    const weights = { configuration: 20, architecture: 25, performance: 20, typeSafety: 15, maintainability: 10, security: 10 }
    const score = Math.round(
      (configuration.score * weights.configuration +
       architecture.score * weights.architecture +
       performance.score * weights.performance +
       typeSafety.score * weights.typeSafety +
       maintainability.score * weights.maintainability +
       security.score * weights.security) / 100
    )

    const report: VerificationReport = {
      summary: {
        totalIssues: allIssues.length,
        critical,
        warnings,
        suggestions,
        score
      },
      issues: allIssues.sort((a, b) => {
        const typeOrder = { critical: 0, warning: 1, suggestion: 2 }
        return typeOrder[a.type] - typeOrder[b.type]
      }),
      modules: {
        configuration,
        architecture,
        performance,
        typeSafety,
        maintainability,
        security
      }
    }

    this.printReport(report)
    return report
  }

  private printReport(report: VerificationReport) {
    console.log('\n📊 KAWAI Code Verification Report')
    console.log('=' .repeat(50))
    console.log(`Overall Score: ${report.summary.score}/100`)
    console.log(`Total Issues: ${report.summary.totalIssues}`)
    console.log(`  Critical: ${report.summary.critical}`)
    console.log(`  Warnings: ${report.summary.warnings}`)
    console.log(`  Suggestions: ${report.summary.suggestions}`)
    
    if (report.summary.critical > 0) {
      console.log('\n❌ Critical Issues:')
      report.issues.filter(i => i.type === 'critical').forEach(issue => {
        console.log(`  • ${issue.message}`)
        console.log(`    📍 ${issue.file}${issue.line ? ':' + issue.line : ''}`)
        console.log(`    💡 ${issue.recommendation}`)
      })
    }

    if (report.summary.warnings > 0) {
      console.log('\n⚠️  Warnings:')
      report.issues.filter(i => i.type === 'warning').slice(0, 5).forEach(issue => {
        console.log(`  • ${issue.message}`)
        console.log(`    💡 ${issue.recommendation}`)
      })
    }

    console.log('\n🎯 Module Scores:')
    Object.entries(report.modules).forEach(([name, result]) => {
      const emoji = result.passed ? '✅' : '❌'
      console.log(`  ${emoji} ${name.charAt(0).toUpperCase() + name.slice(1)}: ${result.score}/100`)
    })
  }
}

/**
 * Base class for verification modules
 */
abstract class BaseVerifier {
  protected projectRoot: string

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  abstract verify(targets?: string[]): Promise<ModuleResult>

  protected async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch {
      return null
    }
  }

  protected async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  protected createIssue(
    type: VerificationIssue['type'],
    category: VerificationIssue['category'],
    message: string,
    recommendation: string,
    file?: string,
    line?: number,
    codeExample?: string
  ): VerificationIssue {
    return {
      type,
      category,
      message,
      recommendation,
      ...(file !== undefined && { file }),
      ...(line !== undefined && { line }),
      ...(codeExample !== undefined && { codeExample })
    }
  }

  protected parseJSONWithComments(jsonString: string): any {
    try {
      // More robust comment and trailing comma removal
      let cleaned = jsonString
        // Remove single-line comments (// comment)
        .replace(/^\s*\/\/.*$/gm, '')
        // Remove multi-line comments (/* comment */)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove trailing commas before } or ]
        .replace(/,(\s*[}\]])/g, '$1')
        // Clean up empty lines and normalize whitespace
        .replace(/^\s*$/gm, '')
        .trim()

      return JSON.parse(cleaned)
    } catch (error) {
      console.warn('Failed to parse JSON with comment stripping, attempting basic parse:', error instanceof Error ? error.message : error)
      // If all else fails, return a minimal valid config
      return { compilerOptions: {} }
    }
  }
}

/**
 * 1. Configuration & Environment Integrity Verifier
 */
class ConfigurationVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []

    // Check environment variables
    await this.checkEnvironmentVariables(issues)
    
    // Check TypeScript configuration
    await this.checkTypeScriptConfig(issues)
    
    // Check Next.js configuration
    await this.checkNextJsConfig(issues)
    
    // Check Payload CMS configuration
    await this.checkPayloadConfig(issues)
    
    // Check package.json for Bun usage
    await this.checkPackageManager(issues)

    const critical = issues.filter(i => i.type === 'critical').length
    const score = Math.max(0, 100 - (critical * 25) - (issues.length * 5))

    return {
      passed: critical === 0,
      score,
      issues
    }
  }

  private async checkEnvironmentVariables(issues: VerificationIssue[]) {
    const envExamplePath = path.join(this.projectRoot, '.env.example')
    const envLocalPath = path.join(this.projectRoot, '.env.local')
    
    if (!(await this.fileExists(envExamplePath))) {
      issues.push(this.createIssue(
        'critical',
        'configuration',
        'Missing .env.example file',
        'Create .env.example with all required environment variables documented',
        '.env.example'
      ))
    }

    for (const envVar of KAWAI_PATTERNS.REQUIRED_ENV_VARS) {
      if (!process.env[envVar]) {
        issues.push(this.createIssue(
          'critical',
          'configuration',
          `Missing required environment variable: ${envVar}`,
          `Add ${envVar} to your .env.local file`,
          '.env.local'
        ))
      }
    }
  }

  private async checkTypeScriptConfig(issues: VerificationIssue[]) {
    const tsConfigPath = path.join(this.projectRoot, 'tsconfig.json')
    const tsConfig = await this.readFile(tsConfigPath)
    
    if (!tsConfig) {
      issues.push(this.createIssue(
        'critical',
        'configuration',
        'Missing tsconfig.json',
        'Create tsconfig.json with strict mode enabled',
        'tsconfig.json'
      ))
      return
    }

    // Parse JSON with comments (common in tsconfig.json)
    const config = this.parseJSONWithComments(tsConfig)
    const compilerOptions = config.compilerOptions || {}

    if (!compilerOptions.strict) {
      issues.push(this.createIssue(
        'critical',
        'configuration',
        'TypeScript strict mode not enabled',
        'Enable strict mode in tsconfig.json compilerOptions',
        'tsconfig.json',
        undefined,
        '"strict": true'
      ))
    }

    if (!compilerOptions.exactOptionalPropertyTypes) {
      issues.push(this.createIssue(
        'warning',
        'configuration',
        'exactOptionalPropertyTypes not enabled',
        'Enable exactOptionalPropertyTypes for better type safety',
        'tsconfig.json'
      ))
    }
  }

  private async checkNextJsConfig(issues: VerificationIssue[]) {
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js')
    const nextConfig = await this.readFile(nextConfigPath)
    
    if (!nextConfig) {
      issues.push(this.createIssue(
        'warning',
        'configuration',
        'Missing next.config.js optimization settings',
        'Create next.config.js with image optimization and security headers',
        'next.config.js'
      ))
    }
  }

  private async checkPayloadConfig(issues: VerificationIssue[]) {
    const payloadConfigPath = path.join(this.projectRoot, 'src/payload.config.ts')
    const payloadConfig = await this.readFile(payloadConfigPath)
    
    if (!payloadConfig) {
      issues.push(this.createIssue(
        'critical',
        'configuration',
        'Missing Payload CMS configuration',
        'Ensure src/payload.config.ts exists and is properly configured',
        'src/payload.config.ts'
      ))
    }
  }

  private async checkPackageManager(issues: VerificationIssue[]) {
    const packageJsonPath = path.join(this.projectRoot, 'package.json')
    const packageLockPath = path.join(this.projectRoot, 'package-lock.json')
    const yarnLockPath = path.join(this.projectRoot, 'yarn.lock')
    
    if (await this.fileExists(packageLockPath) || await this.fileExists(yarnLockPath)) {
      issues.push(this.createIssue(
        'critical',
        'configuration',
        'Non-Bun package manager detected',
        'Remove package-lock.json/yarn.lock and use Bun exclusively to avoid dependency conflicts',
        'package.json'
      ))
    }
  }
}

/**
 * 2. Architecture Pattern Enforcer
 */
class ArchitectureVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []

    // Check Server Component patterns
    await this.checkServerComponentPatterns(issues, targets)
    
    // Check route group organization
    await this.checkRouteGroupOrganization(issues)
    
    // Check component layer architecture
    await this.checkComponentLayerArchitecture(issues)
    
    // Check domain separation
    await this.checkDomainSeparation(issues)
    
    // Check page structure patterns
    await this.checkPageStructurePatterns(issues)
    
    // Check import patterns
    await this.checkImportPatterns(issues, targets)

    const critical = issues.filter(i => i.type === 'critical').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const score = Math.max(0, 100 - (critical * 20) - (warnings * 5) - (issues.length * 2))

    return {
      passed: critical === 0,
      score,
      issues
    }
  }

  private async checkServerComponentPatterns(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src/components'), path.join(this.projectRoot, 'src/app')]
    
    for (const searchPath of searchPaths) {
      await this.scanDirectoryForClientComponents(searchPath, issues)
    }
  }
  
  private async scanDirectoryForClientComponents(dirPath: string, issues: VerificationIssue[]) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanDirectoryForClientComponents(fullPath, issues)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForUnnecessaryClientDirective(fullPath, issues)
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }
  
  private async checkFileForUnnecessaryClientDirective(filePath: string, issues: VerificationIssue[]) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const lines = content.split('\n')
    const hasUseClient = content.includes("'use client'")
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    if (hasUseClient) {
      // Check if 'use client' is actually needed
      const needsClient = this.analyzeClientRequirements(content)
      
      if (!needsClient.required) {
        const useClientLine = lines.findIndex(line => line.includes("'use client'")) + 1
        issues.push(this.createIssue(
          'warning',
          'architecture',
          `Unnecessary 'use client' directive detected`,
          `Remove 'use client' and convert to Server Component for better performance. Server Components provide better SEO, faster initial load, and reduced JavaScript bundle size.`,
          relativeFilePath,
          useClientLine,
          `// Remove this line:\n'use client'\n\n// Server Components are preferred for:\n// - Static content rendering\n// - Data fetching\n// - SEO optimization`
        ))
      } else if (needsClient.reasons.length > 0) {
        // Client component is justified, but provide optimization suggestions
        issues.push(this.createIssue(
          'suggestion',
          'architecture',
          `Client Component usage justified: ${needsClient.reasons.join(', ')}`,
          `Consider extracting non-interactive parts into separate Server Components to minimize client-side JavaScript.`,
          relativeFilePath
        ))
      }
    } else {
      // Server Component - check if it's doing something that requires client
      const needsClient = this.analyzeClientRequirements(content)
      
      if (needsClient.required && needsClient.reasons.length > 0) {
        issues.push(this.createIssue(
          'critical',
          'architecture',
          `Server Component using client-only features: ${needsClient.reasons.join(', ')}`,
          `Add 'use client' directive or refactor to avoid client-only APIs.`,
          relativeFilePath,
          1,
          "'use client'\n\n// Add this at the top of the file"
        ))
      }
    }
  }
  
  private analyzeClientRequirements(content: string): { required: boolean; reasons: string[] } {
    const reasons: string[] = []
    
    // Client-only React hooks
    const clientHooks = ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef', 'useCallback', 'useMemo']
    clientHooks.forEach(hook => {
      if (content.includes(hook)) reasons.push(`${hook} usage`)
    })
    
    // Browser APIs
    const browserAPIs = ['localStorage', 'sessionStorage', 'window', 'document', 'navigator', 'location.href']
    browserAPIs.forEach(api => {
      if (content.includes(api)) reasons.push(`${api} usage`)
    })
    
    // Event handlers
    const eventHandlers = ['onClick', 'onChange', 'onSubmit', 'onMouseOver', 'onFocus', 'onBlur']
    eventHandlers.forEach(handler => {
      if (content.includes(handler)) reasons.push(`${handler} event handler`)
    })
    
    // Third-party client libraries (common ones)
    const clientLibraries = ['react-hook-form', 'framer-motion', 'react-intersection-observer']
    clientLibraries.forEach(lib => {
      if (content.includes(lib)) reasons.push(`${lib} library usage`)
    })
    
    return {
      required: reasons.length > 0,
      reasons: [...new Set(reasons)] // Remove duplicates
    }
  }

  private async checkRouteGroupOrganization(issues: VerificationIssue[]) {
    const appDir = path.join(this.projectRoot, 'src/app')
    const frontendDir = path.join(appDir, '(frontend)')
    const payloadDir = path.join(appDir, '(payload)')

    if (!(await this.fileExists(frontendDir))) {
      issues.push(this.createIssue(
        'critical',
        'architecture',
        'Missing (frontend) route group',
        'Organize public website routes in src/app/(frontend) directory for clear separation',
        'src/app/(frontend)'
      ))
    }

    if (!(await this.fileExists(payloadDir))) {
      issues.push(this.createIssue(
        'warning',
        'architecture',
        'Missing (payload) route group',
        'Organize CMS/API routes in src/app/(payload) directory for admin functionality',
        'src/app/(payload)'
      ))
    }
    
    // Check for pages in wrong route groups
    await this.checkPagePlacement(issues, appDir)
  }
  
  private async checkPagePlacement(issues: VerificationIssue[], appDir: string) {
    try {
      const entries = await fs.readdir(appDir, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('(') && entry.name !== 'api') {
          // Found a directory that should probably be in a route group
          const dirPath = path.join(appDir, entry.name)
          const hasPageFile = await this.fileExists(path.join(dirPath, 'page.tsx'))
          
          if (hasPageFile) {
            issues.push(this.createIssue(
              'warning',
              'architecture',
              `Page directory '${entry.name}' not in route group`,
              `Move src/app/${entry.name} to src/app/(frontend)/${entry.name} for proper organization`,
              `src/app/${entry.name}`
            ))
          }
        }
      }
    } catch (error) {
      // App directory doesn't exist
    }
  }

  private async checkComponentLayerArchitecture(issues: VerificationIssue[]) {
    const componentsDir = path.join(this.projectRoot, 'src/components')
    
    // Check for required layer directories
    const expectedLayers = {
      'ui': 'Layer 1: UI Foundation (buttons, inputs, cards, animations)',
      'blocks': 'Layer 2: Content Block Renderers (hero, galleries, showcases)',
      'layout': 'Layer 3: Layout & Integration (header, footer, CRM forms)',
      'piano': 'Layer 4: Business Domain (piano catalogs, assessments)',
      'pages': 'Layer 5: Page-Specific (Dallas University, Signature, ES60)'
    }
    
    for (const [dir, description] of Object.entries(expectedLayers)) {
      const dirPath = path.join(componentsDir, dir)
      if (!(await this.fileExists(dirPath))) {
        issues.push(this.createIssue(
          'warning',
          'architecture',
          `Missing component layer: ${dir}`,
          `Create src/components/${dir} directory. ${description}`,
          `src/components/${dir}`
        ))
      }
    }
    
    // Check for components in wrong layers
    await this.checkComponentPlacement(issues, componentsDir)
  }
  
  private async checkComponentPlacement(issues: VerificationIssue[], componentsDir: string) {
    try {
      const entries = await fs.readdir(componentsDir, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          // Component file directly in components directory
          issues.push(this.createIssue(
            'suggestion',
            'architecture',
            `Component '${entry.name}' not in appropriate layer directory`,
            `Move src/components/${entry.name} to appropriate layer directory (ui/, blocks/, layout/, etc.)`,
            `src/components/${entry.name}`
          ))
        }
      }
    } catch (error) {
      // Components directory doesn't exist
    }
  }

  private async checkDomainSeparation(issues: VerificationIssue[]) {
    // Check for proper domain separation in business logic
    const domainDirs = {
      'piano': ['ProductShowcase', 'PianoCard', 'SpecificationTable'],
      'homepage': ['HeroSection', 'FeaturedPianos', 'CompanyStory'],
      'forms': ['ContactForm', 'ConsultationBooking', 'EmailCapture'],
      'assessment': ['InteractiveAssessment', 'QuestionStep', 'ResultsPage']
    }
    
    for (const [domain, expectedComponents] of Object.entries(domainDirs)) {
      const domainPath = path.join(this.projectRoot, 'src/components', domain)
      
      if (await this.fileExists(domainPath)) {
        // Check for cross-domain imports
        await this.checkDomainImports(issues, domainPath, domain, Object.keys(domainDirs))
      }
    }
  }
  
  private async checkDomainImports(issues: VerificationIssue[], domainPath: string, currentDomain: string, allDomains: string[]) {
    try {
      const entries = await fs.readdir(domainPath, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const filePath = path.join(domainPath, entry.name)
          const content = await this.readFile(filePath)
          
          if (content) {
            // Check for imports from other domains
            for (const otherDomain of allDomains) {
              if (otherDomain !== currentDomain && content.includes(`from '@/components/${otherDomain}`)) {
                const relativeFilePath = path.relative(this.projectRoot, filePath)
                issues.push(this.createIssue(
                  'suggestion',
                  'architecture',
                  `Cross-domain import detected: ${currentDomain} importing from ${otherDomain}`,
                  `Consider creating shared utilities in lib/ or ui/ layers instead of direct domain imports`,
                  relativeFilePath
                ))
              }
            }
          }
        }
      }
    } catch (error) {
      // Domain directory doesn't exist or can't be read
    }
  }
  
  private async checkPageStructurePatterns(issues: VerificationIssue[]) {
    // Check for proper page.tsx structure in app directory
    const appDir = path.join(this.projectRoot, 'src/app')
    await this.scanForPageFiles(issues, appDir)
  }
  
  private async scanForPageFiles(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForPageFiles(issues, fullPath)
        } else if (entry.name === 'page.tsx') {
          await this.validatePageStructure(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validatePageStructure(issues: VerificationIssue[], pagePath: string) {
    const content = await this.readFile(pagePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, pagePath)
    
    // Check for proper export structure
    if (!content.includes('export default')) {
      issues.push(this.createIssue(
        'critical',
        'architecture',
        'Page missing default export',
        'Add default export function to page.tsx',
        relativeFilePath,
        undefined,
        'export default function PageName() {\n  return <div>Page content</div>\n}'
      ))
    }
    
    // Check for async server component patterns
    if (content.includes('async function') && content.includes('params') && !content.includes('await')) {
      issues.push(this.createIssue(
        'suggestion',
        'architecture',
        'Async page component not utilizing server-side data fetching',
        'Leverage async/await for server-side data fetching in Server Components',
        relativeFilePath
      ))
    }
    
    // Check for ISR patterns on content pages
    if (pagePath.includes('products') || pagePath.includes('pianos') || pagePath.includes('dealers')) {
      if (!content.includes('revalidate') && !content.includes('dynamic')) {
        issues.push(this.createIssue(
          'suggestion',
          'architecture',
          'Content page missing ISR configuration',
          'Add revalidate export for Incremental Static Regeneration on content pages',
          relativeFilePath,
          undefined,
          'export const revalidate = 300 // 5 minutes'
        ))
      }
    }
  }
  
  private async checkImportPatterns(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForImportPatterns(issues, searchPath)
    }
  }
  
  private async scanForImportPatterns(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.scanForImportPatterns(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.validateImportOrder(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateImportOrder(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const lines = content.split('\n')
    const importLines = lines.filter(line => line.trim().startsWith('import '))
    
    if (importLines.length === 0) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    const importCategories = this.categorizeImports(importLines)
    
    // Check import order according to KAWAI standards
    const expectedOrder = ['external', 'internal-types', 'internal-utils', 'internal-components', 'relative']
    let lastCategoryIndex = -1
    let hasOrderIssues = false
    
    for (const category of expectedOrder) {
      const categoryImports = importCategories[category] || []
      if (categoryImports.length > 0) {
        const firstImportIndex = lines.findIndex(line => categoryImports.includes(line.trim()))
        if (firstImportIndex <= lastCategoryIndex) {
          hasOrderIssues = true
          break
        }
        lastCategoryIndex = firstImportIndex
      }
    }
    
    if (hasOrderIssues) {
      issues.push(this.createIssue(
        'suggestion',
        'architecture',
        'Import order not following KAWAI conventions',
        'Organize imports: 1) External libraries, 2) Internal types, 3) Internal utils, 4) Internal components, 5) Relative imports',
        relativeFilePath,
        undefined,
        'import React from \'react\'\nimport { Product } from \'@/payload-types\'\nimport { cn } from \'@/lib/utils\'\nimport { Button } from \'@/components/ui/button\'\nimport \'./styles.css\''
      ))
    }
  }
  
  private categorizeImports(importLines: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      external: [],
      'internal-types': [],
      'internal-utils': [],
      'internal-components': [],
      relative: []
    }
    
    for (const line of importLines) {
      if (line.includes('from \'./') || line.includes('from "./')) {
        categories.relative?.push(line)
      } else if (line.includes('from \'@/') || line.includes('from "@/')) {
        if (line.includes('payload-types') || line.includes('/types')) {
          categories['internal-types']?.push(line)
        } else if (line.includes('/lib/') || line.includes('/utils')) {
          categories['internal-utils']?.push(line)
        } else if (line.includes('/components/')) {
          categories['internal-components']?.push(line)
        }
      } else {
        categories.external?.push(line)
      }
    }
    
    return categories
  }
}

// Additional verifier classes would be implemented similarly...
// For brevity, I'll provide the structure for the remaining classes

/**
 * 3. Performance & Optimization Auditor
 */
class PerformanceVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []
    
    // Check ISR configuration on content pages
    await this.checkISRConfiguration(issues, targets)
    
    // Check media optimization usage
    await this.checkMediaOptimization(issues, targets)
    
    // Check bundle optimization patterns
    await this.checkBundleOptimization(issues, targets)
    
    // Check caching strategies
    await this.checkCachingPatterns(issues)
    
    // Check for performance anti-patterns
    await this.checkPerformanceAntiPatterns(issues, targets)
    
    const critical = issues.filter(i => i.type === 'critical').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const score = Math.max(0, 100 - (critical * 25) - (warnings * 8) - (issues.length * 3))
    
    return {
      passed: critical === 0,
      score,
      issues
    }
  }
  
  private async checkISRConfiguration(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src/app')]
    
    for (const searchPath of searchPaths) {
      await this.scanForISRPages(issues, searchPath)
    }
  }
  
  private async scanForISRPages(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForISRPages(issues, fullPath)
        } else if (entry.name === 'page.tsx') {
          await this.checkPageISRConfiguration(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkPageISRConfiguration(issues: VerificationIssue[], pagePath: string) {
    const content = await this.readFile(pagePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, pagePath)
    const isContentPage = pagePath.includes('products') || pagePath.includes('pianos') || 
                         pagePath.includes('dealers') || pagePath.includes('[slug]')
    
    if (isContentPage) {
      const hasRevalidate = content.includes('export const revalidate')
      const hasDynamic = content.includes('export const dynamic')
      
      if (!hasRevalidate && !hasDynamic) {
        issues.push(this.createIssue(
          'warning',
          'performance',
          'Content page missing ISR configuration',
          'Add revalidate export for optimal caching of CMS content',
          relativeFilePath,
          undefined,
          'export const revalidate = 300 // 5 minutes for CMS content'
        ))
      }
      
      // Check for appropriate revalidate values
      if (hasRevalidate) {
        const revalidateMatch = content.match(/export const revalidate = (\d+)/)
        if (revalidateMatch && revalidateMatch[1]) {
          const revalidateValue = parseInt(revalidateMatch[1])
          if (revalidateValue < 60) {
            issues.push(this.createIssue(
              'suggestion',
              'performance',
              'Very short revalidate period detected',
              'Consider longer revalidation periods (300-900 seconds) for better performance',
              relativeFilePath
            ))
          } else if (revalidateValue > 3600) {
            issues.push(this.createIssue(
              'suggestion',
              'performance',
              'Very long revalidate period detected',
              'Consider shorter periods (5-15 minutes) for CMS content freshness',
              relativeFilePath
            ))
          }
        }
      }
    }
    
    // Check for force-dynamic on pages that could be static
    if (content.includes('export const dynamic = \'force-dynamic\'')) {
      const isSearchPage = pagePath.includes('search') || content.includes('searchParams')
      if (!isSearchPage) {
        issues.push(this.createIssue(
          'warning',
          'performance',
          'Potentially unnecessary force-dynamic configuration',
          'Verify that force-dynamic is required, consider ISR for better performance',
          relativeFilePath
        ))
      }
    }
  }
  
  private async checkMediaOptimization(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForMediaUsage(issues, searchPath)
    }
  }
  
  private async scanForMediaUsage(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForMediaUsage(issues, fullPath)
        } else if (entry.name.endsWith('.tsx')) {
          await this.checkFileForMediaOptimization(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForMediaOptimization(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for raw img tags instead of Next.js Image
    const rawImgRegex = /<img\s+[^>]*>/g
    const rawImgMatches = content.match(rawImgRegex)
    
    if (rawImgMatches) {
      const lineNumbers = this.getLineNumbers(content, rawImgRegex)
      lineNumbers.forEach(line => {
        issues.push(this.createIssue(
          'warning',
          'performance',
          'Raw img tag detected instead of optimized Image component',
          'Replace with Next.js Image component or KAWAI MediaRenderer for automatic optimization',
          relativeFilePath,
          line,
          'import Image from \'next/image\'\nimport { MediaRenderer } from \'@/components/ui/media\'\n\n// Replace <img> with:\n<Image src={...} alt={...} width={...} height={...} />\n// or\n<MediaRenderer media={...} preset="card" />'
        ))
      })
    }
    
    // Check for missing MediaRenderer usage with CMS media
    if (content.includes('Media') && content.includes('payload-types') && !content.includes('MediaRenderer')) {
      issues.push(this.createIssue(
        'suggestion',
        'performance',
        'Payload Media type detected without MediaRenderer',
        'Use MediaRenderer component for automatic Cloudflare R2 optimization',
        relativeFilePath,
        undefined,
        'import { MediaRenderer } from \'@/components/ui/media\'\n\n<MediaRenderer media={mediaObject} preset="hero" priority />'
      ))
    }
    
    // Check for missing priority attribute on above-fold images
    const nextImageRegex = /<Image\s+[^>]*>/g
    const imageMatches = content.match(nextImageRegex)
    
    if (imageMatches) {
      const isAboveFold = filePath.includes('Hero') || filePath.includes('hero') || 
                         content.includes('hero') || content.includes('above-fold')
      
      if (isAboveFold) {
        imageMatches.forEach(imgTag => {
          if (!imgTag.includes('priority')) {
            issues.push(this.createIssue(
              'suggestion',
              'performance',
              'Above-fold image missing priority attribute',
              'Add priority attribute to above-fold images for better LCP',
              relativeFilePath,
              undefined,
              '<Image ... priority />'
            ))
          }
        })
      }
    }
    
    // Check for missing sizes attribute on responsive images
    if (imageMatches) {
      imageMatches.forEach(imgTag => {
        if (!imgTag.includes('sizes') && !imgTag.includes('fill')) {
          issues.push(this.createIssue(
            'suggestion',
            'performance',
            'Image missing sizes attribute for responsive optimization',
            'Add sizes attribute for proper responsive image loading',
            relativeFilePath,
            undefined,
            '<Image ... sizes="(max-width: 768px) 100vw, 50vw" />'
          ))
        }
      })
    }
  }
  
  private async checkBundleOptimization(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForBundleOptimization(issues, searchPath)
    }
  }
  
  private async scanForBundleOptimization(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForBundleOptimization(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForBundleOptimization(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForBundleOptimization(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for heavy dependencies that should be dynamically imported
    const heavyLibraries = [
      'react-hook-form',
      'framer-motion',
      'calendly',
      'chart.js',
      'react-chartjs-2'
    ]
    
    heavyLibraries.forEach(lib => {
      if (content.includes(`from '${lib}'`) || content.includes(`from "${lib}"`)) {
        const isClientComponent = content.includes("'use client'")
        const isDynamic = content.includes('dynamic(') || content.includes('lazy(')
        
        if (isClientComponent && !isDynamic) {
          issues.push(this.createIssue(
            'suggestion',
            'performance',
            `Heavy library '${lib}' could be dynamically imported`,
            'Consider dynamic import for non-critical heavy dependencies',
            relativeFilePath,
            undefined,
            `import dynamic from 'next/dynamic'\n\nconst HeavyComponent = dynamic(() => import('./HeavyComponent'), {\n  loading: () => <div>Loading...</div>\n})`
          ))
        }
      }
    })
    
    // Check for large inline objects/arrays that could be moved to separate files
    const largeDataRegex = /const\s+\w+\s*=\s*[\[{][\s\S]{500,}/g
    const largeDataMatches = content.match(largeDataRegex)
    
    if (largeDataMatches && largeDataMatches.length > 0) {
      issues.push(this.createIssue(
        'suggestion',
        'performance',
        'Large inline data detected',
        'Consider moving large data objects to separate files for better code splitting',
        relativeFilePath
      ))
    }
    
    // Check for barrel export anti-pattern
    if (content.includes('export * from') && filePath.includes('index.ts')) {
      const exportCount = (content.match(/export \* from/g) || []).length
      if (exportCount > 10) {
        issues.push(this.createIssue(
          'warning',
          'performance',
          'Large barrel export detected',
          'Consider reducing barrel exports or using direct imports to improve tree shaking',
          relativeFilePath
        ))
      }
    }
  }
  
  private async checkCachingPatterns(issues: VerificationIssue[]) {
    // Check Next.js config for proper caching headers
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js')
    const nextConfig = await this.readFile(nextConfigPath)
    
    if (nextConfig) {
      if (!nextConfig.includes('Cache-Control')) {
        issues.push(this.createIssue(
          'suggestion',
          'performance',
          'Missing cache headers configuration in next.config.js',
          'Add cache headers for static assets and API routes',
          'next.config.js',
          undefined,
          `async headers() {\n  return [\n    {\n      source: '/api/:path*',\n      headers: [\n        { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' }\n      ]\n    }\n  ]\n}`
        ))
      }
    }
    
    // Check for fetch calls without caching
    await this.checkFetchCaching(issues)
  }
  
  private async checkFetchCaching(issues: VerificationIssue[]) {
    const searchPath = path.join(this.projectRoot, 'src')
    await this.scanForFetchCalls(issues, searchPath)
  }
  
  private async scanForFetchCalls(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForFetchCalls(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForFetchCalls(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForFetchCalls(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    const fetchRegex = /fetch\(\s*['"][^'"]+['"]\s*\)/g
    const fetchMatches = content.match(fetchRegex)
    
    if (fetchMatches) {
      fetchMatches.forEach(fetchCall => {
        if (!content.includes('cache:') && !content.includes('revalidate:')) {
          const lineNumber = this.getLineNumber(content, fetchCall)
          issues.push(this.createIssue(
            'suggestion',
            'performance',
            'Fetch call without caching configuration',
            'Add caching configuration to fetch calls for better performance',
            relativeFilePath,
            lineNumber,
            "fetch(url, { next: { revalidate: 300 } }) // 5 minutes cache"
          ))
        }
      })
    }
  }
  
  private async checkPerformanceAntiPatterns(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForAntiPatterns(issues, searchPath)
    }
  }
  
  private async scanForAntiPatterns(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForAntiPatterns(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForAntiPatterns(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForAntiPatterns(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for useEffect with missing dependencies
    if (content.includes('useEffect')) {
      const useEffectRegex = /useEffect\(\s*\(\)\s*=>\s*{[\s\S]*?}\s*,\s*\[([^\]]*)\]/g
      const matches = [...content.matchAll(useEffectRegex)]
      
      matches.forEach(match => {
        if (!match[1] || !match[0]) return
        const deps = match[1].trim()
        const effectBody = match[0]
        
        // Simple heuristic: if there are variables referenced but deps are empty
        if (deps === '' && (effectBody.includes('const') || effectBody.includes('let'))) {
          const lineNumber = this.getLineNumber(content, match[0])
          issues.push(this.createIssue(
            'warning',
            'performance',
            'useEffect with potentially missing dependencies',
            'Review useEffect dependencies to prevent unnecessary re-renders',
            relativeFilePath,
            lineNumber
          ))
        }
      })
    }
    
    // Check for inline functions in JSX that could cause re-renders
    const inlineFunctionRegex = /onClick={\(\)\s*=>|onChange={\(\)\s*=>/g
    const inlineFunctionMatches = content.match(inlineFunctionRegex)
    
    if (inlineFunctionMatches && inlineFunctionMatches.length > 3) {
      issues.push(this.createIssue(
        'suggestion',
        'performance',
        'Multiple inline functions detected in JSX',
        'Consider using useCallback or extracting functions to prevent unnecessary re-renders',
        relativeFilePath,
        undefined,
        'const handleClick = useCallback(() => {\n  // handler logic\n}, [dependencies])'
      ))
    }
    
    // Check for missing React.memo on components with props
    if (content.includes('interface') && content.includes('Props') && !content.includes('memo(')) {
      const hasPropsInterface = /interface\s+\w+Props/.test(content)
      const isComplexComponent = content.length > 500 // Simple heuristic
      
      if (hasPropsInterface && isComplexComponent) {
        issues.push(this.createIssue(
          'suggestion',
          'performance',
          'Complex component could benefit from React.memo',
          'Consider wrapping component with React.memo to prevent unnecessary re-renders',
          relativeFilePath,
          undefined,
          'import { memo } from \'react\'\n\nconst Component = memo(function Component(props) {\n  // component logic\n})'
        ))
      }
    }
  }
  
  private getLineNumbers(content: string, regex: RegExp): number[] {
    const lines = content.split('\n')
    const lineNumbers: number[] = []
    
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        lineNumbers.push(index + 1)
        regex.lastIndex = 0 // Reset regex for next test
      }
    })
    
    return lineNumbers
  }
  
  private getLineNumber(content: string, searchString: string): number {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.includes(searchString)) {
        return i + 1
      }
    }
    return 1
  }
}

/**
 * 4. Type Safety Guardian
 */
class TypeSafetyVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []
    
    // Check Payload types usage
    await this.checkPayloadTypesUsage(issues, targets)
    
    // Check interface definitions
    await this.checkInterfaceDefinitions(issues, targets)
    
    // Check type guards and runtime safety
    await this.checkTypeGuards(issues, targets)
    
    // Check for any/unknown usage
    await this.checkGenericTypeUsage(issues, targets)
    
    // Check generated types availability
    await this.checkGeneratedTypes(issues)
    
    // Check for proper error handling patterns
    await this.checkErrorHandlingPatterns(issues, targets)
    
    const critical = issues.filter(i => i.type === 'critical').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const score = Math.max(0, 100 - (critical * 30) - (warnings * 10) - (issues.length * 4))
    
    return {
      passed: critical === 0,
      score,
      issues
    }
  }
  
  private async checkPayloadTypesUsage(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForPayloadTypesUsage(issues, searchPath)
    }
  }
  
  private async scanForPayloadTypesUsage(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForPayloadTypesUsage(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForPayloadTypes(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForPayloadTypes(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for usage of generated Payload types
    const payloadCollections = [
      'Product', 'Media', 'User',
      'HomePage', 'PianosPage', 'DealerLocation', 'ConsultationBooking'
    ]
    
    // Check if file uses Payload data but not the proper types
    const usesPayloadData = payloadCollections.some(collection => 
      content.includes(`'${collection.toLowerCase()}s'`) || 
      content.includes(`"${collection.toLowerCase()}s"`)
    )
    
    if (usesPayloadData) {
      const importsPayloadTypes = content.includes('from \'@/payload-types\'') || 
                                 content.includes('from "@/payload-types"')
      
      if (!importsPayloadTypes) {
        issues.push(this.createIssue(
          'critical',
          'type-safety',
          'File uses Payload collections without importing generated types',
          'Import generated types from @/payload-types for type safety',
          relativeFilePath,
          undefined,
          `import type { ${payloadCollections.join(', ')} } from '@/payload-types'`
        ))
      }
    }
    
    // Check for generic object types that should use Payload types
    const genericObjectPatterns = [
      /const\s+\w+:\s*{[^}]*}/g,
      /interface\s+\w+\s*{[^}]*product[^}]*}/gi,
      /interface\s+\w+\s*{[^}]*media[^}]*}/gi
    ]
    
    genericObjectPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const lineNumber = this.getLineNumber(content, match)
          issues.push(this.createIssue(
            'warning',
            'type-safety',
            'Generic object type detected - consider using Payload types',
            'Use generated Payload types instead of generic objects for better type safety',
            relativeFilePath,
            lineNumber
          ))
        })
      }
    })
    
    // Check for proper type assertion patterns
    if (content.includes('as any') || content.includes('as unknown')) {
      const asAnyMatches = content.match(/as (any|unknown)/g)
      if (asAnyMatches) {
        const lineNumber = this.getLineNumber(content, asAnyMatches[0])
        issues.push(this.createIssue(
          'warning',
          'type-safety',
          'Type assertion bypassing type safety detected',
          'Avoid type assertions - use proper types or type guards instead',
          relativeFilePath,
          lineNumber,
          '// Instead of:\nconst data = response as any\n\n// Use type guard:\nfunction isValidData(data: unknown): data is ExpectedType {\n  return typeof data === "object" && data !== null\n}'
        ))
      }
    }
    
    // Check for missing type definitions on functions
    const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{/g
    const arrowFunctionRegex = /const\s+\w+\s*=\s*\([^)]*\)\s*=>/g
    
    const functionMatches = [
      ...(content.match(functionRegex) || []),
      ...(content.match(arrowFunctionRegex) || [])
    ]
    
    functionMatches.forEach(func => {
      // Simple heuristic: check if function has type annotations
      if (!func.includes(':') && !func.includes('void') && !func.includes('Promise')) {
        const lineNumber = this.getLineNumber(content, func)
        issues.push(this.createIssue(
          'suggestion',
          'type-safety',
          'Function missing return type annotation',
          'Add explicit return type annotations for better type safety',
          relativeFilePath,
          lineNumber,
          '// Add return type:\nfunction fetchData(): Promise<Product[]> {\n  // implementation\n}'
        ))
      }
    })
  }
  
  private async checkInterfaceDefinitions(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForInterfaceDefinitions(issues, searchPath)
    }
  }
  
  private async scanForInterfaceDefinitions(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForInterfaceDefinitions(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForInterfaces(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForInterfaces(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for proper component props interfaces
    const componentRegex = /^export default function (\w+)/m
    const componentMatch = content.match(componentRegex)
    
    if (componentMatch) {
      const componentName = componentMatch[1]
      const propsInterfaceName = `${componentName}Props`
      
      // Check if component has props parameter
      const componentFunctionRegex = new RegExp(`function ${componentName}\\s*\\(([^)]*)\\)`)
      const functionMatch = content.match(componentFunctionRegex)
      
      if (functionMatch && functionMatch[1]?.trim()) {
        // Component has props, check for interface
        if (!content.includes(`interface ${propsInterfaceName}`)) {
          issues.push(this.createIssue(
            'warning',
            'type-safety',
            'Component with props missing interface definition',
            `Create ${propsInterfaceName} interface for type safety`,
            relativeFilePath,
            undefined,
            `interface ${propsInterfaceName} {\n  // Define prop types here\n}\n\nexport default function ${componentName}(props: ${propsInterfaceName}) {\n  // component logic\n}`
          ))
        }
      }
    }
    
    // Check for interfaces with 'any' types
    const interfaceRegex = /interface\s+\w+\s*{[^}]*}/gs
    const interfaceMatches = content.match(interfaceRegex)
    
    if (interfaceMatches) {
      interfaceMatches.forEach(interfaceStr => {
        if (interfaceStr.includes(': any')) {
          const lineNumber = this.getLineNumber(content, interfaceStr)
          issues.push(this.createIssue(
            'warning',
            'type-safety',
            'Interface property using \'any\' type',
            'Replace \'any\' with specific types for better type safety',
            relativeFilePath,
            lineNumber,
            '// Instead of:\ninterface Props {\n  data: any\n}\n\n// Use specific types:\ninterface Props {\n  data: Product | null\n}'
          ))
        }
        
        // Check for missing readonly modifiers on props
        if (interfaceStr.includes('Props') && !interfaceStr.includes('readonly')) {
          const hasComplexProps = interfaceStr.includes('[]') || interfaceStr.includes('{}')
          if (hasComplexProps) {
            issues.push(this.createIssue(
              'suggestion',
              'type-safety',
              'Props interface could benefit from readonly modifiers',
              'Add readonly modifiers to prevent accidental mutations',
              relativeFilePath,
              undefined,
              'interface Props {\n  readonly items: readonly Product[]\n  readonly config: Readonly<Config>\n}'
            ))
          }
        }
      })
    }
    
    // Check for proper optional vs required properties
    if (interfaceMatches) {
      interfaceMatches.forEach(interfaceStr => {
        const optionalCount = (interfaceStr.match(/\?:/g) || []).length
        const totalProps = (interfaceStr.match(/\w+\s*[?:]:/g) || []).length
        
        // If more than 70% of properties are optional, suggest reviewing
        if (totalProps > 3 && optionalCount / totalProps > 0.7) {
          issues.push(this.createIssue(
            'suggestion',
            'type-safety',
            'Interface has many optional properties',
            'Review if all optional properties are necessary - consider splitting interfaces or making some required',
            relativeFilePath
          ))
        }
      })
    }
  }
  
  private async checkTypeGuards(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForTypeGuards(issues, searchPath)
    }
  }
  
  private async scanForTypeGuards(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForTypeGuards(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForTypeGuards(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForTypeGuards(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for proper type guards for Media objects (common in KAWAI)
    if (content.includes('Media') && content.includes('payload-types')) {
      const hasMediaTypeGuard = content.includes('isMediaObject') || 
                               content.includes('typeof media === \'object\'') ||
                               content.includes('is Media')
      
      if (!hasMediaTypeGuard && content.includes('media.url')) {
        issues.push(this.createIssue(
          'critical',
          'type-safety',
          'Media object used without type guard - potential runtime error',
          'Add type guard to check if media is object before accessing properties',
          relativeFilePath,
          undefined,
          'function isMediaObject(media: Media | string | null): media is Media {\n  return typeof media === "object" && media !== null && "url" in media\n}\n\nif (isMediaObject(media)) {\n  // Safe to access media.url\n  const url = media.url\n}'
        ))
      }
    }
    
    // Check for API response handling without proper validation
    const fetchRegex = /fetch\([^)]+\)/g
    const fetchMatches = content.match(fetchRegex)
    
    if (fetchMatches) {
      // Look for .json() calls without type validation
      if (content.includes('.json()') && !content.includes('is ') && !content.includes('validate')) {
        issues.push(this.createIssue(
          'warning',
          'type-safety',
          'API response parsing without type validation',
          'Add runtime type validation for API responses',
          relativeFilePath,
          undefined,
          'const response = await fetch(url)\nconst data = await response.json()\n\n// Add validation:\nif (isValidProductData(data)) {\n  // Safe to use data as Product\n}'
        ))
      }
    }
    
    // Check for array operations without proper type checking
    if (content.includes('.find(') || content.includes('.filter(')) {
      const arrayOperations = content.match(/\.(find|filter|map)\([^)]+\)/g)
      
      if (arrayOperations) {
        arrayOperations.forEach(operation => {
          if (operation.includes('item.') && !content.includes('if (item')) {
            issues.push(this.createIssue(
              'suggestion',
              'type-safety',
              'Array operation accessing properties without null check',
              'Add null/undefined checks when accessing properties in array operations',
              relativeFilePath,
              undefined,
              'items.filter(item => item && item.property)\n// or\nitems.filter((item): item is ValidType => Boolean(item?.property))'
            ))
          }
        })
      }
    }
  }
  
  private async checkGenericTypeUsage(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForGenericTypes(issues, searchPath)
    }
  }
  
  private async scanForGenericTypes(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForGenericTypes(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForGenericTypes(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForGenericTypes(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for 'any' usage
    const anyMatches = content.match(/:\s*any(?!\w)/g)
    if (anyMatches && anyMatches.length > 0) {
      anyMatches.forEach(match => {
        const lineNumber = this.getLineNumber(content, match)
        issues.push(this.createIssue(
          'critical',
          'type-safety',
          '\'any\' type detected - bypasses type safety',
          'Replace \'any\' with specific types from payload-types or create proper interfaces',
          relativeFilePath,
          lineNumber,
          '// Instead of:\nconst data: any = response\n\n// Use specific types:\nconst data: Product = response\n// or\nconst data: unknown = response'
        ))
      })
    }
    
    // Check for excessive unknown usage
    const unknownMatches = content.match(/:\s*unknown(?!\w)/g)
    if (unknownMatches && unknownMatches.length > 3) {
      issues.push(this.createIssue(
        'warning',
        'type-safety',
        'Excessive \'unknown\' type usage detected',
        'Consider creating specific types or interfaces for better type safety',
        relativeFilePath
      ))
    }
    
    // Check for object index signatures without proper typing
    const indexSignatureRegex = /\[[^\]]+:\s*string\]:\s*any/g
    const indexMatches = content.match(indexSignatureRegex)
    
    if (indexMatches) {
      issues.push(this.createIssue(
        'warning',
        'type-safety',
        'Index signature with \'any\' value type detected',
        'Use specific types for index signature values',
        relativeFilePath,
        undefined,
        '// Instead of:\ninterface Config {\n  [key: string]: any\n}\n\n// Use specific types:\ninterface Config {\n  [key: string]: string | number | boolean\n}'
      ))
    }
    
    // Check for @ts-ignore or @ts-nocheck
    if (content.includes('@ts-ignore') || content.includes('@ts-nocheck')) {
      const tsIgnoreMatches = content.match(/@ts-(ignore|nocheck)/g)
      if (tsIgnoreMatches) {
        tsIgnoreMatches.forEach(match => {
          const lineNumber = this.getLineNumber(content, match)
          issues.push(this.createIssue(
            'critical',
            'type-safety',
            `TypeScript suppression directive '${match}' detected`,
            'Remove TypeScript suppressions and fix underlying type issues',
            relativeFilePath,
            lineNumber
          ))
        })
      }
    }
  }
  
  private async checkGeneratedTypes(issues: VerificationIssue[]) {
    const payloadTypesPath = path.join(this.projectRoot, 'src/payload-types.ts')
    
    if (!(await this.fileExists(payloadTypesPath))) {
      issues.push(this.createIssue(
        'critical',
        'type-safety',
        'Missing generated Payload types file',
        'Run build process to generate src/payload-types.ts from CMS schema',
        'src/payload-types.ts',
        undefined,
        'bun run build // This will generate payload-types.ts'
      ))
      return
    }
    
    const typesContent = await this.readFile(payloadTypesPath)
    if (!typesContent) {
      issues.push(this.createIssue(
        'critical',
        'type-safety',
        'Empty or corrupted Payload types file',
        'Regenerate payload-types.ts by running the build process',
        'src/payload-types.ts'
      ))
      return
    }
    
    // Check if types file is up to date (basic heuristic)
    const expectedTypes = ['Product', 'Media', 'User', 'HomePage']
    const missingTypes = expectedTypes.filter(type => !typesContent.includes(`export interface ${type}`))
    
    if (missingTypes.length > 0) {
      issues.push(this.createIssue(
        'warning',
        'type-safety',
        `Generated types missing expected interfaces: ${missingTypes.join(', ')}`,
        'Regenerate types after updating Payload collections',
        'src/payload-types.ts'
      ))
    }
    
    // Check file modification time vs collections
    const collectionsDir = path.join(this.projectRoot, 'src/collections')
    if (await this.fileExists(collectionsDir)) {
      try {
        const typesStats = await fs.stat(payloadTypesPath)
        const collectionsStats = await fs.stat(collectionsDir)
        
        if (collectionsStats.mtime > typesStats.mtime) {
          issues.push(this.createIssue(
            'warning',
            'type-safety',
            'Generated types may be outdated - collections modified after types generation',
            'Regenerate types by running build process',
            'src/payload-types.ts'
          ))
        }
      } catch (error) {
        // Can't check modification times
      }
    }
  }
  
  private async checkErrorHandlingPatterns(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForErrorHandling(issues, searchPath)
    }
  }
  
  private async scanForErrorHandling(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForErrorHandling(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForErrorHandling(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForErrorHandling(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for try/catch blocks with proper error typing
    const tryCatchRegex = /try\s*{[\s\S]*?}\s*catch\s*\(([^)]+)\)\s*{[\s\S]*?}/g
    const tryCatchMatches = [...content.matchAll(tryCatchRegex)]
    
    tryCatchMatches.forEach(match => {
      if (!match[1]) return
      const errorParam = match[1].trim()
      
      if (errorParam === 'error' || errorParam === 'e') {
        // Check if error is typed
        if (!content.includes(': Error') && !content.includes(': unknown')) {
          const lineNumber = this.getLineNumber(content, match[0])
          issues.push(this.createIssue(
            'warning',
            'type-safety',
            'Catch block with untyped error parameter',
            'Type error parameter for better error handling',
            relativeFilePath,
            lineNumber,
            'try {\n  // code\n} catch (error: unknown) {\n  if (error instanceof Error) {\n    console.error(error.message)\n  }\n}'
          ))
        }
      }
    })
    
    // Check for async functions without proper error handling
    const asyncFunctionRegex = /async\s+function\s+\w+[\s\S]*?{[\s\S]*?}/g
    const asyncMatches = [...content.matchAll(asyncFunctionRegex)]
    
    asyncMatches.forEach(match => {
      const functionBody = match[0]
      const hasTryCatch = functionBody.includes('try') && functionBody.includes('catch')
      const hasAwait = functionBody.includes('await')
      
      if (hasAwait && !hasTryCatch && !functionBody.includes('.catch(')) {
        const lineNumber = this.getLineNumber(content, match[0])
        issues.push(this.createIssue(
          'warning',
          'type-safety',
          'Async function with await but no error handling',
          'Add try/catch blocks or .catch() for async operations',
          relativeFilePath,
          lineNumber,
          'async function fetchData() {\n  try {\n    const result = await api.getData()\n    return result\n  } catch (error) {\n    console.error("Error fetching data:", error)\n    return null\n  }\n}'
        ))
      }
    })
    
    // Check for Promise usage without proper error handling
    if (content.includes('.then(') && !content.includes('.catch(')) {
      issues.push(this.createIssue(
        'suggestion',
        'type-safety',
        'Promise chain without error handling',
        'Add .catch() handler to Promise chains',
        relativeFilePath,
        undefined,
        'promise\n  .then(result => {\n    // handle success\n  })\n  .catch(error => {\n    // handle error\n  })'
      ))
    }
  }
  
  private getLineNumber(content: string, searchString: string): number {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.includes(searchString)) {
        return i + 1
      }
    }
    return 1
  }
}

/**
 * 5. Maintainability & Organization Assessor
 */
class MaintainabilityVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []
    
    // Check file naming conventions
    await this.checkFileNamingConventions(issues, targets)
    
    // Check component structure and documentation
    await this.checkComponentStructure(issues, targets)
    
    // Check code organization and patterns
    await this.checkCodeOrganization(issues, targets)
    
    // Check testing coverage and patterns
    await this.checkTestingPatterns(issues, targets)
    
    // Check documentation consistency
    await this.checkDocumentation(issues, targets)
    
    // Check for code smells and maintainability issues
    await this.checkCodeSmells(issues, targets)
    
    const critical = issues.filter(i => i.type === 'critical').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const score = Math.max(0, 100 - (critical * 20) - (warnings * 8) - (issues.length * 3))
    
    return {
      passed: critical === 0,
      score,
      issues
    }
  }
  
  private async checkFileNamingConventions(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForNamingConventions(issues, searchPath)
    }
  }
  
  private async scanForNamingConventions(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const relativeFilePath = path.relative(this.projectRoot, fullPath)
        
        if (entry.isDirectory()) {
          await this.scanForNamingConventions(issues, fullPath)
        } else {
          await this.validateFileName(issues, fullPath, relativeFilePath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateFileName(issues: VerificationIssue[], fullPath: string, relativeFilePath: string) {
    const fileName = path.basename(fullPath)
    const fileDir = path.dirname(relativeFilePath)
    
    // Skip generated and config files
    if (fileName.includes('payload-types') || fileName.includes('.config.') || fileName.includes('.d.ts')) {
      return
    }
    
    // Check component files (in components directory)
    if (fileDir.includes('components') && (fileName.endsWith('.tsx') || fileName.endsWith('.ts'))) {
      if (!KAWAI_PATTERNS.NAMING_CONVENTIONS.COMPONENTS.test(fileName)) {
        issues.push(this.createIssue(
          'warning',
          'maintainability',
          `Component file '${fileName}' doesn't follow PascalCase naming convention`,
          'Use PascalCase for component files (e.g., PianoCard.tsx, MediaRenderer.tsx)',
          relativeFilePath,
          undefined,
          '// Rename file to PascalCase:\n// piano-card.tsx → PianoCard.tsx\n// media_renderer.tsx → MediaRenderer.tsx'
        ))
      }
    }
    
    // Check utility files (in lib directory)
    if (fileDir.includes('lib') && fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) {
      if (!KAWAI_PATTERNS.NAMING_CONVENTIONS.UTILITIES.test(fileName)) {
        issues.push(this.createIssue(
          'warning',
          'maintainability',
          `Utility file '${fileName}' doesn't follow camelCase naming convention`,
          'Use camelCase for utility files (e.g., mediaUtils.ts, payloadServer.ts)',
          relativeFilePath,
          undefined,
          '// Rename file to camelCase:\n// media_utils.ts → mediaUtils.ts\n// payload-server.ts → payloadServer.ts'
        ))
      }
    }
    
    // Check page files
    if (fileName === 'page.tsx') {
      const pageDir = path.dirname(relativeFilePath)
      const pageName = path.basename(pageDir)
      
      // Check if page directory follows kebab-case (except for route groups)
      if (!pageName.startsWith('(') && !pageName.startsWith('[') && pageName !== 'app') {
        if (!/^[a-z][a-z0-9-]*$/.test(pageName)) {
          issues.push(this.createIssue(
            'suggestion',
            'maintainability',
            `Page directory '${pageName}' should follow kebab-case naming for SEO`,
            'Use kebab-case for page directories to improve URL structure',
            relativeFilePath
          ))
        }
      }
    }
    
    // Check for inconsistent naming patterns
    if (fileName.includes('_') && fileName.includes('-')) {
      issues.push(this.createIssue(
        'warning',
        'maintainability',
        `File '${fileName}' mixes naming conventions (underscores and hyphens)`,
        'Use consistent naming convention - prefer camelCase for utilities, PascalCase for components',
        relativeFilePath
      ))
    }
    
    // Check for very long file names
    if (fileName.length > 50) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        `File name '${fileName}' is very long (${fileName.length} characters)`,
        'Consider shorter, more descriptive file names for better maintainability',
        relativeFilePath
      ))
    }
  }
  
  private async checkComponentStructure(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src/components')]
    
    for (const searchPath of searchPaths) {
      await this.scanForComponentStructure(issues, searchPath)
    }
  }
  
  private async scanForComponentStructure(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForComponentStructure(issues, fullPath)
        } else if (entry.name.endsWith('.tsx')) {
          await this.validateComponentStructure(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateComponentStructure(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    const fileName = path.basename(filePath, '.tsx')
    
    // Check for proper export structure
    const hasDefaultExport = content.includes('export default')
    if (!hasDefaultExport) {
      issues.push(this.createIssue(
        'critical',
        'maintainability',
        'Component missing default export',
        'Add default export for component consistency',
        relativeFilePath,
        undefined,
        `export default function ${fileName}() {\n  return <div>{/* component content */}</div>\n}`
      ))
    }
    
    // Check if component name matches file name
    const exportMatch = content.match(/export default function (\w+)/)
    if (exportMatch && exportMatch[1] !== fileName) {
      issues.push(this.createIssue(
        'warning',
        'maintainability',
        `Component function name '${exportMatch[1]}' doesn't match file name '${fileName}'`,
        'Match component function name with file name for consistency',
        relativeFilePath,
        undefined,
        `// File: ${fileName}.tsx\nexport default function ${fileName}() {\n  // component logic\n}`
      ))
    }
    
    // Check for proper component organization
    const lines = content.split('\n')
    const importEndIndex = lines.findIndex(line => !line.trim().startsWith('import') && !line.trim().startsWith('//') && line.trim() !== '')
    const componentStartIndex = lines.findIndex(line => line.includes('export default function'))
    
    if (importEndIndex > 0 && componentStartIndex > 0) {
      // Check for proper spacing between imports and component
      if (componentStartIndex - importEndIndex < 2) {
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          'Missing blank line between imports and component definition',
          'Add blank lines for better code organization',
          relativeFilePath,
          componentStartIndex
        ))
      }
    }
    
    // Check for large components that should be split
    const lineCount = lines.length
    if (lineCount > 200) {
      issues.push(this.createIssue(
        'warning',
        'maintainability',
        `Component is very large (${lineCount} lines)`,
        'Consider breaking down large components into smaller, reusable components',
        relativeFilePath
      ))
    }
    
    // Check for proper prop destructuring
    if (content.includes('props.') && !content.includes('const {') && !content.includes('= props')) {
      const propsUsageCount = (content.match(/props\./g) || []).length
      if (propsUsageCount > 3) {
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          'Consider destructuring props for better readability',
          'Destructure commonly used props at the component start',
          relativeFilePath,
          undefined,
          'export default function Component({ title, items, onAction }: ComponentProps) {\n  // Use title, items, onAction directly\n}'
        ))
      }
    }
    
    // Check for missing component documentation
    if (!content.includes('/**') && !content.includes('//') && lineCount > 50) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        'Complex component missing documentation',
        'Add JSDoc comments to document component purpose and props',
        relativeFilePath,
        undefined,
        '/**\n * ComponentName - Brief description of what this component does\n * \n * @param props - Component props\n * @returns JSX element\n */\nexport default function ComponentName(props: ComponentProps) {\n  // implementation\n}'
      ))
    }
  }
  
  private async checkCodeOrganization(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForCodeOrganization(issues, searchPath)
    }
  }
  
  private async scanForCodeOrganization(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.validateDirectoryStructure(issues, fullPath)
          await this.scanForCodeOrganization(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.validateCodeOrganization(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateDirectoryStructure(issues: VerificationIssue[], dirPath: string) {
    const relativeDir = path.relative(this.projectRoot, dirPath)
    const dirName = path.basename(dirPath)
    
    // Check for empty directories
    try {
      const entries = await fs.readdir(dirPath)
      if (entries.length === 0) {
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          `Empty directory detected: ${relativeDir}`,
          'Remove empty directories or add content to maintain clean project structure',
          relativeDir
        ))
      }
    } catch (error) {
      // Can't read directory
    }
    
    // Check for directories with too many files (suggests need for sub-organization)
    if (dirName === 'components') {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })
        const componentFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
        
        if (componentFiles.length > 20) {
          issues.push(this.createIssue(
            'suggestion',
            'maintainability',
            `Components directory has ${componentFiles.length} files`,
            'Consider organizing components into subdirectories by feature or layer',
            relativeDir
          ))
        }
      } catch (error) {
        // Can't read directory
      }
    }
  }
  
  private async validateCodeOrganization(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for consistent code style
    const lines = content.split('\n')
    
    // Check for mixed indentation
    let hasSpaces = false
    let hasTabs = false
    
    lines.forEach(line => {
      if (line.startsWith(' ')) hasSpaces = true
      if (line.startsWith('\t')) hasTabs = true
    })
    
    if (hasSpaces && hasTabs) {
      issues.push(this.createIssue(
        'warning',
        'maintainability',
        'Mixed indentation detected (spaces and tabs)',
        'Use consistent indentation throughout the file (prefer spaces)',
        relativeFilePath
      ))
    }
    
    // Check for very long lines
    const longLines = lines.filter(line => line.length > 120)
    if (longLines.length > 5) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        `${longLines.length} lines exceed 120 characters`,
        'Break long lines for better readability',
        relativeFilePath
      ))
    }
    
    // Check for proper spacing around operators
    const operatorPatterns = [
      /\w\+\w/g, // no spaces around +
      /\w\-\w/g, // no spaces around -
      /\w\*\w/g, // no spaces around *
      /\w\=\w/g  // no spaces around =
    ]
    
    operatorPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches && matches.length > 3) {
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          'Inconsistent spacing around operators',
          'Add consistent spaces around operators for better readability',
          relativeFilePath,
          undefined,
          '// Good:\nconst result = a + b * c\n\n// Bad:\nconst result=a+b*c'
        ))
      }
    })
    
    // Check for excessive nested conditions
    const nestedIfCount = (content.match(/\s{6,}if\s*\(/g) || []).length // 6+ spaces = deeply nested
    if (nestedIfCount > 3) {
      issues.push(this.createIssue(
        'warning',
        'maintainability',
        'Deeply nested conditions detected',
        'Consider refactoring nested conditions into separate functions or early returns',
        relativeFilePath,
        undefined,
        '// Instead of deep nesting:\nif (condition1) {\n  if (condition2) {\n    if (condition3) {\n      // logic\n    }\n  }\n}\n\n// Use early returns:\nif (!condition1) return\nif (!condition2) return\nif (!condition3) return\n// logic'
      ))
    }
  }
  
  private async checkTestingPatterns(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForTestingPatterns(issues, searchPath)
    }
  }
  
  private async scanForTestingPatterns(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      // Look for components without corresponding test files
      const componentFiles = entries.filter(entry => 
        entry.isFile() && entry.name.endsWith('.tsx') && !entry.name.includes('.test.') && !entry.name.includes('.spec.')
      )
      
      const testFiles = entries.filter(entry => 
        entry.isFile() && (entry.name.includes('.test.') || entry.name.includes('.spec.'))
      )
      
      // Check for components without tests
      componentFiles.forEach(componentFile => {
        const componentName = componentFile.name.replace('.tsx', '')
        const hasTest = testFiles.some(testFile => 
          testFile.name.includes(componentName)
        )
        
        if (!hasTest && !componentFile.name.includes('index')) {
          const filePath = path.join(dirPath, componentFile.name)
          const relativeFilePath = path.relative(this.projectRoot, filePath)
          
          issues.push(this.createIssue(
            'suggestion',
            'maintainability',
            `Component '${componentName}' missing test file`,
            'Add test file for component to ensure reliability',
            relativeFilePath,
            undefined,
            `// Create ${componentName}.test.tsx:\nimport { render, screen } from '@testing-library/react'\nimport ${componentName} from './${componentName}'\n\ndescribe('${componentName}', () => {\n  it('renders correctly', () => {\n    render(<${componentName} />)\n    // Add assertions\n  })\n})`
          ))
        }
      })
      
      // Check existing test files for proper structure
      testFiles.forEach(async testFile => {
        const testFilePath = path.join(dirPath, testFile.name)
        await this.validateTestStructure(issues, testFilePath)
      })
      
      // Recursively scan subdirectories
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(dirPath, entry.name)
          await this.scanForTestingPatterns(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateTestStructure(issues: VerificationIssue[], testFilePath: string) {
    const content = await this.readFile(testFilePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, testFilePath)
    
    // Check for proper testing library imports
    if (content.includes('.tsx') || content.includes('render(')) {
      if (!content.includes('@testing-library/react')) {
        issues.push(this.createIssue(
          'warning',
          'maintainability',
          'Test file missing proper testing library imports',
          'Import from @testing-library/react for component testing',
          relativeFilePath,
          undefined,
          "import { render, screen } from '@testing-library/react'"
        ))
      }
    }
    
    // Check for describe blocks
    if (!content.includes('describe(')) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        'Test file missing describe blocks for organization',
        'Use describe blocks to group related tests',
        relativeFilePath,
        undefined,
        "describe('ComponentName', () => {\n  it('should render correctly', () => {\n    // test logic\n  })\n})"
      ))
    }
    
    // Check for proper test descriptions
    const itBlocks = content.match(/it\(['"](.*?)['"],/g)
    if (itBlocks) {
      itBlocks.forEach(itBlock => {
        const description = itBlock.match(/it\(['"](.*?)['"],/)?.[1]
        if (description && description.length < 10) {
          issues.push(this.createIssue(
            'suggestion',
            'maintainability',
            'Test has very short description',
            'Write descriptive test names that explain what is being tested',
            relativeFilePath,
            undefined,
            '// Good: it("should display error message when validation fails", () => {})\n// Bad: it("test", () => {})'
          ))
        }
      })
    }
  }
  
  private async checkDocumentation(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForDocumentation(issues, searchPath)
    }
  }
  
  private async scanForDocumentation(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForDocumentation(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.validateDocumentation(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateDocumentation(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    const fileName = path.basename(filePath)
    
    // Check for README files in component directories
    if (filePath.includes('components') && fileName === 'index.ts') {
      const dirPath = path.dirname(filePath)
      const readmePath = path.join(dirPath, 'README.md')
      
      if (!(await this.fileExists(readmePath))) {
        const componentFiles = await fs.readdir(dirPath)
        const hasMultipleComponents = componentFiles.filter(f => f.endsWith('.tsx')).length > 1
        
        if (hasMultipleComponents) {
          issues.push(this.createIssue(
            'suggestion',
            'maintainability',
            'Complex component directory missing README',
            'Add README.md to document component usage and architecture',
            relativeFilePath
          ))
        }
      }
    }
    
    // Check for proper JSDoc on complex functions
    const functionRegex = /export\s+(async\s+)?function\s+(\w+)\s*\(/g
    const functions = [...content.matchAll(functionRegex)]
    
    functions.forEach(match => {
      const functionName = match[2]
      const functionStart = match.index || 0
      
      // Check if function has JSDoc comment before it
      const beforeFunction = content.substring(0, functionStart)
      const lastJSDocIndex = beforeFunction.lastIndexOf('/**')
      const lastLineBreak = beforeFunction.lastIndexOf('\n')
      
      if (lastJSDocIndex < lastLineBreak - 100) { // JSDoc is too far or doesn't exist
        const lineNumber = (content.substring(0, functionStart).match(/\n/g) || []).length + 1
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          `Exported function '${functionName}' missing JSDoc documentation`,
          'Add JSDoc comments for exported functions to improve maintainability',
          relativeFilePath,
          lineNumber,
          '/**\n * Brief description of what this function does\n * \n * @param paramName - Description of parameter\n * @returns Description of return value\n */'
        ))
      }
    })
    
    // Check for TODO comments that are too old or numerous
    const todoMatches = content.match(/\/\/\s*TODO:?\s*(.+)/gi)
    if (todoMatches && todoMatches.length > 5) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        `File has ${todoMatches.length} TODO comments`,
        'Review and address TODO comments or create proper issues for tracking',
        relativeFilePath
      ))
    }
    
    // Check for commented-out code
    const lines = content.split('\n')
    const commentedCodeLines = lines.filter(line => {
      const trimmed = line.trim()
      return trimmed.startsWith('// ') && 
             (trimmed.includes('function') || trimmed.includes('const ') || 
              trimmed.includes('if (') || trimmed.includes('return '))
    })
    
    if (commentedCodeLines.length > 3) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        'Multiple lines of commented-out code detected',
        'Remove commented-out code or create proper code examples in documentation',
        relativeFilePath
      ))
    }
  }
  
  private async checkCodeSmells(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForCodeSmells(issues, searchPath)
    }
  }
  
  private async scanForCodeSmells(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForCodeSmells(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.validateCodeSmells(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async validateCodeSmells(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for duplicate code patterns
    const lines = content.split('\n')
    const duplicateThreshold = 5
    const duplicateMap: { [key: string]: number[] } = {}
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed.length > 20 && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        if (!duplicateMap[trimmed]) {
          duplicateMap[trimmed] = []
        }
        duplicateMap[trimmed].push(index + 1)
      }
    })
    
    Object.entries(duplicateMap).forEach(([line, lineNumbers]) => {
      if (lineNumbers.length >= duplicateThreshold) {
        issues.push(this.createIssue(
          'warning',
          'maintainability',
          `Duplicate code pattern detected (${lineNumbers.length} occurrences)`,
          'Extract duplicate code into reusable functions or constants',
          relativeFilePath,
          lineNumbers[0],
          '// Extract to utility function:\nconst reusableFunction = () => {\n  // common logic\n}'
        ))
      }
    })
    
    // Check for magic numbers
    const magicNumberRegex = /\b(?<!\d)(?:100|500|1000|404|200|300|400)(?!\d)/g
    const magicNumbers = content.match(magicNumberRegex)
    
    if (magicNumbers && magicNumbers.length > 3) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        'Multiple magic numbers detected',
        'Extract magic numbers into named constants for better maintainability',
        relativeFilePath,
        undefined,
        '// Instead of:\nif (status === 200) { }\nsetTimeout(callback, 500)\n\n// Use constants:\nconst HTTP_OK = 200\nconst ANIMATION_DELAY = 500\nif (status === HTTP_OK) { }\nsetTimeout(callback, ANIMATION_DELAY)'
      ))
    }
    
    // Check for complex boolean expressions
    const complexBooleanRegex = /if\s*\([^)]+&&[^)]+\|\|[^)]+\)/g
    const complexBooleans = content.match(complexBooleanRegex)
    
    if (complexBooleans && complexBooleans.length > 0) {
      issues.push(this.createIssue(
        'suggestion',
        'maintainability',
        'Complex boolean expressions detected',
        'Extract complex boolean logic into named variables or functions',
        relativeFilePath,
        undefined,
        '// Instead of:\nif (user && user.isActive && (user.role === "admin" || user.hasPermission)) { }\n\n// Use descriptive variables:\nconst isValidActiveUser = user && user.isActive\nconst hasAdminAccess = user.role === "admin" || user.hasPermission\nif (isValidActiveUser && hasAdminAccess) { }'
      ))
    }
    
    // Check for long parameter lists
    const functionParams = content.match(/function\s+\w+\s*\(([^)]+)\)/g)
    
    if (functionParams) {
      functionParams.forEach(func => {
        const paramMatch = func.match(/\(([^)]+)\)/)
        if (paramMatch && paramMatch[1]) {
          const paramCount = paramMatch[1].split(',').length
          if (paramCount > 4) {
            const lineNumber = this.getLineNumber(content, func)
            issues.push(this.createIssue(
              'suggestion',
              'maintainability',
              `Function has ${paramCount} parameters`,
              'Consider using object parameters or splitting function for better maintainability',
              relativeFilePath,
              lineNumber,
              '// Instead of:\nfunction processData(name, age, email, phone, address, city) { }\n\n// Use object parameter:\nfunction processData({ name, age, email, phone, address, city }: UserData) { }'
            ))
          }
        }
      })
    }
    
    // Check for inconsistent return patterns
    if (content.includes('return ') && content.includes('return;')) {
      const explicitReturns = (content.match(/return\s+\w+/g) || []).length
      const emptyReturns = (content.match(/return\s*;/g) || []).length
      
      if (explicitReturns > 0 && emptyReturns > 0) {
        issues.push(this.createIssue(
          'suggestion',
          'maintainability',
          'Inconsistent return patterns (explicit and empty returns)',
          'Use consistent return patterns throughout the function',
          relativeFilePath
        ))
      }
    }
  }
  
  private getLineNumber(content: string, searchString: string): number {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.includes(searchString)) {
        return i + 1
      }
    }
    return 1
  }
}

/**
 * 6. Integration & Security Monitor
 */
class SecurityVerifier extends BaseVerifier {
  async verify(targets?: string[]): Promise<ModuleResult> {
    const issues: VerificationIssue[] = []
    
    // Check for exposed secrets and credentials
    await this.checkExposedSecrets(issues, targets)
    
    // Check third-party integration security
    await this.checkIntegrationSecurity(issues, targets)
    
    // Check API endpoint security
    await this.checkAPIEndpointSecurity(issues, targets)
    
    // Check CORS and security headers configuration
    await this.checkSecurityConfiguration(issues)
    
    // Check input validation patterns
    await this.checkInputValidation(issues, targets)
    
    // Check media and storage security
    await this.checkMediaSecurity(issues, targets)
    
    const critical = issues.filter(i => i.type === 'critical').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const score = Math.max(0, 100 - (critical * 40) - (warnings * 15) - (issues.length * 5))
    
    return {
      passed: critical === 0,
      score,
      issues
    }
  }
  
  private async checkExposedSecrets(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForExposedSecrets(issues, searchPath)
    }
  }
  
  private async scanForExposedSecrets(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForExposedSecrets(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
          await this.checkFileForSecrets(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForSecrets(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for hardcoded API keys and secrets
    const secretPatterns = [
      // API Keys
      /api[_-]?key[s]?[\s]*[=:][\s]*['"][a-zA-Z0-9_-]{20,}['"]/gi,
      /secret[_-]?key[s]?[\s]*[=:][\s]*['"][a-zA-Z0-9_-]{20,}['"]/gi,
      /access[_-]?token[s]?[\s]*[=:][\s]*['"][a-zA-Z0-9_-]{20,}['"]/gi,
      
      // Database URLs with credentials
      /mongodb:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/gi,
      /postgres:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/gi,
      
      // AWS/Cloud credentials
      /AKIA[0-9A-Z]{16}/g,
      /['"][0-9a-zA-Z\/+]{40}['"]/g, // AWS secret format
      
      // Common secret formats
      /['"][a-z0-9]{32,}['"]/gi, // Generic 32+ char secrets
      /sk_[a-zA-Z0-9]{20,}/g, // Stripe secret keys
      /pk_[a-zA-Z0-9]{20,}/g, // Stripe publishable keys
    ]
    
    secretPatterns.forEach(pattern => {
      const matches = [...content.matchAll(pattern)]
      matches.forEach(match => {
        const lineNumber = this.getLineNumber(content, match[0])
        issues.push(this.createIssue(
          'critical',
          'security',
          'Potential hardcoded secret or API key detected',
          'Move secrets to environment variables and never commit them to code',
          relativeFilePath,
          lineNumber,
          '// Instead of:\nconst apiKey = "sk_1234567890abcdef"\n\n// Use environment variables:\nconst apiKey = process.env.API_KEY\n// or:\nconst apiKey = process.env.NEXT_PUBLIC_API_KEY // for client-side'
        ))
      })
    })
    
    // Check for console.log with sensitive data patterns
    if (content.includes('console.log')) {
      const consoleLogMatches = content.match(/console\.log\([^)]*(?:password|secret|token|key|auth)[^)]*\)/gi)
      if (consoleLogMatches) {
        consoleLogMatches.forEach(match => {
          const lineNumber = this.getLineNumber(content, match)
          issues.push(this.createIssue(
            'warning',
            'security',
            'Console.log potentially logging sensitive information',
            'Remove console.log statements containing sensitive data before production',
            relativeFilePath,
            lineNumber,
            '// Remove or sanitize:\n// console.log("User password:", password) // BAD\nconsole.log("User logged in:", user.email) // GOOD'
          ))
        })
      }
    }
    
    // Check for eval usage (security risk)
    if (content.includes('eval(')) {
      const evalMatches = content.match(/eval\(/g)
      if (evalMatches) {
        evalMatches.forEach(match => {
          const lineNumber = this.getLineNumber(content, match)
          issues.push(this.createIssue(
            'critical',
            'security',
            'eval() usage detected - major security risk',
            'Remove eval() usage as it can execute arbitrary code and poses security risks',
            relativeFilePath,
            lineNumber,
            '// Instead of eval(), use:\n// - JSON.parse() for JSON strings\n// - Function constructor for dynamic functions\n// - Switch statements for conditional logic'
          ))
        })
      }
    }
    
    // Check for innerHTML usage without sanitization
    if (content.includes('.innerHTML')) {
      const innerHTMLMatches = content.match(/\.innerHTML\s*=/g)
      if (innerHTMLMatches) {
        innerHTMLMatches.forEach(match => {
          if (!content.includes('DOMPurify') && !content.includes('sanitize')) {
            const lineNumber = this.getLineNumber(content, match)
            issues.push(this.createIssue(
              'warning',
              'security',
              'innerHTML usage without sanitization detected',
              'Sanitize HTML content or use safer alternatives like textContent',
              relativeFilePath,
              lineNumber,
              '// Instead of:\nelement.innerHTML = userInput\n\n// Use:\nelement.textContent = userInput\n// or sanitize:\nelement.innerHTML = DOMPurify.sanitize(userInput)'
            ))
          }
        })
      }
    }
  }
  
  private async checkIntegrationSecurity(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForIntegrationSecurity(issues, searchPath)
    }
  }
  
  private async scanForIntegrationSecurity(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForIntegrationSecurity(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForIntegrationSecurity(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForIntegrationSecurity(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check Calendly integration security
    if (content.includes('calendly') || content.includes('Calendly')) {
      // Check for proper event validation
      if (content.includes('onEventScheduled') && !content.includes('validate')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'Calendly event handler missing validation',
          'Validate Calendly event data before processing',
          relativeFilePath,
          undefined,
          'const handleCalendlyEvent = (event: CalendlyEvent) => {\n  if (!isValidCalendlyEvent(event)) {\n    console.error("Invalid Calendly event:", event)\n    return\n  }\n  // Process event\n}'
        ))
      }
      
      // Check for proper HTTPS usage
      if (content.includes('http://') && content.includes('calendly')) {
        issues.push(this.createIssue(
          'critical',
          'security',
          'HTTP usage detected in Calendly integration',
          'Always use HTTPS for third-party service integrations',
          relativeFilePath
        ))
      }
    }
    
    // Check Constant Contact integration security
    if (content.includes('constantcontact') || content.includes('ConstantContact')) {
      // Check for proper OAuth implementation
      if (content.includes('access_token') && !content.includes('expires')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'OAuth token without expiration handling',
          'Implement proper token expiration and refresh logic',
          relativeFilePath,
          undefined,
          'interface TokenData {\n  access_token: string\n  expires_in: number\n  expires_at: number\n}\n\n// Check token expiration\nif (Date.now() > tokenData.expires_at) {\n  await refreshToken()\n}'
        ))
      }
      
      // Check for proper error handling
      if (content.includes('fetch') && content.includes('constantcontact') && !content.includes('catch')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'Constant Contact API calls missing error handling',
          'Add proper error handling for API failures',
          relativeFilePath
        ))
      }
    }
    
    // Check PostHog analytics security
    if (content.includes('posthog') || content.includes('PostHog')) {
      // Check for PII in tracking events
      const trackingEvents = content.match(/posthog\.capture\([^)]+\)/gi)
      if (trackingEvents) {
        trackingEvents.forEach(event => {
          if (event.includes('email') || event.includes('phone') || event.includes('address')) {
            const lineNumber = this.getLineNumber(content, event)
            issues.push(this.createIssue(
              'warning',
              'security',
              'Potential PII in analytics tracking',
              'Avoid sending personally identifiable information to analytics services',
              relativeFilePath,
              lineNumber,
              '// Instead of:\nposthog.capture("user_signup", { email: user.email })\n\n// Use:\nposthog.capture("user_signup", { user_id: user.id })'
            ))
          }
        })
      }
    }
    
    // Check Meta Pixel security
    if (content.includes('fbq') || content.includes('Meta Pixel')) {
      // Check for proper event data handling
      if (content.includes('fbq(') && content.includes('user') && !content.includes('hash')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Meta Pixel event data could be hashed for privacy',
          'Consider hashing user identifiers before sending to Meta Pixel',
          relativeFilePath,
          undefined,
          '// Hash sensitive data:\nconst hashedEmail = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email))\nfbq("track", "Lead", { hashed_email: hashedEmail })'
        ))
      }
    }
    
    // Check for unencrypted external API calls
    const apiCallPatterns = [
      /fetch\(['"]http:\/\/[^'"]+['"]/g,
      /axios\.get\(['"]http:\/\/[^'"]+['"]/g,
      /\$\{process\.env\.[^}]+\}\/api/g
    ]
    
    apiCallPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          if (match.includes('http://')) {
            const lineNumber = this.getLineNumber(content, match)
            issues.push(this.createIssue(
              'critical',
              'security',
              'Unencrypted HTTP API call detected',
              'Use HTTPS for all external API communications',
              relativeFilePath,
              lineNumber
            ))
          }
        })
      }
    })
  }
  
  private async checkAPIEndpointSecurity(issues: VerificationIssue[], targets?: string[]) {
    const apiDir = path.join(this.projectRoot, 'src/app/api')
    
    if (await this.fileExists(apiDir)) {
      await this.scanForAPIEndpointSecurity(issues, apiDir)
    }
  }
  
  private async scanForAPIEndpointSecurity(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory()) {
          await this.scanForAPIEndpointSecurity(issues, fullPath)
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
          await this.checkAPIEndpointFile(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkAPIEndpointFile(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for proper error handling
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    httpMethods.forEach(method => {
      if (content.includes(`export async function ${method}`)) {
        if (!content.includes('try') || !content.includes('catch')) {
          issues.push(this.createIssue(
            'warning',
            'security',
            `API endpoint ${method} missing error handling`,
            'Add try/catch blocks to handle errors securely',
            relativeFilePath,
            undefined,
            `export async function ${method}(request: Request) {\n  try {\n    // endpoint logic\n    return Response.json({ success: true })\n  } catch (error) {\n    console.error('API Error:', error)\n    return Response.json({ error: 'Internal server error' }, { status: 500 })\n  }\n}`
          ))
        }
      }
    })
    
    // Check for input validation
    if (content.includes('request.json()') && !content.includes('validate') && !content.includes('schema')) {
      issues.push(this.createIssue(
        'critical',
        'security',
        'API endpoint missing input validation',
        'Validate and sanitize all input data in API endpoints',
        relativeFilePath,
        undefined,
        'const validateInput = (data: any): data is ValidInputType => {\n  return typeof data === "object" && \n         typeof data.name === "string" &&\n         data.name.length > 0\n}\n\nconst body = await request.json()\nif (!validateInput(body)) {\n  return Response.json({ error: "Invalid input" }, { status: 400 })\n}'
      ))
    }
    
    // Check for rate limiting
    if (!content.includes('rateLimit') && !content.includes('throttle')) {
      issues.push(this.createIssue(
        'suggestion',
        'security',
        'API endpoint missing rate limiting',
        'Consider implementing rate limiting to prevent abuse',
        relativeFilePath,
        undefined,
        '// Add rate limiting middleware or logic\nimport rateLimit from "express-rate-limit"\n\n// or implement custom rate limiting\nconst rateLimiter = new Map()\nconst MAX_REQUESTS = 100\nconst WINDOW_MS = 60000'
      ))
    }
    
    // Check for authentication where needed
    if (content.includes('POST') || content.includes('PUT') || content.includes('DELETE')) {
      if (!content.includes('auth') && !content.includes('token') && !content.includes('session')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'Mutating API endpoint may need authentication',
          'Verify that authentication is properly implemented for data-modifying endpoints',
          relativeFilePath,
          undefined,
          'export async function POST(request: Request) {\n  const authHeader = request.headers.get("authorization")\n  if (!authHeader || !isValidAuth(authHeader)) {\n    return Response.json({ error: "Unauthorized" }, { status: 401 })\n  }\n  // endpoint logic\n}'
        ))
      }
    }
    
    // Check for CORS headers
    if (!content.includes('Access-Control-Allow-Origin')) {
      issues.push(this.createIssue(
        'suggestion',
        'security',
        'API endpoint missing explicit CORS configuration',
        'Consider explicit CORS headers for better security control',
        relativeFilePath,
        undefined,
        'const headers = {\n  "Access-Control-Allow-Origin": "https://yourdomain.com",\n  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",\n  "Access-Control-Allow-Headers": "Content-Type, Authorization"\n}'
      ))
    }
  }
  
  private async checkSecurityConfiguration(issues: VerificationIssue[]) {
    // Check Next.js configuration
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js')
    const nextConfig = await this.readFile(nextConfigPath)
    
    if (nextConfig) {
      // Check for security headers
      const securityHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Content-Security-Policy'
      ]
      
      securityHeaders.forEach(header => {
        if (!nextConfig.includes(header)) {
          issues.push(this.createIssue(
            'warning',
            'security',
            `Missing security header: ${header}`,
            'Add security headers to protect against common web vulnerabilities',
            'next.config.js',
            undefined,
            `async headers() {\n  return [\n    {\n      source: '/:path*',\n      headers: [\n        { key: '${header}', value: 'appropriate-value' }\n      ]\n    }\n  ]\n}`
          ))
        }
      })
      
      // Check for CSP configuration
      if (nextConfig.includes('Content-Security-Policy')) {
        if (nextConfig.includes("'unsafe-inline'") || nextConfig.includes("'unsafe-eval'")) {
          issues.push(this.createIssue(
            'warning',
            'security',
            'CSP contains unsafe directives',
            'Avoid unsafe-inline and unsafe-eval in Content Security Policy when possible',
            'next.config.js'
          ))
        }
      }
    } else {
      issues.push(this.createIssue(
        'suggestion',
        'security',
        'Missing next.config.js security configuration',
        'Create next.config.js with security headers for enhanced protection',
        'next.config.js'
      ))
    }
    
    // Check middleware configuration
    const middlewarePath = path.join(this.projectRoot, 'src/middleware.ts')
    if (await this.fileExists(middlewarePath)) {
      const middleware = await this.readFile(middlewarePath)
      
      if (middleware && !middleware.includes('security')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Middleware could include security enhancements',
          'Consider adding security-related middleware logic',
          'src/middleware.ts'
        ))
      }
    }
    
    // Check environment file security
    const envFiles = ['.env.local', '.env.example', '.env']
    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile)
      if (await this.fileExists(envPath)) {
        const envContent = await this.readFile(envPath)
        
        if (envContent) {
          // Check for actual secrets in .env.example
          if (envFile === '.env.example') {
            const suspiciousPatterns = [
              /[a-zA-Z0-9]{32,}/g,
              /sk_[a-zA-Z0-9]+/g,
              /pk_[a-zA-Z0-9]+/g
            ]
            
            suspiciousPatterns.forEach(pattern => {
              if (pattern.test(envContent)) {
                issues.push(this.createIssue(
                  'critical',
                  'security',
                  'Actual secrets detected in .env.example file',
                  'Replace actual secrets with placeholder values in .env.example',
                  envFile,
                  undefined,
                  '# Instead of:\nAPI_KEY=sk_1234567890abcdef\n\n# Use:\nAPI_KEY=your_api_key_here'
                ))
              }
            })
          }
        }
      }
    }
  }
  
  private async checkInputValidation(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForInputValidation(issues, searchPath)
    }
  }
  
  private async scanForInputValidation(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForInputValidation(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForInputValidation(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForInputValidation(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check form inputs for validation
    if (content.includes('<form') || content.includes('useForm') || content.includes('onSubmit')) {
      // Check for email validation
      if (content.includes('email') && !content.includes('validate') && !content.includes('pattern')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'Email input missing validation',
          'Add email format validation to prevent invalid data submission',
          relativeFilePath,
          undefined,
          '// Using react-hook-form:\nconst emailValidation = {\n  required: "Email is required",\n  pattern: {\n    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,\n    message: "Invalid email address"\n  }\n}'
        ))
      }
      
      // Check for phone number validation
      if (content.includes('phone') && !content.includes('validate') && !content.includes('pattern')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Phone input missing validation',
          'Add phone number format validation',
          relativeFilePath
        ))
      }
      
      // Check for SQL injection protection in form handlers
      if (content.includes('query') && content.includes('${') && !content.includes('parameterized')) {
        issues.push(this.createIssue(
          'critical',
          'security',
          'Potential SQL injection vulnerability',
          'Use parameterized queries instead of string interpolation',
          relativeFilePath,
          undefined,
          '// Instead of:\nconst query = `SELECT * FROM users WHERE email = "${userEmail}"`\n\n// Use parameterized queries:\nconst query = "SELECT * FROM users WHERE email = $1"\nconst result = await db.query(query, [userEmail])'
        ))
      }
    }
    
    // Check for XSS protection in dynamic content
    if (content.includes('dangerouslySetInnerHTML')) {
      if (!content.includes('DOMPurify') && !content.includes('sanitize')) {
        issues.push(this.createIssue(
          'critical',
          'security',
          'dangerouslySetInnerHTML without sanitization',
          'Sanitize HTML content to prevent XSS attacks',
          relativeFilePath,
          undefined,
          'import DOMPurify from "dompurify"\n\n// Sanitize before rendering:\nconst cleanHTML = DOMPurify.sanitize(userContent)\n<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />'
        ))
      }
    }
    
    // Check for file upload security
    if (content.includes('FileReader') || content.includes('file.type')) {
      if (!content.includes('allowedTypes') && !content.includes('whitelist')) {
        issues.push(this.createIssue(
          'warning',
          'security',
          'File upload missing type validation',
          'Validate file types and sizes to prevent malicious uploads',
          relativeFilePath,
          undefined,
          'const allowedTypes = ["image/jpeg", "image/png", "image/webp"]\nconst maxSize = 5 * 1024 * 1024 // 5MB\n\nif (!allowedTypes.includes(file.type)) {\n  throw new Error("Invalid file type")\n}\nif (file.size > maxSize) {\n  throw new Error("File too large")\n}'
        ))
      }
    }
    
    // Check for URL validation
    if (content.includes('href=') || content.includes('window.open')) {
      const urlPatterns = content.match(/href=["']([^"']*)["']/g)
      if (urlPatterns) {
        urlPatterns.forEach(pattern => {
          if (pattern.includes('javascript:') || pattern.includes('data:')) {
            const lineNumber = this.getLineNumber(content, pattern)
            issues.push(this.createIssue(
              'critical',
              'security',
              'Dangerous URL scheme detected in href',
              'Avoid javascript: and data: URL schemes to prevent XSS',
              relativeFilePath,
              lineNumber
            ))
          }
        })
      }
    }
  }
  
  private async checkMediaSecurity(issues: VerificationIssue[], targets?: string[]) {
    const searchPaths = targets || [path.join(this.projectRoot, 'src')]
    
    for (const searchPath of searchPaths) {
      await this.scanForMediaSecurity(issues, searchPath)
    }
  }
  
  private async scanForMediaSecurity(issues: VerificationIssue[], dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.scanForMediaSecurity(issues, fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await this.checkFileForMediaSecurity(issues, fullPath)
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  }
  
  private async checkFileForMediaSecurity(issues: VerificationIssue[], filePath: string) {
    const content = await this.readFile(filePath)
    if (!content) return
    
    const relativeFilePath = path.relative(this.projectRoot, filePath)
    
    // Check for direct R2 URL exposure
    if (content.includes('r2.dev') || content.includes('cloudflareStorage')) {
      if (!content.includes('signed') && !content.includes('presigned')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Direct R2 URL usage detected',
          'Consider using signed URLs for sensitive media or implement access controls',
          relativeFilePath,
          undefined,
          '// For sensitive content, use signed URLs:\nconst signedUrl = await generateSignedUrl(mediaUrl, { expiresIn: 3600 })\n// or implement access controls in your media handler'
        ))
      }
    }
    
    // Check for media without alt text (accessibility/security)
    const imgTags = content.match(/<(?:img|Image)[^>]*>/g)
    if (imgTags) {
      imgTags.forEach(tag => {
        if (!tag.includes('alt=')) {
          const lineNumber = this.getLineNumber(content, tag)
          issues.push(this.createIssue(
            'suggestion',
            'security',
            'Image missing alt attribute',
            'Add alt attributes for accessibility and to prevent potential content injection',
            relativeFilePath,
            lineNumber,
            '<Image src={imageSrc} alt="Descriptive alt text" />'
          ))
        }
      })
    }
    
    // Check for media upload paths
    if (content.includes('upload') && content.includes('/api/')) {
      if (!content.includes('multipart/form-data') && !content.includes('FormData')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Media upload implementation should use proper form data handling',
          'Ensure media uploads use proper multipart form data and validation',
          relativeFilePath
        ))
      }
    }
    
    // Check for CDN security headers
    if (content.includes('cloudflare') || content.includes('r2')) {
      if (!content.includes('cache-control') && !content.includes('Cache-Control')) {
        issues.push(this.createIssue(
          'suggestion',
          'security',
          'Media serving missing cache control headers',
          'Add appropriate cache-control headers for media assets',
          relativeFilePath,
          undefined,
          'const headers = {\n  "Cache-Control": "public, max-age=31536000, immutable",\n  "Content-Type": mediaType\n}'
        ))
      }
    }
  }
  
  private getLineNumber(content: string, searchString: string): number {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.includes(searchString)) {
        return i + 1
      }
    }
    return 1
  }
}

// Export the main verifier
export default KawaiCodeVerifier