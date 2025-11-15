import { UserButton } from '@clerk/clerk-react';

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm px-10">
      <h2 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold leading-tight tracking-[-0.015em]">
        Dashboard
      </h2>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default DashboardHeader;
