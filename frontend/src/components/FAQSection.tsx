const FAQSection = () => {
  const faqs = [
    {
      question: "What kind of data can I analyze?",
      answer: "Aura Insights can analyze any text-based customer feedback. This includes app store reviews, support tickets (from platforms like Zendesk or Intercom), survey responses, NPS comments, social media mentions, and more. If it's text, we can analyze it."
    },
    {
      question: "How is this different from manual tagging?",
      answer: "Manual tagging is time-consuming, prone to human bias, and struggles to keep up with high volumes of feedback. Our AI automates this process, providing more consistent, objective, and scalable analysis in a fraction of the time."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, data security is our top priority. We use industry-standard encryption for data in transit and at rest. We are fully GDPR and CCPA compliant and never share your data with third parties. Your insights belong to you."
    },
    {
      question: "How long does it take to get set up?",
      answer: "Getting started is fast and easy. You can connect your first data source in under 5 minutes. Initial analysis may take a few hours depending on the volume of your data, but you'll start seeing insights on the same day."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-[#111318] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-[#616f89] dark:text-gray-400">
            Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>
        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer"
            >
              <summary className="flex items-center justify-between font-bold text-[#111318] dark:text-white">
                {faq.question}
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <p className="mt-4 text-base text-[#616f89] dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
