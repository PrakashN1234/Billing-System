import { useState } from 'react';
import { Search, Plus, Package, AlertTriangle } from 'lucide-react';

const InventorySidebar = ({ inventory, addToCart }) => {
  const [search, setSearch] = useState("");

  const filtered = inventory.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockIcon = (stock) => {
    if (stock === 0) return <AlertTriangle size={16} className="stock-icon out" />;
    if (stock < 10) return <AlertTriangle size={16} className="stock-icon low" />;
    return <Package size={16} className="stock-icon good" />;
  };

  return (
    <aside className="inventory-sidebar">
      <div className="sidebar-header">
        <h3>Inventory ({inventory.length} items)</h3>
        <div className="stock-summary">
          <span className="stock-stat">
            <div className="stat-dot out"></div>
            Out: {inventory.filter(p => p.stock === 0).length}
          </span>
          <span className="stock-stat">
            <div className="stat-dot low"></div>
            Low: {inventory.filter(p => p.stock > 0 && p.stock < 10).length}
          </span>
        </div>
      </div>
      
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="product-list">
        {filtered.length === 0 ? (
          <div className="no-products">
            <Package size={48} />
            <p>No products found</p>
          </div>
        ) : (
          filtered.map(product => (
            <div 
              className={`product-item ₹{getStockStatus(product.stock)}`} 
              key={product.id} 
              onClick={() => addToCart(product)}
            >
              <div className="product-info">
                <div className="product-header">
                  <strong>{product.name}</strong>
                  {getStockIcon(product.stock)}
                </div>
                <div className="product-details">
                  <span className="price">₹{product.price.toFixed(2)}</span>
                  <span className={`stock ₹{getStockStatus(product.stock)}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
              <Plus 
                className={`plus-icon ₹{product.stock === 0 ? 'disabled' : ''}`} 
                size={18} 
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default InventorySidebar;