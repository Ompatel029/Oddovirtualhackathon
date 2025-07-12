import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillSwapPlatform = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    availability: '',
    skillsOffered: [],
    skillsWanted: [],
    photo: null
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setProfileData({
        name: user.name || '',
        location: user.location || '',
        availability: user.availability || 'weekends',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        photo: user.photo || null
      });
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/users/others');

      if (!response.ok) {
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
        return;
      }

      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleRequest = (userName) => {
    alert(`Request sent to ${userName}!`);
  };

  const handleDropdownToggle = () => {
    alert('Dropdown functionality would be implemented here');
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !currentUser.id) {
      alert('User not found. Please log in again.');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/update-profile/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(result.user));
      setCurrentUser(result.user);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDiscardProfile = () => {
    // Reset profile data to original user data
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        location: currentUser.location || '',
        availability: currentUser.availability || 'weekends',
        skillsOffered: currentUser.skillsOffered || [],
        skillsWanted: currentUser.skillsWanted || [],
        photo: currentUser.photo.data || null
      });
    }
    
    setShowProfile(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkillOffered = () => {
    if (newSkillOffered.trim() && !profileData.skillsOffered.includes(newSkillOffered.trim())) {
      setProfileData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const handleAddSkillWanted = () => {
    if (newSkillWanted.trim() && !profileData.skillsWanted.includes(newSkillWanted.trim())) {
      setProfileData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const handleRemoveSkillOffered = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleRemoveSkillWanted = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(skill => skill !== skillToRemove)
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          photo: {
            data: reader.result,
            contentType: file.type
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwapRequest = () => {
    alert('Swap request functionality would be implemented here');
  };

  const handleHome = () => {
    setShowProfile(false);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(searchLower))) ||
      (user.skillsWanted && user.skillsWanted.some(skill => skill.toLowerCase().includes(searchLower)))
    );
  });

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Skill Swap Platform</div>
          <div>
            {localStorage.getItem('token') && localStorage.getItem('user') ? (
              (() => {
                const user = JSON.parse(localStorage.getItem('user'));
                return user?.photo ? (
                  <img
                    src={user.photo.data}
                    alt="User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                    onClick={handleProfileClick}
                  />
                ) : (
                  <span style={{ cursor: 'pointer' }} onClick={handleProfileClick}>👤</span>
                );
              })()
            ) : (
              <button
                onClick={() => (window.location.href = '/login')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Skill Swap Platform</div>
          <div>
            {localStorage.getItem('token') && localStorage.getItem('user') ? (
              (() => {
                const user = JSON.parse(localStorage.getItem('user'));
                return user?.photo ? (
                  <img
                    src={user.photo.data}
                    alt="User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                    onClick={handleProfileClick}
                  />
                ) : (
                  <span style={{ cursor: 'pointer' }} onClick={handleProfileClick}>👤</span>
                );
              })()
            ) : (
              <button
                onClick={() => (window.location.href = '/login')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '18px',
          color: '#e74c3c'
        }}>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Skill Swap Platform</div>
        <div>
          {localStorage.getItem('token') && localStorage.getItem('user') ? (
            (() => {
              const user = JSON.parse(localStorage.getItem('user'));
              return user?.photo ? (
                <img
                  src={user.photo.data}
                  alt="User"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                  onClick={handleProfileClick}
                />
              ) : (
                <span style={{ cursor: 'pointer' }} onClick={handleProfileClick}>👤</span>
              );
            })()
          ) : (
            <button
              onClick={() => (window.location.href = '/login')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Profile Section */}
      {showProfile ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '20px' }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #333',
            borderRadius: '15px',
            padding: '40px',
            width: '600px',
            maxWidth: '90%',
            position: 'relative'
          }}>
            {/* Profile Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              Screen 3
            </div>
            
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '18px',
              color: '#ccc'
            }}>
              User profile
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '30px',
              gap: '10px'
            }}>
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isUpdating ? '#95a5a6' : '#27ae60',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDiscardProfile}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Discard
              </button>
              <button
                onClick={handleSwapRequest}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Swap request
              </button>
              <button
                onClick={handleHome}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#95a5a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Home
              </button>
              <div style={{
                width: '40px',
                height: '30px',
                backgroundColor: '#333',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📷
              </div>
            </div>

            {/* Profile Content */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              {/* Left Side - Form Fields */}
              <div style={{ flex: 1 }}>
                {/* Name Field */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Location Field */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                   
                    placeholder="Enter your location"
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Skills Offered
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {profileData.skillsOffered.map((skill, index) => (
                      <span key={index} style={{
                        backgroundColor: '#3498db',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {skill}
                        <button
                          onClick={() => handleRemoveSkillOffered(skill)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '0',
                            marginLeft: '5px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
                      placeholder="Add new skill"
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#2a2a2a',
                        border: '1px solid #444',
                        borderRadius: '5px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <button
                      onClick={handleAddSkillOffered}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#3498db',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Availability */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Availability
                  </label>
                  <input
                    type="text"
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    placeholder="e.g., weekends, evenings"
                  />
                </div>

                {/* Profile Visibility */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Profile
                  </label>
                  <input
                    type="text"
                    value="Public"
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Right Side - Profile Photo and Skills Wanted */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Profile Photo */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  border: '2px solid #555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => document.getElementById('photoUpload').click()}
                >
                  {profileData.photo ? (
                    <img
                      src={typeof profileData.photo === 'string' ? profileData.photo : profileData.photo.data}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888' }}>
                      <div style={{ fontSize: '12px' }}>Add/Edit Photo</div>
                    </div>
                  )}
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Skills Wanted */}
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#ccc' }}>
                    Skills wanted
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                    {profileData.skillsWanted.map((skill, index) => (
                      <span key={index} style={{
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {skill}
                        <button
                          onClick={() => handleRemoveSkillWanted(skill)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '0',
                            marginLeft: '5px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
                      placeholder="Add skill wanted"
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#2a2a2a',
                        border: '1px solid #444',
                        borderRadius: '5px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <button
                      onClick={handleAddSkillWanted}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* User List Section */
        <div>
          {/* Search Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333'
          }}>
            <div>
              <button
                onClick={handleDropdownToggle}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Availability ▼
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search skills or users..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                style={{
                  padding: '10px',
                  width: '300px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleSearchSubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* User List */}
          <div style={{ padding: '20px' }}>
            {filteredUsers.map(user => (
              <div key={user._id}
              onClick={() => navigate(`/user/${user._id}`)}
               style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ color: '#888', fontSize: '12px' }}>Profile Photo</span>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {user.name}
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#ccc', marginRight: '10px' }}>Skills Offered →</span>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '5px' }}>
                      {user.skillsOffered && user.skillsOffered.length > 0 ? (
                        user.skillsOffered.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#3498db',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>No skills offered</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span style={{ color: '#ccc', marginRight: '10px' }}>Skills wanted →</span>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '5px' }}>
                      {user.skillsWanted && user.skillsWanted.length > 0 ? (
                        user.skillsWanted.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>No skills wanted</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleRequest(user.name)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#27ae60',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  >
                    Request
                  </button>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>
                    Rating: <span style={{ color: '#f39c12' }}>{renderStars(user.rating || 0)}</span> {user.rating || 0}/5
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '16px',
                padding: '40px'
              }}>
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSwapPlatform;