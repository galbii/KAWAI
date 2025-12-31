import fs from 'fs';

const csvPath = './artists-data.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Replace the old kawaius.com URLs with new Cloudflare R2 URLs
const updatedContent = csvContent.replace(
  /https:\/\/kawaius\.com\/wp-content\/uploads\/[^,]+(\.jpg|\.png|\.jpeg)/g,
  (match) => {
    // Extract the filename from the old URL
    const filename = match.split('/').pop();
    // Get the slug from the filename (remove extension and get base name)
    const slug = filename.replace(/\.(jpg|png|jpeg)$/i, '').toLowerCase();

    // Determine the extension from the match
    let extension = '.jpg';
    if (filename.match(/\.png$/i)) extension = '.png';
    if (filename.match(/\.jpeg$/i)) extension = '.jpeg';

    // Create new Cloudflare R2 URL
    return `https://pub-8da77878131e4c099bb045b914814926.r2.dev/kawaius/artists/${slug}${extension}`;
  }
);

// Write the updated content back to the CSV
fs.writeFileSync(csvPath, updatedContent, 'utf-8');

console.log('✅ CSV file updated successfully!');
console.log('All image URLs have been replaced with Cloudflare R2 URLs');
