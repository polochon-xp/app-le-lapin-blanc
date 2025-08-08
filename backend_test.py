#!/usr/bin/env python3
"""
Backend API Tests for Le Lapin Blanc RPG Application
Tests FastAPI endpoints and MongoDB connectivity
"""

import requests
import json
import os
from datetime import datetime
import sys

# Get backend URL from frontend environment
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"❌ Error reading frontend .env: {e}")
        return None

def test_root_endpoint(base_url):
    """Test the root /api/ endpoint for health status"""
    print("\n🔍 Testing root endpoint /api/...")
    try:
        response = requests.get(f"{base_url}/api/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint working correctly")
                return True
            else:
                print("❌ Root endpoint returned unexpected message")
                return False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Root endpoint connection error: {e}")
        return False

def test_status_endpoint_get(base_url):
    """Test GET /api/status endpoint"""
    print("\n🔍 Testing GET /api/status...")
    try:
        response = requests.get(f"{base_url}/api/status", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            print("✅ GET /api/status working correctly")
            return True
        else:
            print(f"❌ GET /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/status connection error: {e}")
        return False

def test_status_endpoint_post(base_url):
    """Test POST /api/status endpoint"""
    print("\n🔍 Testing POST /api/status...")
    try:
        test_data = {
            "client_name": "Le Lapin Blanc Test Client"
        }
        
        response = requests.post(
            f"{base_url}/api/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate response structure
            required_fields = ["id", "client_name", "timestamp"]
            if all(field in data for field in required_fields):
                if data["client_name"] == test_data["client_name"]:
                    print("✅ POST /api/status working correctly")
                    return True
                else:
                    print("❌ POST /api/status returned incorrect client_name")
                    return False
            else:
                print("❌ POST /api/status missing required fields")
                return False
        else:
            print(f"❌ POST /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/status connection error: {e}")
        return False

def test_server_accessibility(base_url):
    """Test if server is accessible and responding"""
    print("\n🔍 Testing server accessibility...")
    try:
        response = requests.get(base_url, timeout=5)
        print(f"Base URL accessible: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Server not accessible: {e}")
        return False

def test_cors_headers(base_url):
    """Test CORS configuration"""
    print("\n🔍 Testing CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/", timeout=10)
        headers = response.headers
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        cors_working = True
        for header in cors_headers:
            if header in headers:
                print(f"✅ {header}: {headers[header]}")
            else:
                print(f"❌ Missing CORS header: {header}")
                cors_working = False
                
        return cors_working
        
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for Le Lapin Blanc RPG")
    print("=" * 60)
    
    # Get backend URL
    backend_url = get_backend_url()
    if not backend_url:
        print("❌ Could not get backend URL from frontend/.env")
        return False
    
    print(f"Backend URL: {backend_url}")
    
    # Track test results
    test_results = {}
    
    # Run tests
    test_results['server_accessible'] = test_server_accessibility(backend_url)
    test_results['root_endpoint'] = test_root_endpoint(backend_url)
    test_results['status_get'] = test_status_endpoint_get(backend_url)
    test_results['status_post'] = test_status_endpoint_post(backend_url)
    test_results['cors_headers'] = test_cors_headers(backend_url)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED! Backend is ready for PWA implementation.")
        return True
    else:
        print("⚠️  Some backend tests FAILED. Issues need to be resolved.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)