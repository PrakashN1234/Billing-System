import { useState } from 'react';
import { ShoppingBasket, Settings } from 'lucide-react';
import AdminPanel from './AdminPanel';

const Header = ({ inventory }) => {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <>
      <header className="header">
        <h1><ShoppingBasket size={28} /> Praba <span>Store</span></h1>
        <div className="header-controls">
          <div className="status">System Active</div>
          <button 
            className="btn-admin" 
            onClick={() => setShowAdmin(true)}
            title="Admin Panel"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>
      
      {showAdmin && (
        <AdminPanel 
          inventory={inventory} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
    </>
  );
};

export default Header;

