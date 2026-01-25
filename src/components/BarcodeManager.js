import { useState } from 'react';
import { 
  BarChart3, 
  RefreshCw, 
  Download, 
  Search, 
  Filter,
  Package,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import BarcodeDisplay from './BarcodeDisplay';
import { 
  generateUniqueBarcode,
  parseBarcodeInfo
} from '../utils/barcodeGenerator';
import { updateProduct } from '../services/firebaseService';

const BarcodeManager = ({ inventory, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'with-barcode' && item.barcode) ||
      (filterCategory === 'without-barcode' && !item.barcode);
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const stats = {
    total: inventory.length,
    withBarcode: inventory.filter(item => item.barcode).length,
    withoutBarcode: inventory.filter(item => !item.barcode).length,
    selected: selectedItems.length
  };

  const handleGenerateSingleBarcode = async (product) => {
    setIsGenerating(true);
    try {
      const barcode = generateUniqueBarcode(product.name, product.id, inventory);
      await updateProduct(product.id, { barcode });
      alert(`Barcode generated for ${product.name}: ${barcode}`);
      // Refresh would happen automatically due to real-time listeners
    } catch (error) {
      console.error('Error generating barcode:', error);
      alert('Failed to generate barcode');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBulkBarcodes = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to generate barcodes for');
      return;
    }

    const confirmed = window.confirm(
      `Generate barcodes for ${selectedItems.length} selected items?`
    );
    if (!confirmed) return;

    setIsGenerating(true);
    try {
      const updatePromises = selectedItems.map(async (itemId) => {
        const product = inventory.find(p => p.id === itemId);
        if (product && !product.barcode) {
          const barcode = generateUniqueBarcode(product.name, product.id, inventory);
          return updateProduct(product.id, { barcode });
        }
      });

      await Promise.all(updatePromises);
      alert(`Successfully generated barcodes for ${selectedItems.length} items!`);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error generating bulk barcodes:', error);
      alert('Failed to generate some barcodes');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateBarcode = async (product) => {
    const confirmed = window.confirm(
      `Regenerate barcode for ${product.name}? This will replace the existing barcode.`
    );
    if (!confirmed) return;

    setIsGenerating(true);
    try {
      const barcode = generateUniqueBarcode(product.name, product.id, inventory);
      await updateProduct(product.id, { barcode });
      alert(`New barcode generated for ${product.name}: ${barcode}`);
    } catch (error) {
      console.error('Error regenerating barcode:', error);
      alert('Failed to regenerate barcode');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const itemsWithoutBarcode = filteredInventory
      .filter(item => !item.barcode)
      .map(item => item.id);
    setSelectedItems(itemsWithoutBarcode);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleViewBarcode = (product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const exportBarcodeList = () => {
    const barcodeData = inventory
      .filter(item => item.barcode)
      .map(item => ({
        name: item.name,
        barcode: item.barcode,
        price: item.price,
        stock: item.stock
      }));

    const csvContent = [
      ['Product Name', 'Barcode', 'Price', 'Stock'],
      ...barcodeData.map(item => [item.name, item.barcode, item.price, item.stock])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode_list_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="barcode-manager-overlay">
      <div className="barcode-manager">
        <div className="manager-header">
          <div className="header-left">
            <BarChart3 size={24} />
            <div>
              <h2>Barcode Management</h2>
              <p>Generate and manage product barcodes</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Statistics */}
        <div className="barcode-stats">
          <div className="stat-card">
            <Package size={20} />
            <div>
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="stat-card success">
            <CheckCircle size={20} />
            <div>
              <span className="stat-number">{stats.withBarcode}</span>
              <span className="stat-label">With Barcode</span>
            </div>
          </div>
          <div className="stat-card warning">
            <AlertCircle size={20} />
            <div>
              <span className="stat-number">{stats.withoutBarcode}</span>
              <span className="stat-label">Without Barcode</span>
            </div>
          </div>
          <div className="stat-card info">
            <CheckCircle size={20} />
            <div>
              <span className="stat-number">{stats.selected}</span>
              <span className="stat-label">Selected</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="manager-controls">
          <div className="search-filter">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <Filter size={16} />
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Products</option>
                <option value="with-barcode">With Barcode</option>
                <option value="without-barcode">Without Barcode</option>
              </select>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-secondary"
              onClick={handleSelectAll}
              disabled={filteredInventory.filter(item => !item.barcode).length === 0}
            >
              Select All Missing
            </button>
            <button 
              className="btn-secondary"
              onClick={handleDeselectAll}
              disabled={selectedItems.length === 0}
            >
              Deselect All
            </button>
            <button 
              className="btn-primary"
              onClick={handleGenerateBulkBarcodes}
              disabled={selectedItems.length === 0 || isGenerating}
            >
              {isGenerating ? <RefreshCw size={16} className="spinning" /> : <BarChart3 size={16} />}
              Generate Selected ({selectedItems.length})
            </button>
            <button 
              className="btn-export"
              onClick={exportBarcodeList}
              disabled={stats.withBarcode === 0}
            >
              <Download size={16} />
              Export List
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="products-list">
          <div className="list-header">
            <span>Product</span>
            <span>Barcode</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          
          <div className="list-content">
            {filteredInventory.map(product => (
              <div key={product.id} className="product-row">
                <div className="product-info">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product.id)}
                    onChange={() => handleSelectItem(product.id)}
                    disabled={!!product.barcode}
                  />
                  <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">₹{product.price}</span>
                  </div>
                </div>

                <div className="barcode-info">
                  {product.barcode ? (
                    <div className="barcode-display-small">
                      <BarcodeDisplay 
                        barcode={product.barcode}
                        size="small"
                        showControls={false}
                      />
                    </div>
                  ) : (
                    <span className="no-barcode">No barcode</span>
                  )}
                </div>

                <div className="status-info">
                  {product.barcode ? (
                    <span className="status-badge success">
                      <CheckCircle size={14} />
                      Generated
                    </span>
                  ) : (
                    <span className="status-badge warning">
                      <AlertCircle size={14} />
                      Missing
                    </span>
                  )}
                </div>

                <div className="action-buttons">
                  {product.barcode ? (
                    <>
                      <button 
                        className="btn-view"
                        onClick={() => handleViewBarcode(product)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-regenerate"
                        onClick={() => handleRegenerateBarcode(product)}
                        disabled={isGenerating}
                      >
                        Regenerate
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn-generate"
                      onClick={() => handleGenerateSingleBarcode(product)}
                      disabled={isGenerating}
                    >
                      Generate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barcode Modal */}
        {showBarcodeModal && selectedProduct && (
          <div className="barcode-modal-overlay">
            <div className="barcode-modal">
              <div className="modal-header">
                <h3>{selectedProduct.name}</h3>
                <button onClick={() => setShowBarcodeModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-content">
                <BarcodeDisplay 
                  barcode={selectedProduct.barcode}
                  productName={selectedProduct.name}
                  size="large"
                  showControls={true}
                />
                <div className="barcode-details">
                  <p><strong>Barcode:</strong> {selectedProduct.barcode}</p>
                  <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                  <p><strong>Stock:</strong> {selectedProduct.stock} units</p>
                  {parseBarcodeInfo(selectedProduct.barcode) && (
                    <p><strong>Category:</strong> {parseBarcodeInfo(selectedProduct.barcode).categoryName}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeManager;