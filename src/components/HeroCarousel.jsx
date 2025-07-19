import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: 'Fresh & Organic Vegetables',
    subtitle: 'Directly from Farm to Your Table',
    description: 'Experience farm-fresh vegetables delivered to your doorstep. 100% organic, chemical-free, and full of flavor!',
    buttonText: 'Inquire Now',
    buttonLink: '#contact',
    image: 'assets/agricultural-data.png',
    overlay: 'rgba(255, 102, 196, 1)'
  },
  {
    id: 2,
    title: 'Support Local Farmers',
    subtitle: 'Empowering Indian Agriculture',
    description: 'Join us in supporting local farmers and sustainable agriculture practices for a better tomorrow.',
    buttonText: 'Learn More',
    buttonLink: '#contact',
    image: 'assets/farmers.png',
    overlay: 'rgba(156, 39, 176, 0.7)'
  },
  {
    id: 3,
    title: 'Seasonal Specials',
    subtitle: 'Fresh Picks of the Season',
    description: 'Discover our seasonal collection of fresh, locally-sourced vegetables at their peak of flavor.',
    buttonText: 'Inquire Now',
    buttonLink: '#contact',
    image: '/assets/seasonal.png',
    overlay: 'rgba(194, 24, 91, 0.7)'
  }
];

const HeroCarousel = ({ onOpenForm }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleButtonClick = useCallback((e, link) => {
    if (link === '#contact') {
      e.preventDefault();
      onOpenForm?.();
    }
  }, [onOpenForm]);

  // Auto-rotate slides every 8 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Preload all slide images
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Slides */}
      <div className="relative w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`min-h-screen flex items-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 pointer-events-none z-0'}`}
            style={{
              transition: 'opacity 1s ease-in-out',
              willChange: 'opacity',
              backgroundColor: slide.overlay,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Background Overlay */}
            <div 
              className="absolute inset-0 -z-10"
              style={{ 
                backgroundColor: slide.overlay,
                opacity: 0.9
              }}
            />

            <div className="container mx-auto px-4 w-full">
              <div className="flex flex-col lg:flex-row items-center">
                {/* Text Content */}
                <div className="w-full lg:w-1/2 mb-10 lg:mb-0 lg:pr-12 text-white">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h2>
                  <h3 className="text-2xl md:text-3xl text-pink-200 mb-8">
                    {slide.subtitle}
                  </h3>
                  <p className="text-xl text-gray-100 mb-10 max-w-2xl">
                    {slide.description}
                  </p>
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(e, slide.buttonLink)}
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-md text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                  >
                    {slide.buttonText}
                    <ArrowRightIcon className="ml-3 h-6 w-6" />
                  </Link>
                </div>
                
                {/* Image - Now as a decorative element */}
                <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
                  <div className="relative">
                    <div className="relative w-full h-full">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                        loading="lazy"
                        onLoad={(e) => e.target.classList.add('opacity-100')}
                        style={{ transition: 'opacity 0.5s ease-in-out' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full focus:outline-none transition-colors duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full focus:outline-none transition-colors duration-300 z-10"
        aria-label="Next slide"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
