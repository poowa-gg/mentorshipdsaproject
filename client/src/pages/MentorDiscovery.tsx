import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Mentor {
  _id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
}

const MentorDiscovery: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, selectedSkills]);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('/api/users/mentors');
      setMentors(response.data);
      
      // Extract all unique skills
      const skills = new Set<string>();
      response.data.forEach((mentor: Mentor) => {
        mentor.skills.forEach(skill => skills.add(skill));
      });
      setAllSkills(Array.from(skills));
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedSkills.some(skill => mentor.skills.includes(skill))
      );
    }

    setFilteredMentors(filtered);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSendRequest = async () => {
    if (!selectedMentor || !requestMessage.trim()) {
      toast.error('Please provide a message for your request');
      return;
    }

    try {
      await axios.post('/api/requests', {
        mentor: selectedMentor._id,
        message: requestMessage,
      });
      toast.success('Mentorship request sent successfully!');
      setDialogOpen(false);
      setRequestMessage('');
      setSelectedMentor(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const openRequestDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setDialogOpen(true);
  };

  if (loading) {
    return <Typography>Loading mentors...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Find Mentors
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search mentors by name or bio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" gutterBottom>
          Filter by Skills:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {allSkills.map(skill => (
            <Chip
              key={skill}
              label={skill}
              clickable
              color={selectedSkills.includes(skill) ? 'primary' : 'default'}
              onClick={() => handleSkillToggle(skill)}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredMentors.map(mentor => (
          <Grid item xs={12} md={6} lg={4} key={mentor._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {mentor.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {mentor.bio || 'No bio available'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {mentor.skills.map(skill => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => openRequestDialog(mentor)}
                >
                  Send Request
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMentors.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No mentors found matching your criteria
        </Typography>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Mentorship Request to {selectedMentor?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendRequest} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MentorDiscovery;