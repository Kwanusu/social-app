// import { useState, useMemo } from 'react';
// import { useGetPostsQuery } from '../store/apiSlice';
// import { Search } from 'lucide-react';
// import Spinner from '../components/Spinner'; // Import your new spinner

// const Feed = () => {
//   const { data: posts, isLoading } = useGetPostsQuery();
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredPosts = useMemo(() => {
//     if (!posts) return [];
//     return posts.filter(post => 
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.body.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [posts, searchQuery]);

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
//           Community Feed
//         </h1>
        
//         {/* Search Bar */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
//           <input 
//             type="text"
//             placeholder="Search posts..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl 
//                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
//                        focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {isLoading ? (
//         <Spinner /> /* Replaced text with your Spinner component */
//       ) : (
//         <div className="grid gap-4">
//           {filteredPosts.map(post => (
//             <div 
//               key={post.id} 
//               className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 
//                          shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-500/50"
//             >
//               <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
//                 Post #{post.id}
//               </span>
//               <h2 className="text-lg font-semibold mt-1 capitalize text-gray-900 dark:text-white">
//                 {post.title}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
//                 {post.body}
//               </p>
//             </div>
//           ))}

//           {/* Empty State */}
//           {filteredPosts.length === 0 && (
//             <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
//               No posts match your search.
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Feed;

import { useState, useMemo } from 'react';
import { useGetPostsQuery } from '../store/apiSlice';
import { Search, Heart, BellRing, BellPlus, MessageCircle } from 'lucide-react';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext'; // 👈 1. Added import

const Feed = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const showToast = useToast(); // 👈 2. Properly initialized hook
  
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [subscribedUsers, setSubscribedUsers] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // 3. Cleaned up toggleSubscribe logic
  const toggleSubscribe = (userId) => {
    const isSubscribing = !subscribedUsers[userId];
    
    setSubscribedUsers(prev => ({
      ...prev,
      [userId]: isSubscribing
    }));

    showToast(
      isSubscribing ? `Subscribed to User ${userId}` : `Unsubscribed`, 
      'success'
    );
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Feed</h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map(post => {
            const isLiked = likedPosts[post.id];
            const isSubscribed = subscribedUsers[post.userId];

            return (
              <div 
                key={post.id} 
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 
                           dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {post.userId}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">User {post.userId}</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleSubscribe(post.userId)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSubscribed 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isSubscribed ? <BellRing size={14} /> : <BellPlus size={14} />}
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>

                {/* Content */}
                <h2 className="text-lg font-bold capitalize text-gray-900 dark:text-white mb-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {post.body}
                </p>

                {/* Action Footer */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                    <span>{isLiked ? 135 : 134}</span>
                  </button>

                  <button className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageCircle size={20} />
                    <span>24</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feed;

