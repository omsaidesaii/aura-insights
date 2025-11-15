const ProductShowcase = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-auto max-w-6xl mx-auto rounded-xl shadow-2xl dark:shadow-primary/20 border border-gray-200 dark:border-gray-800">
          <img
            className="rounded-xl object-cover w-full h-full"
            alt="A clean and modern product dashboard mockup showing various data visualizations and cards."
            src="/productshowcase.png"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
