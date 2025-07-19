import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDate } from '../utils/dateUtils';
import { Helmet } from 'react-helmet-async';
import CloudinaryImage from '../components/CloudinaryImage';
import PageTitle from '../components/PageTitle';
import placeholderImage from '../assets/blog-placeholder.svg';

// Default blog post image
const DEFAULT_BLOG_IMAGE = placeholderImage;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        console.log('Fetching blog data...');
        
        // Fetch blog posts - using same collection name as in Home.jsx
        const postsRef = collection(db, 'blogPosts');
        // First get all published posts without sorting to avoid composite index
        const postsQuery = query(postsRef, where('isPublished', '==', true));
        
        // Fetch categories
        const categoriesRef = collection(db, 'blogCategories');
        const categoriesQuery = query(categoriesRef);
        
        console.log('Executing Firestore queries...');
        const [postsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(postsQuery).catch(err => {
            console.error('Error fetching posts:', err);
            throw new Error(`Failed to fetch posts: ${err.message}`);
          }),
          getDocs(categoriesQuery).catch(err => {
            console.error('Error fetching categories:', err);
            throw new Error(`Failed to fetch categories: ${err.message}`);
          })
        ]);
        
        console.log('Processing posts...');
        const postsData = [];
        postsSnapshot.forEach((doc) => {
          const postData = doc.data();
          postsData.push({
            id: doc.id,
            ...postData,
            date: postData.createdAt?.toDate() || new Date(),
          });
        });
        
        console.log('Processing categories...');
        const categoriesData = [];
        categoriesSnapshot.forEach((doc) => {
          const categoryData = doc.data();
          categoriesData.push({
            id: doc.id,
            ...categoryData
          });
        });
        
        console.log(`Found ${postsData.length} posts and ${categoriesData.length} categories`);
        setPosts(postsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error in fetchBlogData:', err);
        setError(`Failed to load blog data: ${err.message}. Please check the console for more details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filter posts by category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                          (post.categories && post.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
    return `${readTime} min read`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl mx-4 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!loading && filteredPosts.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No blog posts found</h2>
          <p className="text-gray-600 mb-6">Check back later for new articles.</p>
          <Link 
            to="/" 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="Blog" />
      <Helmet>
        <title>Blog | EGE Organic</title>
        <meta name="description" content="Read our latest articles on organic farming, sustainable agriculture, and healthy living." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">EGE Organic's Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and stories about organic farming, sustainable living, and healthy eating.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Error loading posts</h3>
              <p className="mt-1 text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                  const readTime = calculateReadTime(post.content);
                  return (
                    <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        {post.bannerImage ? (
                          <img 
                            src={post.bannerImage} 
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_BLOG_IMAGE;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <img 
                              src={DEFAULT_BLOG_IMAGE} 
                              alt={post.title}
                              className="h-24 w-24 opacity-50"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {post.createdAt ? formatDate(post.createdAt) : 'N/A'}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {readTime}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          <Link to={`/blog/${post.slug || post.id}`} className="hover:text-indigo-600 transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {post.excerpt || 'No excerpt available'}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">
                              {post.authorName || 'Admin'}
                            </span>
                          </div>
                          {post.category && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No blog posts found</h3>
                  <p className="mt-1 text-gray-500">
                    {searchQuery 
                      ? `No posts match your search for "${searchQuery}".`
                      : activeCategory !== 'All' 
                        ? `No posts found in the ${activeCategory} category.`
                        : 'No blog posts available at the moment.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
