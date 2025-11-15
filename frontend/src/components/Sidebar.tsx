import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { icon: 'upload', label: 'Upload', href: '/upload' },
    { icon: 'insights', label: 'Insights', href: '/insights' },
    { icon: 'manage_search', label: 'Review Explorer', href: '/reviews' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-full w-60 flex-col bg-card-light dark:bg-card-dark shadow-soft">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2">
            <a href="/" className="size-6 text-primary">
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
            </a>
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">
              Aura Insights
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive && item.icon === 'dashboard' ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <p className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
