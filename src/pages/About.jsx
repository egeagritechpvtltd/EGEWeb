import { Link } from 'react-router-dom';
import { CheckIcon, UsersIcon, GlobeAltIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { ClipboardCheckIcon, LeafIcon, LeafyGreenIcon } from 'lucide-react';
import PageTitle from '../components/PageTitle';

const About = () => {
  return (
    <div className="min-h-screen">
      <PageTitle title="About Us" />
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-primary/90 to-secondary/90 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50"></div>
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
            alt="Farm Field" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">About EGE Organics</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white">
            Pioneering sustainable agriculture for a healthier planet and future generations.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                At EGE – Everything Green Everywhere, we believe food should nourish not just the body, but also the earth and the people who grow it.
                Born in the heart of Gujarat, EGE Organics & Naturals is more than a brand it’s a community-driven movement to reconnect Indians with the roots of our food: our farmers. While most brands talk about organic, we act on it delivering fresh, chemical-free produce to your doorstep and sharing profits directly with the farmers.
                </p>
                <p>
                We believe that food is trust. That’s why every item you receive from us has a story , a mother in Dahod growing pesticide-free spinach, a young boy in Junagadh whose school fees are paid through our customer wellness fund.
                </p>
                <p>
                We don’t do “15-minute delivery.”
                We do timely, cold-chain delivery with purpose, where each box lowers emissions, supports education, and brings you honest nutrition.
                </p>
                <p>
                So when you buy from EGE, you’re not just buying fresh vegetables.
                You’re buying hope, health, and a better India  for you, and for them.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden h-64 shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80" 
                  alt="Organic farm field with rows of green plants under blue sky" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-2 py-1 rounded-tl-md">
                  
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-64 shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1451440063999-77a8b2960d2b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Green vegetable field with mountains in the background" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-2 py-1 rounded-tl-md">
                  
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Harvesting" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80" 
                  alt="Fresh Produce" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every action we take.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <CheckIcon className="h-10 w-10 text-primary" />,
                title: 'Integrity in Every Bite',
                description: 'What you see is what you get. No chemicals. No middlemen. No lies.'
              },
              {
                icon: <UsersIcon className="h-10 w-10 text-primary" />,
                title: 'Farmers First',
                description: 'We are a business built around dignity for farmers and fair pricing.'
              },
              {
                icon: <GlobeAltIcon className="h-10 w-10 text-primary" />,
                title: 'For the Next Generation',
                description: 'Every sale contributes to a farmer’s child’s education.'
              },
              {
                icon: <LeafyGreenIcon className="h-10 w-10 text-primary" />,
                title: 'Planet Positive ',
                description: ' From reusable packaging to optimized logistics, we are climate-conscious.'
              },
             
            ].map((value, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      {/* Founders Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Founders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind EGE's vision for a sustainable future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Rushik Barot',
                role: 'Co-Founder & CEO',
                image: '/assets/rushik.jpeg',
                bio: 'A visionary leader with over 15 years of experience in sustainable agriculture and organic farming practices.'
              },
              {
                name: 'Chourajit Sharma',
                role: 'Co-Founder & COO',
                image: '/assets/Chourajit.png',
                bio: 'Technology expert passionate about creating digital solutions for sustainable farming and supply chain management.'
              },
             
            ].map((founder, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{founder.name}</h3>
                  <p className="text-primary font-medium mb-3">{founder.role}</p>
                  <p className="text-gray-600">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join Us in Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Together, we can create a more sustainable future through organic farming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
