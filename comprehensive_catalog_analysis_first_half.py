#!/usr/bin/env python3
import json
from collections import defaultdict, Counter
import re

def format_price(price_str):
    """Format price string for display"""
    if not price_str or price_str == 'N/A':
        return 'N/A'
    try:
        return f"${int(price_str):,}"
    except:
        return price_str

def extract_price_range(variations):
    """Extract price range from variations"""
    prices = []
    for var in variations:
        if var.get('regular_price'):
            try:
                prices.append(int(var['regular_price']))
            except:
                pass
        elif var.get('sale_price'):
            try:
                prices.append(int(var['sale_price']))
            except:
                pass
    
    if prices:
        return f"${min(prices):,} - ${max(prices):,}"
    return 'N/A'

def main():
    # Load extracted catalog
    with open('/Users/chancenoonan/dev/code/KAWAI/extracted_catalog_first_half.json', 'r') as f:
        catalog = json.load(f)
    
    print("="*80)
    print("KAWAI PIANO CATALOG ANALYSIS - TOP HALF (First 1,777 lines)")
    print("="*80)
    print()
    
    # Summary Statistics
    print("📊 SUMMARY STATISTICS")
    print("-" * 40)
    print(f"Total Products Analyzed: {len(catalog)}")
    
    # Count by type
    type_counts = Counter()
    category_counts = Counter()
    series_counts = Counter()
    variable_with_variations = 0
    total_variations = 0
    
    for product in catalog.values():
        type_counts[product['type']] += 1
        category_counts[product['category']] += 1
        series_counts[product['series']] += 1
        
        if product['type'] == 'variable':
            variations = product.get('variations', [])
            if variations:
                variable_with_variations += 1
                total_variations += len(variations)
    
    print(f"Variable Products (Parent): {type_counts['variable']}")
    print(f"Simple Products: {type_counts['simple']}")
    print(f"Products with Variations: {variable_with_variations}")
    print(f"Total Variations Found: {total_variations}")
    print()
    
    # Category Breakdown
    print("🎹 BY PIANO TYPE")
    print("-" * 40)
    for category, count in sorted(category_counts.items()):
        print(f"{category:20}: {count:3d}")
    print()
    
    # Series Breakdown
    print("🎼 BY SERIES")
    print("-" * 40)
    for series, count in sorted(series_counts.items()):
        print(f"{series:20}: {count:3d}")
    print()
    
    # Detailed Product Listings
    print("="*80)
    print("DETAILED PRODUCT CATALOG")
    print("="*80)
    
    # Group by category
    by_category = defaultdict(list)
    for product_id, product in catalog.items():
        by_category[product['category']].append((product_id, product))
    
    for category in sorted(by_category.keys()):
        products = by_category[category]
        print(f"\n🎹 {category.upper()} ({len(products)} products)")
        print("="*60)
        
        # Group by series within category
        by_series = defaultdict(list)
        for product_id, product in products:
            by_series[product['series']].append((product_id, product))
        
        for series in sorted(by_series.keys()):
            series_products = by_series[series]
            print(f"\n   📂 {series} ({len(series_products)} products)")
            print("   " + "-"*50)
            
            for product_id, product in sorted(series_products, key=lambda x: x[1]['name']):
                name = product['name']
                model = product['model_number']
                msrp = product.get('msrp_from_description')
                variations = product.get('variations', [])
                
                # Format basic info
                print(f"   • {name}")
                print(f"     Model: {model}")
                
                # Handle pricing
                if msrp:
                    print(f"     MSRP: {format_price(msrp)}")
                elif variations:
                    price_range = extract_price_range(variations)
                    print(f"     Price Range: {price_range}")
                
                # Physical specs from attributes
                attrs = product.get('attributes', {})
                specs = []
                for attr_name, attr_value in attrs.items():
                    if attr_name in ['Length', 'Width', 'Height', 'Weight', 'Depth']:
                        specs.append(f"{attr_name}: {attr_value}")
                
                if specs:
                    print(f"     Specs: {' | '.join(specs)}")
                
                # Available finishes
                finish_options = attrs.get('Finish Options', '')
                if finish_options and finish_options != 'Unknown':
                    finishes = [f.strip() for f in finish_options.split(',')]
                    print(f"     Finishes: {', '.join(finishes)}")
                
                # Variations detail
                if variations:
                    print(f"     Variations ({len(variations)}):")
                    for var in variations:
                        var_name = var['name'].replace(product['name'] + ' - ', '')
                        regular_price = var.get('regular_price')
                        sale_price = var.get('sale_price')
                        
                        price_info = ""
                        if regular_price and sale_price:
                            if regular_price != sale_price:
                                price_info = f" (Regular: {format_price(regular_price)}, Sale: {format_price(sale_price)})"
                            else:
                                price_info = f" ({format_price(regular_price)})"
                        elif regular_price:
                            price_info = f" ({format_price(regular_price)})"
                        elif sale_price:
                            price_info = f" ({format_price(sale_price)})"
                        
                        print(f"       - {var_name}{price_info}")
                
                print()
    
    # Price Analysis
    print("\n" + "="*80)
    print("PRICING ANALYSIS")
    print("="*80)
    
    price_ranges = {
        'Under $5,000': 0,
        '$5,000 - $10,000': 0,
        '$10,000 - $20,000': 0,
        '$20,000 - $50,000': 0,
        '$50,000+': 0,
        'No Price': 0
    }
    
    for product in catalog.values():
        max_price = 0
        
        # Check MSRP from description
        if product.get('msrp_from_description'):
            try:
                max_price = int(product['msrp_from_description'])
            except:
                pass
        
        # Check variations for higher prices
        for var in product.get('variations', []):
            if var.get('regular_price'):
                try:
                    price = int(var['regular_price'])
                    max_price = max(max_price, price)
                except:
                    pass
        
        # Categorize price
        if max_price == 0:
            price_ranges['No Price'] += 1
        elif max_price < 5000:
            price_ranges['Under $5,000'] += 1
        elif max_price < 10000:
            price_ranges['$5,000 - $10,000'] += 1
        elif max_price < 20000:
            price_ranges['$10,000 - $20,000'] += 1
        elif max_price < 50000:
            price_ranges['$20,000 - $50,000'] += 1
        else:
            price_ranges['$50,000+'] += 1
    
    print("\n💰 PRICE DISTRIBUTION")
    print("-" * 30)
    for range_name, count in price_ranges.items():
        print(f"{range_name:20}: {count:3d}")
    
    print("\n" + "="*80)
    print("KEY FINDINGS")
    print("="*80)
    
    # Calculate some insights
    grand_pianos = category_counts.get('Grand Piano', 0)
    upright_pianos = category_counts.get('Upright Piano', 0)
    digital_pianos = category_counts.get('Digital Piano', 0)
    
    print(f"• Total unique piano products in first half: {len(catalog)}")
    print(f"• Product distribution: {digital_pianos} Digital ({digital_pianos/len(catalog)*100:.1f}%), " + 
          f"{grand_pianos} Grand ({grand_pianos/len(catalog)*100:.1f}%), " +
          f"{upright_pianos} Upright ({upright_pianos/len(catalog)*100:.1f}%)")
    
    # Most popular series
    top_series = series_counts.most_common(5)
    print(f"• Top 5 series by product count:")
    for series, count in top_series:
        print(f"  - {series}: {count} products")
    
    # Finish analysis
    all_finishes = set()
    for product in catalog.values():
        finish_options = product.get('attributes', {}).get('Finish Options', '')
        if finish_options:
            finishes = [f.strip() for f in finish_options.split(',')]
            all_finishes.update(finishes)
    
    print(f"• Total unique finish options available: {len(all_finishes)}")
    common_finishes = ['Polished Ebony', 'Satin Ebony', 'Polished Mahogany', 'Satin Mahogany']
    available_common = [f for f in common_finishes if f in all_finishes]
    print(f"• Common finishes found: {', '.join(available_common)}")

if __name__ == "__main__":
    main()