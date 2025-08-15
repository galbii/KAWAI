import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'

// Test with just Users collection first
import { Users } from './src/collections/Users'

console.log('Attempting to build config...')

const config = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  debug: process.env.NODE_ENV === 'development',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src'),
    },
  },
  collections: [Users],
  globals: [],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/kawai-piano',
  }),
  sharp,
  plugins: [],
})

console.log('buildConfig successful')
console.log('Config keys after build:', Object.keys(config))
console.log('Payload config - buildConfig result:', !!config)
console.log('Payload config - config keys:', config ? Object.keys(config) : 'none')

export default config