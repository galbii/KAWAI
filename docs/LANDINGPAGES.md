# Landing Pages System Documentation

> **KAWAI Piano Website - Campaign Landing Pages**  
> A comprehensive guide to creating and managing dynamically generated campaign landing pages

## 🚀 Overview

The KAWAI Piano Website landing pages system allows you to create campaign-specific pages that are dynamically generated using Payload CMS. These pages are accessible via a nested URL structure and provide flexible content management with exclusive landing page blocks.

### URL Structure
```
/{dealer-slug}/{campaign-slug}
```

**Examples:**
- `/st-louis/summer-sale-2024`
- `/chicago/student-special`  
- `/atlanta/holiday-promotion`
- `/dallas-university/spring-digital-pianos`

---

## 🏗️ System Architecture

### Core Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **LandingPages Collection** | `src/collections/LandingPages.ts` | CMS content management |
| **Landing Page Blocks** | `src/blocks/` | Exclusive content blocks |
| **Dynamic Routes** | `src/app/(frontend)/[slug]/[campaignSlug]/` | URL handling |
| **React Components** | `src/components/blocks/` | Block rendering |
| **Data Functions** | `src/lib/payload.ts` | API queries |

### Data Flow
```
CMS Admin → LandingPages Collection → API Routes → React Components → Rendered Page
```

---

## 📊 Collections & Relationships

### LandingPages Collection Structure

```typescript
LandingPage {
  // Basic Information
  title: string              // Internal admin title
  campaignId: string         // Unique campaign identifier  
  slug: string              // URL slug (auto-generated)
  
  // Relationships
  dealerLocation: DealerLocation  // Required relationship
  
  // Status & Timing
  status: 'active' | 'draft' | 'scheduled' | 'expired' | 'paused'
  startDate?: Date
  endDate?: Date
  
  // Content
  content: Block[]          // Landing page blocks
  
  // Campaign Management
  campaignType: 'product' | 'event' | 'promotion' | 'seasonal' | 'educational'
  targetAudience: 'students' | 'professionals' | 'families' | 'teachers' | 'general'
  
  // SEO & Analytics
  seo: SEOFields
  utmParameters: UTMFields
  conversionGoals: ConversionFields
}
```

### Relationships Diagram
```
DealerLocations (1) ←→ (∞) LandingPages
      ↓
    "st-louis" ←→ "summer-sale-2024"
                ←→ "student-special"  
                ←→ "holiday-promotion"
```

---

## 🎨 Exclusive Landing Page Blocks

### Available Blocks

#### 1. **Hello Block** (`hello`)
- **Purpose**: Simple testing and welcome messages
- **Fields**: Message text, timestamp options, styling
- **Use Case**: Testing, simple announcements

#### 2. **Landing Hero** (`landingHero`)  
- **Purpose**: Campaign-focused hero sections
- **Fields**: Headlines, CTAs, background media, urgency messaging
- **Use Case**: Main campaign promotion, conversions

#### 3. **Landing Features** (`landingFeatures`)
- **Purpose**: Feature highlights for campaigns  
- **Fields**: Feature lists, icons, layouts, animations
- **Use Case**: Showcase benefits, product features

#### 4. **Landing Testimonials** (`landingTestimonials`)
- **Purpose**: Social proof for campaigns
- **Fields**: Customer quotes, ratings, verification badges
- **Use Case**: Build trust, showcase satisfaction

### Block Integration
```typescript
// Block references in LandingPages collection
blockReferences: ['hello', 'landingHero', 'landingFeatures', 'landingTestimonials']
blocks: [] // Empty for performance optimization
```

---

## 🛠️ Creating Landing Pages

### Step-by-Step Guide

#### 1. **Access Admin Panel**
```
http://localhost:3000/admin/collections/landing-pages
```

#### 2. **Create New Landing Page**

1. Click "Create New" button
2. Fill in basic information:
   - **Title**: Internal reference (e.g., "Summer Sale 2024")
   - **Campaign ID**: URL-friendly identifier (e.g., "summer-sale-2024")  
   - **Dealer Location**: Select from dropdown

#### 3. **Configure Campaign Details**

**Campaign Details Tab:**
- Set campaign type and target audience
- Configure start/end dates
- Add campaign description

**Page Content Tab:**
- Add content blocks using the flexible block system
- Configure Hello, Landing Hero, Features, and Testimonials blocks

**SEO & Meta Tab:**
- Set meta title and description
- Configure Open Graph settings
- Add keywords

#### 4. **Set Status to Active**
- Change status from "draft" to "active"
- Landing page will be live immediately

#### 5. **Access Your Landing Page**
```
http://localhost:3000/{dealer-slug}/{campaign-id}
```

### Quick Start Example

