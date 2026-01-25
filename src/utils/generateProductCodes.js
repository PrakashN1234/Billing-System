import { generateUniqueProductCode } from './productCodeGenerator';
import { updateProduct } from '../services/firebaseService';

/**
 * Generate product codes for all inventory items that don't have them
 */
export const generateCodesForInventory = async (inventory) => {
  const itemsWithoutCodes = inventory.filter(item => !item.code);
  
  if (itemsWithoutCodes.length === 0) {
    console.log('All items already have product codes');
    return { success: true, updated: 0, message: 'All items already have product codes' };
  }

  console.log(`Generating product codes for ${itemsWithoutCodes.length} items...`);
  
  try {
    const updatePromises = itemsWithoutCodes.map(async (item) => {
      const code = generateUniqueProductCode(item.name, inventory);
      await updateProduct(item.id, { code });
      console.log(`Generated code ${code} for ${item.name}`);
      return { id: item.id, name: item.name, code };
    });

    const results = await Promise.all(updatePromises);
    
    return {
      success: true,
      updated: results.length,
      message: `Successfully generated product codes for ${results.length} items`,
      results
    };
  } catch (error) {
    console.error('Error generating product codes:', error);
    return {
      success: false,
      updated: 0,
      message: `Failed to generate product codes: ${error.message}`,
      error
    };
  }
};

/**
 * Generate a single product code for a specific item
 */
export const generateCodeForItem = async (item, inventory) => {
  try {
    const code = generateUniqueProductCode(item.name, inventory);
    await updateProduct(item.id, { code });
    
    return {
      success: true,
      code,
      message: `Generated product code ${code} for ${item.name}`
    };
  } catch (error) {
    console.error('Error generating product code for item:', error);
    return {
      success: false,
      message: `Failed to generate product code: ${error.message}`,
      error
    };
  }
};

/**
 * Validate that all product codes in inventory are unique
 */
export const validateInventoryProductCodes = (inventory) => {
  const codes = inventory
    .filter(item => item.code)
    .map(item => ({ id: item.id, name: item.name, code: item.code }));
  
  const duplicates = [];
  const seen = new Set();
  
  codes.forEach(item => {
    if (seen.has(item.code)) {
      duplicates.push(item);
    } else {
      seen.add(item.code);
    }
  });
  
  return {
    isValid: duplicates.length === 0,
    totalCodes: codes.length,
    duplicates,
    message: duplicates.length === 0 
      ? `All ${codes.length} product codes are unique`
      : `Found ${duplicates.length} duplicate product codes`
  };
};