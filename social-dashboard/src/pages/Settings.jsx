import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { auth } from '../firebase';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Save, 
  Trash2 
} from 'lucide-react';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const showToast = useToast();
  const user = auth.currentUser;

  // Local state for UI toggles
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    mentions: true
  });

  const handleSaveSettings = () => {
    // In a real app, you would sync this with Firestore
    showToast("Settings updated successfully!");
  };

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation - Left Side */}
        <div className="space-y-2">
          {['Profile', 'Notifications', 'Security', 'Appearance'].map((item) => (
            <button
              key={item}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                item === 'Profile' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content - Right Side */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Account Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
              <User size={18} className="text-blue-500" /> Public Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                  <User size={32} />
                </div>
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Change Avatar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Username</label>
                  <input 
                    type="text" 
                    defaultValue={user?.displayName || "User"}
                    className="w-full mt-1 p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={user?.email || ""}
                    className="w-full mt-1 p-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
              {isDark ? <Moon size={18} className="text-purple-500" /> : <Sun size={18} className="text-orange-500" />} 
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500">Adjust how the dashboard looks to your eyes.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
              <Bell size={18} className="text-green-500" /> Notifications
            </h3>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', icon: <Mail size={16}/> },
                { id: 'push', label: 'Push Notifications', icon: <Smartphone size={16}/> }
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">{notif.icon}</span>
                    <span className="text-sm dark:text-white">{notif.label}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications[notif.id]} 
                    onChange={() => handleToggle(notif.id)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
            <h3 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-2">
              <Shield size={18} /> Danger Zone
            </h3>
            <p className="text-sm text-red-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
              <Trash2 size={16} /> Delete Account
            </button>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveSettings}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Save size={18} /> Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

