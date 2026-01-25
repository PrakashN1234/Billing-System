import { useState } from 'react';
import { Package, Plus, Download } from 'lucide-react';
import { initializeInventory } from '../utils/initializeData';

const EmptyInventory = ({ userEmail }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await initializeInventory(userEmail);
      // The inventory will update automatically via the real-time listener
    } catch (error) {
      alert('Failed to initialize inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="empty-inventory">
      <div className="empty-content">
        <Package size={64} className="empty-icon" />
        <h2>No Inventory Found</h2>
        <p>Your inventory is empty. Get started by adding some sample products.</p>
        
        <div className="empty-actions">
          <button 
            className="btn-initialize" 
            onClick={handleInitialize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Download className="spinning" size={18} />
                Loading Sample Data...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Sample Products
              </>
            )}
          </button>
          
          <p className="empty-note">
            Or use the Admin Panel (⚙️) to add products manually
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyInventory;