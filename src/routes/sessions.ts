import express from 'express';
import { body, validationResult } from 'express-validator';
import Session from '../models/Session';
import MentorshipRequest from '../models/MentorshipRequest';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private (Mentee only)
router.post('/', protect, [
  body('mentor').isMongoId().withMessage('Valid mentor ID is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15-180 minutes')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { mentor, scheduledDate, duration, meetingLink } = req.body;

    // Check if there's an accepted mentorship request
    const acceptedRequest = await MentorshipRequest.findOne({
      mentee: req.user?.id,
      mentor,
      status: 'accepted'
    });

    if (!acceptedRequest) {
      return res.status(400).json({ 
        message: 'No accepted mentorship request found with this mentor' 
      });
    }

    // Check if the scheduled date is in the future
    if (new Date(scheduledDate) <= new Date()) {
      return res.status(400).json({ message: 'Scheduled date must be in the future' });
    }

    const session = await Session.create({
      mentor,
      mentee: req.user?.id,
      scheduledDate,
      duration,
      meetingLink
    });

    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(201).json(populatedSession);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get sessions
// @route   GET /api/sessions
// @access  Private
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const { status, upcoming } = req.query;
    let query: any = {};

    // Filter by user role
    if (req.user?.role === 'mentee') {
      query.mentee = req.user.id;
    } else if (req.user?.role === 'mentor') {
      query.mentor = req.user.id;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) query.status = status;
    
    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const sessions = await Session.find(query)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email')
      .sort({ scheduledDate: 1 });

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update session status
// @route   PUT /api/sessions/:id/status
// @access  Private
router.put('/:id/status', protect, [
  body('status').isIn(['completed', 'cancelled']).withMessage('Status must be completed or cancelled')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, notes } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is involved in this session
    if (session.mentor.toString() !== req.user?.id && 
        session.mentee.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    session.status = status;
    if (notes) session.notes = notes;
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.json(populatedSession);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Add feedback to session
// @route   POST /api/sessions/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { rating, comment } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is involved in this session
    if (session.mentor.toString() !== req.user?.id && 
        session.mentee.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only add feedback to completed sessions' });
    }

    // Check if feedback already exists
    if (session.feedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this session' });
    }

    session.feedback = {
      rating,
      comment: comment || '',
      submittedBy: req.user?.id!,
      submittedAt: new Date()
    };

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email')
      .populate('feedback.submittedBy', 'name');

    res.json(populatedSession);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email')
      .populate('feedback.submittedBy', 'name');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is involved in this session
    if (session.mentor._id.toString() !== req.user?.id && 
        session.mentee._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;