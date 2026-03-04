import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  BellPlus, 
  BellRing, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PostCard = ({ post, isLiked, isSubscribed, toggleLike, toggleSubscribe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="group bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 
                   transition-all duration-300 ease-in-out 
                   rounded-2xl border shadow-sm hover:shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        
        {/* Left: Image Section */}
        <div className="md:w-1/3 lg:w-1/4 bg-gray-100 dark:bg-gray-700 relative overflow-hidden h-48 md:h-auto">
          <img 
            src={`https://picsum.photos/seed/${post.id}/400/500`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt="post visual"
          />
        </div>

        {/* Right: Content Section */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            {/* Post Metadata */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://i.pravatar.cc/150?u=${post.userId}`} 
                  className="w-9 h-9 rounded-full border-2 border-blue-500 p-0.5" 
                  alt="avatar" 
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">User_{post.userId}</p>
                  <p className="text-[10px] text-gray-500">Post #{post.id} • 2h ago</p>
                </div>
              </div>

              <button 
                onClick={() => toggleSubscribe(post.userId)}
                className={`p-2 rounded-xl transition-all ${
                  isSubscribed ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isSubscribed ? <BellRing size={18} /> : <BellPlus size={18} />}
              </button>
            </div>

            {/* Title & Body */}
            <h2 className="text-lg font-bold capitalize text-gray-900 dark:text-white mb-2 leading-tight">
              {post.title}
            </h2>

            <div className="relative">
              <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}>
                {post.body}
              </p>
              
              {post.body.length > 120 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp size={14} /></>
                  ) : (
                    <>Read Full Post <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Interaction Footer */}
          <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-50 dark:border-gray-700/50">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={isLiked ? 'fill-current animate-pulse' : ''} />
                <span>{isLiked ? 135 : 134}</span>
              </button>

              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle size={18} />
                <span>24 Comments</span>
              </button>
            </div>
            
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;