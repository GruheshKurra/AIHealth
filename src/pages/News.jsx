import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, Loader2, AlertCircle, Newspaper } from 'lucide-react';

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="bg-green-900/40 rounded-lg overflow-hidden ring-1 ring-green-800/50 hover:ring-green-700/50 transition-all duration-300 flex flex-col h-full">
      {article.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-green-400 text-sm mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <time>{formatDate(article.publishedAt)}</time>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{article.source.name}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-200 mb-3 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-green-100/90 mb-4 line-clamp-3 flex-grow text-sm">
          {article.description}
        </p>

        <div className="mt-auto pt-4 border-t border-green-800/50">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
          >
            <span>Read Full Article</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </article>
  );
};

const LoadingCard = () => (
  <div className="bg-green-900/40 rounded-lg overflow-hidden ring-1 ring-green-800/50 h-full">
    <div className="aspect-video bg-green-800/30 animate-pulse" />
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-4 bg-green-800/30 rounded w-24 animate-pulse" />
        <div className="h-4 bg-green-800/30 rounded w-32 animate-pulse" />
      </div>
      <div className="h-7 bg-green-800/30 rounded w-3/4 mb-4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-green-800/30 rounded animate-pulse" />
        <div className="h-4 bg-green-800/30 rounded animate-pulse" />
        <div className="h-4 bg-green-800/30 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  </div>
);

const CategoryButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${active
      ? 'bg-green-600 text-green-100 font-medium'
      : 'bg-green-900/50 text-green-300 hover:bg-green-800/50 ring-1 ring-green-800/50'
      }`}
  >
    {children}
  </button>
);

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('agriculture');

  const categories = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'farming', label: 'Farming' },
    { value: 'organic farming', label: 'Organic' },
    { value: 'sustainable agriculture', label: 'Sustainable' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${category}&lang=en&country=us&max=9&apikey=${import.meta.env.VITE_GNEWS_API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();
        if (data.articles) {
          setNews(data.articles);
        } else {
          throw new Error('Invalid data received');
        }
      } catch (err) {
        setError('Failed to load news. Please try again later.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-green-900/50 ring-1 ring-green-800/50">
            <Newspaper className="w-6 h-6 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold text-green-100 mb-4">
            Agricultural News & Insights
          </h1>
          <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
            Stay updated with the latest farming news, trends, and innovations
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <CategoryButton
                key={cat.value}
                active={category === cat.value}
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </CategoryButton>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center justify-center p-4 mb-8 bg-red-900/40 rounded-lg ring-1 ring-red-800/50">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin mr-2" />
            <span className="text-green-200">Loading news...</span>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <LoadingCard key={i} />)
          ) : (
            news.map((article, index) => (
              <NewsCard
                key={article.url || index}
                article={article}
              />
            ))
          )}
        </div>

        {/* No Results */}
        {!loading && news.length === 0 && !error && (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="text-green-400">No news articles found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;