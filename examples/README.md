# Snap2Pass API Examples

This directory contains comprehensive code examples for integrating with the Snap2Pass API in multiple programming languages and frameworks.

## 🚀 Quick Start

Choose your preferred language and get started in minutes:

| Language | Setup | Example |
|----------|-------|---------|
| **Python** | `pip install requests` | [Basic Usage](./python/basic_usage.py) |
| **React** | `npm install` | [Photo Processor](./react/PhotoProcessor.jsx) |
| **Node.js** | `npm install` | [Photo Processor](./nodejs/photo-processor.js) |

## 📁 Available Examples

### Python Examples
**Location:** `./python/`

- **`basic_usage.py`** - Comprehensive example with country-specific and custom specifications
- **`requirements.txt`** - Python dependencies
- **`README.md`** - Python-specific documentation

**Features:**
- Object-oriented API client
- Country-specific photo processing
- Custom specifications support
- Multiple trial handling
- Comprehensive error handling
- Automatic photo saving

**Best for:** Backend services, automation scripts, data processing

### React Examples
**Location:** `./react/`

- **`PhotoProcessor.jsx`** - Full-featured React component with UI
- **`PhotoProcessor.css`** - Modern, responsive styling
- **`package.json`** - React dependencies
- **`README.md`** - React-specific documentation

**Features:**
- Modern React hooks and functional components
- Drag-and-drop file upload
- Real-time validation feedback
- Country and custom specification modes
- Responsive design
- Download functionality

**Best for:** Web applications, user-facing interfaces, photo upload services

### Node.js Examples
**Location:** `./nodejs/`

- **`photo-processor.js`** - Complete Node.js API client
- **`package.json`** - Node.js dependencies
- **`README.md`** - Node.js-specific documentation

**Features:**
- Modern async/await patterns
- File validation and processing
- Batch processing capabilities
- Comprehensive error handling
- File management utilities

**Best for:** Server-side applications, microservices, API integrations

## 🎯 Choosing the Right Example

### For Web Applications
**Choose React** if you're building:
- User-facing photo upload interfaces
- Real-time photo processing applications
- Interactive web applications
- Photo booth software

### For Backend Services
**Choose Python** if you're building:
- REST API services
- Automated photo processing
- Data analysis pipelines
- Integration with existing Python systems

### For Server Applications
**Choose Node.js** if you're building:
- Express.js applications
- Microservices
- Real-time applications
- Integration with Node.js ecosystems

## 🔧 Common Integration Patterns

### Basic Photo Processing
All examples demonstrate:
```javascript
// Upload photo and get processed result
const result = await api.processPhoto(photoFile, 'US', 'passport');
```

### Error Handling
All examples include:
```javascript
try {
  const result = await api.processPhoto(photoFile, 'US', 'passport');
  // Handle success
} catch (error) {
  // Handle validation errors, network issues, etc.
}
```

### Multiple Trials
All examples support:
```javascript
// First attempt
const response1 = await api.processPhoto(photoFile, 'US', 'passport');
const requestId = response1.request_id;

// Retry with same request ID
const response2 = await api.processPhoto(photoFile, 'US', 'passport', requestId);
```

## 📋 API Features Demonstrated

### Core Functionality
- ✅ Photo upload and processing
- ✅ Country-specific requirements
- ✅ Custom specifications
- ✅ Validation error handling
- ✅ Multiple trial support
- ✅ File format validation
- ✅ Size limit enforcement

### Advanced Features
- ✅ Background removal
- ✅ Face detection and alignment
- ✅ Quality enhancement
- ✅ Compliance validation
- ✅ Base64 image handling
- ✅ Error recovery
- ✅ Batch processing

## 🛠️ Setup Instructions

### Prerequisites
1. **API Token**: Contact [sales@snap2pass.com](mailto:sales@snap2pass.com)
2. **Photo File**: JPEG or PNG, max 9MB
3. **Development Environment**: Choose your preferred language

### Quick Setup
```bash
# Python
cd examples/python
pip install -r requirements.txt
python basic_usage.py

# React
cd examples/react
npm install
npm start

# Node.js
cd examples/nodejs
npm install
npm start
```

## 📚 Learning Path

### Beginner
1. Start with the **Quick Start Guide** in the main README
2. Choose your preferred language example
3. Run the basic example with your API token
4. Understand the response format and validation errors

### Intermediate
1. Explore custom specifications
2. Implement error handling and retry logic
3. Add file validation and preprocessing
4. Integrate with your existing application

### Advanced
1. Implement batch processing
2. Add rate limiting and optimization
3. Build production-ready error handling
4. Add monitoring and logging

## 🔍 Example Use Cases

### Travel Agency
- Process client photos for visa applications
- Batch process multiple applications
- Validate photo compliance automatically

### Photo Studio
- Offer passport photo services
- Real-time photo validation
- Professional photo processing

### Government Services
- Streamline document processing
- Automated compliance checking
- Reduce manual review time

### Mobile Apps
- In-app photo processing
- Instant validation feedback
- Professional results

### E-commerce
- Add photo services to your platform
- Automated product photo processing
- Quality assurance

## 🚨 Common Issues & Solutions

### File Size Too Large
```javascript
// Check file size before upload
if (file.size > 9 * 1024 * 1024) {
  throw new Error('File size exceeds 9MB limit');
}
```

### Invalid File Format
```javascript
// Validate file type
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file format');
}
```

### Validation Errors
```javascript
// Handle validation errors
if (result.validation_errors.length > 0) {
  result.validation_errors.forEach(error => {
    console.log(`Validation error: ${error}`);
  });
}
```

### Network Issues
```javascript
// Implement retry logic
const maxRetries = 3;
for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    const result = await api.processPhoto(photoFile, 'US', 'passport');
    break;
  } catch (error) {
    if (attempt === maxRetries) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
}
```

## 📞 Support

### Documentation
- [API Documentation](../docs/api-docs.md)
- [Quick Start Guide](../docs/quickstart.md)
- [FAQ](../docs/faq.md)

### Contact
- **Technical Support**: [api-support@snap2pass.com](mailto:api-support@snap2pass.com)
- **Sales Inquiries**: [sales@snap2pass.com](mailto:sales@snap2pass.com)
- **General Questions**: [info@snap2pass.com](mailto:info@snap2pass.com)

### Community
- **GitHub Issues**: Report bugs and request features
- **Contributions**: Submit improvements and new examples
- **Discussions**: Share experiences and best practices

## 🔄 Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Adding New Examples
1. Create a new directory for your language
2. Follow the existing structure
3. Include comprehensive documentation
4. Add proper error handling
5. Test with real API calls

### Improving Existing Examples
1. Fork the repository
2. Make your improvements
3. Test thoroughly
4. Submit a pull request

---

**Ready to get started?** Choose your preferred language above and begin integrating with the Snap2Pass API! 