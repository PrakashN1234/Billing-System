import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading Praba Store..." }) => (
  <div className="loading-container">
    <div className="loading-content">
      <Loader2 className="loading-spinner" size={48} />
      <h2>{message}</h2>
      <p>Connecting to inventory system</p>
    </div>
  </div>
);

export default LoadingSpinner;