/**
 * Default Block Templates for Auto-Generated Products
 * 
 * This file defines the default block configurations that are applied
 * when a PianoModel automatically creates a Product page.
 */

import type { Block } from 'payload'

export interface BlockTemplate {
  blockType: string
  [key: string]: any
}

/**
 * Generate default block configuration for a piano model product page
 * @param pianoModelId - The ID of the piano model to link blocks to
 * @returns Array of block configurations for the product page
 */
export function generateDefaultProductBlocks(pianoModelId: string): BlockTemplate[] {
  return [
    // Hero section with piano model data
    {
      blockType: 'hero',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      content: {
        primaryCta: {
          text: 'Learn More',
          style: 'primary',
          openInNewTab: false
        },
        secondaryCta: {
          text: 'Contact Us',
          style: 'outline',
          openInNewTab: false
        }
      },
      media: {
        type: 'image',
        overlay: {
          enable: true,
          color: 'dark',
          opacity: 0.4
        }
      },
      layout: {
        height: 'large',
        contentAlignment: 'center',
        verticalAlignment: 'center',
        maxWidth: 'medium'
      }
    },

    // Product showcase with piano model data
    {
      blockType: 'productShowcase',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      product: {
        buyButton: {
          text: 'Contact for Details',
          style: 'primary',
          openInNewTab: false
        },
        inStock: true
      },
      layout: {
        imagePosition: 'left',
        showVariations: true,
        showPrice: true,
        compact: false
      }
    },

    // Key features from piano model
    {
      blockType: 'featuresList',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      header: {
        title: 'Key Features',
        description: 'Discover what makes this piano special'
      },
      layout: {
        style: 'grid',
        columns: 'two',
        iconPosition: 'left',
        spacing: 'medium',
        backgroundColor: 'light-gray'
      }
    },

    // Image gallery from piano model
    {
      blockType: 'imageGallery',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      title: 'Gallery',
      description: 'See this piano from every angle',
      layout: {
        style: 'lightbox',
        columns: 'three',
        spacing: 'medium',
        aspectRatio: 'landscape'
      },
      enableZoom: true,
      showCaptions: true
    },

    // Specifications from piano model
    {
      blockType: 'specifications',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      header: {
        title: 'Specifications',
        description: 'Complete technical details and measurements'
      },
      layout: {
        style: 'table',
        columns: 'one',
        showCategoryIcons: false,
        alternateRows: true,
        compactMode: false
      },
      downloadOptions: {
        enableDownload: false
      }
    },

    // Call to action
    {
      blockType: 'callToAction',
      title: 'Ready to Experience This Piano?',
      description: 'Contact our piano specialists to schedule a demonstration or get more information about this model.',
      buttons: [
        {
          text: 'Schedule Demo',
          link: '/contact?action=demo',
          style: 'primary',
          openInNewTab: false
        },
        {
          text: 'Get Quote',
          link: '/contact?action=quote',
          style: 'outline',
          openInNewTab: false
        }
      ],
      layout: {
        backgroundColor: 'brand',
        textAlignment: 'center',
        size: 'large'
      }
    }
  ]
}

/**
 * Generate minimal block configuration for quick setup
 * @param pianoModelId - The ID of the piano model to link blocks to
 * @returns Minimal array of block configurations
 */
export function generateMinimalProductBlocks(pianoModelId: string): BlockTemplate[] {
  return [
    // Hero section
    {
      blockType: 'hero',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      layout: {
        height: 'medium',
        contentAlignment: 'center'
      }
    },

    // Product showcase
    {
      blockType: 'productShowcase',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      layout: {
        imagePosition: 'left',
        showVariations: true,
        showPrice: true
      }
    },

    // Specifications
    {
      blockType: 'specifications',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      header: {
        title: 'Specifications'
      },
      layout: {
        style: 'table'
      }
    }
  ]
}

/**
 * Generate premium block configuration with all features
 * @param pianoModelId - The ID of the piano model to link blocks to
 * @returns Premium array of block configurations
 */
export function generatePremiumProductBlocks(pianoModelId: string): BlockTemplate[] {
  return [
    // Large hero with video support
    {
      blockType: 'hero',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      media: {
        type: 'image', // Could be upgraded to video if available
        overlay: {
          enable: true,
          color: 'dark',
          opacity: 0.3
        }
      },
      layout: {
        height: 'fullscreen',
        contentAlignment: 'center',
        verticalAlignment: 'center'
      }
    },

    // Detailed product showcase
    {
      blockType: 'productShowcase',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      layout: {
        imagePosition: 'left',
        showVariations: true,
        showPrice: true,
        compact: false
      }
    },

    // Key features with icons
    {
      blockType: 'featuresList',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      header: {
        title: 'Exceptional Features',
        description: 'Crafted with precision and attention to detail'
      },
      layout: {
        style: 'cards',
        columns: 'three',
        iconPosition: 'top',
        spacing: 'spacious',
        backgroundColor: 'none'
      }
    },

    // Rich image gallery
    {
      blockType: 'imageGallery',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      title: 'Explore Every Detail',
      description: 'High-resolution images showcasing the craftsmanship and beauty',
      layout: {
        style: 'lightbox',
        columns: 'four',
        spacing: 'small',
        aspectRatio: 'original'
      },
      enableZoom: true,
      showCaptions: true
    },

    // Comprehensive specifications
    {
      blockType: 'specifications',
      dataSource: 'pianomodel',
      pianoModel: pianoModelId,
      header: {
        title: 'Complete Specifications',
        description: 'All technical details and measurements'
      },
      layout: {
        style: 'cards',
        columns: 'two',
        showCategoryIcons: true,
        alternateRows: false,
        compactMode: false
      },
      downloadOptions: {
        enableDownload: true,
        downloadButtonText: 'Download Complete Specs PDF'
      }
    },

    // Testimonials (if available)
    {
      blockType: 'testimonials',
      header: {
        title: 'What Musicians Say',
        description: 'Professional reviews and customer testimonials'
      },
      layout: {
        style: 'carousel',
        showRatings: true,
        showPhotos: true
      }
    },

    // Strong call to action
    {
      blockType: 'callToAction',
      title: 'Experience the Difference',
      description: 'Schedule a private demonstration with our piano specialists and discover why this instrument is perfect for you.',
      buttons: [
        {
          text: 'Schedule Private Demo',
          style: 'primary',
          openInNewTab: false
        },
        {
          text: 'Download Brochure',
          style: 'secondary',
          openInNewTab: true
        }
      ],
      layout: {
        backgroundColor: 'brand',
        textAlignment: 'center',
        size: 'large'
      }
    }
  ]
}

/**
 * Template configurations based on piano category
 */
export const CATEGORY_TEMPLATES = {
  digital: generateDefaultProductBlocks,
  grand: generatePremiumProductBlocks,
  hybrid: generatePremiumProductBlocks,
  upright: generateDefaultProductBlocks,
  accessories: generateMinimalProductBlocks,
  software: generateMinimalProductBlocks
} as const

/**
 * Get appropriate template based on piano model category
 * @param pianoModelId - The ID of the piano model
 * @param category - The product category
 * @returns Array of block configurations
 */
export function getTemplateForCategory(
  pianoModelId: string, 
  category: keyof typeof CATEGORY_TEMPLATES = 'digital'
): BlockTemplate[] {
  const templateFunction = CATEGORY_TEMPLATES[category] || generateDefaultProductBlocks
  return templateFunction(pianoModelId)
}