# Product Code System

## Overview
The system now automatically generates unique product codes based on product names, making it easier to search and identify products in the billing system.

## Product Code Format
- **Format**: `[PREFIX][NUMBER]` (e.g., `RICE001`, `SUGAR002`)
- **Prefix**: 3-6 characters derived from product name
- **Number**: 3-digit sequential number with leading zeros

## Examples

| Product Name | Generated Code | Explanation |
|--------------|----------------|-------------|
| Basmati Rice 1kg | `BASMAT001` | First 6 chars of "BASMATI" |
| White Sugar 1kg | `WHTSUG001` | "WHT" from "WHITE" + "SUG" from "SUGAR" |
| Sunflower Oil 1L | `SUNOIL001` | "SUN" from "SUNFLOWER" + "OIL" |
| Fresh Milk 500ml | `FREMIL001` | "FRE" from "FRESH" + "MIL" from "MILK" |
| Green Tea Bags | `GRETEA001` | "GRE" from "GREEN" + "TEA" |
| AA Batteries Pack | `AABATT001` | "AA" + "BATT" from "BATTERIES" |

## Features

### 1. Automatic Generation
- **When Adding Products**: Codes are auto-generated when adding new products
- **Suggestions**: Shows 3 suggested codes based on product name
- **Manual Override**: Users can edit the generated code if needed
- **Uniqueness**: System ensures no duplicate codes

### 2. Smart Prefix Generation
- **Single Word**: Takes first 4-6 characters (`Rice` → `RICE`)
- **Two Words**: Takes 2-3 characters from each (`White Sugar` → `WHTSUG`)
- **Multiple Words**: Takes 1-2 characters from first few words (`Green Tea Bags` → `GRETEA`)
- **Special Characters**: Removes spaces, hyphens, and special characters
- **Common Words**: Ignores common words like "THE", "AND", "OF"

### 3. Bulk Generation
- **Dashboard Action**: "Generate Product Codes" button for existing products
- **Batch Processing**: Generates codes for all products without codes
- **Progress Tracking**: Shows how many codes were generated
- **Validation**: Ensures all generated codes are unique

### 4. Search Integration
- **Billing System**: Search by product code, barcode, ID, or name
- **Priority Order**: Code → Barcode → ID → Name
- **Case Insensitive**: Accepts both `RICE001` and `rice001`
- **Fast Lookup**: Instant product identification

## Usage

### Adding New Products
1. Enter product name in Admin Panel
2. System auto-generates code suggestions
3. Select preferred code or edit manually
4. Code is saved with the product

### Searching Products
1. In billing system, enter product code (e.g., `RICE001`)
2. System finds and adds product to cart
3. Also works with partial names or barcodes

### Managing Existing Products
1. Go to Dashboard
2. If products without codes exist, see alert
3. Click "Generate Product Codes"
4. System generates codes for all products

## Technical Details

### Code Generation Algorithm
```javascript
// Example for "Basmati Rice 1kg"
1. Clean name: "BASMATI RICE 1KG"
2. Split words: ["BASMATI", "RICE", "1KG"]
3. Remove common words: ["BASMATI", "RICE"]
4. Generate prefix: "BASMAT" (first 6 chars of first word)
5. Find next number: Check existing codes, use 001
6. Final code: "BASMAT001"
```

### Validation Rules
- **Length**: 6-9 characters total
- **Format**: Letters followed by numbers
- **Uniqueness**: No duplicate codes allowed
- **Characters**: Only A-Z and 0-9

### Database Schema
Products now include a `code` field:
```javascript
{
  id: "firebase_generated_id",
  name: "Basmati Rice 1kg",
  price: 150,
  stock: 50,
  code: "BASMAT001", // New field
  barcode: "78011234567" // Optional barcode
}
```

## Benefits

### For Users
- **Fast Search**: Type `RICE001` instead of "Basmati Rice 1kg"
- **Easy Memory**: Short, meaningful codes
- **No Typos**: Exact code matching
- **Multiple Options**: Search by code, name, or barcode

### For Business
- **Inventory Management**: Quick product identification
- **Staff Training**: Easy to remember codes
- **Error Reduction**: Less typing, fewer mistakes
- **Scalability**: Works with thousands of products

### For System
- **Performance**: Fast database lookups
- **Consistency**: Standardized product identification
- **Integration**: Works with barcode system
- **Maintenance**: Easy to manage and update

## Best Practices

### Code Generation
1. **Meaningful Prefixes**: Use recognizable abbreviations
2. **Consistent Format**: Maintain same pattern across products
3. **Avoid Conflicts**: Check for existing codes
4. **Document Changes**: Keep track of code assignments

### Usage
1. **Train Staff**: Teach common product codes
2. **Display Codes**: Show codes on product labels/shelves
3. **Regular Updates**: Generate codes for new products
4. **Backup Data**: Export code lists regularly

## Future Enhancements

1. **Custom Prefixes**: Allow manual prefix definition
2. **Category Codes**: Include category in code format
3. **Import/Export**: Bulk code management tools
4. **Analytics**: Track most-used codes
5. **Integration**: Connect with external systems

## Troubleshooting

### Common Issues
1. **Duplicate Codes**: System prevents this automatically
2. **Invalid Format**: Validation ensures proper format
3. **Missing Codes**: Use bulk generation feature
4. **Search Not Working**: Check code spelling and format

### Solutions
1. **Regenerate Codes**: Use Dashboard action
2. **Manual Assignment**: Edit codes in Admin Panel
3. **Validation Check**: System shows validation errors
4. **Fallback Search**: System also searches by name

The product code system makes inventory management faster and more efficient while maintaining compatibility with existing barcode and search functionality.