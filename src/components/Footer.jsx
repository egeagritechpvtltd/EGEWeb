import { useState } from 'react';
import { Link } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaArrowRight
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setSubmitStatus({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      console.log('Attempting to subscribe email:', email);
      
      // Call the Firebase Callable Function
      const subscribeNewsletter = httpsCallable(functions, 'subscribeNewsletter');
      const result = await subscribeNewsletter({ 
        email: email.trim()
      });
      
      console.log('Subscription successful:', result);
      
      // Clear the email field on success
      setEmail('');
      
      // Set success message from the function response or use default
      setSubmitStatus({ 
        success: true, 
        message: result.data?.message || 'Thank you for subscribing to our newsletter!',
        alreadySubscribed: result.data?.alreadySubscribed || false
      });
      
      // Show success state temporarily
      setIsSubscribed(true);
      
      // Reset the form after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: 'Ghodasar, Ahmedabad, Gujarat',
    },
    {
      icon: <FaPhone />,
      text: '+91 7622879463',
    },
    {
      icon: <FaEnvelope />,
      text: 'info@egeorganic.com',
    },
    {
      icon: <FaClock />,
      text: 'Mon - Fri: 9:00 AM - 5:00 PM',
    },
  ];  

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/egeorganic', icon: <FaFacebook className="h-5 w-5" /> },
    { name: 'Instagram', url: 'https://www.instagram.com/ege_organics/', icon: <FaInstagram className="h-5 w-5" /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ege-agritech-b71980374/', icon: <FaLinkedin className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
          {/* Logo and Description */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-4">
              <img 
                src="/assets/ege_icon.png" 
                alt="EGE Agritech" 
                className="h-20 w-auto mr-3" 
              />
              <span className="text-2xl font-family: 'Lobster', cursive; font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                 Organic
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Growing a healthier future through sustainable and organic farming practices. for a healthier planet and future generations.
            </p>
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social, index) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-primary rounded-full transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <span className="text-gray-300 hover:text-white text-lg">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name} className="group">
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-300 hover:text-primary transition-colors duration-200 group-hover:translate-x-1"
                  >
                    <FaArrowRight className="h-4 w-4  opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-6 text-white font-family: 'Poppins', sans-serif;">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full flex-shrink-0">
                    <span className="text-primary text-center">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-gray-300 ml-3 mt-1 text-sm">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <div className="w-full max-w-lg">
            <h4 className="text-lg font-semibold mb-6 text-white">Newsletter</h4>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for the latest updates on our products and farming tips.
            </p>
            {(isSubscribed || submitStatus.success) ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {submitStatus.message || 'Thank you for subscribing!'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="relative flex-grow min-w-0">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 text-base ${
                        submitStatus.success === false ? 'border-2 border-red-500' : 'border border-gray-300'
                      }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear error when user starts typing
                        if (submitStatus.success === false) {
                          setSubmitStatus({ success: null, message: '' });
                        }
                      }}
                      disabled={isSubmitting}
                      required
                    />
                    {submitStatus.success === false && (
                      <p className="text-red-500 text-sm mt-1">{submitStatus.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md transition-colors duration-200 font-medium flex items-center justify-center whitespace-nowrap flex-shrink-0 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <span>Subscribing...</span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Subscribe</span>
                        <FaArrowRight className="h-4 w-4 sm:ml-2" />
                      </>
                    )}
                  </button>
                </div>
                {submitStatus.message && !submitStatus.success && (
                  <div className="mt-2 text-red-500 text-sm">
                    {submitStatus.message}
                  </div>
                )}
              </form>
            )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} EGE Agritech PVT Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <a href="sitemap.xml" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
