import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import MentorshipRequest from '../models/MentorshipRequest';
import Session from '../models/Session';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorship-platform');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  // Clear existing data
  await User.deleteMany({});
  await MentorshipRequest.deleteMany({});
  await Session.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create 2 Admin profiles
  const admins = [
    {
      name: 'Admin User 1',
      email: 'admin1@mentorship.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform administrator with extensive experience in managing mentorship programs.',
      skills: ['Management', 'Leadership', 'Program Development'],
      isActive: true
    },
    {
      name: 'Admin User 2', 
      email: 'admin2@mentorship.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Senior administrator focused on user experience and platform optimization.',
      skills: ['User Experience', 'Analytics', 'Strategy'],
      isActive: true
    }
  ];

  // Create 10 Mentor profiles
  const mentors = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Senior Software Engineer with 8+ years experience in full-stack development. Passionate about helping junior developers grow their careers.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'System Design'],
      availability: [
        { day: 'Monday', startTime: '18:00', endTime: '20:00' },
        { day: 'Wednesday', startTime: '19:00', endTime: '21:00' }
      ],
      isActive: true
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@mentor.com', 
      password: hashedPassword,
      role: 'mentor',
      bio: 'Product Manager at a Fortune 500 company. Expert in product strategy, user research, and agile methodologies.',
      skills: ['Product Management', 'User Research', 'Agile', 'Strategy', 'Analytics'],
      availability: [
        { day: 'Tuesday', startTime: '17:00', endTime: '19:00' },
        { day: 'Thursday', startTime: '18:00', endTime: '20:00' }
      ],
      isActive: true
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@mentor.com',
      password: hashedPassword,
      role: 'mentor', 
      bio: 'UX/UI Designer with expertise in design thinking, prototyping, and user-centered design principles.',
      skills: ['UI/UX Design', 'Figma', 'Design Thinking', 'Prototyping', 'User Testing'],
      availability: [
        { day: 'Monday', startTime: '16:00', endTime: '18:00' },
        { day: 'Friday', startTime: '15:00', endTime: '17:00' }
      ],
      isActive: true
    },
    {
      name: 'David Kim',
      email: 'david.kim@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Data Scientist and Machine Learning Engineer. Specializes in AI/ML applications and data analytics.',
      skills: ['Machine Learning', 'Python', 'Data Science', 'TensorFlow', 'Statistics'],
      availability: [
        { day: 'Wednesday', startTime: '17:00', endTime: '19:00' },
        { day: 'Saturday', startTime: '10:00', endTime: '12:00' }
      ],
      isActive: true
    },
    {
      name: 'Lisa Thompson',
      email: 'lisa.thompson@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Marketing Director with 10+ years in digital marketing, brand strategy, and growth hacking.',
      skills: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking', 'SEO', 'Content Marketing'],
      availability: [
        { day: 'Tuesday', startTime: '19:00', endTime: '21:00' },
        { day: 'Thursday', startTime: '17:00', endTime: '19:00' }
      ],
      isActive: true
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Cybersecurity expert and consultant. Helps organizations build secure systems and practices.',
      skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'Risk Assessment', 'Compliance'],
      availability: [
        { day: 'Monday', startTime: '20:00', endTime: '22:00' },
        { day: 'Wednesday', startTime: '18:00', endTime: '20:00' }
      ],
      isActive: true
    },
    {
      name: 'Maria Garcia',
      email: 'maria.garcia@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Business Development Manager specializing in startup growth, partnerships, and sales strategy.',
      skills: ['Business Development', 'Sales Strategy', 'Partnerships', 'Startup Growth', 'Negotiation'],
      availability: [
        { day: 'Friday', startTime: '17:00', endTime: '19:00' },
        { day: 'Sunday', startTime: '14:00', endTime: '16:00' }
      ],
      isActive: true
    },
    {
      name: 'Robert Brown',
      email: 'robert.brown@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'DevOps Engineer with expertise in cloud infrastructure, CI/CD, and containerization technologies.',
      skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure'],
      availability: [
        { day: 'Tuesday', startTime: '18:00', endTime: '20:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '11:00' }
      ],
      isActive: true
    },
    {
      name: 'Jennifer Lee',
      email: 'jennifer.lee@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'HR Director with focus on talent acquisition, employee development, and organizational culture.',
      skills: ['Human Resources', 'Talent Acquisition', 'Employee Development', 'Leadership', 'Culture'],
      availability: [
        { day: 'Thursday', startTime: '16:00', endTime: '18:00' },
        { day: 'Friday', startTime: '18:00', endTime: '20:00' }
      ],
      isActive: true
    },
    {
      name: 'Alex Turner',
      email: 'alex.turner@mentor.com',
      password: hashedPassword,
      role: 'mentor',
      bio: 'Financial Analyst and Investment Advisor. Helps individuals and startups with financial planning and investment strategies.',
      skills: ['Financial Analysis', 'Investment Strategy', 'Financial Planning', 'Accounting', 'Risk Management'],
      availability: [
        { day: 'Monday', startTime: '17:00', endTime: '19:00' },
        { day: 'Wednesday', startTime: '16:00', endTime: '18:00' }
      ],
      isActive: true
    }
  ];

  // Create 10 Mentee profiles
  const mentees = [
    {
      name: 'John Smith',
      email: 'john.smith@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Computer Science student looking to break into software development. Eager to learn best practices and industry standards.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Git'],
      goals: ['Learn React', 'Build portfolio projects', 'Get first developer job', 'Master algorithms'],
      isActive: true
    },
    {
      name: 'Anna Davis',
      email: 'anna.davis@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Recent graduate transitioning from marketing to product management. Looking for guidance on product strategy.',
      skills: ['Marketing', 'Analytics', 'Communication', 'Research'],
      goals: ['Learn product management', 'Understand user research', 'Build product roadmaps', 'Network in tech'],
      isActive: true
    },
    {
      name: 'Carlos Martinez',
      email: 'carlos.martinez@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Aspiring UX designer with a background in graphic design. Want to learn user-centered design principles.',
      skills: ['Graphic Design', 'Adobe Creative Suite', 'Typography', 'Branding'],
      goals: ['Learn UX research', 'Master Figma', 'Build UX portfolio', 'Understand design systems'],
      isActive: true
    },
    {
      name: 'Sophie Wang',
      email: 'sophie.wang@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Data enthusiast looking to transition into data science. Have basic Python knowledge and want to learn ML.',
      skills: ['Python', 'SQL', 'Excel', 'Statistics'],
      goals: ['Learn machine learning', 'Master pandas and numpy', 'Build data projects', 'Get data science job'],
      isActive: true
    },
    {
      name: 'Ryan O\'Connor',
      email: 'ryan.oconnor@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Small business owner looking to scale through digital marketing and online presence.',
      skills: ['Business Operations', 'Customer Service', 'Basic Marketing', 'Social Media'],
      goals: ['Learn digital marketing', 'Improve SEO', 'Build marketing funnels', 'Grow online presence'],
      isActive: true
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'IT professional interested in cybersecurity. Want to learn about security best practices and certifications.',
      skills: ['Network Administration', 'Windows Server', 'Basic Security', 'Troubleshooting'],
      goals: ['Learn cybersecurity', 'Get security certifications', 'Understand penetration testing', 'Career transition'],
      isActive: true
    },
    {
      name: 'Tom Anderson',
      email: 'tom.anderson@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Startup founder looking for guidance on business development, fundraising, and scaling strategies.',
      skills: ['Entrepreneurship', 'Leadership', 'Product Development', 'Team Management'],
      goals: ['Learn fundraising', 'Improve sales strategy', 'Scale business operations', 'Build partnerships'],
      isActive: true
    },
    {
      name: 'Maya Johnson',
      email: 'maya.johnson@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Junior developer wanting to learn DevOps practices and cloud technologies for better deployment workflows.',
      skills: ['JavaScript', 'Node.js', 'Git', 'Basic Linux'],
      goals: ['Learn AWS', 'Master Docker', 'Understand CI/CD', 'Improve deployment skills'],
      isActive: true
    },
    {
      name: 'Kevin Liu',
      email: 'kevin.liu@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Recent MBA graduate looking to transition into HR leadership role. Interested in talent management.',
      skills: ['Business Analysis', 'Project Management', 'Communication', 'Leadership'],
      goals: ['Learn HR best practices', 'Understand talent acquisition', 'Develop leadership skills', 'Build HR network'],
      isActive: true
    },
    {
      name: 'Rachel Green',
      email: 'rachel.green@mentee.com',
      password: hashedPassword,
      role: 'mentee',
      bio: 'Finance professional looking to learn about investment strategies and financial planning for career growth.',
      skills: ['Accounting', 'Financial Modeling', 'Excel', 'Analysis'],
      goals: ['Learn investment analysis', 'Understand portfolio management', 'Get CFA certification', 'Career advancement'],
      isActive: true
    }
  ];

  // Insert all users
  const createdAdmins = await User.insertMany(admins);
  const createdMentors = await User.insertMany(mentors);
  const createdMentees = await User.insertMany(mentees);

  console.log(`Created ${createdAdmins.length} admins`);
  console.log(`Created ${createdMentors.length} mentors`);
  console.log(`Created ${createdMentees.length} mentees`);

  // Create some sample mentorship requests
  const sampleRequests = [
    {
      mentee: createdMentees[0]._id, // John Smith
      mentor: createdMentors[0]._id, // Sarah Johnson
      message: 'Hi Sarah! I\'m a CS student looking to learn React and build my first portfolio project. Your experience in full-stack development would be incredibly valuable for my career growth.',
      status: 'accepted'
    },
    {
      mentee: createdMentees[1]._id, // Anna Davis
      mentor: createdMentors[1]._id, // Michael Chen
      message: 'Hello Michael! I\'m transitioning from marketing to product management and would love to learn about product strategy and user research from your experience.',
      status: 'pending'
    },
    {
      mentee: createdMentees[2]._id, // Carlos Martinez
      mentor: createdMentors[2]._id, // Emily Rodriguez
      message: 'Hi Emily! I\'m a graphic designer wanting to transition to UX. I\'d love to learn about design thinking and user-centered design from you.',
      status: 'accepted'
    },
    {
      mentee: createdMentees[3]._id, // Sophie Wang
      mentor: createdMentors[3]._id, // David Kim
      message: 'Hello David! I have basic Python skills and want to transition into data science. Your ML expertise would be perfect for my learning journey.',
      status: 'pending'
    },
    {
      mentee: createdMentees[4]._id, // Ryan O'Connor
      mentor: createdMentors[4]._id, // Lisa Thompson
      message: 'Hi Lisa! I own a small business and need help with digital marketing strategy to scale online. Your growth hacking experience would be invaluable.',
      status: 'accepted'
    }
  ];

  const createdRequests = await MentorshipRequest.insertMany(sampleRequests);
  console.log(`Created ${createdRequests.length} mentorship requests`);

  // Create some sample sessions for accepted requests
  const sampleSessions = [
    {
      mentor: createdMentors[0]._id, // Sarah Johnson
      mentee: createdMentees[0]._id, // John Smith
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      duration: 60,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      mentor: createdMentors[2]._id, // Emily Rodriguez
      mentee: createdMentees[2]._id, // Carlos Martinez
      scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      duration: 90,
      status: 'completed',
      meetingLink: 'https://zoom.us/j/123456789',
      feedback: {
        rating: 5,
        comment: 'Excellent session! Emily provided great insights into UX research methods and helped me understand user personas better.',
        submittedBy: createdMentees[2]._id,
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    },
    {
      mentor: createdMentors[4]._id, // Lisa Thompson
      mentee: createdMentees[4]._id, // Ryan O'Connor
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 75,
      status: 'scheduled',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/xyz'
    }
  ];

  const createdSessions = await Session.insertMany(sampleSessions);
  console.log(`Created ${createdSessions.length} sessions`);

  console.log('\n=== SEED DATA SUMMARY ===');
  console.log('Login credentials for testing:');
  console.log('\nADMIN ACCOUNTS:');
  console.log('1. Email: admin1@mentorship.com | Password: password123');
  console.log('2. Email: admin2@mentorship.com | Password: password123');
  
  console.log('\nMENTOR ACCOUNTS:');
  console.log('1. Email: sarah.johnson@mentor.com | Password: password123');
  console.log('2. Email: michael.chen@mentor.com | Password: password123');
  
  console.log('\nMENTEE ACCOUNTS:');
  console.log('1. Email: john.smith@mentee.com | Password: password123');
  console.log('2. Email: anna.davis@mentee.com | Password: password123');
  
  console.log('\nAll users have the same password: password123');
  console.log('Database seeded successfully!');
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedUsers();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();