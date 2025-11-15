from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import re
from io import BytesIO
import nltk
from datetime import datetime
import os
from dotenv import load_dotenv

# Download NLTK data if not already present
try:
    from nltk.corpus import stopwords
    stopwords.words("english")
except LookupError:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords', quiet=True)
    from nltk.corpus import stopwords

from nltk.stem.porter import PorterStemmer
import matplotlib.pyplot as plt
import pandas as pd
import pickle
import base64

# Import database and auth modules
try:
    from database import users_collection, reviews_collection, analysis_sessions_collection
    from auth import require_auth, optional_auth
    DB_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Warning: Database modules not available: {e}")
    DB_AVAILABLE = False

STOPWORDS = set(stopwords.words("english"))

load_dotenv()

app = Flask(__name__)

# Configure CORS for production
# Get allowed origins from environment or default to all for development
allowed_origins = os.getenv("CORS_ORIGINS", "*")
if allowed_origins == "*":
    CORS(app)  # Allow all origins in development
else:
    # Allow specific origins in production
    origins = [origin.strip() for origin in allowed_origins.split(",")]
    CORS(app, origins=origins, supports_credentials=True)


@app.route("/test", methods=["GET"])
def test():
    return "Test request received successfully. Service is running."


@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")


@app.route("/index", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    return render_template("dashboard.html")


def get_or_create_user(clerk_user_id, email=None, name=None):
    """Get existing user or create new one, updating email/name if missing"""
    if not DB_AVAILABLE:
        return None
    
    try:
        user = users_collection.find_one({"clerk_user_id": clerk_user_id})
        
        if not user:
            # Create new user
            user = {
                "clerk_user_id": clerk_user_id,
                "email": email,
                "name": name,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "total_reviews": 0,
                "total_sessions": 0
            }
            users_collection.insert_one(user)
            print(f"✅ Created new user: {clerk_user_id} (email: {email}, name: {name})")
        else:
            # Update user info if email or name is missing
            update_fields = {"updated_at": datetime.utcnow()}
            updated = False
            
            # Update email if missing and we have it
            if (not user.get("email") or user.get("email") is None) and email:
                update_fields["email"] = email
                updated = True
                print(f"✅ Updated email for user: {clerk_user_id} -> {email}")
            
            # Update name if missing and we have it
            if (not user.get("name") or user.get("name") is None) and name:
                update_fields["name"] = name
                updated = True
                print(f"✅ Updated name for user: {clerk_user_id} -> {name}")
            
            # Update the user document
            if updated:
                users_collection.update_one(
                    {"clerk_user_id": clerk_user_id},
                    {"$set": update_fields}
                )
            else:
                # Just update last activity if no info to update
                users_collection.update_one(
                    {"clerk_user_id": clerk_user_id},
                    {"$set": {"updated_at": datetime.utcnow()}}
                )
        
        return user
    except Exception as e:
        print(f"Error in get_or_create_user: {e}")
        return None

@app.route("/predict", methods=["POST"])
@require_auth
def predict():
    # Get Clerk user ID, email, and name from authentication middleware
    # SECURITY: This is set by @require_auth decorator after verifying the token
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    email = getattr(request, 'clerk_email', None)
    name = getattr(request, 'clerk_name', None)
    
    # Double-check: Ensure we have a valid user ID (should never happen if auth works correctly)
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Authentication failed - invalid clerk_user_id")
        return jsonify({"error": "Authentication required"}), 401
    
    # Normalize the user ID
    clerk_user_id = str(clerk_user_id).strip()
    
    # Get or create user with email and name
    if DB_AVAILABLE:
        user = get_or_create_user(clerk_user_id, email=email, name=name)
    
    # Select the predictor to be loaded from Models folder
    predictor = pickle.load(open(r"Models/model_xgb.pkl", "rb"))
    scaler = pickle.load(open(r"Models/scaler.pkl", "rb"))
    cv = pickle.load(open(r"Models/countVectorizer.pkl", "rb"))
    
    try:
        # Check if the request contains a file (for bulk prediction) or text input
        if "file" in request.files:
            # Bulk prediction from CSV or Excel file
            file = request.files["file"]
            filename = file.filename.lower()
            
            # Read file based on extension
            if filename.endswith('.csv'):
                data = pd.read_csv(file)
            elif filename.endswith(('.xlsx', '.xls')):
                data = pd.read_excel(file)
            else:
                return jsonify({"error": "Unsupported file format. Please upload CSV or Excel (.xlsx, .xls) file."}), 400
            
            # Find the review text column (flexible column name matching)
            review_column = None
            possible_names = ['Sentence', 'sentence', 'Review', 'review', 'review_text', 'Review Text', 
                            'text', 'Text', 'comment', 'Comment', 'feedback', 'Feedback']
            
            for col in data.columns:
                if col in possible_names or 'sentence' in col.lower() or 'review' in col.lower():
                    review_column = col
                    break
            
            if review_column is None:
                return jsonify({"error": f"Could not find review column. Available columns: {', '.join(data.columns)}. Expected column names: Sentence, Review, review_text, etc."}), 400
            
            # Rename the column to 'Sentence' for consistency
            data = data.rename(columns={review_column: 'Sentence'})

            predictions, graph = bulk_prediction(predictor, scaler, cv, data)
            
            # Save bulk analysis session to MongoDB
            session_id = None
            if DB_AVAILABLE:
                try:
                    session_id = save_bulk_analysis(clerk_user_id, data, file.filename)
                    # Update user stats
                    users_collection.update_one(
                        {"clerk_user_id": clerk_user_id},
                        {
                            "$inc": {"total_sessions": 1, "total_reviews": len(data)},
                            "$set": {"updated_at": datetime.utcnow()}
                        }
                    )
                    print(f"✅ Saved bulk analysis session for user: {clerk_user_id}")
                except Exception as e:
                    print(f"Error saving bulk analysis: {e}")

            response = send_file(
                predictions,
                mimetype="text/csv",
                as_attachment=True,
                download_name="Predictions.csv",
            )

            response.headers["X-Graph-Exists"] = "true"
            response.headers["X-Graph-Data"] = base64.b64encode(graph.getbuffer()).decode("ascii")
            if session_id:
                response.headers["X-Session-Id"] = str(session_id)

            return response

        elif request.json and "text" in request.json:
            # Single string prediction
            text_input = request.json["text"]
            predicted_sentiment, confidence = single_prediction_with_confidence(predictor, scaler, cv, text_input)
            
            # Save individual review to MongoDB
            if DB_AVAILABLE:
                try:
                    save_review(clerk_user_id, text_input, predicted_sentiment, confidence)
                    # Update user stats
                    users_collection.update_one(
                        {"clerk_user_id": clerk_user_id},
                        {
                            "$inc": {"total_reviews": 1},
                            "$set": {"updated_at": datetime.utcnow()}
                        }
                    )
                    print(f"✅ Saved review for user: {clerk_user_id}")
                except Exception as e:
                    print(f"Error saving review: {e}")

            return jsonify({"prediction": predicted_sentiment, "confidence": confidence})
        else:
            return jsonify({"error": "Invalid request. Please provide either a file or text in JSON format."}), 400

    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return jsonify({"error": str(e)}), 500


def single_prediction(predictor, scaler, cv, text_input):
    corpus = []
    stemmer = PorterStemmer()
    review = re.sub("[^a-zA-Z]", " ", text_input)
    review = review.lower().split()
    review = [stemmer.stem(word) for word in review if not word in STOPWORDS]
    review = " ".join(review)
    corpus.append(review)
    X_prediction = cv.transform(corpus).toarray()
    X_prediction_scl = scaler.transform(X_prediction)
    y_predictions = predictor.predict_proba(X_prediction_scl)
    y_predictions = y_predictions.argmax(axis=1)[0]

    return "Positive" if y_predictions == 1 else "Negative"


def single_prediction_with_confidence(predictor, scaler, cv, text_input):
    corpus = []
    stemmer = PorterStemmer()
    review = re.sub("[^a-zA-Z]", " ", text_input)
    review = review.lower().split()
    review = [stemmer.stem(word) for word in review if not word in STOPWORDS]
    review = " ".join(review)
    corpus.append(review)
    X_prediction = cv.transform(corpus).toarray()
    X_prediction_scl = scaler.transform(X_prediction)
    y_proba = predictor.predict_proba(X_prediction_scl)[0]
    y_predictions = y_proba.argmax()
    confidence = float(y_proba[y_predictions])
    sentiment = "Positive" if y_predictions == 1 else "Negative"
    
    return sentiment, confidence


def bulk_prediction(predictor, scaler, cv, data):
    corpus = []
    stemmer = PorterStemmer()
    for i in range(0, data.shape[0]):
        review = re.sub("[^a-zA-Z]", " ", data.iloc[i]["Sentence"])
        review = review.lower().split()
        review = [stemmer.stem(word) for word in review if not word in STOPWORDS]
        review = " ".join(review)
        corpus.append(review)

    X_prediction = cv.transform(corpus).toarray()
    X_prediction_scl = scaler.transform(X_prediction)
    y_predictions = predictor.predict_proba(X_prediction_scl)
    y_predictions = y_predictions.argmax(axis=1)
    y_predictions = list(map(sentiment_mapping, y_predictions))

    data["Predicted sentiment"] = y_predictions
    predictions_csv = BytesIO()

    data.to_csv(predictions_csv, index=False)
    predictions_csv.seek(0)

    graph = get_distribution_graph(data)

    return predictions_csv, graph


def get_distribution_graph(data):
    fig = plt.figure(figsize=(5, 5))
    colors = ("green", "red")
    wp = {"linewidth": 1, "edgecolor": "black"}
    tags = data["Predicted sentiment"].value_counts()
    explode = (0.01, 0.01)

    tags.plot(
        kind="pie",
        autopct="%1.1f%%",
        shadow=True,
        colors=colors,
        startangle=90,
        wedgeprops=wp,
        explode=explode,
        title="Sentiment Distribution",
        xlabel="",
        ylabel="",
    )

    graph = BytesIO()
    plt.savefig(graph, format="png")
    plt.close()

    return graph


def sentiment_mapping(x):
    if x == 1:
        return "Positive"
    else:
        return "Negative"


def save_review(clerk_user_id, text, sentiment, confidence):
    """Save individual review prediction to MongoDB - ONLY for authenticated user"""
    if not DB_AVAILABLE:
        return None
    
    # Security check: Ensure clerk_user_id is valid and not None
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Attempted to save review with invalid clerk_user_id: {clerk_user_id}")
        return None
    
    try:
        review = {
            "clerk_user_id": str(clerk_user_id).strip(),  # Ensure it's a string and trimmed
            "text": text,
            "predicted_sentiment": sentiment,
            "confidence": float(confidence),
            "created_at": datetime.utcnow()
        }
        result = reviews_collection.insert_one(review)
        print(f"✅ Saved review for user: {clerk_user_id[:20]}...")  # Only log partial ID for security
        return result.inserted_id
    except Exception as e:
        print(f"❌ Error saving review to MongoDB: {e}")
        return None


def save_bulk_analysis(clerk_user_id, data, filename):
    """Save bulk analysis session to MongoDB - ONLY for authenticated user"""
    if not DB_AVAILABLE:
        return None
    
    # Security check: Ensure clerk_user_id is valid and not None
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Attempted to save bulk analysis with invalid clerk_user_id: {clerk_user_id}")
        return None
    
    try:
        # Normalize clerk_user_id to ensure consistency
        clerk_user_id = str(clerk_user_id).strip()
        
        positive_count = len(data[data["Predicted sentiment"] == "Positive"])
        negative_count = len(data[data["Predicted sentiment"] == "Negative"])
        
        # Save session summary - ONLY linked to this user's ID
        session = {
            "clerk_user_id": clerk_user_id,  # Always use the authenticated user's ID
            "filename": filename,
            "total_reviews": len(data),
            "positive_count": int(positive_count),
            "negative_count": int(negative_count),
            "created_at": datetime.utcnow()
        }
        session_result = analysis_sessions_collection.insert_one(session)
        session_id = session_result.inserted_id
        
        # Save individual reviews from the bulk analysis - ALL linked to this user's ID
        reviews_to_insert = []
        for _, row in data.iterrows():
            review_doc = {
                "clerk_user_id": clerk_user_id,  # CRITICAL: Always use authenticated user's ID
                "text": str(row.get("Sentence", "")),
                "predicted_sentiment": str(row.get("Predicted sentiment", "Unknown")),
                "session_id": session_id,
                "created_at": datetime.utcnow()
            }
            reviews_to_insert.append(review_doc)
        
        if reviews_to_insert:
            reviews_collection.insert_many(reviews_to_insert)
            print(f"✅ Saved {len(reviews_to_insert)} reviews for user: {clerk_user_id[:20]}...")  # Only log partial ID
        
        return session_id
    except Exception as e:
        print(f"❌ Error saving bulk analysis to MongoDB: {e}")
        return None


# New endpoints to retrieve user data
@app.route("/api/reviews", methods=["GET"])
@require_auth
def get_user_reviews():
    """Get all reviews for the authenticated user ONLY - Data isolation enforced"""
    if not DB_AVAILABLE:
        return jsonify({"error": "Database not available"}), 503
    
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    
    # SECURITY: Validate user ID - prevents any bypass attempts
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Unauthorized access attempt to reviews endpoint")
        return jsonify({"error": "Authentication required"}), 401
    
    # Normalize to prevent any injection or manipulation
    clerk_user_id = str(clerk_user_id).strip()
    
    try:
        limit = request.args.get('limit', 50, type=int)
        skip = request.args.get('skip', 0, type=int)
        
        # CRITICAL: Query ONLY filtered by authenticated user's ID
        # This ensures users can ONLY see their own data
        reviews = list(reviews_collection.find(
            {"clerk_user_id": clerk_user_id},  # User isolation enforced here
            {"_id": 1, "text": 1, "predicted_sentiment": 1, "confidence": 1, "created_at": 1}
        ).sort("created_at", -1).limit(limit).skip(skip))
        
        # Convert ObjectId to string and datetime to ISO format
        for review in reviews:
            review["_id"] = str(review["_id"])
            if "created_at" in review and isinstance(review["created_at"], datetime):
                review["created_at"] = review["created_at"].isoformat()
        
        return jsonify({"reviews": reviews})
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/sessions", methods=["GET"])
@require_auth
def get_user_sessions():
    """Get all analysis sessions for the authenticated user ONLY - Data isolation enforced"""
    if not DB_AVAILABLE:
        return jsonify({"error": "Database not available"}), 503
    
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    
    # SECURITY: Validate user ID
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Unauthorized access attempt to sessions endpoint")
        return jsonify({"error": "Authentication required"}), 401
    
    # Normalize user ID
    clerk_user_id = str(clerk_user_id).strip()
    
    try:
        # CRITICAL: Query ONLY filtered by authenticated user's ID
        sessions = list(analysis_sessions_collection.find(
            {"clerk_user_id": clerk_user_id}  # User isolation enforced here
        ).sort("created_at", -1))
        
        for session in sessions:
            session["_id"] = str(session["_id"])
            if "created_at" in session and isinstance(session["created_at"], datetime):
                session["created_at"] = session["created_at"].isoformat()
        
        return jsonify({"sessions": sessions})
    except Exception as e:
        print(f"Error fetching sessions: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
@require_auth
def get_user_stats():
    """Get user statistics for authenticated user ONLY - Data isolation enforced"""
    if not DB_AVAILABLE:
        return jsonify({"error": "Database not available"}), 503
    
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    email = getattr(request, 'clerk_email', None)
    name = getattr(request, 'clerk_name', None)
    
    # SECURITY: Validate user ID
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Unauthorized access attempt to stats endpoint")
        return jsonify({"error": "Authentication required"}), 401
    
    # Normalize user ID
    clerk_user_id = str(clerk_user_id).strip()
    
    try:
        # Only access this user's data
        user = users_collection.find_one({"clerk_user_id": clerk_user_id})
        
        if not user:
            # Create user if doesn't exist
            user = get_or_create_user(clerk_user_id, email=email, name=name)
        else:
            # Update user info if email/name is missing
            get_or_create_user(clerk_user_id, email=email, name=name)
        
        # CRITICAL: All stats queries filtered by authenticated user's ID only
        # This ensures users can ONLY see their own statistics
        total_reviews = reviews_collection.count_documents({"clerk_user_id": clerk_user_id})
        positive_reviews = reviews_collection.count_documents({
            "clerk_user_id": clerk_user_id,  # User isolation enforced
            "predicted_sentiment": "Positive"
        })
        negative_reviews = reviews_collection.count_documents({
            "clerk_user_id": clerk_user_id,  # User isolation enforced
            "predicted_sentiment": "Negative"
        })
        total_sessions = analysis_sessions_collection.count_documents({"clerk_user_id": clerk_user_id})  # User isolation enforced
        
        return jsonify({
            "total_reviews": total_reviews,
            "positive_reviews": positive_reviews,
            "negative_reviews": negative_reviews,
            "total_sessions": total_sessions,
            "account_created": user.get("created_at").isoformat() if user and user.get("created_at") else None
        })
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/refresh-user-info", methods=["POST"])
@require_auth
def refresh_user_info():
    """Refresh user email and name from Clerk API - Force update even if values exist"""
    if not DB_AVAILABLE:
        return jsonify({"error": "Database not available"}), 503
    
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    email = getattr(request, 'clerk_email', None)
    name = getattr(request, 'clerk_name', None)
    
    if not clerk_user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Force update user info (update even if values already exist)
        user = users_collection.find_one({"clerk_user_id": clerk_user_id})
        
        if not user:
            # Create new user
            user = get_or_create_user(clerk_user_id, email=email, name=name)
        else:
            # Force update email/name if we have new values
            update_fields = {"updated_at": datetime.utcnow()}
            updated = False
            
            if email:
                update_fields["email"] = email
                updated = True
                print(f"✅ Force updated email for user: {clerk_user_id} -> {email}")
            
            if name:
                update_fields["name"] = name
                updated = True
                print(f"✅ Force updated name for user: {clerk_user_id} -> {name}")
            
            if updated:
                users_collection.update_one(
                    {"clerk_user_id": clerk_user_id},
                    {"$set": update_fields}
                )
                user = users_collection.find_one({"clerk_user_id": clerk_user_id})
        
        return jsonify({
            "success": True,
            "email": user.get("email") if user else None,
            "name": user.get("name") if user else None
        })
    except Exception as e:
        print(f"Error refreshing user info: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/user-data", methods=["GET"])
@require_auth
def get_user_data():
    """Get all user data including reviews formatted for frontend - ONLY for authenticated user"""
    if not DB_AVAILABLE:
        return jsonify({"error": "Database not available"}), 503
    
    clerk_user_id = getattr(request, 'clerk_user_id', None)
    
    # SECURITY: Validate user ID
    if not clerk_user_id or not isinstance(clerk_user_id, str) or len(clerk_user_id.strip()) == 0:
        print(f"❌ SECURITY: Unauthorized access attempt to user-data endpoint")
        return jsonify({"error": "Authentication required"}), 401
    
    # Normalize user ID
    clerk_user_id = str(clerk_user_id).strip()
    
    try:
        # CRITICAL: Query ONLY filtered by authenticated user's ID
        # This is the main endpoint that loads user data - isolation is critical here
        reviews_cursor = reviews_collection.find(
            {"clerk_user_id": clerk_user_id},  # User isolation enforced - users can ONLY see their own reviews
            {"text": 1, "predicted_sentiment": 1, "confidence": 1, "created_at": 1, "_id": 0}  # Only include needed fields (clerk_user_id excluded by not including it)
        ).sort("created_at", -1)
        
        # Format reviews for frontend (matching ReviewData interface)
        formatted_reviews = []
        for review in reviews_cursor:
            formatted_review = {
                "Sentence": review.get("text", ""),
                "Predicted sentiment": review.get("predicted_sentiment", "Unknown"),
            }
            if "confidence" in review:
                formatted_review["confidence"] = review["confidence"]
            formatted_reviews.append(formatted_review)
        
        return jsonify({
            "reviews": formatted_reviews,
            "total": len(formatted_reviews)
        })
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
