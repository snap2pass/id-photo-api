# Frequently Asked Questions (FAQ)

## General Questions

### What is Snap2Pass API?

Snap2Pass API is a professional service that automatically processes and validates passport and visa photos according to specific document requirements. It uses advanced AI technology to remove backgrounds, adjust photo dimensions, and validate compliance with official standards.

### How accurate is the service?

Our API achieves high accuracy in photo processing and validation. We continuously improve our AI models to maintain this high standard. You are only charged for successful photo processing - failed transactions are free.

### What countries and document types are supported?

We support passport and visa photo requirements for multiple countries worldwide, including:
- United States (US)
- Canada (CA)
- United Kingdom (UK)
- European Union (EU)
- Australia (AU)
- India (IN)
- Japan (JP)
- China (CN)
- And more

Document types include:
- Passport photos
- Visa photos
- ID cards

See the [full list of supported documents](./api-docs.md#supported-document-types) in the API documentation.

## API Usage

### How do I get an API key?

Sign up at [snap2pass.com/business](https://snap2pass.com/business) and your API key will be automatically generated. You can start using the API immediately after signup.

### What file formats are supported?

We support the following image formats:
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)

Images must be base64-encoded in the request body.

### What is the maximum file size?

The maximum image size is **5MB** (base64-encoded). We recommend optimizing images before upload to stay under this limit.

### How long does processing take?

Processing typically takes 2-5 seconds per photo. The exact time depends on image size and server load.

### Can I process multiple photos at once?

Currently, the API processes one photo per request. For multiple photos, you'll need to make separate API calls. We recommend implementing parallel processing with a queue system for batch operations.

### What happens if my photo fails validation?

If your photo has validation issues, the API will still process it and return the result along with detailed validation feedback. The response includes:
- A validation score (0-100)
- Warnings for non-critical issues
- Errors for critical issues that may cause rejection
- A summary of the photo quality

You can use this feedback to improve the photo and resubmit if needed.

### How do I access the processed photos?

Processed photos are delivered via CloudFront CDN URLs in the API response:

```json
{
  "image_urls": {
    "input": "https://images.snap2pass.com/customer-id/request-id-input.jpg",
    "output": "https://images.snap2pass.com/customer-id/request-id-output.jpg"
  }
}
```

Simply download the image from the URL - no authentication required.

### How long are images stored?

Images are automatically deleted after **30 days** from the CloudFront CDN. If you need images for longer, download and store them in your own storage.

## Pricing & Billing

### How much does the API cost?

We offer competitive pay-per-use pricing with no setup fees. Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) for detailed pricing information based on your volume and requirements.

### Do you charge for failed transactions?

No, we do not charge for failed transactions or processing errors. You only pay for successful photo processing (HTTP 200 status).

### What is the credit system?

- **Cost**: 1 credit per successful photo processing
- **Failed Requests**: No credits deducted for errors (4xx or 5xx status codes)
- **No Rate Limits**: Process as many photos as your credit balance allows
- **Auto-deduction**: Credits automatically deducted on successful processing

### How do I check my credit balance?

