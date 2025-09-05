import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs/promises'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Types for CSV data structure
interface CSVRow {
  ID: string
  Type: string
  Name: string
  Published: string
  'Is featured?': string
  'Short description': string
  Description: string
  'Regular price': string
  'Sale price': string
  Categories: string
  Tags: string
  Images: string
  'Attribute 1 name': string
  'Attribute 1 value(s)': string
  'Attribute 2 name': string
  'Attribute 2 value(s)': string
  'Attribute 3 name': string
  'Attribute 3 value(s)': string
  'Attribute 4 name': string
  'Attribute 4 value(s)': string
  'Attribute 5 name': string
  'Attribute 5 value(s)': string
  'Length (cm)'?: string
  'Width (cm)'?: string
  'Height (cm)'?: string
  Weight?: string
  Parent?: string
  [key: string]: any
}

interface MigrationResult {
  success: boolean
  message: string
  stats: {
    totalProcessed: number
    productlinesCreated: number
    productsCreated: number
    errors: number
    duration: string
  }
  errors: string[]
  products: Array<{ name: string; id: string; category: string }>
  productlines: Array<{ name: string; id: string; category: string }>
}

// CSV file path
const CSV_FILE_PATH = path.join(process.cwd(), 'update_productDB.csv')

/**
 * Parse CSV file with better error handling
 */
async function parseCSVFile(): Promise<CSVRow[]> {
  try {
    console.log(`📖 Reading CSV file: ${CSV_FILE_PATH}`)
    const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf-8')
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      relax_column_count: true,
      relax_quotes: true
    }) as CSVRow[]
    
    console.log(`✅ Successfully parsed ${records.length} rows from CSV`)
    return records
  } catch (error) {
    console.error('❌ Error reading/parsing CSV file:', error)
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract product line name from categories or product name
 */
function extractProductLine(categories: string, name: string): string | null {
  // Check categories first
  if (categories.includes('GL Series')) return 'GL Series'
  if (categories.includes('GX Series')) return 'GX Series'
  if (categories.includes('SK Series')) return 'SK Series'
  if (categories.includes('CA Series')) return 'CA Series'
  if (categories.includes('CN Series')) return 'CN Series'
  if (categories.includes('ES Series')) return 'ES Series'
  if (categories.includes('MP Series')) return 'MP Series'
  if (categories.includes('KDP Series')) return 'KDP Series'
  
  // Extract from product name
  const seriesMatch = name.match(/(GL|GX|SK|CA|CN|ES|MP|KDP)-?\d+/i)
  if (seriesMatch) {
    return `${seriesMatch[1].toUpperCase()} Series`
  }
  
  return null
}

/**
 * Map categories to our schema values
 */
function mapCategory(categories: string): 'hybrid' | 'digital' | 'grand' | 'upright' {
  if (categories.includes('Grand Pianos')) return 'grand'
  if (categories.includes('Digital Pianos')) return 'digital'
  if (categories.includes('Upright Pianos')) return 'upright'
  if (categories.includes('Hybrid Pianos')) return 'hybrid'
  return 'digital' // default
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product'
}

/**
 * Clean HTML and formatting from description
 */
function cleanDescription(desc: string): string {
  if (!desc) return ''
  
  return desc
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[caption[^\]]*\].*?\[\/caption\]/g, '') // Remove caption shortcodes
    .replace(/\n\s*\.\s*\n/g, '\n\n') // Clean up formatting
    .trim()
}

/**
 * Extract specifications from CSV attributes
 */
function extractSpecifications(row: CSVRow): any {
  const specs: any = {}
  
  // Physical dimensions
  if (row['Length (cm)']) {
    specs.dimensions = { ...specs.dimensions, width: `${row['Length (cm)']}cm` }
  }
  if (row['Width (cm)']) {
    specs.dimensions = { ...specs.dimensions, depth: `${row['Width (cm)']}cm` }
  }
  if (row['Height (cm)']) {
    specs.dimensions = { ...specs.dimensions, height: `${row['Height (cm)']}cm` }
  }
  if (row.Weight) {
    specs.weight = row.Weight
  }
  
  // Extract from attributes 1-5
  for (let i = 1; i <= 5; i++) {
    const attrName = row[`Attribute ${i} name`]
    const attrValue = row[`Attribute ${i} value(s)`]
    
    if (attrName && attrValue) {
      switch (attrName.toLowerCase()) {
        case 'keys':
          specs.keys = parseInt(attrValue) || null
          break
        case 'pedals':
          specs.pedals = parseInt(attrValue) || null
          break
        case 'voices':
          specs.voices = parseInt(attrValue) || null
          break
        case 'polyphony':
          specs.polyphony = parseInt(attrValue) || null
          break
        case 'action type':
          specs.actionType = attrValue
          break
        case 'sound engine':
          specs.soundEngine = attrValue
          break
      }
    }
  }
  
  return specs
}

