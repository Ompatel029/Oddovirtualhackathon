import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Star, MapPin, Clock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const SkillSwapPlatform = () => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  // Replace with actual user ID - you can get this from props, URL params, or context
  const { id: userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try { 
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
        <p>The requested user profile could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="skill-swap-container">
      <style>{`
        .skill-swap-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 90vh;
        }

        .screen {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .screen:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .screen-title {
          color: #fff;
          font-size: 1.8rem;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          font-weight: 600;
        }

        /* Screen 4 - Main Profile */
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .profile-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: 2px solid #fff;
          background: transparent;
          color: #fff;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .nav-btn:hover {
          background: #fff;
          color: #667eea;
          transform: translateY(-2px);
        }

        .nav-btn.active {
          background: #fff;
          color: #667eea;
        }

        .user-info {
          background: rgba(255, 255, 255, 0.15);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-name {
          color: #fff;
          font-size: 1.4rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .user-detail {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .user-detail svg {
          width: 16px;
          height: 16px;
          opacity: 0.8;
        }

        .skills-section {
          background: rgba(255, 255, 255, 0.15);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .skills-title {
          color: #fff;
          font-size: 1.2rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .skill-tag:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .profile-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-photo svg {
          width: 50px;
          height: 50px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Request Section */
        .request-section {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .request-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 2px solid #fff;
          color: #fff;
          padding: 15px 30px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .request-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        /* Rating Section */
        .rating-section {
          background: rgba(255, 255, 255, 0.15);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .rating-title {
          color: #fff;
          font-size: 1.2rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .star-rating {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-bottom: 15px;
        }

        .star {
          color: #ffd700;
          width: 24px;
          height: 24px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .star:hover {
          transform: scale(1.2);
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #fff;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr 2fr 1fr;
            gap: 20px;
          }
          
          .skill-swap-container {
            padding: 15px;
          }
        }

        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr 2fr 1fr;
            gap: 15px;
          }
          
          .profile-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .nav-buttons {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .skills-list {
            justify-content: center;
          }
        }
      `}</style>

      <div className="main-grid">
        {/* Left Panel - Request Button */}
        <div className="screen">
          <h2 className="screen-title">Profile</h2>
          <div className="request-section">
            <button className="request-btn">
              Request
            </button>
          </div>
        </div>

        {/* Screen 4 - Main Profile */}
        <div className="screen">
          <div className="profile-header">
            <h1 className="profile-title">Skill Swap Platform</h1>
            <div className="nav-buttons">
              <button className="nav-btn active">Swap request</button>
              <button
  className="nav-btn"
  onClick={() => navigate('/userlist')}
>
  Home
</button>

            </div>
          </div>

          <div className="user-info">
            <h2 className="user-name">{userData.name}</h2>
            <div className="user-detail">
              <Mail size={16} />
              <span>{userData.email}</span>
            </div>
            <div className="user-detail">
              <MapPin size={16} />
              <span>{userData.location}</span>
            </div>
            <div className="user-detail">
              <Clock size={16} />
              <span>{userData.availability}</span>
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-title">Skills Offered</h3>
            <div className="skills-list">
              {userData.skillsOffered.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-title">Skills Wanted</h3>
            <div className="skills-list">
              {userData.skillsWanted.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="rating-section">
            <h3 className="rating-title">Rating and Feedback</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="star" fill="currentColor" />
              ))}
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Excellent collaboration partner!
            </p>
          </div>
        </div>

        {/* Profile Photo Section */}
        <div className="screen">
          <div className="profile-photo">
            {userData.photo && userData.photo.startsWith('data:') ? (
              <img src={userData.photo} alt={userData.name} />
            ) : (
              <User size={50} />
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>{userData.name}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Member since {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSwapPlatform;