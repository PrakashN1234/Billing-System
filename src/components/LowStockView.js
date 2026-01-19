import { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Edit, 
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import BulkRestockModal from './BulkRestockModal';
import { updateProduct } from '../services/firebaseService';

const LowStockView = ({ inventory }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockThreshold, setStockThreshold] = useState(10);
  const [sortBy, setSortBy] = useState('stock');
  const [showBulkModal, setShowBulkModal] = useState(false);

  const filterLowStockItems = useCallback(() => {
    let filtered = inventory.filter(item => item.stock <= stockThreshold);
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stock':
          return a.stock - b.stock;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        default:
          return a.stock - b.stock;
      }
    });

    setLowStockItems(filtered);
  }, [inventory, searchTerm, stockThreshold, sortBy]);

  useEffect(() => {
    filterLowStockItems();
  }, [filterLowStockItems]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: 'danger' };
    if (stock <= 5) return { status: 'critical', label: 'Critical', color: 'danger' };
    if (stock <= 10) return { status: 'low', label: 'Low Stock', color: 'warning' };
    return { status: 'normal', label: 'Normal', color: 'success' };
  };

  const handleRestockItem = async (itemId, itemName) => {
    const restockAmount = prompt(`Enter restock quantity for ${itemName}:`, '50');
    if (restockAmount && !isNaN(restockAmount) && parseInt(restockAmount) > 0) {
      try {
        const currentItem = inventory.find(item => item.id === itemId);
        if (currentItem) {
          await updateProduct(itemId, { 
            stock: currentItem.stock + parseInt(restockAmount),
            lastRestocked: new Date()
          });
          alert(`Successfully restocked ${itemName}: +${restockAmount} units`);
          // Refresh the page to show updated stock
          window.location.reload();
        }
      } catch (error) {
        console.error('Error restocking item:', error);
        alert('Error occurred while restocking. Please try again.');
      }
    }
  };

  const handleBulkRestock = () => {
    if (lowStockItems.length === 0) {
      alert('No items to restock');
      return;
    }
    setShowBulkModal(true);
  };

  const handleRestockComplete = (restockedItems) => {
    // Refresh the page to show updated inventory
    window.location.reload();
  };

  const criticalItems = lowStockItems.filter(item => item.stock <= 5);
  const outOfStockItems = lowStockItems.filter(item => item.stock === 0);

  return (
    <div className="low-stock-view">
      <div className="view-header">
        <h1>Low Stock Management</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={20} />
            Refresh
          </button>
          <button className="btn-primary" onClick={handleBulkRestock}>
            <Plus size={20} />
            Bulk Restock
          </button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="alert-summary">
        <div className="alert-card critical">
          <div className="alert-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="alert-content">
            <div className="alert-number">{outOfStockItems.length}</div>
            <div className="alert-label">Out of Stock</div>
          </div>
        </div>

        <div className="alert-card warning">
          <div className="alert-icon">
            <Package size={24} />
          </div>
          <div className="alert-content">
            <div className="alert-number">{criticalItems.length}</div>
            <div className="alert-label">Critical Stock</div>
          </div>
        </div>

        <div className="alert-card info">
          <div className="alert-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="alert-content">
            <div className="alert-number">{lowStockItems.length}</div>
            <div className="alert-label">Total Low Stock</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Stock Threshold:</label>
            <select 
              value={stockThreshold} 
              onChange={(e) => setStockThreshold(Number(e.target.value))}
            >
              <option value={5}>5 or less</option>
              <option value={10}>10 or less</option>
              <option value={20}>20 or less</option>
              <option value={50}>50 or less</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="stock">Stock Level</option>
              <option value="name">Product Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Low Stock Items Table */}
      <div className="low-stock-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Price</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  <Package size={48} />
                  <p>No low stock items found</p>
                  <small>All products are well stocked!</small>
                </td>
              </tr>
            ) : (
              lowStockItems.map((item) => {
                const stockInfo = getStockStatus(item.stock);
                return (
                  <tr key={item.id} className={stockInfo.status}>
                    <td>
                      <div className="product-info">
                        <div className="product-name">{item.name}</div>
                        <div className="product-id">ID: {item.id}</div>
                      </div>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className="stock-number">{item.stock}</span>
                        <span className="stock-unit">units</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ₹{stockInfo.color}`}>
                        {stockInfo.label}
                      </span>
                    </td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>
                      <span className="last-updated">
                        {item.updatedAt ? 
                          new Date(item.updatedAt.seconds * 1000).toLocaleDateString('en-IN') :
                          new Date().toLocaleDateString('en-IN')
                        }
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon"
                          onClick={() => handleRestockItem(item.id, item.name)}
                          title="Restock Item"
                        >
                          <Plus size={16} />
                        </button>
                        <button className="btn-icon" title="Edit Product">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Restock Recommendations */}
      {lowStockItems.length > 0 && (
        <div className="restock-recommendations">
          <h3>Restock Recommendations</h3>
          <div className="recommendations-grid">
            {lowStockItems.slice(0, 6).map((item) => (
              <div key={item.id} className="recommendation-card">
                <div className="rec-header">
                  <span className="product-name">{item.name}</span>
                  <span className={`stock-badge ₹{getStockStatus(item.stock).color}`}>
                    {item.stock} left
                  </span>
                </div>
                <div className="rec-content">
                  <div className="rec-suggestion">
                    <span>Suggested restock: </span>
                    <strong>{Math.max(50, item.stock * 5)} units</strong>
                  </div>
                  <div className="rec-cost">
                    <span>Estimated cost: </span>
                    <strong>₹{(item.price * Math.max(50, item.stock * 5)).toFixed(2)}</strong>
                  </div>
                </div>
                <button 
                  className="rec-action"
                  onClick={() => handleRestockItem(item.id, item.name)}
                >
                  Request Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Restock Modal */}
      <BulkRestockModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        lowStockItems={lowStockItems}
        onRestockComplete={handleRestockComplete}
      />
    </div>
  );
};

export default LowStockView;