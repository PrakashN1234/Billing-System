import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Mail, Edit, Trash2, Plus, X, Save } from 'lucide-react';
import { 
  subscribeToStores, 
  addStore, 
  updateStore, 
  deleteStore, 
  initializeStores 
} from '../services/firebaseService';

const StoresView = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'Active',
    manager: ''
  });

  useEffect(() => {
    // Initialize default stores if none exist
    initializeStores();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStores(
      (storesData) => {
        setStores(storesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading stores:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'Active',
      manager: ''
    });
  };

  const handleAddStore = () => {
    resetForm();
    setEditingStore(null);
    setShowAddModal(true);
  };

  const handleEditStore = (store) => {
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      email: store.email,
      status: store.status,
      manager: store.manager
    });
    setEditingStore(store.id);
    setShowAddModal(true);
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await deleteStore(storeId);
        alert('Store deleted successfully!');
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Error deleting store. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address || !formData.phone || !formData.email || !formData.manager) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      if (editingStore) {
        // Update existing store
        await updateStore(editingStore, formData);
        alert('Store updated successfully!');
      } else {
        // Add new store
        await addStore(formData);
        alert('Store added successfully!');
      }

      setShowAddModal(false);
      resetForm();
      setEditingStore(null);
    } catch (error) {
      console.error('Error saving store:', error);
      
      // Show detailed error message
      let errorMessage = 'Error saving store. ';
      if (error.message.includes('Permission denied')) {
        errorMessage += 'Please check your Firebase permissions or try logging in again.';
      } else if (error.message.includes('unavailable')) {
        errorMessage += 'Database is currently unavailable. Please try again later.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    resetForm();
    setEditingStore(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="stores-view">
        <div className="loading-state">
          <Store size={48} />
          <p>Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stores-view">
      <div className="view-header">
        <h1>Stores Management</h1>
        <button className="btn-primary" onClick={handleAddStore}>
          <Plus size={20} />
          Add New Store
        </button>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <div className="store-header">
              <div className="store-icon">
                <Store size={24} />
              </div>
              <div className="store-actions">
                <button 
                  className="btn-icon"
                  onClick={() => handleEditStore(store)}
                  title="Edit Store"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon danger"
                  onClick={() => handleDeleteStore(store.id)}
                  title="Delete Store"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="store-content">
              <h3>{store.name}</h3>
              <div className="store-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{store.address}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{store.phone}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{store.email}</span>
                </div>
              </div>
              
              <div className="store-footer">
                <span className={`status ${store.status.toLowerCase()}`}>
                  {store.status}
                </span>
                <span className="manager">Manager: {store.manager}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Store Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingStore ? 'Edit Store' : 'Add New Store'}</h2>
              <button className="btn-close" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="store-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Store Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter store name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manager">Manager Name *</label>
                  <input
                    type="text"
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    placeholder="Enter manager name"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter store address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="store@mystore.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={16} />
                  {editingStore ? 'Update Store' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresView;