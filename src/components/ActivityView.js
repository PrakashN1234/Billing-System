import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  User, 
  Package, 
  ShoppingCart, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Calendar
} from 'lucide-react';
import { getSales } from '../services/firebaseService';

const ActivityView = ({ inventory }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  const loadActivityData = useCallback(async () => {
    setLoading(true);
    try {
      const salesData = await getSales(20);
      
      // Convert sales to activity format
      const activities = salesData.map((sale, index) => ({
        id: sale.id || `activity-${index}`,
        type: 'sale',
        description: `Sale completed - ${sale.itemCount || 0} items`,
        amount: sale.total || 0,
        timestamp: sale.timestamp ? 
          (sale.timestamp.seconds ? new Date(sale.timestamp.seconds * 1000) : new Date(sale.timestamp)) : 
          new Date(),
        status: 'completed',
        user: 'System'
      }));

      setActivities(activities);
    } catch (error) {
      console.error('Error loading activity data:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivityData();
  }, [loadActivityData]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return <ShoppingCart size={16} />;
      case 'inventory': return <Package size={16} />;
      case 'user': return <User size={16} />;
      case 'system': return <Settings size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-blue-500" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    return true;
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="activity-view">
      <div className="view-header">
        <div className="header-left">
          <Activity size={24} />
          <h1>Activity Log</h1>
        </div>
        <div className="header-actions">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Activities</option>
              <option value="sale">Sales</option>
              <option value="inventory">Inventory</option>
              <option value="user">Users</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="filter-group">
            <Calendar size={16} />
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading activities...</p>
        </div>
      ) : (
        <div className="activities-container">
          <div className="activities-summary">
            <div className="summary-card">
              <span className="summary-number">{filteredActivities.length}</span>
              <span className="summary-label">Total Activities</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{filteredActivities.filter(a => a.type === 'sale').length}</span>
              <span className="summary-label">Sales</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{filteredActivities.filter(a => a.status === 'completed').length}</span>
              <span className="summary-label">Completed</span>
            </div>
          </div>

          <div className="activities-list">
            {filteredActivities.length === 0 ? (
              <div className="no-activities">
                <Activity size={48} />
                <h3>No Activities Found</h3>
                <p>No activities match your current filters.</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.status}`}>
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-description">{activity.description}</span>
                      <span className="activity-time">{formatTime(activity.timestamp)}</span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-user">by {activity.user}</span>
                      {activity.amount && (
                        <span className="activity-amount">₹{activity.amount.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="activity-status">
                    {getStatusIcon(activity.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityView;