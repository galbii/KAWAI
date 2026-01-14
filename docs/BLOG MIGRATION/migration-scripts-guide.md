# Posts Schema Migration Scripts - User Guide

**Phase 2.2: Data Migration BEFORE Schema Changes**

This guide explains how to use the migration scripts to safely migrate the Posts collection from the old schema to the new schema.

---

## Overview

The migration process converts:
1. **Categories**: From select field → relationship to Categories collection
2. **Authors**: From single relationship → array of relationships

**IMPORTANT**: These scripts create NEW fields (`categoriesNew`, `authorsNew`) WITHOUT modifying the old fields. This ensures data safety and allows for rollback if needed.

---

## Prerequisites

Before running migrations:

1. ✅ **Categories Collection Seeded**
   - The Categories collection must exist and contain categories matching the old select field values
   - Check: `/admin/collections/categories`
   - Required categories: `education`, `product-news`, `artists`, `maintenance`, `buying-guides`, `events`, `company-news`, `technology`

2. ✅ **Database Backup Created**
   ```bash
   bun run backup:db
   ```

3. ✅ **Environment Variables Set**
   - `DATABASE_URI` - MongoDB connection string
   - `PAYLOAD_SECRET` - Payload CMS secret

---

## Migration Scripts

### 1. Categories Migration

**Purpose**: Converts `categories` (select field) to `categoriesNew` (relationship field)

**Preview Changes (Dry Run)**:
```bash
bun run migrate:categories:dry-run
```

**Execute Migration**:
```bash
bun run migrate:categories
```

**What it does**:
- Reads all posts from the database
- For each post, converts category slugs to Category document IDs
- Stores mapping in new `categoriesNew` field
- Skips posts that already have `categoriesNew` populated
- Handles posts with no categories gracefully
- Uses `skipRevalidation` context flag to prevent ISR revalidation during migration

**Example Output**:
```
🚀 Starting Posts Categories Migration
   Mode: 🔍 DRY RUN (preview only)

📊 Fetching categories from Categories collection...
   ✓ education → 507f1f77bcf86cd799439011
   ✓ product-news → 507f1f77bcf86cd799439012
   ...

📊 Found 42 posts to process

✅ MIGRATE: "Understanding Piano Maintenance"
   Old: [education, maintenance] (2 categories)
   New: 2 category IDs
   [DRY RUN] Would update database

⏭️  SKIP: Post "Latest News" already has categoriesNew field
⚠️  NO CATEGORIES: Post "Draft Post" has no categories

============================================================
📈 MIGRATION SUMMARY
============================================================
   Total Posts:           42
   ✅ Migrated:          35
   ⏭️  Skipped:           5
   ⚠️  No Categories:     2
   ❌ Errors:            0
============================================================
```

---

### 2. Authors Migration

**Purpose**: Converts `author` (single relationship) to `authorsNew` (array of relationships)

**Preview Changes (Dry Run)**:
```bash
bun run migrate:authors:dry-run
```

**Execute Migration**:
```bash
bun run migrate:authors
```

**What it does**:
- Reads all posts from the database
- For each post, converts single author to array with one item
- Stores in new `authorsNew` field
- Skips posts that already have `authorsNew` populated
- Handles posts with no author gracefully
- Uses `skipRevalidation` context flag to prevent ISR revalidation during migration

**Example Output**:
```
🚀 Starting Posts Authors Migration
   Mode: ✍️  LIVE (will modify database)

📊 Found 42 posts to process

✅ MIGRATE: "Understanding Piano Maintenance"
   Old: author = "507f1f77bcf86cd799439020" (single relationship)
   New: authorsNew = ["507f1f77bcf86cd799439020"] (array with 1 item)
   ✓ Database updated

⏭️  SKIP: Post "Latest News" already has authorsNew field
⚠️  NO AUTHOR: Post "Draft Post" has no author

============================================================
📈 MIGRATION SUMMARY
============================================================
   Total Posts:           42
   ✅ Migrated:          40
   ⏭️  Skipped:           2
   ⚠️  No Author:         0
   ❌ Errors:            0
============================================================
```

---

### 3. Run All Migrations

