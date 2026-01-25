/**
 * Generate unique product codes based on product names
 * Format: [PREFIX][NUMBER] (e.g., RICE001, SUGAR002)
 */

/**
 * Generate a product code prefix from product name
 * @param {string} productName - The product name
 * @returns {string} - The generated prefix (4-6 characters)
 */
export const generateProductPrefix = (productName) => {
  if (!productName || typeof productName !== 'string') {
    return 'PROD';
  }

  const name = productName.trim().toUpperCase();
  
  // Remove common words and get meaningful parts
  const commonWords = ['THE', 'AND', 'OR', 'OF', 'IN', 'ON', 'AT', 'TO', 'FOR', 'WITH', 'BY'];
  const words = name.split(/[\s\-_]+/).filter(word => 
    word.length > 0 && !commonWords.includes(word)
  );

  if (words.length === 0) {
    return 'PROD';
  }

  let prefix = '';

  if (words.length === 1) {
    // Single word: take first 4-6 characters
    const word = words[0].replace(/[^A-Z0-9]/g, '');
    prefix = word.substring(0, Math.min(6, Math.max(4, word.length)));
  } else if (words.length === 2) {
    // Two words: take first 2-3 chars from each
    const word1 = words[0].replace(/[^A-Z0-9]/g, '');
    const word2 = words[1].replace(/[^A-Z0-9]/g, '');
    prefix = word1.substring(0, 3) + word2.substring(0, 3);
  } else {
    // Multiple words: take first 1-2 chars from first few words
    prefix = words.slice(0, 3).map(word => {
      const clean = word.replace(/[^A-Z0-9]/g, '');
      return clean.substring(0, 2);
    }).join('');
  }

  // Ensure minimum length of 3 characters
  if (prefix.length < 3) {
    prefix = prefix.padEnd(3, 'X');
  }

  // Ensure maximum length of 6 characters
  if (prefix.length > 6) {
    prefix = prefix.substring(0, 6);
  }

  return prefix;
};

/**
 * Generate a unique product code
 * @param {string} productName - The product name
 * @param {Array} existingProducts - Array of existing products to check for uniqueness
 * @returns {string} - The generated unique product code
 */
export const generateUniqueProductCode = (productName, existingProducts = []) => {
  const prefix = generateProductPrefix(productName);
  
  // Get existing codes with the same prefix
  const existingCodes = existingProducts
    .map(product => product.id || product.code)
    .filter(code => code && code.startsWith(prefix))
    .map(code => {
      const match = code.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .sort((a, b) => a - b);

  // Find the next available number
  let nextNumber = 1;
  for (const num of existingCodes) {
    if (num === nextNumber) {
      nextNumber++;
    } else if (num > nextNumber) {
      break;
    }
  }

  // Format with leading zeros (3 digits)
  const numberPart = nextNumber.toString().padStart(3, '0');
  
  return `${prefix}${numberPart}`;
};

/**
 * Generate product codes for multiple products
 * @param {Array} products - Array of products with names
 * @returns {Array} - Array of products with generated codes
 */
export const generateBulkProductCodes = (products) => {
  const updatedProducts = [];
  const existingCodes = [];

  products.forEach(product => {
    const code = generateUniqueProductCode(product.name, [...updatedProducts, ...existingCodes]);
    const updatedProduct = {
      ...product,
      id: product.id || code, // Use existing ID if available, otherwise use generated code
      code: code
    };
    updatedProducts.push(updatedProduct);
    existingCodes.push({ id: code, code: code });
  });

  return updatedProducts;
};

/**
 * Validate product code format
 * @param {string} code - The product code to validate
 * @returns {boolean} - Whether the code is valid
 */
export const validateProductCode = (code) => {
  if (!code || typeof code !== 'string') {
    return false;
  }

  // Format: 3-6 letters followed by 3 digits
  const pattern = /^[A-Z]{3,6}\d{3}$/;
  return pattern.test(code.toUpperCase());
};

/**
 * Parse product code information
 * @param {string} code - The product code
 * @returns {Object} - Parsed information
 */
export const parseProductCode = (code) => {
  if (!validateProductCode(code)) {
    return null;
  }

  const upperCode = code.toUpperCase();
  const match = upperCode.match(/^([A-Z]{3,6})(\d{3})$/);
  
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    number: parseInt(match[2], 10),
    fullCode: upperCode
  };
};

/**
 * Suggest product codes based on name
 * @param {string} productName - The product name
 * @param {number} count - Number of suggestions to generate
 * @returns {Array} - Array of suggested codes
 */
export const suggestProductCodes = (productName, count = 3) => {
  const suggestions = [];
  const basePrefix = generateProductPrefix(productName);
  
  // Primary suggestion
  suggestions.push(`${basePrefix}001`);
  
  if (count > 1) {
    // Alternative prefixes
    const name = productName.trim().toUpperCase();
    const words = name.split(/[\s\-_]+/).filter(word => word.length > 0);
    
    if (words.length > 1) {
      // First letters of each word
      const acronym = words.map(word => word[0]).join('').substring(0, 4);
      if (acronym !== basePrefix && acronym.length >= 3) {
        suggestions.push(`${acronym.padEnd(4, 'X')}001`);
      }
      
      // Last word emphasis
      const lastWord = words[words.length - 1].substring(0, 4);
      if (lastWord !== basePrefix && lastWord.length >= 3) {
        suggestions.push(`${lastWord.padEnd(4, 'X')}001`);
      }
    }
  }
  
  // Fill remaining slots with variations
  while (suggestions.length < count) {
    const variation = basePrefix + (suggestions.length + 1).toString().padStart(3, '0');
    suggestions.push(variation);
  }
  
  return suggestions.slice(0, count);
};

/**
 * Test the product code generator with sample data
 */
export const testProductCodeGenerator = () => {
  const testProducts = [
    'Basmati Rice 1kg',
    'White Sugar 1kg',
    'Sunflower Oil 1L',
    'Fresh Milk 500ml',
    'Whole Wheat Bread',
    'Green Tea Bags',
    'Antibacterial Soap',
    'Laundry Detergent Powder',
    'AA Batteries Pack',
    'Blue Ink Pen Set',
    'Organic Brown Rice',
    'Refined Sugar',
    'Rice Flour',
    'Sugar Free Tablets'
  ];

  console.log('🧪 Testing Product Code Generator...');
  
  const results = testProducts.map(name => {
    const prefix = generateProductPrefix(name);
    const suggestions = suggestProductCodes(name, 2);
    return {
      name,
      prefix,
      suggestions
    };
  });

  console.table(results);

  // Test bulk generation
  const products = testProducts.map(name => ({ name }));
  const withCodes = generateBulkProductCodes(products);
  
  console.log('\n📦 Bulk Generated Codes:');
  console.table(withCodes.map(p => ({
    'Product Name': p.name,
    'Generated Code': p.code,
    'Valid': validateProductCode(p.code) ? '✅' : '❌'
  })));

  // Test uniqueness
  const codes = withCodes.map(p => p.code);
  const uniqueCodes = new Set(codes);
  console.log(`\n🔍 Uniqueness Test: ${codes.length} codes, ${uniqueCodes.size} unique (${codes.length === uniqueCodes.size ? '✅' : '❌'})`);

  return {
    results,
    withCodes,
    isUnique: codes.length === uniqueCodes.size
  };
};

// Export test function for development
if (process.env.NODE_ENV === 'development') {
  // Uncomment to run tests automatically
  // setTimeout(() => testProductCodeGenerator(), 1000);
}