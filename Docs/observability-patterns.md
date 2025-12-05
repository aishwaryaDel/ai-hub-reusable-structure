# Observability

This document describes how the Tesa AI Hub application implements observability across logging, tracing, monitoring, and alerting, ensuring transparency, measurability, and debuggability for the entire stack.

---

## Overview

Observability in Tesa AI Hub is built on the three pillars:
- **Logs**: Structured, contextual, and secure logging for backend and frontend.
- **Metrics**: Application, business, and infrastructure metrics tracked and visualized.
- **Traces**: Distributed tracing and correlation IDs for request flows.

Primary tools:
- **Azure Application Insights**: Centralized logging, metrics, traces, and alerting.
- **Console Logging**: For development/debugging.
- **Database Logs**: Query performance and error tracking.
- **Browser DevTools**: Frontend debugging.

---

## Logging

### Backend
- Uses Application Insights for trace, event, and exception logging.
- All logs are structured with context (user, requestId, service, etc.).
- Sensitive data (passwords, PII, secrets) is never logged.
- API requests, authentication events, database queries, external API calls, and errors are logged.
- Example:
```typescript
logTrace('User login', { userId, email, requestId });
logException(error, { context: 'authController.login' });
```

### Frontend
- Console logs for development only.
- Error boundaries capture and log exceptions.
- Example:
```typescript
console.error('Failed to load use cases:', error);
```

---

## Tracing

- Each request is assigned a unique trace/correlation ID.
- IDs are propagated across services and included in logs and metrics.
- Distributed tracing is enabled via Application Insights.
- Example:
```typescript
const traceId = generateTraceId();
logTrace('API request', { traceId, endpoint });
```

---

## Monitoring

- Application Insights automatically collects:
  - HTTP requests (duration, status)
  - Dependencies (DB, external APIs)
  - Exceptions and errors
- Custom metrics are tracked for business and infrastructure KPIs.
- Health check endpoints (`/health`, `/ready`) report service and DB status.
- Example:
```typescript
trackMetric('api.response.time', durationMs, { endpoint });
```

---

## Alerting

- Alerts are configured in Application Insights for:
  - High error rates
  - Slow response times
  - Service unavailability
  - Database connection issues

---

## Dashboards

- Dashboards visualize:
  - Service uptime and availability
  - Request and error rates
  - Performance metrics (latency, resource usage)
  - Business metrics (use cases, users)
- Dashboards are designed for clarity, drill-down, and auto-refresh.

---

## Best Practices

- Use structured logging with context and correlation IDs.
- Monitor key metrics and health checks.
- Set actionable, tested alerts.
- Sanitize sensitive data in logs.
- Review dashboards and metrics regularly.
- Document troubleshooting and incident response workflows.

---

## Checklist

- [x] Logging integrated (backend/frontend)
- [x] Tracing and correlation IDs implemented
- [x] Metrics tracked and visualized
- [x] Health checks available
- [x] Alerts configured and tested
- [x] Dashboards set up
- [x] Runbooks documented

---