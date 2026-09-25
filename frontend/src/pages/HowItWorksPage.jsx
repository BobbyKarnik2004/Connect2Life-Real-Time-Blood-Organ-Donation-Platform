import React, { useState } from 'react';
import {
  UserCheck,
  Brain,
  Zap,
  Heart,
  Shield,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  FileText,
  Users,
  AlertTriangle,
  Phone,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('donor');
  const [showVideo, setShowVideo] = useState(false);

  const donorSteps = [
    {
      step: 1,
      icon: <UserCheck size={32} />,
      title: 'Register & Verify',
      description:
        'Create your donor profile with basic information and medical history.',
      details: [
        'Complete registration with personal details',
        'Upload medical documents and ID verification',
        'Medical professional reviews and verifies your profile',
        'Receive confirmation and digital donor card',
      ],
      time: '10-15 minutes',
      requirements: 'Valid ID, Medical history, Emergency contact',
    },
    {
      step: 2,
      icon: <Heart size={32} />,
      title: 'Set Preferences',
      description:
        "Choose which organs you're willing to donate and set availability.",
      details: [
        'Select organs you wish to donate',
        'Set geographic preferences for donation',
        'Choose notification preferences',
        'Update availability status anytime',
      ],
      time: '5 minutes',
      requirements: 'Medical clearance, Personal choice',
    },
    {
      step: 3,
      icon: <Zap size={32} />,
      title: 'Receive Alerts',
      description:
        'Get instant notifications when compatible recipients need your organs.',
      details: [
        'AI matches you with compatible recipients',
        'Receive push notifications, SMS, and email alerts',
        'Emergency cases get priority notifications',
        'Review match details and compatibility scores',
      ],
      time: 'Real-time',
      requirements: 'Active profile, Updated contact info',
    },
    {
      step: 4,
      icon: <CheckCircle size={32} />,
      title: 'Save Lives',
      description:
        'Respond to matches and coordinate with medical professionals.',
      details: [
        'Review recipient compatibility and urgency',
        'Accept or decline donation requests',
        'Coordinate with hospital and medical team',
        'Complete donation process with full medical support',
      ],
      time: 'Varies by case',
      requirements: 'Medical clearance, Hospital coordination',
    },
  ];

  const recipientSteps = [
    {
      step: 1,
      icon: <FileText size={32} />,
      title: 'Medical Registration',
      description: 'Complete detailed medical profile with organ requirements.',
      details: [
        'Provide comprehensive medical history',
        "Upload doctor's recommendations and test results",
        'Specify organs needed and urgency level',
        'Complete medical verification process',
      ],
      time: '20-30 minutes',
      requirements: "Medical records, Doctor's referral, Insurance info",
    },
    {
      step: 2,
      icon: <Brain size={32} />,
      title: 'AI Matching',
      description:
        'Our AI analyzes your profile and searches for compatible donors.',
      details: [
        'AI analyzes blood type, tissue compatibility',
        'Factors in geographic location and urgency',
        'Continuously searches donor database',
        'Prioritizes based on medical urgency',
      ],
      time: 'Continuous',
      requirements: 'Complete profile, Medical verification',
    },
    {
      step: 3,
      icon: <MapPin size={32} />,
      title: 'Find Matches',
      description:
        'Receive notifications about potential donor matches nearby.',
      details: [
        'Get alerts about compatible donors',
        'Review donor compatibility scores',
        'See distance and estimated coordination time',
        'Emergency cases get immediate priority matching',
      ],
      time: '2-10 minutes average',
      requirements: 'Active profile, Available donors',
    },
    {
      step: 4,
      icon: <Users size={32} />,
      title: 'Coordinate Care',
      description: 'Work with medical team to complete the transplant process.',
      details: [
        'Medical team contacts you about matches',
        'Coordinate with hospital and transplant team',
        'Prepare for transplant procedure',
        'Receive post-transplant care and support',
      ],
      time: 'Varies by case',
      requirements: 'Medical team, Hospital facilities',
    },
  ];

  const features = [
    {
      icon: <Brain size={40} />,
      title: 'AI-Powered Matching',
      description:
        'Advanced algorithms analyze 50+ compatibility factors to find the best matches.',
      stats: '95% accuracy rate',
    },
    {
      icon: <Zap size={40} />,
      title: 'Real-Time Alerts',
      description:
        'Instant notifications via SMS, email, and push notifications for urgent cases.',
      stats: '2-minute average response',
    },
    {
      icon: <Shield size={40} />,
      title: 'Secure & Private',
      description:
        'HIPAA-compliant platform with end-to-end encryption for all medical data.',
      stats: '100% data security',
    },
    {
      icon: <Award size={40} />,
      title: 'Gamification',
      description:
        'Earn points, badges, and recognition for your life-saving contributions.',
      stats: '10K+ active donors',
    },
  ];

  const faqs = [
    {
      question: 'How long does the registration process take?',
      answer:
        'Registration typically takes 10-15 minutes for donors and 20-30 minutes for recipients due to additional medical information required.',
    },
    {
      question: 'Is my medical information secure?',
      answer:
        'Yes, we use bank-level encryption and are fully HIPAA compliant. Your data is only shared with verified medical professionals and compatible matches.',
    },
    {
      question: 'How does the AI matching work?',
      answer:
        'Our AI analyzes over 50 compatibility factors including blood type, tissue markers, geographic location, medical history, and urgency levels to find optimal matches.',
    },
    {
      question: 'What happens in an emergency situation?',
      answer:
        'Emergency cases trigger immediate alerts to all compatible donors within a specified radius. Our 24/7 hotline coordinates with hospitals for rapid response.',
    },
    {
      question: 'Can I change my donation preferences?',
      answer:
        'Yes, you can update your organ donation preferences, availability status, and notification settings anytime through your profile.',
    },
    {
      question: 'How do you verify medical professionals?',
      answer:
        'All medical professionals on our platform are verified through medical license checks, hospital affiliations, and credential verification processes.',
    },
  ];

  const currentSteps = activeTab === 'donor' ? donorSteps : recipientSteps;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20'>
      {/* Hero Section */}
      <section className='section-padding'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h1 className='text-5xl font-bold mb-6'>
              How <span className='text-primary-blue'>Connect</span>
              <span className='text-primary-red'>2Life</span> Works
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8'>
              Our streamlined process connects organ donors with recipients
              through advanced AI matching, reducing waiting times from months
              to minutes.
            </p>
            <button
              onClick={() => setShowVideo(true)}
              className='btn btn-primary text-lg'
            >
              <Play size={24} />
              Watch Demo Video
            </button>
          </div>
        </div>
      </section>

      {/* Process Tabs */}
      <section className='section-padding bg-white/60 backdrop-blur-sm'>
        <div className='container'>
          <div className='max-w-6xl mx-auto'>
            {/* Tab Navigation */}
            <div className='flex justify-center mb-12'>
              <div className='bg-white rounded-lg p-2 shadow-lg border'>
                <button
                  onClick={() => setActiveTab('donor')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'donor'
                      ? 'bg-primary-blue shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  For Donors
                </button>
                <button
                  onClick={() => setActiveTab('recipient')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'recipient'
                      ? 'bg-primary-red  shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  For Recipients
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className='space-y-12'>
              {currentSteps.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex items-start gap-8 ${
                    index % 2 === 1 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className='flex-1'>
                    <div className='card'>
                      <div className='flex items-center gap-4 mb-6'>
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                            activeTab === 'donor'
                              ? 'bg-gradient-to-br from-primary-blue to-secondary-blue'
                              : 'bg-gradient-to-br from-primary-red to-secondary-red'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-500 mb-1'>
                            Step {step.step}
                          </div>
                          <h3 className='text-2xl font-bold'>{step.title}</h3>
                        </div>
                      </div>

                      <p className='text-lg text-gray-600 mb-6'>
                        {step.description}
                      </p>

                      <div className='grid md:grid-cols-2 gap-6 mb-6'>
                        <div>
                          <h4 className='font-semibold mb-3'>
                            What's Involved:
                          </h4>
                          <ul className='space-y-2'>
                            {step.details.map((detail, idx) => (
                              <li key={idx} className='flex items-start gap-2'>
                                <CheckCircle
                                  className='text-green-500 mt-0.5 flex-shrink-0'
                                  size={16}
                                />
                                <span className='text-sm text-gray-600'>
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className='space-y-4'>
                          <div className='bg-blue-50 p-4 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Clock className='text-blue-600' size={16} />
                              <span className='font-medium text-blue-800'>
                                Time Required
                              </span>
                            </div>
                            <p className='text-blue-700'>{step.time}</p>
                          </div>
                          <div className='bg-gray-50 p-4 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                              <FileText className='text-gray-600' size={16} />
                              <span className='font-medium text-gray-800'>
                                Requirements
                              </span>
                            </div>
                            <p className='text-gray-700 text-sm'>
                              {step.requirements}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex-shrink-0 w-24 flex justify-center'>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                        activeTab === 'donor'
                          ? 'bg-primary-blue'
                          : 'bg-primary-red'
                      }`}
                    >
                      {step.step}
                    </div>
                    {index < currentSteps.length - 1 && (
                      <div className='absolute mt-12 w-1 h-24 bg-gradient-to-b from-primary-blue to-primary-red opacity-30'></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className='section-padding'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6'>
              Why Choose Connect2Life?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Advanced technology and human compassion working together to save
              lives.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='card-feature'>
                <div className='feature-icon mb-6'>{feature.icon}</div>
                <h3 className='text-xl font-bold mb-4'>{feature.title}</h3>
                <p className='text-gray-600 mb-4'>{feature.description}</p>
                <div className='text-primary-blue px-4 py-2 rounded-full text-sm font-semibold'>
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Process */}
      <section className='section-padding bg-gradient-to-r from-red-500 to-orange-500 text-white'>
        <div className='container'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex justify-center mb-6'>
              <div className='bg-white/20 backdrop-blur-sm p-4 rounded-full'>
                <AlertTriangle size={48} />
              </div>
            </div>
            <h2 className='text-4xl font-bold mb-6'>Emergency Protocol</h2>
            <p className='text-xl opacity-90 mb-8'>
              In critical situations, our emergency system activates to find
              matches within minutes.
            </p>

            <div className='grid md:grid-cols-3 gap-8 mb-12'>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                <Zap className='mx-auto mb-4' size={32} />
                <h3 className='text-xl font-bold mb-2'>Instant Alerts</h3>
                <p className='opacity-80'>
                  All compatible donors within 50km radius receive immediate
                  notifications
                </p>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                <Phone className='mx-auto mb-4' size={32} />
                <h3 className='text-xl font-bold mb-2'>24/7 Hotline</h3>
                <p className='opacity-80'>
                  Medical team coordinates directly with hospitals and emergency
                  services
                </p>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                <Clock className='mx-auto mb-4' size={32} />
                <h3 className='text-xl font-bold mb-2'>Rapid Response</h3>
                <p className='opacity-80'>
                  Average emergency response time reduced to under 30 minutes
                </p>
              </div>
            </div>

            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center'>
              <h3 className='text-2xl font-bold mb-4'>Emergency Hotline</h3>
              <p className='text-3xl font-bold'>1-800-LIFE-NOW</p>
              <p className='opacity-80 mt-2'>
                Available 24/7 for critical organ donation emergencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='section-padding'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6'>
              Frequently Asked Questions
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Get answers to common questions about our organ donation platform.
            </p>
          </div>

          <div className='max-w-4xl mx-auto space-y-4'>
            {faqs.map((faq, index) => (
              <div key={index} className='card'>
                <details className='group'>
                  <summary className='flex justify-between items-center cursor-pointer list-none'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      {faq.question}
                    </h3>
                    <ArrowRight
                      className='text-gray-400 group-open:rotate-90 transition-transform'
                      size={20}
                    />
                  </summary>
                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <p className='text-gray-600 leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-padding bg-gradient-to-br from-primary-blue to-primary-red text-white'>
        <div className='container'>
          <div className='text-center'>
            <h2 className='text-4xl font-bold mb-6'>Ready to Save Lives?</h2>
            <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
              Join thousands of heroes making a difference. Every registration
              brings us closer to a world where no one dies waiting for an organ
              transplant.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a href='/register' className='btn btn-primary'>
                <Heart size={20} />
                Become a Donor
              </a>
              <a href='/register' className='btn btn-primary'>
                <Users size={20} />
                Find a Match
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-4xl w-full relative'>
            <button
              onClick={() => setShowVideo(false)}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            <div className='p-6'>
              <h3 className='text-2xl font-bold mb-4'>
                How Connect2Life Works
              </h3>
              <div className='aspect-video bg-gray-200 rounded-lg flex items-center justify-center'>
                <div className='text-center'>
                  <Play className='mx-auto mb-4 text-gray-400' size={64} />
                  <p className='text-gray-600'>
                    Demo video would be embedded here
                  </p>
                  <p className='text-sm text-gray-500 mt-2'>
                    This would show the complete process of donor registration,
                    AI matching, and successful organ donation coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
