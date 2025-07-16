# Mentorship Platform

A full-stack web application built with TypeScript, React, and Node.js that connects mentors with mentees in an incubator or accelerator program.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **User Profiles**: Comprehensive profiles with skills, goals, and availability
- **Mentor Discovery**: Browse and filter mentors by skills and expertise
- **Mentorship Requests**: Send, accept, and reject mentorship requests
- **Session Booking**: Schedule and manage mentoring sessions
- **Session Feedback**: Rate and review completed sessions
- **Admin Dashboard**: Comprehensive admin panel for user and platform management

### User Roles
- **Mentees**: Browse mentors, send requests, book sessions
- **Mentors**: Set availability, manage requests, conduct sessions
- **Admins**: Manage users, oversee matches, view analytics

## 🛠 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Jest** for testing

### Frontend
- **React** with **TypeScript**
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Query** for state management
- **Axios** for API calls
- **React Hook Form** for form handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mentorship-platform
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentorship-platform
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
CLIENT_URL=http://localhost:3000
```

### 5. Database Setup
Start MongoDB and run the seed script to populate with test data:
```bash
npm run seed
```

### 6. Start the Application
```bash
# Development mode (runs both backend and frontend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📊 Test Data & Login Credentials

The seed script creates test accounts with the following credentials:

### Admin Accounts
- **Email**: admin1@mentorship.com | **Password**: password123
- **Email**: admin2@mentorship.com | **Password**: password123

### Mentor Accounts
- **Email**: sarah.johnson@mentor.com | **Password**: password123
- **Email**: michael.chen@mentor.com | **Password**: password123

### Mentee Accounts
- **Email**: john.smith@mentee.com | **Password**: password123
- **Email**: anna.davis@mentee.com | **Password**: password123

*All test accounts use the same password: `password123`*

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Build the TypeScript code:
   ```bash
   npm run build:server
   ```
2. Set environment variables on your hosting platform
3. Deploy the `dist` folder and `package.json`

### Frontend Deployment (Vercel/Netlify)
1. Build the React app:
   ```bash
   cd client && npm run build
   ```
2. Deploy the `client/build` folder

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in your environment variables
3. Run the seed script on production: `npm run seed`

## 📁 Project Structure

```
mentorship-platform/
├── src/                    # Backend source code
│   ├── middleware/         # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts (seeding)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── server.ts          # Express server setup
├── client/                # React frontend
│   ├── public/            # Static assets
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── pages/         # Page components
│       └── App.tsx        # Main App component
├── dist/                  # Compiled TypeScript (generated)
├── coverage/              # Test coverage reports (generated)
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/mentors` - Get all mentors
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile

### Mentorship Requests
- `POST /api/requests` - Send mentorship request
- `GET /api/requests` - Get user's requests
- `PUT /api/requests/:id` - Update request status

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions` - Get user's sessions
- `PUT /api/sessions/:id/status` - Update session status
- `POST /api/sessions/:id/feedback` - Add session feedback

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/role` - Update user role

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Rate limiting
- CORS protection
- Helmet security headers

## 🧪 Testing Coverage

The project includes comprehensive tests for:
- Authentication endpoints
- User management
- Request handling
- Session management
- Admin functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using TypeScript, React, and Node.js**
