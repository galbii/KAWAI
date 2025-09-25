#!/usr/bin/env node

/**
 * KAWAI Code Verification CLI
 * 
 * Command-line interface for running the KAWAI Code Verification Agent.
 * Provides intelligent reporting with actionable recommendations.
 */

import path from 'path'
import { promises as fs } from 'fs'
import KawaiCodeVerifier, { VerificationReport, VerificationIssue } from './kawai-code-verifier'

interface CLIOptions {
  target?: string[]
  output?: string
  format?: 'console' | 'json' | 'html'
  severity?: 'all' | 'critical' | 'warnings'
  modules?: string[]
  fix?: boolean
  watch?: boolean
}

class KawaiVerifierCLI {
  private verifier: KawaiCodeVerifier
  private options: CLIOptions

  constructor(projectRoot: string, options: CLIOptions = {}) {
    this.verifier = new KawaiCodeVerifier(projectRoot)
    this.options = {
      format: 'console',
      severity: 'all',
      ...options
    }
  }

  async run(): Promise<void> {
    console.log('🎹 KAWAI Code Verification Agent')
    console.log('=' .repeat(50))
    console.log('Scanning codebase for architecture compliance, performance, and security issues...\n')

    try {
      const report = await this.verifier.verify(this.options.target)
      await this.outputReport(report)
      
      // Exit with appropriate code
      process.exit(report.summary.critical > 0 ? 1 : 0)
    } catch (error) {
      console.error('❌ Verification failed:', error)
      process.exit(1)
    }
  }

  private async outputReport(report: VerificationReport): Promise<void> {
    switch (this.options.format) {
      case 'json':
        await this.outputJSON(report)
        break
      case 'html':
        await this.outputHTML(report)
        break
      default:
        this.outputConsole(report)
    }
  }

  private outputConsole(report: VerificationReport): void {
    // Enhanced console reporting with colors and better formatting
    const { summary, issues, modules } = report
    
    // Overall score and summary
    console.log(`📊 Overall Score: ${this.getScoreColor(summary.score)}${summary.score}/100${this.resetColor()}`)
    console.log(`📈 Total Issues: ${summary.totalIssues}`)
    console.log(`  🚨 Critical: ${this.getCriticalColor()}${summary.critical}${this.resetColor()}`)
    console.log(`  ⚠️  Warnings: ${this.getWarningColor()}${summary.warnings}${this.resetColor()}`)
    console.log(`  💡 Suggestions: ${this.getSuggestionColor()}${summary.suggestions}${this.resetColor()}`)
    
    // Module scores
    console.log('\\n🎯 Module Performance:')
    Object.entries(modules).forEach(([name, result]) => {
      const emoji = result.passed ? '✅' : '❌'
      const score = this.getScoreColor(result.score) + result.score + this.resetColor()
      const displayName = this.formatModuleName(name)
      console.log(`  ${emoji} ${displayName}: ${score}/100 (${result.issues.length} issues)`)
    })

    // Filtered issues based on severity
    const filteredIssues = this.filterIssuesBySeverity(issues)
    
    if (filteredIssues.length === 0) {
      console.log('\\n🎉 No issues found matching your criteria!')
      return
    }

    // Critical issues first
    const criticalIssues = filteredIssues.filter(i => i.type === 'critical')
    if (criticalIssues.length > 0) {
      console.log(`\\n🚨 Critical Issues (${criticalIssues.length}):`)
      criticalIssues.forEach((issue, index) => {
        this.outputIssue(issue, index + 1)
      })
    }

    // Warnings
    const warningIssues = filteredIssues.filter(i => i.type === 'warning')
    if (warningIssues.length > 0 && this.options.severity !== 'critical') {
      console.log(`\\n⚠️  Warnings (${warningIssues.length}):`)
      warningIssues.slice(0, 10).forEach((issue, index) => { // Limit to 10 for readability
        this.outputIssue(issue, index + 1)
      })
      if (warningIssues.length > 10) {
        console.log(`    ... and ${warningIssues.length - 10} more warnings`)
      }
    }

    // Suggestions
    const suggestionIssues = filteredIssues.filter(i => i.type === 'suggestion')
    if (suggestionIssues.length > 0 && this.options.severity === 'all') {
      console.log(`\\n💡 Top Suggestions (showing 5 of ${suggestionIssues.length}):`)
      suggestionIssues.slice(0, 5).forEach((issue, index) => {
        this.outputIssue(issue, index + 1)
      })
    }

    // Intelligent recommendations
    console.log('\\n🎯 Intelligent Recommendations:')
    this.outputIntelligentRecommendations(report)

    // Next steps
    console.log('\\n📋 Next Steps:')
    if (summary.critical > 0) {
      console.log('  1. 🚨 Address critical issues immediately - these may cause runtime errors')
      console.log('  2. ⚠️  Review warnings to improve code quality and maintainability')
      console.log('  3. 💡 Consider suggestions for optimization and best practices')
    } else if (summary.warnings > 0) {
      console.log('  1. ⚠️  Address warnings to improve code quality')
      console.log('  2. 💡 Review suggestions for further optimization')
      console.log('  3. ✅ Run verification again to ensure improvements')
    } else {
      console.log('  1. ✅ Excellent! Your code meets KAWAI standards')
      console.log('  2. 🔄 Run verification regularly to maintain quality')
      console.log('  3. 📖 Share best practices with your team')
    }
  }

  private outputIssue(issue: VerificationIssue, index: number): void {
    const typeIcon = issue.type === 'critical' ? '🚨' : issue.type === 'warning' ? '⚠️' : '💡'
    const categoryBadge = this.formatCategoryBadge(issue.category)
    
    console.log(`\\n${typeIcon} ${index}. ${issue.message}`)
    console.log(`   ${categoryBadge} ${issue.file}${issue.line ? ':' + issue.line : ''}`)
    console.log(`   💡 ${issue.recommendation}`)
    
    if (issue.codeExample) {
      console.log(`   📝 Example:`)
      const exampleLines = issue.codeExample.split('\\n')
      exampleLines.forEach(line => {
        console.log(`      ${this.getDimColor()}${line}${this.resetColor()}`)
      })
    }
  }

  private outputIntelligentRecommendations(report: VerificationReport): void {
    const { summary, modules, issues } = report

    // Priority recommendations based on the most impactful fixes
    const recommendations: string[] = []

    // Architecture recommendations
    if (modules.architecture.score < 80) {
      const serverComponentIssues = issues.filter(i => 
        i.category === 'architecture' && i.message.includes('use client')
      ).length
      if (serverComponentIssues > 3) {
        recommendations.push('🏗️  Consider a Server Component audit - you have several unnecessary client components that could be optimized for better performance')
      }
    }

    // Performance recommendations  
    if (modules.performance.score < 75) {
      const mediaIssues = issues.filter(i => 
        i.category === 'performance' && i.message.toLowerCase().includes('image')
      ).length
      if (mediaIssues > 2) {
        recommendations.push('⚡ Image optimization appears to be a key issue - implementing MediaRenderer consistently could significantly improve performance')
      }
    }

    // Security recommendations
    if (modules.security.score < 90) {
      const securityCritical = issues.filter(i => 
        i.category === 'security' && i.type === 'critical'
      ).length
      if (securityCritical > 0) {
        recommendations.push('🔐 Security issues require immediate attention - these could expose sensitive data or create vulnerabilities')
      }
    }

    // Type safety recommendations
    if (modules.typeSafety.score < 85) {
      const anyUsage = issues.filter(i => 
        i.category === 'type-safety' && i.message.includes('any')
      ).length
      if (anyUsage > 5) {
        recommendations.push('🛡️  Heavy \'any\' usage detected - a systematic type safety improvement could prevent runtime errors')
      }
    }

    // Maintainability recommendations
    if (modules.maintainability.score < 80) {
      const namingIssues = issues.filter(i => 
        i.category === 'maintainability' && i.message.includes('naming')
      ).length
      if (namingIssues > 5) {
        recommendations.push('📝 File naming consistency needs attention - following KAWAI conventions will improve developer experience')
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 Your code follows KAWAI best practices well! Consider the suggestions above for further optimization.')
    }

    recommendations.forEach(rec => {
      console.log(`  ${rec}`)
    })

    // Quick wins section
    const quickWins = this.identifyQuickWins(issues)
    if (quickWins.length > 0) {
      console.log('\\n⚡ Quick Wins (easy fixes with high impact):')
      quickWins.forEach(win => {
        console.log(`  ${win}`)
      })
    }
  }

  private identifyQuickWins(issues: VerificationIssue[]): string[] {
    const quickWins: string[] = []
    
    // Missing alt attributes
    const altIssues = issues.filter(i => i.message.includes('alt attribute')).length
    if (altIssues > 0) {
      quickWins.push(`📷 Add ${altIssues} missing alt attributes for better accessibility and SEO`)
    }

    // Import organization
    const importIssues = issues.filter(i => i.message.includes('import order')).length
    if (importIssues > 0) {
      quickWins.push(`📦 Organize imports in ${importIssues} files - your IDE can probably auto-fix this`)
    }

    // Console.log cleanup
    const consoleIssues = issues.filter(i => i.message.includes('console.log')).length
    if (consoleIssues > 0) {
      quickWins.push(`🧹 Remove ${consoleIssues} console.log statements for cleaner production code`)
    }

    return quickWins
  }

  private async outputJSON(report: VerificationReport): Promise<void> {
    const json = JSON.stringify(report, null, 2)
    
    if (this.options.output) {
      await fs.writeFile(this.options.output, json)
      console.log(`📄 Report saved to ${this.options.output}`)
    } else {
      console.log(json)
    }
  }

  private async outputHTML(report: VerificationReport): Promise<void> {
    const html = this.generateHTMLReport(report)
    const outputPath = this.options.output || 'kawai-verification-report.html'
    
    await fs.writeFile(outputPath, html)
    console.log(`📄 HTML report saved to ${outputPath}`)
  }

  private generateHTMLReport(report: VerificationReport): string {
    const { summary, issues, modules } = report
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KAWAI Code Verification Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8f9fa; 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            margin-bottom: 30px; 
        }
        .score { font-size: 3rem; font-weight: bold; }
        .summary { display: flex; gap: 20px; margin-bottom: 30px; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            flex: 1; 
        }
        .critical { color: #dc3545; }
        .warning { color: #fd7e14; }
        .suggestion { color: #20c997; }
        .issue { 
            margin-bottom: 20px; 
            padding: 15px; 
            border-left: 4px solid #ddd; 
            background: white; 
        }
        .issue.critical { border-left-color: #dc3545; }
        .issue.warning { border-left-color: #fd7e14; }
        .issue.suggestion { border-left-color: #20c997; }
        pre { 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 4px; 
            overflow-x: auto; 
        }
        .modules { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎹 KAWAI Code Verification Report</h1>
        <div class="score">${summary.score}/100</div>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="card">
            <h3>📊 Summary</h3>
            <p><strong>Total Issues:</strong> ${summary.totalIssues}</p>
            <p class="critical"><strong>Critical:</strong> ${summary.critical}</p>
            <p class="warning"><strong>Warnings:</strong> ${summary.warnings}</p>
            <p class="suggestion"><strong>Suggestions:</strong> ${summary.suggestions}</p>
        </div>
    </div>

    <div class="modules">
        ${Object.entries(modules).map(([name, result]) => `
            <div class="card">
                <h4>${this.formatModuleName(name)}</h4>
                <div class="score" style="font-size: 1.5rem;">${result.score}/100</div>
                <p>${result.issues.length} issues</p>
                <p>${result.passed ? '✅ Passed' : '❌ Failed'}</p>
            </div>
        `).join('')}
    </div>

    <div class="issues">
        <h2>🚨 Issues</h2>
        ${issues.map(issue => `
            <div class="issue ${issue.type}">
                <h4>${issue.message}</h4>
                <p><strong>File:</strong> ${issue.file}${issue.line ? ':' + issue.line : ''}</p>
                <p><strong>Category:</strong> ${this.formatCategoryBadge(issue.category)}</p>
                <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
                ${issue.codeExample ? `<pre><code>${issue.codeExample}</code></pre>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`
  }

  private filterIssuesBySeverity(issues: VerificationIssue[]): VerificationIssue[] {
    switch (this.options.severity) {
      case 'critical':
        return issues.filter(i => i.type === 'critical')
      case 'warnings':
        return issues.filter(i => i.type === 'critical' || i.type === 'warning')
      default:
        return issues
    }
  }

  private formatModuleName(name: string): string {
    const names = {
      configuration: '⚙️  Configuration',
      architecture: '🏗️  Architecture', 
      performance: '⚡ Performance',
      typeSafety: '🛡️  Type Safety',
      maintainability: '📝 Maintainability',
      security: '🔐 Security'
    }
    return names[name as keyof typeof names] || name
  }

  private formatCategoryBadge(category: string): string {
    const badges = {
      configuration: '[CONFIG]',
      architecture: '[ARCH]',
      performance: '[PERF]',
      'type-safety': '[TYPE]',
      maintainability: '[MAINT]',
      security: '[SEC]'
    }
    return badges[category as keyof typeof badges] || `[${category.toUpperCase()}]`
  }

  // Console color helpers
  private getCriticalColor(): string { return '\\x1b[31m' } // Red
  private getWarningColor(): string { return '\\x1b[33m' } // Yellow  
  private getSuggestionColor(): string { return '\\x1b[36m' } // Cyan
  private getDimColor(): string { return '\\x1b[2m' } // Dim
  private resetColor(): string { return '\\x1b[0m' } // Reset
  
  private getScoreColor(score: number): string {
    if (score >= 90) return '\\x1b[32m' // Green
    if (score >= 75) return '\\x1b[33m' // Yellow
    return '\\x1b[31m' // Red
  }
}

// CLI Entry Point
export async function runCLI(): Promise<void> {
  const args = process.argv.slice(2)
  const projectRoot = process.cwd()
  
  // Parse basic CLI arguments
  const options: CLIOptions = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--json') {
      options.format = 'json'
    } else if (arg === '--html') {
      options.format = 'html'
    } else if (arg === '--critical') {
      options.severity = 'critical'
    } else if (arg === '--warnings') {
      options.severity = 'warnings'
    } else if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) {
        const nextArg = args[++i]
        if (nextArg !== undefined) {
          options.output = nextArg
        }
      }
    } else if (arg === '--target' || arg === '-t') {
      if (i + 1 < args.length) {
        const nextArg = args[++i]
        if (nextArg !== undefined) {
          options.target = [nextArg]
        }
      }
    }
  }
  
  const cli = new KawaiVerifierCLI(projectRoot, options)
  await cli.run()
}

// Run if called directly - ES Module compatible
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI().catch(error => {
    console.error('CLI Error:', error)
    process.exit(1)
  })
}

export default KawaiVerifierCLI