import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDate } from '../utils/dateUtils';
import CloudinaryImage from '../components/CloudinaryImage';
import HeroCarousel from '../components/HeroCarousel';
import LearnMoreForm from '../components/LearnMoreForm';
import PageTitle from '../components/PageTitle';
import placeholderImage from '../assets/blog-placeholder.svg';

// Default blog post image
const DEFAULT_BLOG_IMAGE = placeholderImage;

// Magenta theme colors
export const themeColors = {
  primary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Main magenta color
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
};

const Home = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Rajeshbhai Patel',
      role: 'Organic Farmer, Dahod District',
      content: 'Earlier, I had to wait in long lines at APMC and still sell my vegetables at whatever price middlemen decided. With EGE, I get paid fairly, directly, and fast. My income is more stable now, and my children go to a better school.',
      rating: 5,
      image: '/assets/Rajeshbhai.jpg'
    },
    {
      id: 2,
      name: 'Kiranben Parmar',
      role: 'Female Farmer, Anand',
      content: 'Before EGE, we didn\'t even know what "organic certification" was. Now, EGE\'s team helps us grow chemical-free vegetables and sell them in cities where people value health. My land finally feels respected.',
      rating: 5,
      image: '/assets/Kiranben Parmar.png'
    },
    {
      id: 3,
      name: 'Iqbalbhai Sheikh',
      role: 'Tomato Farmer, Junagadh',
      content: 'I used to throw away unsold vegetables every week. Now, EGE gives us daily demand updates so I grow exactly what is needed. No wastage, better planning, and more earnings!',
      rating: 5,
      image: '/assets/Iqbalbhai Sheikh.png'
    }
  ];

  const videoRef = useRef(null);

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        aria-hidden="true"
      />
    ));
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fetch latest blog posts
  const fetchLatestPosts = useCallback(async () => {
    try {
      const postsRef = collection(db, 'blogPosts');
      const q = query(
        postsRef, 
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      
      const querySnapshot = await getDocs(q);
      const postsData = [];
      
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        const slug = postData.slug || 
                    (postData.title ? 
                      postData.title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/--+/g, '-') 
                      : '');
        
        // Find the first available image field
        const imageFields = ['bannerImage', 'imageUrl', 'image', 'featuredImage', 'coverImage'];
        let imageUrl = '';
        
        for (const field of imageFields) {
          if (postData[field]) {
            imageUrl = postData[field];
            break;
          }
        }
        
        postsData.push({
          id: doc.id,
          ...postData,
          slug: slug || doc.id,
          title: postData.title || 'Untitled Post',
          excerpt: postData.excerpt || '',
          bannerImage: imageUrl,
          imagePublicId: postData.imagePublicId || null,
          date: postData.createdAt?.toDate() || new Date(),
          readTime: calculateReadTime(postData.content || '')
        });
      });
      
      setLatestPosts(postsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  return (
    <div className="min-h-screen">
      <PageTitle title="Home" />
      
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Empowering Farmers, Delivering Freshness
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Join our mission to transform agriculture and bring fresh, organic produce to your table
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '500+', label: 'Happy Farmers' },
              { value: '10K+', label: 'Satisfied Customers' },
              { value: '50+', label: 'Tonnes Produced' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="bg-pink-50 rounded-lg p-6 text-center">
                <p className="text-4xl font-extrabold text-pink-600">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Farmers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from farmers and customers who have experienced the EGE difference
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 md:mb-0 md:mr-8">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/placeholder-avatar.jpg';
                            }}
                          />
                        </div>
                        <div className="text-center md:text-left">
                          <div className="flex justify-center md:justify-start mb-4">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-lg text-gray-700 italic mb-4">"{testimonial.content}"</p>
                          <h4 className="text-xl font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-pink-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and insights from the world of organic farming
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchLatestPosts}
                className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
              >
                Retry
              </button>
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.bannerImage || DEFAULT_BLOG_IMAGE} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_BLOG_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="hover:text-pink-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || 'Read more about this article...'}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium group"
                    >
                      Read more
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts found.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors duration-200"
            >
              View All Articles
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of farmers and customers who believe in sustainable, organic farming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Shop Now
            </Link>
            <button 
              onClick={() => setIsLearnMoreOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <LearnMoreForm 
        isOpen={isLearnMoreOpen} 
        onClose={() => setIsLearnMoreOpen(false)} 
      />
    </div>
  );
};

export default Home;
