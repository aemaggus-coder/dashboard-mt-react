import * as Sentry from '@sentry/react';
import config from './config';

export function initErrorTracking() {
  if (!config.sentryDsn) return;

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
    release: config.version,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: config.isProd ? 0.1 : 1.0,
    // Не отправляем ошибки в dev-окружении если DSN не задан явно
    enabled: config.isProd || Boolean(config.sentryDsn),
  });
}

const errorTracking = {
  captureException(error, context) {
    if (config.sentryDsn) {
      Sentry.captureException(error, { extra: context });
    } else if (config.isDev) {
      console.error('[ErrorTracking] Exception:', error, context);
    }
  },
  captureMessage(message, level = 'info') {
    if (config.sentryDsn) {
      Sentry.captureMessage(message, level as import('@sentry/core').SeverityLevel);
    } else if (config.isDev) {
      console[level]?.('[ErrorTracking] Message:', message);
    }
  },
};

export default errorTracking;
