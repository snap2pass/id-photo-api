#!/usr/bin/env python3
"""
Snap2Pass API - Basic Usage Example
===================================

This example demonstrates how to use the Snap2Pass API to process
passport and visa photos with the new JSON-based API.
"""

import requests
import base64
import json
import os
from typing import Dict, Optional, List


class Snap2PassAPI:
    """Client for the Snap2Pass API"""
    
    def __init__(self, api_key: str):
        """
        Initialize the API client
        
        Args:
            api_key: Your Snap2Pass API key
        """
        self.api_key = api_key
        self.base_url = "https://api.snap2pass.com"
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
    
    def process_photo(
        self, 
        photo_path: str, 
        document_id: str
    ) -> Dict:
        """
        Process a photo using the Snap2Pass API
        
        Args:
            photo_path: Path to the input photo file
            document_id: Document type identifier (e.g., 'us-passport', 'uk-passport')
            
        Returns:
            API response as dictionary
        """
        url = f"{self.base_url}/process-photo"
        
        # Read and encode image to base64
        with open(photo_path, 'rb') as photo_file:
            image_data = base64.b64encode(photo_file.read()).decode('utf-8')
        
        # Prepare request data
        data = {
            'photo': image_data,
            'document_id': document_id
        }
        
        # Make the API call
        response = requests.post(url, headers=self.headers, json=data)
        
        return self._handle_response(response)
    
    def download_image(self, image_url: str, output_path: str) -> None:
        """
        Download an image from a CloudFront URL
        
        Args:
            image_url: CloudFront URL of the image
            output_path: Path where to save the downloaded image
        """
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ Image downloaded to: {output_path}")
    
    def _handle_response(self, response: requests.Response) -> Dict:
        """
        Handle API response and return parsed data
        
        Args:
            response: HTTP response from the API
            
        Returns:
            Parsed response data
        """
        try:
            data = response.json()
        except json.JSONDecodeError:
            raise Exception(f"Invalid JSON response: {response.text}")
        
        if response.status_code == 200:
            return data
        elif response.status_code == 401:
            error = data.get('error', {})
            raise Exception(f"Authentication Error: {error.get('message', 'Invalid API key')}")
        elif response.status_code == 402:
            error = data.get('error', {})
            credits = error.get('details', {}).get('current_credits', 0)
            raise Exception(f"Insufficient Credits: {error.get('message')} (Credits: {credits})")
        elif response.status_code == 400:
            error = data.get('error', {})
            code = error.get('code', 'UNKNOWN')
            message = error.get('message', 'Unknown error')
            raise Exception(f"Validation Error [{code}]: {message}")
        else:
            error = data.get('error', {})
            raise Exception(f"API Error ({response.status_code}): {error.get('message', 'Unknown error')}")


def optimize_image(image_path: str, max_size_mb: float = 4.5) -> bytes:
    """
    Optimize and resize image to stay under size limit
    
    Args:
        image_path: Path to the image file
        max_size_mb: Maximum size in megabytes
        
    Returns:
        Optimized image data as bytes
    """
    try:
        from PIL import Image
        import io
        
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if too large
        max_dimension = 2400
        if max(img.size) > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.LANCZOS)
        
        # Save with optimization
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=90, optimize=True)
        
        # Check size
        size_mb = len(buffer.getvalue()) / (1024 * 1024)
        if size_mb > max_size_mb:
            # Reduce quality if still too large
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=75, optimize=True)
        
        return buffer.getvalue()
    except ImportError:
        print("⚠️ PIL/Pillow not installed. Install with: pip install Pillow")
        # Return original file data
        with open(image_path, 'rb') as f:
            return f.read()


