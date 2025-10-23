# Snap2Pass API - React Examples

This directory contains React examples for integrating with the Snap2Pass API using the new JSON-based API.

## Features

- 📸 **File Upload** - Click to upload photos with instant preview
- 🛂 **Document Type Selection** - Support for 9 document types
- ✅ **Real-time Validation** - Instant feedback with scoring system
- 💾 **Download Results** - Save processed photos from CloudFront URLs
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Beautiful, professional interface
- 🔐 **Secure** - API key handled via environment variables

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Get your API key:**
   Sign up at [snap2pass.com/business](https://snap2pass.com/business) to get your API key automatically.

3. **Set your API key:**
   Create a `.env` file in your project root:
   ```
   REACT_APP_SNAP2PASS_API_KEY=snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

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
- **Document Selection** - Choose from 9 supported document types
- **Validation Scoring** - Get a quality score (0-100)
- **Error Handling** - Graceful handling of API errors
- **CloudFront Integration** - Download images from CDN URLs
- **30-Day Storage** - Images available for 30 days

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

### Simple Integration Example

```jsx
import React, { useState } from 'react';

function SimplePhotoUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processPhoto = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      // Convert image to base64
      const base64Image = await fileToBase64(file);

      // Make API request
      const response = await fetch('https://api.snap2pass.com/process-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SNAP2PASS_API_KEY}`
        },
        body: JSON.stringify({
          photo: base64Image,
          document_id: 'us-passport'
        })
      });
      
      const data = await response.json();
      
      if (response.status === 200) {
        setResult(data);
      } else {
        console.error('Error:', data.error);
      }
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
        <div>
          <p>Validation Score: {result.validation.score}/100</p>
          <p>Summary: {result.validation.summary}</p>
          <img src={result.image_urls.output} alt="Processed photo" />
          <a href={result.image_urls.output} download>Download Photo</a>
        </div>
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

The component uses the new JSON-based API:

- **Base URL:** `https://api.snap2pass.com`
- **Endpoint:** `/process-photo`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authentication:** Bearer token (API key)
- **Image Format:** Base64-encoded in JSON body
- **Response:** JSON with CloudFront URLs

## Supported Document Types

| Document ID | Description |
|-------------|-------------|
| `us-passport` | US Passport |
| `us-visa` | US Visa |
| `ca-passport` | Canadian Passport |
| `uk-passport` | UK Passport |
| `eu-passport` | EU Passport |
| `in-passport` | Indian Passport |
| `jp-passport` | Japanese Passport |
| `cn-passport` | Chinese Passport |
| `au-passport` | Australian Passport |

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "image_urls": {
    "input": "https://images.snap2pass.com/customer-id/request-id-input.jpg",
    "output": "https://images.snap2pass.com/customer-id/request-id-output.jpg"
  },
  "validation": {
    "passed": true,
    "score": 95,
    "warnings": [],
    "errors": [],
    "summary": "Photo meets all passport requirements"
  }
}
```

### Validation Response Fields

- **`passed`**: Boolean indicating if photo meets requirements
- **`score`**: Quality score from 0-100
  - 90-100: Excellent quality
  - 75-89: Good quality (acceptable)
  - 60-74: Fair quality (may have minor issues)
  - Below 60: Poor quality (likely to be rejected)
- **`warnings`**: Non-critical issues (photo still usable)
- **`errors`**: Critical issues (photo may be rejected)
- **`summary`**: Human-readable assessment

## Error Handling

The component handles various error scenarios:

### Authentication Errors (401, 402)

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key"
  }
}
```

```json
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits. Please purchase more credits at https://www.snap2pass.com/business/purchase",
    "details": {
      "current_credits": 0
    }
  }
}
```

### Validation Errors (400)

```json
{
  "error": {
    "code": "IMAGE_TOO_LARGE",
    "message": "Image size exceeds 5MB limit",
    "details": {
      "size_mb": 6.2,
      "max_size_mb": 5
    }
  }
}
```

### Server Errors (500)

```json
{
  "error": {
    "code": "PROCESSING_FAILED",
    "message": "Failed to process image due to internal error",
    "details": {
      "request_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

## Image Requirements

### Input Requirements

- **Format:** JPEG or PNG
- **Size:** Maximum 5MB (base64-encoded)
- **Minimum Resolution:** 600×600 pixels
- **Recommended Resolution:** 1200×1200 pixels or higher
- **Face Coverage:** 50-70% of frame height
- **Background:** Any (automatically removed)
- **Lighting:** Even, natural lighting preferred
- **Expression:** Neutral, mouth closed
- **Eyes:** Open and clearly visible

### Output Guarantees

- **Format:** JPEG (high quality)
- **DPI:** 300 (print quality)
- **Background:** Pure white
- **Delivery:** CloudFront CDN URLs
- **Storage:** 30 days automatic deletion

## CloudFront Integration

Images are delivered via CloudFront CDN:

- **Domain:** `images.snap2pass.com`
- **No Authentication Required** for downloads
- **30-Day Storage:** Images automatically deleted after 30 days
- **Download:** Use standard `fetch()` or `<a download>` tags

### Download Example

```jsx
const downloadPhoto = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Usage
downloadPhoto(result.image_urls.output, 'passport_photo.jpg');
```

## Security Best Practices

1. **Environment Variables:** Always use environment variables for API keys
   ```
   REACT_APP_SNAP2PASS_API_KEY=snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Backend Proxy:** For production, implement a backend proxy to keep API keys secure:
   ```
   Frontend → Your Backend → Snap2Pass API
   ```

3. **Never Commit Keys:** Add `.env` to `.gitignore`

4. **Client-Side Validation:** Validate images before API calls to reduce costs

## Styling

The component uses modern CSS with:

- **Gradient backgrounds** - Professional appearance
- **Responsive design** - Mobile-friendly layout
- **Smooth animations** - Enhanced user experience
- **Accessibility** - Keyboard navigation support
- **Score-based colors** - Visual feedback on quality

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credit System

- **Cost:** 1 credit per successful photo processing (HTTP 200)
- **Failed Requests:** No credits deducted for errors (4xx or 5xx)
- **Balance:** Check at [snap2pass.com/business/dashboard](https://snap2pass.com/business/dashboard)

## Support

- **Email:** [support@snap2pass.com](mailto:support@snap2pass.com)
- **Documentation:** [docs.snap2pass.com](https://docs.snap2pass.com)
- **Status Page:** [status.snap2pass.com](https://status.snap2pass.com)

## License

This project is licensed under the MIT License.
