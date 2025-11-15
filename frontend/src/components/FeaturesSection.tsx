const FeaturesSection = () => {
  const features = [
    {
      icon: "sentiment_satisfied",
      title: "Aspect-Based Sentiment",
      description: "Go beyond positive or negative. Understand sentiment towards specific features, pricing, and support."
    },
    {
      icon: "bubble_chart",
      title: "Automatic Topic Clustering",
      description: "Automatically group feedback into relevant topics and themes without manual tagging."
    },
    {
      icon: "trending_up",
      title: "Real-time Trend Detection",
      description: "Identify emerging issues or popular requests as they happen, not weeks later."
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-[#111318] dark:text-white">
            Discover What Matters Most
          </h2>
          <p className="mt-4 text-lg text-[#616f89] dark:text-gray-400">
            Our advanced AI models dig deep into your qualitative data so you can focus on building a better product.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
              <p className="text-base text-[#616f89] dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
