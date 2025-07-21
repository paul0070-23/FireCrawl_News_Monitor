import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import type { Article, ScrapeResponse } from './api/scrape';

const NewsMonitor: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<ScrapeResponse>('/api/scrape');
      
      if (response.data.success && response.data.articles) {
        setArticles(response.data.articles);
      } else {
        setError(response.data.error || 'Failed to fetch news');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (category: Article['category']) => {
    const baseClass = 'badge ';
    switch (category) {
      case 'AI':
        return baseClass + 'badge-ai';
      case 'Funding':
        return baseClass + 'badge-funding';
      case 'Product':
        return baseClass + 'badge-product';
      case 'Regulation':
        return baseClass + 'badge-regulation';
      default:
        return baseClass + 'badge-other';
    }
  };

  return (
    <>
      <Head>
        <title>🔥 FireCrawl News Monitor</title>
        <meta name="description" content="Real-time tech news monitoring powered by FireCrawl" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔥 FireCrawl News Monitor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest tech news from TechCrunch, powered by FireCrawl's intelligent web scraping
            </p>
          </div>

          {/* Fetch Button */}
          <div className="text-center mb-12">
            <button
              onClick={fetchNews}
              disabled={loading}
              className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching Latest News...
                </>
              ) : (
                'Fetch Latest News'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {articles.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <span className={getCategoryBadgeClass(article.category)}>
                      {article.category}
                    </span>
                    {article.company && (
                      <span className="text-sm text-gray-500 font-medium">
                        {article.company}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                    {article.headline}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Just now</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No news articles</h3>
              <p className="mt-1 text-sm text-gray-500">Click the button above to fetch the latest tech news.</p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center">
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                Powered by{' '}
                <a 
                  href="https://firecrawl.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tech-orange hover:text-orange-600 font-medium"
                >
                  FireCrawl
                </a>
                {' '}• Built with Next.js and Tailwind CSS
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default NewsMonitor; 