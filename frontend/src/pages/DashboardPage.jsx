import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Clock, 
  Award, 
  AlertTriangle, 
  MapPin, 
  Activity,
  Plus,
  CheckCircle,
  UserCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [stats, setStats] = useState({
    totalMatches: 0,
    activeRequests: 0,
    liveSaved: 0,
    donorPoints: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [profileStatus, setProfileStatus] = useState({
    medicalProfile: false,
    donorProfile: false,
    recipientProfile: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user matches
      const matchesResponse = await axios.get('/matching/my-matches');
      setRecentMatches(matchesResponse.data.slice(0, 5));
      
      // Check profile completion
      const profileChecks = await Promise.all([
        axios.get('/profile/medical').catch(() => null),
        axios.get('/profile/donor').catch(() => null),
        axios.get('/profile/recipient').catch(() => null)
      ]);
      
      setProfileStatus({
        medicalProfile: !!profileChecks[0],
        donorProfile: !!profileChecks[1] && user.role === 'donor',
        recipientProfile: !!profileChecks[2] && user.role === 'recipient'
      });

      // Mock stats for now
      setStats({
        totalMatches: matchesResponse.data.length,
        activeRequests: matchesResponse.data.filter(m => m.status === 'pending').length,
        liveSaved: user.role === 'donor' ? Math.floor(Math.random() * 5) : 0,
        donorPoints: user.role === 'donor' ? Math.floor(Math.random() * 1000) : 0
      });

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmergencyAlert = async () => {
    try {
      const alertData = {
        organ_type: 'kidney', // This would come from user input in real app
        location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
        urgency: 'critical'
      };
      
      await axios.post('/emergency/alert', alertData);
      toast.success('Emergency Alert Sent!', {
        description: 'Nearby donors have been notified of your urgent need.'
      });
    } catch (error) {
      toast.error('Failed to send emergency alert', {
        description: error.response?.data?.detail || 'Please try again later.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isDonor = user?.role === 'donor';
  const isRecipient = user?.role === 'recipient';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg opacity-90">
                {isDonor ? 'Thank you for being a life-saver' : 'We\'re here to help you find a match'}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalMatches}</div>
                <div className="text-sm opacity-80">Total Matches</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Profile Completion Alert */}
        {(!profileStatus.medicalProfile || (isDonor && !profileStatus.donorProfile) || (isRecipient && !profileStatus.recipientProfile)) && (
          <div className="alert alert-warning mb-8">
            <AlertTriangle size={20} />
            <div>
              <strong>Complete your profile to get better matches!</strong>
              <div className="mt-2 flex gap-2">
                {!profileStatus.medicalProfile && (
                  <Link to="/profile" className="btn btn-primary text-sm">
                    Add Medical Info
                  </Link>
                )}
                {isDonor && !profileStatus.donorProfile && (
                  <Link to="/profile" className="btn btn-secondary text-sm">
                    Complete Donor Profile
                  </Link>
                )}
                {isRecipient && !profileStatus.recipientProfile && (
                  <Link to="/profile" className="btn btn-secondary text-sm">
                    Complete Recipient Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="dashboard-grid mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {isDonor ? 'Lives Impacted' : 'Active Requests'}
                </h3>
                <p className="text-3xl font-bold text-primary-blue mt-2">
                  {isDonor ? stats.liveSaved : stats.activeRequests}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                {isDonor ? <Heart className="text-primary-blue" size={24} /> : <Clock className="text-primary-blue" size={24} />}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Matches</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalMatches}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {isDonor && (
            <div className="dashboard-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Donor Points</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.donorPoints}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Award className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">{unreadCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Matches */}
            <div className="dashboard-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Matches</h2>
                <Link to="/matching" className="text-primary-blue hover:text-secondary-blue font-medium">
                  View All
                </Link>
              </div>
              
              {recentMatches.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No matches yet</p>
                  <Link to="/matching" className="btn btn-primary">
                    {isDonor ? 'View Match Requests' : 'Request a Match'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMatches.map((match, index) => (
                    <div key={match.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-blue text-white p-2 rounded-full">
                          <Heart size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium">{match.organ_type} Match</h4>
                          <p className="text-sm text-gray-600">
                            Compatibility: {Math.round((match.compatibility_score || 0.8) * 100)}% | 
                            Distance: {(match.distance_km || 15).toFixed(1)}km
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {match.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {isRecipient && (
                  <>
                    <Link to="/matching" className="btn btn-primary">
                      <Plus size={20} />
                      Request Match
                    </Link>
                    <button 
                      onClick={sendEmergencyAlert}
                      className="btn btn-secondary"
                    >
                      <Zap size={20} />
                      Emergency Alert
                    </button>
                  </>
                )}
                {isDonor && (
                  <>
                    <Link to="/matching" className="btn btn-primary">
                      <UserCheck size={20} />
                      View Requests
                    </Link>
                    <Link to="/profile" className="btn btn-outline">
                      <Heart size={20} />
                      Update Availability
                    </Link>
                  </>
                )}
                <Link to="/profile" className="btn btn-outline">
                  <Users size={20} />
                  Edit Profile
                </Link>
                <Link to="/how-it-works" className="btn btn-outline">
                  <MapPin size={20} />
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Notifications */}
            <div className="dashboard-card">
              <h3 className="text-lg font-bold mb-4">Recent Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notifications yet</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Completion */}
            <div className="dashboard-card">
              <h3 className="text-lg font-bold mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medical Profile</span>
                  {profileStatus.medicalProfile ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <span className="text-red-500 text-sm">Incomplete</span>
                  )}
                </div>
                {isDonor && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Donor Profile</span>
                    {profileStatus.donorProfile ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <span className="text-red-500 text-sm">Incomplete</span>
                    )}
                  </div>
                )}
                {isRecipient && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recipient Profile</span>
                    {profileStatus.recipientProfile ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <span className="text-red-500 text-sm">Incomplete</span>
                    )}
                  </div>
                )}
              </div>
              <Link to="/profile" className="btn btn-primary w-full mt-4">
                Complete Profile
              </Link>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">🚨 Emergency Contact</h4>
              <p className="text-sm text-red-700 mb-3">
                For urgent medical situations, call our 24/7 hotline immediately.
              </p>
              <div className="text-center">
                <p className="font-bold text-red-600 text-lg">1-800-LIFE-NOW</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}