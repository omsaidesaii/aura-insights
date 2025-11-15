import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from collections import Counter
import re
import pickle
from io import BytesIO
import requests
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import warnings
warnings.filterwarnings('ignore')

# Page config
st.set_page_config(
    page_title="Aspect-Based Sentiment Analysis Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 10px;
        color: white;
        text-align: center;
    }
    .highlight-positive {
        background-color: #d4edda;
        padding: 2px 4px;
        border-radius: 3px;
    }
    .highlight-negative {
        background-color: #f8d7da;
        padding: 2px 4px;
        border-radius: 3px;
    }
    .aspect-phrase {
        background-color: #fff3cd;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'reviews_data' not in st.session_state:
    st.session_state.reviews_data = None
if 'aspects_data' not in st.session_state:
    st.session_state.aspects_data = None
if 'flagged_reviews' not in st.session_state:
    st.session_state.flagged_reviews = set()

# Aspect keywords dictionary (common product aspects)
ASPECT_KEYWORDS = {
    'sound quality': ['sound', 'audio', 'speaker', 'volume', 'bass', 'treble', 'music', 'voice'],
    'design': ['design', 'look', 'appearance', 'style', 'color', 'size', 'shape', 'beautiful'],
    'ease of use': ['easy', 'simple', 'use', 'setup', 'install', 'configure', 'user-friendly'],
    'price': ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value', 'worth'],
    'features': ['feature', 'function', 'capability', 'skill', 'command', 'ability'],
    'battery': ['battery', 'power', 'charge', 'charging', 'life', 'duration'],
    'connectivity': ['wifi', 'bluetooth', 'connection', 'connect', 'network', 'internet'],
    'voice recognition': ['alexa', 'voice', 'recognition', 'understand', 'command', 'response'],
    'customer service': ['service', 'support', 'help', 'customer', 'warranty'],
    'performance': ['performance', 'speed', 'fast', 'slow', 'lag', 'responsive']
}

STOPWORDS = set(stopwords.words("english"))
stemmer = PorterStemmer()

# Load sentiment model
@st.cache_resource
def load_sentiment_model():
    try:
        predictor = pickle.load(open(r"Models/model_xgb.pkl", "rb"))
        scaler = pickle.load(open(r"Models/scaler.pkl", "rb"))
        cv = pickle.load(open(r"Models/countVectorizer.pkl", "rb"))
        return predictor, scaler, cv
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, None, None

def preprocess_text(text):
    """Preprocess text for sentiment analysis"""
    if pd.isna(text):
        return ""
    text = re.sub("[^a-zA-Z]", " ", str(text))
    text = text.lower().split()
    text = [stemmer.stem(word) for word in text if word not in STOPWORDS]
    return " ".join(text)

def predict_sentiment(text, predictor, scaler, cv):
    """Predict sentiment for a text"""
    if not text:
        return "Neutral", 0.5
    
    corpus = [preprocess_text(text)]
    X_prediction = cv.transform(corpus).toarray()
    X_prediction_scl = scaler.transform(X_prediction)
    y_proba = predictor.predict_proba(X_prediction_scl)[0]
    
    sentiment_idx = y_proba.argmax()
    confidence = y_proba[sentiment_idx]
    sentiment = "Positive" if sentiment_idx == 1 else "Negative"
    
    return sentiment, confidence

def extract_aspects(review_text):
    """Extract aspects from review text using keyword matching"""
    if pd.isna(review_text):
        return []
    
    text_lower = str(review_text).lower()
    found_aspects = []
    
    for aspect, keywords in ASPECT_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                # Find the phrase containing the keyword
                words = text_lower.split()
                for i, word in enumerate(words):
                    if keyword in word:
                        # Extract context around keyword (3 words before and after)
                        start = max(0, i - 2)
                        end = min(len(words), i + 3)
                        phrase = " ".join(words[start:end])
                        found_aspects.append({
                            'aspect': aspect,
                            'keyword': keyword,
                            'phrase': phrase,
                            'original_phrase': extract_original_phrase(review_text, keyword)
                        })
                        break
                break
    
    return found_aspects

def extract_original_phrase(text, keyword):
    """Extract the original phrase (with original casing) containing the keyword"""
    text_lower = str(text).lower()
    keyword_lower = keyword.lower()
    
    if keyword_lower in text_lower:
        idx = text_lower.find(keyword_lower)
        # Extract surrounding context
        start = max(0, idx - 30)
        end = min(len(text), idx + len(keyword) + 30)
        return text[start:end].strip()
    return keyword

def highlight_aspects_in_text(text, aspects):
    """Highlight aspect phrases in text"""
    if pd.isna(text) or not aspects:
        return text
    
    highlighted = str(text)
    for aspect_info in aspects:
        phrase = aspect_info['original_phrase']
        if phrase and phrase.lower() in highlighted.lower():
            # Find and highlight the phrase
            pattern = re.compile(re.escape(phrase), re.IGNORECASE)
            highlighted = pattern.sub(
                f'<span class="aspect-phrase">{phrase}</span>',
                highlighted
            )
    
    return highlighted

# Main Dashboard
st.title("📊 Aspect-Based Sentiment Analysis Dashboard")
st.markdown("---")

# Sidebar - File Upload and Product Selection
with st.sidebar:
    st.header("📁 Data Input")
    
    uploaded_file = st.file_uploader(
        "Upload Reviews CSV/TSV File",
        type=['csv', 'tsv'],
        help="Upload a file with reviews. Expected columns: review text, rating (optional), product_id (optional)"
    )
    
    if uploaded_file is not None:
        # Detect file type and read
        file_ext = uploaded_file.name.split('.')[-1].lower()
        if file_ext == 'tsv':
            df = pd.read_csv(uploaded_file, sep='\t')
        else:
            df = pd.read_csv(uploaded_file)
        
        st.session_state.reviews_data = df
        
        # Auto-detect columns
        review_col = None
        rating_col = None
        product_col = None
        
        # Try to find review column
        possible_review_cols = ['review', 'reviews', 'text', 'comment', 'feedback', 'verified_reviews', 'sentence']
        for col in df.columns:
            if any(possible in col.lower() for possible in possible_review_cols):
                review_col = col
                break
        
        # Try to find rating column
        possible_rating_cols = ['rating', 'score', 'stars']
        for col in df.columns:
            if any(possible in col.lower() for possible in possible_rating_cols):
                rating_col = col
                break
        
        # Try to find product column
        possible_product_cols = ['product', 'product_id', 'asin', 'variation']
        for col in df.columns:
            if any(possible in col.lower() for possible in possible_product_cols):
                product_col = col
                break
        
        # Store column mappings
        st.session_state.review_col = review_col or df.columns[0]
        st.session_state.rating_col = rating_col
        st.session_state.product_col = product_col
        
        st.success(f"✅ Loaded {len(df)} reviews")
        
        # Product selection
        if product_col and product_col in df.columns:
            products = ['All Products'] + sorted(df[product_col].dropna().unique().tolist())
            selected_product = st.selectbox("Select Product", products)
            st.session_state.selected_product = selected_product
        else:
            st.session_state.selected_product = 'All Products'
            st.info("No product ID column found. Showing all reviews.")

# Main Content
if st.session_state.reviews_data is not None:
    df = st.session_state.reviews_data.copy()
    review_col = st.session_state.review_col
    rating_col = st.session_state.rating_col
    product_col = st.session_state.product_col
    
    # Filter by product if selected
    if st.session_state.selected_product != 'All Products' and product_col:
        df = df[df[product_col] == st.session_state.selected_product]
    
    # Ensure review column exists
    if review_col not in df.columns:
        st.error(f"Review column '{review_col}' not found in data!")
        st.stop()
    
    # Process reviews and extract aspects
    with st.spinner("Analyzing reviews and extracting aspects..."):
        predictor, scaler, cv = load_sentiment_model()
        
        if predictor is None:
            st.error("Could not load sentiment model. Please check Models folder.")
            st.stop()
        
        # Process each review
        processed_data = []
        all_aspects = []
        
        for idx, row in df.iterrows():
            review_text = row[review_col]
            rating = row[rating_col] if rating_col and rating_col in row else None
            
            # Predict sentiment
            sentiment, confidence = predict_sentiment(review_text, predictor, scaler, cv)
            
            # Extract aspects
            aspects = extract_aspects(review_text)
            
            processed_data.append({
                'review_id': idx,
                'review_text': review_text,
                'sentiment': sentiment,
                'confidence': confidence,
                'rating': rating,
                'aspects': aspects,
                'num_aspects': len(aspects)
            })
            
            # Collect all aspects
            for aspect_info in aspects:
                all_aspects.append({
                    'review_id': idx,
                    'aspect': aspect_info['aspect'],
                    'phrase': aspect_info['original_phrase'],
                    'sentiment': sentiment,
                    'confidence': confidence
                })
        
        st.session_state.aspects_data = pd.DataFrame(all_aspects)
        st.session_state.processed_data = processed_data
    
    # Aggregate Cards
    st.markdown("### 📈 Overview Metrics")
    col1, col2, col3, col4 = st.columns(4)
    
    total_reviews = len(processed_data)
    avg_rating = df[rating_col].mean() if rating_col and rating_col in df.columns else None
    total_aspects = len(st.session_state.aspects_data)
    unique_aspects = st.session_state.aspects_data['aspect'].nunique() if len(st.session_state.aspects_data) > 0 else 0
    
    with col1:
        st.metric("Total Reviews", f"{total_reviews:,}")
    with col2:
        if avg_rating:
            st.metric("Avg Rating", f"{avg_rating:.2f} ⭐")
        else:
            st.metric("Avg Rating", "N/A")
    with col3:
        st.metric("Total Aspects", f"{total_aspects:,}")
    with col4:
        st.metric("Unique Aspects", f"{unique_aspects}")
    
    st.markdown("---")
    
    # Main Content Area
    if len(st.session_state.aspects_data) > 0:
        col_left, col_right = st.columns([2, 1])
        
        with col_left:
            st.markdown("### 📊 Top 10 Aspects by Mention Count")
            
            # Count aspects
            aspect_counts = st.session_state.aspects_data['aspect'].value_counts().head(10)
            
            # Create bar chart
            fig_bar = px.bar(
                x=aspect_counts.values,
                y=aspect_counts.index,
                orientation='h',
                labels={'x': 'Mention Count', 'y': 'Aspect'},
                color=aspect_counts.values,
                color_continuous_scale='viridis',
                title=""
            )
            fig_bar.update_layout(
                height=400,
                showlegend=False,
                yaxis={'categoryorder': 'total ascending'}
            )
            st.plotly_chart(fig_bar, use_container_width=True)
        
        with col_right:
            st.markdown("### 🎯 Select Aspect")
            
            # Aspect selector
            unique_aspects_list = st.session_state.aspects_data['aspect'].unique().tolist()
            selected_aspect = st.selectbox(
                "Choose an aspect to analyze",
                unique_aspects_list,
                key="aspect_selector"
            )
            
            if selected_aspect:
                # Filter data for selected aspect
                aspect_data = st.session_state.aspects_data[
                    st.session_state.aspects_data['aspect'] == selected_aspect
                ]
                
                # Sentiment distribution
                sentiment_counts = aspect_data['sentiment'].value_counts()
                
                # Create donut chart
                colors = {'Positive': '#28a745', 'Negative': '#dc3545', 'Neutral': '#ffc107'}
                fig_donut = go.Figure(data=[go.Pie(
                    labels=sentiment_counts.index,
                    values=sentiment_counts.values,
                    hole=0.4,
                    marker_colors=[colors.get(s, '#6c757d') for s in sentiment_counts.index],
                    textinfo='label+percent',
                    textposition='outside'
                )])
                fig_donut.update_layout(
                    title=f"Sentiment Distribution: {selected_aspect}",
                    height=350,
                    showlegend=True
                )
                st.plotly_chart(fig_donut, use_container_width=True)
                
                # Aspect stats
                st.markdown(f"**Statistics for {selected_aspect}:**")
                st.write(f"• Total Mentions: {len(aspect_data)}")
                st.write(f"• Positive: {len(aspect_data[aspect_data['sentiment'] == 'Positive'])}")
                st.write(f"• Negative: {len(aspect_data[aspect_data['sentiment'] == 'Negative'])}")
                avg_conf = aspect_data['confidence'].mean()
                st.write(f"• Avg Confidence: {avg_conf:.2%}")
        
        st.markdown("---")
        
        # Review Table
        st.markdown("### 📋 Review Details")
        
        # Filter options
        col_filter1, col_filter2, col_filter3 = st.columns(3)
        
        with col_filter1:
            filter_aspect = st.selectbox(
                "Filter by Aspect",
                ['All Aspects'] + unique_aspects_list,
                key="filter_aspect"
            )
        
        with col_filter2:
            filter_sentiment = st.selectbox(
                "Filter by Sentiment",
                ['All', 'Positive', 'Negative'],
                key="filter_sentiment"
            )
        
        with col_filter3:
            search_text = st.text_input("🔍 Search Reviews", key="search_input")
        
        # Filter processed data
        filtered_reviews = processed_data.copy()
        
        if filter_aspect != 'All Aspects':
            filtered_reviews = [
                r for r in filtered_reviews
                if any(a['aspect'] == filter_aspect for a in r['aspects'])
            ]
        
        if filter_sentiment != 'All':
            filtered_reviews = [r for r in filtered_reviews if r['sentiment'] == filter_sentiment]
        
        if search_text:
            filtered_reviews = [
                r for r in filtered_reviews
                if search_text.lower() in str(r['review_text']).lower()
            ]
        
        # Display reviews
        st.markdown(f"**Showing {len(filtered_reviews)} of {total_reviews} reviews**")
        
        for review in filtered_reviews[:50]:  # Limit to 50 for performance
            review_id = review['review_id']
            review_text = review['review_text']
            sentiment = review['sentiment']
            confidence = review['confidence']
            aspects = review['aspects']
            rating = review.get('rating', 'N/A')
            
            # Create expandable review card
            with st.expander(
                f"{'✅' if sentiment == 'Positive' else '❌'} Review #{review_id} | "
                f"Sentiment: {sentiment} ({confidence:.1%}) | "
                f"Rating: {rating} | "
                f"Aspects: {len(aspects)}",
                expanded=False
            ):
                # Highlight aspect phrases
                highlighted_text = highlight_aspects_in_text(review_text, aspects)
                
                # Apply sentiment color
                sentiment_color = '#d4edda' if sentiment == 'Positive' else '#f8d7da'
                
                st.markdown(
                    f'<div style="background-color: {sentiment_color}; padding: 15px; border-radius: 5px; margin: 10px 0;">'
                    f'<p style="margin: 0;">{highlighted_text}</p>'
                    f'</div>',
                    unsafe_allow_html=True
                )
                
                # Show aspects
                if aspects:
                    st.markdown("**Detected Aspects:**")
                    aspect_list = ", ".join([f"{a['aspect']} ({a['original_phrase'][:30]}...)" for a in aspects[:5]])
                    st.write(aspect_list)
                
                # Flag button
                col_flag, col_space = st.columns([1, 4])
                with col_flag:
                    if st.button("🚩 Flag Review", key=f"flag_{review_id}"):
                        st.session_state.flagged_reviews.add(review_id)
                        st.success("Review flagged!")
        
        if len(filtered_reviews) > 50:
            st.info(f"Showing first 50 reviews. Total: {len(filtered_reviews)}")
        
        # Export Buttons
        st.markdown("---")
        st.markdown("### 💾 Export Data")
        
        col_exp1, col_exp2, col_exp3 = st.columns(3)
        
        with col_exp1:
            # Export Summary
            summary_data = {
                'Metric': ['Total Reviews', 'Avg Rating', 'Total Aspects', 'Unique Aspects'],
                'Value': [
                    total_reviews,
                    avg_rating if avg_rating else 'N/A',
                    total_aspects,
                    unique_aspects
                ]
            }
            summary_df = pd.DataFrame(summary_data)
            summary_csv = summary_df.to_csv(index=False)
            st.download_button(
                "📄 Export Summary",
                summary_csv,
                "summary.csv",
                "text/csv",
                key="export_summary"
            )
        
        with col_exp2:
            # Export Full Data
            export_data = []
            for review in processed_data:
                for aspect_info in review['aspects']:
                    export_data.append({
                        'Review ID': review['review_id'],
                        'Review Text': review['review_text'],
                        'Aspect': aspect_info['aspect'],
                        'Aspect Phrase': aspect_info['original_phrase'],
                        'Sentiment': review['sentiment'],
                        'Confidence': review['confidence'],
                        'Rating': review.get('rating', 'N/A')
                    })
            
            if export_data:
                export_df = pd.DataFrame(export_data)
                export_csv = export_df.to_csv(index=False)
                st.download_button(
                    "📊 Download Full CSV",
                    export_csv,
                    "aspect_sentiment_analysis.csv",
                    "text/csv",
                    key="export_csv"
                )
        
        with col_exp3:
            # Flagged Reviews
            if st.session_state.flagged_reviews:
                flagged_data = [
                    processed_data[i] for i in range(len(processed_data))
                    if processed_data[i]['review_id'] in st.session_state.flagged_reviews
                ]
                flagged_df = pd.DataFrame([
                    {
                        'Review ID': r['review_id'],
                        'Review Text': r['review_text'],
                        'Sentiment': r['sentiment'],
                        'Confidence': r['confidence']
                    }
                    for r in flagged_data
                ])
                flagged_csv = flagged_df.to_csv(index=False)
                st.download_button(
                    "🚩 Download Flagged Reviews",
                    flagged_csv,
                    "flagged_reviews.csv",
                    "text/csv",
                    key="export_flagged"
                )
            else:
                st.info("No flagged reviews")
    
    else:
        st.warning("No aspects found in the reviews. Please check your data format.")
else:
    st.info("👈 Please upload a reviews file to get started!")
    st.markdown("""
    ### Expected File Format:
    - **CSV or TSV file** with review data
    - Should contain a column with review text (auto-detected)
    - Optional: rating column, product_id column
    
    ### Example Columns:
    - `review` or `text` or `verified_reviews` - Review text
    - `rating` - Rating (1-5 stars)
    - `product_id` or `variation` - Product identifier
    """)


