const TestimonialsSection = () => {
  const testimonials = [
    {
      rating: 5,
      quote: "Aura Insights transformed how we process feedback. We're now able to spot trends in hours instead of weeks. It's a game-changer for our product team.",
      author: "Sarah Johnson",
      role: "Head of Product, Innovate Inc.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJD2bkKNH1FNb4B_aktmp5_JNZ3NIjfL9PQOfT90It0KncDH1j8NnAvWiR0X3SFzSeLyWVoTJZ2ACzQZa6fyYU84FoRKln72Ln3WkM52QXwDnC37BDTA-92qgEdwePLTed7kETv4BU5h2rH201srP3VRyQwrh5rX6nsxeU0pR2qg9n8afYxZ4fC3lC7cC6s9YG9SErENRQUn5IPdAr5UfqIfK1lnBPB4gM66y7qAfHKALw3UDanAMsO3wzDnkO7mc2xbH3Z07kMw"
    },
    {
      rating: 5,
      quote: "The automatic topic clustering is incredibly accurate. We've uncovered insights that were previously buried in thousands of support tickets. Highly recommended!",
      author: "Michael Chen",
      role: "CX Manager, Tech Solutions",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKZJwVf_55zobw2ZNxJiJ4YMFq-kEKsAjM4Uwsu_W4LQ9sleL-Xf7kpixypcnpLfd2sl__6HvB30HS9bn6brNGcwaSV0ZQ9-Es5skWBtsbExJugAhcQXAcMjJWzxDUp3Eok-YJC_3yuihdkJszaY4_H2LS2Zm8TWwqOgZV9T-d7gl-WkWamO8VvD69TWSkukbqeXa5GrIkKWRijf51xHAxPC_9CwyLDr_dsx43awF47UbaGhSuCTt1HhS9Utl36xlXMrfGauINow"
    },
    {
      rating: 5,
      quote: "As a startup, we need to move fast. Aura Insights gives us the clarity to make confident roadmap decisions without spending all our time on manual analysis.",
      author: "Emily Rodriguez",
      role: "Co-founder, LaunchPad",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC6QKOGH8cTdEk85z5KNxFKJ0VUTWAI3B6RvN33Nukd-VtWG2PdKdDBgKw-46JWK3ed75W3RlOUbE_exape9S5Gh176ubYXcUw-jxLSz713CjLvEcCR9JHx8W0p5h51dQKxYPDEgmQNgLHga8NwqTDViGSdA5xXOfI80HAZtqm1N7UMiEKNoESM5dDwuFgPmMvOFXwCqwbQW2r_bYcUgBQ3KfeV3qiHs5rg75BHg3m1bFG_5zs2cYNKKL0Lc3EoEf_Vrxg270I4A"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-[#111318] dark:text-white">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-lg text-[#616f89] dark:text-gray-400">
            Don't just take our word for it. Here's what our customers are saying.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="p-8 bg-background-light dark:bg-background-dark rounded-xl shadow-sm">
              <div className="flex text-primary">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined">star</span>
                ))}
              </div>
              <p className="mt-4 text-base text-[#111318] dark:text-white/90">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  className="h-12 w-12 rounded-full"
                  alt={`Profile picture of ${testimonial.author}`}
                  src={testimonial.avatar}
                />
                <div>
                  <p className="font-bold text-[#111318] dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-[#616f89] dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
