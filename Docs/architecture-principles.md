# Architecture Principles

This document outlines the architectural principles, patterns, and design decisions for the Tesa AI Hub application.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Layered Architecture](#layered-architecture)
- [API Design Standards](#api-design-standards)
- [Database Guidelines](#database-guidelines)
- [Security Principles](#security-principles)
- [Scalability Considerations](#scalability-considerations)
- [Integration Patterns](#integration-patterns)

---

## System Overview

### High-Level Architecture

The Tesa AI Hub is a full-stack web application built with a modern, decoupled architecture:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Frontend (React + Vite)            │
│   ┌─────────────────────────────────────────┐  │
│   │  Components │ Pages │ Contexts │ Services │  │
│   └─────────────────────────────────────────┘  │
│                      ▼                          │
│              REST API (HTTP/JSON)               │
│                      ▼                          │
│          Backend (Node.js + Express)            │
│   ┌─────────────────────────────────────────┐  │
│   │ Routes │ Controllers │ Services │ Repos  │  │
│   └─────────────────────────────────────────┘  │
│                      ▼                          │
│       Database (PostgreSQL + Sequelize)         │
│   ┌─────────────────────────────────────────┐  │
│   │      use_cases │ users                   │  │
│   └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Lucide React**: Icon library

#### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe JavaScript development
- **Sequelize**: ORM for PostgreSQL
- **JWT**: Token-based authentication
- **Swagger**: API documentation

#### Database
- **PostgreSQL**: Relational database management system
- **Sequelize ORM**: Database abstraction layer

#### DevOps & Monitoring
- **Application Insights**: Monitoring and diagnostics
- **Jest**: Testing framework
- **Docker**: Containerization (optional)

---

## Architecture Patterns

### 1. Separation of Concerns

The application follows a clear separation between:
- **Presentation Layer** (Frontend)
- **API Layer** (REST endpoints)
- **Business Logic Layer** (Services)
- **Data Access Layer** (Repositories)
- **Data Storage Layer** (Database)

### 2. Repository Pattern

All database access is abstracted through repository classes:

```typescript
// Repository provides data access abstraction
export class UseCaseRepository {
  async findById(id: string) {
    return UseCase.findByPk(id);
  }

  async findAll() {
    return UseCase.findAll({ order: [['created_at', 'DESC']] });
  }

  async create(data: CreateUseCaseDTO) {
    return UseCase.create(data);
  }
}
```

**Benefits:**
- Decouples business logic from data access
- Makes testing easier through mocking
- Centralizes query logic
- Allows easy database technology changes

### 3. Service Layer Pattern

Business logic is encapsulated in service classes:

```typescript
export class UseCaseService {
  async getAllUseCases(): Promise<UseCaseAttributes[]> {
    const useCases = await useCaseRepository.findAll();
    return useCases;
  }

  async createUseCase(data: CreateUseCaseDTO): Promise<UseCaseAttributes> {
    // Business logic and validation
    return useCaseRepository.create(data);
  }
}
```

**Benefits:**
- Single source of truth for business rules
- Reusable across different controllers
- Testable in isolation
- Clear separation from data access

### 4. Dependency Injection

Services and repositories are instantiated once and exported:

```typescript
export const useCaseService = new UseCaseService();
export const useCaseRepository = new UseCaseRepository();
```

### 5. Middleware Pattern

Cross-cutting concerns are handled through Express middleware:

```typescript
// Authentication middleware
app.use('/api/use-cases', authenticateToken);

// Error handling middleware
app.use(errorHandler);
```

---

## Layered Architecture

### Backend Layers

```
┌─────────────────────────────────────────┐
│          Routes Layer                    │ ← Endpoint definitions
├─────────────────────────────────────────┤
│       Controllers Layer                  │ ← HTTP request/response handling
├─────────────────────────────────────────┤
│        Services Layer                    │ ← Business logic
├─────────────────────────────────────────┤
│      Repositories Layer                  │ ← Data access
├─────────────────────────────────────────┤
│         Models Layer                     │ ← Data structure
└─────────────────────────────────────────┘
```

#### 1. Routes Layer

**Responsibility:** Define API endpoints and apply middleware

```typescript
const router = Router();

router.get('/', (req, res) => useCaseController.getAllUseCases(req, res));
router.post('/', authenticateToken, (req, res) => useCaseController.createUseCase(req, res));
router.put('/:id', authenticateToken, (req, res) => useCaseController.updateUseCase(req, res));
router.delete('/:id', authenticateToken, (req, res) => useCaseController.deleteUseCase(req, res));
```

#### 2. Controllers Layer

**Responsibility:** Handle HTTP requests and responses

```typescript
export async function createUseCase(req: Request, res: Response) {
  try {
    const validation = validationService.validateUseCaseData(req.body);
    if (validation) {
      return res.status(400).json({ success: false, error: validation });
    }

    const useCase = await useCaseService.createUseCase(req.body);
    return res.status(201).json({ success: true, data: useCase });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create use case' });
  }
}
```

#### 3. Services Layer

**Responsibility:** Implement business logic and orchestrate operations

```typescript
export class UseCaseService {
  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCaseAttributes> {
    logTrace('UseCaseService: Creating new use case');
    const useCase = await useCaseRepository.create(useCaseData);
    logTrace('UseCaseService: Use case created successfully');
    return useCase;
  }
}
```

#### 4. Repositories Layer

**Responsibility:** Abstract database operations

```typescript
export class UseCaseRepository {
  async create(data: CreateUseCaseDTO) {
    return UseCase.create({
      ...data,
      related_use_case_ids: data.related_use_case_ids || [],
    });
  }
}
```

#### 5. Models Layer

**Responsibility:** Define data structure and relationships

```typescript
export class UseCase extends Model<UseCaseAttributes, UseCaseCreationAttributes> {
  public id!: string;
  public title!: string;
  // ... other fields
}

UseCase.init({
  id: { type: DataTypes.UUID, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  // ... other fields
}, { sequelize, tableName: 'use_cases' });
```

### Frontend Layers

```
┌─────────────────────────────────────────┐
│          Pages Layer                     │ ← Route components
├─────────────────────────────────────────┤
│       Components Layer                   │ ← Reusable UI components
├─────────────────────────────────────────┤
│        Services Layer                    │ ← API communication
├─────────────────────────────────────────┤
│        Contexts Layer                    │ ← Global state management
└─────────────────────────────────────────┘
```

---

## API Design Standards

### RESTful Principles

Follow REST conventions for resource-based APIs:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/use-cases` | List all use cases |
| GET | `/api/use-cases/:id` | Get specific use case |
| POST | `/api/use-cases` | Create new use case |
| PUT | `/api/use-cases/:id` | Update use case |
| DELETE | `/api/use-cases/:id` | Delete use case |

### Request/Response Format

#### Request Format

```json
{
  "title": "AI-Powered Analytics",
  "short_description": "Brief description",
  "full_description": "Detailed description",
  "department": "IT",
  "status": "PoC",
  "owner_name": "John Doe",
  "owner_email": "john.doe@tesa.com",
  "technology_stack": ["Python", "TensorFlow"],
  "tags": ["AI", "Analytics"],
  "internal_links": {
    "confluence": "https://..."
  }
}
```

#### Success Response Format

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI-Powered Analytics",
    // ... other fields
  }
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed: Title is required"
}
```

### Versioning

- Include API version in URL: `/api/v1/use-cases`
- Maintain backward compatibility within major versions
- Document breaking changes clearly

### Pagination

For list endpoints, support pagination:

```
GET /api/use-cases?page=1&limit=20
```

Response includes metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Filtering and Sorting

Support query parameters for filtering:

```
GET /api/use-cases?department=IT&status=Live&sort=created_at:desc
```

---

## Database Guidelines

### Schema Design Principles

1. **Normalization**: Avoid data redundancy
2. **Denormalization**: Use when performance requires it
3. **Indexing**: Create indexes on frequently queried columns
4. **Constraints**: Use database constraints for data integrity

### Table Structure

```sql
CREATE TABLE use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  department VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  image_url TEXT,
  business_impact TEXT,
  technology_stack JSONB DEFAULT '[]'::jsonb,
  internal_links JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  related_use_case_ids JSONB DEFAULT '[]'::jsonb,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexing Strategy

```sql
-- Index on frequently queried columns
CREATE INDEX idx_use_cases_department ON use_cases(department);
CREATE INDEX idx_use_cases_status ON use_cases(status);
CREATE INDEX idx_use_cases_created_at ON use_cases(created_at DESC);

-- GIN index for JSONB columns
CREATE INDEX idx_use_cases_tags ON use_cases USING GIN(tags);
```

### Migration Strategy

- Use sequential numbered migration files
- Never modify committed migrations
- Test migrations on development before production
- Keep migrations reversible when possible
- Document complex migrations

### Data Types

| Use Case | PostgreSQL Type | Sequelize Type |
|----------|----------------|----------------|
| ID | UUID | DataTypes.UUID |
| Short text | VARCHAR(n) | DataTypes.STRING(n) |
| Long text | TEXT | DataTypes.TEXT |
| Number | INTEGER | DataTypes.INTEGER |
| Decimal | NUMERIC | DataTypes.DECIMAL |
| Boolean | BOOLEAN | DataTypes.BOOLEAN |
| Date/Time | TIMESTAMPTZ | DataTypes.DATE |
| JSON | JSONB | DataTypes.JSONB |

### Transaction Management

Use transactions for operations that must be atomic:

```typescript
const transaction = await sequelize.transaction();
try {
  await UseCase.create(data, { transaction });
  await AuditLog.create(logData, { transaction });
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

---

## Security Principles

### Authentication

**JWT Token-Based Authentication:**

```
Client                    Server
  │                         │
  ├──── Login Request ─────>│
  │     (credentials)        │
  │                         │
  │<──── JWT Token ─────────┤
  │                         │
  ├──── API Request ───────>│
  │     (Bearer Token)       │
  │                         │
  │<──── Response ──────────┤
```

### Authorization

- Use JWT middleware to protect routes
- Include user role in JWT payload
- Implement role-based access control (RBAC)
- Check permissions at the controller level

```typescript
// Protected route
router.post('/', authenticateToken, createUseCase);

// Middleware validates JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.substring(7);
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### Input Validation

- Validate all user input
- Use whitelist validation (allow known good)
- Sanitize input to prevent injection attacks
- Validate data types, formats, and ranges

### Password Security

- Hash passwords using bcrypt
- Never store plain text passwords
- Use appropriate salt rounds (10+)

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### Environment Variables

- Store sensitive configuration in environment variables
- Never commit secrets to version control
- Use different secrets per environment
- Rotate secrets regularly

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

### Security Headers

```typescript
app.use(helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));
```

---

## Scalability Considerations

### Horizontal Scaling

**Stateless Application Design:**
- No session storage in memory
- Use JWT for authentication (no server-side sessions)
- Store state in database or cache
- Multiple instances can run behind load balancer

### Database Optimization

**Query Optimization:**
- Use indexes on frequently queried columns
- Avoid N+1 queries
- Use `findAll` with `include` for relations
- Implement pagination for large datasets
- Use database query analysis tools

**Connection Pooling:**

```typescript
const sequelize = new Sequelize({
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
});
```

### Caching Strategy

**Implement caching at multiple levels:**

1. **Browser Caching**: Static assets with long cache headers
2. **API Response Caching**: Cache frequently accessed, rarely changed data
3. **Database Query Caching**: Cache expensive query results

### Asynchronous Processing

For long-running operations:
- Use message queues (e.g., RabbitMQ, Redis)
- Implement job processing (e.g., Bull)
- Return immediate response with job ID
- Poll or use webhooks for completion

### Monitoring and Metrics

- Track response times
- Monitor error rates
- Alert on performance degradation
- Use Application Insights for diagnostics

---

## Integration Patterns

### External Service Integration

**API Integration Pattern:**

```typescript
export class ExternalApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXTERNAL_API_URL,
      timeout: 5000,
      headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}` }
    });
  }

  async callExternalService(data: any) {
    try {
      const response = await this.client.post('/endpoint', data);
      return response.data;
    } catch (error) {
      logException(error);
      throw new Error('External service unavailable');
    }
  }
}
```

### Error Handling in Integrations

- Implement retry logic with exponential backoff
- Use circuit breaker pattern for failing services
- Provide fallback responses when possible
- Log all integration errors

### Webhook Handling

```typescript
router.post('/webhook/external-service', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-signature'];
    if (!verifySignature(signature, req.body)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process webhook asynchronously
    await processWebhook(req.body);

    // Respond immediately
    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(500).json({ error: 'Processing failed' });
  }
});
```

---

## Best Practices Summary

### Do's

✅ Follow layered architecture
✅ Use dependency injection
✅ Implement proper error handling
✅ Validate all inputs
✅ Write tests for critical functionality
✅ Document API endpoints
✅ Use TypeScript for type safety
✅ Keep secrets in environment variables
✅ Log important events and errors
✅ Monitor application performance

### Don'ts

❌ Don't skip validation
❌ Don't expose sensitive data
❌ Don't commit secrets
❌ Don't ignore error handling
❌ Don't skip authentication
❌ Don't store passwords in plain text
❌ Don't use `any` type in TypeScript
❌ Don't skip database migrations
❌ Don't hardcode configuration
❌ Don't ignore security updates

---

## Architecture Decision Records

Keep a record of significant architectural decisions:

### ADR-001: Use PostgreSQL with Sequelize

**Context:** Need a reliable database with ORM support

**Decision:** Use PostgreSQL with Sequelize ORM

**Consequences:**
- Structured data model
- Strong consistency guarantees
- Rich querying capabilities
- Good TypeScript support

### ADR-002: JWT for Authentication

**Context:** Need stateless authentication for horizontal scaling

**Decision:** Implement JWT token-based authentication

**Consequences:**
- Stateless authentication
- No server-side session storage
- Easy horizontal scaling
- Token expiration management required

### ADR-003: Layered Architecture

**Context:** Need maintainable, testable codebase

**Decision:** Implement layered architecture with clear separation of concerns

**Consequences:**
- Better code organization
- Easier testing
- Clear responsibility boundaries
- Slightly more boilerplate code
