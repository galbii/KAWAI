#!/usr/bin/env bun

/**
 * Script to scrape full biographies from kawaius.com artist pages
 * and update the artists-data.csv file
 */

interface ArtistRow {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  bio: string;
}

// Simple CSV parser that handles quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Escape CSV field (add quotes if contains comma, quote, or newline)
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Extract bio text from HTML
function extractBio(html: string): string {
  try {
    // Find the portfolio-inner section
    const portfolioMatch = html.match(/<div class="portfolio-inner">([\s\S]*?)<\/div>\s*<\/div>/);
    if (!portfolioMatch) {
      return '';
    }

    const content = portfolioMatch[1];

    // Extract all <p> tag contents
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let match;

    while ((match = pRegex.exec(content)) !== null) {
      let text = match[1];

      // Skip if it contains "Instrument:" marker
      if (text.includes('<strong>Instrument:</strong>')) {
        continue;
      }

      // Strip HTML tags
      text = text.replace(/<[^>]+>/g, '');

      // Decode HTML entities
      text = text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#8216;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—');

      // Trim whitespace
      text = text.trim();

      if (text && text !== 'More »') {
        paragraphs.push(text);
      }
    }

    return paragraphs.join(' ');
  } catch (error) {
    console.error('Error extracting bio:', error);
    return '';
  }
}

// Fetch artist page and extract bio
async function fetchArtistBio(category: string, slug: string): Promise<string> {
  const url = `https://kawaius.com/artists/${category}/${slug}/`;

  try {
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return '';
    }

    const html = await response.text();
    const bio = extractBio(html);

    console.log(`✓ Extracted bio (${bio.length} chars)`);
    return bio;

  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return '';
  }
}

// Add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const csvPath = './artists-data.csv';
  const backupPath = './artists-data.backup.csv';

  // Create backup
  console.log('Creating backup...');
  await Bun.write(backupPath, Bun.file(csvPath));
  console.log(`✓ Backup created: ${backupPath}\n`);

  // Read CSV
  const csvContent = await Bun.file(csvPath).text();
  const lines = csvContent.split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1).filter(line => line.trim());

  // Parse artists
  const artists: ArtistRow[] = dataLines.map(line => {
    const fields = parseCSVLine(line);
    return {
      name: fields[0] || '',
      slug: fields[1] || '',
      category: fields[2] || '',
      imageUrl: fields[3] || '',
      bio: fields[4] || '',
    };
  });

  console.log(`Found ${artists.length} artists\n`);

  // Process each artist
  const updatedArtists: ArtistRow[] = [];

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];

    if (!artist.name || !artist.slug) {
      console.log(`Skipping empty row ${i + 2}`);
      updatedArtists.push(artist);
      continue;
    }

    console.log(`\n[${i + 1}/${artists.length}] ${artist.name}`);

    // Skip if bio already exists and is substantial
    if (artist.bio && artist.bio.length > 50) {
      console.log('  → Bio already exists, skipping');
      updatedArtists.push(artist);
      continue;
    }

    // Fetch bio
    const bio = await fetchArtistBio(artist.category, artist.slug);

    updatedArtists.push({
      ...artist,
      bio: bio || artist.bio, // Keep existing bio if fetch failed
    });

    // Rate limiting: wait 2 seconds between requests
    if (i < artists.length - 1) {
      await delay(2000);
    }
  }

  // Write updated CSV
  console.log('\n\nWriting updated CSV...');
  const csvLines = [header];

  for (const artist of updatedArtists) {
    const line = [
      escapeCSVField(artist.name),
      escapeCSVField(artist.slug),
      escapeCSVField(artist.category),
      escapeCSVField(artist.imageUrl),
      escapeCSVField(artist.bio),
    ].join(',');
    csvLines.push(line);
  }

  await Bun.write(csvPath, csvLines.join('\n') + '\n');

  console.log(`\n✓ Updated ${csvPath}`);
  console.log(`✓ Backup available at ${backupPath}`);

  // Stats
  const updatedCount = updatedArtists.filter(a => a.bio && a.bio.length > 50).length;
  console.log(`\n📊 Stats:`);
  console.log(`   Total artists: ${artists.length}`);
  console.log(`   With bios: ${updatedCount}`);
}

main().catch(console.error);
