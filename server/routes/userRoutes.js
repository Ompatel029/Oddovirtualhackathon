const express = require('express');
const User = require('../Models/UserModel');
const router = express.Router();

// ✅ GET all users (Public)
router.get('/others', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name photo skillsWanted skillsOffered role rating')
      .lean();

    const usersWithPhotos = users.map(user => {
      let photo = null;
      if (user.photo?.data && user.photo?.contentType) {
        photo = `${user.photo.data}`;
      }
      return {
        _id: user._id,
        name: user.name,
        skillsWanted: user.skillsWanted || [],
        skillsOffered: user.skillsOffered || [],
        role: user.role,
        rating: user.rating || 0,
        photo,
        location:user.location,
        availability : user.availability
      };
    });

    res.status(200).json(usersWithPhotos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  } 
});

// GET /api/users/:id — return one user's full info
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find by ID, excluding password
    const user = await User.findById(id)
      .select('-password')  // don’t return the password hash
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert base64 photo object into string if needed
    let photo = '';
    if (user.photo?.data) {
      photo = user.photo.data; // already a data:… URI
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo,
      location: user.location,
      availability: user.availability,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      profileVisibility: user.profileVisibility,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /update-profile/:id — Update user profile
router.put('/update-profile/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    location,
    availability,
    skillsOffered,
    skillsWanted,
    photo
  } = req.body; 

  try {
    const updateData = {
      ...(name && { name }),
      ...(location && { location }),
      ...(availability && { availability }),
      ...(skillsOffered && { skillsOffered }),
      ...(skillsWanted && { skillsWanted }),
    };

    // Handle photo update
    if (photo && photo.data && photo.contentType) {
      updateData.photo = {
        data: photo.data,
        contentType: photo.contentType
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ✅ Route to get current logged-in user's full profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
});

module.exports = router;


