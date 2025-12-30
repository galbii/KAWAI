#!/usr/bin/env node

import https from 'https';
import http from 'http';
import { parse } from 'node:url';
import fs from 'fs';

// Helper to fetch URL
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      ...parsedUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    client.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Extract text content from HTML
function extractText(html, selector) {
  // Simple text extraction between tags
  const match = html.match(new RegExp(`<${selector}[^>]*>([\\s\\S]*?)</${selector}>`, 'i'));
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
}

// Clean bio text for CSV
function cleanBioText(text) {
  return text
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/"/g, '""')
    .trim();
}

// Extract artist data from individual page
async function getArtistDetails(url) {
  try {
    const html = await fetchUrl(url);

    // Extract bio - look for main content
    let bio = '';

    // Try different content selectors
    const bioPatterns = [
      /<div class="entry-content"[^>]*>([\s\S]*?)<\/div>/i,
      /<div class="artist-bio"[^>]*>([\s\S]*?)<\/div>/i,
      /<div class="content"[^>]*>([\s\S]*?)<\/div>/i,
      /<article[^>]*>([\s\S]*?)<\/article>/i
    ];

    for (const pattern of bioPatterns) {
      const match = html.match(pattern);
      if (match) {
        bio = match[1]
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (bio.length > 50) break;
      }
    }

    // Check if featured
    const featured = html.toLowerCase().includes('featured artist') ? 'yes' : 'no';

    return { bio: cleanBioText(bio), featured };
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return { bio: 'N/A', featured: 'no' };
  }
}

// Main scraping function
async function scrapeArtists() {
  console.log('Fetching artists page...');
  const mainPageHtml = await fetchUrl('https://kawaius.com/artists/');

  // Extract all artist URLs
  const urlPattern = /https:\/\/kawaius\.com\/artists\/([^"'\s]+)/g;
  const urls = new Set();
  let match;

  while ((match = urlPattern.exec(mainPageHtml)) !== null) {
    const url = match[0].replace(/\/$/, '');
    if (url.includes('/acoustic-piano/') ||
        url.includes('/digital-piano/') ||
        url.includes('/piano/')) {
      urls.add(url + '/');
    }
  }

  console.log(`Found ${urls.size} unique artist URLs`);

  // Extract artist data
  const artists = [];
  const urlArray = Array.from(urls);

  for (let i = 0; i < urlArray.length; i++) {
    const url = urlArray[i];
    console.log(`Processing ${i + 1}/${urlArray.length}: ${url}`);

    // Parse URL to get slug and categories
    const urlParts = url.replace('https://kawaius.com/artists/', '').split('/');
    const categories = urlParts[0];
    const slug = urlParts[1] || '';

    if (!slug) continue;

    // Get artist details
    const { bio, featured } = await getArtistDetails(url);

    // Convert slug to name
    const name = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    artists.push({
      name,
      slug,
      categories,
      image_url: '', // Will need to extract from page
      artist_page_url: url,
      bio_text: bio,
      featured
    });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return artists;
}

// Generate CSV
function generateCSV(artists) {
  const headers = ['name', 'slug', 'categories', 'image_url', 'artist_page_url', 'bio_text', 'featured'];
  const rows = [headers.join(',')];

  for (const artist of artists) {
    const row = [
      `"${artist.name}"`,
      `"${artist.slug}"`,
      `"${artist.categories}"`,
      `"${artist.image_url}"`,
      `"${artist.artist_page_url}"`,
      `"${artist.bio_text}"`,
      `"${artist.featured}"`
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

// Main execution
(async () => {
  try {
    const artists = await scrapeArtists();
    const csv = generateCSV(artists);

    fs.writeFileSync('/Users/chancenoonan/dev/code/KAWAI/kawai-artists.csv', csv);

    console.log('\n=== SCRAPING COMPLETE ===');
    console.log(`Total artists processed: ${artists.length}`);
    console.log('CSV file saved to: /Users/chancenoonan/dev/code/KAWAI/kawai-artists.csv');
    console.log('\nFirst 5 rows:');
    artists.slice(0, 5).forEach(a => {
      console.log(`${a.name} (${a.slug}) - ${a.categories}`);
    });
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
