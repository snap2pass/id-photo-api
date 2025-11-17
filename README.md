# Snap2Pass API Documentation

Transform your portrait photos into passport and visa-compliant photos with AI-powered background removal and intelligent cropping.

## 🚀 Quick Start

```bash
curl -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "photo": "base64_encoded_image_here",
    "document_id": "us-passport"
  }'
```

## 📋 Table of Contents

- [Authentication](#authentication)
- [API Endpoint](#api-endpoint)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Supported Documents](#supported-documents)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Image Requirements](#image-requirements)
- [Best Practices](#best-practices)

## 🔐 Authentication

All API requests require a valid API key. Include your API key in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Getting Your API Key:**
1. Sign up at [snap2pass.com/business](https://snap2pass.com/business)
2. Your API key will be generated automatically
3. Each API call consumes 1 credit from your account balance

## 🌐 API Endpoint

**Base URL:** `https://api.snap2pass.com`

**Endpoint:** `POST /process-photo`

**Region:** `us-east-1` (US East - N. Virginia)

**Note:** This API uses a custom domain with SSL/TLS certificate for secure communication.

## 📤 Request Format

### Headers

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | ✅ Yes | `application/json` |
| `Authorization` | ✅ Yes | `Bearer YOUR_API_KEY` |

### Request Body

```json
{
  "photo": "base64_encoded_image",
  "document_id": "us-passport"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photo` | string | ✅ Yes | Base64-encoded image (JPEG or PNG, max 5MB) |
| `document_id` | string | ✅ Yes | Document type identifier (see [Supported Documents](#supported-documents)) |

## 📥 Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "request_id": "uuid-v4-request-id",
  "image_urls": {
    "input": "https://images.snap2pass.com/customer-id/request-id-input.jpg",
    "output": "https://images.snap2pass.com/customer-id/request-id-output.jpg"
  },
  "validation": {
    "passed": true,
    "score": 100,
    "warnings": [],
    "errors": [],
    "summary": "Photo meets all passport requirements"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the photo was processed successfully |
| `request_id` | string | Unique identifier for this request |
| `image_urls.input` | string | CloudFront URL for input image (available for 30 days) |
| `image_urls.output` | string | CloudFront URL for processed output image (available for 30 days) |
| `validation.passed` | boolean | Whether photo passes compliance checks |
| `validation.score` | number | Quality score (0-100) |
| `validation.warnings` | array | Non-critical issues (photo still usable) |
| `validation.errors` | array | Critical issues (photo may be rejected) |
| `validation.summary` | string | Brief assessment of photo quality |

**Note:** The processed image is available via the `image_urls.output` CloudFront URL. Images are automatically deleted from storage after 30 days.

## 📋 Supported Documents

**44 document types** using ISO 3166-1 alpha-2 country codes across passports, visas, and special documents.

### Passports (24 types)

| Document ID | Country | Dimensions | DPI |
|-------------|---------|------------|-----|
| `us-passport` | United States | 2×2 inches | 600 |
| `ca-passport` | Canada | 70×50 mm | 600 |
| `gb-passport` | United Kingdom | 45×35 mm | 600 |
| `de-passport` | Germany | 45×35 mm | 600 |
| `fr-passport` | France | 45×35 mm | 600 |
| `es-passport` | Spain | 40×30 mm | 600 |
| `nl-passport` | Netherlands | 45×35 mm | 600 |
| `eu-passport` | European Union | 45×35 mm | 300 |
| `gr-passport` | Greece | 60×40 mm | 300 |
| `in-passport` | India | 2×2 inches | 300 |
| `cn-passport` | China | 48×33 mm | 600 |
| `jp-passport` | Japan | 45×35 mm | 600 |
| `kr-passport` | South Korea | 45×35 mm | 600 |
| `hk-passport` | Hong Kong | 50×40 mm | 815 |
| `tw-passport` | Taiwan | 45×35 mm | 600 |
| `my-passport` | Malaysia | 50×35 mm | 300 |
| `vn-passport` | Vietnam | 60×40 mm | 300 |
| `tr-passport` | Turkey | 60×50 mm | 300 |
| `ae-passport` | UAE | 60×40 mm | 600 |
| `mx-passport` | Mexico | 45×35 mm | 600 |
| `au-passport` | Australia | 45×35 mm | 300 |
| `baby-2x2-passport` | Baby (2×2) | 2×2 inches | 600 |
| `baby-35x45-passport` | Baby (35×45) | 45×35 mm | 600 |
| `us-baby-passport` | US Baby | 2×2 inches | 600 |

### Visas (16 types)

| Document ID | Country | Dimensions | DPI |
|-------------|---------|------------|-----|
| `us-visa` | United States | 2×2 inches | 600 |
| `schengen-visa` | Schengen Area | 45×35 mm | 600 |
| `gb-visa` | United Kingdom | 45×35 mm | 600 |
| `ca-visa` | Canada | 45×35 mm | 300 |
| `au-visa` | Australia | 45×35 mm | 600 |
| `cn-visa` | China | 48×33 mm | 600 |
| `in-visa` | India | 2×2 inches | 300 |
| `jp-visa` | Japan | 45×35 mm | 600 |
| `my-visa` | Malaysia | 45×35 mm | 600 |
| `ru-visa` | Russia | 45×35 mm | 600 |
| `th-visa` | Thailand | 60×40 mm | 600 |
| `vn-visa` | Vietnam | 60×40 mm | 300 |
| `eg-visa` | Egypt | 45×35 mm | 600 |
| `sa-visa` | Saudi Arabia | 2×2 inches | 300 |
| `kh-visa` | Cambodia | 2×2 inches | 300 |
| `id-visa` | Indonesia | 60×40 mm | 300 |

### Special Documents (4 types)

| Document ID | Description | Dimensions | DPI |
|-------------|-------------|------------|-----|
| `us-green-card` | US Green Card | 2×2 inches | 600 |
| `us-uscis` | US USCIS | 2×2 inches | 600 |
| `jp-residence` | Japan Residence Card | 40×30 mm | 600 |
| `es-residence` | Spain Residence Card | 32×26 mm | 600 |

## ⚠️ Error Handling

All errors follow a standardized format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional context (optional)
    }
  }
}
```

### Error Codes Reference

#### Authentication Errors (401, 402)

| HTTP | Error Code | Description | Action |
|------|-----------|-------------|--------|
| 401 | `MISSING_AUTHORIZATION` | No Authorization header | Add `Authorization: Bearer YOUR_API_KEY` header |
| 401 | `INVALID_API_KEY` | Invalid or expired API key | Check your API key or generate a new one |
| 402 | `INSUFFICIENT_CREDITS` | No credits remaining | Purchase more credits at snap2pass.com/business |

#### Validation Errors (400)

| HTTP | Error Code | Description | Action |
|------|-----------|-------------|--------|
| 400 | `INVALID_JSON` | Malformed JSON request body | Fix JSON syntax |
| 400 | `MISSING_REQUIRED_FIELD` | Missing `photo` or `document_id` | Include all required fields |
| 400 | `INVALID_DOCUMENT_ID` | Unsupported document type | Use a valid document ID (see table above) |
| 400 | `INVALID_IMAGE_FORMAT` | Cannot decode image | Use valid JPEG or PNG, check base64 encoding |
| 400 | `IMAGE_TOO_LARGE` | Image exceeds 5MB | Compress or resize image |
| 400 | `FACE_DETECTION_FAILED` | No face detected | Ensure photo contains a clear, front-facing portrait |

#### Server Errors (500)

| HTTP | Error Code | Description | Action |
|------|-----------|-------------|--------|
| 500 | `BACKGROUND_REMOVAL_FAILED` | Background removal service error | Retry with a clearer photo |
| 500 | `PROCESSING_FAILED` | General processing error | Retry or contact support |
| 500 | `S3_UPLOAD_FAILED` | Storage upload failed | Retry request |
| 500 | `INTERNAL_ERROR` | Unexpected server error | Contact support with request_id |

### Error Response Examples

**Missing Authorization:**
```json
{
  "error": {
    "code": "MISSING_AUTHORIZATION",
    "message": "Missing Authorization header"
  }
}
```

**Invalid Document ID:**
```json
{
  "error": {
    "code": "INVALID_DOCUMENT_ID",
    "message": "Invalid document_id: 'mars-passport'",
    "details": {
      "provided": "mars-passport",
      "valid_options": ["us-passport", "us-visa", "ca-passport", ...]
    }
  }
}
```

**Insufficient Credits:**
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

## 💻 Code Examples

### Python

```python
import requests
import base64

# Read and encode image
with open("portrait.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# API request
response = requests.post(
    "https://api.snap2pass.com/process-photo",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    json={
        "photo": image_data,
        "document_id": "us-passport"
    }
)

# Handle response
if response.status_code == 200:
    result = response.json()

    # Download processed image from URL
    output_url = result['image_urls']['output']
    image_response = requests.get(output_url)

    with open("passport_photo.jpg", "wb") as f:
        f.write(image_response.content)

    print(f"✅ Success! Validation score: {result['validation']['score']}")
    print(f"Download URL: {output_url}")
    print(f"Request ID: {result['request_id']}")

elif response.status_code == 401:
    error = response.json()['error']
    print(f"❌ Authentication Error: {error['message']}")

elif response.status_code == 402:
    error = response.json()['error']
    print(f"💳 {error['message']}")
    print(f"Credits remaining: {error['details']['current_credits']}")

elif response.status_code == 400:
    error = response.json()['error']
    print(f"⚠️ Validation Error [{error['code']}]: {error['message']}")
    if 'details' in error:
        print(f"Details: {error['details']}")

else:
    error = response.json()['error']
    print(f"🔥 Server Error: {error['message']}")
```

### JavaScript (Node.js)

```javascript
const axios = require('axios');
const fs = require('fs');

async function processPassportPhoto(imagePath, documentId) {
  try {
    // Read and encode image
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // API request
    const response = await axios.post(
      'https://api.snap2pass.com/process-photo',
      {
        photo: base64Image,
        document_id: documentId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
      }
    );

    // Download processed image from URL
    const outputUrl = response.data.image_urls.output;
    const imageResponse = await axios.get(outputUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync('passport_photo.jpg', imageResponse.data);

    console.log('✅ Success!');
    console.log(`Validation score: ${response.data.validation.score}`);
    console.log(`Download URL: ${outputUrl}`);
    console.log(`Request ID: ${response.data.request_id}`);

    return response.data;

  } catch (error) {
    if (error.response) {
      const { code, message, details } = error.response.data.error;

      if (error.response.status === 401) {
        console.error(`❌ Authentication Error: ${message}`);
      } else if (error.response.status === 402) {
        console.error(`💳 ${message}`);
        console.error(`Credits: ${details.current_credits}`);
      } else if (error.response.status === 400) {
        console.error(`⚠️ Validation Error [${code}]: ${message}`);
        if (details) console.error('Details:', details);
      } else {
        console.error(`🔥 Server Error: ${message}`);
      }
    } else {
      console.error('Network error:', error.message);
    }
    throw error;
  }
}

// Usage
processPassportPhoto('portrait.jpg', 'us-passport');
```

### cURL

```bash
#!/bin/bash

# Encode image to base64
IMAGE_BASE64=$(base64 -i portrait.jpg)

# Make API request
RESPONSE=$(curl -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d "{
    \"photo\": \"$IMAGE_BASE64\",
    \"document_id\": \"us-passport\"
  }")

echo "$RESPONSE" | jq '.'

# Extract output URL and download image
OUTPUT_URL=$(echo "$RESPONSE" | jq -r '.image_urls.output')
curl -o passport_photo.jpg "$OUTPUT_URL"

echo "✅ Downloaded processed image to passport_photo.jpg"
```

### PHP

```php
<?php

function processPassportPhoto($imagePath, $documentId, $apiKey) {
    // Read and encode image
    $imageData = base64_encode(file_get_contents($imagePath));

    // Prepare request
    $url = 'https://api.snap2pass.com/process-photo';
    $data = json_encode([
        'photo' => $imageData,
        'document_id' => $documentId
    ]);

    // Make API request
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $result = json_decode($response, true);

    // Handle response
    if ($httpCode === 200) {
        // Download processed image from URL
        $outputUrl = $result['image_urls']['output'];
        $imageData = file_get_contents($outputUrl);
        file_put_contents('passport_photo.jpg', $imageData);

        echo "✅ Success!\n";
        echo "Validation score: " . $result['validation']['score'] . "\n";
        echo "Download URL: " . $outputUrl . "\n";
        echo "Request ID: " . $result['request_id'] . "\n";

        return $result;
    } else {
        $error = $result['error'];
        echo "❌ Error [{$error['code']}]: {$error['message']}\n";

        if (isset($error['details'])) {
            echo "Details: " . json_encode($error['details'], JSON_PRETTY_PRINT) . "\n";
        }

        return null;
    }
}

// Usage
processPassportPhoto(
    'portrait.jpg',
    'us-passport',
    'snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
);
```

## 📸 Image Requirements

### Input Image

- **Format:** JPEG or PNG
- **Size:** Maximum 5MB
- **Orientation:** Portrait (vertical)
- **Content:** Single person, front-facing, looking at camera
- **Background:** Any (will be removed automatically)
- **Quality:** Clear, well-lit, in focus

### Recommended Input Specs

- **Minimum Resolution:** 600×600 pixels
- **Recommended Resolution:** 1200×1200 pixels or higher
- **Face Size:** Face should occupy 50-70% of the frame
- **Lighting:** Even, natural lighting (avoid harsh shadows)
- **Expression:** Neutral expression, mouth closed
- **Eyes:** Open and clearly visible
- **Glasses:** Acceptable if non-tinted (may trigger warnings)
- **Headwear:** Generally not allowed (except religious headwear)

### Output Image

- **Format:** JPEG (high quality, 95% compression)
- **DPI:** 300-815 (varies by document type, optimized for print quality)
- **Dimensions:** Varies by document type (see [Supported Documents](#supported-documents))
- **Background:** White, light gray, or off-white (varies by document requirements)
  - White: `#FFFFFF` (RGB: 255, 255, 255)
  - Light gray: `#eeeeee` (RGB: 238, 238, 238)
  - Off-white: `#fcfcfc` (RGB: 252, 252, 252)
- **Color Space:** sRGB
- **Delivery:** Available via CloudFront CDN (images.snap2pass.com, 30-day storage)

## 🎯 Best Practices

### 1. Optimize Image Before Upload

```python
from PIL import Image
import io

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
        # Reduce quality if still too large
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=75, optimize=True)

    return buffer.getvalue()
```

### 2. Handle Errors Gracefully

```python
import time

def process_with_retry(image_data, document_id, max_retries=3):
    """Retry logic for transient errors"""
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, ...)

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

### 3. Download and Cache Images

```python
import requests
from pathlib import Path

def download_processed_image(image_url, save_path):
    """Download image from signed URL"""
    response = requests.get(image_url, stream=True)
    response.raise_for_status()

    # Save to file
    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return save_path

# Usage
result = process_passport_photo(...)
output_path = download_processed_image(
    result['image_urls']['output'],
    'passport_photo.jpg'
)
```

### 4. Validate Before Sending

```python
import base64
from PIL import Image
import io

def validate_image(base64_image):
    """Validate image before API call"""
    try:
        # Decode base64
        image_bytes = base64.b64decode(base64_image)

        # Check size
        size_mb = len(image_bytes) / (1024 * 1024)
        if size_mb > 5:
            return False, "Image exceeds 5MB limit"

        # Check format
        img = Image.open(io.BytesIO(image_bytes))
        if img.format not in ['JPEG', 'PNG']:
            return False, "Image must be JPEG or PNG"

        # Check dimensions
        if min(img.size) < 600:
            return False, "Image resolution too low (minimum 600×600)"

        return True, "OK"

    except Exception as e:
        return False, f"Invalid image: {str(e)}"
```

## 📊 Credit System

- **Cost:** 1 credit per successful photo processing
- **Failed Requests:** No credits deducted for validation errors (4xx) or server errors (5xx)
- **No Rate Limits:** Process as many photos as your credit balance allows
- **Credit Balance:** Check your balance at [snap2pass.com/business/dashboard](https://snap2pass.com/business/dashboard)

## 🔒 Security & Privacy

- **Encryption:** All API requests use HTTPS (TLS 1.2+)
- **Data Retention:** Images automatically deleted after 30 days
- **CDN Delivery:** Images served via CloudFront CDN with custom domain (images.snap2pass.com)
- **No Sharing:** Your images are never shared or used for training
- **API Key Security:** Never expose your API key in client-side code
- **Secure Storage:** Images stored in private S3 bucket with CloudFront-only access and server-side encryption

## 📞 Support

- **Documentation:** [docs.snap2pass.com](https://docs.snap2pass.com)
- **Status Page:** [status.snap2pass.com](https://status.snap2pass.com)
- **Email Support:** support@snap2pass.com
- **Business Hours:** Monday-Friday, 9am-5pm EST

## 📝 Changelog

### v2.1.0 (Current)
- ✅ **44 document types using ISO 3166-1 alpha-2 codes** (24 passports, 16 visas, 4 special documents)
- ✅ **ISO country codes for all documents** (e.g., `ca-passport`, `de-passport`, `gb-visa`)
- ✅ Enhanced DPI support (300-815 DPI depending on document)
- ✅ Support for both eye and hair anchor points
- ✅ Multiple background colors (white, light gray, off-white)
- ✅ Baby passport photo support
- ✅ Residence card and green card support

### v2.0.0
- ✅ Enhanced validation with 14 standardized error codes
- ✅ 5MB image size limit enforcement
- ✅ Improved error messages with actionable details
- ✅ AI-powered Expert Review validation
- ✅ Support for 9 document types
- ✅ CloudFront CDN delivery with custom domain (images.snap2pass.com)
- ✅ Efficient delivery via CloudFront URLs (no base64 in response)

---

**Need Help?** Contact us at support@snap2pass.com or visit [snap2pass.com/business/support](https://snap2pass.com/business/support)
