#!/usr/bin/env node

/**
 * Snap2Pass API - Node.js Photo Processor
 * 
 * This example demonstrates how to use the Snap2Pass API to process
 * passport and visa photos using Node.js with the new JSON-based API.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class Snap2PassAPI {
  /**
   * Initialize the Snap2Pass API client
   * @param {string} apiKey - Your Snap2Pass API key
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.snap2pass.com';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  /**
   * Process a photo using the Snap2Pass API
   * @param {string} photoPath - Path to the input photo file
   * @param {string} documentId - Document type identifier (e.g., 'us-passport', 'uk-passport')
   * @returns {Promise<Object>} API response
   */
  async processPhoto(photoPath, documentId) {
    try {
      // Read and encode image to base64
      const imageBuffer = fs.readFileSync(photoPath);
      const base64Image = imageBuffer.toString('base64');

      // Make the API call
      const response = await axios.post(`${this.baseURL}/process-photo`, {
        photo: base64Image,
        document_id: documentId
      }, {
        headers: this.headers
      });

      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download an image from a CloudFront URL
   * @param {string} imageUrl - CloudFront URL of the image
   * @param {string} outputPath - Path where to save the downloaded image
   * @returns {Promise<void>}
   */
  async downloadImage(imageUrl, outputPath) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(outputPath, response.data);
      console.log(`✅ Image downloaded to: ${outputPath}`);
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  /**
   * Handle API response and return parsed data
   * @param {Object} response - HTTP response from the API
   * @returns {Object} Parsed response data
   */
  handleResponse(response) {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`API Error (${response.status}): ${response.data?.error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const errorData = data?.error || {};
      const code = errorData.code || 'UNKNOWN';
      const message = errorData.message || 'Unknown error';
      
      if (status === 401) {
        return new Error(`Authentication Error: ${message}`);
      } else if (status === 402) {
        const credits = errorData.details?.current_credits || 0;
        return new Error(`Insufficient Credits: ${message} (Credits: ${credits})`);
      } else if (status === 400) {
        return new Error(`Validation Error [${code}]: ${message}`);
      } else {
        return new Error(`API Error (${status}): ${message}`);
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection and try again.');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Validate file before processing
   * @param {string} filePath - Path to the file to validate
   * @returns {boolean} True if file is valid
   */
  validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (stats.size > maxSize) {
      throw new Error(`File size exceeds 5MB limit: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file format: ${ext}. Supported formats: ${allowedExtensions.join(', ')}`);
    }

    return true;
  }
}

/**
 * Process photo with retry logic for transient errors
 * @param {Snap2PassAPI} api - Snap2PassAPI instance
 * @param {string} photoPath - Path to photo file
 * @param {string} documentId - Document type identifier
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Object>} API response data
 */
async function processWithRetry(api, photoPath, documentId, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await api.processPhoto(photoPath, documentId);
    } catch (error) {
      const errorMsg = error.message;
      
      // Don't retry client errors
      if (errorMsg.includes('Authentication Error') || 
          errorMsg.includes('Validation Error') || 
          errorMsg.includes('Insufficient Credits')) {
        throw error;
      }
      
      // Retry server errors
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt);
        console.log(`⚠️ Error: ${errorMsg}`);
        console.log(`🔄 Retrying in ${waitTime} seconds... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Main example function
 */
async function main() {
  // Get API key from environment variable or use placeholder
  const API_KEY = process.env.SNAP2PASS_API_KEY || 'your_api_key_here';
  
  if (API_KEY === 'your_api_key_here') {
    console.log('❌ Please set your API key in the SNAP2PASS_API_KEY environment variable');
    console.log('   or update the API_KEY variable in the script');
    return;
  }
  
  // Initialize the API client
  const api = new Snap2PassAPI(API_KEY);

  try {
    // Example 1: Process US passport photo
    console.log('='.repeat(70));
    console.log('🛂 Example 1: Processing US passport photo');
    console.log('='.repeat(70));
    
    const photoPath = 'sample_photo.jpg';
    
    if (!fs.existsSync(photoPath)) {
      console.log(`⚠️ Sample photo not found: ${photoPath}`);
      console.log('   Please provide a valid photo file to test the API');
      return;
    }
    
    api.validateFile(photoPath);
    
    const response1 = await api.processPhoto(photoPath, 'us-passport');

    console.log('✅ Success!');
    console.log(`📝 Request ID: ${response1.request_id}`);
    console.log(`📊 Validation Score: ${response1.validation.score}/100`);
    console.log(`✓  Validation Passed: ${response1.validation.passed}`);
    console.log(`💬 Summary: ${response1.validation.summary}`);

    // Check for validation warnings
    if (response1.validation.warnings && response1.validation.warnings.length > 0) {
      console.log('⚠️  Validation Warnings:');
      response1.validation.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }

    // Check for validation errors
    if (response1.validation.errors && response1.validation.errors.length > 0) {
      console.log('❌ Validation Errors:');
      response1.validation.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    } else {
      console.log('✅ No validation errors!');
    }

    // Download the processed photo
    console.log('\n📥 Downloading processed photo...');
    await api.downloadImage(response1.image_urls.output, 'us_passport_photo.jpg');

    console.log('\n🔗 CloudFront URLs:');
    console.log(`   Input:  ${response1.image_urls.input}`);
    console.log(`   Output: ${response1.image_urls.output}`);
    console.log('\n⏰ Images will be available for 30 days');

    console.log('\n' + '='.repeat(70) + '\n');

    // Example 2: Process UK passport photo
    console.log('='.repeat(70));
    console.log('🇬🇧 Example 2: Processing UK passport photo');
    console.log('='.repeat(70));
    
    const response2 = await api.processPhoto(photoPath, 'uk-passport');

    console.log('✅ Success!');
    console.log(`📝 Request ID: ${response2.request_id}`);
    console.log(`📊 Validation Score: ${response2.validation.score}/100`);

    // Download the processed photo
    await api.downloadImage(response2.image_urls.output, 'uk_passport_photo.jpg');

    console.log('\n' + '='.repeat(70) + '\n');

    // Example 3: Using retry logic
    console.log('='.repeat(70));
    console.log('🔄 Example 3: Processing with retry logic');
    console.log('='.repeat(70));
    
    const response3 = await processWithRetry(api, photoPath, 'ca-passport', 3);

    console.log('✅ Success with retries!');
    console.log(`📊 Validation Score: ${response3.validation.score}/100`);
    await api.downloadImage(response3.image_urls.output, 'ca_passport_photo.jpg');

    console.log('\n' + '='.repeat(70) + '\n');

    // Example 4: Batch processing multiple photos
    console.log('='.repeat(70));
    console.log('📸 Example 4: Batch processing multiple photos');
    console.log('='.repeat(70));

    const photos = [
      { path: 'photo1.jpg', documentId: 'us-passport' },
      { path: 'photo2.jpg', documentId: 'uk-passport' },
      { path: 'photo3.jpg', documentId: 'eu-passport' },
    ];

    const results = [];
    for (let i = 0; i < photos.length; i++) {
      const { path: photoPath, documentId } = photos[i];
      
      if (!fs.existsSync(photoPath)) {
        console.log(`⚠️  Skipping ${photoPath} (file not found)`);
        continue;
      }

      try {
        console.log(`\n[${i + 1}/${photos.length}] Processing ${photoPath} (${documentId})...`);
        const response = await api.processPhoto(photoPath, documentId);

        console.log(`   ✅ Score: ${response.validation.score}/100`);

        // Download processed photo
        const outputFilename = `processed_${i + 1}_${documentId}.jpg`;
        await api.downloadImage(response.image_urls.output, outputFilename);

        results.push({
          input: photoPath,
          documentId: documentId,
          success: true,
          score: response.validation.score,
          output: outputFilename
        });

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.push({
          input: photoPath,
          documentId: documentId,
          success: false,
          error: error.message
        });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 Batch Processing Summary');
    console.log('='.repeat(70));
    const successful = results.filter(r => r.success).length;
    console.log(`Total: ${results.length} | Success: ${successful} | Failed: ${results.length - successful}`);

    results.forEach((result, i) => {
      if (result.success) {
        console.log(`  ${i + 1}. ✅ ${result.input} → Score: ${result.score}/100`);
      } else {
        console.log(`  ${i + 1}. ❌ ${result.input} → ${result.error || 'Unknown error'}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Example of using the API with async/await and error handling
 */
async function processPhotoExample() {
  const api = new Snap2PassAPI(process.env.SNAP2PASS_API_KEY || 'your_api_key_here');

  try {
    // Process a photo with comprehensive error handling
    const result = await api.processPhoto('photo.jpg', 'us-passport');

    // Handle the result
    if (result.validation.errors && result.validation.errors.length > 0) {
      console.log('Photo has validation issues:');
      result.validation.errors.forEach(error => {
        console.log(`- ${error}`);
      });
    } else {
      console.log('Photo processed successfully!');
      await api.downloadImage(result.image_urls.output, 'processed_photo.jpg');
    }

  } catch (error) {
    console.error('Failed to process photo:', error.message);
  }
}

/**
 * Example of batch processing multiple photos
 */
async function batchProcessPhotos(photoPaths, documentId = 'us-passport') {
  const api = new Snap2PassAPI(process.env.SNAP2PASS_API_KEY || 'your_api_key_here');
  const results = [];

  for (const photoPath of photoPaths) {
    try {
      console.log(`Processing ${photoPath}...`);
      const result = await api.processPhoto(photoPath, documentId);
      results.push({ photoPath, success: true, result });
      
      // Save with unique filename
      const filename = path.basename(photoPath, path.extname(photoPath));
      await api.downloadImage(result.image_urls.output, `processed_${filename}.jpg`);
      
    } catch (error) {
      console.error(`Failed to process ${photoPath}:`, error.message);
      results.push({ photoPath, success: false, error: error.message });
    }
  }

  return results;
}

// Export the class and functions for use in other modules
module.exports = {
  Snap2PassAPI,
  processPhotoExample,
  batchProcessPhotos,
  processWithRetry
};

// Run the main example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
