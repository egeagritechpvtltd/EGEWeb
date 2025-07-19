import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const { currentUser, signOut, isAdmin } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];
  
  // Admin link is only added if user is already logged in as admin
  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'}`}>
      {/* Top border strip */}
      <div className="h-1 w-full" style={{ backgroundColor: '#2E7D32' }} />
      <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center">
                <img 
                  src="/assets/egeicon.png"
                  alt="EGE Agritech" 
                  className="h-24 w-auto object-contain"
                />
                <div className="ml-2">
                  <span 
                    className="text-3xl"
                    style={{
                      color: '#FFD700', // Golden color
                      fontFamily: 'Lobster',
                      fontWeight: 400, // Hairline weight
                      fontSize: '2.5rem', // Larger font size for better visibility
                      padding: '0 15px',
                      lineHeight: '0.9',
                      display: 'inline-block',
                      marginTop: '5px'
                    }}
                  >
                    ORGANIC
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-md font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-gray-700 hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <button 
                onClick={() => navigate('/contact')} 
                className="ml-4 bg-[#FF66C4] text-black px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark text-white transition-colors duration-200"
              >
                Get Started
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sign Out Button - Only shown when user is logged in */}
              {currentUser && (
                <div className="hidden lg:flex items-center space-x-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-expanded={isOpen}
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom border strip */}
        <div className="h-1 w-full" style={{ backgroundColor: '#2E7D32' }} />
      </nav>
  );
};

export default Navbar;