```yaml
Title: "St Louis Summer Piano Sale"
Campaign ID: "summer-sale-2024"
Dealer Location: "St Louis" (slug: st-louis)
Status: "Active"

Content Blocks:
  - Landing Hero:
      headline: "Summer Piano Sale - Save $2,000!"
      cta: "Shop Now"
  - Landing Features:
      features: ["Free Delivery", "0% Financing", "Trade-In Program"]
  - Landing Testimonials:
      testimonials: [customer reviews]

URL: /st-louis/summer-sale-2024
```

---

## 🔧 Technical Implementation

### Route Structure

```
src/app/(frontend)/
├── [slug]/
│   ├── page.tsx                    # Dealer location page
│   └── [campaignSlug]/
│       ├── page.tsx                # Landing page component  
│       └── layout.tsx              # Landing page layout
```

### API Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /api/landing-pages/by-slug/{dealer}/{campaign}` | Fetch landing page data | LandingPage object |
| `GET /api/dealer-locations/by-slug/{dealer}` | Validate dealer location | DealerLocation object |

### Data Fetching Functions

```typescript
// Get specific landing page
const landingPage = await getLandingPageData('st-louis', 'summer-sale-2024')

// Get all active campaigns for a dealer
const campaigns = await getActiveLandingPages('st-louis')

// Get SEO metadata
const metadata = await getLandingPageMetadata('st-louis', 'summer-sale-2024')
```

---

## 📱 Frontend Rendering

### Component Architecture

```typescript
LandingPageComponent
├── LandingPageLayout           // SEO, metadata, analytics
├── Block Renderer              // Dynamic block rendering
│   ├── HelloBlock             // Simple messages
│   ├── LandingHeroBlock       // Campaign heroes  
│   ├── LandingFeaturesBlock   // Feature lists
│   └── LandingTestimonialsBlock // Social proof
```

### Block Rendering Flow

```typescript
// Dynamic block rendering
landingPage.content?.map((block, index) => {
  switch (block.blockType) {
    case 'hello':
      return <HelloBlock key={index} {...block} />
    case 'landingHero':  
      return <LandingHeroBlock key={index} {...block} />
    case 'landingFeatures':
      return <LandingFeaturesBlock key={index} {...block} />
    case 'landingTestimonials':
      return <LandingTestimonialsBlock key={index} {...block} />
    default:
      return null
  }
})
```

---

## 🎯 Campaign Management

### Campaign Status Options

| Status | Description | Behavior |
|--------|-------------|----------|
| **Draft** | Development/preview | Not accessible publicly |
| **Active** | Live campaign | Fully accessible |
| **Scheduled** | Future campaign | Accessible based on start date |  
| **Paused** | Temporarily disabled | Shows maintenance message |
| **Expired** | Past campaign | Redirects or shows archive message |

### Campaign Types & Use Cases

#### **Product Campaigns**
- New piano model launches
- Feature demonstrations
- Product comparisons

#### **Event Campaigns**  
- Recitals and performances
- Educational workshops
- Dealer open houses

#### **Promotional Campaigns**
- Seasonal sales
- Holiday specials
- Student discounts

#### **Educational Campaigns**
- Piano learning resources
- Teacher training programs
- Music education content

---

## 📈 Analytics & Tracking

### UTM Parameter Configuration

```yaml
UTM Source: "kawai-website"
UTM Medium: "landing-page" 
UTM Campaign: "{campaign-id}"
UTM Content: "{dealer-slug}"
UTM Term: "{target-audience}"
```

### Conversion Goals

- **Lead Generation**: Contact form submissions
- **Product Interest**: Brochure downloads
- **Showroom Visits**: Appointment bookings
- **Sales Qualified Leads**: Demo requests

### Analytics Integration

- **Google Analytics**: Campaign tracking, conversion goals
- **Facebook Pixel**: Retargeting, custom audiences
- **PostHog**: User behavior, A/B testing
- **Custom Events**: Campaign-specific tracking

---

## 🔍 SEO Optimization

### Metadata Structure

```typescript
// Automatic SEO generation
{
  title: "{Campaign Title} | {Dealer Name}"
  description: "{Campaign Description} - Visit {Dealer Name} for exclusive offers"
  keywords: "piano, {dealer-city}, {campaign-type}, Kawai"
  canonical: "/{dealer-slug}/{campaign-slug}"
  openGraph: {
    title: "{Campaign Title}"
    description: "{Campaign Description}"
    image: "{campaign-hero-image}"
    type: "website"
  }
}
```

### Structured Data

