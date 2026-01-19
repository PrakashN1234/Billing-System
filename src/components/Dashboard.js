import { useState, useEffect, useCallback } from 'react';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Receipt,
  Plus,
  Users,
  CreditCard,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { getSales, subscribeToStores, subscribeToUsers } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = ({ inventory, setActiveView }) => {
  const { currentUser, logout } = useAuth();
  const [sales, setSales] = useState([]);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalProducts: 0,
    totalSales: 0,
    totalBills: 0
  });

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time stores updates
    const unsubscribeStores = subscribeToStores(
      (storesData) => {
        setStores(storesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading stores for dashboard:', error);
        setLoading(false);
      }
    );

    // Subscribe to real-time users updates
    const unsubscribeUsers = subscribeToUsers(
      (usersData) => {
        setUsers(usersData);
      },
      (error) => {
        console.error('Error loading users for dashboard:', error);
      }
    );

    // Cleanup subscriptions
    return () => {
      if (unsubscribeStores) unsubscribeStores();
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, []);

  const updateStats = useCallback(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    const newStats = {
      totalStores: stores.length,
      totalProducts: inventory.length,
      totalSales: totalSales,
      totalBills: sales.length
    };
    
    setStats(newStats);
  }, [stores, inventory, sales]);

  // Update stats whenever data changes
  useEffect(() => {
    updateStats();
  }, [inventory, sales, stores, users, updateStats]);

  const loadDashboardData = async () => {
    try {
      const salesData = await getSales(50);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'store':
        setActiveView('stores');
        break;
      case 'user':
        setActiveView('users');
        break;
      case 'product':
        setActiveView('inventory');
        break;
      case 'bill':
        setActiveView('billing');
        break;
      case 'reports':
        setActiveView('reports');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const quickActions = [
    { id: 'store', label: 'Add Store', icon: Store, color: 'blue' },
    { id: 'user', label: 'Add User', icon: Users, color: 'purple' },
    { id: 'product', label: 'Add Product', icon: Plus, color: 'green' },
    { id: 'bill', label: 'New Bill', icon: CreditCard, color: 'orange' },
    { id: 'reports', label: 'View Reports', icon: BarChart3, color: 'indigo' }
  ];

  const lowStockItems = inventory.filter(item => item.stock < 10);

  // Get user display name and email
  const getUserDisplayName = () => {
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'admin';
  };

  const getUserEmail = () => {
    return currentUser?.email || 'prakashn1234@gmail.com';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <Package size={48} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Dashboard</h1>
          <div className="welcome-banner">
            <span>Welcome back, {getUserDisplayName()}!</span>
          </div>
        </div>
        <div className="user-profile">
          <div className="avatar">{getUserDisplayName().charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{getUserDisplayName()}</span>
            <span className="user-role">Admin</span>
            <span className="user-email">{getUserEmail()}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stores">
          <div className="stat-icon">
            <Store size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL STORES</div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL PRODUCTS</div>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>

        <div className="stat-card sales">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL SALES</div>
            <div className="stat-value">₹{stats.totalSales.toFixed(0)}</div>
          </div>
        </div>

        <div className="stat-card bills">
          <div className="stat-icon">
            <Receipt size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL BILLS</div>
            <div className="stat-value">{stats.totalBills}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button 
                  key={action.id} 
                  className={`action-card ${action.color}`}
                  onClick={() => handleQuickAction(action.id)}
                  title={`Navigate to ${action.label}`}
                >
                  <Icon size={20} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="low-stock-alert">
            <div className="alert-header">
              <AlertTriangle size={20} />
              <span>Low Stock</span>
            </div>
            <div className="low-stock-items">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="low-stock-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-stock">{item.stock} left</span>
                </div>
              ))}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => setActiveView('lowstock')}
            >
              View All Low Stock Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;