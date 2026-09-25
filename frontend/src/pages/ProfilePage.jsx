import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Activity,
  Shield,
  Award,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  
  // Profile States
  const [basicProfile, setBasicProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profile_picture: user?.profile_picture || ''
  });

  const [medicalProfile, setMedicalProfile] = useState({
    blood_type: '',
    medical_conditions: [],
    medications: [],
    allergies: [],
    height: '',
    weight: '',
    age: '',
    location: {
      lat: '',
      lng: '',
      address: ''
    },
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [donorProfile, setDonorProfile] = useState({
    organs_willing_to_donate: [],
    availability: 'available',
    preferences: {},
    gamification_points: 0,
    badges: []
  });

  const [recipientProfile, setRecipientProfile] = useState({
    organs_needed: [],
    urgency_level: 'medium',
    medical_priority_score: 50,
    waiting_since: new Date().toISOString().split('T')[0]
  });

  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch medical profile
      try {
        const medicalResponse = await axios.get('/profile/medical');
        setMedicalProfile(medicalResponse.data);
      } catch (error) {
        console.log('No medical profile found');
      }

      // Fetch donor profile if user is donor
      if (user?.role === 'donor') {
        try {
          const donorResponse = await axios.get('/profile/donor');
          setDonorProfile(donorResponse.data);
        } catch (error) {
          console.log('No donor profile found');
        }
      }

      // Fetch recipient profile if user is recipient
      if (user?.role === 'recipient') {
        try {
          const recipientResponse = await axios.get('/profile/recipient');
          setRecipientProfile(recipientResponse.data);
        } catch (error) {
          console.log('No recipient profile found');
        }
      }

    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBasicProfile = async () => {
    try {
      await axios.put('/profile/me', basicProfile);
      toast.success('Profile updated successfully!');
      await checkAuth(); // Refresh user data
    } catch (error) {
      toast.error('Failed to update profile', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const createOrUpdateMedicalProfile = async () => {
    try {
      await axios.post('/profile/medical', medicalProfile);
      toast.success('Medical profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update medical profile', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const createOrUpdateDonorProfile = async () => {
    try {
      await axios.post('/profile/donor', donorProfile);
      toast.success('Donor profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update donor profile', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const createOrUpdateRecipientProfile = async () => {
    try {
      await axios.post('/profile/recipient', recipientProfile);
      toast.success('Recipient profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update recipient profile', {
        description: error.response?.data?.detail || 'Please try again.'
      });
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organTypes = ['kidney', 'liver', 'heart', 'lungs', 'pancreas', 'cornea', 'skin', 'bones'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User size={20} /> },
    { id: 'medical', label: 'Medical', icon: <Activity size={20} /> },
    ...(user?.role === 'donor' ? [{ id: 'donor', label: 'Donor Info', icon: <Heart size={20} /> }] : []),
    ...(user?.role === 'recipient' ? [{ id: 'recipient', label: 'Recipient Info', icon: <Shield size={20} /> }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-blue to-primary-red rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50">
                <Edit size={16} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-600 capitalize">{user?.role} Profile</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-blue text-primary-blue bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={basicProfile.name}
                        onChange={(e) => setBasicProfile({...basicProfile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={basicProfile.email}
                        onChange={(e) => setBasicProfile({...basicProfile, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={basicProfile.phone}
                        onChange={(e) => setBasicProfile({...basicProfile, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-input bg-gray-50"
                        value={user?.role}
                        disabled
                      />
                    </div>
                  </div>
                  <button onClick={updateBasicProfile} className="btn btn-primary">
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              )}

              {/* Medical Info Tab */}
              {activeTab === 'medical' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Blood Type</label>
                      <select
                        className="form-select"
                        value={medicalProfile.blood_type}
                        onChange={(e) => setMedicalProfile({...medicalProfile, blood_type: e.target.value})}
                      >
                        <option value="">Select Blood Type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-input"
                        value={medicalProfile.age}
                        onChange={(e) => setMedicalProfile({...medicalProfile, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={medicalProfile.height}
                        onChange={(e) => setMedicalProfile({...medicalProfile, height: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={medicalProfile.weight}
                        onChange={(e) => setMedicalProfile({...medicalProfile, weight: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Current Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your current address"
                      value={medicalProfile.location.address}
                      onChange={(e) => setMedicalProfile({
                        ...medicalProfile,
                        location: {...medicalProfile.location, address: e.target.value}
                      })}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label">Emergency Contact Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={medicalProfile.emergency_contact.name}
                        onChange={(e) => setMedicalProfile({
                          ...medicalProfile,
                          emergency_contact: {...medicalProfile.emergency_contact, name: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={medicalProfile.emergency_contact.phone}
                        onChange={(e) => setMedicalProfile({
                          ...medicalProfile,
                          emergency_contact: {...medicalProfile.emergency_contact, phone: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Relationship</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Spouse, Parent"
                        value={medicalProfile.emergency_contact.relationship}
                        onChange={(e) => setMedicalProfile({
                          ...medicalProfile,
                          emergency_contact: {...medicalProfile.emergency_contact, relationship: e.target.value}
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Medical Conditions (comma-separated)</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="List any medical conditions, e.g., Diabetes, Hypertension"
                      value={medicalProfile.medical_conditions.join(', ')}
                      onChange={(e) => setMedicalProfile({
                        ...medicalProfile,
                        medical_conditions: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                    />
                  </div>

                  <button onClick={createOrUpdateMedicalProfile} className="btn btn-primary">
                    <Save size={20} />
                    Save Medical Information
                  </button>
                </div>
              )}

              {/* Donor Info Tab */}
              {activeTab === 'donor' && user?.role === 'donor' && (
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Organs Willing to Donate</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {organTypes.map(organ => (
                        <label key={organ} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={donorProfile.organs_willing_to_donate.includes(organ)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDonorProfile({
                                  ...donorProfile,
                                  organs_willing_to_donate: [...donorProfile.organs_willing_to_donate, organ]
                                });
                              } else {
                                setDonorProfile({
                                  ...donorProfile,
                                  organs_willing_to_donate: donorProfile.organs_willing_to_donate.filter(o => o !== organ)
                                });
                              }
                            }}
                            className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                          />
                          <span className="text-sm capitalize">{organ}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Availability Status</label>
                    <select
                      className="form-select"
                      value={donorProfile.availability}
                      onChange={(e) => setDonorProfile({...donorProfile, availability: e.target.value})}
                    >
                      <option value="available">Available</option>
                      <option value="not_available">Not Available</option>
                      <option value="donated">Already Donated</option>
                    </select>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="text-yellow-500" size={24} />
                      Gamification Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-blue">{donorProfile.gamification_points}</div>
                        <div className="text-sm text-gray-600">Points Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{donorProfile.badges.length}</div>
                        <div className="text-sm text-gray-600">Badges Unlocked</div>
                      </div>
                    </div>
                  </div>

                  <button onClick={createOrUpdateDonorProfile} className="btn btn-primary">
                    <Save size={20} />
                    Save Donor Information
                  </button>
                </div>
              )}

              {/* Recipient Info Tab */}
              {activeTab === 'recipient' && user?.role === 'recipient' && (
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Organs Needed</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {organTypes.map(organ => (
                        <label key={organ} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={recipientProfile.organs_needed.includes(organ)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRecipientProfile({
                                  ...recipientProfile,
                                  organs_needed: [...recipientProfile.organs_needed, organ]
                                });
                              } else {
                                setRecipientProfile({
                                  ...recipientProfile,
                                  organs_needed: recipientProfile.organs_needed.filter(o => o !== organ)
                                });
                              }
                            }}
                            className="h-4 w-4 text-primary-red focus:ring-primary-red border-gray-300 rounded"
                          />
                          <span className="text-sm capitalize">{organ}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Urgency Level</label>
                      <select
                        className="form-select"
                        value={recipientProfile.urgency_level}
                        onChange={(e) => setRecipientProfile({...recipientProfile, urgency_level: e.target.value})}
                      >
                        {urgencyLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Waiting Since</label>
                      <input
                        type="date"
                        className="form-input"
                        value={recipientProfile.waiting_since.split('T')[0]}
                        onChange={(e) => setRecipientProfile({...recipientProfile, waiting_since: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Medical Priority Score (1-100)</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      className="w-full"
                      value={recipientProfile.medical_priority_score}
                      onChange={(e) => setRecipientProfile({...recipientProfile, medical_priority_score: parseInt(e.target.value)})}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Low Priority</span>
                      <span className="font-medium">{recipientProfile.medical_priority_score}</span>
                      <span>High Priority</span>
                    </div>
                  </div>

                  <button onClick={createOrUpdateRecipientProfile} className="btn btn-secondary">
                    <Save size={20} />
                    Save Recipient Information
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Privacy & Security</h3>
                <p className="text-gray-600 text-sm">
                  Your medical information is encrypted and stored securely. Only verified medical professionals 
                  and compatible matches can access relevant parts of your profile. You have full control over 
                  your data and can update or delete it at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}