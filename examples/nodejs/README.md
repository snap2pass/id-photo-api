# Snap2Pass API - Node.js Examples

This directory contains Node.js examples for integrating with the Snap2Pass API.

## Features

- 📸 **File Upload & Processing** - Upload and process photos with ease
- 🛂 **Country-Specific Support** - Support for 200+ countries
- ⚙️ **Custom Specifications** - Fine-tune photo requirements
- ✅ **Validation Handling** - Comprehensive error and validation handling
- 💾 **File Management** - Save processed photos automatically
- 🔄 **Batch Processing** - Process multiple photos efficiently
- 🛡️ **Error Handling** - Robust error handling with retry logic

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
   Replace `your_api_token_here` in the example files with your actual API token.

4. **Run the example:**
   ```bash
   npm start
   # or
   node photo-processor.js
   ```

## Examples

### Basic Usage

```javascript
const { Snap2PassAPI } = require('./photo-processor');

// Initialize the API client
const api = new Snap2PassAPI('your_api_token_here');

// Process a US passport photo
async function processPhoto() {
  try {
    const result = await api.createPhotoWithCountrySpecs(
      'photo.jpg',
      'US',
      'passport'
    );
    
    console.log('Success:', result.message);
    api.saveProcessedPhoto(result, 'processed_photo.jpg');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

processPhoto();
```

### Custom Specifications

```javascript
const customSpecs = {
  width: 2.0,
  height: 2.0,
  units: 'imperial',
  headToHeightRatio: 0.75,
  eyeDistanceFromTop: 0.5,
  backgroundColor: '#FFFFFF',
  dpi: 300
};

const result = await api.createPhotoWithCustomSpecs(
  'photo.jpg',
  customSpecs
);
```

### Batch Processing

```javascript
const { batchProcessPhotos } = require('./photo-processor');

const photoPaths = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
const results = await batchProcessPhotos(photoPaths, 'US', 'passport');

results.forEach(({ photoPath, success, result, error }) => {
  if (success) {
    console.log(`${photoPath}: Processed successfully`);
  } else {
    console.log(`${photoPath}: Failed - ${error}`);
  }
});
```

## File Structure

```
examples/nodejs/
├── photo-processor.js    # Main API client and examples
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## API Client Features

### Snap2PassAPI Class

The main API client class provides:

- **Constructor**: Initialize with your API token
- **createPhotoWithCountrySpecs()**: Process photos using country-specific requirements
- **createPhotoWithCustomSpecs()**: Process photos with custom specifications
- **saveProcessedPhoto()**: Save processed images to files
- **validateFile()**: Validate file format and size before processing
- **Error Handling**: Comprehensive error handling and formatting

### Methods

#### `createPhotoWithCountrySpecs(photoPath, countryCode, documentType, requestId)`

Process a photo using country-specific document requirements.

**Parameters:**
- `photoPath` (string): Path to the input photo file
- `countryCode` (string): Country code (e.g., 'US', 'CA', 'GB')
- `documentType` (string): Type of document ('passport' or 'visa')
- `requestId` (string, optional): Request ID for tracking trials

**Returns:** Promise<Object> - API response

#### `createPhotoWithCustomSpecs(photoPath, specs, requestId)`

Process a photo using custom specifications.

**Parameters:**
- `photoPath` (string): Path to the input photo file
- `specs` (Object): Custom specifications object
- `requestId` (string, optional): Request ID for tracking trials

**Returns:** Promise<Object> - API response

#### `saveProcessedPhoto(response, outputPath)`

Save the processed photo from the API response.

**Parameters:**
- `response` (Object): API response containing the processed image
- `outputPath` (string): Path where to save the processed photo

#### `validateFile(filePath)`

Validate file before processing.

**Parameters:**
- `filePath` (string): Path to the file to validate

**Returns:** boolean - True if file is valid

**Throws:** Error if file is invalid

## Error Handling

The examples include comprehensive error handling for:

- **File Validation**: Checks file existence, size, and format
- **Network Errors**: Handles connection issues and timeouts
- **API Errors**: Formats and displays server error messages
- **Validation Errors**: Shows photo compliance issues

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

## File Requirements

- **Supported Formats**: JPEG (.jpg, .jpeg), PNG (.png)
- **Maximum Size**: 9MB per file
- **Content**: Clear face shot with neutral expression

## Multiple Trials

If your first attempt has validation errors, you can retry with the same `request_id`:

```javascript
// First attempt
const response1 = await api.createPhotoWithCountrySpecs(
  'photo.jpg',
  'US',
  'passport'
);

const requestId = response1.request_id;

// Second attempt (if needed)
const response2 = await api.createPhotoWithCountrySpecs(
  'photo.jpg',
  'US',
  'passport',
  requestId
);
// Trial number will be incremented to 2
```

## Production Considerations

For production use, consider:

- **Rate Limiting**: Implement rate limiting to stay within your plan limits
- **Retry Logic**: Add exponential backoff for failed requests
- **Logging**: Add comprehensive logging for debugging and monitoring
- **Error Monitoring**: Implement error tracking and alerting
- **File Cleanup**: Clean up temporary files after processing

## Support

For questions about the Node.js examples, contact [api-support@snap2pass.com](mailto:api-support@snap2pass.com).

## License

This project is licensed under the MIT License. 