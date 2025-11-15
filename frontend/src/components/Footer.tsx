const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#111318] dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">Aura Insights</h2>
            </div>
            <p className="text-sm text-[#616f89] dark:text-gray-400">
              AI-powered feedback analysis to help you build better products.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111318] dark:text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Features
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Integrations
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Book a Demo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111318] dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Docs
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Support
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  API Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111318] dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-[#616f89] dark:text-gray-500">© 2024 Aura Insights. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a className="text-[#616f89] dark:text-gray-500 hover:text-primary" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
            <a className="text-[#616f89] dark:text-gray-500 hover:text-primary" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a className="text-[#616f89] dark:text-gray-500 hover:text-primary" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12.019c0 4.435 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.019C22 6.477 17.523 2 12 2z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
