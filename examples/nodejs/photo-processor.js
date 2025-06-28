#!/usr/bin/env node

/**
 * Snap2Pass API - Node.js Photo Processor
 * 
 * This example demonstrates how to use the Snap2Pass API to process
 * passport and visa photos using Node.js with modern JavaScript features.
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

class Snap2PassAPI {
  /**
   * Initialize the Snap2Pass API client
   * @param {string} apiToken - Your Snap2Pass API token
   */
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.snap2pass.com';
    this.headers = {
      'Authorization': `Bearer ${apiToken}`
    };
  }

  /**
   * Process a photo using country-specific document requirements
   * @param {string} photoPath - Path to the input photo file
   * @param {string} countryCode - Country code (e.g., 'US', 'CA', 'GB')
   * @param {string} documentType - Type of document ('passport' or 'visa')
   * @param {string} requestId - Optional request ID for tracking trials
   * @returns {Promise<Object>} API response
   */
  async createPhotoWithCountrySpecs(photoPath, countryCode, documentType, requestId = null) {
    try {
      const formData = new FormData();
      formData.append('input_photo', fs.createReadStream(photoPath));
      formData.append('country_code', countryCode);
      formData.append('document_type', documentType);

      if (requestId) {
        formData.append('request_id', requestId);
      }

      const response = await axios.post(`${this.baseURL}/create-photo`, formData, {
        headers: {
          ...this.headers,
          ...formData.getHeaders()
        }
      });

      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process a photo using custom specifications
   * @param {string} photoPath - Path to the input photo file
   * @param {Object} specs - Custom specifications
   * @param {number} specs.width - Photo width in specified units
   * @param {number} specs.height - Photo height in specified units
   * @param {string} specs.units - Units for dimensions ('imperial' or 'metric')
   * @param {number} specs.headToHeightRatio - Ratio of head size to total height
   * @param {number} specs.eyeDistanceFromTop - Distance of eyes from top
   * @param {string} specs.backgroundColor - Background color in hex format
   * @param {number} specs.dpi - Resolution in dots per inch
   * @param {string} requestId - Optional request ID for tracking trials
   * @returns {Promise<Object>} API response
   */
  async createPhotoWithCustomSpecs(photoPath, specs, requestId = null) {
    try {
      const formData = new FormData();
      formData.append('input_photo', fs.createReadStream(photoPath));
      formData.append('width', specs.width);
      formData.append('height', specs.height);
      formData.append('units', specs.units);
      formData.append('head_to_height_ratio', specs.headToHeightRatio);
      formData.append('eye_distance_from_top', specs.eyeDistanceFromTop);
      formData.append('background_color', specs.backgroundColor);
      formData.append('dpi', specs.dpi);

      if (requestId) {
        formData.append('request_id', requestId);
      }

      const response = await axios.post(`${this.baseURL}/create-photo`, formData, {
        headers: {
          ...this.headers,
          ...formData.getHeaders()
        }
      });

      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Save the processed photo from the API response
   * @param {Object} response - API response containing the processed image
   * @param {string} outputPath - Path where to save the processed photo
   */
  saveProcessedPhoto(response, outputPath) {
    if (response.document_image_base64) {
      const imageBuffer = Buffer.from(response.document_image_base64, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✅ Processed photo saved to: ${outputPath}`);
    } else {
      console.log('❌ No processed image found in response');
    }
  }

  /**
   * Handle API response and return parsed data
   * @param {Object} response - HTTP response from the API
   * @returns {Object} Parsed response data
   */
  handleResponse(response) {
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`API Error (${response.status}): ${response.data?.message || 'Unknown error'}`);
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
      return new Error(`API Error (${status}): ${data?.message || 'Unknown error'}`);
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
    const maxSize = 9 * 1024 * 1024; // 9MB

    if (stats.size > maxSize) {
      throw new Error(`File size exceeds 9MB limit: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
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
 * Main example function
 */
async function main() {
  // Replace with your actual API token
  const API_TOKEN = 'your_api_token_here';
  
  // Initialize the API client
  const api = new Snap2PassAPI(API_TOKEN);

  try {
    // Example 1: Process US passport photo
    console.log('🛂 Processing US passport photo...');
    
    const photoPath = 'sample_photo.jpg';
    api.validateFile(photoPath);
    
    const response1 = await api.createPhotoWithCountrySpecs(
      photoPath,
      'US',
      'passport'
    );

    console.log(`✅ Success! Request ID: ${response1.request_id}`);
    console.log(`📊 Trial number: ${response1.trial_number}`);
    console.log(`📝 Message: ${response1.message}`);

    // Check for validation errors
    if (response1.validation_errors && response1.validation_errors.length > 0) {
      console.log('⚠️ Validation errors found:');
      response1.validation_errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    } else {
      console.log('✅ No validation errors!');
    }

    // Save the processed photo
    api.saveProcessedPhoto(response1, 'us_passport_photo.jpg');

    console.log('\n' + '='.repeat(50) + '\n');

    // Example 2: Process visa photo with custom specifications
    console.log('🎫 Processing visa photo with custom specs...');
    
    const customSpecs = {
      width: 2.0,
      height: 2.0,
      units: 'imperial',
      headToHeightRatio: 0.75,
      eyeDistanceFromTop: 0.5,
      backgroundColor: '#FFFFFF',
      dpi: 300
    };

    const response2 = await api.createPhotoWithCustomSpecs(photoPath, customSpecs);

    console.log(`✅ Success! Request ID: ${response2.request_id}`);
    console.log(`📊 Trial number: ${response2.trial_number}`);

    // Save the processed photo
    api.saveProcessedPhoto(response2, 'custom_visa_photo.jpg');

    console.log('\n' + '='.repeat(50) + '\n');

    // Example 3: Multiple trials with the same request ID
    console.log('🔄 Processing multiple trials...');
    let requestId = null;

    for (let trial = 1; trial <= 3; trial++) {
      try {
        const response = await api.createPhotoWithCountrySpecs(
          photoPath,
          'CA',
          'passport',
          requestId
        );

        requestId = response.request_id;
        console.log(`Trial ${response.trial_number}: ${response.message}`);

        if (!response.validation_errors || response.validation_errors.length === 0) {
          console.log('✅ Photo meets requirements!');
          api.saveProcessedPhoto(response, `canada_passport_trial_${trial}.jpg`);
          break;
        } else {
          console.log(`⚠️ Validation errors: ${response.validation_errors.join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ Error in trial ${trial}: ${error.message}`);
        break;
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Example of using the API with async/await and error handling
 */
async function processPhotoExample() {
  const api = new Snap2PassAPI('your_api_token_here');

  try {
    // Process a photo with comprehensive error handling
    const result = await api.createPhotoWithCountrySpecs(
      'photo.jpg',
      'US',
      'passport'
    );

    // Handle the result
    if (result.validation_errors && result.validation_errors.length > 0) {
      console.log('Photo has validation issues:');
      result.validation_errors.forEach(error => {
        console.log(`- ${error}`);
      });
    } else {
      console.log('Photo processed successfully!');
      api.saveProcessedPhoto(result, 'processed_photo.jpg');
    }

  } catch (error) {
    console.error('Failed to process photo:', error.message);
  }
}

/**
 * Example of batch processing multiple photos
 */
async function batchProcessPhotos(photoPaths, countryCode = 'US', documentType = 'passport') {
  const api = new Snap2PassAPI('your_api_token_here');
  const results = [];

  for (const photoPath of photoPaths) {
    try {
      console.log(`Processing ${photoPath}...`);
      const result = await api.createPhotoWithCountrySpecs(photoPath, countryCode, documentType);
      results.push({ photoPath, success: true, result });
      
      // Save with unique filename
      const filename = path.basename(photoPath, path.extname(photoPath));
      api.saveProcessedPhoto(result, `processed_${filename}.jpg`);
      
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
  batchProcessPhotos
};

// Run the main example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 