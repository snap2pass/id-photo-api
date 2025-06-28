# Snap2Pass API Documentation

> Visit our website: [https://www.snap2pass.com/](https://www.snap2pass.com/)

> Professional Passport & Visa Photo Processing API

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Validation Errors](#validation-errors)
- [Privacy & Security](#privacy--security)
- [Support & SLA](#support--sla)
- [Supported Document Types](#supported-document-types)

## Getting Started

To create an account and start using our API, please contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com). They will guide you through the account creation process and provide you with the necessary API credentials.

### Overview

This API processes and validates passport or visa photos based on specified document requirements. It accepts multipart form data, processes the image, validates it, and returns the processed image and validation errors if any. Users can submit multiple trials for the same request until the photo meets the required standards.

**Note:** The maximum upload size for each photo is 9MB.

### Base URL

```
https://api.snap2pass.com
```

## Authentication

We use API tokens for authentication. To authenticate your requests, include your API token in the header of each request:

```
Authorization: Bearer YOUR_API_TOKEN
```

Replace `YOUR_API_TOKEN` with the actual API token provided to you.

To obtain an API token, please contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com).

## API Endpoints

### POST /create-photo

#### Description

This endpoint accepts a photo and form data, processes the photo according to specified document requirements, validates it, and returns the processed photo along with any validation errors. If a `request_id` is provided, the trial number is incremented for subsequent submissions of the same request.

#### Request

**Headers**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer YOUR_API_TOKEN`

**Body Parameters (multipart/form-data)**

**Required:**
- `input_photo` (file) - The photo to be processed. Maximum upload size: 9MB.

**Optional:**
- `request_id` (string) - Unique identifier for the request. If provided, the trial number will be incremented.

**Document Specifications (Choose one set):**

**Set 1: Using Document Specifications**
- `country_code` (string) - The country code for the document.
- `document_type` (string) - The type of document (e.g., "passport", "visa").

**Set 2: Custom Specifications**
- `width` (float) - The width of the photo in the specified units.
- `height` (float) - The height of the photo in the specified units.
- `units` (string) - The units of the dimensions ("imperial" or "metric").
- `head_to_height_ratio` (float) - The ratio of the head size to the total height of the photo.
- `eye_distance_from_top` (float) - The distance of the eyes from the top of the photo.
- `background_color` (string) - The background color in hex format (e.g., "#FFFFFF").
- `dpi` (int) - The resolution of the photo in dots per inch.

#### Example Requests

**Example 1: Using Document Specifications**

```bash
curl -X POST https://api.snap2pass.com/create-photo \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "input_photo=@/path/to/photo.jpg" \
  -F "country_code=US" \
  -F "document_type=visa"
```

**Example 2: Using Custom Specifications**

```bash
curl -X POST https://api.snap2pass.com/create-photo \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "input_photo=@/path/to/photo.jpg" \
  -F "width=2" \
  -F "height=2" \
  -F "units=imperial" \
  -F "head_to_height_ratio=0.75" \
  -F "eye_distance_from_top=0.5" \
  -F "background_color=#FFFFFF" \
  -F "dpi=300"
```

#### Response

**Status Code:** `201 Created`

**Body (application/json):**
- `request_id` (string) - Unique identifier for the request. If a `request_id` was provided, it will be the same; otherwise, a new one will be generated.
- `trial_number` (int) - Trial number for the request. Increments if a `request_id` is provided.
- `document_image_base64` (string) - Base64 encoded processed image.
- `message` (string) - Success message.
- `validation_errors` (array of strings) - List of validation errors, if any.

#### Example Response

```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "trial_number": 1,
  "document_image_base64": "/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcU...",
  "message": "Photo created successfully",
  "validation_errors": []
}
```

## Error Handling

### 400 Bad Request
Missing or invalid parameters.

**Example Response:**
```json
{
  "message": "Missing parameter: width"
}
```

### 401 Unauthorized
Invalid or missing API token.

**Example Response:**
```json
{
  "message": "Invalid API token"
}
```

### 500 Internal Server Error
Server error while processing the request.

**Example Response:**
```json
{
  "message": "Failed to decode image: unsupported format"
}
```

## Validation Errors

The following validation errors might be returned in the `validation_errors` array:

| Error Code | Description |
|------------|-------------|
| `face_not_straight` | The face in the photo is not straight |
| `blurred_photo` | The photo is blurred |
| `too_dark_photo` | The photo is too dark |
| `eyeglasses_detected` | Eyeglasses are detected in the photo |
| `hat_detected` | A hat is detected in the photo |
| `sunglasses_detected` | Sunglasses are detected in the photo |
| `mouth_open` | The mouth is open in the photo |
| `eyes_not_open` | The eyes are not open in the photo |
| `no_clothing` | The person in the photo is not wearing clothing |
| `not_light_color_background` | The background is not a light color |
| `left_ear_not_visible` | The left ear is not visible |
| `right_ear_not_visible` | The right ear is not visible |
| `camera_too_close` | The camera is too close to the subject |

## Privacy & Security

We take the privacy and security of your data seriously. Here's how we handle the information you send to our API:

- **Image Data**: We do not store the input or output images. For security and tracking purposes, we only store a hash of the image.
- **Other Parameters**: All other parameters sent with your request (such as country code, document type, or custom specifications) are stored for processing and analytics purposes.

This approach allows us to maintain the necessary records for our service while ensuring the highest level of privacy and security for your sensitive image data.

## Accuracy

Due to the nature of AI models, there is a small margin of error in our services:

- We may occasionally fail to remove the background or provide an incorrect validation.
- This occurs at a rate of approximately 3% of all transactions.
- We do not charge for these unsuccessful transactions.

We continuously work on improving our AI models to increase accuracy and reduce this error rate.

## Support & SLA

We offer multiple levels of support to ensure you get the help you need:

- **AI Support Agent**: Available 24/7 for general inquiries and common issues.
- **Human Support Team**: For more complex issues that require personal attention.

### Service Level Agreement (SLA)

- **Response Time**: We aim to respond to all support inquiries within 1 business day.
- **Resolution Time**:
  - Critical issues: 1 business day
  - High priority issues: 2 business days
  - Normal priority issues: 5 business days
- **Service Uptime**: We guarantee 99.9% uptime for our API services.

For urgent matters or if you need to escalate an issue, please contact our dedicated support line at [api-support@snap2pass.com](mailto:api-support@snap2pass.com).

## Additional Information

### Supported Image Formats

The API currently supports the following input image formats:

1. **JPEG** (.jpg, .jpeg)
2. **PNG** (.png)

Please ensure that your input photos are in one of these formats to ensure successful processing.

### Testing the API

If you want to test the API and save the results, you can use the following bash script:

```bash
# Send request to API and save response
curl --location 'https://api.snap2pass.com/create-photo' \
--header 'Authorization: Bearer YOUR_API_TOKEN' \
--form 'input_photo=@"/path/to/your/photo.jpg"' \
--form 'country_code="US"' \
--form 'document_type="passport"' > response.json

# Extract base64 image data and decode to image file
base64_string=$(jq -r '.document_image_base64' response.json)

# Display other JSON parameters
echo "Other JSON parameters:"
jq 'del(.document_image_base64)' response.json

# Save the processed image
echo "$base64_string" | base64 --decode > output_image.jpg
```

### Important Notes

- The API requires specific document dimensions and specifications if country code and document type are not provided.
- The photo is processed and validated based on the provided or default document specifications.
- The API responds with the processed image and any validation errors found during the processing.
- All requests and responses are logged for debugging and traceability purposes. Ensure that sensitive information is handled appropriately in logs.

## Contact

For further information or support, please contact our API support team at [api-support@snap2pass.com](mailto:api-support@snap2pass.com).

## Supported Document Types

Below is a list of standard supported document types and specifications. You can use these IDs and parameters for country-specific or custom photo processing.

| ID | Label | Size | DPI | Units |
|----|-------|------|-----|-------|
| standard-2x2-600 | Standard 2x2 inch (600 DPI) | 2x2 inch | 600 | Imperial |
| standard-35x45-600 | Standard 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| standard-35x45-600-au | Standard 35x45 mm (600 DPI, AU variant) | 35x45 mm | 600 | Metric |
| baby-2x2-600 | Baby 2x2 inch (600 DPI) | 2x2 inch | 600 | Imperial |
| baby-35x45-600 | Baby 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| cambodian-2x2-300 | Cambodian 2x2 inch (300 DPI) | 2x2 inch | 300 | Imperial |
| canada-visa-35x45-300 | Canada Visa 35x45 mm (300 DPI, off-white) | 35x45 mm | 300 | Metric |
| canada-passport-50x70-600 | Canada Passport 50x70 mm (600 DPI) | 50x70 mm | 600 | Metric |
| chinese-33x48-600 | Chinese 33x48 mm (600 DPI) | 33x48 mm | 600 | Metric |
| chinese-visa-33x48-600 | Chinese Visa 33x48 mm (600 DPI, no jewelry) | 33x48 mm | 600 | Metric |
| dutch-35x45-600 | Dutch 35x45 mm (600 DPI, off-white) | 35x45 mm | 600 | Metric |
| french-35x45-600 | French 35x45 mm (600 DPI, off-white) | 35x45 mm | 600 | Metric |
| german-35x45-600 | German 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| greek-40x60-300 | Greek 40x60 mm (300 DPI, off-white) | 40x60 mm | 300 | Metric |
| hongkong-40x50-815 | Hong Kong 40x50 mm (815 DPI) | 40x50 mm | 815 | Metric |
| indian-2x2-300 | Indian 2x2 inch (300 DPI, off-white) | 2x2 inch | 300 | Imperial |
| indonesian-40x60-300 | Indonesian 40x60 mm (300 DPI) | 40x60 mm | 300 | Metric |
| japanese-35x45-600 | Japanese 35x45 mm (600 DPI, off-white) | 35x45 mm | 600 | Metric |
| japan-residence-30x40-600 | Japan Residence 30x40 mm (600 DPI, off-white) | 30x40 mm | 600 | Metric |
| malaysian-passport-35x50-300 | Malaysian Passport 35x50 mm (300 DPI) | 35x50 mm | 300 | Metric |
| malaysian-visa-35x45-600 | Malaysian Visa 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| mexican-35x45-600 | Mexican 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| russian-35x45-600 | Russian 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| saudi-arabia-2x2-300 | Saudi Arabia 2x2 inch (300 DPI, off-white) | 2x2 inch | 300 | Imperial |
| schengen-35x45-600 | Schengen 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| egyptian-35x45-600 | Egyptian 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| south-korean-35x45-600 | South Korean 35x45 mm (600 DPI, off-white) | 35x45 mm | 600 | Metric |
| spain-residence-26x32-600 | Spain Residence 26x32 mm (600 DPI) | 26x32 mm | 600 | Metric |
| spanish-passport-30x40-600 | Spanish Passport 30x40 mm (600 DPI) | 30x40 mm | 600 | Metric |
| taiwan-35x45-600 | Taiwan 35x45 mm (600 DPI) | 35x45 mm | 600 | Metric |
| thailand-40x60-600 | Thailand 40x60 mm (600 DPI) | 40x60 mm | 600 | Metric |
| turkish-50x60-300 | Turkish 50x60 mm (300 DPI, off-white) | 50x60 mm | 300 | Metric |
| uk-35x45-600 | UK 35x45 mm (600 DPI, off-white) | 35x45 mm | 600 | Metric |
| uae-40x60-600 | UAE 40x60 mm (600 DPI) | 40x60 mm | 600 | Metric |
| us-baby-2x2-300 | US Baby 2x2 inch (300 DPI) | 2x2 inch | 300 | Imperial |
| us-standard-2x2-300 | US Standard 2x2 inch (300 DPI) | 2x2 inch | 300 | Imperial |
| us-uscis-2x2-301 | US USCIS 2x2 inch (301 DPI) | 2x2 inch | 301 | Imperial |
| vietnamese-passport-40x60-300 | Vietnamese Passport 40x60 mm (300 DPI) | 40x60 mm | 300 | Metric |
| vietnamese-visa-40x60-300 | Vietnamese Visa 40x60 mm (300 DPI) | 40x60 mm | 300 | Metric |

> For a full list of parameters and advanced options, see the API and code examples. 