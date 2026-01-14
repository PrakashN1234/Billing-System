import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { updateProduct } from '../services/firebaseService';

const BulkRestockModal = ({ isOpen, onClose, lowStockItems, onRestockComplete }) => {
  const [restockList, setRestockList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (isOpen && lowStockItems.length > 0) {
      // Initialize restock list with suggested quantities
      const initialList = lowStockItems.map(item => ({
        ...item,
        restockQty: Math.max(50, (20 - item.stock)), // Restock to 20 minimum
        selected: item.stock <= 5, // Auto-select critical items
        estimatedCost: item.price * 0.7 // Assuming 70% of selling price as cost
      }));
      setRestockList(initialList);
    }
  }, [isOpen, lowStockItems]);

  useEffect(() => {
    // Calculate total cost
    const total = restockList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.restockQty * item.estimatedCost), 0);
    setTotalCost(total);
  }, [restockList]);

  const updateRestockQty = (itemId, newQty) => {
    setRestockList(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, restockQty: Math.max(1, parseInt(newQty) || 0) }
        : item
    ));
  };

  const toggleItemSelection = (itemId) => {
    setRestockList(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, selected: !item.selected }
        : item
    ));
  };

  const selectAllCritical = () => {
    setRestockList(prev => prev.map(item => ({
      ...item,
      selected: item.stock <= 5
    })));
  };

  const selectAll = () => {
    setRestockList(prev => prev.map(item => ({
      ...item,
      selected: true
    })));
  };

  const deselectAll = () => {
    setRestockList(prev => prev.map(item => ({
      ...item,
      selected: false
    })));
  };

  const handleBulkRestock = async () => {
    const selectedItems = restockList.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item to restock');
      return;
    }

    const confirmed = window.confirm(
      `Confirm bulk restock for ${selectedItems.length} items?\n` +
      `Total estimated cost: ₹${totalCost.toFixed(2)}\n\n` +
      `This will update inventory levels immediately.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      // Update each selected item's stock
      const updatePromises = selectedItems.map(item => 
        updateProduct(item.id, { 
          stock: item.stock + item.restockQty,
          lastRestocked: new Date(),
          restockHistory: {
            date: new Date(),
            quantity: item.restockQty,
            cost: item.restockQty * item.estimatedCost
          }
        })
      );

      await Promise.all(updatePromises);

      // Show success message
      alert(`Successfully restocked ${selectedItems.length} items!`);
      
      // Call completion callback
      if (onRestockComplete) {
        onRestockComplete(selectedItems);
      }
      
      onClose();
    } catch (error) {
      console.error('Error during bulk restock:', error);
      alert('Error occurred during restock. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'OUT OF STOCK', color: 'danger' };
    if (stock <= 5) return { label: 'CRITICAL', color: 'danger' };
    if (stock <= 10) return { label: 'LOW', color: 'warning' };
    return { label: 'NORMAL', color: 'success' };
  };

  if (!isOpen) return null;

  const selectedCount = restockList.filter(item => item.selected).length;
  const criticalCount = restockList.filter(item => item.stock <= 5).length;

  return (
    <div className="bulk-restock-overlay">
      <div className="bulk-restock-modal">
        <div className="modal-header">
          <div className="header-left">
            <ShoppingCart size={24} />
            <div>
              <h2>Bulk Restock Management</h2>
              <p>{restockList.length} items need restocking</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Summary Cards */}
          <div className="restock-summary">
            <div className="summary-card critical">
              <AlertCircle size={20} />
              <div>
                <span className="number">{criticalCount}</span>
                <span className="label">Critical Items</span>
              </div>
            </div>
            <div className="summary-card selected">
              <Check size={20} />
              <div>
                <span className="number">{selectedCount}</span>
                <span className="label">Selected Items</span>
              </div>
            </div>
            <div className="summary-card cost">
              <span className="currency">₹</span>
              <div>
                <span className="number">{totalCost.toFixed(2)}</span>
                <span className="label">Estimated Cost</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-btn" onClick={selectAllCritical}>
              Select Critical ({criticalCount})
            </button>
            <button className="quick-btn" onClick={selectAll}>
              Select All
            </button>
            <button className="quick-btn secondary" onClick={deselectAll}>
              Deselect All
            </button>
          </div>

          {/* Items List */}
          <div className="restock-items">
            <div className="items-header">
              <span>Product</span>
              <span>Current Stock</span>
              <span>Restock Qty</span>
              <span>New Stock</span>
              <span>Cost</span>
              <span>Select</span>
            </div>
            
            <div className="items-list">
              {restockList.map(item => {
                const stockStatus = getStockStatus(item.stock);
                const itemCost = item.restockQty * item.estimatedCost;
                
                return (
                  <div key={item.id} className={`restock-item ${item.selected ? 'selected' : ''}`}>
                    <div className="item-product">
                      <div className="product-name">{item.name}</div>
                      <div className="product-id">ID: {item.id}</div>
                      <span className={`status-badge ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                    
                    <div className="item-current-stock">
                      <span className="stock-number">{item.stock}</span>
                      <span className="stock-unit">units</span>
                    </div>
                    
                    <div className="item-restock-qty">
                      <button 
                        className="qty-btn"
                        onClick={() => updateRestockQty(item.id, item.restockQty - 10)}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.restockQty}
                        onChange={(e) => updateRestockQty(item.id, e.target.value)}
                        min="1"
                        className="qty-input"
                      />
                      <button 
                        className="qty-btn"
                        onClick={() => updateRestockQty(item.id, item.restockQty + 10)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="item-new-stock">
                      <span className="new-stock-number">{item.stock + item.restockQty}</span>
                      <span className="stock-unit">units</span>
                    </div>
                    
                    <div className="item-cost">
                      ₹{itemCost.toFixed(2)}
                    </div>
                    
                    <div className="item-select">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItemSelection(item.id)}
                        className="select-checkbox"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-summary">
            <span>Selected: {selectedCount} items</span>
            <span>Total Cost: ₹{totalCost.toFixed(2)}</span>
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleBulkRestock}
              disabled={selectedCount === 0 || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Restock ${selectedCount} Items`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkRestockModal;