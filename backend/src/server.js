/**
 * Express Server
 * Main application server
 */

import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Excel Converter API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      convert: '/api/convert',
      templates: '/api/templates'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   Excel Converter API Server            ║
╟──────────────────────────────────────────╢
║   Port: ${PORT}                          ║
║   Environment: ${config.nodeEnv}         ║
║   CORS Origin: ${config.corsOrigin}      ║
╚══════════════════════════════════════════╝
  `);
});

export default app;
