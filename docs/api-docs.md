# Snap2Pass API Documentation

> Visit our website: [https://www.snap2pass.com/](https://www.snap2pass.com/)

> Professional Passport & Visa Photo Processing API

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Validation System](#validation-system)
- [Privacy & Security](#privacy--security)
- [Support & SLA](#support--sla)
- [Supported Document Types](#supported-document-types)

## Getting Started

To create an account and start using our API, please sign up at [snap2pass.com/business](https://snap2pass.com/business). Your API key will be generated automatically upon registration.

### Overview

This API processes and validates passport or visa photos based on specified document requirements. It accepts JSON requests with base64-encoded images, processes them, validates compliance, and returns CloudFront URLs for the processed images along with detailed validation results.

**Note:** The maximum image size is **5MB** (base64-encoded).

### Base URL

```
https://api.snap2pass.com
```

## Authentication

We use API keys for authentication. All API requests require a valid API key in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Replace `snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual API key.

**Getting Your API Key:**
1. Sign up at [snap2pass.com/business](https://snap2pass.com/business)
2. Your API key will be automatically generated
3. Each successful API call consumes 1 credit from your account balance

**Important:** Never expose your API key in client-side code or public repositories.

## API Endpoints

### POST /process-photo

#### Description

This endpoint accepts a base64-encoded photo and processes it according to specified document requirements. It validates the photo for compliance and returns CloudFront URLs for both input and output images, along with detailed validation results.

#### Request

**Headers**
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_API_KEY`

**Body Parameters (JSON)**

```json
{
  "photo": "base64_encoded_image_data",
  "document_id": "us-passport"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photo` | string | ✅ Yes | Base64-encoded image (JPEG or PNG, max 5MB) |
| `document_id` | string | ✅ Yes | Document type identifier (see [Supported Document Types](#supported-document-types)) |

#### Example Requests

**Example: US Passport Photo**

```bash
curl -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "photo": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "document_id": "us-passport"
  }'
```

**Example: UK Passport Photo**

```bash
curl -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "photo": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "document_id": "uk-passport"
  }'
```

#### Response

**Status Code:** `200 OK`

**Body (application/json):**

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "image_urls": {
    "input": "https://images.snap2pass.com/customer-abc123/550e8400-input.jpg",
    "output": "https://images.snap2pass.com/customer-abc123/550e8400-output.jpg"
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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the photo was processed successfully |
| `request_id` | string | Unique UUID for this request |
| `image_urls.input` | string | CloudFront URL for the uploaded input image |
| `image_urls.output` | string | CloudFront URL for the processed output image |
| `validation.passed` | boolean | Whether the photo passes all compliance checks |
| `validation.score` | number | Quality score from 0-100 |
| `validation.warnings` | array | Non-critical issues that won't cause rejection |
| `validation.errors` | array | Critical issues that may cause rejection |
| `validation.summary` | string | Human-readable assessment of the photo |

**Important Notes:**
- Images are served via CloudFront CDN at `images.snap2pass.com`
- Images are automatically deleted after **30 days**
- Download and store images if you need them long-term
- CloudFront URLs do not require authentication

#### Example Response with Validation Warnings

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "image_urls": {
    "input": "https://images.snap2pass.com/customer-abc123/550e8400-input.jpg",
    "output": "https://images.snap2pass.com/customer-abc123/550e8400-output.jpg"
  },
  "validation": {
    "passed": true,
    "score": 78,
    "warnings": [
      "Glasses detected - may be acceptable depending on issuing authority",
      "Slightly uneven lighting on left side"
    ],
    "errors": [],
    "summary": "Photo is acceptable but may benefit from minor improvements"
  }
}
```

## Error Handling

All API errors follow a standardized format for easy parsing and handling.

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional context
    }
  }
}
```

### Error Codes Reference

#### Authentication Errors (401, 402)

| HTTP Status | Error Code | Description | Resolution |
|-------------|-----------|-------------|------------|
| 401 | `MISSING_AUTHORIZATION` | No Authorization header present | Add `Authorization: Bearer YOUR_API_KEY` header |
| 401 | `INVALID_API_KEY` | Invalid or expired API key | Verify your API key or generate a new one at snap2pass.com/business |
| 402 | `INSUFFICIENT_CREDITS` | Account has no credits remaining | Purchase more credits at snap2pass.com/business/purchase |

**Example: Missing Authorization**
```json
{
  "error": {
    "code": "MISSING_AUTHORIZATION",
    "message": "Missing Authorization header"
  }
}
```

**Example: Insufficient Credits**
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

#### Validation Errors (400)

| HTTP Status | Error Code | Description | Resolution |
|-------------|-----------|-------------|------------|
| 400 | `INVALID_JSON` | Malformed JSON in request body | Check JSON syntax and formatting |
| 400 | `MISSING_REQUIRED_FIELD` | Missing `photo` or `document_id` | Include all required fields in request |
| 400 | `INVALID_DOCUMENT_ID` | Unsupported document type | Use a valid document ID from the supported list |
| 400 | `INVALID_IMAGE_FORMAT` | Cannot decode base64 or invalid image | Ensure image is valid JPEG/PNG and properly base64-encoded |
| 400 | `IMAGE_TOO_LARGE` | Image exceeds 5MB limit | Compress or resize the image before encoding |
| 400 | `FACE_DETECTION_FAILED` | No face detected in image | Ensure photo contains a clear, front-facing portrait |

**Example: Invalid Document ID**
```json
{
  "error": {
    "code": "INVALID_DOCUMENT_ID",
    "message": "Invalid document_id: 'mars-passport'",
    "details": {
      "provided": "mars-passport",
      "valid_options": ["us-passport", "us-visa", "ca-passport", "uk-passport", "eu-passport", "in-passport", "jp-passport", "cn-passport", "au-passport"]
    }
  }
}
```

**Example: Image Too Large**
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

#### Server Errors (500)

| HTTP Status | Error Code | Description | Resolution |
|-------------|-----------|-------------|------------|
| 500 | `BACKGROUND_REMOVAL_FAILED` | Background removal service error | Retry with a clearer photo or different image |
| 500 | `PROCESSING_FAILED` | General processing error | Retry the request or contact support |
| 500 | `S3_UPLOAD_FAILED` | Failed to upload to storage | Retry the request |
| 500 | `INTERNAL_ERROR` | Unexpected server error | Contact support with request_id |

**Example: Processing Failed**
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

## Validation System

Our AI-powered validation system checks photos against official document requirements.

### Validation Response Structure

The `validation` object in successful responses contains:

```json
{
  "passed": true,
  "score": 95,
  "warnings": [],
  "errors": [],
  "summary": "Photo meets all passport requirements"
}
```

### Understanding Validation Results

- **`passed`**: `true` if photo meets minimum requirements, `false` if critical issues exist
- **`score`**: 0-100 quality score (higher is better)
  - 90-100: Excellent quality
  - 75-89: Good quality (acceptable)
  - 60-74: Fair quality (may have minor issues)
  - Below 60: Poor quality (likely to be rejected)
- **`warnings`**: Non-critical issues that won't cause rejection but could be improved
- **`errors`**: Critical issues that may cause the photo to be rejected by authorities
- **`summary`**: Human-readable assessment

### Common Validation Issues

| Issue | Type | Description | Solution |
|-------|------|-------------|----------|
| Poor lighting | Warning | Uneven or harsh lighting | Use natural, diffused lighting |
| Glasses detected | Warning | Eyeglasses visible | Remove glasses if possible (requirements vary by country) |
| Slight blur | Warning | Minor focus issues | Use better camera or focus |
| Face not centered | Error | Face not properly centered | Center face in frame |
| Eyes closed | Error | Eyes not fully visible | Ensure eyes are open and visible |
| Mouth open | Error | Non-neutral expression | Keep mouth closed |
| Multiple faces | Error | More than one person detected | Photo must contain only one person |
| No face detected | Error | Face detection failed | Ensure clear, front-facing portrait |

## Privacy & Security

We take the privacy and security of your data seriously.

### Data Storage

- **Images**: Stored in private AWS S3 bucket with server-side encryption (AES-256)
- **CDN Delivery**: Images served via CloudFront with custom domain (`images.snap2pass.com`)
- **Retention**: Images automatically deleted after **30 days**
- **Metadata**: Request parameters and validation results stored for analytics
- **No Sharing**: Images are never shared with third parties or used for AI training

### Security Features

- **Encryption**: All API requests use HTTPS with TLS 1.2+
- **Authentication**: API key-based authentication with Bearer token
- **Access Control**: CloudFront-only access to S3 bucket (no direct S3 URLs)
- **Automatic Cleanup**: Scheduled deletion of images after 30 days
- **Rate Limiting**: Protection against abuse (limits vary by account tier)

### Best Practices

1. **Never expose API keys** in client-side code or public repositories
2. **Use environment variables** to store API keys
3. **Implement server-side proxies** for web applications
4. **Download and cache** processed images if needed beyond 30 days
5. **Monitor credit usage** to prevent service interruptions
6. **Implement retry logic** with exponential backoff for transient errors

## Credit System

### How Credits Work

- **Cost**: 1 credit per successful photo processing
- **Failed Requests**: No credits charged for errors (4xx or 5xx status codes)
- **No Rate Limits**: Process as many photos as your credit balance allows
- **Auto-deduction**: Credits automatically deducted on successful processing

### Managing Credits

- **Check Balance**: View current balance at [snap2pass.com/business/dashboard](https://snap2pass.com/business/dashboard)
- **Purchase Credits**: Buy credits at [snap2pass.com/business/purchase](https://snap2pass.com/business/purchase)
- **Low Balance Alerts**: Enable email notifications for low credit warnings
- **Usage Reports**: View detailed usage reports in your dashboard

### API Response for Insufficient Credits

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

## Support & SLA

We offer multiple levels of support to ensure you get the help you need.

### Support Channels

- **24/7 AI Support**: Available round-the-clock at [snap2pass.com/support](https://snap2pass.com/support)
- **Human Support**: Business hours (Monday-Friday, 9am-5pm EST)
- **Email Support**: [support@snap2pass.com](mailto:support@snap2pass.com)
- **GitHub**: [github.com/snap2pass/id-photo-api](https://github.com/snap2pass/id-photo-api)

### Service Level Agreement (SLA)

- **Uptime**: 99.9% guaranteed uptime
- **Response Time**: < 1 business day for support inquiries
- **Resolution Time**:
  - Critical issues: 1 business day
  - High priority issues: 2 business days
  - Normal priority issues: 5 business days

### Reporting Issues

When contacting support, please include:
- Your API key (first 8 characters only for security)
- Request ID (if available)
- Error message and HTTP status code
- Steps to reproduce the issue
- Sample request (without sensitive data)

## Supported Document Types

Below is the complete list of supported document types with their specifications.

| Document ID | Description | Dimensions | DPI |
|-------------|-------------|------------|-----|
| `us-passport` | US Passport | 2×2 inches | 300 |
| `us-visa` | US Visa | 2×2 inches | 300 |
| `ca-passport` | Canadian Passport | 50×70 mm | 300 |
| `uk-passport` | UK Passport | 35×45 mm | 300 |
| `eu-passport` | EU Passport | 35×45 mm | 300 |
| `in-passport` | Indian Passport | 35×35 mm | 300 |
| `jp-passport` | Japanese Passport | 35×45 mm | 300 |
| `cn-passport` | Chinese Passport | 33×48 mm | 300 |
| `au-passport` | Australian Passport | 35×45 mm | 300 |

### Document Specifications

All processed photos include:
- **Background**: Pure white (RGB: 255, 255, 255)
- **Format**: High-quality JPEG (95% quality)
- **Color Space**: sRGB
- **Face Position**: Centered with country-specific ratios
- **Resolution**: 300 DPI (print quality)
- **Orientation**: Portrait

### Image Requirements

**Input Requirements:**
- Format: JPEG or PNG
- Size: Maximum 5MB (base64-encoded)
- Minimum Resolution: 600×600 pixels
- Recommended Resolution: 1200×1200 pixels or higher
- Face Coverage: 50-70% of frame height
- Background: Any (automatically removed)
- Lighting: Even, natural lighting preferred
- Expression: Neutral, mouth closed
- Eyes: Open and clearly visible

**Output Guarantees:**
- Format: JPEG (high quality)
- DPI: 300 (print quality)
- Background: Pure white
- Dimensions: Document-specific (see table above)
- Color Space: sRGB
- Compression: Optimized for quality and file size

## Testing the API

### Quick Test Script (Bash)

```bash
#!/bin/bash

# Your API key
API_KEY="snap2pass_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Read and encode image
IMAGE_BASE64=$(base64 -i portrait.jpg | tr -d '\n')

# Make API request
curl -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{\"photo\": \"$IMAGE_BASE64\", \"document_id\": \"us-passport\"}" \
  | jq '.'
```

### Download Processed Image

```bash
#!/bin/bash

# Make API request and save response
RESPONSE=$(curl -s -X POST https://api.snap2pass.com/process-photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{\"photo\": \"$IMAGE_BASE64\", \"document_id\": \"us-passport\"}")

# Extract output URL
OUTPUT_URL=$(echo "$RESPONSE" | jq -r '.image_urls.output')

# Download processed image
curl -o processed_photo.jpg "$OUTPUT_URL"

echo "✅ Photo downloaded to processed_photo.jpg"
```

## Additional Resources

- **Full API Reference**: This document
- **Quick Start Guide**: [docs/quickstart.md](./quickstart.md)
- **Code Examples**: [examples/](../examples/)
- **FAQ**: [docs/faq.md](./faq.md)
- **Website**: [snap2pass.com](https://snap2pass.com)

## Changelog

### v2.0.0 (Current)
- ✅ JSON-based API (replacing multipart form data)
- ✅ CloudFront CDN delivery with custom domain
- ✅ Enhanced validation with detailed scoring system
- ✅ Standardized error codes (14 types)
- ✅ 5MB image size limit
- ✅ 30-day image retention
- ✅ Support for 9 document types
- ✅ AI-powered validation
- ✅ Improved error messages with actionable details

### v1.0.0 (Legacy)
- ❌ Multipart form data API (deprecated)
- ❌ Base64 response format (deprecated)
- ❌ Country code + document type parameters (replaced with document_id)

---

**Need Help?** Contact us at [support@snap2pass.com](mailto:support@snap2pass.com)
