import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

// Inventory Management
export const getInventory = async () => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const snapshot = await getDocs(inventoryRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const docRef = await addDoc(inventoryRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, 'inventory', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'inventory', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Real-time inventory listener
export const subscribeToInventory = (callback, errorCallback) => {
  const inventoryRef = collection(db, 'inventory');
  return onSnapshot(
    inventoryRef, 
    (snapshot) => {
      const inventory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(inventory);
    },
    (error) => {
      console.error('Inventory subscription error:', error);
      if (errorCallback) errorCallback(error);
    }
  );
};

// Sales Management
export const saveSale = async (saleData) => {
  try {
    const salesRef = collection(db, 'sales');
    const docRef = await addDoc(salesRef, {
      ...saleData,
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split('T')[0]
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving sale:', error);
    throw error;
  }
};

export const getSales = async (limitCount = 50) => {
  try {
    const salesRef = collection(db, 'sales');
    const q = query(salesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

// Update stock after sale
export const updateStock = async (items) => {
  try {
    const updatePromises = items.map(async (item) => {
      const productRef = doc(db, 'inventory', item.id);
      await updateDoc(productRef, {
        stock: item.newStock,
        updatedAt: serverTimestamp()
      });
    });
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};