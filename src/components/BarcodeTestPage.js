import { useState, useEffect, useRef } from 'react';
import { generateProductBarcode } from '../utils/barcodeGenerator';

const BarcodeTestPage = () => {
  const [testBarcode, setTestBarcode] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    // Generate a test barcode
    const barcode = generateProductBarcode('Test Product', 'test001');
    setTestBarcode(barcode);
  }, []);

  useEffect(() => {
    if (testBarcode && canvasRef.current) {
      const JsBarcode = require('jsbarcode');
      
      // Generate high-quality barcode for testing
      JsBarcode(canvasRef.current, testBarcode, {
        format: 'CODE128',
        width: 4,
        height: 150,
        displayValue: true,
        fontSize: 16,
        textMargin: 8,
        margin: 20,
        background: '#ffffff',
        lineColor: '#000000',
        textAlign: 'center',
        textPosition: 'bottom'
      });
    }
  }, [testBarcode]);

  const generateNewBarcode = () => {
    const randomId = 'test' + Math.floor(Math.random() * 1000);
    const barcode = generateProductBarcode('Test Product ' + randomId, randomId);
    setTestBarcode(barcode);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>Barcode Test Page</h1>
      <p>Use this page to test barcode scanning with your camera</p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '2rem auto',
        maxWidth: '600px'
      }}>
        <h2>Test Barcode</h2>
        <canvas 
          ref={canvasRef} 
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }} 
        />
        <p style={{ 
          fontFamily: 'monospace', 
          fontSize: '18px', 
          fontWeight: 'bold',
          margin: '1rem 0'
        }}>
          {testBarcode}
        </p>
        
        <button 
          onClick={generateNewBarcode}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '1rem'
          }}
        >
          Generate New Test Barcode
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '1rem auto',
        maxWidth: '600px',
        textAlign: 'left'
      }}>
        <h3>Scanning Instructions:</h3>
        <ol>
          <li>Open the billing page in another tab/window</li>
          <li>Click "Open Scanner" button</li>
          <li>Allow camera permissions</li>
          <li>Point your camera at the barcode above</li>
          <li>Hold steady and ensure good lighting</li>
          <li>The barcode should be detected automatically</li>
        </ol>
        
        <h3>Troubleshooting:</h3>
        <ul>
          <li>Ensure you're using HTTPS (required for camera access)</li>
          <li>Try different distances from the screen</li>
          <li>Ensure good lighting conditions</li>
          <li>Make sure the barcode is clearly visible and not blurry</li>
          <li>Try generating a new test barcode if one doesn't work</li>
        </ul>

        <h3>Manual Testing:</h3>
        <p>If scanning doesn't work, you can manually enter this barcode number in the billing system:</p>
        <p style={{ 
          fontFamily: 'monospace', 
          fontSize: '16px', 
          backgroundColor: '#f8f9fa',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          {testBarcode}
        </p>
      </div>
    </div>
  );
};

export default BarcodeTestPage;