# Snap2Pass API - Python Examples

This directory contains Python examples for integrating with the Snap2Pass API.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Get your API token:**
   Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) to get your API credentials.

3. **Update the API token:**
   Replace `your_api_token_here` in the example files with your actual API token.

## Examples

### Basic Usage (`basic_usage.py`)

A comprehensive example demonstrating:
- Processing photos with country-specific requirements
- Using custom specifications
- Handling multiple trials
- Error handling and validation

**Usage:**
```bash
python basic_usage.py
```

**Features:**
- US passport photo processing
- Custom visa photo specifications
- Multiple trial handling for Canadian passport
- Automatic photo saving
- Validation error reporting

### Quick Start

```python
from basic_usage import Snap2PassAPI

# Initialize the API client
api = Snap2PassAPI("your_api_token_here")

# Process a US passport photo
response = api.create_photo_with_country_specs(
    photo_path="your_photo.jpg",
    country_code="US",
    document_type="passport"
)

# Save the processed photo
api.save_processed_photo(response, "processed_photo.jpg")
```

## File Structure

```
examples/python/
├── basic_usage.py      # Comprehensive usage example
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Error Handling

The examples include comprehensive error handling for:
- Network errors
- API authentication errors
- Invalid file formats
- Validation errors
- JSON parsing errors

## Validation Errors

The API may return validation errors such as:
- `face_not_straight`
- `blurred_photo`
- `too_dark_photo`
- `eyeglasses_detected`
- And more...

Check the `validation_errors` field in the response to handle these cases.

## Support

For questions about the Python examples, contact [api-support@snap2pass.com](mailto:api-support@snap2pass.com). 