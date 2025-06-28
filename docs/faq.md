# Frequently Asked Questions (FAQ)

## General Questions

### What is Snap2Pass API?

Snap2Pass API is a professional service that automatically processes and validates passport and visa photos according to specific document requirements. It uses advanced AI technology to remove backgrounds, adjust photo dimensions, and validate compliance with official standards.

### How accurate is the service?

Our API achieves 99.9% accuracy in photo processing and validation. We continuously improve our AI models to maintain this high standard. For the small percentage of unsuccessful transactions (approximately 3%), we do not charge any fees.

### What countries and document types are supported?

We support passport and visa photo requirements for 200+ countries worldwide, including:
- United States (US)
- Canada (CA)
- United Kingdom (GB)
- Australia (AU)
- Germany (DE)
- France (FR)
- Japan (JP)
- India (IN)
- And many more

Document types include:
- Passport photos
- Visa photos
- ID cards
- Custom specifications

## API Usage

### How do I get an API token?

Contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com) with your business details and use case. We'll provide you with API credentials and help you get started.

### What file formats are supported?

We support the following image formats:
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)

### What is the maximum file size?

The maximum upload size for each photo is **9MB**.

### How long does processing take?

Processing typically takes 2-5 seconds per photo. The exact time depends on image size and server load.

### Can I process multiple photos at once?

Currently, the API processes one photo per request. For multiple photos, you'll need to make separate API calls. We recommend implementing a queue system for batch processing.

### What happens if my photo fails validation?

If your photo has validation errors, the API will return the errors in the response. You can retry with the same `request_id` to increment the trial number. Common validation errors include:
- Face not straight
- Blurred photo
- Too dark
- Glasses detected
- Hat detected
- And more

## Pricing & Billing

### How much does the API cost?

We offer competitive pay-per-use pricing with no setup fees. Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) for detailed pricing information based on your volume and requirements.

### Do you charge for failed transactions?

No, we do not charge for failed transactions or processing errors. You only pay for successful photo processing.

### Is there a free trial available?

Yes, we offer a free trial for new customers. Contact our sales team to arrange your trial period.

### Are there volume discounts?

Yes, we offer volume discounts for high-volume customers. Contact our sales team for enterprise pricing.

## Technical Questions

### What is the API response format?

The API returns JSON responses with the following structure:

```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "trial_number": 1,
  "document_image_base64": "base64_encoded_image_data",
  "message": "Photo created successfully",
  "validation_errors": []
}
```

### How do I handle the base64 image data?

The processed image is returned as a base64-encoded string. You can decode it to save as a file:

**Python:**
```python
import base64
with open('processed_photo.jpg', 'wb') as f:
    f.write(base64.b64decode(result['document_image_base64']))
```

**JavaScript:**
```javascript
const imageData = atob(result.document_image_base64);
const bytes = new Uint8Array(imageData.length);
for (let i = 0; i < imageData.length; i++) {
    bytes[i] = imageData.charCodeAt(i);
}
const blob = new Blob([bytes], { type: 'image/jpeg' });
```

### What HTTP status codes should I expect?

- **201 Created**: Photo processed successfully
- **400 Bad Request**: Missing or invalid parameters
- **401 Unauthorized**: Invalid or missing API token
- **500 Internal Server Error**: Server error during processing

### How do I implement retry logic?

We recommend implementing exponential backoff for retry logic:

```python
import time
import requests

def process_photo_with_retry(files, data, headers, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, files=files, data=data, headers=headers)
            if response.status_code == 201:
                return response.json()
            elif response.status_code == 500:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
            return response.json()
        except requests.exceptions.RequestException:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
```

### Can I use custom specifications instead of country codes?

Yes, you can use custom specifications for precise control over photo requirements:

```python
data = {
    'width': 2.0,
    'height': 2.0,
    'units': 'imperial',
    'head_to_height_ratio': 0.75,
    'eye_distance_from_top': 0.5,
    'background_color': '#FFFFFF',
    'dpi': 300
}
```

## Security & Privacy

### Is my data secure?

Yes, we take security seriously:
- All API communications use HTTPS encryption
- We do not store your input or output images
- We only store image hashes for security and tracking
- API tokens are securely managed

### What data do you store?

We store:
- Image hashes (for security and tracking)
- Request parameters (country code, document type, etc.)
- Processing metadata (for analytics and support)

We do NOT store:
- Original input images
- Processed output images
- Personal information

### How long do you retain data?

We retain processing metadata for 12 months for support and analytics purposes. Image hashes are retained for security purposes.

## Support & SLA

### What support options are available?

We offer multiple support channels:
- **AI Support Agent**: Available 24/7 for general inquiries
- **Human Support Team**: Business hours for complex issues
- **Email Support**: [api-support@snap2pass.com](mailto:api-support@snap2pass.com)
- **Documentation**: Comprehensive guides and examples

### What is your SLA?

Our Service Level Agreement includes:
- **Response Time**: < 1 business day for support inquiries
- **Uptime**: 99.9% guaranteed
- **Resolution Time**:
  - Critical issues: 1 business day
  - High priority: 2 business days
  - Normal priority: 5 business days

### How do I report a bug or issue?

Contact our support team at [api-support@snap2pass.com](mailto:api-support@snap2pass.com) with:
- Your API token (for identification)
- Request ID (if available)
- Error details and logs
- Steps to reproduce the issue

## Integration Questions

### Can I integrate with my existing photo booth software?

Yes, our API is designed to integrate easily with existing systems. We provide examples in multiple programming languages and frameworks.

### Do you provide SDKs or libraries?

Currently, we provide comprehensive code examples in Python, JavaScript/React, and Node.js. We're working on official SDKs for popular languages.

### Can I use the API in a mobile app?

Yes, the API works perfectly with mobile applications. We have examples for React Native and other mobile frameworks.

### Is there a sandbox environment for testing?

Yes, we provide a sandbox environment for testing. Contact our sales team to get access to the sandbox API.

### What are the rate limits?

Rate limits depend on your plan. Contact our sales team for specific limits based on your usage requirements.

## Business Questions

### Can I resell your API service?

Yes, we offer reseller programs for partners. Contact our sales team to discuss partnership opportunities.

### Do you offer white-label solutions?

Yes, we can provide white-label solutions for enterprise customers. Contact our sales team for details.

### Can you customize the API for my specific needs?

Yes, we offer customization options for enterprise customers. Contact our sales team to discuss your specific requirements.

### Do you provide training or onboarding?

Yes, we provide comprehensive onboarding and training for new customers. This includes:
- API integration assistance
- Best practices guidance
- Technical support during implementation
- Documentation and examples

---

**Still have questions?** Contact our support team at [api-support@snap2pass.com](mailto:api-support@snap2pass.com) or our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com). 