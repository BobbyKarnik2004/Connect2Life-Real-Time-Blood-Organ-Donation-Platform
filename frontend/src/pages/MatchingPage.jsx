import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock, 
  Zap, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Plus,
  Eye,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function MatchingPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const [newRequest, setNewRequest] = useState({
    organ_type: '',
    urgency_level: 'medium',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'New York, NY'
    },
    compatibility_requirements: {}
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/matching/my-matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const createMatchRequest = async () => {
    try {
      await axios.post('/matching/request', newRequest);
      toast.success('Match request created!', {
        description: 'Our AI is searching for compatible donors nearby.'
      });
      setShowCreateRequest(false);
      setNewRequest({
        organ_type: '',
        urgency_level: 'medium',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'New York, NY'
        },
        compatibility_requirements: {}
      });
      fetchMatches();
    } catch (error) {
      toast.error('Failed to create match request', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const respondToMatch = async (matchId, status) => {
    try {
      await axios.put(`/matching/${matchId}/respond`, { status });
      toast.success(`Match ${status}!`, {
        description: `You have ${status} this donation match.`
      });
      fetchMatches();
    } catch (error) {
      toast.error('Failed to respond to match', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const sendEmergencyAlert = async () => {
    try {
      const alertData = {
        organ_type: 'kidney', // This would be selected by user
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'New York, NY'
        },
        urgency: 'critical'
      };
      
      await axios.post('/emergency/alert', alertData);
      toast.success('🚨 Emergency Alert Sent!', {
        description: 'Nearby donors have been notified of your urgent need.'
      });
    } catch (error) {
      toast.error('Failed to send emergency alert');
    }
  };

  const organTypes = ['kidney', 'liver', 'heart', 'lungs', 'pancreas', 'cornea'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return React.createElement('div', { className: "min-h-screen flex items-center justify-center pt-20" },
      React.createElement('div', { className: "text-center" },
        React.createElement('div', { className: "spinner mb-4" }),
        React.createElement('p', null, "Loading matches...")
      )
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.role === 'donor' ? 'Donation Requests' : 'My Matches'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'donor' 
                ? 'Review and respond to organ donation requests'
                : 'Track your match requests and find compatible donors'
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            {user?.role === 'recipient' && (
              <>
                <button
                  onClick={sendEmergencyAlert}
                  className="btn btn-secondary"
                >
                  <Zap size={20} />
                  Emergency Alert
                </button>
                <button
                  onClick={() => setShowCreateRequest(true)}
                  className="btn btn-primary"
                >
                  <Plus size={20} />
                  New Request
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <span className="font-medium">Filter:</span>
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'accepted', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
            </div>
          </div>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'donor' 
                ? 'No donation requests match your criteria yet.'
                : 'No compatible donors found yet. Try creating a new request.'
              }
            </p>
            {user?.role === 'recipient' && (
              <button
                onClick={() => setShowCreateRequest(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Create Match Request
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary-blue text-white p-2 rounded-full">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold capitalize">
                          {match.organ_type} Match
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {(match.distance_km || 15).toFixed(1)}km away
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {new Date(match.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Compatibility</div>
                        <div className="text-xl font-bold text-blue-600">
                          {Math.round((match.compatibility_score || 0.85) * 100)}%
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">AI Prediction</div>
                        <div className="text-xl font-bold text-green-600">
                          {Math.round((match.ai_prediction_score || 0.78) * 100)}%
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Distance</div>
                        <div className="text-xl font-bold text-purple-600">
                          {(match.distance_km || 15).toFixed(1)}km
                        </div>
                      </div>
                    </div>

                    {match.urgency_level && (
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className={getUrgencyColor(match.urgency_level)} />
                        <span className={`text-sm font-medium ${getUrgencyColor(match.urgency_level)}`}>
                          {match.urgency_level.charAt(0).toUpperCase() + match.urgency_level.slice(1)} Priority
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                      {match.status || 'pending'}
                    </span>
                    
                    {user?.role === 'donor' && match.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToMatch(match.id, 'accepted')}
                          className="btn bg-green-600 text-white hover:bg-green-700 text-sm"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => respondToMatch(match.id, 'rejected')}
                          className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                        >
                          <XCircle size={16} />
                          Decline
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button className="btn btn-outline text-sm">
                        <Eye size={16} />
                        View Details
                      </button>
                      <button className="btn btn-outline text-sm">
                        <MessageCircle size={16} />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Request Modal */}
        {showCreateRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Create Match Request</h2>
                <button
                  onClick={() => setShowCreateRequest(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Organ Needed</label>
                  <select
                    className="form-select"
                    value={newRequest.organ_type}
                    onChange={(e) => setNewRequest({...newRequest, organ_type: e.target.value})}
                  >
                    <option value="">Select Organ</option>
                    {organTypes.map(organ => (
                      <option key={organ} value={organ} className="capitalize">
                        {organ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Urgency Level</label>
                  <select
                    className="form-select"
                    value={newRequest.urgency_level}
                    onChange={(e) => setNewRequest({...newRequest, urgency_level: e.target.value})}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your location"
                    value={newRequest.location.address}
                    onChange={(e) => setNewRequest({
                      ...newRequest,
                      location: {...newRequest.location, address: e.target.value}
                    })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={createMatchRequest}
                    className="btn btn-primary flex-1"
                    disabled={!newRequest.organ_type}
                  >
                    Create Request
                  </button>
                  <button
                    onClick={() => setShowCreateRequest(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}