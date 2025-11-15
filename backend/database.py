from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "synapse_sentiment")

# Initialize MongoDB client
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    
    # Test connection
    client.admin.command('ping')
    print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
except ConnectionFailure as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")

# Collection references
users_collection = db.users
reviews_collection = db.reviews
analysis_sessions_collection = db.analysis_sessions
user_preferences_collection = db.user_preferences

# Create indexes
def create_indexes():
    """Create indexes for better query performance"""
    try:
        # Users collection
        users_collection.create_index("clerk_user_id", unique=True)
        
        # Reviews collection
        reviews_collection.create_index("clerk_user_id")
        reviews_collection.create_index("created_at")
        reviews_collection.create_index([("clerk_user_id", 1), ("created_at", -1)])
        
        # Analysis sessions collection
        analysis_sessions_collection.create_index("clerk_user_id")
        analysis_sessions_collection.create_index("created_at")
        analysis_sessions_collection.create_index([("clerk_user_id", 1), ("created_at", -1)])
        
        print("✅ Database indexes created successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not create indexes: {e}")

# Initialize indexes when module is imported
create_indexes()

