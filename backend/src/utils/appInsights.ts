import * as appInsights from 'applicationinsights';

let client: appInsights.TelemetryClient | null = null;

/**
 * Initialize Application Insights
 * Should be called once at application startup
 */
export function initializeAppInsights(): void {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString) {
    console.warn('⚠️ APPLICATIONINSIGHTS_CONNECTION_STRING not found. Application Insights will not be enabled.');
    return;
  }

  try {
    appInsights.setup(connectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectDependencies(true)
      .setAutoCollectExceptions(true)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, false)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .start();

    client = appInsights.defaultClient;
    console.log('✅ Application Insights initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Application Insights:', error);
  }
}

/**
 * Log a trace message
 */
export function logTrace(message: string, severity?: string): void {
  if (client) {
    client.trackTrace({
      message,
     properties: {
        severity: severity ?? "Information"
      }
    });
  }
}

/**
 * Log a custom event
 */
export function logEvent(name: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
  if (client) {
    client.trackEvent({
      name,
      properties,
      measurements
    });
  }
}

/**
 * Log a metric
 */
export function logMetric(name: string, value: number, properties?: { [key: string]: string }): void {
  if (client) {
    client.trackMetric({
      name,
      value,
      properties
    });
  }
}

/**
 * Log an exception
 */
export function logException(error: Error, properties?: { [key: string]: string }): void {
  if (client) {
    client.trackException({
      exception: error,
      properties
    });
  }
}

/**
 * Get the Application Insights client instance
 */
export function getClient(): appInsights.TelemetryClient | null {
  return client;
}
