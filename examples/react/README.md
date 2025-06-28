# Snap2Pass API - React Examples

This directory contains React examples for integrating with the Snap2Pass API.

## Features

- 📸 **File Upload** - Drag and drop or click to upload photos
- 🛂 **Country-Specific Processing** - Support for 200+ countries
- ⚙️ **Custom Specifications** - Fine-tune photo requirements
- ✅ **Real-time Validation** - Instant feedback on photo compliance
- 💾 **Download Results** - Save processed photos directly
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Beautiful, professional interface

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Get your API token:**
   Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) to get your API credentials.

3. **Update the API token:**
   Replace `YOUR_API_TOKEN_HERE` in `PhotoProcessor.jsx` with your actual API token.

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application.

## Examples

### PhotoProcessor Component

A comprehensive React component that demonstrates:

- **File Upload & Preview** - Upload photos with instant preview
- **Processing Modes** - Choose between country-specific or custom specifications
- **Real-time Validation** - Get immediate feedback on photo compliance
- **Error Handling** - Graceful handling of API errors and validation issues
- **Download Functionality** - Save processed photos with one click

### Usage

```jsx
import PhotoProcessor from './PhotoProcessor';

function App() {
  return (
    <div className="App">
      <PhotoProcessor />
    </div>
  );
}
```

### Integration Example

```jsx
import React, { useState } from 'react';

function SimplePhotoUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const processPhoto = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('input_photo', file);
    formData.append('country_code', 'US');
    formData.append('document_type', 'passport');

    try {
      const response = await fetch('https://api.snap2pass.com/create-photo', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={processPhoto} disabled={loading}>
        {loading ? 'Processing...' : 'Process Photo'}
      </button>
      {result && (
        <img 
          src={`data:image/jpeg;base64,${result.document_image_base64}`} 
          alt="Processed photo" 
        />
      )}
    </div>
  );
}
```

## File Structure

```
examples/react/
├── PhotoProcessor.jsx    # Main component with full UI
├── PhotoProcessor.css    # Styling for the component
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## API Configuration

The component uses the following API configuration:

- **Base URL:** `https://api.snap2pass.com`
- **Endpoint:** `/create-photo`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Authentication:** Bearer token

## Supported Features

### Country-Specific Processing
- United States (US)
- Canada (CA)
- United Kingdom (GB)
- Australia (AU)
- Germany (DE)
- France (FR)
- Japan (JP)
- India (IN)
- And 200+ more countries

### Document Types
- Passport photos
- Visa photos

### Custom Specifications
- Width and height
- Units (imperial/metric)
- Head to height ratio
- Eye distance from top
- Background color
- DPI resolution

## Error Handling

The component handles various error scenarios:

- **File Validation** - Checks file type and size
- **Network Errors** - Handles connection issues
- **API Errors** - Displays server error messages
- **Validation Errors** - Shows photo compliance issues

## Validation Errors

Common validation errors include:

- `face_not_straight` - Face not properly aligned
- `blurred_photo` - Image is too blurry
- `too_dark_photo` - Insufficient lighting
- `eyeglasses_detected` - Glasses not allowed
- `hat_detected` - Hat not allowed
- `sunglasses_detected` - Sunglasses not allowed
- `mouth_open` - Mouth should be closed
- `eyes_not_open` - Eyes should be open
- `no_clothing` - Person should be wearing clothes
- `not_light_color_background` - Background should be light
- `left_ear_not_visible` - Left ear should be visible
- `right_ear_not_visible` - Right ear should be visible
- `camera_too_close` - Camera too close to subject

## Styling

The component uses modern CSS with:

- **Gradient backgrounds** - Professional appearance
- **Responsive design** - Mobile-friendly layout
- **Smooth animations** - Enhanced user experience
- **Accessibility** - Keyboard navigation and screen reader support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

For questions about the React examples, contact [api-support@snap2pass.com](mailto:api-support@snap2pass.com).

## License

This project is licensed under the MIT License. 