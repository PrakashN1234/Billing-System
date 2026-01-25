import { useState } from 'react';
import { Search, Plus, Package, AlertTriangle } from 'lucide-react';

const InventorySidebar = ({ inventory, addToCart, readOnly = false }) => {
  const [search, setSearch] = useState("");

  const filtered = inventory.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const getStockIcon = (stock) => {
    if (stock === 0) return <AlertTriangle size={16} className="stock-icon out" />;
    if (stock < 10) return <AlertTriangle size={16} className="stock-icon low" />;
    return <Package size={16} className="stock-icon good" />;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <aside className={`inventory-sidebar ${readOnly ? 'read-only' : ''}`}>
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
          placeholder={readOnly ? "Search products or codes..." : "Search products..."} 
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
              className={`product-item ${getStockStatus(product.stock)} ${readOnly ? 'read-only' : ''}`} 
              key={product.id} 
              onClick={readOnly ? undefined : () => addToCart(product)}
              style={readOnly ? { cursor: 'default' } : {}}
            >
              <div className="product-info">
                <div className="product-header">
                  <strong>{product.name}</strong>
                  {getStockIcon(product.stock)}
                </div>
                <div className="product-details">
                  {product.code && (
                    <span className="product-code">Code: {product.code}</span>
                  )}
                  <span className="price">₹{product.price.toFixed(2)}</span>
                  <span className={`stock ${getStockStatus(product.stock)}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
              {!readOnly && (
                <Plus 
                  className={`plus-icon ${product.stock === 0 ? 'disabled' : ''}`} 
                  size={18} 
                />
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default InventorySidebar;