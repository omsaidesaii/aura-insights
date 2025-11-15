import { ReviewData } from '@/context/ReviewsContext';

// Extract keywords from reviews for aspect analysis
export const extractKeywords = (reviews: ReviewData[], topN: number = 10): Array<{ label: string; value: number }> => {
  const keywordCounts: Record<string, number> = {};
  
  // Common aspect keywords
  const aspectKeywords: Record<string, string[]> = {
    'Quality': ['quality', 'durable', 'well made', 'excellent', 'good', 'great', 'amazing', 'perfect'],
    'Price': ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value', 'worth', 'money'],
    'Shipping': ['shipping', 'delivery', 'arrived', 'fast', 'slow', 'package', 'tracking'],
    'Support': ['support', 'customer service', 'help', 'assistance', 'response', 'service'],
    'Service': ['service', 'staff', 'team', 'helpful', 'friendly', 'professional'],
  };

  reviews.forEach((review) => {
    const text = (review.Sentence || '').toLowerCase();
    Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          keywordCounts[aspect] = (keywordCounts[aspect] || 0) + 1;
        }
      });
    });
  });

  return Object.entries(keywordCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
};

// Generate sentiment over time data (group reviews into batches)
export const generateSentimentOverTime = (reviews: ReviewData[], batches: number = 10): Array<{ label: string; value: number }> => {
  if (reviews.length === 0) return [];

  const batchSize = Math.ceil(reviews.length / batches);
  const data: Array<{ label: string; value: number }> = [];

  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);
    const positiveCount = batch.filter(
      (r) => r['Predicted sentiment'] === 'Positive'
    ).length;
    const percentage = (positiveCount / batch.length) * 100;
    data.push({
      label: `Batch ${Math.floor(i / batchSize) + 1}`,
      value: Math.round(percentage),
    });
  }

  return data;
};

// Extract most common words for word cloud
export const extractWordCloud = (reviews: ReviewData[], topN: number = 20): Array<{ word: string; count: number }> => {
  const wordCounts: Record<string, number> = {};
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'very', 'really', 'just', 'not', 'no',
  ]);

  reviews.forEach((review) => {
    const words = (review.Sentence || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word));

    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

