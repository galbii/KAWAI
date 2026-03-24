import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MediaManagerUploadFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/mediaManagerUpload/client#MediaManagerUploadClientFeature',
  },
  key: 'mediaManagerUpload',
})
