# KAWAI Piano Database Migration Scripts

This directory contains scripts for migrating piano data from the WooCommerce CSV export to Payload CMS.

## Quick Start

### 1. Install Dependencies
```bash
node scripts/install-migration-deps.js
```

### 2. Run Migration (Dry Run First)
```bash
# Test the migration without writing data
DRY_RUN=true node scripts/migrate-csv-to-products.js

# Run the actual migration
node scripts/migrate-csv-to-products.js
```

## Files Overview

- **`migrate-csv-to-products.js`** - Main migration script
- **`install-migration-deps.js`** - Dependency installer
- **`../MIGRATION_ANALYSIS_REPORT.md`** - Comprehensive analysis report

## Migration Features

✅ **Safe Migration**
- Dry run mode for testing
- Batch processing to prevent overwhelming the database
- Comprehensive error handling and logging
- Duplicate prevention

✅ **Data Processing**  
- Automatic product line creation and linking
- Price extraction from HTML descriptions
- Feature parsing from description lists
- Finish options parsing from attributes
- Dimension extraction from attributes

✅ **Quality Assurance**
- Validates data before insertion
- Handles malformed CSV data gracefully
- Provides detailed progress reporting
- Creates proper slugs and relationships

## Configuration Options

### Environment Variables
- `DRY_RUN=true` - Test mode, no database writes
- `BATCH_SIZE=10` - Number of products to process per batch

### Script Configuration
Edit the constants at the top of `migrate-csv-to-products.js`:
- `CSV_FILE_PATH` - Path to the CSV file
- `BATCH_SIZE` - Batch processing size
- `DRY_RUN` - Enable/disable dry run mode

## Expected Results

The migration will create:
- **Product Lines**: ~15-20 automatic product lines based on piano series
- **Products**: ~500-800 piano products with full specifications
- **Categories**: Proper categorization (digital, grand, upright, hybrid)
- **Relationships**: Linked products to appropriate product lines

## Troubleshooting

### Common Issues
1. **CSV file not found** - Check the `CSV_FILE_PATH` constant
2. **Permission errors** - Ensure Node.js has read access to the CSV file
3. **Database connection issues** - Verify Payload CMS is properly configured
4. **Memory issues** - Reduce `BATCH_SIZE` if processing large datasets

### Logs and Monitoring
The script provides detailed logging including:
- Progress tracking with batch counts
- Success/error/skip statistics
- Individual product processing status
- Final migration summary

### Recovery
If the migration fails partway through:
1. Check the logs for the last successfully processed product
2. The script tracks processed models to avoid duplicates
3. Simply re-run the script - it will skip already processed items

## Performance

- **Processing Speed**: ~50-100 products per minute
- **Memory Usage**: Low (thanks to batch processing)
- **Database Load**: Moderate (configurable batch sizes)
- **Total Time**: 10-15 minutes for full dataset

## Support

For migration issues or questions:
1. Check the detailed analysis in `MIGRATION_ANALYSIS_REPORT.md`
2. Review the script logs for specific error messages
3. Test with `DRY_RUN=true` to validate data parsing
4. Adjust batch sizes if experiencing performance issues

## Safety Reminders

⚠️ **Always backup your database before running the migration**

⚠️ **Test in a development environment first**

⚠️ **Run with DRY_RUN=true initially to validate data parsing**