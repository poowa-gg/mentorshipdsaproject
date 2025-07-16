import mongoose, { Schema } from 'mongoose';
import { IMentorshipRequest } from '../types';

const mentorshipRequestSchema = new Schema<IMentorshipRequest>({
  mentee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Prevent duplicate requests
mentorshipRequestSchema.index({ mentee: 1, mentor: 1 }, { unique: true });

export default mongoose.model<IMentorshipRequest>('MentorshipRequest', mentorshipRequestSchema);