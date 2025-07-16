import express from 'express';
import { body, validationResult } from 'express-validator';
import MentorshipRequest from '../models/MentorshipRequest';
import User from '../models/User';
import { protect, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// @desc    Send mentorship request
// @route   POST /api/requests
// @access  Private (Mentee only)
router.post('/', protect, authorize('mentee'), [
  body('mentor').isMongoId().withMessage('Valid mentor ID is required'),
  body('message').trim().isLength({ min: 10, max: 500 }).withMessage('Message must be between 10-500 characters')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { mentor, message } = req.body;

    // Check if mentor exists and is active
    const mentorUser = await User.findById(mentor);
    if (!mentorUser || mentorUser.role !== 'mentor' || !mentorUser.isActive) {
      return res.status(404).json({ message: 'Mentor not found or inactive' });
    }

    // Check if request already exists
    const existingRequest = await MentorshipRequest.findOne({
      mentee: req.user?.id,
      mentor
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent to this mentor' });
    }

    const request = await MentorshipRequest.create({
      mentee: req.user?.id,
      mentor,
      message
    });

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('mentee', 'name email bio skills goals')
      .populate('mentor', 'name email bio skills');

    res.status(201).json(populatedRequest);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get mentorship requests (sent by mentee or received by mentor)
// @route   GET /api/requests
// @access  Private
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const { status, type } = req.query;
    let query: any = {};

    if (req.user?.role === 'mentee') {
      query.mentee = req.user.id;
    } else if (req.user?.role === 'mentor') {
      query.mentor = req.user.id;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) query.status = status;

    const requests = await MentorshipRequest.find(query)
      .populate('mentee', 'name email bio skills goals')
      .populate('mentor', 'name email bio skills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update mentorship request status
// @route   PUT /api/requests/:id
// @access  Private (Mentor only)
router.put('/:id', protect, authorize('mentor'), [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status } = req.body;

    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the mentor owns this request
    if (request.mentor.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    request.status = status;
    await request.save();

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('mentee', 'name email bio skills goals')
      .populate('mentor', 'name email bio skills');

    res.json(populatedRequest);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single mentorship request
// @route   GET /api/requests/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id)
      .populate('mentee', 'name email bio skills goals')
      .populate('mentor', 'name email bio skills');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is involved in this request
    if (request.mentee._id.toString() !== req.user?.id && 
        request.mentor._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(request);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;