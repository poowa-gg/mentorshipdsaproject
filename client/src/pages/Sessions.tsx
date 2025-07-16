import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Session {
  _id: string;
  mentor: { name: string; email: string };
  mentee: { name: string; email: string };
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedBy: string;
  };
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      await axios.put(`/api/sessions/${sessionId}/status`, { status });
      toast.success(`Session ${status} successfully`);
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update session');
    }
  };

  const submitFeedback = async () => {
    if (!selectedSession) return;

    try {
      await axios.post(`/api/sessions/${selectedSession._id}/feedback`, {
        rating,
        comment,
      });
      toast.success('Feedback submitted successfully!');
      setFeedbackDialog(false);
      setRating(5);
      setComment('');
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading sessions...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Sessions
      </Typography>

      <Grid container spacing={3}>
        {sessions.map(session => (
          <Grid item xs={12} md={6} key={session._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">
                    Session with {session.mentor.name || session.mentee.name}
                  </Typography>
                  <Chip
                    label={session.status}
                    color={getStatusColor(session.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {format(new Date(session.scheduledDate), 'PPP p')}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  Duration: {session.duration} minutes
                </Typography>

                {session.meetingLink && (
                  <Typography variant="body2" gutterBottom>
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Typography>
                )}

                {session.notes && (
                  <Typography variant="body2" gutterBottom>
                    Notes: {session.notes}
                  </Typography>
                )}

                {session.feedback && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Feedback:</Typography>
                    <Rating value={session.feedback.rating} readOnly size="small" />
                    <Typography variant="body2">{session.feedback.comment}</Typography>
                  </Box>
                )}

                <Box mt={2} display="flex" gap={1}>
                  {session.status === 'scheduled' && (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => updateSessionStatus(session._id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateSessionStatus(session._id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {session.status === 'completed' && !session.feedback && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setSelectedSession(session);
                        setFeedbackDialog(true);
                      }}
                    >
                      Add Feedback
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {sessions.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No sessions found
        </Typography>
      )}

      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Session Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue || 5)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button onClick={submitFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sessions;