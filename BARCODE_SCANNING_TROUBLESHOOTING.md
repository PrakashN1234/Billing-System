# Barcode Scanning Troubleshooting Guide

## Common Issues and Solutions

### 1. "No MultiFormat Readers were able to detect the code"

This is the most common message and usually means:

**✅ Camera is working fine** - The error shows the scanner is active  
**❌ Barcode not detected** - The scanner can't read the barcode format or quality

#### Solutions:

1. **Improve Barcode Quality**:
   - Use the "Test Scanning" page from Dashboard
   - Generate high-quality barcodes with better settings
   - Ensure barcodes are printed/displayed clearly

2. **Scanning Technique**:
   - Hold camera 6-12 inches from barcode
   - Keep the camera steady
   - Ensure good lighting (avoid shadows)
   - Make sure entire barcode is visible in frame
   - Try different angles if needed

3. **Use Manual Entry**:
   - If scanning fails, use the manual input field
   - Enter the barcode number directly
   - This bypasses camera scanning entirely

### 2. Camera Permission Issues

If you see "Camera Access Failed" with permission errors:

1. **Grant Camera Permission**:
   - Click "Allow" when browser asks for camera access
   - Check browser settings if permission was denied

2. **HTTPS Requirement**:
   - Camera access requires HTTPS or localhost
   - If using HTTP, switch to HTTPS

3. **Other Apps Using Camera**:
   - Close other applications using the camera
   - Restart browser if needed

### 3. Barcode Format Compatibility

Our system generates CODE128 barcodes, which should be widely supported:

**Supported Formats** (by the scanner library):
- CODE128 ✅ (Our format)
- QR Code ✅
- EAN-13 ✅
- UPC-A ✅
- Code 39 ✅
- And many others

**If barcodes still don't scan**:
- The barcode might be too small/large
- Print quality might be insufficient
- Screen brightness might be too low

### 4. Testing Steps

#### Step 1: Test with High-Quality Barcode
1. Go to Dashboard → "Test Scanning" button
2. This opens a page with a high-quality test barcode
3. Try scanning this barcode first

#### Step 2: Test Camera Access
1. Go to Billing → "Open Scanner"
2. Allow camera permissions
3. Check if camera feed appears

#### Step 3: Test Manual Entry
1. Copy a barcode number from the test page
2. Use "Manual Entry" in the scanner
3. Verify the product is found

#### Step 4: Test with Real Products
1. Generate barcodes for inventory items
2. Try scanning generated barcodes
3. Use manual entry as fallback

### 5. Browser Compatibility

**Recommended Browsers**:
- Chrome (Desktop & Mobile) ✅
- Firefox (Desktop & Mobile) ✅
- Safari (Desktop & Mobile) ✅
- Edge (Desktop) ✅

**Known Issues**:
- Some older browsers may not support camera access
- iOS Safari requires iOS 11+
- Android browsers need recent versions

### 6. Mobile Device Tips

**For Mobile Scanning**:
- Use rear camera (environment mode)
- Ensure good lighting
- Hold device steady
- Try landscape orientation
- Clean camera lens

**iOS Specific**:
- Requires iOS 11 or later
- May need to refresh page after granting permissions

**Android Specific**:
- Works on most modern Android devices
- May need to enable camera permissions in browser settings

### 7. Barcode Quality Guidelines

**For Best Scanning Results**:

1. **Size**: Barcode should be at least 1 inch wide
2. **Contrast**: Black bars on white background
3. **Quality**: Sharp, not blurry or pixelated
4. **Margins**: White space around barcode (quiet zones)
5. **Orientation**: Horizontal orientation works best

### 8. Alternative Solutions

If scanning continues to fail:

1. **Manual Entry**: Always available as fallback
2. **Product Search**: Search by name instead of barcode
3. **Product Selection**: Use dropdown to select products
4. **Keyboard Shortcuts**: Use Enter key for quick entry

### 9. Development/Testing Mode

For developers and testing:

1. **Console Logs**: Check browser console for detailed errors
2. **Test System**: Use "Test System" button for diagnostics
3. **Network Tab**: Check for any network issues
4. **Camera Settings**: Verify camera constraints in code

### 10. When to Contact Support

Contact support if:
- Camera permissions are granted but camera doesn't work
- Barcodes work in other apps but not in this system
- Error messages persist after trying all solutions
- System worked before but suddenly stopped

## Quick Reference

### ✅ Working Indicators:
- Camera feed appears in scanner
- Scanner frame is visible
- "Scanning for barcodes..." message shows
- Manual entry works

### ❌ Problem Indicators:
- No camera feed
- Permission denied errors
- Scanner immediately closes
- Manual entry also fails

### 🔧 Quick Fixes:
1. Refresh the page
2. Clear browser cache
3. Try different browser
4. Use manual entry
5. Check HTTPS connection
6. Restart browser

Remember: The "No MultiFormat Readers" message is normal when no barcode is detected. It's not an error - just keep trying with better positioning and lighting!