import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NewsArticle {
  id: number;
  title: string;
  url: string;
  topic: string;
  published_date: string;
  created_at: string;
}

interface TopicDistribution {
  topic: string;
  count: number;
  percentage: number;
  color: string;
}

interface ArticlesByDate {
  date: string;
  count: number;
}

interface WordFrequency {
  word: string;
  count: number;
}

const Dashboard = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topicDistribution, setTopicDistribution] = useState<TopicDistribution[]>([]);
  const [articlesByDate, setArticlesByDate] = useState<ArticlesByDate[]>([]);
  const [wordFrequency, setWordFrequency] = useState<WordFrequency[]>([]);
  const [recentArticles, setRecentArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const topicColors = {
    'AI': '#8B5CF6',
    'Funding': '#10B981',
    'Product': '#F59E0B',
    'Regulation': '#EF4444',
    'Other': '#6B7280'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
      processAnalytics(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data: NewsArticle[]) => {
    // Topic Distribution
    const topicCounts = data.reduce((acc, article) => {
      acc[article.topic] = (acc[article.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = data.length;
    const distribution = Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count,
      percentage: Math.round((count / total) * 100),
      color: topicColors[topic as keyof typeof topicColors] || topicColors.Other
    }));

    setTopicDistribution(distribution);

    // Articles by Date
    const dateGroups = data.reduce((acc, article) => {
      const date = new Date(article.published_date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDate = Object.entries(dateGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    setArticlesByDate(byDate);

    // Word Frequency (excluding stopwords)
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'cant', 'wont', 'dont', 'doesnt', 'didnt', 'isnt', 'arent', 'wasnt', 'werent', 'hasnt', 'havent', 'hadnt', 'wouldnt', 'couldnt', 'shouldnt', 'mightnt', 'mustnt']);

    const words = data
      .flatMap(article => article.title.toLowerCase().split(/\W+/))
      .filter(word => word.length > 2 && !stopwords.has(word));

    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topWords = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setWordFrequency(topWords);

    // Recent Articles
    setRecentArticles(data.slice(0, 5));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 News Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights from your news monitoring system</p>
          </div>
          <Link href="/" className="bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
            ← Back to Monitor
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">📰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Topics Covered</h3>
                <p className="text-2xl font-bold text-gray-900">{topicDistribution.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Today's Articles</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(a => new Date(a.published_date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="text-sm font-bold text-gray-900">
                  {articles.length > 0 ? new Date(articles[0].created_at).toLocaleTimeString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              📊 Topic Distribution
            </h2>
            <div className="space-y-4">
              {topicDistribution.map((item, index) => (
                <div key={item.topic} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-700">{item.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{item.count} articles</span>
                    <span className="text-sm font-bold text-gray-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Visual Bar Chart */}
            <div className="mt-6 space-y-2">
              {topicDistribution.map((item, index) => (
                <div key={item.topic} className="relative">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.topic}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Articles Over Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              🕒 Articles Over Time (Last 7 Days)
            </h2>
            <div className="space-y-4">
              {articlesByDate.map((item, index) => (
                <div key={item.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.date}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max((item.count / Math.max(...articlesByDate.map(a => a.count))) * 100, 10)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Frequent Headlines */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              📰 Most Frequent Words in Headlines
            </h2>
            <div className="space-y-3">
              {wordFrequency.map((item, index) => (
                <div key={item.word} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-gray-700 capitalize">{item.word}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{item.count} times</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Articles Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              🌍 Recent Articles Feed
            </h2>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div key={article.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {article.topic}
                    </span>
                    <span>{new Date(article.published_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={fetchDashboardData}
              className="w-full mt-4 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 