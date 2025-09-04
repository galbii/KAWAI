#!/usr/bin/env python3
import csv
import json
import re
from collections import defaultdict

def parse_csv_field(field):
    """Parse CSV field, handling quoted content"""
    if field.startswith('"') and field.endswith('"'):
        return field[1:-1].replace('""', '"')
    return field

def extract_price_from_html(html_content):
    """Extract MSRP price from HTML content"""
    if not html_content:
        return None
    
    # Look for price patterns
    price_patterns = [
        r'\$([0-9,]+)',  # $41,195
        r'MSRP.*?\$([0-9,]+)',  # MSRP: $41,195
    ]
    
    for pattern in price_patterns:
        match = re.search(pattern, html_content)
        if match:
            return match.group(1).replace(',', '')
    return None

def categorize_product(name, categories):
    """Categorize product by type and series"""
    name_lower = name.lower()
    categories_lower = categories.lower() if categories else ""
    
    # Type classification
    if 'grand piano' in name_lower:
        product_type = 'Grand Piano'
    elif 'upright piano' in name_lower:
        product_type = 'Upright Piano'
    elif 'digital piano' in name_lower or 'hybrid' in name_lower:
        product_type = 'Digital Piano'
    else:
        product_type = 'Other'
    
    # Series classification
    series = 'Unknown'
    if re.search(r'GL[-\s]?\d+', name):
        series = 'GL Series'
    elif re.search(r'GX[-\s]?\d+', name):
        series = 'GX Series' 
    elif re.search(r'K[-\s]?\d+', name):
        series = 'K Series'
    elif re.search(r'CA\d+', name):
        series = 'CA Series'
    elif re.search(r'CN\d+', name):
        series = 'CN Series'
    elif re.search(r'CP\d+', name):
        series = 'CP Series'
    elif re.search(r'CS\d+', name):
        series = 'CS Series'
    elif re.search(r'ES\d+', name):
        series = 'ES Series'
    elif re.search(r'MP\d+', name):
        series = 'MP Series'
    elif re.search(r'KDP\d+', name):
        series = 'KDP Series'
    elif 'NOVUS' in name or 'NV' in name:
        series = 'NOVUS Series'
    elif 'ATX' in name or 'AURES' in name:
        series = 'Hybrid Series'
    elif 'RX' in name:
        series = 'RX Series'
    elif 'GM' in name:
        series = 'GM Series'
    elif 'GE-' in name:
        series = 'GE Series'
    elif 'EX Concert' in name:
        series = 'EX Series'
    elif 'Crystal Grand' in name:
        series = 'Crystal Grand'
    
    return product_type, series

def extract_model_number(name):
    """Extract model number from product name"""
    # Common patterns
    patterns = [
        r'(GL[-\s]?\d+)',
        r'(GX[-\s]?\d+)', 
        r'(K[-\s]?\d+)',
        r'(CA\d+)',
        r'(CN\d+)',
        r'(CP\d+)',
        r'(CS\d+)',
        r'(ES\d+)',
        r'(MP\d+)',
        r'(KDP\d+)',
        r'(NV\d+)',
        r'(RX[-\s]?\d+)',
        r'(GM[-\s]?\d+)',
        r'(GE[-\s]?\d+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            return match.group(1).replace(' ', '-').upper()
    
    # Fallback - extract first word after "Kawai"
    match = re.search(r'Kawai\s+([A-Z0-9\-]+)', name)
    if match:
        return match.group(1)
    
    return 'Unknown'

def main():
    products = {}
    variations = defaultdict(list)
    
    with open('/Users/chancenoonan/dev/code/KAWAI/update_productDB.csv', 'r', encoding='utf-8') as csvfile:
        # Read only first 1777 lines (header + 1776 data lines)
        lines = []
        for i, line in enumerate(csvfile):
            if i < 1777:
                lines.append(line)
            else:
                break
        
        # Parse the CSV
        csv_reader = csv.reader(lines)
        header = next(csv_reader)
        
        # Clean BOM from header if present
        if header[0].startswith('\ufeff'):
            header[0] = header[0][1:]
        
        # Find column indices
        id_idx = header.index('ID')
        type_idx = header.index('Type')
        name_idx = header.index('Name')
        sale_price_idx = header.index('Sale price')
        regular_price_idx = header.index('Regular price')
        categories_idx = header.index('Categories')
        tags_idx = header.index('Tags')
        parent_idx = header.index('Parent')
        weight_idx = header.index('Weight (kg)')
        length_idx = header.index('Length (cm)')
        width_idx = header.index('Width (cm)')
        height_idx = header.index('Height (cm)')
        short_desc_idx = header.index('Short description')
        
        # Find attribute columns
        attr_name_cols = []
        attr_value_cols = []
        for i, col in enumerate(header):
            if col.startswith('Attribute ') and col.endswith(' name'):
                attr_name_cols.append(i)
            elif col.startswith('Attribute ') and col.endswith(' value(s)'):
                attr_value_cols.append(i)
        
        for row in csv_reader:
            if len(row) <= max(id_idx, type_idx, name_idx):
                continue
                
            product_id = row[id_idx]
            product_type = row[type_idx]
            name = row[name_idx]
            
            if not product_id or not name:
                continue
            
            # Extract basic info
            sale_price = row[sale_price_idx] if len(row) > sale_price_idx else ''
            regular_price = row[regular_price_idx] if len(row) > regular_price_idx else ''
            categories = row[categories_idx] if len(row) > categories_idx else ''
            tags = row[tags_idx] if len(row) > tags_idx else ''
            parent = row[parent_idx] if len(row) > parent_idx else ''
            
            # Extract dimensions
            weight = row[weight_idx] if len(row) > weight_idx else ''
            length = row[length_idx] if len(row) > length_idx else ''
            width = row[width_idx] if len(row) > width_idx else ''
            height = row[height_idx] if len(row) > height_idx else ''
            
            # Extract short description for MSRP
            short_desc = row[short_desc_idx] if len(row) > short_desc_idx else ''
            msrp_from_desc = extract_price_from_html(short_desc)
            
            # Extract attributes
            attributes = {}
            for name_col, value_col in zip(attr_name_cols, attr_value_cols):
                if len(row) > value_col:
                    attr_name = row[name_col] if len(row) > name_col else ''
                    attr_value = row[value_col] if len(row) > value_col else ''
                    if attr_name and attr_value:
                        attributes[attr_name] = attr_value
            
            # Categorize product
            product_category, series = categorize_product(name, categories)
            model_number = extract_model_number(name)
            
            product_info = {
                'id': product_id,
                'type': product_type,
                'name': name,
                'model_number': model_number,
                'series': series,
                'category': product_category,
                'categories': categories,
                'tags': tags,
                'parent': parent,
                'sale_price': sale_price,
                'regular_price': regular_price,
                'msrp_from_description': msrp_from_desc,
                'weight_kg': weight,
                'length_cm': length,
                'width_cm': width,
                'height_cm': height,
                'attributes': attributes
            }
            
            if product_type == 'variable':
                products[product_id] = product_info
            elif product_type == 'variation':
                parent_id = parent.replace('id:', '') if parent.startswith('id:') else parent
                variations[parent_id].append(product_info)
            elif product_type == 'simple':
                products[product_id] = product_info
    
    # Combine products with their variations
    final_catalog = {}
    
    for product_id, product in products.items():
        product['variations'] = variations.get(product_id, [])
        final_catalog[product_id] = product
    
    # Add simple products
    for product_id, product in products.items():
        if product['type'] == 'simple':
            final_catalog[product_id] = product
    
    return final_catalog

if __name__ == "__main__":
    catalog = main()
    
    # Save to JSON for analysis
    with open('/Users/chancenoonan/dev/code/KAWAI/extracted_catalog_first_half.json', 'w') as f:
        json.dump(catalog, f, indent=2)
    
    print(f"Extracted {len(catalog)} products from first half of CSV")
    
    # Print summary statistics
    by_type = defaultdict(int)
    by_series = defaultdict(int)
    
    for product in catalog.values():
        by_type[product['category']] += 1
        by_series[product['series']] += 1
    
    print("\nBy Type:")
    for ptype, count in sorted(by_type.items()):
        print(f"  {ptype}: {count}")
        
    print("\nBy Series:")
    for series, count in sorted(by_series.items()):
        print(f"  {series}: {count}")