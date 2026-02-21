import { useState, useMemo } from 'react';
import { useGetPostsQuery } from '../store/apiSlice';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard'; // Import the new component
import { useToast } from '../context/ToastContext'; 
import { Search } from 'lucide-react';

const Feed = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const showToast = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [subscribedUsers, setSubscribedUsers] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSubscribe = (userId) => {
    const isSubscribing = !subscribedUsers[userId];
    setSubscribedUsers(prev => ({ ...prev, [userId]: isSubscribing }));
    showToast(isSubscribing ? `Subscribed to User ${userId}` : `Unsubscribed`, 'success');
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (error) return <div className="text-center p-10 text-red-500 font-medium">Error loading feed.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl sticky top-4 z-20 shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Community Feed</h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="grid gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id}
              post={post}
              isLiked={likedPosts[post.id]}
              isSubscribed={subscribedUsers[post.userId]}
              toggleLike={toggleLike}
              toggleSubscribe={toggleSubscribe}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            No posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;