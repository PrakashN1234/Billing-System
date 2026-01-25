import { generateUniqueBarcode } from './barcodeGenerator';
import { updateProduct } from '../services/firebaseService';

/**
 * Generate barcodes for all inventory items that don't have them
 */
export const generateBarcodesForInventory = async (inventory) => {
  const itemsWithoutBarcodes = inventory.filter(item => !item.barcode);
  
  if (itemsWithoutBarcodes.length === 0) {
    console.log('All items already have barcodes');
    return { success: true, updated: 0, message: 'All items already have barcodes' };
  }

  console.log(`Generating barcodes for ${itemsWithoutBarcodes.length} items...`);
  
  try {
    const updatePromises = itemsWithoutBarcodes.map(async (item) => {
      const barcode = generateUniqueBarcode(item.name, item.id, inventory);
      await updateProduct(item.id, { barcode });
      console.log(`Generated barcode ${barcode} for ${item.name}`);
      return { id: item.id, name: item.name, barcode };
    });

    const results = await Promise.all(updatePromises);
    
    return {
      success: true,
      updated: results.length,
      message: `Successfully generated barcodes for ${results.length} items`,
      results
    };
  } catch (error) {
    console.error('Error generating barcodes:', error);
    return {
      success: false,
      updated: 0,
      message: `Failed to generate barcodes: ${error.message}`,
      error
    };
  }
};

/**
 * Generate a single barcode for a specific item
 */
export const generateBarcodeForItem = async (item, inventory) => {
  try {
    const barcode = generateUniqueBarcode(item.name, item.id, inventory);
    await updateProduct(item.id, { barcode });
    
    return {
      success: true,
      barcode,
      message: `Generated barcode ${barcode} for ${item.name}`
    };
  } catch (error) {
    console.error('Error generating barcode for item:', error);
    return {
      success: false,
      message: `Failed to generate barcode: ${error.message}`,
      error
    };
  }
};

/**
 * Validate that all barcodes in inventory are unique
 */
export const validateInventoryBarcodes = (inventory) => {
  const barcodes = inventory
    .filter(item => item.barcode)
    .map(item => ({ id: item.id, name: item.name, barcode: item.barcode }));
  
  const duplicates = [];
  const seen = new Set();
  
  barcodes.forEach(item => {
    if (seen.has(item.barcode)) {
      duplicates.push(item);
    } else {
      seen.add(item.barcode);
    }
  });
  
  return {
    isValid: duplicates.length === 0,
    totalBarcodes: barcodes.length,
    duplicates,
    message: duplicates.length === 0 
      ? `All ${barcodes.length} barcodes are unique`
      : `Found ${duplicates.length} duplicate barcodes`
  };
};