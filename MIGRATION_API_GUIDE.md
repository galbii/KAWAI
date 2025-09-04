# CSV Migration API Guide

## Overview

The CSV Migration API (`/api/migrate-csv`) is a server-side Next.js API route that safely imports product data from your CSV file directly into Payload CMS using native Payload Local API functionality.

## Security Features

- **Dual Authentication**: Requires both API key and admin user session
- **Input Validation**: Comprehensive data validation and sanitization
- **Transaction Safety**: Uses Payload's built-in database safety features
- **Rate Limiting**: Built-in batch processing to prevent server overload
- **Dry Run Mode**: Preview changes without making database modifications

## Setup Instructions

### 1. Environment Configuration

The migration API key is already configured in your `.env.local`:
```bash
MIGRATION_API_KEY=kawai-migration-secure-2024-key-change-in-production
```

**⚠️ Security Note**: Change this key in production and keep it secure!

### 2. Admin Authentication Required

⚠️ **CRITICAL**: The API requires an active admin session for security.

Before using the API, you must:
1. Start your development server: `bun run dev`
2. Navigate to: `http://localhost:3001/admin` (note: port 3001, not 3000)
3. Log in with your admin credentials
4. Keep the admin session active while running migrations
5. Use the same browser session or copy cookies for API requests

**For command line usage**: You'll need to extract the session cookie from your browser and include it in requests, or use a tool like Postman that can share browser sessions.

### 3. CSV File Location

The API expects your CSV file at:
```
/Users/chancenoonan/dev/code/KAWAI/update_productDB.csv
```

This path is already configured and matches your existing file location.

## API Endpoints

### GET `/api/migrate-csv` - Migration Status

Check migration system status and current database counts.

**Request:**
```bash
curl -H "Authorization: Bearer kawai-migration-secure-2024-key-change-in-production" \
     http://localhost:3000/api/migrate-csv
```

**Response:**
```json
{
  "status": "ready",
  "csvFile": {
    "path": "/Users/chancenoonan/dev/code/KAWAI/update_productDB.csv",
    "exists": true,
    "rowCount": 150
  },
  "currentCounts": {
    "products": 12,
    "productlines": 8
  },
  "apiKey": {
    "configured": true,
    "envVar": "MIGRATION_API_KEY"
  },
  "availableOptions": { ... }
}
```

### POST `/api/migrate-csv` - Run Migration

Execute the CSV data migration with customizable options.

**Request:**
```bash
curl -X POST \
     -H "Authorization: Bearer kawai-migration-secure-2024-key-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{
       "dryRun": true,
       "batchSize": 10,
       "skipExisting": true,
       "createProductlines": true,
       "onlyParentProducts": true,
       "maxItems": 50
     }' \
     http://localhost:3000/api/migrate-csv
```

## Migration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dryRun` | boolean | false | Preview changes without creating records |
| `batchSize` | number | 10 | Items to process in each batch |
| `skipExisting` | boolean | false | Skip products that already exist (by slug) |
| `createProductlines` | boolean | false | Create productlines from CSV data |
| `onlyParentProducts` | boolean | false | Only process parent products (skip variations) |
| `maxItems` | number | undefined | Limit total items processed (for testing) |

## Usage Examples

### 1. Test Migration (Dry Run)

Preview what the migration would do without making changes:

```bash
curl -X POST \
     -H "Authorization: Bearer kawai-migration-secure-2024-key-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{"dryRun": true, "maxItems": 10}' \
     http://localhost:3000/api/migrate-csv
```

### 2. Create Productlines First

Create product line categories before importing products:

```bash
curl -X POST \
     -H "Authorization: Bearer kawai-migration-secure-2024-key-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{
       "createProductlines": true,
       "onlyParentProducts": true,
       "batchSize": 5
     }' \
     http://localhost:3000/api/migrate-csv
```

### 3. Full Production Migration

Import all data (run this after testing):

```bash
curl -X POST \
     -H "Authorization: Bearer kawai-migration-secure-2024-key-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{
       "createProductlines": true,
       "skipExisting": true,
       "batchSize": 20
     }' \
     http://localhost:3000/api/migrate-csv
```

## Data Transformation

The migration API transforms your CSV data as follows:

### CSV → Products Collection

- **Name** → `name`
- **Categories** → `category` (mapped to: grand, digital, upright, hybrid)
- **Description** → `description` (HTML cleaned)
- **Short description** → `shortDescription`
- **Regular price** → `price.msrp`
- **Sale price** → `price.salePrice`
- **Attributes 1-5** → `specifications` and `keyFeatures`
- **Images** → `mainImage` (URL reference)
- **Dimensions** → `specifications.dimensions`

### CSV → Productlines Collection

Automatically extracts productlines from Categories:
- "Grand Pianos > GL Series" → GL Series productline
- "Digital Pianos > CA Series" → CA Series productline

## Response Format

### Success Response

```json
{
  "success": true,
  "progress": {
    "total": 150,
    "processed": 150,
    "created": 142,
    "updated": 0,
    "errors": 8,
    "startTime": 1699123456789,
    "estimatedTimeRemaining": 0
  },
  "errors": [
    {
      "row": 45,
      "item": "Kawai GL-30 Grand Piano",
      "error": "Missing required field: productline"
    }
  ],
  "summary": {
    "totalProcessed": 150,
    "productsCreated": 142,
    "productlinesCreated": 12,
    "duration": 45000
  },
  "dryRun": false
}
```

