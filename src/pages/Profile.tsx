import React, { useState } from 'react';
import { User, Mail, Phone, UserPlus, Edit, ShieldCheck, LogOut, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  
  // Form state (pre-filled with user data)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210', // Mock data
    healthConditions: user?.healthConditions || [],
    allergies: ['Penicillin', 'Peanuts'], // Mock data
    bloodType: 'O+', // Mock data
    emergencyContact: user?.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  
  // Mock appointments data
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      date: '2025-05-15',
      time: '10:00 AM',
      location: 'City Hospital, Room 302'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      date: '2025-06-10',
      time: '2:30 PM',
      location: 'Heart Center, Suite 105'
    }
  ];
  
  // Mock insurance data
  const insuranceInfo = {
    provider: 'MediCare Health Insurance',
    policyNumber: 'MHI849261735',
    groupNumber: 'GR-59371',
    coverageType: 'Family',
    validUntil: '2025-12-31'
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [string, string];
  
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev];
  
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to the server
    setEditMode(false);
  };
  
  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+91 98765 43210',
      healthConditions: user?.healthConditions || [],
      allergies: ['Penicillin', 'Peanuts'],
      bloodType: 'O+',
      emergencyContact: user?.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setEditMode(false);
  };
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">My Profile</h2>
          <p className="text-gray-600">Manage your personal and health information</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          {!editMode ? (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              <Edit size={18} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                className="btn btn-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                form="profile-form"
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Personal Information */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold flex items-center">
                <User size={18} className="mr-2 text-primary-500" />
                Personal Information
              </h3>
            </div>
            
            <div className="p-5">
              <form id="profile-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    {editMode ? (
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                        className="form-input"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-800">{formData.bloodType}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="healthConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    Health Conditions
                  </label>
                  {editMode ? (
                    <textarea
                      id="healthConditions"
                      name="healthConditions"
                      value={formData.healthConditions.join(', ')}
                      onChange={(e) => setFormData({...formData, healthConditions: e.target.value.split(', ')})}
                      className="form-input h-24"
                      placeholder="Enter health conditions, separated by commas"
                    ></textarea>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.healthConditions.map((condition, index) => (
                        <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  {editMode ? (
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies.join(', ')}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value.split(', ')})}
                      className="form-input h-24"
                      placeholder="Enter allergies, separated by commas"
                    ></textarea>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy, index) => (
                        <span key={index} className="bg-error-100 text-error-700 px-3 py-1 rounded-full text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Emergency Contact */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold flex items-center">
                <UserPlus size={18} className="mr-2 text-primary-500" />
                Emergency Contact
              </h3>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      id="emergencyContact.name"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      id="emergencyContact.phone"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.phone}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      id="emergencyContact.relationship"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.relationship}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          
        </div>
        
        <div>
          {/* Insurance Information */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold flex items-center">
                <ShieldCheck size={18} className="mr-2 text-primary-500" />
                Insurance Information
              </h3>
            </div>
            
            <div className="p-5">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Provider</p>
                  <p className="font-medium">{insuranceInfo.provider}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Policy Number</p>
                  <p>{insuranceInfo.policyNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Group Number</p>
                  <p>{insuranceInfo.groupNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Coverage Type</p>
                  <p>{insuranceInfo.coverageType}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Valid Until</p>
                  <p>{new Date(insuranceInfo.validUntil).toLocaleDateString()}</p>
                </div>
              </div>
              
              {editMode && (
                <button className="btn btn-outline w-full mt-4">
                  Update Insurance
                </button>
              )}
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="card">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Account Actions</h3>
            </div>
            
            <div className="p-5">
              <ul className="space-y-2">
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Mail size={18} className="mr-3 text-gray-500" />
                    <span>Change Email</span>
                  </button>
                </li>
                
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    <ShieldCheck size={18} className="mr-3 text-gray-500" />
                    <span>Change Password</span>
                  </button>
                </li>
                
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Phone size={18} className="mr-3 text-gray-500" />
                    <span>Update Phone Number</span>
                  </button>
                </li>
                
                <li>
                  <button 
                    className="flex items-center w-full p-3 rounded-lg hover:bg-error-50 text-error-600"
                    onClick={logout}
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Log Out</span>
                  </button>
                </li>
                
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-error-50 text-error-600">
                    <AlertTriangle size={18} className="mr-3" />
                    <span>Delete Account</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;