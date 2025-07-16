import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  People,
  Event,
  Message,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalRequests?: number;
  pendingRequests?: number;
  upcomingSessions?: number;
  completedSessions?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch requests
      const requestsResponse = await axios.get('/api/requests');
      const requests = requestsResponse.data;
      
      // Fetch sessions
      const sessionsResponse = await axios.get('/api/sessions');
      const sessions = sessionsResponse.data;

      const dashboardStats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r: any) => r.status === 'pending').length,
        upcomingSessions: sessions.filter((s: any) => 
          s.status === 'scheduled' && new Date(s.scheduledDate) >= new Date()
        ).length,
        completedSessions: sessions.filter((s: any) => s.status === 'completed').length,
      };

      setStats(dashboardStats);
      
      // Set recent activity (recent requests and sessions)
      const recentRequests = requests.slice(0, 3).map((r: any) => ({
        type: 'request',
        ...r
      }));
      const recentSessions = sessions.slice(0, 3).map((s: any) => ({
        type: 'session',
        ...s
      }));
      
      setRecentActivity([...recentRequests, ...recentSessions].slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value || 0}
            </Typography>
          </Box>
          <Box color={color}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={<Message />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<People />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            icon={<Event />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Sessions"
            value={stats.completedSessions}
            icon={<TrendingUp />}
            color="success.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {user?.role === 'mentee' && (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/mentors')}
                    fullWidth
                  >
                    Find Mentors
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => navigate('/sessions')}
                  fullWidth
                >
                  View Sessions
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/requests')}
                  fullWidth
                >
                  Manage Requests
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  fullWidth
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {recentActivity.length > 0 ? (
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          activity.type === 'request'
                            ? `Mentorship request ${activity.status}`
                            : `Session ${activity.status}`
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {activity.type === 'request'
                                ? `${user?.role === 'mentee' ? 'To' : 'From'}: ${
                                    user?.role === 'mentee' 
                                      ? activity.mentor?.name 
                                      : activity.mentee?.name
                                  }`
                                : `With: ${
                                    user?.role === 'mentee' 
                                      ? activity.mentor?.name 
                                      : activity.mentee?.name
                                  }`
                              }
                            </Typography>
                            <Chip
                              label={activity.status}
                              size="small"
                              color={
                                activity.status === 'accepted' || activity.status === 'completed'
                                  ? 'success'
                                  : activity.status === 'pending' || activity.status === 'scheduled'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;