def process_with_retry(api: Snap2PassAPI, photo_path: str, document_id: str, max_retries: int = 3) -> Dict:
    """
    Process photo with retry logic for transient errors
    
    Args:
        api: Snap2PassAPI instance
        photo_path: Path to photo file
        document_id: Document type identifier
        max_retries: Maximum number of retry attempts
        
    Returns:
        API response data
    """
    import time
    
    for attempt in range(max_retries):
        try:
            return api.process_photo(photo_path, document_id)
        except Exception as e:
            error_msg = str(e)
            
            # Don't retry client errors
            if any(x in error_msg for x in ['Authentication Error', 'Validation Error', 'Insufficient Credits']):
                raise
            
            # Retry server errors
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"⚠️ Error: {error_msg}")
                print(f"🔄 Retrying in {wait_time} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
                continue
            raise
    
    raise Exception("Max retries exceeded")


def main():
    """Main example function"""
    
    # Replace with your actual API key
    API_KEY = os.environ.get('SNAP2PASS_API_KEY', 'your_api_key_here')
    
    if API_KEY == 'your_api_key_here':
        print("❌ Please set your API key in the SNAP2PASS_API_KEY environment variable")
        print("   or update the API_KEY variable in the script")
        return
    
    # Initialize the API client
    api = Snap2PassAPI(API_KEY)
    
    # Example 1: Process US passport photo
    print("=" * 70)
    print("🛂 Example 1: Processing US passport photo")
    print("=" * 70)
    try:
        response = api.process_photo(
            photo_path="sample_photo.jpg",
            document_id="us-passport"
        )
        
        print(f"✅ Success!")
        print(f"📝 Request ID: {response['request_id']}")
        print(f"📊 Validation Score: {response['validation']['score']}/100")
        print(f"✓  Validation Passed: {response['validation']['passed']}")
        print(f"💬 Summary: {response['validation']['summary']}")
        
        # Check for validation warnings
        if response['validation']['warnings']:
            print("⚠️  Validation Warnings:")
            for warning in response['validation']['warnings']:
                print(f"   - {warning}")
        
        # Check for validation errors
        if response['validation']['errors']:
            print("❌ Validation Errors:")
            for error in response['validation']['errors']:
                print(f"   - {error}")
        else:
            print("✅ No validation errors!")
        
        # Download the processed photo
        print(f"\n📥 Downloading processed photo...")
        api.download_image(response['image_urls']['output'], "us_passport_photo.jpg")
        
        print(f"\n🔗 CloudFront URLs:")
        print(f"   Input:  {response['image_urls']['input']}")
        print(f"   Output: {response['image_urls']['output']}")
        print(f"\n⏰ Images will be available for 30 days")
        
    except Exception as e:
        print(f"❌ Error processing US passport photo: {e}")
    
    print("\n" + "=" * 70 + "\n")
    
    # Example 2: Process UK passport photo
    print("=" * 70)
    print("🇬🇧 Example 2: Processing UK passport photo")
    print("=" * 70)
    try:
        response = api.process_photo(
            photo_path="sample_photo.jpg",
            document_id="uk-passport"
        )
        
        print(f"✅ Success!")
        print(f"📝 Request ID: {response['request_id']}")
        print(f"📊 Validation Score: {response['validation']['score']}/100")
        
        # Download the processed photo
        api.download_image(response['image_urls']['output'], "uk_passport_photo.jpg")
        
    except Exception as e:
        print(f"❌ Error processing UK passport photo: {e}")
    
    print("\n" + "=" * 70 + "\n")
    
    # Example 3: Using retry logic
    print("=" * 70)
    print("🔄 Example 3: Processing with retry logic")
    print("=" * 70)
    try:
        response = process_with_retry(
            api=api,
            photo_path="sample_photo.jpg",
            document_id="ca-passport",
            max_retries=3
        )
        
        print(f"✅ Success with retries!")
        print(f"📊 Validation Score: {response['validation']['score']}/100")
        api.download_image(response['image_urls']['output'], "ca_passport_photo.jpg")
        
    except Exception as e:
        print(f"❌ Error even after retries: {e}")
    
    print("\n" + "=" * 70 + "\n")
    
    # Example 4: Process multiple photos
    print("=" * 70)
    print("📸 Example 4: Batch processing multiple photos")
    print("=" * 70)
    
    photos = [
        ("photo1.jpg", "us-passport"),
        ("photo2.jpg", "uk-passport"),
        ("photo3.jpg", "eu-passport"),
    ]
    
    results = []
    for i, (photo_path, document_id) in enumerate(photos, 1):
        if not os.path.exists(photo_path):
            print(f"⚠️  Skipping {photo_path} (file not found)")
            continue
        
        try:
            print(f"\n[{i}/{len(photos)}] Processing {photo_path} ({document_id})...")
            response = api.process_photo(photo_path, document_id)
            
            print(f"   ✅ Score: {response['validation']['score']}/100")
            
            # Download processed photo
            output_filename = f"processed_{i}_{document_id}.jpg"
            api.download_image(response['image_urls']['output'], output_filename)
            
            results.append({
                'input': photo_path,
                'document_id': document_id,
                'success': True,
                'score': response['validation']['score'],
                'output': output_filename
            })
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                'input': photo_path,
                'document_id': document_id,
                'success': False,
                'error': str(e)
            })
    
    # Print summary
    print("\n" + "=" * 70)
    print("📊 Batch Processing Summary")
    print("=" * 70)
    successful = sum(1 for r in results if r['success'])
    print(f"Total: {len(results)} | Success: {successful} | Failed: {len(results) - successful}")
    
    for i, result in enumerate(results, 1):
        if result['success']:
            print(f"  {i}. ✅ {result['input']} → Score: {result['score']}/100")
        else:
            print(f"  {i}. ❌ {result['input']} → {result.get('error', 'Unknown error')}")


if __name__ == "__main__":
    main()
