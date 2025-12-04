# Observability Patterns

This document outlines the observability strategy, logging standards, monitoring setup, and best practices for the Tesa AI Hub application.

## Table of Contents

- [Observability Overview](#observability-overview)
- [Logging Standards](#logging-standards)
- [Monitoring Setup](#monitoring-setup)
- [Tracing Patterns](#tracing-patterns)
- [Metrics Collection](#metrics-collection)
- [Alerting Strategy](#alerting-strategy)
- [Dashboard Guidelines](#dashboard-guidelines)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## Observability Overview

### The Three Pillars of Observability

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │          │  │          │  │          │     │
│  │   LOGS   │  │  METRICS │  │  TRACES  │     │
│  │          │  │          │  │          │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│       │              │              │          │
│       └──────────────┴──────────────┘          │
│                     │                          │
│              OBSERVABILITY                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Why Observability Matters

- **Quick Incident Detection**: Identify issues before users report them
- **Faster Root Cause Analysis**: Understand what went wrong and why
- **Performance Optimization**: Identify bottlenecks and optimize
- **Business Insights**: Track feature usage and user behavior
- **Compliance**: Meet audit and regulatory requirements

### Tools Used

- **Application Insights**: Centralized logging, metrics, and tracing
- **Console Logging**: Development and debugging
- **Database Logs**: Query performance and errors
- **Browser DevTools**: Frontend debugging

---

## Logging Standards

### Log Levels

Use appropriate log levels for different types of events:

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | System errors, exceptions | Database connection failed |
| **WARN** | Unexpected but handled | Invalid input, deprecated API |
| **INFO** | Important events | User login, resource created |
| **DEBUG** | Detailed debugging info | Function entry/exit, variable values |
| **TRACE** | Very detailed tracing | Request/response details |

### Logging in Backend

#### Application Insights Integration

```typescript
import { logTrace, logEvent, logException } from './utils/appInsights';

// Trace logging
logTrace('UseCaseService: Creating new use case');

// Event logging
logEvent('UserLogin', { email: user.email, timestamp: new Date() });

// Exception logging
logException(error as Error, { context: 'useCaseController.create' });
```

#### Structured Logging

Always log with context:

```typescript
// Good: Structured log with context
logTrace('User authentication successful', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});

// Bad: Unstructured log
console.log('User logged in');
```

#### What to Log

**Do Log:**
- ✅ API requests and responses (excluding sensitive data)
- ✅ Authentication events (login, logout, failures)
- ✅ Database queries (for debugging)
- ✅ External API calls
- ✅ Business-critical operations
- ✅ Errors and exceptions with stack traces
- ✅ Performance metrics

**Don't Log:**
- ❌ Passwords or credentials
- ❌ Personal Identifiable Information (PII)
- ❌ Credit card numbers
- ❌ API keys or secrets
- ❌ Full request bodies with sensitive data

### Logging in Frontend

#### Console Logging

```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('API Response:', data);
}

// Error logging (production-safe)
console.error('Failed to load use cases:', error);
```

#### Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
    // Send to logging service
    logException(error, { componentStack: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Log Format Standards

#### Backend Log Format

```json
{
  "timestamp": "2024-12-03T12:00:00.000Z",
  "level": "INFO",
  "message": "User logged in successfully",
  "context": {
    "userId": "uuid-123",
    "email": "user@tesa.com",
    "ipAddress": "192.168.1.1"
  },
  "requestId": "req-uuid-456",
  "service": "auth-service"
}
```

#### Request Logging

Log all incoming requests:

```typescript
app.use((req, res, next) => {
  const requestId = generateRequestId();
  req.requestId = requestId;

  logTrace('Incoming request', {
    method: req.method,
    path: req.path,
    requestId: requestId,
    userAgent: req.headers['user-agent']
  });

  next();
});
```

---

## Monitoring Setup

### Application Insights Configuration

#### Backend Setup

```typescript
import appInsights from 'applicationinsights';

export function initializeAppInsights() {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (connectionString) {
    appInsights.setup(connectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();

    console.log('✅ Application Insights initialized');
  } else {
    console.warn('⚠️ Application Insights not configured');
  }
}
```

#### What Gets Monitored

**Automatic Collection:**
- HTTP requests (duration, status codes, routes)
- Dependencies (database calls, external APIs)
- Exceptions and errors
- Performance counters (CPU, memory)
- Console logs

**Custom Events:**
```typescript
// Track custom events
logEvent('UseCaseCreated', {
  department: useCase.department,
  status: useCase.status,
  userId: req.user.userId
});

// Track custom metrics
trackMetric('UseCaseCreationTime', durationMs);
```

### Health Checks

Implement health check endpoints:

```typescript
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    memory: process.memoryUsage()
  };

  res.json(health);
});

router.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: 'Database unavailable' });
  }
});
```

### Performance Monitoring

Track key performance indicators:

```typescript
// Track API response time
const startTime = Date.now();

try {
  const result = await useCaseService.getAllUseCases();
  const duration = Date.now() - startTime;

  logTrace('API request completed', {
    endpoint: '/api/use-cases',
    duration: duration,
    resultCount: result.length
  });

  return res.json({ success: true, data: result });
} catch (error) {
  const duration = Date.now() - startTime;
  logException(error, { endpoint: '/api/use-cases', duration });
  throw error;
}
```

---

## Tracing Patterns

### Distributed Tracing

Track requests across multiple services:

```typescript
// Generate trace ID for request
const traceId = generateTraceId();
req.traceId = traceId;

// Pass trace ID to dependencies
const response = await externalApi.call({
  headers: { 'X-Trace-Id': traceId }
});

// Log with trace ID
logTrace('External API called', {
  traceId: traceId,
  service: 'external-service',
  duration: durationMs
});
```

### Request Flow Tracing

```typescript
export class UseCaseService {
  async createUseCase(data: CreateUseCaseDTO): Promise<UseCaseAttributes> {
    const traceId = generateTraceId();

    logTrace('UseCaseService.createUseCase: Start', { traceId });

    try {
      // Validate
      logTrace('UseCaseService.createUseCase: Validating', { traceId });
      await this.validate(data);

      // Create
      logTrace('UseCaseService.createUseCase: Creating in DB', { traceId });
      const useCase = await useCaseRepository.create(data);

      // Audit
      logTrace('UseCaseService.createUseCase: Creating audit log', { traceId });
      await auditService.log('use_case_created', useCase.id);

      logTrace('UseCaseService.createUseCase: Success', { traceId });
      return useCase;
    } catch (error) {
      logException(error, { context: 'UseCaseService.createUseCase', traceId });
      throw error;
    }
  }
}
```

### Correlation IDs

Use correlation IDs to track related operations:

```typescript
interface RequestWithCorrelation extends Request {
  correlationId?: string;
}

app.use((req: RequestWithCorrelation, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] as string || generateId();
  res.setHeader('X-Correlation-Id', req.correlationId);
  next();
});
```

---

## Metrics Collection

### Key Metrics to Track

#### Application Metrics

```typescript
// Request rate
trackMetric('requests.rate', requestsPerSecond);

// Response time
trackMetric('requests.duration', durationMs, {
  endpoint: req.path,
  method: req.method,
  statusCode: res.statusCode
});

// Error rate
trackMetric('errors.rate', errorsPerMinute);

// Active users
trackMetric('users.active', activeUserCount);
```

#### Business Metrics

```typescript
// Use cases created
trackMetric('usecases.created', 1, {
  department: useCase.department,
  status: useCase.status
});

// User registrations
trackMetric('users.registered', 1);

// Login success rate
trackMetric('auth.login.success', 1);
trackMetric('auth.login.failure', 1);
```

#### Infrastructure Metrics

```typescript
// CPU usage
trackMetric('system.cpu', cpuUsagePercent);

// Memory usage
trackMetric('system.memory', memoryUsageMB);

// Database connection pool
trackMetric('database.pool.active', activeConnections);
trackMetric('database.pool.idle', idleConnections);
```

### Custom Metrics

```typescript
export function trackMetric(
  name: string,
  value: number,
  properties?: { [key: string]: string }
) {
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackMetric({
      name,
      value,
      properties
    });
  }
}

// Usage
trackMetric('api.response.time', 245, {
  endpoint: '/api/use-cases',
  method: 'GET'
});
```

---

## Alerting Strategy

### Alert Levels

| Level | Response Time | Example |
|-------|--------------|---------|
| **P1 - Critical** | Immediate | Service down, data loss |
| **P2 - High** | 15 minutes | High error rate, degraded performance |
| **P3 - Medium** | 1 hour | Elevated error rate, warnings |
| **P4 - Low** | 24 hours | Minor issues, informational |

### Alert Rules

#### Error Rate Alerts

```yaml
alert: HighErrorRate
condition: error_rate > 5% over 5 minutes
severity: P2
action: Page on-call engineer
message: "Error rate is {{value}}% (threshold: 5%)"
```

#### Response Time Alerts

```yaml
alert: SlowResponseTime
condition: p95_response_time > 2000ms over 5 minutes
severity: P3
action: Send email notification
message: "API response time is {{value}}ms at 95th percentile"
```

#### Availability Alerts

```yaml
alert: ServiceUnavailable
condition: health_check_failures > 3 in 5 minutes
severity: P1
action: Page on-call engineer, send SMS
message: "Service health check failing"
```

### Alert Configuration

```typescript
// Configure alerts in Application Insights
const alertRules = [
  {
    name: 'High Error Rate',
    metric: 'requests/failed',
    threshold: 10,
    window: '5m',
    severity: 'Error',
    enabled: true
  },
  {
    name: 'Slow Response Time',
    metric: 'requests/duration',
    aggregation: 'P95',
    threshold: 2000,
    window: '10m',
    severity: 'Warning',
    enabled: true
  },
  {
    name: 'Database Connection Issues',
    metric: 'dependencies/failed',
    filter: 'target == "database"',
    threshold: 5,
    window: '5m',
    severity: 'Critical',
    enabled: true
  }
];
```

### Alert Best Practices

- **Avoid Alert Fatigue**: Set appropriate thresholds
- **Actionable Alerts**: Include context and remediation steps
- **Test Alerts**: Verify alert delivery and escalation
- **Document Runbooks**: Create clear troubleshooting guides
- **Review Regularly**: Adjust thresholds based on actual patterns

---

## Dashboard Guidelines

### Key Dashboards

#### 1. Application Health Dashboard

**Widgets:**
- Service uptime and availability
- Request rate over time
- Error rate over time
- Response time (P50, P95, P99)
- Active users
- Database connection pool status

#### 2. Performance Dashboard

**Widgets:**
- API endpoint latencies
- Database query performance
- External API call durations
- Cache hit/miss rates
- Resource utilization (CPU, Memory)

#### 3. Business Metrics Dashboard

**Widgets:**
- Use cases created per day
- User registrations
- Login success/failure rates
- Department-wise use case distribution
- Status distribution of use cases

#### 4. Error Tracking Dashboard

**Widgets:**
- Error count by type
- Exception stack traces
- Failed requests by endpoint
- 4xx and 5xx error breakdown
- Top errors by frequency

### Dashboard Design Principles

**Layout:**
```
┌───────────────────────────────────────────┐
│  Key Metrics (KPIs)                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │
│  │99.9%│ │ 245 │ │ 0.1%│ │1234 │         │
│  │Uptm │ │ ms  │ │Error│ │Users│         │
│  └─────┘ └─────┘ └─────┘ └─────┘         │
├───────────────────────────────────────────┤
│  Time Series Charts                       │
│  ┌─────────────────────────────────────┐ │
│  │     Request Rate Over Time          │ │
│  │  ╱╲    ╱╲                           │ │
│  │ ╱  ╲  ╱  ╲╱╲                        │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │     Error Rate Over Time            │ │
│  │                      ╱╲             │ │
│  │  ─────────────────╱──╲──────       │ │
│  └─────────────────────────────────────┘ │
├───────────────────────────────────────────┤
│  Detailed Metrics                         │
│  ┌──────────────┐ ┌──────────────┐       │
│  │ Top Errors   │ │ Slow Queries │       │
│  └──────────────┘ └──────────────┘       │
└───────────────────────────────────────────┘
```

**Best Practices:**
- Place most critical metrics at the top
- Use consistent color schemes
- Include time range selector
- Add drill-down capabilities
- Auto-refresh at appropriate intervals
- Mobile-responsive design

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. High Error Rate

**Symptoms:**
- Increased 5xx errors
- Users reporting failures

**Investigation:**
```typescript
// Check Application Insights
query: "requests | where resultCode >= 500 | summarize count() by resultCode, url"

// Check logs
query: "traces | where severityLevel >= 3 | order by timestamp desc"
```

**Common Causes:**
- Database connection issues
- External API failures
- Memory exhaustion
- Unhandled exceptions

#### 2. Slow Response Times

**Symptoms:**
- P95 latency > 2 seconds
- Timeout errors

**Investigation:**
```typescript
// Find slow endpoints
query: "requests | summarize avg(duration), percentile(duration, 95) by url"

// Check database queries
query: "dependencies | where type == 'SQL' | summarize avg(duration) by data"
```

**Common Causes:**
- Missing database indexes
- N+1 query problems
- Large payload sizes
- Synchronous external API calls

#### 3. Memory Leaks

**Symptoms:**
- Increasing memory usage
- Application crashes
- Out of memory errors

**Investigation:**
```typescript
// Monitor memory usage
query: "performanceCounters | where name == 'Memory\\Available Bytes'"

// Take heap snapshot
// Use Node.js memory profiler
```

**Common Causes:**
- Unclosed database connections
- Event listener leaks
- Large object retention
- Circular references

### Debugging Techniques

#### Enable Debug Logging

```typescript
// Set environment variable
DEBUG=* npm start

// Or in code
if (process.env.DEBUG_MODE === 'true') {
  console.log('Debug info:', debugData);
}
```

#### Use Request Correlation

```typescript
// Find all logs for a specific request
query: `traces | where customDimensions.correlationId == "abc-123"`
```

#### Analyze Performance

```typescript
// Profile slow operations
const startTime = performance.now();
await slowOperation();
const duration = performance.now() - startTime;

if (duration > 1000) {
  logTrace('Slow operation detected', { operation: 'slowOperation', duration });
}
```

### Incident Response Workflow

```
1. Detect → Alert triggered
    ↓
2. Acknowledge → On-call engineer notified
    ↓
3. Investigate → Check logs, metrics, traces
    ↓
4. Diagnose → Identify root cause
    ↓
5. Mitigate → Deploy fix or rollback
    ↓
6. Verify → Confirm issue resolved
    ↓
7. Document → Write postmortem
    ↓
8. Improve → Update alerts, add tests
```

---

## Best Practices Summary

### Logging Best Practices

✅ **Do:**
- Use structured logging with context
- Include correlation IDs
- Log at appropriate levels
- Sanitize sensitive data
- Log errors with stack traces
- Use consistent format

❌ **Don't:**
- Log passwords or secrets
- Over-log (log spam)
- Log in production hot paths
- Ignore log rotation
- Skip error context

### Monitoring Best Practices

✅ **Do:**
- Monitor key metrics
- Set up health checks
- Track business metrics
- Use distributed tracing
- Create meaningful dashboards
- Review metrics regularly

❌ **Don't:**
- Monitor everything (noise)
- Ignore baselines
- Skip capacity planning
- Forget about costs
- Delay alert investigation

### Alerting Best Practices

✅ **Do:**
- Set actionable alerts
- Include context in alerts
- Test alert delivery
- Document runbooks
- Adjust thresholds
- Escalate appropriately

❌ **Don't:**
- Create alert spam
- Use vague alert messages
- Skip alert testing
- Forget to update contacts
- Ignore alert patterns

---

## Observability Checklist

### Development Phase

- [ ] Add logging to new features
- [ ] Include error handling
- [ ] Add performance tracking
- [ ] Write unit tests
- [ ] Test error scenarios
- [ ] Document expected behavior

### Deployment Phase

- [ ] Verify Application Insights connection
- [ ] Check log aggregation
- [ ] Confirm metrics collection
- [ ] Test health check endpoints
- [ ] Review dashboard accuracy
- [ ] Verify alert configuration

### Operations Phase

- [ ] Monitor dashboards regularly
- [ ] Respond to alerts promptly
- [ ] Analyze trends and patterns
- [ ] Optimize based on metrics
- [ ] Update runbooks
- [ ] Conduct postmortems

---

## Additional Resources

### Query Examples

#### Find Errors in Last Hour

```kusto
traces
| where timestamp > ago(1h)
| where severityLevel >= 3
| project timestamp, message, severityLevel, customDimensions
| order by timestamp desc
```

#### Analyze API Performance

```kusto
requests
| where timestamp > ago(24h)
| summarize
    count(),
    avg(duration),
    percentile(duration, 50),
    percentile(duration, 95),
    percentile(duration, 99)
    by url
| order by avg_duration desc
```

#### Track User Activity

```kusto
customEvents
| where name == "UserLogin"
| where timestamp > ago(7d)
| summarize count() by bin(timestamp, 1d)
| render timechart
```

### Useful Commands

```bash
# View application logs
docker logs -f app-container

# Monitor system resources
htop

# Check database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Test API endpoint
curl -v http://localhost:3000/health
```
