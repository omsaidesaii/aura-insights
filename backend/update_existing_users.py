"""
Script to update existing users with email and name from Clerk API
Run this script to update users that have null email/name values
"""

import os
from dotenv import load_dotenv
from database import users_collection
from auth import get_user_info_from_clerk

load_dotenv()

def update_existing_users():
    """Update all users with null email or name"""
    try:
        # Test if collection is accessible
        users_collection.find_one()
    except Exception as e:
        print(f"❌ Database not available: {e}")
        return
    
    # Find all users with null email or name
    users_to_update = list(users_collection.find({
        "$or": [
            {"email": None},
            {"email": {"$exists": False}},
            {"name": None},
            {"name": {"$exists": False}}
        ]
    }))
    
    print(f"Found {len(users_to_update)} users to update")
    
    updated_count = 0
    for user in users_to_update:
        clerk_user_id = user.get("clerk_user_id")
        if not clerk_user_id:
            continue
        
        print(f"\nUpdating user: {clerk_user_id}")
        
        # Skip dev users (can't fetch from Clerk API)
        if clerk_user_id.startswith("dev_user_"):
            print(f"  ⚠️ Skipping dev user (can't fetch from Clerk API)")
            continue
        
        # Fetch user info from Clerk API
        email, name = get_user_info_from_clerk(clerk_user_id)
        
        if email or name:
            update_fields = {}
            if email:
                update_fields["email"] = email
                print(f"  ✅ Email: {email}")
            if name:
                update_fields["name"] = name
                print(f"  ✅ Name: {name}")
            
            if update_fields:
                users_collection.update_one(
                    {"clerk_user_id": clerk_user_id},
                    {"$set": update_fields}
                )
                updated_count += 1
        else:
            print(f"  ⚠️ Could not fetch email/name from Clerk API")
    
    print(f"\n✅ Updated {updated_count} users")

if __name__ == "__main__":
    update_existing_users()

