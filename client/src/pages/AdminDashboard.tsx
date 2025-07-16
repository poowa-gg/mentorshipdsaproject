import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, requestsRes, sessionsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/requests'),
        axios.get('/api/admin/sessions'),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setRequests(requestsRes.data.requests);
      setSessions(sessionsRes.data.sessions);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role });
      toast.success(`User role updated to ${role}`);
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const StatCard = ({ title, value, color }: any) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" style={{ color }}>
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Typography>Loading admin dashboard...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Users" value={stats.totalUsers} color="#1976d2" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Mentors" value={stats.totalMentors} color="#2e7d32" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Mentees" value={stats.totalMentees} color="#ed6c02" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Sessions" value={stats.totalSessions} color="#9c27b0" />
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Users" />
          <Tab label="Requests" />
          <Tab label="Sessions" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      color={user.isActive ? 'error' : 'success'}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mentee</TableCell>
                <TableCell>Mentor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.mentee?.name}</TableCell>
                  <TableCell>{request.mentor?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'accepted' ? 'success' :
                        request.status === 'pending' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mentor</TableCell>
                <TableCell>Mentee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>{session.mentor?.name}</TableCell>
                  <TableCell>{session.mentee?.name}</TableCell>
                  <TableCell>
                    {new Date(session.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={session.status}
                      color={
                        session.status === 'completed' ? 'success' :
                        session.status === 'scheduled' ? 'primary' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {session.feedback ? `${session.feedback.rating}/5` : 'No feedback'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminDashboard;