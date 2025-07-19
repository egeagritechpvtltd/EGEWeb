import { useState } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import PageTitle from '../components/PageTitle';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      console.log('Submitting contact form:', formData);
      
      // Call the Firebase Callable Function
      const sendContactForm = httpsCallable(functions, 'handleContactForm');
      const result = await sendContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      console.log('Form submission successful:', result);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Show success message
      setSubmitStatus({ 
        success: true, 
        message: result.data?.message || 'Thank you for your message! We will get back to you soon.' 
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'An error occurred. Please try again later.';
      
      // Handle different types of errors
      if (error.code === 'invalid-argument') {
        errorMessage = error.message || 'Please fill in all required fields correctly.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.code) {
        errorMessage = `Error: ${error.message || 'Something went wrong'}`;
      }
      
      setSubmitStatus({ 
        success: false, 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPinIcon className="h-8 w-8 text-primary" />,
      title: 'Our Head Office',
      description: 'Ahmedabad,Gujarat, India',
      link: 'https://maps.app.goo.gl/c5pCL6gZPWrLBDA17',
      linkText: 'View on Map'
    },
    {
      icon: <PhoneIcon className="h-8 w-8 text-primary" />,
      title: 'Phone Number',
      description: '+91 7622879463',
      link: 'tel:+917622879463',
      linkText: 'Call Now'
    },
    {
      icon: <EnvelopeIcon className="h-8 w-8 text-primary" />,
      title: 'Email Address',
      description: 'info@egeorganic.com',
      link: 'mailto:info@egeorganic.com',
      linkText: 'Send Email'
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-primary" />,
      title: 'Working Hours',
      description: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
      link: '',
      linkText: ''
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      <PageTitle title="Contact Us" />
      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to us through any of these channels.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line mb-4">{item.description}</p>
                {item.link && (
                  <a 
                    href={item.link} 
                    className="text-primary font-medium hover:underline inline-flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkText}
                    <svg 
                      className="ml-1 h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Contact Form */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors duration-200 font-medium ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {submitStatus.message && (
                    <div className={`mt-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
              
              {/* Map */}
              <div className="w-full h-96 md:h-auto md:w-1/3 bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14693.343821361103!2d72.60770128299829!3d22.97467042307148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f5590ffcd7d%3A0x4b0554bef6153a98!2sGhodasar%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1749539810011!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EGE Agritech Location in Ahmedabad, Gujarat, India"
                  className="block w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  question: 'Why should I choose EGE over local markets or grocery apps?',
                  answer: 'Because at EGE, you\'re not just buying vegetables — you\'re investing in farmers, reducing your carbon footprint, and nourishing your family with clean, traceable food.'
                },
                {
                  question: 'What is the "Rainbow Subscription Plan"?',
                  answer: 'A fun, rotating weekly mix of colorful, nutritious vegetables and fruits — so your meals stay exciting and balanced across vitamins A, B, C, and K.'
                },
                {
                  question: 'How does my purchase help a farmer?',
                  answer: 'We offer farmers up to 30% higher income, and a part of your payment supports child education, health checkups, and AI-based demand forecasting to reduce food waste.'
                },
                {
                  question: 'What if I don\'t want a full subscription?',
                  answer: 'You can always order à la carte or opt for our Vitamin Boost Packs, Protein-Rich Bundles, or Zero-Carb Veggie Boxes — designed for health-conscious households.'
                },
                {
                  question: 'What makes EGE organic/natural produce trustworthy?',
                  answer: 'Every product comes from audited farms with real-time traceability, lab-tested samples, and a cold-chain supply process that preserves freshness and nutrition.'
                },
                {
                  question: 'Do you deliver to restaurants or hotels?',
                  answer: 'Yes, we have a dedicated B2B channel with bulk rates, weekly delivery slots, and tailored product lists for hotels, cafes, and caterers.'
                },
                {
                  question: 'Is your packaging eco-friendly?',
                  answer: '100%! We use biodegradable crates, minimal plastics, and reward customers who return packaging for reuse.'
                },
                {
                  question: 'What is your delivery area?',
                  answer: 'Currently delivering in Ahmedabad, expanding soon. You can check delivery areas on the app or website using your pincode.'
                },
                {
                  question: 'What is the difference between EGE Naturals and EGE Organics?',
                  answer: 'EGE Naturals offers vegetables grown with fewer pesticides and local practices, while EGE Organics are 100% certified pesticide-free organic products.'
                },
                {
                  question: 'How are your prices lower than the market?',
                  answer: 'We eliminate middlemen by buying directly from farmers and delivering straight to your door — ensuring savings for you and profits for farmers.'
                },
                {
                  question: 'How does the subscription model work?',
                  answer: 'You can choose a weekly or monthly plan — like Vitamin C Box or Protein Veggie Basket — and receive curated, fresh vegetables delivered on schedule.'
                },
                {
                  question: 'Where do your vegetables come from?',
                  answer: 'We source directly from verified organic and natural farmers across Gujarat including Junagadh, Dahod, and Narmada belt.'
                },
                {
                  question: 'Is delivery available in my area?',
                  answer: 'We are currently delivering in Ahmedabad and expanding rapidly. Enter your pincode on the app or website to check.'
                },
                {
                  question: 'Can I cancel or pause my subscription?',
                  answer: 'Absolutely. You can pause or modify your delivery anytime from your EGE app dashboard.'
                },
                {
                  question: 'What makes your produce more sustainable?',
                  answer: 'We use cold chain, bulk delivery, and climate-friendly packaging while reducing carbon footprints by minimizing waste and transport fuel use.'
                },
                {
                  question: 'How does EGE help farmers?',
                  answer: 'We offer farmers 20–30% better prices, AI-based demand planning, and part of our revenue goes to their children\'s education.'
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 mb-4"
                >
                  <button
                    className={`w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none ${openFaqIndex === index ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-${index}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 text-primary transform transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    id={`faq-${index}`}
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-4' : 'max-h-0'}`}
                    aria-hidden={openFaqIndex !== index}
                  >
                    <div className="pt-2 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <a 
                href="mailto:info@egeagritech.com" 
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Email us directly
                <svg 
                  className="ml-1 h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
