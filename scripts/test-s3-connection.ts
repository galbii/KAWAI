import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

console.log('🧪 Testing S3/R2 Connection...\n')

// Verify environment variables
console.log('📋 Environment Variables:')
console.log('  S3_BUCKET:', process.env.S3_BUCKET || '❌ MISSING')
console.log('  S3_ENDPOINT:', process.env.S3_ENDPOINT || '❌ MISSING')
console.log('  S3_REGION:', process.env.S3_REGION || '❌ MISSING')
console.log('  S3_ACCESS_KEY_ID:', process.env.S3_ACCESS_KEY_ID ? '✅ Set (' + process.env.S3_ACCESS_KEY_ID.substring(0, 8) + '...)' : '❌ MISSING')
console.log('  S3_SECRET_ACCESS_KEY:', process.env.S3_SECRET_ACCESS_KEY ? '✅ Set' : '❌ MISSING')
console.log('  NEXT_PUBLIC_S3_PUBLIC_URL:', process.env.NEXT_PUBLIC_S3_PUBLIC_URL || '❌ MISSING')
console.log('')

if (!process.env.S3_BUCKET || !process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
  console.error('❌ Missing required S3 environment variables')
  process.exit(1)
}

// Create S3 client
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

async function testConnection() {
  try {
    // Test 1: List buckets (verify credentials work)
    console.log('🔍 Test 1: Listing buckets...')
    const listCommand = new ListBucketsCommand({})
    const listResponse = await s3Client.send(listCommand)
    console.log('✅ Successfully connected to R2')
    console.log('   Buckets found:', listResponse.Buckets?.length || 0)
    if (listResponse.Buckets) {
      listResponse.Buckets.forEach(bucket => {
        console.log('   -', bucket.Name)
      })
    }
    console.log('')

    // Test 2: Upload a test file
    console.log('🔍 Test 2: Uploading test file...')
    const testContent = 'Test file from Payload CMS - ' + new Date().toISOString()
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: 'media/test-connection.txt',
      Body: testContent,
      ContentType: 'text/plain',
    })
    await s3Client.send(putCommand)
    console.log('✅ Successfully uploaded test file to:', process.env.S3_BUCKET + '/media/test-connection.txt')

    const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL
    if (publicUrl) {
      const testFileUrl = `${publicUrl}/media/test-connection.txt`
      console.log('📡 Public URL:', testFileUrl)
      console.log('   Try accessing this URL to verify public access')
    }
    console.log('')

    console.log('✅ All tests passed! S3/R2 connection is working correctly.')
    console.log('')
    console.log('💡 If uploads still fail in Payload:')
    console.log('   1. Check server logs for S3 plugin initialization messages')
    console.log('   2. Verify the S3 plugin is properly loaded in payload.config.ts')
    console.log('   3. Ensure disableLocalStorage: true is set in Media collection')
    console.log('   4. Restart your dev server after config changes')

  } catch (error) {
    console.error('❌ Connection test failed:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Error name:', error.name)
    }
    process.exit(1)
  }
}

testConnection()
