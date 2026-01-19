import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download,
  Package,
  Filter,
  FileText
} from 'lucide-react';
import { getSales } from '../services/firebaseService';
import { printBill } from '../utils/billGenerator';

const ReportsView = ({ inventory }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [reportStats, setReportStats] = useState({
    totalBills: 0,
    totalSales: 0,
    totalPurchases: 0,
    profitLoss: 0,
    totalDiscount: 0
  });

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const salesData = await getSales(100);
      setSales(salesData);
      
      // Calculate stats from Firebase data
      const totalBills = salesData.length;
      const totalSales = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const totalDiscount = salesData.reduce((sum, sale) => sum + (sale.discount || 0), 0);
      
      // Mock purchases data (in real app, this would come from purchases collection)
      const totalPurchases = totalSales * 0.6; // Assuming 60% cost
      const profitLoss = totalSales - totalPurchases;

      setReportStats({
        totalBills,
        totalSales,
        totalPurchases,
        profitLoss,
        totalDiscount
      });
    } catch (error) {
      console.error('Error loading reports data:', error);
      setReportStats({
        totalBills: 0,
        totalSales: 0,
        totalPurchases: 0,
        profitLoss: 0,
        totalDiscount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleString('en-IN');
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generateBillNumber = (sale, index) => {
    if (sale.id) return sale.id;
    const timestamp = sale.timestamp ? 
      (sale.timestamp.seconds ? sale.timestamp.seconds : Math.floor(sale.timestamp / 1000)) : 
      Math.floor(Date.now() / 1000);
    return `BILL${timestamp.toString().slice(-8)}`;
  };

  const handleViewDetails = (sale) => {
    // Create bill data for viewing
    const billData = {
      items: sale.items || [],
      subtotal: sale.subtotal || 0,
      gst: sale.gst || 0,
      discount: sale.discount || 0,
      total: sale.total || 0,
      paymentMode: sale.paymentMode || 'Cash',
      itemCount: sale.itemCount || 0,
      timestamp: sale.timestamp ? 
        (sale.timestamp.seconds ? sale.timestamp.seconds * 1000 : sale.timestamp) : 
        Date.now()
    };
    
    printBill(billData);
  };

  const exportReport = () => {
    // Generate CSV report
    const csvContent = [
      ['Bill Number', 'Date & Time', 'Total', 'Payment', 'Items'],
      ...sales.map((sale, index) => [
        generateBillNumber(sale, index),
        formatDate(sale.timestamp),
        `₹${(sale.total || 0).toFixed(2)}`,
        sale.paymentMode || 'Cash',
        sale.itemCount || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-view">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <BarChart3 size={24} className="header-icon" />
          <h1>Sales Reports</h1>
        </div>
        <div className="header-right">
          <button className="analytics-btn">
            <Package size={16} />
            Product Analytics
          </button>
          <div className="filter-group">
            <Filter size={16} />
            <span>Filter:</span>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card bills">
              <div className="stat-header">
                <span className="stat-label">Total Bills</span>
              </div>
              <div className="stat-value">{reportStats.totalBills}</div>
            </div>

            <div className="stat-card sales">
              <div className="stat-header">
                <span className="stat-label">Total Sales</span>
              </div>
              <div className="stat-value">₹{reportStats.totalSales.toFixed(2)}</div>
            </div>

            <div className="stat-card purchases">
              <div className="stat-header">
                <span className="stat-label">Total Purchases</span>
              </div>
              <div className="stat-value">₹{reportStats.totalPurchases.toFixed(2)}</div>
            </div>

            <div className="stat-card profit">
              <div className="stat-header">
                <span className="stat-label">Profit/Loss</span>
              </div>
              <div className="stat-value profit-value">₹{reportStats.profitLoss.toFixed(2)}</div>
            </div>

            <div className="stat-card discount">
              <div className="stat-header">
                <span className="stat-label">Total Discount</span>
              </div>
              <div className="stat-value">₹{reportStats.totalDiscount.toFixed(2)}</div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="sales-table-container">
            <div className="table-header">
              <div className="table-title">
                <h3>Sales Transactions</h3>
              </div>
              <button className="export-btn" onClick={exportReport}>
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="table-wrapper">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>BILL NUMBER</th>
                    <th>DATE & TIME</th>
                    <th>TOTAL</th>
                    <th>PAYMENT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">
                        <div className="no-data-content">
                          <FileText size={48} />
                          <p>No sales data available</p>
                          <small>Sales will appear here once transactions are made</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale, index) => (
                      <tr key={sale.id || index}>
                        <td className="bill-number">
                          {generateBillNumber(sale, index)}
                        </td>
                        <td className="date-time">
                          {formatDate(sale.timestamp)}
                        </td>
                        <td className="total-amount">
                          ₹{(sale.total || 0).toFixed(2)}
                        </td>
                        <td className="payment-mode">
                          <span className={`payment-badge ${(sale.paymentMode || 'Cash').toLowerCase()}`}>
                            {sale.paymentMode || 'Cash'}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button 
                            className="view-details-btn"
                            onClick={() => handleViewDetails(sale)}
                            title="View Bill Details"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {sales.length > 0 && (
              <div className="table-footer">
                <div className="table-info">
                  Showing {sales.length} transactions
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsView;