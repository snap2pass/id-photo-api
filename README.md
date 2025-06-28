# Snap2Pass API - Professional Passport & Visa Photo Processing

> Visit our website: [https://www.snap2pass.com/](https://www.snap2pass.com/)

<div align="center">
  <img src="https://img.shields.io/badge/API-Version%201.0-blue.svg" alt="API Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Support-24%2F7-brightgreen.svg" alt="Support">
</div>

<div align="center">
  <h3>Transform any photo into compliant passport and visa photos instantly</h3>
  <p>Professional AI-powered photo processing with 99.9% accuracy and 24/7 support</p>
</div>

## 🚀 Quick Start

Get started with Snap2Pass API in under 5 minutes:

### Python Example
```python
import requests
import base64

# Your API credentials
API_TOKEN = "your_api_token_here"
API_URL = "https://api.snap2pass.com/create-photo"

# Prepare the request
files = {'input_photo': open('photo.jpg', 'rb')}
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

### React Example
```jsx
import React, { useState } from 'react';

function PhotoUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const processPhoto = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('input_photo', file);
    formData.append('country_code', 'US');
    formData.append('document_type', 'passport');

    try {
      const response = await fetch('https://api.snap2pass.com/create-photo', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
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
        <img 
          src={`data:image/jpeg;base64,${result.document_image_base64}`} 
          alt="Processed photo" 
        />
      )}
    </div>
  );
}
```

## ✨ Why Choose Snap2Pass?

- **🎯 99.9% Accuracy** - Industry-leading AI technology
- **⚡ Instant Processing** - Get results in seconds
- **🌍 Global Coverage** - Support for 200+ countries
- **🔒 Secure & Private** - No image storage, only hashes
- **📱 Easy Integration** - Simple REST API
- **🛡️ 99.9% Uptime SLA** - Reliable service
- **🎨 Multiple Formats** - JPEG, PNG support
- **📏 Flexible Sizing** - Custom dimensions or country-specific

## 📋 Features

### Smart Photo Processing
- Automatic background removal
- Face detection and alignment
- Size and ratio adjustment
- Quality enhancement

### Comprehensive Validation
- Face straightness detection
- Blur detection
- Lighting validation
- Accessories detection (glasses, hats, etc.)
- Clothing verification

### Global Document Support
- Passport photos for 200+ countries
- Visa applications
- ID cards
- Custom specifications

## 🔧 Installation & Setup

### 1. Get Your API Token
Contact our sales team at [sales@snap2pass.com](mailto:sales@snap2pass.com) to get your API credentials.

### 2. Choose Your Integration Method

<details>
<summary><b>Python Integration</b></summary>

```bash
pip install requests pillow
```

See [Python Examples](./examples/python/) for complete code samples.

</details>

<details>
<summary><b>React/JavaScript Integration</b></summary>

```bash
npm install axios
# or
yarn add axios
```

See [React Examples](./examples/react/) for complete code samples.

</details>

<details>
<summary><b>Node.js Integration</b></summary>

```bash
npm install axios form-data
```

See [Node.js Examples](./examples/nodejs/) for complete code samples.

</details>

## 📚 Documentation

- [📖 Full API Documentation](./docs/api-docs.md)
- [🚀 Quick Start Guide](./docs/quickstart.md)
- [💡 Code Examples](./examples/)
- [🔧 Integration Guides](./docs/integrations/)
- [❓ FAQ](./docs/faq.md)

## 🛠️ API Endpoints

### POST /create-photo
Process and validate passport/visa photos with automatic background removal and compliance checking.

**Base URL:** `https://api.snap2pass.com`

**Features:**
- Multipart form data upload
- Country-specific document requirements
- Custom dimension support
- Real-time validation
- Base64 encoded response

## 💰 Pricing

We offer competitive pricing with no hidden fees:

- **Pay per use** - Only pay for successful transactions
- **No setup fees** - Start using immediately
- **Volume discounts** - Contact sales for enterprise pricing
- **Free failed transactions** - We don't charge for processing errors

Contact [sales@snap2pass.com](mailto:sales@snap2pass.com) for detailed pricing information.

## 🎯 Use Cases

- **Travel Agencies** - Process client photos for visa applications
- **Photo Studios** - Offer passport photo services
- **Government Services** - Streamline document processing
- **Mobile Apps** - Integrate photo processing capabilities
- **E-commerce** - Add photo services to your platform

## 🚀 Getting Started

1. **Contact Sales** - Get your API credentials
2. **Choose Your Language** - Pick from our code examples
3. **Test Integration** - Use our sandbox environment
4. **Go Live** - Deploy to production

## 📞 Support

We're here to help you succeed:

- **🤖 AI Support Agent** - Available 24/7
- **👥 Human Support Team** - Business hours
- **📧 Email Support** - [api-support@snap2pass.com](mailto:api-support@snap2pass.com)
- **📖 Documentation** - Comprehensive guides and examples

### Service Level Agreement
- **Response Time:** < 1 business day
- **Uptime:** 99.9% guaranteed
- **Resolution:** 1-5 business days based on priority

## 🔗 Links

- **Website:** [snap2pass.com](https://snap2pass.com)
- **Support:** [api-support@snap2pass.com](mailto:api-support@snap2pass.com)
- **Sales:** [sales@snap2pass.com](mailto:sales@snap2pass.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Snap2Pass team</p>
  <p>Transform your photos into compliant documents today!</p>
</div> 