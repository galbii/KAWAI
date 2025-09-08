import { generatePianoCategoriesNavigationServer } from '@/lib/payload-server'
import { Header } from './header'

interface NavigationItem {
  label: string
  href?: string
  dropdown?: {
    label: string
    href: string
    description?: string
    isProductline?: boolean
    isProduct?: boolean
  }[]
}

export async function HeaderDynamic() {
  try {
    // Generate piano categories navigation (each category becomes a top-level nav item)
    const pianoCategories = await generatePianoCategoriesNavigationServer()
    
    // Create the navigation structure with only piano categories as main nav items
    const dynamicNavigation: NavigationItem[] = pianoCategories.map(category => ({
      label: category.label,
      href: category.href,
      dropdown: category.dropdown?.map(item => ({
        label: item.label,
        href: item.href,
        description: item.description,
        isProductline: item.isProductline,
        isProduct: item.isProduct
      })) || []
    }))

    return <Header navigation={dynamicNavigation} />
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)
    
    // Fallback to basic piano category navigation
    const fallbackNavigation: NavigationItem[] = [
      { label: 'Digital Pianos', href: '/pianos/digital', dropdown: [] },
      { label: 'Grand Pianos', href: '/pianos/grand', dropdown: [] },
      { label: 'Upright Pianos', href: '/pianos/upright', dropdown: [] },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid', dropdown: [] },
    ]
    
    return <Header navigation={fallbackNavigation} />
  }
}