### Error Response

```json
{
  "success": false,
  "error": "CSV file not found at /path/to/csv",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Progress Monitoring

The API provides real-time progress information:

- **Total items** to be processed
- **Current progress** count
- **Items created** vs updated
- **Error count** and details
- **Estimated time remaining**
- **Current item** being processed

## Error Handling

The API handles various error scenarios:

1. **Authentication Errors**: Invalid API key or missing admin session
2. **File Errors**: CSV file not found or corrupted
3. **Data Errors**: Invalid or missing required fields
4. **Database Errors**: Connection issues or constraint violations
5. **Processing Errors**: Individual item processing failures

Errors are logged with:
- Row number in CSV
- Item name
- Detailed error message

## Best Practices

### 1. Start with Dry Run
Always test with `dryRun: true` first to preview changes.

### 2. Create Productlines First
Run with `createProductlines: true` in a separate call before importing products.

### 3. Use Reasonable Batch Sizes
- Small datasets: `batchSize: 5-10`
- Large datasets: `batchSize: 20-50`
- Very large: `batchSize: 100+`

### 4. Monitor Progress
For large imports, the API provides progress updates. You can check the response for estimated completion time.

### 5. Handle Errors Gracefully
Review the `errors` array in the response to understand and fix any data issues.

## Database Schema Mapping

### Products Collection Fields

```typescript
{
  type: 'piano',                    // Fixed value
  name: string,                     // From CSV Name
  slug: string,                     // Auto-generated from name
  category: 'grand'|'digital'...,   // Mapped from Categories
  status: 'active'|'draft',         // From Published
  mainImage: string|null,           // From Images (first URL)
  description: string,              // From Description (HTML cleaned)
  shortDescription: string,         // From Short description
  productline: ObjectId,            // Link to created productline
  series: string,                   // Extracted from Categories
  model: string,                    // Extracted from Name
  price: {
    currency: 'USD',
    msrp: number,                   // From Regular price
    salePrice: number|null,         // From Sale price
    showPrice: boolean,
    contactForPricing: boolean
  },
  specifications: {
    keys: number,                   // From Attributes
    pedals: number,                 // From Attributes
    voices: number,                 // From Attributes
    polyphony: number,              // From Attributes
    dimensions: {
      width: string,                // From Length (cm)
      depth: string,                // From Width (cm)  
      height: string                // From Height (cm)
    },
    weight: string,                 // From Weight
    actionType: string,             // From Attributes
    soundEngine: string             // From Attributes
  },
  keyFeatures: [
    { feature: string }             // From non-spec Attributes
  ],
  visibility: {
    featured: boolean,              // From Is featured?
    showInCatalog: boolean,         // From Visibility in catalog
    sortOrder: number               // From Position
  }
}
```

### Productlines Collection Fields

```typescript
{
  name: string,                     // Extracted from Categories
  slug: string,                     // Auto-generated
  description: string,              // Auto-generated
  category: 'grand'|'digital'...,   // Mapped from Categories
  status: 'active',                 // Fixed
  featured: boolean,                // From Is featured?
  sortOrder: number                 // From Position
}
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Check API key in request header
   - Ensure admin session is active
   - Verify MIGRATION_API_KEY in .env.local

2. **"CSV file not found"**
   - Verify file exists at expected path
   - Check file permissions
   - Ensure file is not in use by another process

3. **"Missing required field" Errors**
   - Review CSV data for empty required fields
   - Check data transformation logic
   - Use dry run to identify problematic rows

4. **Database Connection Errors**
   - Verify DATABASE_URI in .env.local
   - Check MongoDB connection
   - Ensure Payload is properly initialized

### Debug Mode

For detailed logging, check your Next.js console output. The API provides extensive logging:

```
🚀 Starting CSV migration with options: {...}
✅ Payload initialized successfully
📖 Reading CSV file: /path/to/csv
📊 Processing 150 items
📂 Phase 1: Processing productlines...
✨ Created new productline: GL Series (507f1f77bcf86cd799439011)
🛒 Phase 2: Processing products...
🆕 Creating product: Kawai GL-40 Grand Piano
✅ Created product: Kawai GL-40 Grand Piano (507f191e810c19729de860ea)
```

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Admin Access**: Only authenticated admin users can trigger migrations
3. **Rate Limiting**: Built-in batch processing prevents server overload
4. **Input Validation**: All CSV data is validated before database operations
5. **Backup**: Always backup your database before running large migrations

## Next Steps

After successful migration:

1. **Verify Data**: Check `/admin/collections/products` and `/admin/collections/productlines`
2. **Test Frontend**: Ensure products display correctly on your website
3. **Image Processing**: Set up media uploads for product images
4. **SEO Optimization**: Review and optimize meta descriptions and titles
5. **Content Enhancement**: Add product page content blocks as needed

## Support

If you encounter issues:

1. Check the API response `errors` array for specific problems
2. Review the Next.js console for detailed logging
3. Use dry run mode to test changes safely
4. Start with small batches to isolate issues
5. Verify your CSV data format matches expected structure