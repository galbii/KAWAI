import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'

// Collections
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pianos } from './src/collections/Pianos'
import { PianoCategories } from './src/collections/PianoCategories'
import { PianoSeries } from './src/collections/PianoSeries'
import { Technologies } from './src/collections/Technologies'
import { Artists } from './src/collections/Artists'
import { Awards } from './src/collections/Awards'
import { Heritage } from './src/collections/Heritage'
import { Pages } from './src/collections/Pages'
import { Posts } from './src/collections/Posts'
import { Testimonials } from './src/collections/Testimonials'
import { Services } from './src/collections/Services'
import { Locations } from './src/collections/Locations'

// Globals
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import { Settings } from './src/globals/Settings'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd()),
    },
  },
  collections: [
    Users,
    Media,
    Pianos,
    PianoCategories,
    PianoSeries,
    Technologies,
    Artists,
    Awards,
    Heritage,
    Pages,
    Posts,
    Testimonials,
    Services,
    Locations,
  ],
  globals: [
    Header,
    Footer,
    Settings,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/kawai-piano',
  }),
  sharp,
  plugins: [],
})