/**
 * Extract key features from attributes
 */
function extractKeyFeatures(row: CSVRow): Array<{ feature: string }> {
  const features: Array<{ feature: string }> = []
  const specAttributes = ['keys', 'pedals', 'voices', 'polyphony', 'action type', 'sound engine']
  
  for (let i = 1; i <= 5; i++) {
    const attrName = row[`Attribute ${i} name`]
    const attrValue = row[`Attribute ${i} value(s)`]
    
    if (attrName && attrValue && !specAttributes.includes(attrName.toLowerCase())) {
      // Split multiple values and add as separate features
      const values = attrValue.split(',').map((v: string) => v.trim()).filter((v: string) => v)
      values.forEach((value: string) => {
        features.push({ feature: `${attrName}: ${value}` })
      })
    }
  }
  
  return features
}

/**
 * Main migration function
 */
async function runSimpleMigration(): Promise<MigrationResult> {
  const startTime = Date.now()
  const errors: string[] = []
  const createdProducts: Array<{ name: string; id: string; category: string }> = []
  const createdProductlines: Array<{ name: string; id: string; category: string }> = []
  
  try {
    console.log('🚀 Starting simple product migration...')
    
    // Initialize Payload without authentication checks
    const payload = await getPayload({ config })
    console.log('✅ Payload initialized successfully')
    
    // Parse CSV file
    const csvRows = await parseCSVFile()
    
    // Filter to only parent products (not variations)
    const parentProducts = csvRows.filter(row => 
      row.Type === 'variable' || row.Type === 'simple'
    )
    
    console.log(`📊 Processing ${parentProducts.length} parent products (from ${csvRows.length} total rows)`)
    
    // Track unique product lines
    const productlineNames = new Set<string>()
    const productlineMap = new Map<string, string>() // name -> id
    
    // Collect all product lines first
    parentProducts.forEach(row => {
      const productLineName = extractProductLine(row.Categories, row.Name)
      if (productLineName) {
        productlineNames.add(productLineName)
      }
    })
    
    // Create product lines
    console.log(`📂 Creating ${productlineNames.size} product lines...`)
    for (const productLineName of productlineNames) {
      try {
        // Check if product line already exists
        const existing = await payload.find({
          collection: 'productlines',
          where: { name: { equals: productLineName } },
          limit: 1
        })
        
        if (existing.docs.length > 0) {
          productlineMap.set(productLineName, existing.docs[0].id)
          console.log(`📋 Found existing productline: ${productLineName}`)
        } else {
          // Create new product line
          const category = mapCategory(productLineName)
          const productlineData = {
            name: productLineName,
            slug: generateSlug(productLineName),
            description: `${productLineName} pianos from Kawai featuring advanced technology and exceptional sound quality.`,
            category,
            featured: false,
            sortOrder: 0
          }
          
          const newProductline = await payload.create({
            collection: 'productlines',
            data: productlineData,
            overrideAccess: true // Bypass validation during migration
          })
          
          productlineMap.set(productLineName, newProductline.id)
          createdProductlines.push({
            name: productLineName,
            id: newProductline.id,
            category
          })
          console.log(`✨ Created productline: ${productLineName}`)
        }
      } catch (error) {
        const errorMsg = `Error creating productline ${productLineName}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    // Create or find placeholder image for products
    let placeholderImageId = null
    try {
      // Check if placeholder image already exists
      const existingPlaceholder = await payload.find({
        collection: 'media',
        where: { 
          alt: { equals: 'Product Migration Placeholder' }
        },
        limit: 1
      })
      
      if (existingPlaceholder.docs.length > 0) {
        placeholderImageId = existingPlaceholder.docs[0].id
        console.log(`📋 Using existing placeholder image: ${placeholderImageId}`)
      } else {
        // Create a simple placeholder media record
        const placeholderMedia = await payload.create({
          collection: 'media',
          data: {
            alt: 'Product Migration Placeholder',
            mediaType: 'image',
            description: 'Placeholder image for products during CSV migration. Replace with actual product images.'
          }
        })
        placeholderImageId = placeholderMedia.id
        console.log(`✅ Created placeholder image: ${placeholderImageId}`)
      }
    } catch (error) {
      console.warn(`⚠️ Could not create placeholder image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Create products
    console.log(`🛒 Creating products...`)
    for (const row of parentProducts) {
      try {
        // Skip if product already exists
        const slug = generateSlug(row.Name)
        const existing = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          limit: 1
        })
        
        if (existing.docs.length > 0) {
          console.log(`📋 Product already exists, skipping: ${row.Name}`)
          continue
        }
        
        // Get product line ID
        const productLineName = extractProductLine(row.Categories, row.Name)
        const productlineId = productLineName ? productlineMap.get(productLineName) : undefined
        
        // Parse pricing
        const regularPrice = parseFloat(row['Regular price']) || 0
        const salePrice = parseFloat(row['Sale price']) || 0
        
        // Extract model from name
        const modelMatch = row.Name.match(/([A-Z]{2,3}-?\d+[A-Z]*)/i)
        const model = modelMatch ? modelMatch[1] : ''
        
        // Build product data (without mainImage for now due to validation issues)
        const productData = {
          type: 'piano' as const,
          name: row.Name,
          slug,
          category: mapCategory(row.Categories),
          status: row.Published === '1' ? 'active' as const : 'draft' as const,
          description: cleanDescription(row.Description),
          shortDescription: cleanDescription(row['Short description']),
          productline: productlineId,
          series: productLineName,
          model,
          
          // Pricing
          price: {
            currency: 'USD' as const,
            msrp: regularPrice > 0 ? regularPrice : null,
            salePrice: salePrice > 0 && salePrice !== regularPrice ? salePrice : null,
            showPrice: regularPrice > 0,
            contactForPricing: regularPrice === 0
          },
          
          // Specifications
          specifications: extractSpecifications(row),
          
          // Key features
          keyFeatures: extractKeyFeatures(row),
          
          // Metadata
          brand: 'Kawai',
          visibility: {
            featured: row['Is featured?'] === '1',
            showInCatalog: true,
            sortOrder: 0
          },
          
          // SEO
          seo: {
            metaTitle: row.Name,
            metaDescription: cleanDescription(row['Short description'] || row.Description).substring(0, 160),
            keywords: row.Tags
          },
          
          // Buy button
          buyButton: {
            text: regularPrice > 0 ? 'Contact for Details' : 'Contact for Pricing',
            showButton: true,
            style: 'primary' as const
          }
        }
        
        // Create the product using Payload's local API with overrideAccess to bypass validation
        const newProduct = await payload.create({
          collection: 'products',
          data: productData,
          overrideAccess: true // Bypass validation for required fields during migration
        })
        
        createdProducts.push({
          name: row.Name,
          id: newProduct.id,
          category: productData.category
        })
        
        console.log(`✅ Created product: ${row.Name} (${newProduct.id})`)
        
      } catch (error) {
        const errorMsg = `Error creating product ${row.Name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    const duration = Date.now() - startTime
    const durationFormatted = `${(duration / 1000).toFixed(2)}s`
    
    console.log('🎉 Migration completed!')
    console.log(`📊 Created ${createdProductlines.length} productlines and ${createdProducts.length} products in ${durationFormatted}`)
    
    return {
      success: true,
      message: `Successfully migrated ${createdProducts.length} products and ${createdProductlines.length} product lines`,
      stats: {
        totalProcessed: parentProducts.length,
        productlinesCreated: createdProductlines.length,
        productsCreated: createdProducts.length,
        errors: errors.length,
        duration: durationFormatted
      },
      errors,
      products: createdProducts,
      productlines: createdProductlines
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('💥 Migration failed:', errorMsg)
    
    return {
      success: false,
      message: `Migration failed: ${errorMsg}`,
      stats: {
        totalProcessed: 0,
        productlinesCreated: createdProductlines.length,
        productsCreated: createdProducts.length,
        errors: errors.length + 1,
        duration: `${(Date.now() - startTime) / 1000}s`
      },
      errors: [...errors, errorMsg],
      products: createdProducts,
      productlines: createdProductlines
    }
  }
}

/**
 * GET handler - Simple browser-accessible migration
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🌐 Migration route accessed via GET request')
    
    // Check if CSV file exists
    try {
      await fs.access(CSV_FILE_PATH)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: `CSV file not found at: ${CSV_FILE_PATH}`,
          suggestion: 'Make sure update_productDB.csv is in the project root directory'
        },
        { status: 404 }
      )
    }
    
    // Run the migration
    const result = await runSimpleMigration()
    
    // Return HTML response for browser
    const isHtmlRequest = request.headers.get('accept')?.includes('text/html')
    
    if (isHtmlRequest) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Kawai Product Migration Results</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 20px; 
              line-height: 1.6;
              background: #f5f5f5;
            }
            .container { 
              background: white; 
              padding: 30px; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            .success { color: #10b981; }
            .error { color: #ef4444; }
            .warning { color: #f59e0b; }
            .stats { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 15px; 
              margin: 20px 0; 
            }
            .stat-card { 
              background: #f9fafb; 
              padding: 15px; 
              border-radius: 6px; 
              text-align: center; 
            }
            .stat-number { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1f2937; 
            }
            .stat-label { 
              font-size: 14px; 
              color: #6b7280; 
            }
            .items-list { 
              max-height: 300px; 
              overflow-y: auto; 
              background: #f9fafb; 
              padding: 15px; 
              border-radius: 6px; 
              margin: 10px 0; 
            }
            .item { 
              padding: 5px 0; 
              border-bottom: 1px solid #e5e7eb; 
            }
            .item:last-child { border-bottom: none; }
            .category-badge { 
              background: #e5e7eb; 
              padding: 2px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              color: #374151; 
            }
            h1 { color: #1f2937; margin-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; }
            .timestamp { color: #6b7280; font-size: 14px; }
            .refresh-btn {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              margin: 10px 5px 0 0;
            }
            .refresh-btn:hover { background: #2563eb; }
            .admin-btn {
              background: #059669;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 14px;
              margin: 10px 5px 0 0;
              display: inline-block;
            }
            .admin-btn:hover { background: #047857; text-decoration: none; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎹 Kawai Product Migration Results</h1>
            <p class="timestamp">Completed at: ${new Date().toLocaleString()}</p>
            
            <div class="${result.success ? 'success' : 'error'}">
              <h2>${result.success ? '✅ Success!' : '❌ Failed'}</h2>
              <p>${result.message}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-number">${result.stats.totalProcessed}</div>
                <div class="stat-label">Total Processed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${result.stats.productlinesCreated}</div>
                <div class="stat-label">Product Lines Created</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${result.stats.productsCreated}</div>
                <div class="stat-label">Products Created</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${result.stats.errors}</div>
                <div class="stat-label">Errors</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${result.stats.duration}</div>
                <div class="stat-label">Duration</div>
              </div>
            </div>
            
            ${result.productlines.length > 0 ? `
              <h2>📂 Created Product Lines (${result.productlines.length})</h2>
              <div class="items-list">
                ${result.productlines.map(pl => `
                  <div class="item">
                    <strong>${pl.name}</strong>
                    <span class="category-badge">${pl.category}</span>
                    <small style="color: #6b7280;"> (${pl.id})</small>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${result.products.length > 0 ? `
              <h2>🛒 Created Products (${result.products.length})</h2>
              <div class="items-list">
                ${result.products.map(product => `
                  <div class="item">
                    <strong>${product.name}</strong>
                    <span class="category-badge">${product.category}</span>
                    <small style="color: #6b7280;"> (${product.id})</small>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${result.errors.length > 0 ? `
              <h2 class="error">⚠️ Errors (${result.errors.length})</h2>
              <div class="items-list">
                ${result.errors.map(error => `<div class="item error">${error}</div>`).join('')}
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <button class="refresh-btn" onclick="location.reload()">🔄 Run Migration Again</button>
              <a href="/admin" class="admin-btn">🔧 Open Admin Panel</a>
              <a href="/admin/collections/products" class="admin-btn">📦 View Products</a>
              <a href="/admin/collections/productlines" class="admin-btn">📂 View Product Lines</a>
            </div>
          </div>
        </body>
        </html>
      `
      
      return new NextResponse(html, {
        headers: { 'content-type': 'text/html' }
      })
    }
    
    // Return JSON for API requests
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500 
    })
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('💥 API route error:', errorMsg)
    
    const errorResult = {
      success: false,
      message: `API route error: ${errorMsg}`,
      stats: { totalProcessed: 0, productlinesCreated: 0, productsCreated: 0, errors: 1, duration: '0s' },
      errors: [errorMsg],
      products: [],
      productlines: []
    }
    
    return NextResponse.json(errorResult, { status: 500 })
  }
}