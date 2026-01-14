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
// Stores Management
export const getStores = async () => {
  try {
    console.log('🔍 Fetching stores from Firestore...');
    const storesRef = collection(db, 'stores');
    const snapshot = await getDocs(storesRef);
    const stores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Stores fetched successfully:', stores.length);
    return stores;
  } catch (error) {
    console.error('❌ Error fetching stores:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const addStore = async (store) => {
  try {
    console.log('➕ Adding store to Firestore:', store);
    const storesRef = collection(db, 'stores');
    const docRef = await addDoc(storesRef, {
      ...store,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Store added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding store:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide user-friendly error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore is currently unavailable. Please try again later.');
    } else {
      throw new Error(`Failed to add store: ${error.message}`);
    }
  }
};

export const updateStore = async (storeId, updates) => {
  try {
    console.log('📝 Updating store:', storeId, updates);
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Store updated successfully');
  } catch (error) {
    console.error('❌ Error updating store:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else {
      throw new Error(`Failed to update store: ${error.message}`);
    }
  }
};

export const deleteStore = async (storeId) => {
  try {
    console.log('🗑️ Deleting store:', storeId);
    const storeRef = doc(db, 'stores', storeId);
    await deleteDoc(storeRef);
    console.log('✅ Store deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting store:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else {
      throw new Error(`Failed to delete store: ${error.message}`);
    }
  }
};

// Real-time stores listener
export const subscribeToStores = (callback, errorCallback) => {
  try {
    console.log('👂 Setting up stores listener...');
    const storesRef = collection(db, 'stores');
    return onSnapshot(
      storesRef, 
      (snapshot) => {
        const stores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('📡 Stores updated:', stores.length);
        callback(stores);
      },
      (error) => {
        console.error('❌ Stores subscription error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (errorCallback) errorCallback(error);
      }
    );
  } catch (error) {
    console.error('❌ Error setting up stores listener:', error);
    if (errorCallback) errorCallback(error);
  }
};

// Users Management
export const getUsers = async () => {
  try {
    console.log('🔍 Fetching users from Firestore...');
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Users fetched successfully:', users.length);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const addUser = async (user) => {
  try {
    console.log('➕ Adding user to Firestore:', { ...user, password: '[HIDDEN]' });
    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    });
    console.log('✅ User added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore is currently unavailable. Please try again later.');
    } else {
      throw new Error(`Failed to add user: ${error.message}`);
    }
  }
};

export const updateUser = async (userId, updates) => {
  try {
    console.log('📝 Updating user:', userId, { ...updates, password: '[HIDDEN]' });
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('✅ User updated successfully');
  } catch (error) {
    console.error('❌ Error updating user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
};

export const deleteUser = async (userId) => {
  try {
    console.log('🗑️ Deleting user:', userId);
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('✅ User deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
};

// Real-time users listener
export const subscribeToUsers = (callback, errorCallback) => {
  try {
    console.log('👂 Setting up users listener...');
    const usersRef = collection(db, 'users');
    return onSnapshot(
      usersRef, 
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('📡 Users updated:', users.length);
        callback(users);
      },
      (error) => {
        console.error('❌ Users subscription error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (errorCallback) errorCallback(error);
      }
    );
  } catch (error) {
    console.error('❌ Error setting up users listener:', error);
    if (errorCallback) errorCallback(error);
  }
};

// Initialize default data
export const initializeStores = async () => {
  try {
    console.log('🔧 Checking if stores need initialization...');
    const stores = await getStores();
    if (stores.length === 0) {
      console.log('📦 Initializing default store...');
      await addStore({
        name: 'My Store Main Branch',
        address: '321 Main Street, City',
        phone: '+91 9876543210',
        email: 'main@mystore.com',
        status: 'Active',
        manager: 'Store Manager'
      });
      console.log('✅ Default store initialized');
    } else {
      console.log('✅ Stores already exist, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Error initializing stores:', error);
    // Don't throw error here, just log it
  }
};

export const initializeUsers = async () => {
  try {
    console.log('🔧 Checking if users need initialization...');
    const users = await getUsers();
    if (users.length === 0) {
      console.log('📦 Initializing default users...');
      await addUser({
        name: 'Prakash N',
        email: 'prakashn1234@gmail.com',
        phone: '+91 9876543210',
        role: 'Administrator',
        status: 'Active',
        password: 'admin123'
      });
      
      await addUser({
        name: 'Demo User',
        email: 'demo@mystore.com',
        phone: '+91 9876543211',
        role: 'Cashier',
        status: 'Active',
        password: 'demo123'
      });
      
      console.log('✅ Default users initialized');
    } else {
      console.log('✅ Users already exist, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Error initializing users:', error);
    // Don't throw error here, just log it
  }
};