Visit your dashboard at [snap2pass.com/business/dashboard](https://snap2pass.com/business/dashboard) to:
- View current credit balance
- See usage history
- Purchase more credits
- Set up low balance alerts

### What happens when I run out of credits?

When your credit balance reaches zero, the API will return a `402` error with the `INSUFFICIENT_CREDITS` error code:

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

### Is there a free trial available?

Yes, we offer a free trial for new customers. Sign up at [snap2pass.com/business](https://snap2pass.com/business) to get started.

### Are there volume discounts?

Yes, we offer volume discounts for high-volume customers. Contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com) for enterprise pricing.

## Technical Questions

### What is the API response format?

The API returns JSON responses with the following structure:

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

### How do I download images from CloudFront URLs?

Simply make a GET request to the URL - no authentication required:

**Python:**
```python
import requests

output_url = result['image_urls']['output']
response = requests.get(output_url)

with open('passport_photo.jpg', 'wb') as f:
    f.write(response.content)
```

**JavaScript:**
```javascript
const axios = require('axios');
const fs = require('fs');

const outputUrl = result.image_urls.output;
const response = await axios.get(outputUrl, { responseType: 'arraybuffer' });
fs.writeFileSync('passport_photo.jpg', response.data);
```

**cURL:**
```bash
curl -o passport_photo.jpg "https://images.snap2pass.com/customer-id/request-id-output.jpg"
```

### What HTTP status codes should I expect?

- **200 OK**: Photo processed successfully
- **400 Bad Request**: Missing or invalid parameters
- **401 Unauthorized**: Invalid or missing API key
- **402 Payment Required**: Insufficient credits
- **500 Internal Server Error**: Server error during processing

See the [full error code reference](./api-docs.md#error-codes-reference) in the API documentation.

### How do I implement retry logic?

We recommend implementing exponential backoff for retry logic:

```python
import time
import requests

def process_photo_with_retry(image_data, document_id, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, json=data)
            
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
                
        except requests.exceptions.RequestException:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
    
    raise Exception("Max retries exceeded")
```

### How do I encode images to base64?

**Python:**
```python
import base64

with open("photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')
```

**JavaScript/Node.js:**
```javascript
const fs = require('fs');

const imageBuffer = fs.readFileSync('photo.jpg');
const base64Image = imageBuffer.toString('base64');
```

**Bash:**
```bash
IMAGE_BASE64=$(base64 -i photo.jpg | tr -d '\n')
```

### What validation score should I aim for?

- **90-100**: Excellent quality - Ready to use
- **75-89**: Good quality - Acceptable for most purposes
- **60-74**: Fair quality - May have minor issues
- **Below 60**: Poor quality - Likely to be rejected

We recommend aiming for a score of 75 or higher.

### Can I customize the document specifications?

Currently, the API uses predefined document IDs with standard specifications. Each document ID corresponds to specific dimensions, DPI, and other requirements based on official standards.

If you need custom specifications not covered by our standard document types, please contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com).

## Security & Privacy

### Is my data secure?

Yes, we take security seriously:
- All API communications use HTTPS with TLS 1.2+ encryption
- Images are stored in private AWS S3 bucket with server-side encryption (AES-256)
- CloudFront-only access to images (no direct S3 URLs)
- API keys are securely managed
- Images automatically deleted after 30 days

### What data do you store?

We store:
- Images in encrypted S3 bucket (deleted after 30 days)
- Request parameters and metadata (for analytics and support)
- Validation results (for quality improvement)

We do NOT:
- Share your images with third parties
- Use your images for AI model training without permission
- Store payment or personal information beyond what's needed for billing

### How long do you retain data?

- **Images**: Automatically deleted after **30 days**
- **Request metadata**: Retained for 12 months for support and analytics
- **Validation results**: Retained for service improvement

### Can I request data deletion?

Yes, you can request deletion of your data by contacting [support@snap2pass.com](mailto:support@snap2pass.com). Note that images are automatically deleted after 30 days.

### Should I use the API from client-side code?

**No, we strongly recommend against this.** Exposing your API key in client-side code (browser JavaScript, mobile apps) poses a security risk.

**Best practice:** Implement a server-side proxy:
1. Client uploads image to your server
2. Your server calls Snap2Pass API with your secret API key
3. Your server returns the result to the client

This keeps your API key secure and gives you control over usage.

## Support & SLA

### What support options are available?

We offer multiple support channels:
- **24/7 AI Support**: Available at [snap2pass.com/support](https://snap2pass.com/support)
- **Human Support Team**: Business hours (Monday-Friday, 9am-5pm EST)
- **Email Support**: [support@snap2pass.com](mailto:support@snap2pass.com)
- **GitHub**: [github.com/snap2pass/id-photo-api](https://github.com/snap2pass/id-photo-api)

### What is your SLA?

Our Service Level Agreement includes:
- **Uptime**: 99.9% guaranteed uptime
- **Response Time**: < 1 business day for support inquiries
- **Resolution Time**:
  - Critical issues: 1 business day
  - High priority: 2 business days
  - Normal priority: 5 business days

### How do I report a bug or issue?

Contact our support team at [support@snap2pass.com](mailto:support@snap2pass.com) with:
- Your API key (first 8 characters only for security)
- Request ID (from the API response)
- Error message and HTTP status code
- Steps to reproduce the issue
- Sample request (without sensitive data)

### Where can I check service status?

Check our GitHub repository at [github.com/snap2pass/id-photo-api](https://github.com/snap2pass/id-photo-api) for updates, or contact support@snap2pass.com for service status inquiries.

## Integration Questions

### Can I integrate with my existing photo booth software?

Yes, our API is designed to integrate easily with existing systems. We provide examples in multiple programming languages and frameworks. See our [code examples](../examples/) for reference.

### Do you provide SDKs or libraries?

We provide comprehensive code examples in:
- Python
- JavaScript/Node.js
- React
- PHP
- cURL/Bash

We're working on official SDKs for popular languages. For now, our REST API can be easily integrated using standard HTTP libraries.

### Can I use the API in a mobile app?

Yes, the API works with mobile applications. However, **never embed your API key directly in mobile apps**. Instead:
1. Build a backend server/API
2. Mobile app sends images to your backend
3. Your backend calls Snap2Pass API
4. Your backend returns results to mobile app

This keeps your API key secure.

### Is there a sandbox environment for testing?

The production API can be used for testing. Since you're only charged for successful transactions, you can safely test error handling and edge cases without incurring charges.

### What are the rate limits?

There are no hard rate limits. You can process as many photos as your credit balance allows. However, we monitor for abuse and may throttle excessive traffic. Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) for high-volume requirements.

### How do I handle CORS for web applications?

Since API keys should not be exposed in browsers, implement a server-side proxy:

**Frontend** → **Your Backend** → **Snap2Pass API**

This avoids CORS issues and keeps your API key secure.

## Business Questions

### Can I resell your API service?

Yes, we offer reseller programs for partners. Contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com) to discuss partnership opportunities.

### Do you offer white-label solutions?

Yes, we can provide white-label solutions for enterprise customers. Contact our sales team for details.

### Can you customize the API for my specific needs?

Yes, we offer customization options for enterprise customers, including:
- Custom document specifications
- Custom validation rules
- Dedicated support
- SLA customization
- On-premise deployment (for qualified customers)

Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) to discuss your requirements.

### Do you provide training or onboarding?

Yes, we provide comprehensive onboarding for new customers:
- API integration assistance
- Best practices guidance
- Technical support during implementation
- Documentation and code examples
- Live training sessions (for enterprise customers)

## Image Quality

### What makes a good passport photo?

A good passport photo should have:
- Clear, front-facing portrait
- Neutral expression, mouth closed
- Eyes open and clearly visible
- No glasses (or clear, non-tinted glasses)
- No hats or head coverings (except religious headwear)
- Even, natural lighting
- Plain background (will be removed automatically)
- Face occupies 50-70% of frame height
- In focus, not blurred
- High resolution (1200×1200+ pixels recommended)

### Why is my photo getting a low validation score?

Common reasons for low scores:
- Poor lighting or harsh shadows
- Face not centered or straight
- Blurred or out-of-focus image
- Eyes closed or not visible
- Mouth open or non-neutral expression
- Glasses with glare or tinted lenses
- Low resolution image
- Multiple faces in the photo

Use the validation feedback to identify and fix specific issues.

### Can I improve a photo that failed validation?

Yes! The API still processes photos even if validation fails, and provides detailed feedback:

```json
{
  "validation": {
    "passed": false,
    "score": 45,
    "warnings": ["Slightly blurred"],
    "errors": ["Face not centered", "Eyes partially closed"],
    "summary": "Photo needs improvement"
  }
}
```

Use this feedback to retake or adjust the photo, then submit again.

### What resolution should input photos be?

- **Minimum**: 600×600 pixels
- **Recommended**: 1200×1200 pixels or higher
- **Maximum size**: 5MB (base64-encoded)

Higher resolution images produce better results, but ensure they stay under the 5MB limit.

---

**Still have questions?** Contact our support team at [support@snap2pass.com](mailto:support@snap2pass.com) or our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com).
