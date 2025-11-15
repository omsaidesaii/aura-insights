const BenefitsSection = () => {
  const benefits = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEO_jcGFxjt-YsvDT7pI69blsbQR3OnqW3rfhoz6N0IdpuzU9bJbzqAiWMhi5TsHJbmsCawrRXjrDuk2e6nhOl2nE0HIGSpYWmKNLkRlYQRGDDfHjsxU6Bt7Qv2BGFghz_Ya5VVBPFFnNG0ZsWfQNt25YihBRxpQlxoNqykp6Zq0yRiyqDu8_xnpHAKcXElnVYOD736noqZq1JQyb8TmYImOeKvyiYhRBTRfsZR69iS_ox03SfH58hkn9e8NQDtKnsVanZSwygPA",
      alt: "illustration of a rising bar chart",
      title: "Improve Product Decisions",
      description: "Use data-driven insights to prioritize your roadmap and build features customers love."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRJovb795pfdglki2FhSHryAuZiizmeWFMbF8umVfSw7iphVxFopBUoZaAK3rnapzOVniupLueqChCbamTWsYiP5x6iPxyEr2DKHOVsLzARbfja4YwoIIV8CguOHiB25LOFhymh0dv1ssMlzJU0NXp2yucO9QNgMloiWAYiOE6C9G1y6nOk8XAKzd1F227o4CyOLwu07OLqwzyQgaGAyqxHKd6ixP_EIzCBLbUQhPxaEiUFZrn8rNZ8KNIYcR2F6qbdvOITsrZpQ",
      alt: "illustration of a person with a question mark",
      title: "Understand Customer Pain Points",
      description: "Quickly identify recurring issues and friction points in the user experience."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZNyZfIRoOzAFnDg8Iw8wyAufwNRhvhQq75YofcVt4pnVkYKhywqrXnRH429AbE0qSsVA_X5gMyD_f4ZGnjsHZ5eqJohpZ2GtA0RlFdf_nJ43m4nWpn3rwcK2ytexQQ5QaW0bCgHn3NFJmkIIct7CsUCKzmXb4BX-YVZawfdXzhCLovoCTQgU92wS3dsRAO91gfVklN8Rv37ifQ6EzVokyRj3z1dB6_OFlp8Tmev2uZO9bEXsRIjOZokC_uWFk0JCdzRh_SSCarQ",
      alt: "illustration of a clock with speed lines",
      title: "Save Analysis Time",
      description: "Automate hundreds of hours of manual feedback analysis and free up your team."
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url("${benefit.image}")` }}
                role="img"
                aria-label={benefit.alt}
              ></div>
              <h3 className="mt-6 text-lg font-bold text-[#111318] dark:text-white">{benefit.title}</h3>
              <p className="mt-2 text-base text-[#616f89] dark:text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
