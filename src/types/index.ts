import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'mentee' | 'mentor' | 'admin';
  bio?: string;
  skills: string[];
  goals?: string[];
  availability?: IAvailability[];
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IMentorshipRequest extends Document {
  _id: string;
  mentee: string | IUser;
  mentor: string | IUser;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends Document {
  _id: string;
  mentor: string | IUser;
  mentee: string | IUser;
  scheduledDate: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  feedback?: IFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeedback {
  rating: number; // 1-5
  comment: string;
  submittedBy: string;
  submittedAt: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    role: string;
  };
}