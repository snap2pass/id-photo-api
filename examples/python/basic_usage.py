#!/usr/bin/env python3
"""
Snap2Pass API - Basic Usage Example
===================================

This example demonstrates how to use the Snap2Pass API to process
passport and visa photos with different configurations.
"""

import requests
import base64
import json
import os
from typing import Dict, Optional, List


class Snap2PassAPI:
    """Client for the Snap2Pass API"""
    
    def __init__(self, api_token: str):
        """
        Initialize the API client
        
        Args:
            api_token: Your Snap2Pass API token
        """
        self.api_token = api_token
        self.base_url = "https://api.snap2pass.com"
        self.headers = {
            'Authorization': f'Bearer {api_token}'
        }
    
    def create_photo_with_country_specs(
        self, 
        photo_path: str, 
        country_code: str, 
        document_type: str,
        request_id: Optional[str] = None
    ) -> Dict:
        """
        Create a photo using country-specific document requirements
        
        Args:
            photo_path: Path to the input photo file
            country_code: Country code (e.g., 'US', 'CA', 'GB')
            document_type: Type of document ('passport' or 'visa')
            request_id: Optional request ID for tracking trials
            
        Returns:
            API response as dictionary
        """
        url = f"{self.base_url}/create-photo"
        
        with open(photo_path, 'rb') as photo_file:
            files = {'input_photo': photo_file}
            data = {
                'country_code': country_code,
                'document_type': document_type
            }
            
            if request_id:
                data['request_id'] = request_id
            
            response = requests.post(url, files=files, data=data, headers=self.headers)
            
        return self._handle_response(response)
    
    def create_photo_with_custom_specs(
        self,
        photo_path: str,
        width: float,
        height: float,
        units: str = "imperial",
        head_to_height_ratio: float = 0.75,
        eye_distance_from_top: float = 0.5,
        background_color: str = "#FFFFFF",
        dpi: int = 300,
        request_id: Optional[str] = None
    ) -> Dict:
        """
        Create a photo using custom specifications
        
        Args:
            photo_path: Path to the input photo file
            width: Photo width in specified units
            height: Photo height in specified units
            units: Units for dimensions ('imperial' or 'metric')
            head_to_height_ratio: Ratio of head size to total height
            eye_distance_from_top: Distance of eyes from top
            background_color: Background color in hex format
            dpi: Resolution in dots per inch
            request_id: Optional request ID for tracking trials
            
        Returns:
            API response as dictionary
        """
        url = f"{self.base_url}/create-photo"
        
        with open(photo_path, 'rb') as photo_file:
            files = {'input_photo': photo_file}
            data = {
                'width': width,
                'height': height,
                'units': units,
                'head_to_height_ratio': head_to_height_ratio,
                'eye_distance_from_top': eye_distance_from_top,
                'background_color': background_color,
                'dpi': dpi
            }
            
            if request_id:
                data['request_id'] = request_id
            
            response = requests.post(url, files=files, data=data, headers=self.headers)
            
        return self._handle_response(response)
    
    def save_processed_photo(self, response: Dict, output_path: str) -> None:
        """
        Save the processed photo from the API response
        
        Args:
            response: API response containing the processed image
            output_path: Path where to save the processed photo
        """
        if 'document_image_base64' in response:
            image_data = base64.b64decode(response['document_image_base64'])
            with open(output_path, 'wb') as f:
                f.write(image_data)
            print(f"✅ Processed photo saved to: {output_path}")
        else:
            print("❌ No processed image found in response")
    
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
        
        if response.status_code == 201:
            return data
        else:
            error_msg = data.get('message', 'Unknown error')
            raise Exception(f"API Error ({response.status_code}): {error_msg}")


def main():
    """Main example function"""
    
    # Replace with your actual API token
    API_TOKEN = "your_api_token_here"
    
    # Initialize the API client
    api = Snap2PassAPI(API_TOKEN)
    
    # Example 1: Process US passport photo
    print("🛂 Processing US passport photo...")
    try:
        response = api.create_photo_with_country_specs(
            photo_path="sample_photo.jpg",
            country_code="US",
            document_type="passport"
        )
        
        print(f"✅ Success! Request ID: {response['request_id']}")
        print(f"📊 Trial number: {response['trial_number']}")
        print(f"📝 Message: {response['message']}")
        
        # Check for validation errors
        if response['validation_errors']:
            print("⚠️ Validation errors found:")
            for error in response['validation_errors']:
                print(f"   - {error}")
        else:
            print("✅ No validation errors!")
        
        # Save the processed photo
        api.save_processed_photo(response, "us_passport_photo.jpg")
        
    except Exception as e:
        print(f"❌ Error processing US passport photo: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Example 2: Process visa photo with custom specifications
    print("🎫 Processing visa photo with custom specs...")
    try:
        response = api.create_photo_with_custom_specs(
            photo_path="sample_photo.jpg",
            width=2.0,
            height=2.0,
            units="imperial",
            head_to_height_ratio=0.75,
            eye_distance_from_top=0.5,
            background_color="#FFFFFF",
            dpi=300
        )
        
        print(f"✅ Success! Request ID: {response['request_id']}")
        print(f"📊 Trial number: {response['trial_number']}")
        
        # Save the processed photo
        api.save_processed_photo(response, "custom_visa_photo.jpg")
        
    except Exception as e:
        print(f"❌ Error processing custom visa photo: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Example 3: Multiple trials with the same request ID
    print("🔄 Processing multiple trials...")
    request_id = None
    
    for trial in range(1, 4):  # Try up to 3 times
        try:
            response = api.create_photo_with_country_specs(
                photo_path="sample_photo.jpg",
                country_code="CA",
                document_type="passport",
                request_id=request_id
            )
            
            request_id = response['request_id']
            print(f"Trial {response['trial_number']}: {response['message']}")
            
            if not response['validation_errors']:
                print("✅ Photo meets requirements!")
                api.save_processed_photo(response, f"canada_passport_trial_{trial}.jpg")
                break
            else:
                print(f"⚠️ Validation errors: {response['validation_errors']}")
                
        except Exception as e:
            print(f"❌ Error in trial {trial}: {e}")
            break


if __name__ == "__main__":
    main() 