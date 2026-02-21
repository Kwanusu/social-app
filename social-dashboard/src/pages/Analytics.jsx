import React from 'react';
import { useGetPostsQuery, useGetUserQuery } from '../store/apiSlice';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Smile 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import Spinner from '../components/Spinner';

const Analytics = () => {
  const { data: posts, isLoading: postsLoading, error: postsError } = useGetPostsQuery();
  const { data: user, isLoading: userLoading } = useGetUserQuery(1);

  if (postsError) {
    console.error("Posts Fetch Error:", postsError);
    return <div className="p-20 text-center dark:text-white">Error loading analytics data.</div>;
  }

  if (postsLoading || userLoading) return <Spinner />;

  if (!posts || posts.length === 0) {
    return <div className="p-20 text-center text-gray-500">No post data found.</div>;
  }

  // Calculate stats
  const totalPosts = posts.length;
  const avgPostLength = Math.round(
    posts.reduce((acc, post) => acc + (post.body?.length || 0), 0) / totalPosts
  );

  // --- THE FIX: Define chartData here ---
  const chartData = posts.slice(0, 8).map(post => ({
    name: `Post ${post.id}`,
    engagement: post.body?.length || 0,
    reach: Math.floor(Math.random() * 500) + 100
  }));
  // --------------------------------------

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: <MessageSquare className="text-blue-500" />, trend: '+12%' },
    { label: 'Avg. Engagement', value: `${(avgPostLength / 10).toFixed(1)}%`, icon: <TrendingUp className="text-green-500" />, trend: '+5.4%' },
    { label: 'Active Followers', value: '1,284', icon: <Users className="text-purple-500" />, trend: '+2%' },
    { label: 'Avg. Post Length', value: avgPostLength, icon: <BarChart3 className="text-orange-500" />, trend: '-1.2%' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, <span className="text-blue-600 font-semibold">{JSON.stringify(user?.name) || 'User'}</span>.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Post Engagement Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="engagement" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Target size={20} className="text-blue-500" /> Device Reach
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Mobile', value: 65, color: 'bg-blue-500' },
              { label: 'Desktop', value: 25, color: 'bg-purple-500' },
              { label: 'Tablet', value: 10, color: 'bg-orange-500' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.value}%` }} />
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
