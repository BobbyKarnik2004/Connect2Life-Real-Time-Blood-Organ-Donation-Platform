import React from 'react';
import { 
  Heart, 
  Users, 
  Target, 
  Award, 
  Globe,
  Shield,
  Zap,
  Brain,
  CheckCircle,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '50,000+', label: 'Lives Saved', icon: <Heart size={24} /> },
    { number: '100+', label: 'Partner Hospitals', icon: <Users size={24} /> },
    { number: '95%', label: 'Match Success Rate', icon: <Target size={24} /> },
    { number: '2 min', label: 'Average Match Time', icon: <Clock size={24} /> }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1666886573197-bf6600d15bce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
      bio: 'Leading transplant surgeon with 15+ years experience in organ donation'
    },
    {
      name: 'Alex Rodriguez',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1666886573421-d19e546cfc4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwwfHx8fDE3NTc3OTY2MDd8MA&ixlib=rb-4.1.0&q=85',
      bio: 'Healthcare technology entrepreneur passionate about saving lives through innovation'
    },
    {
      name: 'Dr. Michael Park',
      role: 'Head of AI Research',
      image: 'https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85',
      bio: 'AI specialist developing advanced algorithms for organ compatibility matching'
    },
    {
      name: 'Lisa Thompson',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1660548902284-764f13525be2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85',
      bio: 'Operations expert ensuring seamless coordination between donors and recipients'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Connect2Life Founded',
      description: 'Started with a vision to revolutionize organ donation through AI technology'
    },
    {
      year: '2024',
      title: 'First AI Match',
      description: 'Successfully matched first donor-recipient pair using our AI algorithm'
    },
    {
      year: '2024',
      title: '1,000 Lives Saved',
      description: 'Reached our first major milestone of facilitating 1,000 life-saving matches'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to serve multiple countries and save lives worldwide'
    }
  ];

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Compassion First',
      description: 'Every decision we make is driven by our commitment to saving lives and reducing suffering.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data protection and medical confidentiality.'
    },
    {
      icon: <Brain size={32} />,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and technology to improve matching accuracy and speed.'
    },
    {
      icon: <Users size={32} />,
      title: 'Community',
      description: 'We build strong relationships between donors, recipients, and medical professionals.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Accessibility',
      description: 'We make organ donation accessible to everyone, regardless of background or location.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Continuous Growth',
      description: 'We constantly improve our platform to serve more people and save more lives.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-primary-blue">Connect</span><span className="text-primary-red">2Life</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are on a mission to save lives by connecting organ donors with recipients through 
              advanced AI technology, reducing waiting times from months to minutes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card group">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-primary-blue to-primary-red text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-number">{stat.number}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white/60 backdrop-blur-sm">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Connect2Life exists to bridge the critical gap between organ donors and recipients. 
                In India alone, 12,000 lives are lost daily due to unavailable organs. We're changing 
                this reality through innovative technology.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI-powered platform analyzes compatibility factors in real-time, finds nearby matches, 
                and sends instant alerts to save precious time when every second counts.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-800 font-medium">95% Success Rate</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Zap className="text-blue-600" size={20} />
                  <span className="text-blue-800 font-medium">2-minute Matching</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <Shield className="text-purple-600" size={20} />
                  <span className="text-purple-800 font-medium">HIPAA Compliant</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1660548902284-764f13525be2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxvcmdhbiUyMGRvbmF0aW9ufGVufDB8fHx8MTc1Nzc5NjYxM3ww&ixlib=rb-4.1.0&q=85"
                alt="Hope and Connection"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/20 to-primary-red/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and drive our commitment to saving lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-feature">
                <div className="feature-icon mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to revolutionizing organ donation and saving lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary-blue font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to transform organ donation worldwide.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-blue to-primary-red"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="card">
                      <div className="text-2xl font-bold text-primary-blue mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-primary-blue rounded-full shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding bg-gradient-to-r from-primary-blue to-primary-red text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Together, we're creating a world where no one dies waiting for an organ transplant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-4">60%</div>
              <h3 className="text-xl font-semibold mb-2">Reduced Waiting Time</h3>
              <p className="opacity-80">Average reduction in time from match request to donor response</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-4">24/7</div>
              <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
              <p className="opacity-80">Round-the-clock emergency hotline and medical support team</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-4">100+</div>
              <h3 className="text-xl font-semibold mb-2">Partner Hospitals</h3>
              <p className="opacity-80">Verified medical institutions across multiple regions</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <Star className="text-yellow-300" size={24} />
              <span className="font-semibold">Rated 4.9/5 by healthcare professionals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a healthcare professional, potential donor, or someone in need, 
              we're here to support you in this life-saving journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn btn-primary">
                <Heart size={20} />
                Become a Donor
              </a>
              <a href="/register" className="btn btn-secondary">
                <Users size={20} />
                Find a Match
              </a>
              <a href="mailto:support@connect2life.com" className="btn btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}