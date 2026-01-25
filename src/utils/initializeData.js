import { addProduct } from '../services/firebaseService';
import { collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { generateBulkProductCodes } from './productCodeGenerator';

const sampleProducts = [
  // Grains & Cereals (15 items)
  { name: "Basmati Rice 5kg", price: 12.99, stock: 50, category: "Grains & Cereals" },
  { name: "Brown Rice 1kg", price: 3.49, stock: 30, category: "Grains & Cereals" },
  { name: "Jasmine Rice 2kg", price: 6.99, stock: 40, category: "Grains & Cereals" },
  { name: "Wild Rice 500g", price: 8.99, stock: 20, category: "Grains & Cereals" },
  { name: "Wheat Flour 2kg", price: 2.99, stock: 60, category: "Grains & Cereals" },
  { name: "All Purpose Flour 5kg", price: 5.99, stock: 40, category: "Grains & Cereals" },
  { name: "Whole Wheat Flour 2kg", price: 3.99, stock: 35, category: "Grains & Cereals" },
  { name: "Quinoa 500g", price: 8.99, stock: 25, category: "Grains & Cereals" },
  { name: "Oats Rolled 1kg", price: 4.99, stock: 45, category: "Grains & Cereals" },
  { name: "Barley 500g", price: 3.49, stock: 30, category: "Grains & Cereals" },
  { name: "Bulgur Wheat 500g", price: 3.99, stock: 25, category: "Grains & Cereals" },
  { name: "Couscous 500g", price: 4.49, stock: 30, category: "Grains & Cereals" },
  { name: "Millet 500g", price: 4.99, stock: 20, category: "Grains & Cereals" },
  { name: "Buckwheat 500g", price: 5.49, stock: 20, category: "Grains & Cereals" },
  { name: "Semolina 1kg", price: 3.99, stock: 25, category: "Grains & Cereals" },

  // Fresh Fruits (20 items)
  { name: "Bananas 1kg", price: 2.49, stock: 100, category: "Fresh Fruits" },
  { name: "Apples Red 1kg", price: 4.99, stock: 80, category: "Fresh Fruits" },
  { name: "Apples Green 1kg", price: 4.99, stock: 70, category: "Fresh Fruits" },
  { name: "Oranges 1kg", price: 3.99, stock: 60, category: "Fresh Fruits" },
  { name: "Lemons 500g", price: 2.99, stock: 50, category: "Fresh Fruits" },
  { name: "Limes 500g", price: 3.49, stock: 40, category: "Fresh Fruits" },
  { name: "Grapes Green 500g", price: 5.99, stock: 35, category: "Fresh Fruits" },
  { name: "Grapes Red 500g", price: 6.49, stock: 30, category: "Fresh Fruits" },
  { name: "Mangoes Each", price: 2.99, stock: 40, category: "Fresh Fruits" },
  { name: "Strawberries 250g", price: 4.49, stock: 25, category: "Fresh Fruits" },
  { name: "Blueberries 125g", price: 5.99, stock: 20, category: "Fresh Fruits" },
  { name: "Raspberries 125g", price: 6.99, stock: 15, category: "Fresh Fruits" },
  { name: "Pineapple Each", price: 3.99, stock: 20, category: "Fresh Fruits" },
  { name: "Watermelon Each", price: 6.99, stock: 15, category: "Fresh Fruits" },
  { name: "Cantaloupe Each", price: 4.99, stock: 18, category: "Fresh Fruits" },
  { name: "Kiwi Fruit 6pk", price: 4.49, stock: 25, category: "Fresh Fruits" },
  { name: "Peaches 1kg", price: 5.99, stock: 30, category: "Fresh Fruits" },
  { name: "Pears 1kg", price: 4.99, stock: 35, category: "Fresh Fruits" },
  { name: "Plums 500g", price: 4.49, stock: 25, category: "Fresh Fruits" },
  { name: "Avocados 4pk", price: 5.99, stock: 40, category: "Fresh Fruits" },

  // Fresh Vegetables (25 items)
  { name: "Tomatoes 1kg", price: 3.49, stock: 80, category: "Fresh Vegetables" },
  { name: "Cherry Tomatoes 250g", price: 3.99, stock: 40, category: "Fresh Vegetables" },
  { name: "Onions Yellow 1kg", price: 1.99, stock: 100, category: "Fresh Vegetables" },
  { name: "Onions Red 500g", price: 2.49, stock: 50, category: "Fresh Vegetables" },
  { name: "Onions White 500g", price: 2.29, stock: 45, category: "Fresh Vegetables" },
  { name: "Potatoes 2kg", price: 3.99, stock: 90, category: "Fresh Vegetables" },
  { name: "Sweet Potatoes 1kg", price: 4.49, stock: 40, category: "Fresh Vegetables" },
  { name: "Carrots 1kg", price: 2.49, stock: 70, category: "Fresh Vegetables" },
  { name: "Baby Carrots 500g", price: 3.49, stock: 35, category: "Fresh Vegetables" },
  { name: "Bell Peppers Red 500g", price: 5.99, stock: 30, category: "Fresh Vegetables" },
  { name: "Bell Peppers Green 500g", price: 4.99, stock: 35, category: "Fresh Vegetables" },
  { name: "Bell Peppers Yellow 500g", price: 5.49, stock: 25, category: "Fresh Vegetables" },
  { name: "Cucumber Each", price: 1.49, stock: 60, category: "Fresh Vegetables" },
  { name: "Zucchini Each", price: 1.99, stock: 40, category: "Fresh Vegetables" },
  { name: "Lettuce Iceberg", price: 2.99, stock: 35, category: "Fresh Vegetables" },
  { name: "Lettuce Romaine", price: 3.49, stock: 30, category: "Fresh Vegetables" },
  { name: "Spinach 250g", price: 2.49, stock: 45, category: "Fresh Vegetables" },
  { name: "Kale 200g", price: 3.99, stock: 25, category: "Fresh Vegetables" },
  { name: "Broccoli Each", price: 3.49, stock: 30, category: "Fresh Vegetables" },
  { name: "Cauliflower Each", price: 3.99, stock: 25, category: "Fresh Vegetables" },
  { name: "Cabbage Each", price: 2.99, stock: 20, category: "Fresh Vegetables" },
  { name: "Brussels Sprouts 500g", price: 4.99, stock: 20, category: "Fresh Vegetables" },
  { name: "Celery Bunch", price: 2.99, stock: 25, category: "Fresh Vegetables" },
  { name: "Mushrooms 250g", price: 3.99, stock: 40, category: "Fresh Vegetables" },
  { name: "Garlic Bulb", price: 0.99, stock: 80, category: "Fresh Vegetables" },

  // Dairy & Eggs (15 items)
  { name: "Whole Milk 1L", price: 2.99, stock: 120, category: "Dairy & Eggs" },
  { name: "Whole Milk 2L", price: 4.99, stock: 80, category: "Dairy & Eggs" },
  { name: "Low Fat Milk 1L", price: 2.99, stock: 100, category: "Dairy & Eggs" },
  { name: "Skim Milk 1L", price: 2.89, stock: 90, category: "Dairy & Eggs" },
  { name: "Almond Milk 1L", price: 4.99, stock: 40, category: "Dairy & Eggs" },
  { name: "Soy Milk 1L", price: 4.49, stock: 35, category: "Dairy & Eggs" },
  { name: "Greek Yogurt 500g", price: 4.99, stock: 50, category: "Dairy & Eggs" },
  { name: "Natural Yogurt 1kg", price: 3.99, stock: 40, category: "Dairy & Eggs" },
  { name: "Cheddar Cheese 200g", price: 5.99, stock: 40, category: "Dairy & Eggs" },
  { name: "Mozzarella Cheese 250g", price: 6.49, stock: 35, category: "Dairy & Eggs" },
  { name: "Parmesan Cheese 100g", price: 7.99, stock: 25, category: "Dairy & Eggs" },
  { name: "Butter Salted 250g", price: 4.49, stock: 60, category: "Dairy & Eggs" },
  { name: "Butter Unsalted 250g", price: 4.49, stock: 50, category: "Dairy & Eggs" },
  { name: "Eggs Large Dozen", price: 3.99, stock: 80, category: "Dairy & Eggs" },
  { name: "Cream Cheese 200g", price: 3.99, stock: 30, category: "Dairy & Eggs" },

  // Meat & Poultry (15 items)
  { name: "Chicken Breast 1kg", price: 12.99, stock: 50, category: "Meat & Poultry" },
  { name: "Chicken Thighs 1kg", price: 9.99, stock: 45, category: "Meat & Poultry" },
  { name: "Chicken Wings 1kg", price: 8.99, stock: 40, category: "Meat & Poultry" },
  { name: "Whole Chicken 1.5kg", price: 11.99, stock: 25, category: "Meat & Poultry" },
  { name: "Ground Beef 500g", price: 8.99, stock: 40, category: "Meat & Poultry" },
  { name: "Beef Steak 500g", price: 18.99, stock: 20, category: "Meat & Poultry" },
  { name: "Beef Roast 1kg", price: 24.99, stock: 15, category: "Meat & Poultry" },
  { name: "Pork Chops 1kg", price: 14.99, stock: 30, category: "Meat & Poultry" },
  { name: "Pork Shoulder 1kg", price: 12.99, stock: 25, category: "Meat & Poultry" },
  { name: "Bacon 250g", price: 6.99, stock: 50, category: "Meat & Poultry" },
  { name: "Ham Slices 200g", price: 5.99, stock: 35, category: "Meat & Poultry" },
  { name: "Turkey Slices 200g", price: 6.99, stock: 30, category: "Meat & Poultry" },
  { name: "Salmon Fillet 500g", price: 16.99, stock: 25, category: "Meat & Poultry" },
  { name: "Tuna Steaks 300g", price: 14.99, stock: 20, category: "Meat & Poultry" },
  { name: "Shrimp 500g", price: 19.99, stock: 15, category: "Meat & Poultry" },

  // Bakery (12 items)
  { name: "White Bread Loaf", price: 2.49, stock: 60, category: "Bakery" },
  { name: "Whole Wheat Bread", price: 2.99, stock: 50, category: "Bakery" },
  { name: "Multigrain Bread", price: 3.49, stock: 40, category: "Bakery" },
  { name: "Sourdough Bread", price: 4.99, stock: 30, category: "Bakery" },
  { name: "Croissants 6pk", price: 4.99, stock: 25, category: "Bakery" },
  { name: "Bagels Plain 6pk", price: 3.99, stock: 30, category: "Bakery" },
  { name: "Bagels Everything 6pk", price: 4.49, stock: 25, category: "Bakery" },
  { name: "Dinner Rolls 8pk", price: 2.99, stock: 35, category: "Bakery" },
  { name: "Hamburger Buns 8pk", price: 3.49, stock: 40, category: "Bakery" },
  { name: "Hot Dog Buns 8pk", price: 3.29, stock: 35, category: "Bakery" },
  { name: "Muffins Blueberry 4pk", price: 5.99, stock: 20, category: "Bakery" },
  { name: "Donuts Glazed 6pk", price: 4.99, stock: 25, category: "Bakery" },

  // Canned Goods (20 items)
  { name: "Tomato Sauce 400g", price: 1.99, stock: 100, category: "Canned Goods" },
  { name: "Diced Tomatoes 400g", price: 2.29, stock: 80, category: "Canned Goods" },
  { name: "Tomato Paste 200g", price: 1.49, stock: 60, category: "Canned Goods" },
  { name: "Coconut Milk 400ml", price: 2.99, stock: 50, category: "Canned Goods" },
  { name: "Chickpeas 400g", price: 1.49, stock: 70, category: "Canned Goods" },
  { name: "Black Beans 400g", price: 1.59, stock: 60, category: "Canned Goods" },
  { name: "Kidney Beans 400g", price: 1.59, stock: 55, category: "Canned Goods" },
  { name: "Lentils 400g", price: 1.79, stock: 50, category: "Canned Goods" },
  { name: "Tuna Can 185g", price: 2.99, stock: 80, category: "Canned Goods" },
  { name: "Salmon Can 210g", price: 4.99, stock: 40, category: "Canned Goods" },
  { name: "Sardines 120g", price: 2.49, stock: 45, category: "Canned Goods" },
  { name: "Corn Kernels 400g", price: 1.99, stock: 60, category: "Canned Goods" },
  { name: "Green Beans 400g", price: 1.89, stock: 50, category: "Canned Goods" },
  { name: "Peas 400g", price: 1.79, stock: 55, category: "Canned Goods" },
  { name: "Mushrooms 400g", price: 2.49, stock: 40, category: "Canned Goods" },
  { name: "Pineapple Chunks 400g", price: 2.99, stock: 35, category: "Canned Goods" },
  { name: "Peaches 400g", price: 2.79, stock: 30, category: "Canned Goods" },
  { name: "Chicken Broth 1L", price: 2.99, stock: 40, category: "Canned Goods" },
  { name: "Vegetable Broth 1L", price: 2.89, stock: 35, category: "Canned Goods" },
  { name: "Beef Broth 1L", price: 3.29, stock: 30, category: "Canned Goods" },

  // Pasta & Noodles (10 items)
  { name: "Spaghetti 500g", price: 2.49, stock: 80, category: "Pasta & Noodles" },
  { name: "Penne Pasta 500g", price: 2.49, stock: 70, category: "Pasta & Noodles" },
  { name: "Fusilli 500g", price: 2.59, stock: 60, category: "Pasta & Noodles" },
  { name: "Linguine 500g", price: 2.69, stock: 50, category: "Pasta & Noodles" },
  { name: "Macaroni 500g", price: 2.39, stock: 65, category: "Pasta & Noodles" },
  { name: "Lasagna Sheets 250g", price: 3.49, stock: 30, category: "Pasta & Noodles" },
  { name: "Instant Noodles 5pk", price: 3.99, stock: 60, category: "Pasta & Noodles" },
  { name: "Rice Noodles 400g", price: 3.49, stock: 40, category: "Pasta & Noodles" },
  { name: "Egg Noodles 300g", price: 2.99, stock: 35, category: "Pasta & Noodles" },
  { name: "Whole Wheat Pasta 500g", price: 3.49, stock: 40, category: "Pasta & Noodles" },

  // Beverages (15 items)
  { name: "Orange Juice 1L", price: 4.99, stock: 60, category: "Beverages" },
  { name: "Apple Juice 1L", price: 4.49, stock: 50, category: "Beverages" },
  { name: "Cranberry Juice 1L", price: 5.49, stock: 30, category: "Beverages" },
  { name: "Grape Juice 1L", price: 4.99, stock: 35, category: "Beverages" },
  { name: "Coca Cola 2L", price: 3.99, stock: 80, category: "Beverages" },
  { name: "Pepsi 2L", price: 3.89, stock: 70, category: "Beverages" },
  { name: "Sprite 2L", price: 3.79, stock: 60, category: "Beverages" },
  { name: "Sparkling Water 1L", price: 2.49, stock: 70, category: "Beverages" },
  { name: "Still Water 1.5L", price: 1.99, stock: 100, category: "Beverages" },
  { name: "Green Tea Bags 25pk", price: 5.99, stock: 40, category: "Beverages" },
  { name: "Black Tea Bags 25pk", price: 4.99, stock: 45, category: "Beverages" },
  { name: "Coffee Beans 500g", price: 12.99, stock: 30, category: "Beverages" },
  { name: "Instant Coffee 200g", price: 8.99, stock: 35, category: "Beverages" },
  { name: "Energy Drink 250ml", price: 2.99, stock: 50, category: "Beverages" },
  { name: "Sports Drink 500ml", price: 2.49, stock: 40, category: "Beverages" },

  // Snacks (15 items)
  { name: "Potato Chips Original 150g", price: 3.49, stock: 80, category: "Snacks" },
  { name: "Potato Chips BBQ 150g", price: 3.49, stock: 70, category: "Snacks" },
  { name: "Tortilla Chips 200g", price: 3.99, stock: 60, category: "Snacks" },
  { name: "Pretzels 250g", price: 4.49, stock: 40, category: "Snacks" },
  { name: "Popcorn 100g", price: 2.99, stock: 50, category: "Snacks" },
  { name: "Mixed Nuts 200g", price: 6.99, stock: 45, category: "Snacks" },
  { name: "Almonds 250g", price: 8.99, stock: 30, category: "Snacks" },
  { name: "Cashews 200g", price: 9.99, stock: 25, category: "Snacks" },
  { name: "Peanuts 300g", price: 4.99, stock: 40, category: "Snacks" },
  { name: "Trail Mix 250g", price: 7.99, stock: 35, category: "Snacks" },
  { name: "Chocolate Bar Milk 100g", price: 2.99, stock: 100, category: "Snacks" },
  { name: "Chocolate Bar Dark 100g", price: 3.49, stock: 80, category: "Snacks" },
  { name: "Crackers 200g", price: 3.99, stock: 50, category: "Snacks" },
  { name: "Granola Bars 6pk", price: 5.99, stock: 40, category: "Snacks" },
  { name: "Cookies Chocolate Chip 300g", price: 4.99, stock: 45, category: "Snacks" }
];

export const clearAllInventory = async () => {
  try {
    console.log('�️ Clearing existing inventory...');
    
    // Get all existing inventory items
    const inventoryRef = collection(db, 'inventory');
    const snapshot = await getDocs(inventoryRef);
    
    if (snapshot.empty) {
      console.log('✅ No existing inventory to clear');
      return { success: true, cleared: 0 };
    }
    
    // Delete all existing items in batches
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`✅ Cleared ${snapshot.size} existing inventory items`);
    return { success: true, cleared: snapshot.size };
  } catch (error) {
    console.error('❌ Error clearing inventory:', error);
    throw error;
  }
};

