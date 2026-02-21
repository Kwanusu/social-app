import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3, 
  User, 
  Share2, 
  LogOut, 
  Sun, 
  Moon, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Feed', path: '/feed', icon: <Share2 size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20}/> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col p-6
      `}>
        
        {/* Header: Logo & Theme Toggle */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-xl">
            <LayoutDashboard className="w-8 h-8" />
            <span className="tracking-tight">SocialDash</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section: Logout */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <LayoutDashboard size={24} />
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
