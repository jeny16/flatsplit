const Flat = require('../models/Flat');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create a new flat
// @route   POST /api/flats
// @access  Private
exports.createFlat = async (req, res) => {
  try {
    const { name, rentAmount, rentDueDay } = req.body;

    // Generate unique invite code
    const inviteCode = `FLAT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const flat = await Flat.create({
      name,
      admin: req.user.id,
      inviteCode,
      members: [req.user.id],
      rentAmount,
      rentDueDay
    });

    // Update user's flat reference
    await User.findByIdAndUpdate(req.user.id, { flat: flat._id, role: 'Admin' });

    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Join a flat via invite code
// @route   POST /api/flats/join
// @access  Private
exports.joinFlat = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const flat = await Flat.findOne({ inviteCode });

    if (!flat) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Check if user already in flat
    if (flat.members.includes(req.user.id)) {
      return res.status(200).json({ success: true, data: flat });
    }

    // Add user to flat
    flat.members.push(req.user.id);
    await flat.save();

    // Update user's flat reference
    await User.findByIdAndUpdate(req.user.id, { flat: flat._id });

    res.status(200).json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current flat details
// @route   GET /api/flats/me
// @access  Private
exports.getFlatDetails = async (req, res) => {
  try {
    if (!req.user.flat) {
      return res.status(400).json({ message: 'User is not associated with any flat' });
    }

    const flat = await Flat.findById(req.user.flat).populate('members', 'name email avatar role');

    res.status(200).json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
