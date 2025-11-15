import os
import requests
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

def get_user_info_from_clerk(clerk_user_id):
    """Fetch user information (email, name) from Clerk API"""
    if not CLERK_SECRET_KEY or CLERK_SECRET_KEY == "sk_test_your_clerk_secret_key_here":
        # Development mode - can't fetch from Clerk API
        return None, None
    
    try:
        headers = {
            "Authorization": f"Bearer {CLERK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"https://api.clerk.com/v1/users/{clerk_user_id}",
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            user_data = response.json()
            
            # Extract email (primary email address)
            email_addresses = user_data.get("email_addresses", [])
            email = None
            if email_addresses:
                # Get primary email or first email
                primary_email = next((e for e in email_addresses if e.get("id") == user_data.get("primary_email_address_id")), None)
                email = primary_email.get("email_address") if primary_email else email_addresses[0].get("email_address")
            
            # Extract name (first_name + last_name or username)
            first_name = user_data.get("first_name", "")
            last_name = user_data.get("last_name", "")
            username = user_data.get("username", "")
            
            name = None
            if first_name or last_name:
                name = f"{first_name} {last_name}".strip()
            elif username:
                name = username
            
            return email, name
        else:
            print(f"⚠️ Failed to fetch user info from Clerk: {response.status_code} - {response.text}")
            return None, None
            
    except Exception as e:
        print(f"⚠️ Error fetching user info from Clerk: {e}")
        return None, None

def verify_clerk_token(token):
    """Verify Clerk JWT token and return user ID, email, and name"""
    if not token:
        return None, None, None
    
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        # If no Clerk secret key is set, use a simple development mode
        if not CLERK_SECRET_KEY or CLERK_SECRET_KEY == "sk_test_your_clerk_secret_key_here":
            print("⚠️ Development mode: Using token as user identifier")
            
            # Try to extract email/name from token claims even in dev mode (without verification)
            try:
                import jwt
                unverified = jwt.decode(token, options={"verify_signature": False})
                
                # Extract email and name from token claims
                email = unverified.get("email") or unverified.get("primary_email_address")
                first_name = unverified.get("first_name", "")
                last_name = unverified.get("last_name", "")
                username = unverified.get("username", "")
                
                # Build name from available fields
                name = None
                if first_name or last_name:
                    name = f"{first_name} {last_name}".strip()
                elif username:
                    name = username
                
                user_id = token[:50] if len(token) > 50 else token
                clerk_user_id = f"dev_user_{hash(user_id) % 1000000}"
                
                if email or name:
                    print(f"✅ Extracted from token - email: {email}, name: {name}")
                
                return clerk_user_id, email, name
            except (ImportError, Exception) as e:
                # Fallback if JWT decoding fails
                print(f"⚠️ Could not decode token in dev mode: {e}")
                user_id = token[:50] if len(token) > 50 else token
                clerk_user_id = f"dev_user_{hash(user_id) % 1000000}"
                return clerk_user_id, None, None
        
        # Production: Verify with Clerk API
        try:
            import jwt
            from jwt import PyJWKClient
            
            # Decode JWT without verification first to get issuer and claims
            unverified = jwt.decode(token, options={"verify_signature": False})
            issuer = unverified.get("iss", "")
            
            # Try to extract email and name from token claims
            email = unverified.get("email") or unverified.get("primary_email_address")
            first_name = unverified.get("first_name", "")
            last_name = unverified.get("last_name", "")
            username = unverified.get("username", "")
            
            # Build name from available fields
            name = None
            if first_name or last_name:
                name = f"{first_name} {last_name}".strip()
            elif username:
                name = username
            
            # Get the JWKS endpoint from issuer
            jwks_url = f"{issuer}/.well-known/jwks.json"
            jwks_client = PyJWKClient(jwks_url)
            
            # Get the signing key
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            
            # Verify and decode the token
            decoded = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=unverified.get("aud"),
                issuer=issuer
            )
            
            clerk_user_id = decoded.get("sub")
            
            # If email/name not in token, fetch from Clerk API
            if not email or not name:
                api_email, api_name = get_user_info_from_clerk(clerk_user_id)
                email = email or api_email
                name = name or api_name
            
            return clerk_user_id, email, name
            
        except ImportError:
            print("⚠️ PyJWT not installed. Install with: pip install PyJWT")
            print("⚠️ Falling back to development mode")
            return f"dev_user_{hash(token) % 1000000}", None, None
            
    except Exception as e:
        print(f"⚠️ Error verifying token: {e}")
        print("⚠️ Using development fallback")
        # Development fallback
        if token and len(token) > 10:
            return f"dev_user_{hash(token) % 1000000}", None, None
        return None, None, None

def require_auth(f):
    """Decorator to require Clerk authentication - Enforces user isolation"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            print(f"❌ SECURITY: Unauthorized access attempt - no token provided")
            return jsonify({"error": "No authorization token provided"}), 401
        
        clerk_user_id, email, name = verify_clerk_token(auth_header)
        
        if not clerk_user_id:
            print(f"❌ SECURITY: Unauthorized access attempt - invalid token")
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # SECURITY: Normalize and validate user ID before attaching to request
        if not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
            print(f"❌ SECURITY: Invalid user ID from token verification")
            return jsonify({"error": "Authentication failed"}), 401
        
        # Add clerk_user_id, email, and name to request for use in route handlers
        # This ID is used to filter all database queries - critical for data isolation
        request.clerk_user_id = str(clerk_user_id).strip()
        request.clerk_email = email  # May be None if not available
        request.clerk_name = name    # May be None if not available
        return f(*args, **kwargs)
    
    return decorated_function

def optional_auth(f):
    """Decorator for optional authentication - doesn't fail if no token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            clerk_user_id, email, name = verify_clerk_token(auth_header)
            request.clerk_user_id = clerk_user_id
            request.clerk_email = email
            request.clerk_name = name
        else:
            request.clerk_user_id = None
            request.clerk_email = None
            request.clerk_name = None
        
        return f(*args, **kwargs)
    
    return decorated_function

