# Quick Start Guide - Snap2Pass API

Get started with Snap2Pass API in under 5 minutes! This guide will help you process your first passport or visa photo.

## 🚀 Prerequisites

- An API token from Snap2Pass (contact [sales@snap2pass.com](mailto:sales@snap2pass.com))
- A photo file (JPEG or PNG, max 9MB)
- Basic knowledge of HTTP requests

## 📋 Step 1: Get Your API Token

1. Contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com)
2. Provide your business details and use case
3. Receive your API token and documentation

## 🔧 Step 2: Choose Your Integration Method

### Option A: Python (Recommended for beginners)

```bash
pip install requests
```

```python
import requests
import base64

# Your API credentials
API_TOKEN = "your_api_token_here"
API_URL = "https://api.snap2pass.com/create-photo"

# Prepare the request
files = {'input_photo': open('your_photo.jpg', 'rb')}
data = {
    'country_code': 'US',
    'document_type': 'passport'
}
headers = {'Authorization': f'Bearer {API_TOKEN}'}

# Make the API call
response = requests.post(API_URL, files=files, data=data, headers=headers)

if response.status_code == 201:
    result = response.json()
    # Save the processed photo
    with open('processed_photo.jpg', 'wb') as f:
        f.write(base64.b64decode(result['document_image_base64']))
    print("✅ Photo processed successfully!")
else:
    print(f"❌ Error: {response.json()}")
```

### Option B: JavaScript/React

```bash
npm install axios
```

```javascript
import axios from 'axios';

const API_TOKEN = 'your_api_token_here';
const API_URL = 'https://api.snap2pass.com/create-photo';

const processPhoto = async (file) => {
  const formData = new FormData();
  formData.append('input_photo', file);
  formData.append('country_code', 'US');
  formData.append('document_type', 'passport');

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Photo processed successfully!', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

### Option C: cURL (Command Line)

```bash
curl -X POST https://api.snap2pass.com/create-photo \
  -H "Authorization: Bearer your_api_token_here" \
  -F "input_photo=@/path/to/your/photo.jpg" \
  -F "country_code=US" \
  -F "document_type=passport"
```

## 📸 Step 3: Test with Your First Photo

1. **Prepare your photo:**
   - Format: JPEG or PNG
   - Size: Less than 9MB
   - Content: Clear face shot with neutral expression

2. **Choose your specifications:**
   - **Country-specific:** Use `country_code` and `document_type`
   - **Custom:** Use `width`, `height`, `units`, etc.

3. **Make your first API call** using one of the examples above

4. **Check the response:**
   ```json
   {
     "request_id": "123e4567-e89b-12d3-a456-426614174000",
     "trial_number": 1,
     "document_image_base64": "/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcU...",
     "message": "Photo created successfully",
     "validation_errors": []
   }
   ```

## ✅ Step 4: Handle Validation Errors

If your photo has validation errors, you'll see them in the response:

```json
{
  "validation_errors": [
    "face_not_straight",
    "too_dark_photo"
  ]
}
```

Common validation errors and solutions:

| Error | Solution |
|-------|----------|
| `face_not_straight` | Ensure face is centered and straight |
| `blurred_photo` | Use a clear, high-quality image |
| `too_dark_photo` | Improve lighting or use a brighter photo |
| `eyeglasses_detected` | Remove glasses for the photo |
| `hat_detected` | Remove hat or head covering |
| `sunglasses_detected` | Remove sunglasses |
| `mouth_open` | Keep mouth closed with neutral expression |
| `eyes_not_open` | Ensure eyes are open and visible |

## 🔄 Step 5: Multiple Trials

If your first attempt has validation errors, you can retry with the same `request_id`:

```python
# First attempt
response1 = requests.post(API_URL, files=files, data=data, headers=headers)
result1 = response1.json()
request_id = result1['request_id']

# Second attempt (if needed)
data['request_id'] = request_id
response2 = requests.post(API_URL, files=files, data=data, headers=headers)
result2 = response2.json()
# Trial number will be incremented to 2
```

## 🎯 Step 6: Production Integration

Once you've tested successfully:

1. **Implement error handling** for network issues and API errors
2. **Add retry logic** for failed requests
3. **Implement validation error handling** to guide users
4. **Add logging** for debugging and monitoring
5. **Consider rate limiting** to stay within your plan limits

## 📚 Next Steps

- Read the [Full API Documentation](./api-docs.md)
- Explore [Code Examples](../examples/)
- Check out [Integration Guides](./integrations/)
- Review the [FAQ](./faq.md)

## 🆘 Need Help?

- **Support:** [api-support@snap2pass.com](mailto:api-support@snap2pass.com)
- **Sales:** [sales@snap2pass.com](mailto:sales@snap2pass.com)

## 🎉 Congratulations!

You've successfully integrated with Snap2Pass API! Your application can now process passport and visa photos automatically.

---

**Pro Tip:** Start with country-specific requirements for easier integration, then move to custom specifications as needed. 