```json
{
  "@type": "Event", 
  "name": "{Campaign Title}",
  "startDate": "{start-date}",
  "location": {
    "@type": "Place",
    "name": "{Dealer Name}",
    "address": "{Dealer Address}"
  },
  "organizer": {
    "@type": "Organization", 
    "name": "Kawai Piano"
  }
}
```

---

## 🚦 Error Handling & Validation

### Common Scenarios

#### 404 Not Found
- **Cause**: Landing page doesn't exist or is inactive
- **Response**: Next.js 404 page
- **Debug**: Check campaign slug and dealer relationship

#### Campaign Expired  
- **Cause**: Current date is past `endDate`
- **Response**: Redirect to dealer location page
- **Override**: Admin can set `ignoreExpiration: true`

#### Dealer Inactive
- **Cause**: Associated dealer location is not active
- **Response**: 404 error
- **Solution**: Activate dealer location in admin

### Validation Rules

```typescript
// Landing page validation
- campaignId: Required, unique, URL-safe characters only
- dealerLocation: Required relationship to active dealer  
- status: Required, must be valid enum value
- slug: Auto-generated from campaignId, must be unique per dealer
- startDate: Optional, must be before endDate if both provided
```

---

## 🔧 Development & Testing

### Local Development Setup

```bash
# Start development server
bun run dev

# Access admin panel
http://localhost:3000/admin

# Create test landing page
# Navigate to: Collections → Landing Pages → Create New
```

### Testing Workflow

1. **Create Test Campaign**:
   ```
   Title: "Test Campaign"
   Campaign ID: "test-campaign"  
   Dealer: "St Louis"
   Status: "Active"
   ```

2. **Add Test Blocks**:
   - Hello block with custom message
   - Landing hero with test CTA

3. **Test URL**:
   ```
   http://localhost:3000/st-louis/test-campaign
   ```

4. **Verify Features**:
   - Page renders correctly
   - Blocks display properly
   - SEO metadata is correct
   - Analytics tracking works

### Debug Tools

```typescript
// Enable debug logging
process.env.NODE_ENV === 'development'

// Check data fetching
console.log('Landing page data:', landingPageData)

// Validate relationships  
console.log('Dealer location:', dealerLocation)

// Monitor queries
// Check browser network tab for API calls
```

---

## 🔄 Migration & Maintenance

### Data Migration

If migrating existing landing pages:

```typescript
// Convert legacy isActive to status field
const landingPages = await payload.find({
  collection: 'landing-pages',
  where: { isActive: { equals: true } }
})

// Update to new status system
for (const page of landingPages.docs) {
  await payload.update({
    collection: 'landing-pages',
    id: page.id,
    data: { 
      status: page.isActive ? 'active' : 'draft'
    }
  })
}
```

### Maintenance Tasks

#### Regular Maintenance
- Review expired campaigns monthly
- Archive old campaigns to maintain performance
- Update SEO metadata based on performance
- Monitor conversion rates and optimize

#### Performance Optimization  
- Use cached data fetching functions
- Optimize images in landing page blocks
- Monitor page load speeds
- Implement lazy loading for below-fold content

---

## 📚 API Reference

### Collection Fields Reference

```typescript
interface LandingPage {
  id: string
  title: string                    // Admin display title
  campaignId: string              // Unique identifier
  slug: string                    // URL slug (auto-generated)
  dealerLocation: DealerLocation  // Required relationship
  status: CampaignStatus          // Active status control
  
  // Content  
  content: Block[]                // Landing page blocks
  
  // Campaign Management
  campaignType: CampaignType      // Campaign classification
  targetAudience: TargetAudience  // Audience targeting
  startDate?: Date               // Campaign start
  endDate?: Date                 // Campaign end
  
  // Advanced Features
  passwordProtected?: boolean     // Access control
  password?: string              // Access password
  customCSS?: string             // Custom styling
  customJS?: string              // Custom scripts
  
  // Analytics
  utmParameters: UTMFields        // Tracking parameters
  conversionGoals: ConversionGoal[] // Success metrics
  
  // SEO
  seo: SEOFields                 // Search optimization
  
  // System Fields
  createdAt: Date
  updatedAt: Date
  createdBy: User
  updatedBy: User
}
```

### Query Examples

```typescript
// Find by dealer and campaign
GET /api/landing-pages?where[dealerLocation.slug][equals]=st-louis&where[slug][equals]=summer-sale

// Find all active campaigns  
GET /api/landing-pages?where[status][equals]=active

// Find campaigns by type
GET /api/landing-pages?where[campaignType][equals]=promotional

// Find expiring campaigns
GET /api/landing-pages?where[endDate][lte]=2024-12-31&where[status][equals]=active
```

---

## 🎉 Best Practices

### Content Strategy

#### **Compelling Headlines**
- Use action-oriented language
- Include specific benefits or offers
- Create urgency when appropriate
- Keep under 60 characters for SEO

