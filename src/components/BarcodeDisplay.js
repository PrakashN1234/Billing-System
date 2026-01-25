import { useEffect, useRef } from 'react';
import { Copy, Download, Eye } from 'lucide-react';

const BarcodeDisplay = ({ 
  barcode, 
  productName, 
  size = 'medium',
  showControls = true,
  className = '' 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (barcode && canvasRef.current) {
      const options = {
        format: 'CODE128',
        width: size === 'small' ? 2 : size === 'large' ? 4 : 3,
        height: size === 'small' ? 60 : size === 'large' ? 140 : 100,
        displayValue: true,
        fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
        textMargin: 5,
        margin: size === 'small' ? 10 : 15,
        background: '#ffffff',
        lineColor: '#000000',
        textAlign: 'center',
        textPosition: 'bottom'
      };

      try {
        const JsBarcode = require('jsbarcode');
        JsBarcode(canvasRef.current, barcode, options);
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [barcode, size]);

  const handleCopyBarcode = async () => {
    try {
      await navigator.clipboard.writeText(barcode);
      alert('Barcode copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy barcode:', error);
      alert('Failed to copy barcode');
    }
  };

  const handleDownloadBarcode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `barcode_${productName || barcode}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleViewLarge = () => {
    if (canvasRef.current) {
      const imageUrl = canvasRef.current.toDataURL();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const htmlContent = `
          <html>
            <head>
              <title>Barcode - ${productName || barcode}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                }
                .barcode-container {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  text-align: center;
                }
                .product-name {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                  color: #333;
                }
                .barcode-number {
                  font-family: monospace;
                  font-size: 16px;
                  color: #666;
                  margin-top: 10px;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                ${productName ? `<div class="product-name">${productName}</div>` : ''}
                <img src="${imageUrl}" alt="Barcode" />
                <div class="barcode-number">${barcode}</div>
              </div>
            </body>
          </html>
        `;
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    }
  };

  if (!barcode) {
    return (
      <div className={`barcode-placeholder ${className}`}>
        <div className="no-barcode">
          <span>No barcode generated</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`barcode-display ${className}`}>
      <div className="barcode-container">
        <canvas ref={canvasRef} className="barcode-canvas" />
        {productName && (
          <div className="product-label">{productName}</div>
        )}
      </div>
      
      {showControls && (
        <div className="barcode-controls">
          <button 
            className="barcode-btn copy-btn"
            onClick={handleCopyBarcode}
            title="Copy barcode number"
          >
            <Copy size={14} />
          </button>
          <button 
            className="barcode-btn download-btn"
            onClick={handleDownloadBarcode}
            title="Download barcode image"
          >
            <Download size={14} />
          </button>
          <button 
            className="barcode-btn view-btn"
            onClick={handleViewLarge}
            title="View large barcode"
          >
            <Eye size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeDisplay;