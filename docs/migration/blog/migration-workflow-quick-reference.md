# Posts Schema Migration - Quick Reference

**Phase 2.2: Data Migration Scripts**

---

## TL;DR - Quick Start

```bash
# 1. Preview what will change
bun run migrate:all:dry-run

# 2. Create database backup
bun run backup:db

# 3. Run migration (interactive)
bun run migrate:all

# 4. Verify in admin panel
# Visit: /admin/collections/posts
```

---

## Complete Workflow

### Step 1: Pre-Flight Check

```bash
# Verify Categories collection exists
# Go to: /admin/collections/categories
# Should have 8 categories: education, product-news, artists, maintenance, buying-guides, events, company-news, technology
```

### Step 2: Preview Changes (Dry Run)

```bash
# Preview all migrations
bun run migrate:all:dry-run

# Or preview individually
bun run migrate:categories:dry-run
bun run migrate:authors:dry-run
```

### Step 3: Backup Database

```bash
bun run backup:db

# Or manually with mongodump
mongodump --uri="$DATABASE_URI" --out=./backup-$(date +%Y%m%d-%H%M%S)
```

### Step 4: Run Migration

```bash
# Interactive mode (recommended)
bun run migrate:all

# Non-interactive (CI/CD)
bun run migrate:all --yes --skip-backup

# Individual migrations
bun run migrate:categories
bun run migrate:authors
```

### Step 5: Verify Data

```bash
# 1. Check admin panel
# Visit: /admin/collections/posts
# Verify posts have categoriesNew and authorsNew fields

# 2. Check database (MongoDB Compass or mongo shell)
db.posts.findOne({ slug: "sample-post" })

# 3. Verify counts
db.posts.countDocuments({ "categoriesNew.0": { $exists: true } })
db.posts.countDocuments({ "authorsNew.0": { $exists: true } })
```

### Step 6: Next Phase (2.3)

After successful migration, proceed to schema changes:
1. Update Posts collection schema to add new fields
2. Add populateAuthors hook
3. Update frontend to use new fields
4. Test thoroughly

---

## Command Reference

| Command | Use Case |
|---------|----------|
| `bun run migrate:all:dry-run` | Preview all changes (safe, no DB changes) |
| `bun run migrate:all` | Run all migrations (interactive) |
| `bun run migrate:all --yes` | Run all migrations (skip confirmation) |
| `bun run migrate:categories:dry-run` | Preview category migration only |
| `bun run migrate:categories` | Run category migration only |
| `bun run migrate:authors:dry-run` | Preview author migration only |
| `bun run migrate:authors` | Run author migration only |
| `bun run backup:db` | Create database backup |

---

## Expected Results

### Before Migration

```javascript
{
  "title": "Understanding Piano Maintenance",
  "author": "507f1f77bcf86cd799439020", // Single ID
  "categories": ["education", "maintenance"], // Select values
  // ... other fields
}
```

### After Migration

```javascript
{
  "title": "Understanding Piano Maintenance",
  "author": "507f1f77bcf86cd799439020", // Unchanged
  "categories": ["education", "maintenance"], // Unchanged
  "authorsNew": ["507f1f77bcf86cd799439020"], // NEW: Array
  "categoriesNew": ["507f...", "507f..."], // NEW: Category IDs
  // ... other fields
}
```

---

## Safety Checklist

- [ ] Categories collection seeded with 8 categories
- [ ] Database backup created
- [ ] Ran dry-run mode first
- [ ] Reviewed dry-run output
- [ ] No errors in dry-run
- [ ] Ready to execute migration

---

## Troubleshooting Quick Fixes

### "Categories collection is empty"
```bash
# Create categories in admin panel: /admin/collections/categories
# Required slugs: education, product-news, artists, maintenance, buying-guides, events, company-news, technology
```

### "Some categories not found"
```bash
# Check which categories are missing
# Create missing categories
# Re-run migration (it's idempotent)
```

### "Database connection failed"
```bash
# Check DATABASE_URI environment variable
# Verify MongoDB is running
# Test connection: mongosh "$DATABASE_URI"
```

### Migration partially completed
```bash
# Fix the issue
# Re-run migration script
# Script skips already-migrated posts
```

---

## Rollback

### Quick Rollback
```bash
# Restore from backup
mongorestore --uri="$DATABASE_URI" ./backup-YYYYMMDD --drop
```

### Manual Rollback
```javascript
// Remove new fields
db.posts.updateMany({}, { $unset: { categoriesNew: "", authorsNew: "" } })
```

---

## File Locations

- Migration scripts: `/scripts/migrate-*.ts`
- Detailed guide: `/docs/migration-scripts-guide.md`
- Migration plan: `/docs/posts-schema-migration.md`
- Package.json commands: Line 19-24

---

## Important Notes

1. **Idempotent**: Scripts are safe to run multiple times
2. **Context Flags**: Scripts use `skipRevalidation` to prevent ISR during migration
3. **Old Fields Preserved**: Old fields are NOT modified or deleted
4. **New Fields Created**: New fields (`categoriesNew`, `authorsNew`) are created
5. **Schema Changes Come Later**: Phase 2.3 will update the schema to use new fields

---

## Migration Timeline

| Phase | Task | Status | Duration |
|-------|------|--------|----------|
| 2.1 | Planning (migration plan document) | ✅ Complete | - |
| 2.2 | Data Migration (this phase) | ⚠️  In Progress | ~5-10 min |
| 2.3 | Schema Changes | ⏳ Pending | TBD |
| 2.4 | Frontend Updates | ⏳ Pending | TBD |
| 2.5 | Cleanup | ⏳ Pending | TBD |

---

**Quick Reference Version**: 1.0
**Last Updated**: 2026-01-14
