import React, { useState, useCallback } from 'react';
import './PhotoProcessor.css';

/**
 * Snap2Pass Photo Processor Component
 * 
 * This component demonstrates how to integrate with the Snap2Pass API
 * to process passport and visa photos in a React application using the new JSON-based API.
 */
const PhotoProcessor = () => {
  // State management
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentId, setDocumentId] = useState('us-passport');

  // API configuration
  const API_KEY = process.env.REACT_APP_SNAP2PASS_API_KEY || 'YOUR_API_KEY_HERE';
  const API_URL = 'https://api.snap2pass.com/process-photo';

  // Document types mapping
  const documentTypes = [
    { id: 'us-passport', label: 'US Passport' },
    { id: 'us-visa', label: 'US Visa' },
    { id: 'ca-passport', label: 'Canadian Passport' },
    { id: 'uk-passport', label: 'UK Passport' },
    { id: 'eu-passport', label: 'EU Passport' },
    { id: 'in-passport', label: 'Indian Passport' },
    { id: 'jp-passport', label: 'Japanese Passport' },
    { id: 'cn-passport', label: 'Chinese Passport' },
    { id: 'au-passport', label: 'Australian Passport' },
  ];

  /**
   * Convert file to base64
   */
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
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
   * Process the photo using Snap2Pass API
   */
  const processPhoto = useCallback(async () => {
    if (!file) {
      setError('Please select a photo first.');
      return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please set your API key in the REACT_APP_SNAP2PASS_API_KEY environment variable.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Make API request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          photo: base64Image,
          document_id: documentId
        })
      });

      const data = await response.json();

      if (response.status === 200) {
        setResult(data);
      } else if (response.status === 401) {
        setError(`Authentication Error: ${data.error.message}`);
      } else if (response.status === 402) {
        setError(`Insufficient Credits: ${data.error.message} (Credits: ${data.error.details.current_credits})`);
      } else if (response.status === 400) {
        setError(`Validation Error [${data.error.code}]: ${data.error.message}`);
      } else {
        setError(`API Error (${response.status}): ${data.error?.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [file, documentId, API_KEY]);

  /**
   * Download image from CloudFront URL
   */
  const downloadPhoto = useCallback(async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError('Failed to download image. Please try again.');
      console.error('Download error:', err);
    }
  }, []);

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

  /**
   * Get validation score color
   */
  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 75) return '#3b82f6'; // blue
    if (score >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

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
            {file && <span className="file-name">{file.name}</span>}
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
          <h2>⚙️ Document Type</h2>
          
          <div className="document-selector">
            <label htmlFor="document-id">Select Document Type:</label>
            <select 
              id="document-id"
              value={documentId} 
              onChange={(e) => setDocumentId(e.target.value)}
            >
              {documentTypes.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.label}
                </option>
              ))}
            </select>
          </div>
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
              <p>
                <strong>Validation Score:</strong>{' '}
                <span style={{ color: getScoreColor(result.validation.score), fontWeight: 'bold' }}>
                  {result.validation.score}/100
                </span>
              </p>
              <p><strong>Status:</strong> {result.validation.passed ? '✅ Passed' : '⚠️ Needs Improvement'}</p>
              <p><strong>Summary:</strong> {result.validation.summary}</p>
            </div>

            {/* Validation Warnings */}
            {result.validation.warnings && result.validation.warnings.length > 0 && (
              <div className="validation-warnings">
                <h3>⚠️ Warnings:</h3>
                <ul>
                  {result.validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Validation Errors */}
            {result.validation.errors && result.validation.errors.length > 0 && (
              <div className="validation-errors">
                <h3>❌ Critical Issues:</h3>
                <ul>
                  {result.validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* No Issues */}
            {(!result.validation.warnings || result.validation.warnings.length === 0) &&
             (!result.validation.errors || result.validation.errors.length === 0) && (
              <div className="success-message">
                <p>🎉 No validation issues! Your photo meets all requirements.</p>
              </div>
            )}

            {/* Processed Photos */}
            {result.image_urls && (
              <div className="processed-photos">
                <div className="photo-grid">
                  <div className="photo-card">
                    <h3>📥 Input Photo</h3>
                    <img 
                      src={result.image_urls.input} 
                      alt="Input photo" 
                    />
                    <button 
                      onClick={() => downloadPhoto(result.image_urls.input, `input_${result.request_id}.jpg`)}
                      className="download-button"
                    >
                      💾 Download Input
                    </button>
                  </div>

                  <div className="photo-card">
                    <h3>📤 Processed Photo</h3>
                    <img 
                      src={result.image_urls.output} 
                      alt="Processed photo" 
                    />
                    <button 
                      onClick={() => downloadPhoto(result.image_urls.output, `processed_${result.request_id}.jpg`)}
                      className="download-button"
                    >
                      💾 Download Processed
                    </button>
                  </div>
                </div>

                <div className="storage-notice">
                  <p>⏰ <strong>Note:</strong> Images are available for 30 days via CloudFront CDN</p>
                </div>
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
          Need help? Contact <a href="mailto:support@snap2pass.com">support@snap2pass.com</a>
        </p>
      </div>
    </div>
  );
};

export default PhotoProcessor;
