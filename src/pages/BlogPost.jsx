import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDateLong } from '../utils/dateUtils';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import CloudinaryImage from '../components/CloudinaryImage';
import PageTitle from '../components/PageTitle';
import placeholderImage from '../assets/blog-placeholder.svg';

// Sample data - replace with actual data from your API
const categories = ['Vegetables', 'Fruits', 'Health'];
const categoryCounts = { Vegetables: 5, Fruits: 3, Health: 4 };
const popularTags = ['Vegetables', 'Fruits', 'Health'];

// Default blog post image
const DEFAULT_BLOG_IMAGE = placeholderImage;

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [views, setViews] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Fetch blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // Get post by slug
        const postsRef = collection(db, 'blogPosts');
        const q = query(postsRef, where('slug', '==', slug), where('isPublished', '==', true));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Post not found');
          return;
        }
        
        // Get the first matching post
        const postData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        setPost(postData);
        setViews(postData.views || 0);
        
        // Increment view count
        if (postData.id) {
          try {
            const postRef = doc(db, 'blogPosts', postData.id);
            await updateDoc(postRef, { views: increment(1) });
          } catch (updateError) {
            console.error('Error updating view count:', updateError);
          }
        }
        
        // Extract headings from content
        if (postData.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(postData.content, 'text/html');
          const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          setHeadings(headingElements);
        }
        
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return 2;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };
  
  // Handle social sharing
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PageTitle title={post?.title || 'Blog Post'} />
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Post not found'}
          </h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Metadata */}
      <Helmet>
        <title>{post.metaTitle || post.title} | EGE Agritech</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        {post.bannerImage && <meta property="og:image" content={post.bannerImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle || post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        {post.bannerImage && <meta name="twitter:image" content={post.bannerImage} />}
      </Helmet>

      {/* Hero Header with Featured Image */}
      <div className="relative">
        <div className="h-96 w-full overflow-hidden bg-gray-100">
          {post.bannerImage || post.imagePublicId ? (
            <CloudinaryImage
              publicId={post.imagePublicId}
              src={post.bannerImage}
              alt={post.title}
              width={1600}
              height={900}
              crop="fill"
              gravity="auto"
              className="w-full h-full object-cover"
              fallback={DEFAULT_BLOG_IMAGE}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50">
              <img 
                src={DEFAULT_BLOG_IMAGE} 
                alt={post.title} 
                className="h-32 w-32 opacity-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content */}
          <article className="lg:w-2/3 bg-white rounded-xl shadow-sm p-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 mb-6 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </button>

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>{formatDateLong(post.createdAt?.toDate())}</span>
                <span className="mx-2">•</span>
                <span>{calculateReadTime(post.content)} min read</span>
                <span className="mx-2">•</span>
                <span>{views} views</span>
              </div>
            </header>

            {/* Post Content */}
            <div 
              ref={contentRef}
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${tag.toLowerCase()}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {post.authorImage ? (
                    <CloudinaryImage
                      publicId={post.authorImage}
                      alt={post.authorName || 'Author'}
                      width={64}
                      height={64}
                      crop="fill"
                      gravity="face"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center text-2xl font-bold text-green-800">
                      {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {post.authorName || 'Author'}
                  </h3>
                  {post.authorBio && (
                    <p className="mt-1 text-gray-600">
                      {post.authorBio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Share this article</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" rx="1" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors ml-auto"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {headings.map((heading, index) => {
                    const id = `heading-${index}`;
                    heading.id = id;
                    return (
                      <a
                        key={index}
                        href={`#${id}`}
                        className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                        style={{ marginLeft: `${(parseInt(heading.tagName[1]) - 2) * 12}px` }}
                      >
                        {heading.textContent}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/blog?category=${category.toLowerCase()}`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">
                        {categoryCounts[category] || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag.toLowerCase()}`}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
