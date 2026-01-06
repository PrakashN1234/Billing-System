import { addProduct } from '../services/firebaseService';

const sampleProducts = [
  { name: "Apple Fuji (kg)", price: 4.50, stock: 50 },
  { name: "Whole Milk 1L", price: 2.10, stock: 30 },
  { name: "Brown Bread", price: 1.80, stock: 20 },
  { name: "Pasta 500g", price: 1.25, stock: 100 },
  { name: "Eggs Dozen", price: 3.00, stock: 40 },
  { name: "Orange Juice 1L", price: 2.75, stock: 25 },
  { name: "Cheddar Cheese 200g", price: 3.50, stock: 15 },
  { name: "Chicken Breast (kg)", price: 7.20, stock: 60 },
  { name: "Rice 1kg", price: 1.90, stock: 80 },
  { name: "Banana (kg)", price: 3.00, stock: 70 },
  { name: "Yogurt 150g", price: 0.90, stock: 45 },
  { name: "Cereal Box", price: 4.00, stock: 35 },
  { name: "Butter 250g", price: 2.50, stock: 55 },
  { name: "Tomato Sauce 500g", price: 1.60, stock: 90 },
  { name: "Lettuce", price: 1.20, stock: 40 },
  { name: "Cucumber", price: 0.80, stock: 50 },
  { name: "Carrots (kg)", price: 1.50, stock: 60 },
  { name: "Potatoes (kg)", price: 2.00, stock: 70 },
  { name: "Onions (kg)", price: 1.30, stock: 80 },
  { name: "Garlic Bulb", price: 0.70, stock: 100 },
];

export const initializeInventory = async () => {
  try {
    console.log('🚀 Initializing inventory with sample data...');
    
    const addPromises = sampleProducts.map(product => addProduct(product));
    await Promise.all(addPromises);
    
    console.log('✅ Inventory initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing inventory:', error);
    throw error;
  }
};

// Also make it available globally for manual testing
window.initializeInventory = initializeInventory;