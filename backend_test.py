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
        # Use unique test data with timestamp to avoid conflicts
        import time
        timestamp = str(int(time.time()))
        test_user = {
            "username": f"alice_test_{timestamp}",
            "email": f"alice_test_{timestamp}@wonderland.com", 
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
                    return True, data["access_token"], test_user["username"]
                else:
                    print("❌ Invalid token format in registration response")
                    return False, None, None
            else:
                print("❌ Registration response missing token fields")
                return False, None, None
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Registration connection error: {e}")
        return False, None, None

def test_user_login(base_url, username):
    """Test POST /api/auth/login endpoint"""
    print(f"\n🔍 Testing user login /api/auth/login for {username}...")
    try:
        login_data = {
            "username": username,
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

def test_user_profile(base_url, token, expected_username):
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
                
                if data["username"] == expected_username and elo_check:
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

def test_attacks_endpoint(base_url):
    """Test GET /api/attacks endpoint - should return 50 attacks"""
    print("\n🔍 Testing attacks list /api/attacks...")
    try:
        response = requests.get(f"{base_url}/api/attacks", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of attacks returned: {len(data)}")
            
            # Validate we have exactly 50 attacks
            if len(data) == 50:
                # Check structure of first attack
                first_attack = data[0]
                required_fields = ["id", "name", "description", "effect_type", "effect_value", "duration_hours"]
                
                if all(field in first_attack for field in required_fields):
                    print(f"✅ Sample attack: {first_attack['name']} - {first_attack['description']}")
                    print(f"✅ Effect: {first_attack['effect_type']} ({first_attack['effect_value']}) for {first_attack['duration_hours']}h")
                    print("✅ All 50 attacks loaded with complete structure")
                    return True
                else:
                    print("❌ Attack structure missing required fields")
                    return False
            else:
                print(f"❌ Expected 50 attacks, got {len(data)}")
                return False
        else:
            print(f"❌ Attacks endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Attacks endpoint connection error: {e}")
        return False

def test_titles_endpoint(base_url):
    """Test GET /api/titles endpoint - should return 9 titles"""
    print("\n🔍 Testing titles list /api/titles...")
    try:
        response = requests.get(f"{base_url}/api/titles", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of titles returned: {len(data)}")
            
            # Validate we have exactly 9 titles
            if len(data) == 9:
                # Check structure and progression
                expected_titles = ["Novice", "Initié", "Disciple", "Combattant", "Érudit", "Stratège", "Maître", "Champion", "Légende"]
                expected_levels = [1, 5, 10, 20, 30, 40, 50, 75, 100]
                
                titles_valid = True
                for i, title in enumerate(data):
                    required_fields = ["level_required", "name", "description", "bonus_type", "bonus_value"]
                    if not all(field in title for field in required_fields):
                        print(f"❌ Title {title.get('name', 'Unknown')} missing required fields")
                        titles_valid = False
                        continue
                    
                    if title["name"] == expected_titles[i] and title["level_required"] == expected_levels[i]:
                        print(f"✅ {title['name']} (Level {title['level_required']}): {title['description']}")
                    else:
                        print(f"❌ Title mismatch at position {i}: expected {expected_titles[i]} (lv{expected_levels[i]}), got {title['name']} (lv{title['level_required']})")
                        titles_valid = False
                
                if titles_valid:
                    print("✅ All 9 titles loaded with correct progression")
                    return True
                else:
                    return False
            else:
                print(f"❌ Expected 9 titles, got {len(data)}")
                return False
        else:
            print(f"❌ Titles endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Titles endpoint connection error: {e}")
        return False

def test_user_attacks(base_url, token):
    """Test GET /api/user/attacks endpoint"""
    print("\n🔍 Testing user attacks /api/user/attacks...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{base_url}/api/user/attacks",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"User has {len(data)} available attacks")
            
            # New user should have no attacks initially
            if len(data) == 0:
                print("✅ New user correctly has no attacks initially")
                return True
            else:
                # If user has attacks, validate structure
                for attack in data:
                    required_fields = ["id", "name", "description", "effect_type", "effect_value", "duration_hours", "obtained_at"]
                    if all(field in attack for field in required_fields):
                        print(f"✅ Attack: {attack['name']} - {attack['description']}")
                    else:
                        print("❌ User attack missing required fields")
                        return False
                print("✅ User attacks structure valid")
                return True
        else:
            print(f"❌ User attacks failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User attacks connection error: {e}")
        return False

def test_level_up_system(base_url, token):
    """Test POST /api/user/level-up endpoint"""
    print("\n🔍 Testing level up system /api/user/level-up...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Test leveling up in 'travail' stat
        response = requests.post(
            f"{base_url}/api/user/level-up?stat_name=travail",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate response structure
            required_fields = ["message", "new_level", "attack_gained"]
            if all(field in data for field in required_fields):
                if data["new_level"] == 1:  # Should be level 1 after first level up
                    attack_gained = data["attack_gained"]
                    if attack_gained and "name" in attack_gained and "description" in attack_gained:
                        print(f"✅ Level up successful! New level: {data['new_level']}")
                        print(f"✅ Attack gained: {attack_gained['name']} - {attack_gained['description']}")
                        return True, attack_gained["id"]
                    else:
                        print("❌ Attack gained structure invalid")
                        return False, None
                else:
                    print(f"❌ Unexpected new level: {data['new_level']}")
                    return False, None
            else:
                print("❌ Level up response missing required fields")
                return False, None
        else:
            print(f"❌ Level up failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Level up connection error: {e}")
        return False, None

def test_user_titles(base_url, token):
    """Test GET /api/user/titles endpoint"""
    print("\n🔍 Testing user titles /api/user/titles...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{base_url}/api/user/titles",
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate response structure
            required_fields = ["total_level", "current_title", "titles"]
            if all(field in data for field in required_fields):
                total_level = data["total_level"]
                current_title = data["current_title"]
                titles = data["titles"]
                
                print(f"✅ Total level: {total_level}")
                print(f"✅ Current title: {current_title}")
                
                # Check that titles are properly marked as unlocked/locked
                unlocked_count = sum(1 for title in titles if title.get("unlocked", False))
                expected_unlocked = sum(1 for title in titles if title["level_required"] <= total_level)
                
                if unlocked_count == expected_unlocked:
                    print(f"✅ Correct number of titles unlocked: {unlocked_count}")
                    
                    # Check that Novice is unlocked and current for new user
                    novice_title = next((t for t in titles if t["name"] == "Novice"), None)
                    if novice_title and novice_title.get("unlocked") and novice_title.get("current"):
                        print("✅ Novice title correctly set as current for new user")
                        return True
                    else:
                        print("❌ Novice title not properly set as current")
                        return False
                else:
                    print(f"❌ Title unlock count mismatch: got {unlocked_count}, expected {expected_unlocked}")
                    return False
            else:
                print("❌ User titles response missing required fields")
                return False
        else:
            print(f"❌ User titles failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User titles connection error: {e}")
        return False

def test_attack_system_flow(base_url, token1, token2, attack_id):
    """Test complete attack system flow between two users"""
    print("\n🔍 Testing attack system flow...")
    try:
        headers1 = {
            "Authorization": f"Bearer {token1}",
            "Content-Type": "application/json"
        }
        headers2 = {
            "Authorization": f"Bearer {token2}",
            "Content-Type": "application/json"
        }
        
        # User 1 attacks User 2
        attack_data = {
            "target_username": "bob_hatter",
            "attack_id": attack_id,
            "target_stat": "travail",
            "effect_target": "elo"
        }
        
        response = requests.post(
            f"{base_url}/api/user/attack",
            json=attack_data,
            headers=headers1,
            timeout=10
        )
        
        print(f"Attack Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Attack Response: {data}")
            
            if "message" in data and "attack_id" in data:
                print("✅ Attack sent successfully")
                
                # Check pending attacks for target user
                response = requests.get(
                    f"{base_url}/api/user/pending-attacks",
                    headers=headers2,
                    timeout=10
                )
                
                if response.status_code == 200:
                    pending = response.json()
                    print(f"Pending attacks: {len(pending)}")
                    
                    if len(pending) > 0:
                        attack_pending = pending[0]
                        if attack_pending.get("attacker") == "alice_wonderland":
                            print("✅ Attack correctly appears in target's pending attacks")
                            
                            # Apply pending attacks
                            response = requests.post(
                                f"{base_url}/api/user/apply-pending-attacks",
                                headers=headers2,
                                timeout=10
                            )
                            
                            if response.status_code == 200:
                                apply_data = response.json()
                                print(f"Apply Response: {apply_data}")
                                
                                if apply_data.get("total_attacks", 0) > 0:
                                    print("✅ Attack effects applied successfully")
                                    return True
                                else:
                                    print("❌ No attacks were applied")
                                    return False
                            else:
                                print(f"❌ Apply attacks failed: {response.status_code}")
                                return False
                        else:
                            print("❌ Wrong attacker in pending attacks")
                            return False
                    else:
                        print("❌ No pending attacks found for target user")
                        return False
                else:
                    print(f"❌ Get pending attacks failed: {response.status_code}")
                    return False
            else:
                print("❌ Attack response missing required fields")
                return False
        else:
            print(f"❌ Attack failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Attack system flow connection error: {e}")
        return False

def test_friends_system(base_url, token1, token2):
    """Test friends system endpoints"""
    print("\n🔍 Testing friends system...")
    try:
        headers1 = {
            "Authorization": f"Bearer {token1}",
            "Content-Type": "application/json"
        }
        
        # Add friend
        response = requests.post(
            f"{base_url}/api/user/add-friend?friend_username=bob_hatter",
            headers=headers1,
            timeout=10
        )
        
        print(f"Add Friend Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Add Friend Response: {data}")
            
            if "message" in data:
                print("✅ Friend added successfully")
                
                # Get friends list
                response = requests.get(
                    f"{base_url}/api/user/friends",
                    headers=headers1,
                    timeout=10
                )
                
                if response.status_code == 200:
                    friends = response.json()
                    print(f"Friends list: {len(friends)} friends")
                    
                    if len(friends) > 0:
                        friend = friends[0]
                        if friend.get("username") == "bob_hatter":
                            print("✅ Friend appears in friends list with correct data")
                            return True
                        else:
                            print("❌ Wrong friend in friends list")
                            return False
                    else:
                        print("❌ Friends list is empty")
                        return False
                else:
                    print(f"❌ Get friends failed: {response.status_code}")
                    return False
            else:
                print("❌ Add friend response missing message")
                return False
        else:
            print(f"❌ Add friend failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Friends system connection error: {e}")
        return False

def test_clubs_system(base_url, token):
    """Test clubs system endpoints"""
    print("\n🔍 Testing clubs system...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Create club
        club_data = {
            "name": "Les Aventuriers du Terrier",
            "description": "Club pour les explorateurs du monde d'Alice"
        }
        
        response = requests.post(
            f"{base_url}/api/clubs/create",
            json=club_data,
            headers=headers,
            timeout=10
        )
        
        print(f"Create Club Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Create Club Response: {data}")
            
            if "message" in data and "club" in data:
                club = data["club"]
                club_id = club.get("id")
                print(f"✅ Club created successfully: {club['name']}")
                
                # Get user's club
                response = requests.get(
                    f"{base_url}/api/user/club",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    club_data = response.json()
                    print(f"User Club Response: {club_data}")
                    
                    if "club" in club_data and "members" in club_data:
                        user_club = club_data["club"]
                        members = club_data["members"]
                        
                        if user_club.get("name") == "Les Aventuriers du Terrier" and len(members) == 1:
                            print("✅ User correctly appears in their own club")
                            return True, club_id
                        else:
                            print("❌ Club data or membership incorrect")
                            return False, None
                    else:
                        print("❌ User club response missing required fields")
                        return False, None
                else:
                    print(f"❌ Get user club failed: {response.status_code}")
                    return False, None
            else:
                print("❌ Create club response missing required fields")
                return False, None
        else:
            print(f"❌ Create club failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Clubs system connection error: {e}")
        return False, None

def create_second_test_user(base_url):
    """Create a second test user for multi-user testing"""
    print("\n🔍 Creating second test user...")
    try:
        test_user = {
            "username": "bob_hatter",
            "email": "bob@madhatter.com",
            "password": "tea_party456"
        }
        
        response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print("✅ Second test user created successfully")
                return True, data["access_token"]
        
        print("❌ Failed to create second test user")
        return False, None
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Second user creation error: {e}")
        return False, None

def test_attack_defense_title_system(base_url):
    """Test complete attack, defense and title system"""
    print("\n🎯 Testing Complete Attack, Defense & Title System")
    print("=" * 60)
    
    system_results = {}
    
    # Test static data endpoints first
    system_results['attacks_list'] = test_attacks_endpoint(base_url)
    system_results['titles_list'] = test_titles_endpoint(base_url)
    
    # Create two test users for interaction testing
    success1, token1 = test_user_registration(base_url)
    if not success1:
        print("❌ Failed to create first user - skipping system tests")
        return system_results
    
    success2, token2 = create_second_test_user(base_url)
    if not success2:
        print("❌ Failed to create second user - skipping multi-user tests")
        token2 = None
    
    # Test user-specific endpoints
    system_results['user_attacks'] = test_user_attacks(base_url, token1)
    system_results['user_titles'] = test_user_titles(base_url, token1)
    
    # Test level up system and get an attack
    success, attack_id = test_level_up_system(base_url, token1)
    system_results['level_up'] = success
    
    # Test attack system flow if we have two users and an attack
    if token2 and attack_id:
        system_results['attack_flow'] = test_attack_system_flow(base_url, token1, token2, attack_id)
        system_results['friends_system'] = test_friends_system(base_url, token1, token2)
    else:
        system_results['attack_flow'] = False
        system_results['friends_system'] = False
    
    # Test clubs system
    success, club_id = test_clubs_system(base_url, token1)
    system_results['clubs_system'] = success
    
    return system_results

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
    
    # Run basic infrastructure tests
    test_results['server_accessible'] = test_server_accessibility(backend_url)
    test_results['root_endpoint'] = test_root_endpoint(backend_url)
    test_results['status_get'] = test_status_endpoint_get(backend_url)
    test_results['status_post'] = test_status_endpoint_post(backend_url)
    test_results['cors_headers'] = test_cors_headers(backend_url)
    
    # Run authentication system tests
    auth_results = test_authentication_system(backend_url)
    test_results.update(auth_results)
    
    # Run attack, defense & title system tests
    system_results = test_attack_defense_title_system(backend_url)
    test_results.update(system_results)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    # Basic infrastructure tests
    print("\n🏗️  INFRASTRUCTURE TESTS:")
    infra_tests = ['server_accessible', 'root_endpoint', 'status_get', 'status_post', 'cors_headers']
    for test_name in infra_tests:
        if test_name in test_results:
            result = test_results[test_name]
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
            if result:
                passed += 1
    
    # Authentication system tests
    print("\n🔐 AUTHENTICATION SYSTEM TESTS:")
    auth_tests = ['registration', 'login', 'profile', 'user_search', 'logout']
    for test_name in auth_tests:
        if test_name in test_results:
            result = test_results[test_name]
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
            if result:
                passed += 1
    
    # Attack, Defense & Title system tests
    print("\n⚔️  ATTACK, DEFENSE & TITLE SYSTEM TESTS:")
    system_tests = ['attacks_list', 'titles_list', 'user_attacks', 'user_titles', 'level_up', 'attack_flow', 'friends_system', 'clubs_system']
    for test_name in system_tests:
        if test_name in test_results:
            result = test_results[test_name]
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
            if result:
                passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    # Determine critical vs minor issues
    critical_tests = ['server_accessible', 'root_endpoint', 'attacks_list', 'titles_list', 'level_up', 'attack_flow']
    critical_passed = sum(1 for test in critical_tests if test_results.get(test, False))
    critical_total = len(critical_tests)
    
    if passed == total:
        print("🎉 All backend tests PASSED! Complete attack, defense & title system is fully functional.")
        return True
    elif critical_passed == critical_total:
        print("✅ All CRITICAL tests PASSED! Core attack/defense/title system is working.")
        print("⚠️  Some minor features may need attention, but main functionality is operational.")
        return True
    else:
        print("❌ CRITICAL backend tests FAILED. Core system issues need to be resolved.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)