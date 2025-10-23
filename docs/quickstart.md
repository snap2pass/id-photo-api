# Quick Start Guide - Snap2Pass API

Get started with Snap2Pass API in under 5 minutes! This guide will help you process your first passport or visa photo.

## 🚀 Prerequisites

- An API key from Snap2Pass (sign up at [snap2pass.com/business](https://snap2pass.com/business))
- A photo file (JPEG or PNG, max 5MB)
- Basic knowledge of HTTP requests

## 📋 Step 1: Get Your API Key

1. Sign up at [snap2pass.com/business](https://snap2pass.com/business)
2. Your API key will be automatically generated
3. Copy your API key (format: `snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## 🔧 Step 2: Choose Your Integration Method

### Option A: Python (Recommended for beginners)

```bash
pip install requests
```

```python
import requests
import base64

# Your API credentials
API_KEY = "snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
API_URL = "https://api.snap2pass.com/process-photo"

# Read and encode image
with open("portrait.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# Make the API call
response = requests.post(
    API_URL,
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    },
    json={
        "photo": image_data,
        "document_id": "us-passport"
    }
)

# Handle response
if response.status_code == 200:
    result = response.json()
    
    # Download processed image
    output_url = result['image_urls']['output']
    image_response = requests.get(output_url)
    
    with open("passport_photo.jpg", "wb") as f:
        f.write(image_response.content)
    
    print(f"✅ Success! Validation score: {result['validation']['score']}")
    print(f"Download URL: {output_url}")
else:
    error = response.json()['error']
    print(f"❌ Error [{error['code']}]: {error['message']}")
```

### Option B: JavaScript/Node.js

```bash
npm install axios
```

```javascript
const axios = require('axios');
const fs = require('fs');

const API_KEY = 'snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_URL = 'https://api.snap2pass.com/process-photo';

async function processPhoto(imagePath, documentId) {
  try {
    // Read and encode image
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Make API request
    const response = await axios.post(
      API_URL,
      {
        photo: base64Image,
        document_id: documentId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    // Download processed image
    const outputUrl = response.data.image_urls.output;
    const imageResponse = await axios.get(outputUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync('passport_photo.jpg', imageResponse.data);

    console.log('✅ Success!');
    console.log(`Validation score: ${response.data.validation.score}`);
    console.log(`Download URL: ${outputUrl}`);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      console.error(`❌ Error [${code}]: ${message}`);
    } else {
      console.error('Network error:', error.message);
    }
    throw error;
  }
}

// Usage
processPhoto('portrait.jpg', 'us-passport');
```

### Option C: cURL (Command Line)

```bash
#!/bin/bash

# Your API key
API_KEY="snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Read and encode image (remove newlines)
IMAGE_BASE64=$(base64 -i portrait.jpg | tr -d '\n')

# Make API request
RESPONSE=$(curl -s -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{\"photo\": \"$IMAGE_BASE64\", \"document_id\": \"us-passport\"}")

# Display response
echo "$RESPONSE" | jq '.'

# Extract and download output image
OUTPUT_URL=$(echo "$RESPONSE" | jq -r '.image_urls.output')
curl -o passport_photo.jpg "$OUTPUT_URL"

echo "✅ Downloaded processed image to passport_photo.jpg"
```

## 📸 Step 3: Test with Your First Photo

1. **Prepare your photo:**
   - Format: JPEG or PNG
   - Size: Less than 5MB
   - Content: Clear face shot with neutral expression
   - Resolution: At least 600×600 pixels (1200×1200+ recommended)

2. **Choose your document type:**
   - `us-passport` - US Passport
   - `us-visa` - US Visa
   - `ca-passport` - Canadian Passport
   - `uk-passport` - UK Passport
   - `eu-passport` - EU Passport
   - `in-passport` - Indian Passport
   - `jp-passport` - Japanese Passport
   - `cn-passport` - Chinese Passport
   - `au-passport` - Australian Passport

3. **Make your first API call** using one of the examples above

4. **Check the response:**
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

## ✅ Step 4: Understand Validation Results

### Validation Scores

- **90-100**: Excellent quality - Ready to use
- **75-89**: Good quality - Acceptable for most purposes
- **60-74**: Fair quality - May have minor issues
- **Below 60**: Poor quality - Likely to be rejected

### Common Validation Issues

**Warnings** (photo still usable):
```json
{
  "warnings": [
    "Glasses detected - may be acceptable depending on issuing authority",
    "Slightly uneven lighting on left side"
  ]
}
```

**Errors** (photo may be rejected):
```json
{
  "errors": [
    "Face not centered",
    "Eyes not fully visible",
    "Background too dark"
  ]
}
```

### Handling Validation Issues

| Issue | Type | Solution |
|-------|------|----------|
| Glasses detected | Warning | Remove glasses if possible |
| Uneven lighting | Warning | Use natural, diffused lighting |
| Face not centered | Error | Center face in frame |
| Eyes closed | Error | Ensure eyes are open and visible |
| Mouth open | Error | Keep mouth closed |
| No face detected | Error | Ensure clear, front-facing portrait |

## 🔄 Step 5: Download and Use Images

### Download from CloudFront URL

```python
import requests

# Get the output URL from the API response
output_url = result['image_urls']['output']

# Download the image
response = requests.get(output_url)
with open('passport_photo.jpg', 'wb') as f:
    f.write(response.content)
```

### Important Notes

- Images are available via CloudFront CDN at `images.snap2pass.com`
- No authentication required to download from CloudFront URLs
- Images are automatically deleted after **30 days**
- Download and store images if you need them long-term

## ⚠️ Step 6: Handle Errors

### Common Error Codes

**Authentication Errors (401, 402):**

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key"
  }
}
```

**Validation Errors (400):**

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

**Insufficient Credits (402):**

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

### Error Handling Example

```python
response = requests.post(API_URL, headers=headers, json=data)

if response.status_code == 200:
    # Success
    result = response.json()
    print(f"✅ Success! Score: {result['validation']['score']}")
    
elif response.status_code == 401:
    # Authentication error
    error = response.json()['error']
    print(f"❌ Authentication Error: {error['message']}")
    
elif response.status_code == 402:
    # Insufficient credits
    error = response.json()['error']
    print(f"💳 {error['message']}")
    print(f"Current credits: {error['details']['current_credits']}")
    
elif response.status_code == 400:
    # Validation error
    error = response.json()['error']
    print(f"⚠️ Validation Error [{error['code']}]: {error['message']}")
    
else:
    # Server error
    error = response.json()['error']
    print(f"🔥 Server Error: {error['message']}")
```

## 🎯 Step 7: Optimize Your Integration

### 1. Compress Images Before Upload

```python
from PIL import Image
import io
import base64

def optimize_image(image_path, max_size_mb=4.5):
    """Resize and compress image to stay under size limit"""
    img = Image.open(image_path)
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize if too large
    max_dimension = 2400
    if max(img.size) > max_dimension:
        img.thumbnail((max_dimension, max_dimension), Image.LANCZOS)
    
    # Save with optimization
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=90, optimize=True)
    
    # Check size
    size_mb = len(buffer.getvalue()) / (1024 * 1024)
    if size_mb > max_size_mb:
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=75, optimize=True)
    
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

# Use optimized image
image_data = optimize_image('portrait.jpg')
```

### 2. Implement Retry Logic

```python
import time

def process_with_retry(image_data, document_id, max_retries=3):
    """Retry logic for transient errors"""
    for attempt in range(max_retries):
        try:
            response = requests.post(
                API_URL,
                headers=headers,
                json={"photo": image_data, "document_id": document_id}
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code in [401, 402, 400]:
                # Don't retry client errors
                raise ValueError(response.json()['error']['message'])
            elif response.status_code >= 500:
                # Retry server errors
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                raise
                
        except requests.RequestException as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
    
    raise Exception("Max retries exceeded")
```

### 3. Validate Images Client-Side

```python
from PIL import Image
import io
import base64

def validate_image(image_path):
    """Validate image before API call"""
    try:
        img = Image.open(image_path)
        
        # Check format
        if img.format not in ['JPEG', 'PNG']:
            return False, "Image must be JPEG or PNG"
        
        # Check size
        file_size = os.path.getsize(image_path)
        if file_size > 5 * 1024 * 1024:
            return False, "Image exceeds 5MB limit"
        
        # Check dimensions
        if min(img.size) < 600:
            return False, "Image resolution too low (minimum 600×600)"
        
        return True, "OK"
        
    except Exception as e:
        return False, f"Invalid image: {str(e)}"

# Validate before processing
valid, message = validate_image('portrait.jpg')
if not valid:
    print(f"❌ {message}")
    exit(1)
```

## 💳 Step 8: Manage Credits

### Check Credit Balance

Visit your dashboard at [snap2pass.com/business/dashboard](https://snap2pass.com/business/dashboard) to:
- View current credit balance
- See usage history
- Purchase more credits
- Set up low balance alerts

### Credit System

- **Cost**: 1 credit per successful photo processing
- **Failed Requests**: No credits deducted for errors (4xx or 5xx)
- **No Rate Limits**: Process as many photos as your balance allows

## 📚 Next Steps

Now that you've processed your first photo, explore more:

- **[Full API Documentation](./api-docs.md)** - Complete API reference
- **[Code Examples](../examples/)** - Production-ready code samples
- **[FAQ](./faq.md)** - Frequently asked questions
- **[Best Practices](./api-docs.md#best-practices)** - Optimization tips

## 🆘 Need Help?

- **Email Support**: [support@snap2pass.com](mailto:support@snap2pass.com)
- **24/7 AI Support**: Available at [snap2pass.com/support](https://snap2pass.com/support)
- **GitHub**: [github.com/snap2pass/id-photo-api](https://github.com/snap2pass/id-photo-api)

## 🎉 Congratulations!

You've successfully integrated with Snap2Pass API! Your application can now process passport and visa photos automatically with AI-powered validation.

---

**Pro Tip:** Start with standard document IDs for easier integration. Monitor your credit usage and implement client-side validation to reduce unnecessary API calls.
