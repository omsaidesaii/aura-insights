const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface PredictionResponse {
  prediction: 'Positive' | 'Negative';
  confidence: number;
}

export interface BulkPredictionResponse {
  file: Blob;
  graphData?: string;
}

export interface UserReview {
  _id?: string;
  text: string;
  predicted_sentiment: 'Positive' | 'Negative';
  confidence?: number;
  created_at?: string;
}

export interface UserSession {
  _id: string;
  filename: string;
  total_reviews: number;
  positive_count: number;
  negative_count: number;
  created_at: string;
}

export interface UserStats {
  total_reviews: number;
  positive_reviews: number;
  negative_reviews: number;
  total_sessions: number;
  account_created?: string;
}

export interface UserDataResponse {
  reviews: Array<{
    Sentence: string;
    'Predicted sentiment': 'Positive' | 'Negative';
    confidence?: number;
  }>;
  total: number;
}

/**
 * Helper function to get auth headers
 */
const getAuthHeaders = (token: string | null): HeadersInit => {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Test the backend connection
 */
export const testConnection = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

/**
 * Predict sentiment for a single text
 */
export const predictSentiment = async (text: string, token: string | null): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting sentiment:', error);
    throw error;
  }
};

/**
 * Upload CSV file for bulk sentiment prediction
 */
export const predictBulkSentiment = async (file: File, token: string | null): Promise<BulkPredictionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const graphData = response.headers.get('X-Graph-Data') || undefined;

    return {
      file: blob,
      graphData,
    };
  } catch (error) {
    console.error('Error predicting bulk sentiment:', error);
    throw error;
  }
};

/**
 * Download the predictions CSV file
 */
export const downloadFile = (blob: Blob, filename: string = 'Predictions.csv'): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Parse CSV blob to JSON array
 * Handles quoted values and commas within quotes
 */
export const parseCSVBlob = async (blob: Blob): Promise<any[]> => {
  const text = await blob.text();
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return [];
  }

  // Simple CSV parser that handles quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    // Add last field
    result.push(current.trim());
    return result;
  };

  // Parse header
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
  
  // Parse all rows
  const rows: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, ''));
    if (values.length === headers.length && values.some(v => v)) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }

  return rows;
};

/**
 * Get all user data including reviews (formatted for frontend)
 */
export const getUserData = async (token: string | null): Promise<UserDataResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user-data`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Get user reviews
 */
export const getUserReviews = async (token: string | null, limit = 50, skip = 0): Promise<{ reviews: UserReview[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews?limit=${limit}&skip=${skip}`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Get user analysis sessions
 */
export const getUserSessions = async (token: string | null): Promise<{ sessions: UserSession[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (token: string | null): Promise<UserStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Refresh user email and name from Clerk
 */
export const refreshUserInfo = async (token: string | null): Promise<{ success: boolean; email: string | null; name: string | null }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/refresh-user-info`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing user info:', error);
    throw error;
  }
};


