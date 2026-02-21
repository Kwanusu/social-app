import { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '../context/ToastContext';
import { User, Mail, Calendar, Camera, ShieldCheck, Save, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const showToast = useToast();
  
  // States for form fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const joinDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Firebase updateProfile now includes both name and photoURL
      await updateProfile(auth.currentUser, { 
        displayName, 
        photoURL 
      });
      await refreshUser();
      showToast("Profile updated successfully!");
    } catch (error) {
      showToast("Error updating profile", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          {/* Avatar Display Logic: If user has photoURL, show it; else show Initial */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-gray-700">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg text-white">
            <Camera size={18} />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {displayName || "Anonymous User"}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Mail size={16} /> {user?.email}</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> Joined {joinDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Info Box */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <ShieldCheck className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
            <h4 className="font-bold text-blue-900 dark:text-blue-200">Account Verified</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Secured via {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile Details</h3>
            
            {/* Display Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            {/* Avatar URL Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Avatar Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.com/my-photo.jpg"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1">Tip: Use a URL from Unsplash or Pinterest for your profile picture.</p>
            </div>

            <button 
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
