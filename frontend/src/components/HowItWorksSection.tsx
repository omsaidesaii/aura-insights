const HowItWorksSection = () => {
  const steps = [
    {
      icon: "cloud_upload",
      number: 1,
      title: "Connect Your Data",
      description: "Securely link your customer feedback sources like Intercom, Zendesk, or App Store reviews."
    },
    {
      icon: "model_training",
      number: 2,
      title: "AI Analyzes Reviews",
      description: "Our AI gets to work, identifying topics, sentiment, and key trends in your data automatically."
    },
    {
      icon: "summarize",
      number: 3,
      title: "Get Actionable Reports",
      description: "Receive clear, concise dashboards and reports that highlight what matters most."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-[#111318] dark:text-white">
            Get insights in 3 simple steps
          </h2>
          <p className="mt-4 text-lg text-[#616f89] dark:text-gray-400">
            Spend less time analyzing and more time building what your customers want.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mx-auto">
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-[#111318] dark:text-white">
                  {step.number}. {step.title}
                </h3>
                <p className="mt-2 text-base text-[#616f89] dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
