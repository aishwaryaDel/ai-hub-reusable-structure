# Tesa AI Hub Portal

A full-stack application for managing AI use cases with authentication, role-based access control, and multi-language support.

## Features

- User authentication with JWT tokens
- Role-based access control (Admin, Member, Viewer)
- Multi-language support (English/German)
- Use case management (create, view, update, delete)
- Responsive design with Tailwind CSS
- RESTful API with Express
- PostgreSQL database with Sequelize ORM
- Comprehensive test coverage
- Azure Application Insights integration

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Context API for state management

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- PostgreSQL
- Helmet for security
- CORS support
- Jest for testing

## Project Structure

```
project/
├── frontend/          # React frontend application
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts (Auth, Language)
│   ├── pages/         # Page components
│   ├── services/      # API client services
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles
├── backend/           # Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Sequelize models
│   │   ├── repository/    # Data access layer
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Express middlewares
│   │   └── config/        # Configuration files
│   └── migrations/    # Database migrations
└── .github/workflows/ # CI/CD pipelines

```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Run database migrations:
```bash
cd backend
npm run migrate
```

### Development

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Build the backend:
```bash
cd backend
npm run build
npm start
```

Build the frontend:
```bash
cd frontend
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Use Cases
- `GET /api/use-cases` - Get all use cases
- `POST /api/use-cases` - Create new use case
- `GET /api/use-cases/:id` - Get use case by ID
- `PUT /api/use-cases/:id` - Update use case
- `DELETE /api/use-cases/:id` - Delete use case

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## User Roles

- **Admin**: Full access to all features
- **Viewer**: Read-only access

## License

This project is proprietary software.