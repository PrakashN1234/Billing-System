import { useState } from 'react';
import { Trash2, Receipt, AlertCircle } from 'lucide-react';
import { saveSale, updateStock } from '../services/firebaseService';

const BillingTable = ({ cart, inventory, updateQty, removeItem, clearCart }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePrintBill = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare sale data
      const saleData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty
        })),
        subtotal: subtotal,
        tax: tax,
        total: total,
        itemCount: cart.reduce((acc, item) => acc + item.qty, 0)
      };

      // Save sale to Firebase
      await saveSale(saleData);

      // Update stock levels
      const stockUpdates = cart.map(item => {
        const currentProduct = inventory.find(p => p.id === item.id);
        return {
          id: item.id,
          newStock: currentProduct.stock - item.qty
        };
      });

      await updateStock(stockUpdates);

      // Clear cart and show success
      clearCart();
      alert(`Bill processed successfully!\nTotal: $${total.toFixed(2)}\nItems sold: ${saleData.itemCount}`);
      
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStockWarning = (item) => {
    const product = inventory.find(p => p.id === item.id);
    if (!product) return null;
    
    if (product.stock < item.qty) {
      return 'Insufficient stock!';
    }
    if (product.stock - item.qty < 5) {
      return 'Low stock after sale';
    }
    return null;
  };

  return (
    <section className="billing-area">
      <div className="card">
        <div className="card-header">
          <h2>Current Bill</h2>
          <button className="btn-clear" onClick={clearCart} disabled={isProcessing}>
            Clear All
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Stock</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => {
                const product = inventory.find(p => p.id === item.id);
                const stockWarning = getStockWarning(item);
                
                return (
                  <tr key={item.id} className={stockWarning ? 'stock-warning' : ''}>
                    <td>
                      {item.name}
                      {stockWarning && (
                        <div className="warning-text">
                          <AlertCircle size={14} />
                          {stockWarning}
                        </div>
                      )}
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input 
                        type="number" 
                        className="qty-input"
                        value={item.qty} 
                        min="1"
                        max={product?.stock || 999}
                        onChange={(e) => updateQty(item.id, e.target.value)} 
                        disabled={isProcessing}
                      />
                    </td>
                    <td className={product?.stock < 10 ? 'low-stock' : ''}>
                      {product?.stock || 0}
                    </td>
                    <td>${(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn-remove" 
                        onClick={() => removeItem(item.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {cart.length === 0 && (
            <div className="empty-cart">
              <p>Cart is empty. Add items from inventory to start billing.</p>
            </div>
          )}
        </div>
        <div className="summary">
          <p>Items: <span>{cart.reduce((acc, item) => acc + item.qty, 0)}</span></p>
          <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
          <p>Tax (5%): <span>${tax.toFixed(2)}</span></p>
          <h3 className="total">Total: <span>${total.toFixed(2)}</span></h3>
          <button 
            className="btn-pay" 
            onClick={handlePrintBill}
            disabled={cart.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Receipt size={20} />
                PROCESS SALE
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BillingTable;