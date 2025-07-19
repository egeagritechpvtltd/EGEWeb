import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Counter Component
const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16); // 60fps
          
          const updateCount = () => {
            start += increment;
            if (start < end) {
              setCount(Math.ceil(start));
              requestAnimationFrame(updateCount);
            } else {
              setCount(end);
            }
          };
          
          updateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [end, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};
import { StarIcon } from '@heroicons/react/24/solid';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDate } from '../utils/dateUtils';
import CloudinaryImage from '../components/CloudinaryImage';
import HeroCarousel from '../components/HeroCarousel';
import LearnMoreForm from '../components/LearnMoreForm';
import PageTitle from '../components/PageTitle';
import placeholderImage from '../assets/blog-placeholder.svg';

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
      content: 'મારે ક્યારેય લાગ્યું નહીં કે મને યારદા પાક ઉગાડવામાં મદદ મળી શકે છે. EGE એ મને ઓર્ગેનિક ખેતીના માર્ગ બતાવ્યા, હવે હું કેમિકલ વગરનો પાક ઉગાડું છું અને મારા ધંધામાં વધારે નફો છે.',
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
    },
    {
      id: 4,
      name: 'Ashokbhai Chaudhary',
      role: 'Vegetable Farmer, Kheda',
      content: 'EGE\'s training on organic farming has transformed my farm. I now use natural fertilizers and pesticides, which has improved soil health and increased my yields by 40%.',
      rating: 5,
      image: '/assets/Ashokbhai Chaudhary.png'
    },
    {
      id: 5,
      name: 'कमलाबेन',
      role: 'महिला किसान–भावनगर',
      content: 'EGE के आने से हमें सिखाया गया कि ऑर्गेनिक क्या होता है। अब हम ज़हरीले खाद से मुक्त फसल उगाते हैं और शहरों में हमारे माल की डिमांड है।',
      rating: 5,
      image: '/assets/Kamalaben.png'
    },
    {
      id: 6,
      name: 'Rameshbhai Vaghela',
      role: 'Cotton Farmer, Surendranagar',
      content: 'Switching to organic cotton was the best decision I made. EGE helped me with certification and now I get premium prices for my crop.',
      rating: 5,
      image: '/assets/Rameshbhai Vaghela.png'
    },
    {
      id: 7,
      name: 'Sangeetaben Rathod',
      role: 'Turmeric Farmer, Rajkot',
      content: 'EGE connected me with buyers who appreciate organic turmeric. My income has doubled since I started working with them.',
      rating: 5,
      image: '/assets/Sangeetaben Rathod.png'
    },
    {
      id: 8,
      name: 'Mahesh Sharma',
      role: 'Restaurant Owner, Ahmedabad',
      content: 'EGE की वजह से मेरी बेटी अब प्राइवेट स्कूल में पढ़ती है। सही दाम मिलते हैं और खेती का सम्मान भी। ये सिर्फ एक कंपनी नहीं, परिवार जैसा है।',
      rating: 5,
      image: '/assets/Mahesh Sharma.png'
    },
    {
      id: 9,
      name: 'Nidhi Patel',
      role: 'Organic Food Enthusiast, Vadodara',
      content: 'I love knowing exactly where my food comes from. EGE connects me directly with the farmers who grow my vegetables.',
      rating: 5,
      image: '/assets/Nidhi Patel.png'
    },
    {
      id: 10,
      name: 'Rahul Mehta',
      role: 'IT Professional',
      content: 'The subscription model is a game-changer! I get fresh veggies delivered without even thinking about it – and it’s cheaper than the sabziwala',
      rating: 5,
      image: '/assets/Rahul Mehta.png'
    },
    {
      id: 11,
      name: 'Priya Mehta',
      role: 'Home Chef, Gandhinagar',
      content: 'The difference in taste between store-bought and EGE\'s organic vegetables is night and day. My family can\'t get enough!',
      rating: 5,
      image: '/assets/Priya Mehta.png'
    },
    {
      id: 12,
      name: 'Ravi Joshi',
      role: 'Organic Store Owner, Bhavnagar',
      content: 'Partnering with EGE has allowed me to offer the best organic produce to my customers while supporting local farmers.',
      rating: 5,
      image: '/assets/Ravi Joshi.png'
    },
    {
      id: 13,
      name: 'Chef Amit Rao',
      role: 'Head Chef, Fine Dining Restaurant',
      content: 'The quality and freshness of EGE\'s organic ingredients elevate my dishes to the next level. My customers can taste the difference!',
      rating: 5,
      image: '/assets/Chef Amit Rao.png'
    },
    {
      id: 14,
      name: 'Chef Nishant R.',
      role: 'Executive Chef, Farm-to-Table Restaurant',
      content: 'EGE\'s commitment to quality and sustainability aligns perfectly with our restaurant\'s philosophy. Their farmers grow exceptional produce.',
      rating: 5,
      image: '/assets/Chef Nishant R..png'
    }
  ];

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
          bannerImage: imageUrl || placeholderImage,
          date: postData.createdAt?.toDate() || new Date(),
          readTime: calculateReadTime(postData.content || '')
        });
      });
      
      setLatestPosts(postsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again later.');
      setLatestPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  // Open learn more form
  const openLearnMoreForm = useCallback(() => {
    setIsLearnMoreOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PageTitle title="Home" />
      
      {/* Hero Carousel Section */}
      <HeroCarousel onOpenForm={openLearnMoreForm} />

      {/* Stats Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              Empowering Farmers, Delivering Freshness
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4 dark:text-gray-300">
              Join our mission to transform agriculture and bring fresh, organic produce to your table
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: 500, label: 'Happy Farmers', suffix: '+' },
              { value: 10000, label: 'Satisfied Customers', suffix: '+' },
              { value: 50, label: 'Tonnes Produced', suffix: '+' },
              { value: 24, label: 'Support', suffix: '/7' },
            ].map((stat, index) => (
              <div key={index} className="bg-pink-50 rounded-lg p-6 text-center dark:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-4xl font-extrabold text-pink-600 dark:text-white">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">What Our Farmers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Real stories from farmers who have transformed their lives with EGE
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
                    <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
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
                          <p className="text-lg text-gray-700 italic mb-4 dark:text-gray-200">"{testimonial.content}"</p>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-pink-600 dark:text-pink-300">{testimonial.role}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">Error loading blog posts. Please try again later.</p>
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.bannerImage} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="hover:text-pink-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt || 'Read more about this article...'}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium group"
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
              <p className="text-gray-500 dark:text-gray-400">No blog posts found.</p>
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
      <section className="bg-pink-700 dark:bg-pink-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white dark:text-gray-100">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pink-100 dark:text-pink-200">
            Join our community of farmers and customers who believe in sustainable, organic farming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-white hover:bg-gray-100 dark:bg-gray-100 dark:text-pink-700 dark:hover:bg-gray-200 transition-colors duration-200"
            >
              Shop Now
            </Link>
            <button 
              onClick={() => setIsLearnMoreOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white dark:border-pink-200 text-base font-medium rounded-md text-white dark:text-pink-100 hover:bg-white/10 dark:hover:bg-pink-800 transition-colors duration-200"
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
