import { useState, useMemo } from 'react';
import { useGetPostsQuery } from '../store/apiSlice';
import { Search, Filter } from 'lucide-react';

const Feed = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const [searchQuery, setSearchQuery] = useState('');

  // Search logic: Filters posts based on title or body text
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Community Feed</h1>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading your feed...</div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-blue-200">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Post #{post.id}</span>
              <h2 className="text-lg font-semibold mt-1 capitalize">{post.title}</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">{post.body}</p>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed">
              No posts match your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;