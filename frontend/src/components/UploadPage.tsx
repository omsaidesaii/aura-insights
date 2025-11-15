import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { predictBulkSentiment, parseCSVBlob } from '@/services/api';
import { useReviews, ReviewData } from '@/context/ReviewsContext';
import { useNavigate } from 'react-router-dom';

interface PreviewRow {
  [key: string]: string | number;
}

const UploadPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<Array<{ name: string; valid: boolean }>>([]);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setReviews } = useReviews();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useAuth();

  // Parse CSV file to preview (Excel files will be handled by backend)
  const parseCSV = (file: File): Promise<{ columns: string[]; rows: PreviewRow[] }> => {
    return new Promise((resolve, reject) => {
      const fileName = file.name.toLowerCase();
      
      // For Excel files, we can't easily parse in browser, so just accept it
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        resolve({ columns: ['File will be processed by backend'], rows: [] });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          // Parse header
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          // Parse first 10 rows
          const rows: PreviewRow[] = [];
          for (let i = 1; i < Math.min(lines.length, 11); i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row: PreviewRow = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            rows.push(row);
          }

          resolve({ columns: headers, rows });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const { columns, rows } = await parseCSV(file);
      
      // Check for review columns (flexible matching)
      const possibleReviewNames = ['Sentence', 'sentence', 'Review', 'review', 'review_text', 'Review Text', 
                            'text', 'Text', 'comment', 'Comment', 'feedback', 'Feedback'];
      
      // Optional columns that are recognized and valid (case-insensitive matching)
      const optionalColumnPatterns = [
        'product_id', 'product', 'productid',
        'rating', 'score', 'stars',
        'date', 'created_at', 'createdat', 'timestamp',
        'asin', 'variation',
        'reviewtext', 'review_text', 'review text'
      ];
      
      const detected = columns.map(col => {
        const colLower = col.toLowerCase().replace(/[_\s]/g, ''); // Normalize: remove underscores and spaces
        const colOriginalLower = col.toLowerCase();
        
        // Check if it's a review column (required)
        const isReviewColumn = possibleReviewNames.some(name => 
          col === name || colOriginalLower.includes('sentence') || colOriginalLower.includes('review')
        );
        
        // Check if it's a recognized optional column (flexible matching)
        const isOptionalColumn = optionalColumnPatterns.some(pattern => {
          const patternLower = pattern.toLowerCase().replace(/[_\s]/g, '');
          return colOriginalLower === pattern || 
                 colOriginalLower.includes(pattern) || 
                 colLower === patternLower ||
                 colLower.includes(patternLower);
        });
        
        // Column is valid if it's either a review column or a recognized optional column
        return {
          name: col,
          valid: isReviewColumn || isOptionalColumn,
        };
      });

      setDetectedColumns(detected);
      setPreviewData(rows);
      
      // For Excel files, show a note
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleProcessReviews = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (!isLoaded) {
      setError('Authentication not ready. Please wait...');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      // Get auth token
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await predictBulkSentiment(selectedFile, token);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Parse the CSV response to get the data
      const parsedData = await parseCSVBlob(result.file);
      
      console.log('Parsed data from backend:', parsedData); // Debug log
      console.log('Number of reviews:', parsedData.length); // Debug log
      
      if (!parsedData || parsedData.length === 0) {
        throw new Error('No data received from backend. Please check your file format and ensure it has a review column.');
      }
      
      // Store the data in context
      setReviews(parsedData as ReviewData[]);
      
      console.log('Reviews stored in context. Total:', parsedData.length); // Debug log

      // Note: CSV download removed - user can download from dashboard if needed
      setSuccess(`Reviews processed successfully! ${parsedData.length} reviews analyzed. Redirecting to dashboard...`);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
        setSuccess(null);
        setUploadProgress(0);
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process reviews');
      setUploadProgress(0);
      setIsProcessing(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-60">
        <DashboardHeader />

        <main className="flex-1 p-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Upload Section */}
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-card-border-light dark:border-card-border-dark px-6 py-14 bg-foreground-light dark:bg-foreground-dark">
              <span className="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark">
                cloud_upload
              </span>
              <div className="flex max-w-md flex-col items-center gap-2 text-center">
                <p className="text-lg font-bold leading-tight tracking-[-0.015em]">Upload CSV or Excel File</p>
                <p className="text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
                  Required column: Sentence, Review, review_text, or similar
                </p>
                <p className="text-xs font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
                  Supported formats: .csv, .xlsx, .xls (max 50MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button 
                onClick={handleChooseFile}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
              >
                <span className="truncate">Choose File Manually</span>
              </button>
              {selectedFile && (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="rounded-xl p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-xl p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
              </div>
            )}

            {/* File Validation & Preview Section */}
            {selectedFile && detectedColumns.length > 0 && (
              <div>
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  File Validation + Preview
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {/* File Columns Detected */}
                  <div className="md:col-span-1 rounded-xl p-6 bg-foreground-light dark:bg-foreground-dark border border-card-border-light dark:border-card-border-dark">
                    <h3 className="font-semibold mb-4">File Columns Detected</h3>
                    <div className="space-y-3">
                      {detectedColumns.map((column) => (
                        <div key={column.name} className="flex items-center gap-x-3">
                          <span className={`material-symbols-outlined ${column.valid ? 'text-green-500' : 'text-yellow-500'}`}>
                            {column.valid ? 'check_circle' : 'warning'}
                          </span>
                          <p className="text-sm font-normal leading-normal">{column.name}</p>
                        </div>
                      ))}
                    </div>
                    {!detectedColumns.some(col => col.valid) && detectedColumns.length > 0 && detectedColumns[0].name !== 'File will be processed by backend' && (
                      <p className="mt-4 text-xs text-yellow-600 dark:text-yellow-400">
                        Note: Backend will look for columns like: Sentence, Review, review_text, etc.
                      </p>
                    )}
                    {(selectedFile?.name.toLowerCase().endsWith('.xlsx') || selectedFile?.name.toLowerCase().endsWith('.xls')) && (
                      <p className="mt-4 text-xs text-blue-600 dark:text-blue-400">
                        Excel file detected. Preview not available, but file will be processed correctly.
                      </p>
                    )}
                  </div>

                  {/* Data Preview Table */}
                  <div className="md:col-span-2 rounded-xl p-6 bg-foreground-light dark:bg-foreground-dark border border-card-border-light dark:border-card-border-dark">
                    <h3 className="font-semibold mb-4">Data Preview (First 10 Rows)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-card-border-light dark:border-card-border-dark text-text-secondary-light dark:text-text-secondary-dark">
                          <tr>
                            {detectedColumns.map((col) => (
                              <th key={col.name} className="px-4 py-2 font-medium">{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr
                              key={index}
                              className={
                                index !== previewData.length - 1
                                  ? 'border-b border-card-border-light dark:border-card-border-dark'
                                  : ''
                              }
                            >
                              {detectedColumns.map((col) => (
                                <td key={col.name} className="px-4 py-3 truncate max-w-xs">
                                  {String(row[col.name] || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Section */}
            {selectedFile && (
              <div className="rounded-xl p-6 bg-foreground-light dark:bg-foreground-dark border border-card-border-light dark:border-card-border-dark flex flex-col items-center gap-4">
                <button
                  className="w-full max-w-xs cursor-pointer rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isProcessing || !selectedFile}
                  onClick={handleProcessReviews}
                >
                  {isProcessing ? 'Processing...' : 'Process Reviews'}
                </button>

                {/* Progress Bar */}
                {isProcessing && (
                  <>
                    <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Processing {selectedFile.name}... ({uploadProgress}% Complete)
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadPage;
