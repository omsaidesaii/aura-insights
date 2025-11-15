import { createContext, useContext, useState, ReactNode } from 'react';

export interface ReviewData {
  Sentence: string;
  'Predicted sentiment': 'Positive' | 'Negative';
  [key: string]: string | number; // For other columns that might exist
}

interface ReviewsContextType {
  reviews: ReviewData[];
  setReviews: (reviews: ReviewData[]) => void;
  stats: {
    total: number;
    positive: number;
    negative: number;
    positivePercent: number;
    negativePercent: number;
  };
  clearReviews: () => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

interface ReviewsProviderProps {
  children: ReactNode;
}

export const ReviewsProvider = ({ children }: ReviewsProviderProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const calculateStats = (reviewsData: ReviewData[]) => {
    const total = reviewsData.length;
    const positive = reviewsData.filter(
      (r) => r['Predicted sentiment'] === 'Positive'
    ).length;
    const negative = total - positive;
    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

    return {
      total,
      positive,
      negative,
      positivePercent,
      negativePercent,
    };
  };

  const stats = calculateStats(reviews);

  const clearReviews = () => {
    setReviews([]);
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        setReviews,
        stats,
        clearReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

