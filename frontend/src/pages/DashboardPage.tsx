import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Heart, 
  Users, 
  Clock, 
  Award, 
  AlertTriangle, 
  Activity,
  CheckCircle,
  Zap,
  Calendar,
  Plus,
  ArrowRight,
  MapPin,
  Droplets,
  Bell,
  User,
  Settings,
  TrendingUp,
  Target
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const isDonor = user?.role === 'donor';
  const isRecipient = user?.role === 'recipient';

  // Mock data - replace with real API calls later
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalMatches: isDonor ? 12 : 5,
      activeRequests: isDonor ? 3 : 2,
      livesImpacted: isDonor ? 8 : 0,
      donorPoints: isDonor ? 1200 : 0,
      responseTime: isDonor ? '2h 15m' : '4h 30m',
      urgentRequests: isDonor ? 0 : 1
    },
    recentMatches: [
      {
        id: '1',
        name: 'John Doe',
        bloodGroup: 'A+',
        location: 'New York, NY',
        type: 'Blood Donation',
        status: 'completed',
        date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Sarah Smith',
        bloodGroup: 'O-',
        location: 'Los Angeles, CA',
        type: 'Platelet Donation',
        status: 'pending',
        date: '2024-01-10'
      }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {isDonor ? 'Thank you for being a life-saver' : 'We\'re here to help you find a match'}
              </p>
            </div>
            
            {/* Profile completion card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData.stats.totalMatches}
              </div>
              <div className="text-sm text-gray-500">
                {isDonor ? 'Total Donations' : 'Total Matches'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Complete your profile to get better matches!
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link 
                  to="/profile" 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Lives Impacted / Active Requests */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {isDonor ? 'Lives Impacted' : 'Active Requests'}
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {isDonor ? dashboardData.stats.livesImpacted : dashboardData.stats.activeRequests}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +12% from last month
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                {isDonor ? (
                  <Heart className="h-6 w-6 text-blue-500" />
                ) : (
                  <Clock className="h-6 w-6 text-blue-500" />
                )}
              </div>
            </div>
          </div>

          {/* Total Matches */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {isDonor ? 'Total Donations' : 'Total Matches'}
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {dashboardData.stats.totalMatches}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +8% from last month
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Donor Points / Response Time */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {isDonor ? 'Donor Points' : 'Response Time'}
                </h3>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {isDonor ? dashboardData.stats.donorPoints : dashboardData.stats.responseTime}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {isDonor ? 'Top 10% donor' : 'Faster than 85%'}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                {isDonor ? (
                  <Award className="h-6 w-6 text-purple-500" />
                ) : (
                  <Clock className="h-6 w-6 text-purple-500" />
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="h-full flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                {isRecipient ? 'Need urgent help?' : 'Quick Actions'}
              </h3>
              {isRecipient ? (
                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all">
                  <Zap className="h-4 w-4 mr-2" />
                  Send Emergency Alert
                </button>
              ) : (
                <Link
                  to="/matching"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isDonor ? 'Start New Donation' : 'Create New Request'}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Recent Matches - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Matches</h2>
                <p className="text-sm text-gray-500">
                  Your most recent matches and their status
                </p>
              </div>
              <Link 
                to="/matching" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData.recentMatches.length > 0 ? (
                dashboardData.recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        match.status === 'completed' ? 'bg-green-100' :
                        match.status === 'pending' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {match.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {match.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.bloodGroup} • {match.location}
                      </p>
                      <p className="text-xs text-gray-400">
                        {match.type} - {match.date}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        match.status === 'completed' ? 'bg-green-100 text-green-800' :
                        match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent matches</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isDonor 
                      ? 'When you match with recipients, they\'ll appear here.'
                      : 'When you match with donors, they\'ll appear here.'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/matching"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      {isDonor ? 'Start Donating' : 'Find Matches'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500">
                Common actions and shortcuts
              </p>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/profile"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Update Profile</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link 
                to="/matching"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {isDonor ? 'Find Recipients' : 'Find Donors'}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link 
                to="/appointments"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Schedule Appointment</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              
              <Link 
                to="/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>

            {/* User Info Card */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isDonor ? 'Donor' : 'Recipient'} • Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;