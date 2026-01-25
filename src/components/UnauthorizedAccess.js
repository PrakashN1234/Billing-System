import { AlertTriangle, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedAccess = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <Shield size={64} />
          <AlertTriangle size={32} className="warning-overlay" />
        </div>
        
        <h1>Access Denied</h1>
        <p className="unauthorized-message">
          Your email address <strong>{currentUser?.email}</strong> is not authorized to access this system.
        </p>
        
        <div className="unauthorized-details">
          <div className="detail-item">
            <Mail size={20} />
            <div>
              <h3>Contact Administrator</h3>
              <p>Please contact your system administrator to request access to this application.</p>
            </div>
          </div>
          
          <div className="detail-item">
            <Shield size={20} />
            <div>
              <h3>Authorization Required</h3>
              <p>Only authorized email addresses can access this billing system for security purposes.</p>
            </div>
          </div>
        </div>
        
        <div className="unauthorized-actions">
          <button className="btn-logout" onClick={handleLogout}>
            <ArrowLeft size={16} />
            Sign Out & Try Different Account
          </button>
        </div>
        
        <div className="contact-info">
          <h4>Need Help?</h4>
          <p>Contact your system administrator at:</p>
          <ul>
            <li>Email: nprakash315349@gmail.com</li>
            <li>Email: draupathiitsolutions@gmail.com</li>
            <li>Phone: +91 9876543210</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;