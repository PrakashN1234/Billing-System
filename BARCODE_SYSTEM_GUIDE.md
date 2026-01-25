# Barcode System Guide

## Overview
The billing system now includes a comprehensive barcode generation and scanning system that allows you to:
- Generate unique barcodes for all inventory items
- Scan barcodes using your device camera
- Search products by barcode in the billing system

## How It Works

### 1. Barcode Generation
- **Format**: 11-digit barcodes (Store prefix + Category + Sequence + Check digit)
- **Example**: `78011234567`
  - `78` = Store prefix
  - `01` = Category code (Grains & Cereals)
  - `123456` = Product sequence
  - `7` = Check digit for validation

### 2. Category Codes
The system automatically assigns category codes based on product names:
- `01` - Grains & Cereals (rice, wheat, flour)
- `02` - Oils & Fats (oil, ghee, butter)
- `03` - Spices & Condiments (sugar, salt, spice)
- `04` - Dairy Products (milk, yogurt, cheese)
- `05` - Bakery Items (bread, biscuit, cake)
- `06` - Beverages (tea, coffee, juice)
- `10` - Personal Care (soap, shampoo, toothpaste)
- `11` - Cosmetics (cream, lotion, powder)
- `20` - Household Cleaning (detergent, cleaner, brush)
- `21` - Paper Products (tissue, paper, napkin)
- `30` - Electronics (battery, bulb, wire)
- `40` - Stationery (pen, pencil, notebook)
- `99` - Miscellaneous (everything else)

## Using the Barcode System

### Dashboard
1. **View Barcode Statistics**: See how many products have barcodes
2. **Generate All Barcodes**: Quick action to generate barcodes for all products
3. **Manage Barcodes**: Access the barcode management interface

### Barcode Manager
1. **Access**: Dashboard → Quick Actions → "Manage Barcodes"
2. **Features**:
   - View all products with/without barcodes
   - Generate barcodes individually or in bulk
   - View and download barcode images
   - Export barcode list as CSV

### Billing System
1. **Barcode Scanning**: 
   - Click "Open Scanner" to use camera
   - Position barcode within the scanning frame
   - System automatically detects and adds product to cart

2. **Manual Entry**:
   - Enter barcode number manually if scanning fails
   - System searches by barcode, product ID, or name

## Troubleshooting

### Scanner Not Working
1. **Camera Permission**: Ensure browser has camera access
2. **HTTPS Required**: Camera only works on secure connections
3. **Lighting**: Ensure good lighting for barcode scanning
4. **Distance**: Try different distances from the barcode

### Barcode Not Found
1. **Check Generation**: Ensure barcode was generated for the product
2. **Manual Entry**: Try entering the barcode manually
3. **Product Search**: System also searches by product name/ID

### Common Issues
1. **Duplicate Barcodes**: System prevents duplicate barcode generation
2. **Invalid Format**: Only 11-digit barcodes are accepted
3. **Missing Products**: Ensure product exists in inventory

## Technical Details

### Libraries Used
- `jsbarcode`: Barcode generation and rendering
- `react-qr-barcode-scanner`: Camera-based barcode scanning

### Database Schema
Products now include a `barcode` field:
```javascript
{
  id: "product_id",
  name: "Product Name",
  price: 100,
  stock: 50,
  barcode: "78011234567" // New field
}
```

### API Functions
- `generateUniqueBarcode()`: Creates unique barcode for product
- `validateBarcode()`: Validates barcode format and check digit
- `parseBarcodeInfo()`: Extracts information from barcode
- `generateBarcodesForInventory()`: Bulk barcode generation

## Best Practices

1. **Generate Barcodes Early**: Create barcodes when adding new products
2. **Regular Validation**: Check for duplicate or invalid barcodes
3. **Backup Barcodes**: Export barcode list regularly
4. **Test Scanning**: Verify barcodes scan correctly before printing
5. **Print Quality**: Use high-quality printers for barcode labels

## Future Enhancements

1. **Barcode Printing**: Direct integration with label printers
2. **Batch Operations**: Import/export barcode data
3. **Custom Formats**: Support for different barcode formats
4. **Mobile App**: Dedicated mobile scanning app
5. **Analytics**: Track scanning success rates and usage

## Support

If you encounter issues with the barcode system:
1. Check the browser console for error messages
2. Verify camera permissions in browser settings
3. Ensure you're using HTTPS for camera access
4. Try manual barcode entry if scanning fails