#### **Clear CTAs**  
- Use contrasting colors
- Place above the fold
- Limit to 1-2 primary actions
- Make value proposition clear

#### **Social Proof**
- Include customer testimonials
- Show verification badges
- Display customer count/popularity
- Use local testimonials when possible

### Technical Best Practices

#### **Performance**
- Optimize images using the media system
- Use lazy loading for below-fold content  
- Implement proper caching strategies
- Monitor Core Web Vitals

#### **SEO**
- Use descriptive URLs
- Include location and campaign keywords
- Set proper meta descriptions
- Implement structured data

#### **Analytics**
- Set up conversion tracking
- Use UTM parameters consistently  
- Monitor campaign performance
- A/B test different approaches

---

## 🆘 Troubleshooting

### Common Issues & Solutions

#### **Landing Page Not Found (404)**

**Symptoms**: 
- URL returns 404 error
- "Found 0 landing pages" in debug logs

**Causes & Solutions**:
1. **Inactive Status**: Set status to "active" in admin
2. **Wrong Slug**: Verify campaign ID matches URL
3. **Dealer Relationship**: Ensure dealer location is active
4. **Date Range**: Check if campaign is within start/end dates

**Debug Steps**:
```bash
# Check if dealer location exists
curl "http://localhost:3000/api/dealer-locations/by-slug/st-louis"

# Check landing page data
curl "http://localhost:3000/api/landing-pages/by-slug/st-louis/campaign-slug"
```

#### **Blocks Not Rendering**

**Symptoms**:
- Page loads but blocks are missing
- Empty content sections

**Solutions**:
1. Verify blocks are added in admin content tab
2. Check block component imports
3. Ensure block types match component mapping
4. Review browser console for JavaScript errors

#### **SEO Issues**

**Symptoms**:  
- Missing meta tags
- Incorrect OpenGraph data

**Solutions**:
1. Set SEO fields in admin panel  
2. Verify metadata generation in layout component
3. Check structured data implementation
4. Use SEO tools to validate markup

---

## 🎯 Success Metrics

### Key Performance Indicators

#### **Conversion Metrics**
- **Landing Page Conversion Rate**: Visitors who complete desired actions
- **Cost Per Conversion**: Campaign spend divided by conversions  
- **Return on Ad Spend (ROAS)**: Revenue generated vs. campaign cost

#### **Engagement Metrics**  
- **Time on Page**: How long visitors stay engaged
- **Bounce Rate**: Percentage leaving without interaction
- **Pages Per Session**: Additional pages visited
- **Click-Through Rate**: CTA button click percentage

#### **Campaign Metrics**
- **Campaign Reach**: Number of unique visitors
- **Geographic Distribution**: Visitor locations  
- **Device Breakdown**: Mobile vs. desktop usage
- **Traffic Sources**: Direct, organic, paid, referral

### Reporting Dashboard

Track campaign performance through:
- **Google Analytics**: Traffic, conversions, user behavior
- **Payload CMS Analytics**: Page views, content performance  
- **Custom Dashboard**: Campaign-specific metrics
- **Monthly Reports**: Automated performance summaries

---

## 📞 Support & Resources  

### Getting Help

#### **Technical Issues**
- Check browser console for errors
- Review server logs for API errors  
- Use debug mode for detailed logging
- Test with different browsers/devices

#### **Content Questions**
- Review this documentation
- Check existing successful campaigns
- Consult with marketing team  
- Test different approaches

#### **System Administration**
- Access Payload CMS admin panel
- Review collection configurations
- Monitor system performance
- Check database connections

### Additional Resources

- **Payload CMS Documentation**: [payloadcms.com/docs](https://payloadcms.com/docs)
- **Next.js Dynamic Routes**: [nextjs.org/docs/routing](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- **KAWAI System Architecture**: See `CLAUDE.md` for full system overview

---

*Last Updated: December 2024*  
*System Version: Next.js 15 + Payload CMS 3.52+*

---

## 🚀 Quick Reference

### Essential URLs
```bash
# Admin Panel
http://localhost:3000/admin/collections/landing-pages

# Test Landing Page  
http://localhost:3000/st-louis/test-campaign

# API Endpoint
http://localhost:3000/api/landing-pages/by-slug/st-louis/test-campaign
```

### Key Commands
```bash
# Start development
bun run dev

# Build production
bun run build

# Run linting  
bun run lint
```

### Quick Campaign Setup
1. Go to `/admin/collections/landing-pages`
2. Create new with dealer location + campaign ID
3. Add Hello block for testing  
4. Set status to "Active"
5. Visit `/{dealer-slug}/{campaign-id}`

*Happy campaigning! 🎹*