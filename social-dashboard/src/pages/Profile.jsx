// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useGetUserQuery } from '../store/apiSlice';
// import { User, Mail, MapPin, Building, Edit2, Save, X } from 'lucide-react';
// import { useToast } from '../context/ToastContext';

// const Profile = () => {
//   const { id } = useParams(); // Gets '1' from /profile/1
//   const { data: user, isLoading, isError } = useGetUserQuery(id);

//   const showToast = useToast();
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempName, setTempName] = useState('');

//   if (isLoading) return <div className="p-8">Loading Profile...</div>;
//   if (isError) return <div className="p-8 text-red-500">User not found.</div>;

  

// const handleSave = () => {
//   setIsEditing(false);
//   showToast("Profile updated successfully!"); // 👈 No more alerts!
// };

//     return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header / Cover Photo Area */}
//       <div className="h-44 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl"></div>
      
//       {/* Profile Card Container */}
//       <div className="bg-white dark:bg-gray-800 px-8 pb-8 rounded-b-2xl border border-gray-100 dark:border-gray-700 shadow-sm -mt-12 transition-colors">
//         <div className="flex justify-between items-end">
//           <div className="relative">
//             <div className="w-32 h-32 bg-white dark:bg-gray-700 p-2 rounded-2xl shadow-lg">
//               <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
//                 <User size={48} />
//               </div>
//             </div>
//           </div>
          
//           <button 
//             onClick={() => {
//               setIsEditing(!isEditing);
//               setTempName(user.name);
//             }}
//             className="mb-4 flex items-center gap-2 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm text-gray-700 dark:text-gray-200"
//           >
//             {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
//           </button>
//         </div>

//         <div className="mt-6">
//           {isEditing ? (
//             <div className="space-y-4 max-w-md">
//               <div>
//                 <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Full Name</label>
//                 <input 
//                   type="text" 
//                   className="w-full mt-1 p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                   value={tempName}
//                   onChange={(e) => setTempName(e.target.value)}
//                 />
//               </div>
//               <button 
//                 onClick={handleSave}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
//               >
//                 <Save size={16} /> Save Changes
//               </button>
//             </div>
//           ) : (
//             <>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tempName || user.name}</h1>
//               <p className="text-gray-500 dark:text-gray-400">@{user.username.toLowerCase()}</p>
//             </>
//           )}
//         </div>

//         <hr className="my-8 border-gray-100 dark:border-gray-700" />

//         {/* Contact Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//             <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-blue-600 dark:text-blue-400"><Mail size={20} /></div>
//             <div>
//               <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Email</p>
//               <p className="font-medium dark:text-gray-200">{user.email}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//             <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-green-600 dark:text-green-400"><MapPin size={20} /></div>
//             <div>
//               <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Location</p>
//               <p className="font-medium dark:text-gray-200">{user.address.city}, {user.address.street}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//             <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-purple-600 dark:text-purple-400"><Building size={20} /></div>
//             <div>
//               <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Company</p>
//               <p className="font-medium dark:text-gray-200">{user.company.name}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '../context/ToastContext';
import { User, Mail, Calendar, Camera, ShieldCheck, Save } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const showToast = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // --- ADD THIS LINE ---
  const joinDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';
  // ---------------------

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Added this to handle button state
    try {
      await updateProfile(auth.currentUser, { displayName });
      await refreshUser();
      showToast("Profile updated!");
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
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            {displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
            <Camera size={18} />
          </button>
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
        {/* Account Security Stats */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <ShieldCheck className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
            <h4 className="font-bold text-blue-900 dark:text-blue-200">Account Verified</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Your account is secured via {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}.</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Basic Info</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email (Immutable)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

