require('./config/env');

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const path       = require('path');

const { port, nodeEnv } = require('./config/env');
const errorMiddleware  = require('./middlewares/error.middleware');


const authRoutes          = require('./routes/auth.routes');
const managerRoutes       = require('./routes/manager.routes');
const serviceRoutes       = require('./routes/services.routes');
const bookingRoutes       = require('./routes/bookings.routes');
const workerRoutes        = require('./routes/workers.routes');
const notificationRoutes  = require('./routes/notifications.routes');




const app = express();


app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Home Services API is running',
    data: {
      environment: nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
});


const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`,          authRoutes);
app.use(`${API_PREFIX}/managers`,         managerRoutes);
app.use(`${API_PREFIX}/services`,      serviceRoutes);
app.use(`${API_PREFIX}/bookings`,      bookingRoutes);
// app.use(`${API_PREFIX}/workers`,       workerRoutes);
// app.use(`${API_PREFIX}/notifications`, notificationRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
  });
});






process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;