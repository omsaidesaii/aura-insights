# Frontend-Backend Connection Guide

This guide explains how the frontend and backend are connected for the customer review system.

## Backend Setup

1. **Start the Flask backend server:**
   ```bash
   cd backend
   python api.py
   ```
   The backend will run on `http://localhost:5000`

2. **Verify backend is running:**
   - Visit `http://localhost:5000/test` in your browser
   - You should see: "Test request received successfully. Service is running."

## Frontend Setup

1. **Install dependencies (if not already done):**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the `frontend` directory
   - Add: `VITE_API_BASE_URL=http://localhost:5000`
   - Or use the default (already configured in `api.ts`)

3. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Backend Endpoints

- **GET `/test`** - Test connection
  - Returns: "Test request received successfully. Service is running."

- **POST `/predict`** - Predict sentiment
  - **For single text:**
    - Body: `{ "text": "Your review text here" }`
    - Response: `{ "prediction": "Positive" | "Negative", "confidence": 0.95 }`
  
  - **For bulk CSV file:**
    - Body: FormData with `file` field containing CSV file
    - CSV must have a "Sentence" column
    - Response: CSV file with predictions + graph data in headers

## Frontend Components Connected

### UploadPage (`/upload`)
- **File Upload**: Users can upload CSV files for bulk sentiment analysis
- **File Preview**: Shows detected columns and first 10 rows
- **Processing**: Sends file to backend `/predict` endpoint
- **Download**: Automatically downloads predictions CSV file

### API Service (`src/services/api.ts`)
- `testConnection()` - Test backend connection
- `predictSentiment(text)` - Predict sentiment for single text
- `predictBulkSentiment(file)` - Predict sentiment for CSV file
- `downloadFile(blob, filename)` - Download predictions file

## CSV File Format

The backend expects CSV files with a **"Sentence"** column containing the review text:

```csv
Sentence
"This product is amazing!"
"I was disappointed with the quality."
```

The backend will add a "Predicted sentiment" column with "Positive" or "Negative" values.

## Troubleshooting

### CORS Errors
- The backend has CORS enabled via `flask-cors`
- If you still see CORS errors, check that the backend is running and accessible

### Connection Refused
- Ensure the backend is running on port 5000
- Check firewall settings
- Verify `VITE_API_BASE_URL` in frontend `.env` matches backend URL

### File Upload Issues
- Ensure CSV file has a "Sentence" column
- Check file size (max 50MB)
- Verify file is a valid CSV format

### Model Loading Errors
- Ensure model files exist in `backend/Models/`:
  - `model_xgb.pkl`
  - `scaler.pkl`
  - `countVectorizer.pkl`

## Development Notes

- The frontend uses Vite proxy configuration for development (optional)
- CORS is enabled in the backend for cross-origin requests
- API calls are handled through the centralized `api.ts` service
- Error handling is implemented in both frontend and backend


