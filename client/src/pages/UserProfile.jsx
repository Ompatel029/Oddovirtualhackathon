import React, { useEffect, useState } from 'react';
import './userProfile.css';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: '',
    profileVisibility: 'Public',
    photo: null,
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || '',
        profileVisibility: user.profileVisibility || 'Public',
        photo: user.photo || null,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleAddSkill = (type) => {
    if (type === 'offered' && newSkillOffered.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }));
      setNewSkillOffered('');
    }
    if (type === 'wanted' && newSkillWanted.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }));
      setNewSkillWanted('');
    }
  };

  const handleRemoveSkill = (type, index) => {
    const updatedSkills = [...formData[type]];
    updatedSkills.splice(index, 1);
    setFormData(prev => ({ ...prev, [type]: updatedSkills }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="discard-btn" onClick={() => window.location.reload()}>Discard</button>
          <div className="nav-links">
            <span onClick={() => window.location.href='/swap-requests'}>Swap request</span>
            <span onClick={() => window.location.href='/'}>Home</span>
          </div>
        </div>

        <div className="profile-body">
          <div className="left-section">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />

            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />

            <label>Skills Offered</label>
            <div className="skill-tags">
              {formData.skillsOffered.map((skill, i) => (
                <span key={i} className="tag">{skill} <button onClick={() => handleRemoveSkill('skillsOffered', i)}>×</button></span>
              ))}
              <input value={newSkillOffered} onChange={(e) => setNewSkillOffered(e.target.value)} placeholder="Add" onKeyDown={e => e.key === 'Enter' && handleAddSkill('offered')} />
            </div>

            <label>Availability</label>
            <input type="text" name="availability" value={formData.availability} onChange={handleChange} />

            <label>Profile</label>
            <select name="profileVisibility" value={formData.profileVisibility} onChange={handleChange}>
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>

          <div className="right-section">
            <div className="photo-circle">
              {formData.photo ? (
                <>
                  <img src={formData.photo} alt="profile" />
                  <span className="remove" onClick={handleRemovePhoto}>Remove</span>
                </>
              ) : (
                <label htmlFor="photoUpload" className="photo-placeholder">Add/Edit</label>
              )}
              <input id="photoUpload" type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            </div>

            <label>Skills Wanted</label>
            <div className="skill-tags">
              {formData.skillsWanted.map((skill, i) => (
                <span key={i} className="tag">{skill} <button onClick={() => handleRemoveSkill('skillsWanted', i)}>×</button></span>
              ))}
              <input value={newSkillWanted} onChange={(e) => setNewSkillWanted(e.target.value)} placeholder="Add" onKeyDown={e => e.key === 'Enter' && handleAddSkill('wanted')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