export const initializeInventory = async (clearFirst = false) => {
  try {
    console.log(`🚀 Starting inventory initialization with ${sampleProducts.length} products...`);
    
    // Clear existing inventory if requested
    if (clearFirst) {
      await clearAllInventory();
      // Wait a moment for the deletion to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate smart product codes for all products
    console.log('🏷️ Generating smart product codes...');
    const productsWithCodes = generateBulkProductCodes(sampleProducts);
    console.log('✅ Product codes generated successfully!');
    
    // Add products in batches for better performance
    const batchSize = 8;
    let addedCount = 0;
    const results = [];
    
    for (let i = 0; i < productsWithCodes.length; i += batchSize) {
      const batch = productsWithCodes.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(productsWithCodes.length/batchSize)} (${batch.length} products)...`);
      
      const promises = batch.map((product, index) => {
        const productData = {
          ...product,
          storeId: 'store_001',
          supplier: 'Default Supplier',
          sku: `SKU${String(i + index + 1).padStart(4, '0')}`, // Keep SKU for internal tracking
          // code is already generated by generateBulkProductCodes
        };
        
        console.log(`  📝 Adding: ${product.name} → Code: ${product.code}`);
        return addProduct(productData);
      });
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      addedCount += batch.length;
      
      console.log(`✅ Batch complete! Added ${addedCount}/${productsWithCodes.length} products total`);
      
      // Small delay between batches to prevent overwhelming Firebase
      if (i + batchSize < productsWithCodes.length) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    
    // Show sample of generated codes
    const sampleCodes = productsWithCodes.slice(0, 10).map(p => ({
      name: p.name,
      code: p.code
    }));
    
    console.log(`🎉 Successfully added all ${productsWithCodes.length} supermarket products!`);
    console.log(`📊 Product categories added:`, [...new Set(productsWithCodes.map(p => p.category))]);
    console.log('🏷️ Sample product codes generated:');
    console.table(sampleCodes);
    
    return { 
      success: true, 
      count: productsWithCodes.length,
      categories: [...new Set(productsWithCodes.map(p => p.category))].length,
      sampleCodes: sampleCodes,
      results: results
    };
  } catch (error) {
    console.error('❌ Error adding supermarket inventory:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Test function to preview product codes
export const previewProductCodes = () => {
  console.log('🔍 Previewing product codes for sample products...');
  
  const samplePreview = sampleProducts.slice(0, 20); // First 20 products
  const withCodes = generateBulkProductCodes(samplePreview);
  
  const preview = withCodes.map(p => ({
    'Product Name': p.name,
    'Generated Code': p.code,
    'Category': p.category
  }));
  
  console.table(preview);
  
  return preview;
};

// Function to update existing products with proper codes
export const updateExistingProductCodes = async () => {
  try {
    console.log('🔄 Updating existing products with smart product codes...');
    
    // Get all existing products
    const inventoryRef = collection(db, 'inventory');
    const snapshot = await getDocs(inventoryRef);
    
    if (snapshot.empty) {
      console.log('ℹ️ No existing products to update');
      return { success: true, updated: 0 };
    }
    
    const existingProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📦 Found ${existingProducts.length} existing products`);
    
    // Generate new codes for existing products
    const productsWithNewCodes = generateBulkProductCodes(existingProducts);
    
    // Delete old products and add with new codes
    console.log('🗑️ Removing old products...');
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Wait for deletion to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('➕ Adding products with new codes...');
    let updatedCount = 0;
    const batchSize = 8;
    
    for (let i = 0; i < productsWithNewCodes.length; i += batchSize) {
      const batch = productsWithNewCodes.slice(i, i + batchSize);
      
      const promises = batch.map(async (product) => {
        const docRef = doc(inventoryRef, product.code);
        await setDoc(docRef, {
          ...product,
          id: product.code,
          updatedAt: serverTimestamp()
        });
        console.log(`  ✅ Updated: ${product.name} → ${product.code}`);
        return product.code;
      });
      
      await Promise.all(promises);
      updatedCount += batch.length;
      
      console.log(`📊 Updated ${updatedCount}/${productsWithNewCodes.length} products`);
      
      // Small delay between batches
      if (i + batchSize < productsWithNewCodes.length) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} products with smart codes!`);
    
    // Show sample of updated codes
    const sampleCodes = productsWithNewCodes.slice(0, 10).map(p => ({
      name: p.name,
      oldId: existingProducts.find(ep => ep.name === p.name)?.id || 'N/A',
      newCode: p.code
    }));
    
    console.log('🏷️ Sample code updates:');
    console.table(sampleCodes);
    
    return {
      success: true,
      updated: updatedCount,
      sampleCodes: sampleCodes
    };
    
  } catch (error) {
    console.error('❌ Error updating product codes:', error);
    throw error;
  }
};

// Also make functions available globally for manual testing
window.initializeInventory = initializeInventory;
window.clearAllInventory = clearAllInventory;
window.previewProductCodes = previewProductCodes;
window.updateExistingProductCodes = updateExistingProductCodes;