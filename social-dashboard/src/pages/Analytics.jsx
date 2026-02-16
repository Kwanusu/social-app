import { useGetPostsQuery, useGetUserQuery } from '../store/apiSlice';
import { BarChart3, Users, MessageSquare, TrendingUp } from 'lucide-react';

const Analytics = () => {
  // Fetching data via RTK Query
  const { data: posts, isLoading: postsLoading } = useGetPostsQuery();
  const { data: user, isLoading: userLoading } = useGetUserQuery(1);

  if (postsLoading || userLoading) return <div className="p-8 animate-pulse text-gray-500">Calculating metrics...</div>;

  // Derived Analytics (Logic)
  const totalPosts = posts?.length || 0;
  const avgPostLength = Math.round(
    posts?.reduce((acc, post) => acc + post.body.length, 0) / totalPosts
  );
  const engagementRate = (avgPostLength / 10).toFixed(1); // Mock calculation

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: <MessageSquare className="text-blue-500" />, trend: '+12%' },
    { label: 'Avg. Engagement', value: `${engagementRate}%`, icon: <TrendingUp className="text-green-500" />, trend: '+5.4%' },
    { label: 'Active Followers', value: '1,284', icon: <Users className="text-purple-500" />, trend: '+2%' },
    { label: 'Avg. Post Length', value: avgPostLength, icon: <BarChart3 className="text-orange-500" />, trend: '-1.2%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
        <p className="text-gray-500">Welcome back, {user?.name}. Here is what's happening with your profile.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Data Visualization Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Post Performance</h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-end justify-around p-4 gap-2">
            {posts.slice(0, 8).map((post) => (
              <div 
                key={post.id} 
                className="bg-blue-500 w-full rounded-t-md hover:bg-blue-600 transition-all cursor-pointer"
                style={{ height: `${(post.body.length / 300) * 100}%` }}
                title={`Post ID: ${post.id}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Character count per recent post</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Audience Demographics</h3>
          <div className="space-y-4">
            {['Desktop', 'Mobile', 'Tablet'].map((device, i) => (
              <div key={device}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{device}</span>
                  <span className="font-bold">{[65, 25, 10][i]}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full" 
                    style={{ width: `${[65, 25, 10][i]}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;