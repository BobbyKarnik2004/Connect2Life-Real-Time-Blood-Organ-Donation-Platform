import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Users,
  Zap,
  MapPin,
  Award,
  Clock,
  ChevronRight,
  Play,
  ArrowRight,
  Target,
  Shield,
  Brain,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const stats = [
    { number: '12,000+', label: 'Lives Lost Daily in India' },
    { number: '50,000+', label: 'People Waiting for Organs' },
    { number: '2 minutes', label: 'Average Match Time' },
    { number: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Matching',
      description:
        'Advanced algorithms predict compatibility and boost acceptance rates by 40%',
      image:
        'https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85',
    },
    {
      icon: <MapPin size={32} />,
      title: 'Real-Time Geolocation',
      description:
        'Find nearby donors within minutes, reducing critical waiting time',
      image:
        'https://images.unsplash.com/photo-1666886573197-bf6600d15bce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      icon: <Zap size={32} />,
      title: 'Emergency Alerts',
      description:
        'Instant notifications via SMS, email, and push notifications for urgent cases',
      image:
        'https://images.unsplash.com/photo-1666886573421-d19e546cfc4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      icon: <Award size={32} />,
      title: 'Gamified Experience',
      description:
        'Earn badges, points, and recognition for your life-saving contributions',
      image:
        'https://images.unsplash.com/photo-1660548902284-764f13525be2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Transplant Surgeon',
      content:
        'Connect2Life has revolutionized how we match donors with recipients. The AI predictions are incredibly accurate.',
      image:
        'https://images.unsplash.com/photo-1666886573197-bf6600d15bce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      name: 'Michael Chen',
      role: 'Kidney Recipient',
      content:
        'I found my perfect match in just 2 days. This platform gave me a second chance at life.',
      image:
        'https://images.unsplash.com/photo-1666886573421-d19e546cfc4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Organ Donor',
      content:
        'The gamification makes donating engaging. I love seeing the impact of my contributions.',
      image:
        'https://images.unsplash.com/photo-1660548902284-764f13525be2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85',
    },
  ];

  return (
    <div className='homepage'>
      <Navbar />
      {/* Hero Section */}
      <section className='hero-section'>
        <div className='container'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div className='hero-content'>
              <h1 className='hero-title'>
                One Connection.
                <br />
                <span className='text-primary-red'>A Lifetime Saved.</span>
              </h1>
              <p className='hero-subtitle'>
                Connect2Life uses advanced AI to match organ donors with
                recipients in real-time, reducing waiting times from months to
                minutes. Join thousands saving lives daily.
              </p>
              <div className='hero-buttons'>
                <Link to='/register' className='btn btn-primary'>
                  Become a Donor <Heart size={20} />
                </Link>
                <Link to='/register' className='btn btn-secondary'>
                  Find a Match <Target size={20} />
                </Link>
                <button className='btn btn-outline'>
                  <Play size={20} />
                  Watch Demo
                </button>
              </div>
            </div>

            <div className='relative'>
              <div className='relative z-10'>
                <img
                  src='https://images.unsplash.com/photo-1660548902284-764f13525be2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85'
                  alt='Hope and Life Connection'
                  className='rounded-2xl shadow-2xl w-full'
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-tr from-primary-blue/20 to-primary-red/20 rounded-2xl'></div>
              <div className='absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-primary-blue/30 to-primary-red/30 rounded-full blur-3xl'></div>
              <div className='absolute -bottom-6 -left-6 w-60 h-60 bg-gradient-to-tr from-primary-red/30 to-primary-blue/30 rounded-full blur-3xl'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='section-padding bg-white/60 backdrop-blur-sm'>
        <div className='container'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <div key={index} className='stat-card'>
                <div className='stat-number'>{stat.number}</div>
                <p className='text-neutral-600 font-medium'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='section-padding'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6'>
              Revolutionary Features for
              <span className='text-primary-blue'>
                {' '}
                Life-Saving Connections
              </span>
            </h2>
            <p className='text-xl text-neutral-600 max-w-3xl mx-auto'>
              Our AI-powered platform combines cutting-edge technology with
              human compassion to create the most efficient organ donation
              matching system.
            </p>
          </div>

          <div className='feature-grid'>
            {features.map((feature, index) => (
              <div key={index} className='card-feature group'>
                <div className='relative mb-6 overflow-hidden rounded-xl'>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                  <div className='absolute bottom-4 left-4'>
                    <div className='feature-icon'>{feature.icon}</div>
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
                <p className='text-neutral-600 leading-relaxed'>
                  {feature.description}
                </p>
                <button className='mt-4 text-primary-blue font-semibold flex items-center gap-2 hover:gap-3 transition-all'>
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='section-padding bg-gradient-to-br from-neutral-50 to-blue-50'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6'>
              How <span className='text-primary-red'>Connect2Life</span> Works
            </h2>
            <p className='text-xl text-neutral-600 max-w-2xl mx-auto'>
              Our streamlined process makes organ donation and matching simple,
              secure, and efficient.
            </p>
          </div>

          <div className='steps-container'>
            <div className='step-card'>
              <div className='step-number'>1</div>
              <h3 className='text-xl font-bold mb-3'>Register & Verify</h3>
              <p className='text-neutral-600'>
                Create your profile with medical information. All data is
                securely encrypted and verified by medical professionals.
              </p>
            </div>

            <div className='step-card'>
              <div className='step-number'>2</div>
              <h3 className='text-xl font-bold mb-3'>AI Matching</h3>
              <p className='text-neutral-600'>
                Our advanced AI analyzes compatibility factors including blood
                type, location, medical history, and urgency.
              </p>
            </div>

            <div className='step-card'>
              <div className='step-number'>3</div>
              <h3 className='text-xl font-bold mb-3'>Instant Alerts</h3>
              <p className='text-neutral-600'>
                Receive real-time notifications when matches are found.
                Emergency cases get priority alerts.
              </p>
            </div>

            <div className='step-card'>
              <div className='step-number'>4</div>
              <h3 className='text-xl font-bold mb-3'>Save Lives</h3>
              <p className='text-neutral-600'>
                Connect with hospitals for the donation process. Track your
                impact and earn recognition for saving lives.
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <Link to='/how-it-works' className='btn btn-outline'>
              View Detailed Process <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='section-padding'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6'>
              Stories of <span className='text-primary-blue'>Hope</span> and{' '}
              <span className='text-primary-red'>Life</span>
            </h2>
            <p className='text-xl text-neutral-600 max-w-2xl mx-auto'>
              Real people sharing their experiences with Connect2Life's
              life-saving platform.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='card'>
                <div className='flex items-center gap-4 mb-4'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-16 h-16 rounded-full object-cover'
                  />
                  <div>
                    <h4 className='font-bold text-lg'>{testimonial.name}</h4>
                    <p className='text-primary-blue font-medium'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className='text-neutral-600 italic leading-relaxed'>
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-padding bg-gradient-to-r from-primary-blue to-primary-red text-white'>
        <div className='container text-center'>
          <h2 className='text-4xl font-bold mb-6'>Ready to Save Lives?</h2>
          <p className='text-xl mb-8 opacity-90 max-w-2xl mx-auto'>
            Join thousands of heroes who are making a difference. Every
            registration could be the key to saving someone's life.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/register'
              className='btn bg-white text-primary-blue hover:bg-gray-100'
            >
              <Users size={20} />
              Join as Donor
            </Link>
            <Link
              to='/register'
              className='btn border-2 border-white hover:bg-white hover:text-primary-blue'
            >
              <Heart size={20} />
              Find a Match
            </Link>
          </div>

          <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <Shield size={32} className='mx-auto mb-3 opacity-80' />
              <h4 className='font-bold mb-2'>100% Secure</h4>
              <p className='opacity-80'>
                Your medical data is encrypted and HIPAA compliant
              </p>
            </div>
            <div>
              <Clock size={32} className='mx-auto mb-3 opacity-80' />
              <h4 className='font-bold mb-2'>24/7 Support</h4>
              <p className='opacity-80'>
                Round-the-clock emergency support and assistance
              </p>
            </div>
            <div>
              <Award size={32} className='mx-auto mb-3 opacity-80' />
              <h4 className='font-bold mb-2'>Verified Network</h4>
              <p className='opacity-80'>
                All donors and recipients are medically verified
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;