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
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface MentorshipRequest {
  _id: string;
  mentor: { name: string; email: string; bio: string; skills: string[] };
  mentee: { name: string; email: string; bio: string; skills: string[]; goals: string[] };
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const Requests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await axios.put(`/api/requests/${requestId}`, { status });
      toast.success(`Request ${status} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading requests...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {user?.role === 'mentor' ? 'Mentorship Requests' : 'My Requests'}
      </Typography>

      <Grid container spacing={3}>
        {requests.map(request => (
          <Grid item xs={12} md={6} key={request._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">
                    {user?.role === 'mentor' 
                      ? `From: ${request.mentee.name}`
                      : `To: ${request.mentor.name}`
                    }
                  </Typography>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {format(new Date(request.createdAt), 'PPP')}
                </Typography>

                <Typography variant="body1" paragraph>
                  {request.message}
                </Typography>

                {user?.role === 'mentor' && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Mentee's Goals:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {request.mentee.goals?.map(goal => (
                        <Chip key={goal} label={goal} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    {user?.role === 'mentor' ? "Mentee's" : "Mentor's"} Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(user?.role === 'mentor' ? request.mentee.skills : request.mentor.skills)
                      ?.map(skill => (
                        <Chip key={skill} label={skill} size="small" />
                      ))}
                  </Box>
                </Box>

                {user?.role === 'mentor' && request.status === 'pending' && (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateRequestStatus(request._id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => updateRequestStatus(request._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {requests.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No requests found
        </Typography>
      )}
    </Container>
  );
};

export default Requests;