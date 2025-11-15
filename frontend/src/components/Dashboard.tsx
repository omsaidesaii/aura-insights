import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useReviews } from '@/context/ReviewsContext';
import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { extractKeywords } from '@/utils/chartData';
import { getUserData, refreshUserInfo } from '@/services/api';

const Dashboard = () => {
  const { reviews, setReviews, stats } = useReviews();
  const { getToken, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when component mounts and refresh user info
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoaded) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          // Refresh user info (email/name) from token - this updates the database
          try {
            await refreshUserInfo(token);
            console.log('✅ User info refreshed');
          } catch (err) {
            console.warn('Could not refresh user info:', err);
            // Don't fail the whole load if refresh fails
          }
          
          // Load user reviews data
          const data = await getUserData(token);
          if (data && data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
            console.log(`✅ Loaded ${data.reviews.length} reviews from database`);
          } else {
            console.log('No reviews found in database');
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isLoaded, getToken, setReviews]);

  const displayStats = useMemo(() => [
    { label: 'Total Reviews', value: stats.total.toLocaleString(), icon: 'reviews', iconColor: '' },
    { label: 'Positive %', value: `${stats.positivePercent}%`, icon: 'sentiment_satisfied', iconColor: 'text-green-500' },
    { label: 'Negative %', value: `${stats.negativePercent}%`, icon: 'sentiment_dissatisfied', iconColor: 'text-red-500' },
    { label: 'Positive Count', value: stats.positive.toLocaleString(), icon: 'sentiment_satisfied', iconColor: 'text-green-500' },
  ], [stats]);

  // Generate real aspect data from reviews
  const aspectData = useMemo(() => {
    if (reviews.length === 0) return [];
    return extractKeywords(reviews, 5);
  }, [reviews]);

  // Generate sentiment distribution data
  const sentimentData = useMemo(() => {
    if (reviews.length === 0) return [];
    return [
      {
        label: 'Positive',
        value: stats.positive,
        color: '#10b981', // green
      },
      {
        label: 'Negative',
        value: stats.negative,
        color: '#ef4444', // red
      },
    ];
  }, [stats, reviews.length]);

  const recentReviews = useMemo(() => {
    if (reviews.length === 0) {
      return [];
    }
    return reviews.slice(0, 5).map((review, index) => ({
      id: index,
      reviewText: review.Sentence || '',
      sentiment: review['Predicted sentiment'] || 'Neutral',
      sentimentColor: review['Predicted sentiment'] === 'Positive' 
        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
        : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    }));
  }, [reviews]);

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      
      <div className="flex flex-1 flex-col pl-60">
        <DashboardHeader />
        
        <main className="flex-1 p-8">
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300">Loading your data...</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">{error}</p>
            </div>
          )}
          <div className="flex flex-col gap-8">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-2 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-soft border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center justify-between text-text-secondary-light dark:text-text-secondary-dark">
                    <p className="text-base font-medium">{stat.label}</p>
                    <span className={`material-symbols-outlined ${stat.iconColor}`}>
                      {stat.icon}
                    </span>
                  </div>
                  <p className="text-text-primary-light dark:text-text-primary-dark tracking-tight text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sentiment Distribution */}
              <div className="flex h-96 flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-soft">
                <div className="flex flex-col">
                  <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-semibold">
                    Sentiment Distribution
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    {reviews.length > 0 ? `${reviews.length} reviews analyzed` : 'No data available'}
                  </p>
                </div>
                <div className="flex h-full w-full items-center justify-center">
                  {reviews.length > 0 ? (
                    <PieChart data={sentimentData} size={200} />
                  ) : (
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      Upload a file to see sentiment distribution
                    </p>
                  )}
                </div>
              </div>

              {/* Aspect Frequency */}
              <div className="flex h-96 flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-soft">
                <div className="flex flex-col">
                  <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-semibold">
                    Top Aspects Mentioned
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    {reviews.length > 0 ? `Based on ${reviews.length} reviews` : 'No data available'}
                  </p>
                </div>
                <div className="flex h-full w-full">
                  {reviews.length > 0 && aspectData.length > 0 ? (
                    <BarChart data={aspectData} maxHeight={300} color="#135bec" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                        Upload a file to see aspect frequency
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Reviews Table */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-soft">
              <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-semibold mb-4">
                Recent Reviews {reviews.length > 0 && `(${reviews.length} total)`}
              </h2>
              {recentReviews.length === 0 ? (
                <div className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                  <p>No reviews yet. Upload a CSV file to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">
                      <tr>
                        <th className="py-3 pr-6 font-medium" scope="col">
                          #
                        </th>
                        <th className="py-3 pr-6 font-medium" scope="col">
                          Review Text
                        </th>
                        <th className="py-3 pr-6 font-medium" scope="col">
                          Sentiment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReviews.map((review, index) => (
                        <tr
                          key={review.id}
                          className={index !== recentReviews.length - 1 ? 'border-b border-border-light dark:border-border-dark' : ''}
                        >
                          <td className="py-4 pr-6">{index + 1}</td>
                          <td className="max-w-md truncate py-4 pr-6 text-text-secondary-light dark:text-text-secondary-dark">
                            {review.reviewText}
                          </td>
                          <td className="py-4 pr-6">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${review.sentimentColor}`}
                            >
                              {review.sentiment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
