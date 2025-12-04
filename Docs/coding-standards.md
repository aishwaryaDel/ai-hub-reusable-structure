# Coding Standards

This document outlines the coding standards and best practices for the Tesa AI Hub application.

## Table of Contents

- [General Principles](#general-principles)
- [Frontend Standards](#frontend-standards)
- [Backend Standards](#backend-standards)
- [Naming Conventions](#naming-conventions)
- [Folder Structure](#folder-structure)
- [Error Handling](#error-handling)
- [Testing Standards](#testing-standards)
- [Code Review Guidelines](#code-review-guidelines)

---

## General Principles

### Code Quality

- **DRY (Don't Repeat Yourself)**: Avoid code duplication. Extract common logic into reusable functions or components.
- **SOLID Principles**: Follow SOLID principles for object-oriented design.
- **KISS (Keep It Simple, Stupid)**: Write simple, readable code. Avoid over-engineering.
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's needed.

### Code Style

- Use **TypeScript** for all new code to ensure type safety.
- Follow **ESLint** configuration for consistent code formatting.
- Use **Prettier** for automatic code formatting.
- Maximum line length: **120 characters**.
- Use **2 spaces** for indentation (not tabs).

### Comments and Documentation

- Write self-documenting code with clear variable and function names.
- Add comments only when the code intent is not immediately clear.
- Document complex algorithms and business logic.
- Keep comments up-to-date with code changes.
- Use JSDoc for function documentation when needed.

---

## Frontend Standards

### Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

### Component Structure

#### File Organization

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components (routes)
├── contexts/         # React Context providers
├── services/         # API service layer
├── types/            # TypeScript type definitions
├── constants/        # Application constants
├── config/           # Configuration files
├── routes/           # Route definitions
└── styles/           # Global styles
```

#### Component Naming

- Use **PascalCase** for component files: `LoginModal.tsx`, `UseCaseCard.tsx`
- Use **camelCase** for utility files: `apiClient.ts`, `authApi.ts`
- Component files should export a default component with the same name as the file

#### Component Guidelines

```typescript
// Good: Functional component with proper typing
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // Component logic
  return (
    // JSX
  );
}
```

- Use **functional components** with hooks (no class components)
- Define prop types using TypeScript interfaces
- Export default for the main component
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks

### State Management

- Use **useState** for local component state
- Use **useEffect** for side effects
- Use **Context API** for global state (auth, language, theme)
- Avoid prop drilling - use context when passing data through multiple levels

### Styling Guidelines

- Use **Tailwind CSS** utility classes for styling
- Follow mobile-first responsive design
- Use consistent color scheme from Tailwind config
- Avoid inline styles unless absolutely necessary
- Keep class names organized and readable

```typescript
// Good: Organized Tailwind classes
<button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
  Submit
</button>
```

### API Integration

- All API calls should go through the **apiClient** service
- Use async/await for asynchronous operations
- Handle errors gracefully with try-catch blocks
- Show user-friendly error messages

```typescript
// Good: API call with error handling
try {
  const data = await authApi.login({ email, password });
  onLoginSuccess(data.token, data.user);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Login failed');
}
```

---

## Backend Standards

### Technology Stack

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Custom validation service
- **API Documentation**: Swagger/OpenAPI

### Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and messages
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/          # Sequelize models
│   ├── repository/      # Data access layer
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── migrations/          # Database migrations
└── __tests__/          # Test files
```

### Layered Architecture

Follow a clear separation of concerns:

1. **Routes** → Define endpoints and attach middleware
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Implement business logic
4. **Repositories** → Interact with database
5. **Models** → Define data structure

```typescript
// Route Layer
router.post('/', authenticateToken, (req, res) =>
  useCaseController.createUseCase(req, res)
);

// Controller Layer
export async function createUseCase(req: Request, res: Response) {
  const validation = validationService.validateUseCaseData(req.body);
  if (validation) {
    return res.status(400).json({ success: false, error: validation });
  }
  const useCase = await useCaseService.createUseCase(req.body);
  return res.status(201).json({ success: true, data: useCase });
}

// Service Layer
export class UseCaseService {
  async createUseCase(data: CreateUseCaseDTO) {
    return useCaseRepository.create(data);
  }
}

// Repository Layer
export class UseCaseRepository {
  async create(data: CreateUseCaseDTO) {
    return UseCase.create(data);
  }
}
```

### API Response Format

All API responses should follow a consistent format:

```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "error": "Error message"
}
```

### Database Models

- Use **Sequelize** models for all database interactions
- Define models in `src/models/`
- Use proper TypeScript interfaces
- Set appropriate data types and constraints

```typescript
export class UseCase extends Model<UseCaseAttributes, UseCaseCreationAttributes> {
  public id!: string;
  public title!: string;
  // ... other fields
}

UseCase.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // ... other fields
}, {
  sequelize,
  tableName: 'use_cases',
  timestamps: true,
});
```

### Validation

- Validate all input data before processing
- Use the **validationService** for consistency
- Return clear validation error messages
- Validate at the controller level

---

## Naming Conventions

### General

- Use descriptive, meaningful names
- Avoid abbreviations unless widely understood
- Use consistent terminology across the codebase

### TypeScript/JavaScript

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `const userName = 'John';` |
| Functions | camelCase | `function getUserById() {}` |
| Classes | PascalCase | `class UserService {}` |
| Interfaces | PascalCase | `interface UserAttributes {}` |
| Types | PascalCase | `type UserRole = 'admin';` |
| Constants | UPPER_SNAKE_CASE | `const API_BASE_URL = '...';` |
| Enums | PascalCase | `enum Status { Active }` |
| Private fields | _camelCase | `private _cache = {};` |

### Files and Folders

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `LoginModal.tsx` |
| Services | camelCase | `authService.ts` |
| Utils | camelCase | `dateUtils.ts` |
| Folders | camelCase | `components/`, `services/` |
| Test files | *.test.ts | `auth.test.ts` |

### Database

| Type | Convention | Example |
|------|-----------|---------|
| Tables | snake_case | `use_cases` |
| Columns | snake_case | `owner_email` |
| Primary keys | id | `id` |
| Foreign keys | table_id | `user_id` |

---

## Folder Structure

### Frontend Structure

```
frontend/
├── public/              # Static assets
│   └── image.png
├── src/
│   ├── components/      # Reusable components
│   │   ├── Footer.tsx
│   │   ├── LoginModal.tsx
│   │   └── UseCaseCard.tsx
│   ├── pages/          # Page components
│   │   ├── App.tsx
│   │   ├── LandingPage.tsx
│   │   └── UseCaseOverview.tsx
│   ├── contexts/       # React contexts
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── services/       # API services
│   │   ├── apiClient.ts
│   │   ├── authApi.ts
│   │   └── usecaseApi.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── constants/      # Constants
│   │   └── constants.ts
│   ├── config/         # Configuration
│   │   └── index.ts
│   ├── routes/         # Route definitions
│   │   └── routes.ts
│   ├── styles/         # Global styles
│   │   └── index.css
│   └── main.tsx        # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

### Backend Structure

```
backend/
├── src/
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── constants/           # Constants
│   │   └── messages.ts
│   ├── controllers/         # Controllers
│   │   ├── authController.ts
│   │   ├── useCaseController.ts
│   │   └── userController.ts
│   ├── middlewares/         # Middlewares
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models/             # Database models
│   │   ├── UseCase.ts
│   │   └── User.ts
│   ├── repository/         # Data access
│   │   ├── useCaseRepository.ts
│   │   └── userRepository.ts
│   ├── routes/             # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── useCaseRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/           # Business logic
│   │   ├── authService.ts
│   │   ├── jwtService.ts
│   │   ├── useCaseService.ts
│   │   ├── userService.ts
│   │   └── validationService.ts
│   ├── types/              # TypeScript types
│   │   ├── UseCaseTypes.ts
│   │   └── UserTypes.ts
│   ├── utils/              # Utilities
│   │   └── appInsights.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── migrations/             # Database migrations
├── package.json
└── tsconfig.json
```

---

## Error Handling

### Frontend Error Handling

- Always use try-catch blocks for async operations
- Display user-friendly error messages
- Log errors to console for debugging
- Never expose sensitive information in error messages

```typescript
try {
  const data = await apiClient.get('/api/use-cases');
  setUseCases(data);
} catch (error) {
  console.error('Failed to load use cases:', error);
  setError('Failed to load use cases. Please try again.');
}
```

### Backend Error Handling

- Use centralized error handling middleware
- Log all errors with appropriate context
- Return consistent error responses
- Never expose stack traces to clients in production

```typescript
// Centralized error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logException(err, { context: 'errorHandler' });

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

### HTTP Status Codes

Use appropriate HTTP status codes:

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

---

## Testing Standards

### Test Organization

- Place tests in `__tests__` folders
- Name test files with `.test.ts` or `.test.tsx` suffix
- Group related tests using `describe` blocks
- Use clear, descriptive test names

### Frontend Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../LoginModal';

describe('LoginModal', () => {
  it('should display login form when open', () => {
    render(<LoginModal isOpen={true} onClose={() => {}} onLoginSuccess={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should call onLoginSuccess on successful login', async () => {
    const mockLoginSuccess = jest.fn();
    render(<LoginModal isOpen={true} onClose={() => {}} onLoginSuccess={mockLoginSuccess} />);
    // ... test implementation
  });
});
```

### Backend Testing

```typescript
import request from 'supertest';
import app from '../app';

describe('POST /api/auth/login', () => {
  it('should return token on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it('should return 401 on invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- Test critical paths and edge cases
- Mock external dependencies
- Test error handling scenarios

---

## Code Review Guidelines

### Before Submitting

- Ensure code compiles without errors
- Run all tests and ensure they pass
- Run linter and fix all warnings
- Update documentation if needed
- Remove console.logs and debug code
- Test manually in the application

### Review Checklist

- [ ] Code follows project conventions
- [ ] Changes are well-documented
- [ ] Tests are included and pass
- [ ] No security vulnerabilities introduced
- [ ] Error handling is appropriate
- [ ] Performance impact is acceptable
- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] Breaking changes are documented

### Review Feedback

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Approve when code meets standards
- Request changes when issues exist
- Comment on both positives and areas for improvement

---

## Best Practices

### Security

- **Never commit secrets** (API keys, passwords) to version control
- Use environment variables for sensitive configuration
- Validate and sanitize all user input
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Keep dependencies up to date

### Performance

- Minimize bundle size (code splitting, lazy loading)
- Optimize images and assets
- Use proper database indexes
- Implement caching where appropriate
- Avoid N+1 query problems
- Profile and monitor performance regularly

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use proper ARIA labels when needed
- Test with screen readers
- Maintain proper color contrast ratios

### Version Control

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Use feature branches for development
- Don't commit work-in-progress code to main
- Rebase feature branches before merging

### Documentation

- Keep README up to date
- Document API endpoints
- Maintain changelog
- Add inline comments for complex logic
- Create architectural decision records (ADRs) for major changes
