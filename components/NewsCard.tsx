import React from 'react';
import type { Article } from '../pages/api/scrape';

interface NewsCardProps {
  article: Article;
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, index }) => {
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
    <div className="card hover:scale-105 transform transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <span className={getCategoryBadgeClass(article.category)}>
          {article.category}
        </span>
        {article.company && (
          <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
            {article.company}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight line-clamp-3">
        {article.headline}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Just now</span>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
          #{index + 1}
        </span>
      </div>
    </div>
  );
};

export default NewsCard; 