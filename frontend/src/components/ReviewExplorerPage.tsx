import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useState, useMemo } from 'react';
import { useReviews } from '@/context/ReviewsContext';

const ReviewExplorerPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [sentimentFilter, setSentimentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { reviews } = useReviews();

  // Transform reviews data for display
  const displayReviews = useMemo(() => {
    let filtered = reviews.map((review, index) => ({
      id: index + 1,
      reviewer: `Reviewer ${index + 1}`,
      sentiment: review['Predicted sentiment'] || 'Neutral',
      sentimentColor: review['Predicted sentiment'] === 'Positive'
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      rating: review['Predicted sentiment'] === 'Positive' ? 5 : 2,
      aspect: 'General',
      reviewText: (review.Sentence || '').substring(0, 100) + ((review.Sentence || '').length > 100 ? '...' : ''),
      date: new Date().toISOString().split('T')[0],
      fullText: review.Sentence || '',
      keywords: (review.Sentence || '').split(' ').slice(0, 5),
    }));

    // Apply filters
    if (sentimentFilter !== 'All') {
      filtered = filtered.filter(r => r.sentiment === sentimentFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.fullText.toLowerCase().includes(query) ||
        r.reviewText.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reviews, sentimentFilter, searchQuery]);

  // Mock data for reviews (fallback)
  const mockReviews = [
    {
      id: 1,
      reviewer: 'John Doe',
      sentiment: 'Positive',
      sentimentColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rating: 5,
      aspect: 'Quality',
      reviewText: 'Amazing product! The quality exceeded my expectations and the support team was very helpful.',
      date: '2023-10-26',
      fullText: 'Amazing product! The quality exceeded my expectations and the support team was very helpful. I would definitely recommend this to anyone looking for a reliable solution.',
      keywords: ['quality', 'exceeded', 'helpful'],
    },
    {
      id: 2,
      reviewer: 'Jane Smith',
      sentiment: 'Negative',
      sentimentColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      rating: 2,
      aspect: 'Shipping',
      reviewText: 'The shipping was slower than promised and the package arrived damaged. Very disappointed with the service.',
      date: '2023-10-25',
      fullText: 'The shipping was slower than promised and the package arrived damaged. Very disappointed with the service. I had to contact support multiple times to get a resolution.',
      keywords: ['shipping', 'slower', 'damaged', 'disappointed'],
    },
    {
      id: 3,
      reviewer: 'Alex Johnson',
      sentiment: 'Neutral',
      sentimentColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      rating: 3,
      aspect: 'Price',
      reviewText: 'It\'s an okay product for the price. It does the job but nothing spectacular.',
      date: '2023-10-24',
      fullText: 'It\'s an okay product for the price. It does the job but nothing spectacular. I\'ve seen better alternatives but this works for now.',
      keywords: ['okay', 'price', 'job'],
    },
    {
      id: 4,
      reviewer: 'Emily White',
      sentiment: 'Positive',
      sentimentColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rating: 5,
      aspect: 'Support',
      reviewText: 'The support team was incredibly responsive and solved my issue in minutes! Highly recommend their service.',
      date: '2023-10-23',
      fullText: 'The support team was incredibly responsive and solved my issue in minutes! Highly recommend their service. They went above and beyond to ensure I was satisfied.',
      keywords: ['support', 'responsive', 'solved', 'recommend'],
    },
    {
      id: 5,
      reviewer: 'Michael Brown',
      sentiment: 'Negative',
      sentimentColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      rating: 1,
      aspect: 'Price',
      reviewText: 'I found a better alternative for a lower price elsewhere. This one is too expensive for what it offers.',
      date: '2023-10-22',
      fullText: 'I found a better alternative for a lower price elsewhere. This one is too expensive for what it offers. The features are basic and not worth the premium pricing.',
      keywords: ['expensive', 'alternative', 'features'],
    },
  ];

  const openDrawer = (review: any) => {
    setSelectedReview(review);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReview(null);
  };

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-60">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-text-light dark:text-text-dark text-2xl font-bold">Review Explorer</h1>
            </div>

            {/* Filters Panel */}
            <div className="rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Sentiment Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Sentiment
                  </label>
                  <select 
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value)}
                    className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>All</option>
                    <option>Positive</option>
                    <option>Negative</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Rating
                  </label>
                  <select className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>All</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                    <option>2 Stars</option>
                    <option>1 Star</option>
                  </select>
                </div>

                {/* Aspect Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Aspect
                  </label>
                  <select className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>All</option>
                    <option>Quality</option>
                    <option>Price</option>
                    <option>Shipping</option>
                    <option>Support</option>
                  </select>
                </div>

                {/* Date Range Picker */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Date Range
                  </label>
                  <select className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div className="lg:col-span-1 flex items-end">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark text-lg">
                        search
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="mt-4 flex justify-end">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Review Table */}
            <div className="rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Reviewer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Sentiment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Aspect
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Review Text
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {displayReviews.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                          {reviews.length === 0 
                            ? 'No reviews available. Upload a CSV file to get started!'
                            : 'No reviews match your filters.'}
                        </td>
                      </tr>
                    ) : (
                      displayReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-background-light dark:hover:bg-background-dark/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                          {review.reviewer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${review.sentimentColor}`}>
                            {review.sentiment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                          {review.rating} ★
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                          {review.aspect}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-xs truncate">
                          {review.reviewText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                          {review.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openDrawer(review)}
                            className="text-primary hover:text-primary/80"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Review Detail Drawer */}
      {isDrawerOpen && selectedReview && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeDrawer}
            ></div>

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-card-light dark:bg-card-dark shadow-xl border-l border-border-light dark:border-border-dark">
                  {/* Drawer Header */}
                  <div className="px-4 py-6 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-text-light dark:text-text-dark">
                        Review Details
                      </h2>
                      <button
                        onClick={closeDrawer}
                        className="ml-3 h-7 flex items-center justify-center rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark focus:outline-none"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {/* Review Metadata */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Reviewer</h3>
                        <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {selectedReview.reviewer}
                        </p>
                      </div>

                      {/* Sentiment and Rating */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Sentiment</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedReview.sentimentColor}`}>
                            {selectedReview.sentiment}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Rating</h3>
                          <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {selectedReview.rating} ★
                          </p>
                        </div>
                      </div>

                      {/* Aspect */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Aspect</h3>
                        <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {selectedReview.aspect}
                        </p>
                      </div>

                      {/* Review Text */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Review</h3>
                        <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {selectedReview.fullText}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Keywords</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedReview.keywords.map((keyword: string, index: number) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Mini Sentiment Chart */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Sentiment Trend</h3>
                        <div className="mt-2 h-32 flex items-end justify-between">
                          <div className="flex items-end h-full space-x-1">
                            {[65, 45, 80, 55, 70, 60, 75].map((value, index) => (
                              <div 
                                key={index}
                                className="w-6 bg-primary rounded-t"
                                style={{ height: `${value}%` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          Last 7 days sentiment trend
                        </div>
                      </div>

                      {/* Reviewer Metadata */}
                      <div>
                        <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Reviewer Information</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">Location:</span>
                            <span className="text-text-light dark:text-text-dark">San Francisco, CA</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Reviews:</span>
                            <span className="text-text-light dark:text-text-dark">12</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">Member Since:</span>
                            <span className="text-text-light dark:text-text-dark">Jan 2023</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="px-4 py-4 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark sm:px-6">
                    <button
                      onClick={closeDrawer}
                      className="w-full inline-flex justify-center rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 py-2 text-base font-medium text-text-light dark:text-text-dark shadow-sm hover:bg-background-light dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewExplorerPage;
