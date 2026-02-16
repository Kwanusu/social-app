import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, User, Share2 } from 'lucide-react';


const MainLayout = () => {
    const location = useLocation();

    const navItems = [
        {name: 'Feed', path: '/feed', icon: <Share2 size={20} />},
        {name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />},
        {name: 'My Profile', path: '/profile', icon: <User size={20} />},
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
        <aside className="w-64 bg-white border-r flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 text-blue-600 font-bold text-xl">
          <LayoutDashboard /> <span>SocialDash</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* This is where the Feed, Analytics, etc. will render! */}
      </main>
    </div>
  );
};

export default MainLayout;