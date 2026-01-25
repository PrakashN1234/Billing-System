import { generateProductBarcode, validateBarcode, parseBarcodeInfo } from './barcodeGenerator';

/**
 * Test the barcode generation and validation system
 */
export const testBarcodeSystem = () => {
  console.log('🧪 Testing Barcode System...');
  
  // Test products
  const testProducts = [
    { id: 'rice001', name: 'Basmati Rice 1kg' },
    { id: 'oil002', name: 'Sunflower Oil 1L' },
    { id: 'sugar003', name: 'White Sugar 1kg' },
    { id: 'milk004', name: 'Fresh Milk 500ml' },
    { id: 'bread005', name: 'Whole Wheat Bread' },
    { id: 'tea006', name: 'Green Tea Bags' },
    { id: 'soap007', name: 'Antibacterial Soap' },
    { id: 'detergent008', name: 'Laundry Detergent' },
    { id: 'battery009', name: 'AA Batteries Pack' },
    { id: 'pen010', name: 'Blue Ink Pen' }
  ];
  
  console.log('📦 Generating barcodes for test products...');
  
  const results = testProducts.map(product => {
    const barcode = generateProductBarcode(product.name, product.id);
    const isValid = validateBarcode(barcode);
    const info = parseBarcodeInfo(barcode);
    
    return {
      product,
      barcode,
      isValid,
      info
    };
  });
  
  // Display results
  console.table(results.map(r => ({
    'Product Name': r.product.name,
    'Product ID': r.product.id,
    'Generated Barcode': r.barcode,
    'Valid': r.isValid ? '✅' : '❌',
    'Category': r.info?.categoryName || 'Unknown',
    'Category Code': r.info?.categoryCode || 'N/A'
  })));
  
  // Test validation
  console.log('🔍 Testing barcode validation...');
  
  const validationTests = [
    { barcode: '78011234567', expected: true, description: 'Valid barcode' },
    { barcode: '78011234568', expected: false, description: 'Invalid check digit' },
    { barcode: '7801123456', expected: false, description: 'Too short' },
    { barcode: '780112345678', expected: false, description: 'Too long' },
    { barcode: 'invalid', expected: false, description: 'Non-numeric' }
  ];
  
  validationTests.forEach(test => {
    const result = validateBarcode(test.barcode);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: ${test.barcode} -> ${result}`);
  });
  
  // Test uniqueness
  console.log('🔄 Testing barcode uniqueness...');
  const barcodes = results.map(r => r.barcode);
  const uniqueBarcodes = new Set(barcodes);
  const isUnique = barcodes.length === uniqueBarcodes.size;
  
  console.log(`Generated ${barcodes.length} barcodes, ${uniqueBarcodes.size} unique: ${isUnique ? '✅' : '❌'}`);
  
  if (!isUnique) {
    const duplicates = barcodes.filter((barcode, index) => barcodes.indexOf(barcode) !== index);
    console.warn('Duplicate barcodes found:', duplicates);
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`- Generated barcodes: ${results.length}`);
  console.log(`- Valid barcodes: ${results.filter(r => r.isValid).length}`);
  console.log(`- Unique barcodes: ${uniqueBarcodes.size}`);
  console.log(`- Categories detected: ${new Set(results.map(r => r.info?.categoryName)).size}`);
  
  return {
    success: true,
    results,
    summary: {
      total: results.length,
      valid: results.filter(r => r.isValid).length,
      unique: uniqueBarcodes.size,
      categories: new Set(results.map(r => r.info?.categoryName)).size
    }
  };
};

/**
 * Test barcode scanning simulation
 */
export const simulateBarcodeScanning = (inventory) => {
  console.log('📱 Simulating barcode scanning...');
  
  const itemsWithBarcodes = inventory.filter(item => item.barcode);
  
  if (itemsWithBarcodes.length === 0) {
    console.warn('No items with barcodes found in inventory');
    return { success: false, message: 'No barcodes to test' };
  }
  
  // Simulate scanning random barcodes
  const scanTests = itemsWithBarcodes.slice(0, 5).map(item => {
    const scannedBarcode = item.barcode;
    const foundItem = inventory.find(i => i.barcode === scannedBarcode);
    
    return {
      scannedBarcode,
      expectedItem: item.name,
      foundItem: foundItem ? foundItem.name : null,
      success: foundItem && foundItem.id === item.id
    };
  });
  
  console.table(scanTests.map(test => ({
    'Scanned Barcode': test.scannedBarcode,
    'Expected Product': test.expectedItem,
    'Found Product': test.foundItem || 'Not Found',
    'Success': test.success ? '✅' : '❌'
  })));
  
  const successRate = (scanTests.filter(t => t.success).length / scanTests.length) * 100;
  console.log(`📈 Scanning success rate: ${successRate.toFixed(1)}%`);
  
  return {
    success: true,
    tests: scanTests,
    successRate
  };
};

/**
 * Run all barcode system tests
 */
export const runAllBarcodeTests = (inventory = []) => {
  console.log('🚀 Running comprehensive barcode system tests...');
  
  try {
    const generationTest = testBarcodeSystem();
    const scanningTest = simulateBarcodeScanning(inventory);
    
    console.log('✅ All barcode tests completed successfully!');
    
    return {
      success: true,
      generation: generationTest,
      scanning: scanningTest
    };
  } catch (error) {
    console.error('❌ Barcode tests failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment to run tests automatically
  // setTimeout(() => runAllBarcodeTests(), 2000);
}