# Camera Scanner Troubleshooting

## Issue: Camera Shows Video But Doesn't Scan Barcodes

If you can see the camera feed but barcodes aren't being detected, this is a common issue with web-based barcode scanners.

### Why This Happens:
1. **Library Limitations**: The `react-qr-barcode-scanner` library may not detect all barcode formats reliably
2. **Barcode Quality**: Generated barcodes on screen may not have sufficient contrast/resolution
3. **Lighting Conditions**: Poor lighting affects barcode detection
4. **Browser Compatibility**: Some browsers handle barcode detection differently

### Solutions (In Order of Reliability):

#### 1. Use Manual Entry (Most Reliable) ✅
- The manual entry field accepts:
  - **Barcodes**: `78011234567`
  - **Product IDs**: `RICE001`
  - **Product Names**: `Rice` (partial match)
- This bypasses camera scanning entirely
- Works 100% of the time

#### 2. Improve Scanning Conditions
- **Better Lighting**: Use bright, even lighting
- **Print Barcodes**: Print barcodes on paper instead of scanning from screen
- **Distance**: Try 6-12 inches from barcode
- **Steady Hold**: Keep camera very steady
- **Clean Barcode**: Ensure barcode is sharp and clear

#### 3. Test with Different Barcodes
- Use the "Test Scanning" page from Dashboard
- Try different barcode sizes
- Test with printed barcodes vs screen display

#### 4. Browser Alternatives
- Try different browsers (Chrome, Firefox, Safari)
- Ensure you're using HTTPS (required for camera access)
- Clear browser cache and reload

### Recommended Workflow:

1. **Primary Method**: Use manual entry for reliable product addition
2. **Secondary**: Try camera scanning with optimal conditions
3. **Fallback**: Use product dropdown selector

### For Developers:

The camera scanner uses `react-qr-barcode-scanner` which wraps ZXing library. Known issues:
- May not detect CODE128 barcodes reliably
- Screen-based barcodes are harder to detect than printed ones
- Library hasn't been updated recently

### Alternative Solutions:

1. **QR Codes**: Generate QR codes instead of barcodes (better detection)
2. **Dedicated Scanner**: Use physical barcode scanner hardware
3. **Mobile App**: Create dedicated mobile app with native scanning

### Current Status:

✅ **Working**: Manual entry, product search, dropdown selection  
⚠️ **Partial**: Camera scanning (shows video, detection unreliable)  
❌ **Not Working**: Reliable barcode detection from camera

### Recommendation:

**Use manual entry as the primary method** - it's faster, more reliable, and works with barcodes, IDs, and names. Camera scanning can be used as a secondary option when conditions are optimal.