**Purpose**: Orchestrates both migrations in sequence with pre-flight checks and confirmations

**Preview All Changes (Dry Run)**:
```bash
bun run migrate:all:dry-run
```

**Execute All Migrations (Interactive)**:
```bash
bun run migrate:all
```

**Execute All Migrations (Skip Confirmation)**:
```bash
bun run migrate:all --yes
```

**Execute All Migrations (Skip Backup Warning)**:
```bash
bun run migrate:all --skip-backup --yes
```

**What it does**:
1. Runs pre-flight checks (validates Categories collection exists, counts posts)
2. Displays migration plan
3. Warns about database backup (unless `--skip-backup`)
4. Asks for confirmation (unless `--yes`)
5. Runs categories migration
6. Runs authors migration
7. Displays comprehensive summary

**Example Output**:
```
🚀 POSTS SCHEMA MIGRATION - Phase 2.2
   Data Migration BEFORE Schema Changes

🔍 Running pre-flight checks...

📊 Pre-flight Check Results:
   ✅ Categories collection: 8 categories
   ✅ Posts collection: 42 posts
   ⚠️  Backup recommended: YES

📋 MIGRATION PLAN
============================================================
   Mode:              ✍️  LIVE (will modify database)
   Backup:            Recommended (run manually)

   Steps:
   1. Migrate categories (select → relationship)
   2. Migrate authors (single → array)
============================================================

⚠️  IMPORTANT: Database Backup Recommended
   Before running this migration, you should backup your database.
   Run: bun run backup:db

Do you want to continue WITHOUT a backup? (yes/no): yes

⚠️  This will modify your database.
Are you sure you want to proceed? (yes/no): yes

============================================================
📦 STEP 1: Migrate Categories
============================================================

[... categories migration output ...]

✅ Categories migration completed in 2.45s

============================================================
📦 STEP 2: Migrate Authors
============================================================

[... authors migration output ...]

✅ Authors migration completed in 1.82s

============================================================
📊 FINAL SUMMARY
============================================================
   Categories Migration: ✅ SUCCESS
   Authors Migration:    ✅ SUCCESS
   Total Duration:       4.27s
============================================================

✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!

📝 Next Steps:
   1. Verify data in Payload admin panel
   2. Test a few posts to ensure categoriesNew and authorsNew are populated
   3. Once verified, proceed to Phase 2.3 (schema changes)
   4. Update Posts collection schema to use new fields
```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `bun run migrate:categories:dry-run` | Preview category migration |
| `bun run migrate:categories` | Execute category migration |
| `bun run migrate:authors:dry-run` | Preview author migration |
| `bun run migrate:authors` | Execute author migration |
| `bun run migrate:all:dry-run` | Preview all migrations |
| `bun run migrate:all` | Execute all migrations (interactive) |
| `bun run migrate:all --yes` | Execute all migrations (skip confirmation) |
| `bun run migrate:all --skip-backup --yes` | Execute all migrations (skip backup warning and confirmation) |

---

## Safety Features

### 1. Idempotent Design
All scripts are idempotent - safe to run multiple times:
- Skips posts that already have the new fields populated
- Won't duplicate data or corrupt existing migrations

### 2. Dry Run Mode
Always available via `--dry-run` flag:
- Shows exactly what would be changed
- No database modifications
- Safe to run in production

### 3. Context Flags
Scripts use context flags to prevent side effects:
- `skipRevalidation: true` - Prevents ISR revalidation during migration
- Prevents infinite hook loops
- Ensures migrations run cleanly

### 4. Comprehensive Logging
Every action is logged:
- Per-post migration status
- Detailed error messages
- Summary statistics
- Duration tracking

### 5. Error Handling
Graceful error handling:
- Errors don't stop the entire migration
- Each post is processed independently
- Failed posts are logged and counted
- Script exits with error code if any failures

---

## Verification

After running migrations:

### 1. Check Admin Panel
Visit `/admin/collections/posts` and verify:
- Posts have `categoriesNew` field populated
- Posts have `authorsNew` field populated
- Old fields (`categories`, `author`) are unchanged

### 2. Inspect Database
Use MongoDB Compass or mongo shell:
```javascript
// Check a sample post
db.posts.findOne({ slug: "your-post-slug" })

// Should see:
{
  // Old fields (unchanged)
  "author": "507f1f77bcf86cd799439020",
  "categories": ["education", "maintenance"],

  // New fields (populated by migration)
  "authorsNew": ["507f1f77bcf86cd799439020"],
  "categoriesNew": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

### 3. Verify Counts
```bash
# Count posts with categoriesNew
db.posts.countDocuments({ "categoriesNew.0": { $exists: true } })

# Count posts with authorsNew
db.posts.countDocuments({ "authorsNew.0": { $exists: true } })
```

---

## Troubleshooting

### Categories Collection Empty

**Error**:
```
❌ FATAL ERROR: Categories collection is empty!
```

**Solution**:
Seed the Categories collection first:
1. Go to `/admin/collections/categories`
2. Create categories matching old select field values:
   - education
   - product-news
   - artists
   - maintenance
   - buying-guides
   - events
   - company-news
   - technology

### Some Categories Not Found

**Warning**:
```
⚠️  WARNING: No category found for slug "old-category" in post "Post Title"
```

**Solution**:
1. Check if the old category slug exists in Categories collection
2. If missing, create the category
3. Re-run migration script (it's idempotent)

### Posts Already Migrated

**Message**:
```
⏭️  SKIP: Post "Title" already has categoriesNew field
```

**Meaning**:
- Post was already migrated (script is idempotent)
- No action needed
- This is normal if you re-run the script

### Database Connection Failed

**Error**:
```
❌ FATAL ERROR: MongoError: connection refused
```

**Solution**:
1. Check `DATABASE_URI` environment variable
2. Verify MongoDB is running
3. Check network connectivity
4. Verify credentials

---

## Rollback

If migration fails or you need to rollback:

### Option 1: Restore from Backup
```bash
# Restore MongoDB backup
mongorestore --uri="$DATABASE_URI" ./backup-YYYYMMDD --drop
```

### Option 2: Remove New Fields
```javascript
// Remove categoriesNew and authorsNew fields
db.posts.updateMany(
  {},
  {
    $unset: {
      categoriesNew: "",
      authorsNew: ""
    }
  }
)
```

### Option 3: Re-run Migration
If partial migration:
1. Fix the issue
2. Re-run migration script
3. Script will skip already-migrated posts

---

## Next Steps (Phase 2.3)

After successful migration:

1. ✅ **Verify Data**
   - Check admin panel
   - Inspect database records
   - Test a few posts

2. ✅ **Update Posts Collection Schema**
   - Add `categoriesNew` and `authorsNew` to schema
   - Update access control
   - Add populateAuthors hook

3. ✅ **Update Frontend**
   - Update blog post page to use new fields
   - Add fallback to old fields for safety

4. ✅ **Test Thoroughly**
   - Test blog listing page
   - Test individual blog posts
   - Test category filtering

5. ✅ **Cleanup (After Monitoring Period)**
   - Remove old `categories` and `author` fields from schema
   - Run cleanup migration to remove old fields from database
   - Update all references

---

## Support

If you encounter issues:

1. Check migration plan document: `/docs/posts-schema-migration.md`
2. Review CLAUDE.md for coding standards
3. Check Payload CMS documentation
4. Review error logs in console output
5. Verify database state with MongoDB tools

---

## Technical Notes

### Script Architecture

All scripts use:
- **TypeScript**: Full type safety
- **Payload Local API**: Direct database access with proper access control
- **Context Flags**: Prevent hook side effects
- **Progress Tracking**: Per-post status and statistics
- **Error Boundaries**: Individual post errors don't stop migration

### Performance Considerations

- Scripts fetch posts with `depth: 0` (no population)
- Batch size: 10,000 posts (adjust if needed)
- Each post is updated individually for safety
- Fire-and-forget revalidation is disabled during migration

### Security

- Uses Payload's Local API with proper authentication
- Access control is bypassed during migration (admin operation)
- No external API calls
- No user input (except confirmation prompts)

---

**Document Version**: 1.0
**Created**: 2026-01-14
**Author**: Migration Planning Agent
**Status**: Ready for Use
