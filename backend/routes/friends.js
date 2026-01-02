const express = require('express');
const Friend = require('../model/Friend');
const User = require('../model/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Send friend request
router.post('/request', auth, async (req, res) => {
  try {
    const { username } = req.body;
    const requesterId = req.user.id;

    // Validate input
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Valid username is required' });
    }

    const trimmedUsername = username.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    // Find recipient by username
    const recipient = await User.findOne({ username: trimmedUsername });

    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to add self
    if (recipient._id.toString() === requesterId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // Check if already friends or request exists
    const existingRelation = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipient._id },
        { requester: recipient._id, recipient: requesterId }
      ]
    });

    if (existingRelation) {
      if (existingRelation.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already pending' });
      }
      if (existingRelation.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends with this user' });
      }
    }

    // Create and save friend request
    const friendRequest = new Friend({
      requester: requesterId,
      recipient: recipient._id,
      status: 'pending',
      createdAt: new Date()
    });

    await friendRequest.save();

    console.log(`Friend request sent from ${requesterId} to ${recipient._id}`);

    res.status(201).json({ 
      success: true,
      message: `Friend request sent to ${recipient.username}`,
      friendRequest 
    });

  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send friend request',
      error: error.message 
    });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    console.log('Getting requests for user:', req.user.id);
    
    const requests = await Friend.find({ 
      recipient: req.user.id, 
      status: 'pending' 
    })
    .populate({
      path: 'requester',
      select: 'username -_id'
    })
    .sort({ createdAt: -1 })
    .lean();
    
    console.log('Found requests:', requests.length);
    
    if (!requests || requests.length === 0) {
      return res.json([]);
    }
    
    res.status(200).json({ 
      success: true,
      count: requests.length,
      data: requests 
    });
    
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch friend requests',
      error: error.message 
    });
  }
});

// Accept/decline friend request
router.put('/request/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Friend.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { status },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Handle request error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: 'accepted'
    }).populate('requester recipient', 'username');
    
    const friendsList = friends.map(f => 
      f.requester._id.toString() === req.user.id ? f.recipient : f.requester
    );
    
    res.json(friendsList);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
