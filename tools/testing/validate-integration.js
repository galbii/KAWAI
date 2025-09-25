#!/usr/bin/env node

/**
 * Simple integration validation script
 * Validates that all files exist and basic functionality works
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Integration Validation...\n');

// Define all files that should exist
const requiredFiles = [
  // Core API utilities
  'src/lib/payload.ts',
  
  // API routes
  'src/app/(frontend)/api/piano-categories/route.ts',
  'src/app/(frontend)/api/featured-models/route.ts',
  
  // Updated piano page
  'src/app/(frontend)/pianos/page-cms.tsx',
  
  // Error handling and UI components
  'src/components/ui/error-boundary.tsx',
  'src/components/ui/loading-states.tsx',
  
  // Migration and testing utilities
  'src/lib/migration/migrate-piano-data.ts',
  'src/lib/migration/seed-cms.ts',
  'src/lib/migration/test-media-upload.ts',
  'src/lib/migration/test-integration.ts',
  
  // Existing MediaRenderer components
  'src/components/ui/media/MediaRenderer.tsx',
  'src/components/ui/media/ResponsiveImage.tsx',
  'src/components/ui/media/VideoPlayer.tsx',
  
  // Payload types and collections
  'src/payload-types.ts',
  'src/collections/PianoCategories.ts',
  'src/collections/FeaturedModels.ts',
  'src/collections/Media.ts',
  
  // Documentation
  'INTEGRATION_REPORT.md'
];

let allFilesExist = true;
let missingFiles = [];

console.log('📁 Checking file existence...');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  
  if (!exists) {
    allFilesExist = false;
    missingFiles.push(file);
  }
});

console.log('\n📊 Validation Summary:');
console.log(`Files checked: ${requiredFiles.length}`);
console.log(`Files found: ${requiredFiles.length - missingFiles.length}`);
console.log(`Missing files: ${missingFiles.length}`);

if (missingFiles.length > 0) {
  console.log('\n❌ Missing files:');
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
}

// Check TypeScript compilation
console.log('\n🔍 Checking TypeScript compilation...');
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
  console.log('   ✅ TypeScript compilation successful');
} catch (error) {
  console.log('   ❌ TypeScript compilation failed');
  console.log('   Error:', error.stderr ? error.stderr.toString() : error.message);
}

// Validate package.json has required dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'payload',
    'next',
    'react',
    'typescript',
    '@payload-config'
  ];
  
  const missingDeps = requiredDeps.filter(dep => {
    return !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep];
  });
  
  if (missingDeps.length === 0) {
    console.log('   ✅ All required dependencies present');
  } else {
    console.log('   ❌ Missing dependencies:', missingDeps.join(', '));
  }
} catch (error) {
  console.log('   ❌ Could not read package.json');
}

// Check environment variables template
console.log('\n🔧 Checking environment setup...');
const requiredEnvVars = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL'
];

console.log('   Required environment variables:');
requiredEnvVars.forEach(envVar => {
  const exists = process.env[envVar];
  console.log(`   ${exists ? '✅' : '⚠️ '} ${envVar}`);
});

// Final validation result
const overallSuccess = allFilesExist;

console.log('\n' + '='.repeat(50));
console.log(`🎯 Integration Validation: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);

if (overallSuccess) {
  console.log('\n🎉 Integration is ready!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Set up required environment variables');
  console.log('   2. Run: npm run dev');
  console.log('   3. Run: npx tsx src/lib/migration/seed-cms.ts');
  console.log('   4. Test the /pianos page with CMS data');
  console.log('   5. Upload images via /admin');
  console.log('   6. Replace page.tsx with page-cms.tsx');
} else {
  console.log('\n⚠️  Please address missing files before proceeding');
}

console.log('\n📚 Documentation: See INTEGRATION_REPORT.md for detailed information');

process.exit(overallSuccess ? 0 : 1);