const HeroSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[#111318] dark:text-white">
            Unlock Actionable Insights from Customer Feedback
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#616f89] dark:text-gray-400">
            Aura Insights uses AI to analyze customer reviews, support tickets, and surveys, giving you a clear view of what your customers truly need.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90">
              <span className="truncate">Get Started Free</span>
            </button>
                
          </div>
        </div>
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <div className="w-full h-auto max-w-5xl mx-auto rounded-xl shadow-2xl dark:shadow-primary/20">
            <img 
              className="rounded-xl object-cover w-full h-full" 
              alt="Abstract image of an analytics dashboard with colorful charts and graphs" 
              src="/hero.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
