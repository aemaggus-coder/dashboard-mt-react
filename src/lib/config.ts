const config = {
  env:       import.meta.env.VITE_APP_ENV     || 'development',
  version:   import.meta.env.VITE_APP_VERSION || '0.0.0',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN  || '',
  isDev:     import.meta.env.DEV  as boolean,
  isProd:    import.meta.env.PROD as boolean,
} as const;

export default config;
