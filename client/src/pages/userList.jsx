import React, { useState, useEffect } from 'react';
import './userList.css';

const SkillSwapPlatform = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
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
      <div className="container">
        <div className="header">
          <div className="logo">Skill Swap Platform</div>
          <div className="profile-avatar">
            {localStorage.getItem('token') && localStorage.getItem('user') ? (
              (() => {
                const user = JSON.parse(localStorage.getItem('user'));
                return user?.photo ? (
                  <img
                    src={user.photo}
                    alt="User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                ) : (
                  <span>👤</span>
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
      <div className="container">
        <div className="header">
          <div className="logo">Skill Swap Platform</div>
          <div className="profile-avatar">
  {localStorage.getItem('token') && localStorage.getItem('user') ? (
    (() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.photo ? (
        <img
          src={user.photo}
          alt="User"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      ) : (
        <span>👤</span>
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
    <div className="container">
      <div className="header">
        <div className="logo">Skill Swap Platform</div>
       <div className="profile-avatar">
  {localStorage.getItem('token') && localStorage.getItem('user') ? (
    (() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.photo ? (
        <img
          src={user.photo}
          alt="User"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      ) : (
        <span>👤</span>
      );
    })()
  ) : (
    <button
      onClick={() => (window.location.href = '/login')}
      style={{
        padding: '6px ',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '25px'
      }}
    >
      Login
    </button>
  )}
</div>

      </div>

      <div className="search-section">
        <div className="dropdown">
          <button className="dropdown-btn" onClick={handleDropdownToggle}>
            Availability ▼
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search skills or users..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearchSubmit}>
            Search
          </button>
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              ) : (
                'Profile Photo'
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="skills-section">
                <span className="skill-label">Skills Offered →</span>
                <div className="skills-container">
                  {user.skillsOffered && user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="skill-tag" style={{ opacity: 0.5 }}>No skills offered</span>
                  )}
                </div>
              </div>
              <div className="skills-section">
                <span className="skill-label">Skills wanted →</span>
                <div className="skills-container">
                  {user.skillsWanted && user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <span key={index} className="skill-tag wanted">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="skill-tag wanted" style={{ opacity: 0.5 }}>No skills wanted</span>
                  )}
                </div>
              </div>
            </div>
            <div className="user-actions">
              <button
                className="request-btn"
                onClick={() => handleRequest(user.name)}
              >
                Request
              </button>
              <div className="rating">
                Rating: <span className="star">{renderStars(user.rating || 0)}</span> {user.rating || 0}/5
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && !loading && (
          <div className="no-results">
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSwapPlatform;
