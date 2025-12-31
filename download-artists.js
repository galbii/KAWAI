import fs from 'fs';
import path from 'path';
import https from 'https';

// Read and parse CSV
const csvContent = fs.readFileSync('./artists-data.csv', 'utf-8');
const lines = csvContent.split('\n').slice(1); // Skip header

const artists = [];

lines.forEach(line => {
  if (!line.trim()) return;

  // Simple CSV parsing (handles quoted fields)
  const match = line.match(/^([^,]*),([^,]*),([^,]*),([^,]*),/);
  if (match) {
    const [, artistName, slug, category, imageUrl] = match;
    if (imageUrl && imageUrl.startsWith('http')) {
      artists.push({
        name: artistName,
        slug: slug,
        url: imageUrl
      });
    }
  }
});

console.log(`Found ${artists.length} artists with images to download`);

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Download all images
async function downloadAll() {
  let successful = 0;
  let failed = 0;

  for (const artist of artists) {
    try {
      const ext = path.extname(new URL(artist.url).pathname) || '.jpg';
      const filename = `${artist.slug}${ext}`;
      const filepath = path.join('./artistimages', filename);

      console.log(`Downloading: ${artist.name} (${filename})...`);
      await downloadImage(artist.url, filepath);
      successful++;

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to download ${artist.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
}

downloadAll();
