import { Metric } from 'web-vitals';

type MetricName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
type WebVitalsReporter = (metric: Metric) => void;

interface ReportWebVitalsOptions {
  /**
   * Which metrics to capture. Default: all five.
   */
  metrics?: MetricName[];

  /**
   * One or more reporter functions that receive the metric data.
   */
  reporters?: WebVitalsReporter | WebVitalsReporter[];

  /**
   * Whether to enable reporting.
   * - `true` / `false` : force enable/disable.
   * - `function` : evaluated at runtime (e.g., `() => process.env.NODE_ENV === 'production'`).
   * Default: `() => process.env.NODE_ENV === 'production'`
   */
  enabled?: boolean | (() => boolean);

  /**
   * If `true`, reports intermediate values (e.g., CLS changes, LCP progress).
   * Default: `false` (only final values).
   */
  reportAllChanges?: boolean;
}

// ---------- Pre-built Reporters ----------

/**
 * Sends metrics to the browser console.
 * Useful for debugging in development.
 */
export const sendToConsole: WebVitalsReporter = (metric) => {
  console.log(
    `%c[Web Vitals] %c${metric.name} (${metric.rating})`,
    'color: #6a737d; font-weight: bold;',
    'color: #2c3e50; font-weight: bold;',
    {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    },
  );
};

/**
 * Sends metrics to Google Analytics 4 (via `gtag`).
 * Assumes `gtag` is globally available (loaded via GA snippet).
 */
export const sendToAnalytics: WebVitalsReporter = (metric) => {
  if (typeof window.gtag !== 'function') {
    console.warn('[Web Vitals] gtag not available — analytics report skipped.');
    return;
  }

  // GA4 event: send as an event with value and parameters
  window.gtag('event', metric.name, {
    // CLS is a cumulative value; others are milliseconds. Scale CLS to integer.
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating, // 'good', 'needs-improvement', 'poor'
    metric_delta: Math.round(metric.delta * 1000) / 1000,
    metric_id: metric.id,
    metric_navigation_type: metric.navigationType,
    // Include the full metric payload as a JSON string if needed
    metric_raw: JSON.stringify(metric),
  });
};

/**
 * Creates a reporter that sends metrics to a custom endpoint.
 * Uses `navigator.sendBeacon` when available for reliable delivery.
 */
export const sendToEndpoint =
  (endpoint: string): WebVitalsReporter =>
  (metric) => {
    const payload = JSON.stringify(metric);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, payload);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch((error) => {
        console.error(`[Web Vitals] Failed to send to ${endpoint}:`, error);
      });
    }
  };

// ---------- Main Function ----------

/**
 * Overloads for backward compatibility and new options.
 */
function reportWebVitals(onPerfEntry?: WebVitalsReporter): void;
function reportWebVitals(options?: ReportWebVitalsOptions): void;

/**
 * Core reporting function with dynamic import (keeps bundle small).
 */
function reportWebVitals(arg?: WebVitalsReporter | ReportWebVitalsOptions): void {
  // ---- Normalise input ----
  let options: ReportWebVitalsOptions = {};

  if (typeof arg === 'function') {
    // Backward-compatible: single reporter function
    options = { reporters: arg };
  } else if (typeof arg === 'object' && arg !== null) {
    options = arg;
  }

  const {
    metrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'],
    reporters,
    reportAllChanges = false,
    enabled,
  } = options;

  // ---- Check if enabled ----
  let isEnabled = true;
  if (enabled !== undefined) {
    isEnabled = typeof enabled === 'function' ? enabled() : enabled;
  } else {
    // Default: enabled only in production
    isEnabled = process.env.NODE_ENV === 'production';
  }

  if (!isEnabled) {
    return;
  }

  // ---- Build final reporter list ----
  let reporterList: WebVitalsReporter[] = [];

  if (reporters) {
    reporterList = Array.isArray(reporters) ? reporters : [reporters];
  }

  // If no reporters are provided, default to console in development,
  // or warn in production (so you don't silently drop data).
  if (reporterList.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[Web Vitals] No reporters provided. Metrics will be collected but not sent.',
      );
      return; // Avoid loading the library at all if nothing will use the data.
    } else {
      reporterList = [sendToConsole];
    }
  }

  // ---- Dynamically import the library and register metrics ----
  import('web-vitals')
    .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const metricMap: Record<MetricName, (cb: (m: Metric) => void, opts?: { reportAllChanges?: boolean }) => void> =
        {
          CLS: onCLS,
          FID: onFID,
          FCP: onFCP,
          LCP: onLCP,
          TTFB: onTTFB,
        };

      metrics.forEach((metricName) => {
        const registerFn = metricMap[metricName];
        if (!registerFn) {
          console.warn(`[Web Vitals] Unknown metric: "${metricName}" — skipping.`);
          return;
        }

        try {
          registerFn(
            (metric: Metric) => {
              // Broadcast the metric to all reporters
              reporterList.forEach((reporter) => {
                try {
                  reporter(metric);
                } catch (reporterError) {
                  console.error(
                    `[Web Vitals] Reporter failed for ${metric.name}:`,
                    reporterError,
                  );
                }
              });
            },
            { reportAllChanges },
          );
        } catch (registrationError) {
          console.error(
            `[Web Vitals] Failed to register metric "${metricName}":`,
            registrationError,
          );
        }
      });
    })
    .catch((importError) => {
      console.error('[Web Vitals] Failed to load the "web-vitals" library:', importError);
    });
}

export default reportWebVitals;
