import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useReviews } from '@/context/ReviewsContext';
import { useMemo } from 'react';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { generateSentimentOverTime, extractKeywords, extractWordCloud } from '@/utils/chartData';

const InsightsPage = () => {
  const { reviews, stats } = useReviews();

  const displayStats = useMemo(() => [
    {
      label: 'Sentiment Breakdown',
      value: `${stats.positivePercent}%`,
      badge: 'Positive',
      badgeColor: 'text-positive',
      change: `${stats.positive} positive reviews`,
      changeColor: 'text-positive',
    },
    {
      label: 'Total Reviews',
      value: stats.total.toLocaleString(),
      badge: null,
      change: `${stats.negative} negative reviews`,
      changeColor: 'text-negative',
    },
    {
      label: 'Positive Ratio',
      value: `${stats.positivePercent}%`,
      badge: null,
      change: `${stats.negativePercent}% negative`,
      changeColor: stats.positivePercent >= 50 ? 'text-positive' : 'text-negative',
    },
    {
      label: 'Reviews Processed',
      value: stats.total.toLocaleString(),
      badge: null,
      change: 'All reviews analyzed',
      changeColor: 'text-positive',
    },
  ], [stats]);

  // Generate real aspect data from reviews
  const topAspects = useMemo(() => {
    if (reviews.length === 0) return [];
    return extractKeywords(reviews, 5);
  }, [reviews]);

  // Generate sentiment over time data
  const sentimentOverTime = useMemo(() => {
    if (reviews.length === 0) return [];
    return generateSentimentOverTime(reviews, 10);
  }, [reviews]);

  // Generate word cloud data
  const wordCloudData = useMemo(() => {
    if (reviews.length === 0) return [];
    return extractWordCloud(reviews, 15);
  }, [reviews]);

  const insights = [
    {
      icon: 'trending_down',
      iconBg: 'bg-negative/20',
      iconColor: 'text-negative',
      borderColor: 'border-negative',
      title: "Spike in negative sentiment for 'shipping'",
      description:
        'Negative mentions of "shipping times" and "delivery" increased by 35% this week, primarily from customers in the West region.',
      quote:
        '"My order took over two weeks to arrive. The tracking was never updated and the delivery was unacceptably slow."',
    },
    {
      icon: 'support_agent',
      iconBg: 'bg-positive/20',
      iconColor: 'text-positive',
      borderColor: 'border-positive',
      title: "'Customer support' praised for efficiency",
      description:
        'Positive sentiment for customer support interactions has increased by 15%, with multiple reviews highlighting quick resolution times.',
      quote:
        '"I had an issue with my account and the support team resolved it in under 5 minutes. Incredibly helpful and fast!"',
    },
    {
      icon: 'sell',
      iconBg: 'bg-neutral/20',
      iconColor: 'text-neutral',
      borderColor: 'border-neutral',
      title: 'New pricing model receives mixed feedback',
      description:
        'The new subscription tiers are a frequent topic. While some users appreciate the flexibility, others find the changes confusing.',
      quote:
        '"Not sure how I feel about the new pricing yet. The \'Pro\' plan seems like good value but the feature breakdown is a bit unclear."',
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-60">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-2 rounded-lg p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark"
                >
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-text-light dark:text-text-dark tracking-tight text-3xl font-bold leading-tight">
                      {stat.value}
                    </p>
                    {stat.badge && (
                      <p className={`${stat.badgeColor} font-semibold`}>{stat.badge}</p>
                    )}
                  </div>
                  <p className={`${stat.changeColor} text-sm font-medium leading-normal`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Sentiment Over Time */}
              <div className="xl:col-span-2 flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">
                  Sentiment Over Time
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                  Positive sentiment percentage by batch
                </p>
                {reviews.length > 0 && sentimentOverTime.length > 0 ? (
                  <LineChart data={sentimentOverTime} color="#3B82F6" height={240} />
                ) : (
                  <div className="flex items-center justify-center min-h-[240px]">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      Upload a file to see sentiment trends
                    </p>
                  </div>
                )}
              </div>

              {/* Top Aspects */}
              <div className="flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">
                  Top Aspects
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                  Most mentioned topics
                </p>
                {reviews.length > 0 && topAspects.length > 0 ? (
                  <div className="flex-1 min-h-[240px]">
                    <BarChart data={topAspects} maxHeight={240} color="#135bec" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[240px]">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      No data available
                    </p>
                  </div>
                )}
              </div>

              {/* Word Cloud */}
              <div className="flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">
                  Top Keywords
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                  Most frequent words
                </p>
                {reviews.length > 0 && wordCloudData.length > 0 ? (
                  <div className="flex-1 flex flex-wrap items-start justify-center gap-2 p-4 min-h-[240px] bg-background-light dark:bg-background-dark rounded-md">
                    {wordCloudData.map((item, index) => {
                      const size = Math.max(12, Math.min(24, 12 + (item.count / wordCloudData[0].count) * 12));
                      return (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 rounded text-text-primary-light dark:text-text-primary-dark hover:bg-primary/10 transition-colors"
                          style={{ fontSize: `${size}px`, fontWeight: item.count > wordCloudData[0].count * 0.5 ? 'bold' : 'normal' }}
                          title={`Mentioned ${item.count} times`}
                        >
                          {item.word}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[240px]">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      Upload a file to see keywords
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section Header */}
            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-tight pt-4">
              Generated Insights
            </h2>

            {/* Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-lg p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${insight.iconBg} ${insight.iconColor} p-2 rounded-lg`}>
                      <span className="material-symbols-outlined !text-2xl">{insight.icon}</span>
                    </div>
                    <h3 className="text-text-light dark:text-text-dark text-base font-semibold leading-normal">
                      {insight.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    {insight.description}
                  </p>
                  <blockquote className={`border-l-4 ${insight.borderColor} pl-4 py-2 bg-background-light dark:bg-background-dark rounded-r-md`}>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm italic">
                      {insight.quote}
                    </p>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InsightsPage;
