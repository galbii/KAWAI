import { MediaRenderer } from '@/components/ui/media/MediaRenderer'

// Test Media object based on the API response
const testMediaObject = {
  "createdAt": "2025-08-19T23:36:04.037Z",
  "updatedAt": "2025-08-19T23:36:04.037Z", 
  "alt": "Test image from R2",
  "mediaType": "image",
  "usage": [],
  "videoMeta": {"autoplay": false, "muted": true},
  "variants": {},
  "seoMeta": {},
  "featured": false,
  "prefix": "media",
  "filename": "2ad63313-d80e-45c4-887e-e4684489b99c.jpg",
  "mimeType": "image/jpeg",
  "filesize": 40887,
  "width": 800,
  "height": 450,
  "focalX": 50,
  "focalY": 50,
  "sizes": {
    "thumbnail": {
      "width": 400,
      "height": 300,
      "mimeType": "image/jpeg",
      "filesize": 20479,
      "filename": "2ad63313-d80e-45c4-887e-e4684489b99c-400x300.jpg",
      "url": "https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev/media/2ad63313-d80e-45c4-887e-e4684489b99c-400x300.jpg"
    }
  },
  "id": "68a50a64e35a8a74efcada60",
  "url": "https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev/media/2ad63313-d80e-45c4-887e-e4684489b99c.jpg",
  "thumbnailURL": "/api/media/file/2ad63313-d80e-45c4-887e-e4684489b99c-400x300.jpg"
}

export default function TestMediaPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Media Rendering Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Media Object Test (should use Next.js Image)</h2>
          <div className="border border-gray-300 p-4 rounded">
            <MediaRenderer
              media={testMediaObject}
              preset="hero"
              priority={true}
              className="w-full max-w-lg h-64"
              aria-label="Test Media Object"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            URL: {testMediaObject.url}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">String URL Test (should use R2 utils)</h2>
          <div className="border border-gray-300 p-4 rounded">
            <MediaRenderer
              media="https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev/media/2ad63313-d80e-45c4-887e-e4684489b99c.jpg"
              preset="gallery"
              className="w-full max-w-lg h-64"
              aria-label="Test String URL"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Undefined Media Test (should show placeholder)</h2>
          <div className="border border-gray-300 p-4 rounded">
            <MediaRenderer
              media={undefined as any}
              preset="card"
              className="w-full max-w-lg h-64"
              aria-label="Test Undefined Media"
            />
          </div>
        </div>
      </div>
    </div>
  )
}