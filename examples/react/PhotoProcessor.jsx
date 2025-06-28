import React, { useState, useCallback } from 'react';
import './PhotoProcessor.css';

/**
 * Snap2Pass Photo Processor Component
 * 
 * This component demonstrates how to integrate with the Snap2Pass API
 * to process passport and visa photos in a React application.
 */
const PhotoProcessor = () => {
  // State management
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingMode, setProcessingMode] = useState('country'); // 'country' or 'custom'
  
  // Country-specific settings
  const [countryCode, setCountryCode] = useState('US');
  const [documentType, setDocumentType] = useState('passport');
  
  // Custom specifications
  const [customSpecs, setCustomSpecs] = useState({
    width: 2.0,
    height: 2.0,
    units: 'imperial',
    headToHeightRatio: 0.75,
    eyeDistanceFromTop: 0.5,
    backgroundColor: '#FFFFFF',
    dpi: 300
  });

  // API configuration
  const API_TOKEN = 'YOUR_API_TOKEN_HERE'; // Replace with your actual token
  const API_URL = 'https://api.snap2pass.com/create-photo';

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.match('image/(jpeg|jpg|png)')) {
        setError('Please select a JPEG or PNG image file.');
        return;
      }
      
      // Validate file size (9MB limit)
      if (selectedFile.size > 9 * 1024 * 1024) {
        setError('File size must be less than 9MB.');
        return;
      }

      setFile(selectedFile);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  /**
   * Handle custom specifications change
   */
  const handleCustomSpecsChange = useCallback((field, value) => {
    setCustomSpecs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * Process the photo using Snap2Pass API
   */
  const processPhoto = useCallback(async () => {
    if (!file) {
      setError('Please select a photo first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('input_photo', file);

      // Add specifications based on processing mode
      if (processingMode === 'country') {
        formData.append('country_code', countryCode);
        formData.append('document_type', documentType);
      } else {
        formData.append('width', customSpecs.width);
        formData.append('height', customSpecs.height);
        formData.append('units', customSpecs.units);
        formData.append('head_to_height_ratio', customSpecs.headToHeightRatio);
        formData.append('eye_distance_from_top', customSpecs.eyeDistanceFromTop);
        formData.append('background_color', customSpecs.backgroundColor);
        formData.append('dpi', customSpecs.dpi);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'An error occurred while processing the photo.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [file, processingMode, countryCode, documentType, customSpecs, API_TOKEN]);

  /**
   * Download the processed photo
   */
  const downloadPhoto = useCallback(() => {
    if (result?.document_image_base64) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${result.document_image_base64}`;
      link.download = `processed_photo_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [result]);

  /**
   * Reset the form
   */
  const resetForm = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return (
    <div className="photo-processor">
      <div className="header">
        <h1>🛂 Snap2Pass Photo Processor</h1>
        <p>Transform your photos into compliant passport and visa photos</p>
      </div>

      <div className="main-content">
        {/* File Upload Section */}
        <div className="upload-section">
          <h2>📸 Upload Photo</h2>
          <div className="file-upload">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="upload-button">
              {file ? 'Change Photo' : 'Choose Photo'}
            </label>
          </div>
          
          {preview && (
            <div className="preview">
              <h3>Original Photo:</h3>
              <img src={preview} alt="Original" />
            </div>
          )}
        </div>

        {/* Processing Options */}
        <div className="options-section">
          <h2>⚙️ Processing Options</h2>
          
          <div className="mode-selector">
            <label>
              <input
                type="radio"
                value="country"
                checked={processingMode === 'country'}
                onChange={(e) => setProcessingMode(e.target.value)}
              />
              Country-Specific Requirements
            </label>
            <label>
              <input
                type="radio"
                value="custom"
                checked={processingMode === 'custom'}
                onChange={(e) => setProcessingMode(e.target.value)}
              />
              Custom Specifications
            </label>
          </div>

          {processingMode === 'country' ? (
            <div className="country-specs">
              <div className="form-group">
                <label>Country Code:</label>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Document Type:</label>
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="custom-specs">
              <div className="form-row">
                <div className="form-group">
                  <label>Width:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSpecs.width}
                    onChange={(e) => handleCustomSpecsChange('width', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Height:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSpecs.height}
                    onChange={(e) => handleCustomSpecsChange('height', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Units:</label>
                <select 
                  value={customSpecs.units} 
                  onChange={(e) => handleCustomSpecsChange('units', e.target.value)}
                >
                  <option value="imperial">Imperial (inches)</option>
                  <option value="metric">Metric (cm)</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Head to Height Ratio:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="0.9"
                    value={customSpecs.headToHeightRatio}
                    onChange={(e) => handleCustomSpecsChange('headToHeightRatio', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Eye Distance from Top:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.3"
                    max="0.7"
                    value={customSpecs.eyeDistanceFromTop}
                    onChange={(e) => handleCustomSpecsChange('eyeDistanceFromTop', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Background Color:</label>
                  <input
                    type="color"
                    value={customSpecs.backgroundColor}
                    onChange={(e) => handleCustomSpecsChange('backgroundColor', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>DPI:</label>
                  <input
                    type="number"
                    min="150"
                    max="600"
                    value={customSpecs.dpi}
                    onChange={(e) => handleCustomSpecsChange('dpi', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button 
            onClick={processPhoto} 
            disabled={loading || !file}
            className="process-button"
          >
            {loading ? '🔄 Processing...' : '🚀 Process Photo'}
          </button>
          
          <button onClick={resetForm} className="reset-button">
            🔄 Reset
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="results">
            <h2>✅ Processing Complete!</h2>
            
            <div className="result-info">
              <p><strong>Request ID:</strong> {result.request_id}</p>
              <p><strong>Trial Number:</strong> {result.trial_number}</p>
              <p><strong>Message:</strong> {result.message}</p>
            </div>

            {result.validation_errors && result.validation_errors.length > 0 ? (
              <div className="validation-errors">
                <h3>⚠️ Validation Errors:</h3>
                <ul>
                  {result.validation_errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="success-message">
                <p>🎉 No validation errors! Your photo meets all requirements.</p>
              </div>
            )}

            {result.document_image_base64 && (
              <div className="processed-photo">
                <h3>📷 Processed Photo:</h3>
                <img 
                  src={`data:image/jpeg;base64,${result.document_image_base64}`} 
                  alt="Processed photo" 
                />
                <button onClick={downloadPhoto} className="download-button">
                  💾 Download Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="footer">
        <p>
          Powered by <a href="https://snap2pass.com" target="_blank" rel="noopener noreferrer">Snap2Pass API</a>
        </p>
        <p>
          Need help? Contact <a href="mailto:api-support@snap2pass.com">api-support@snap2pass.com</a>
        </p>
      </div>
    </div>
  );
};

export default PhotoProcessor; 