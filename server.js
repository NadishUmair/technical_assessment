require('./src/config/env');

const app = require('./src/app');

const connectDB = require('./src/config/db');
const { port, nodeEnv } = require('./src/config/env');

/* Connect Database */
connectDB();

/* Start Server */
const server = app.listen(port, () => {
  console.log(
    `Server running in ${nodeEnv} mode on port ${port}`
  );
});

/* Graceful Shutdown */

process.on('SIGTERM', () => {
  console.log(
    'SIGTERM received. Shutting down gracefully...'
  );

  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error(
    `Unhandled Rejection: ${err.message}`
  );

  server.close(() => process.exit(1));
});