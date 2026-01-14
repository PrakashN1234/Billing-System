import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle } from 'lucide-react';

const BarcodeScanner = ({ onScan, onClose, isActive }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleManualInput = (code) => {
    if (code.trim()) {
      onScan(code.trim());
      onClose();
    }
  };

  if (!isActive) return null;

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal">
        <div className="scanner-header">
          <h3>Barcode Scanner</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="scanner-content">
          {error ? (
            <div className="scanner-error">
              <div className="error-message">
                <Camera size={48} />
                <h4>Camera Access Failed</h4>
                <p>{error}</p>
                <p>Please ensure:</p>
                <ul>
                  <li>Camera permissions are granted</li>
                  <li>No other app is using the camera</li>
                  <li>You're using HTTPS (required for camera access)</li>
                </ul>
              </div>
            </div>
          ) : hasPermission === false ? (
            <div className="scanner-error">
              <div className="error-message">
                <Camera size={48} />
                <h4>Camera Permission Denied</h4>
                <p>Please allow camera access to use the scanner</p>
                <button onClick={startCamera} className="retry-btn">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="camera-container">
              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />
              <div className="scanner-overlay-frame">
                <div className="scanner-frame"></div>
                <p>Position barcode within the frame</p>
              </div>
            </div>
          )}

          <div className="manual-input-section">
            <h4>Manual Entry</h4>
            <p>Can't scan? Enter the product code manually:</p>
            <div className="manual-input-group">
              <input
                type="text"
                placeholder="Enter product code (e.g., RICE100, SUG123)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualInput(e.target.value);
                  }
                }}
                className="manual-input"
                autoFocus
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleManualInput(input.value);
                }}
                className="manual-submit-btn"
              >
                <CheckCircle size={16} />
                Add Product
              </button>
            </div>
          </div>

          <div className="scanner-tips">
            <h4>Scanning Tips:</h4>
            <ul>
              <li>Hold the camera steady</li>
              <li>Ensure good lighting</li>
              <li>Keep barcode flat and clear</li>
              <li>Try different distances if not scanning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;