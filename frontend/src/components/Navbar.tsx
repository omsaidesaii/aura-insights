import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 py-3">
          <div className="flex items-center gap-4 text-[#111318] dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_319)">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_319">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Aura Insights</h2>
          </div>

          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#features">
                Features
              </a>
              <a className="text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#how-it-works">
                How It Works
              </a>
              
              <a className="text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#faq">
                FAQ
              </a>
            </div>
            <div className="flex gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90">
                    <span className="truncate">Get Started Free</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          <div className="md:hidden">
            <button 
              className="text-[#111318] dark:text-white/90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a className="block text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#features">
              Features
            </a>
            <a className="block text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#how-it-works">
              How It Works
            </a>
            <a className="block text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#pricing">
              Pricing
            </a>
            <a className="block text-sm font-medium leading-normal text-[#111318] dark:text-white/90 hover:text-primary dark:hover:text-primary" href="#faq">
              FAQ
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90">
                    <span className="truncate">Get Started Free</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
