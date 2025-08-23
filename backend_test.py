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

def test_user_registration(base_url):
    """Test POST /api/auth/register endpoint"""
    print("\n🔍 Testing user registration /api/auth/register...")
    try:
        # Use realistic test data for Le Lapin Blanc RPG
        test_user = {
            "username": "alice_wonderland",
            "email": "alice@wonderland.com", 
            "password": "rabbit_hole123"
        }
        
        response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate JWT token response
            if "access_token" in data and "token_type" in data:
                if data["token_type"] == "bearer" and len(data["access_token"]) > 0:
                    print("✅ User registration successful - JWT token received")
                    return True, data["access_token"]
                else:
                    print("❌ Invalid token format in registration response")
                    return False, None
            else:
                print("❌ Registration response missing token fields")
                return False, None
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Registration connection error: {e}")
        return False, None

def test_user_login(base_url):
    """Test POST /api/auth/login endpoint"""
    print("\n🔍 Testing user login /api/auth/login...")
    try:
        login_data = {
            "username": "alice_wonderland",
            "password": "rabbit_hole123"
        }
        
        response = requests.post(
            f"{base_url}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate JWT token response
            if "access_token" in data and "token_type" in data:
                if data["token_type"] == "bearer" and len(data["access_token"]) > 0:
                    print("✅ User login successful - JWT token received")
                    print("✅ User is_online status should be updated to true")
                    return True, data["access_token"]
                else:
                    print("❌ Invalid token format in login response")
                    return False, None
            else:
                print("❌ Login response missing token fields")
                return False, None
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Login connection error: {e}")
        return False, None

def test_user_profile(base_url, token):
    """Test GET /api/auth/me endpoint"""
    print("\n🔍 Testing user profile /api/auth/me...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{base_url}/api/auth/me",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate user profile structure
            required_fields = ["id", "username", "stats", "is_online"]
            if all(field in data for field in required_fields):
                # Check ELO stats initialization
                stats = data.get("stats", {})
                expected_categories = ["travail", "sport", "creation", "lecture", "adaptabilite"]
                
                elo_check = True
                for category in expected_categories:
                    if category in stats:
                        category_stats = stats[category]
                        if category_stats.get("elo") == 1200:
                            print(f"✅ {category.capitalize()} ELO initialized to 1200")
                        else:
                            print(f"❌ {category.capitalize()} ELO not set to 1200: {category_stats.get('elo')}")
                            elo_check = False
                    else:
                        print(f"❌ Missing stats category: {category}")
                        elo_check = False
                
                if data["username"] == "alice_wonderland" and elo_check:
                    print("✅ User profile retrieved successfully with correct ELO stats")
                    return True
                else:
                    print("❌ User profile data validation failed")
                    return False
            else:
                print("❌ User profile missing required fields")
                return False
        else:
            print(f"❌ Profile retrieval failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Profile retrieval connection error: {e}")
        return False

def test_user_search(base_url, token):
    """Test GET /api/users/search/{username} endpoint"""
    print("\n🔍 Testing user search /api/users/search/alice_wonderland...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{base_url}/api/users/search/alice_wonderland",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate search result
            if data.get("username") == "alice_wonderland":
                required_fields = ["id", "username", "stats", "is_online"]
                if all(field in data for field in required_fields):
                    print("✅ User search successful - found created user")
                    return True
                else:
                    print("❌ User search result missing required fields")
                    return False
            else:
                print("❌ User search returned wrong user")
                return False
        else:
            print(f"❌ User search failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User search connection error: {e}")
        return False

def test_user_logout(base_url, token):
    """Test POST /api/auth/logout endpoint"""
    print("\n🔍 Testing user logout /api/auth/logout...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{base_url}/api/auth/logout",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            if "message" in data:
                print("✅ User logout successful - is_online status should be updated to false")
                return True
            else:
                print("❌ Logout response missing message")
                return False
        else:
            print(f"❌ Logout failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Logout connection error: {e}")
        return False

def test_authentication_system(base_url):
    """Test complete authentication system flow"""
    print("\n🎯 Testing Complete Authentication System Flow")
    print("=" * 60)
    
    auth_results = {}
    token = None
    
    # Test registration
    success, token = test_user_registration(base_url)
    auth_results['registration'] = success
    
    if not success:
        print("❌ Registration failed - skipping remaining auth tests")
        return auth_results
    
    # Test login (get fresh token)
    success, login_token = test_user_login(base_url)
    auth_results['login'] = success
    if success and login_token:
        token = login_token  # Use login token for subsequent tests
    
    # Test profile retrieval
    if token:
        auth_results['profile'] = test_user_profile(base_url, token)
        auth_results['user_search'] = test_user_search(base_url, token)
        auth_results['logout'] = test_user_logout(base_url, token)
    else:
        print("❌ No valid token - skipping profile, search, and logout tests")
        auth_results['profile'] = False
        auth_results['user_search'] = False
        auth_results['logout'] = False
    
    return auth_results

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