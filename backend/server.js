/**
 * Task Manager Backend Server
 *
 * This is the main Express server file that handles:
 * - Server initialization and configuration
 * - Middleware setup (CORS, body parsing)
 * - Route mounting
 * - Error handling
 * - Server startup
 */

// Import required dependencies
const express = require('express');           // Web framework for Node.js
const cors = require('cors');                 // Cross-Origin Resource Sharing middleware
const bodyParser = require('body-parser');    // Parse incoming request bodies
const taskRoutes = require('./routes/tasks'); // Task-related routes

// Initialize Express application
const app = express();

// Configure server port
// Uses environment variable PORT if available, otherwise defaults to 5000
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

/**
 * CORS Middleware
 * Enables Cross-Origin Resource Sharing to allow the frontend
 * (running on port 3000) to communicate with this backend (port 5000)
 * In production, you should restrict this to specific origins:
 * app.use(cors({ origin: 'https://yourdomain.com' }))
 */
app.use(cors());

/**
 * JSON Body Parser
 * Parses incoming requests with JSON payloads
 * Makes the parsed data available in req.body
 * Example: POST request with {"title": "Task 1"} becomes accessible via req.body.title
 */
app.use(bodyParser.json());

/**
 * URL-Encoded Body Parser
 * Parses incoming requests with URL-encoded payloads (form submissions)
 * extended: true allows for rich objects and arrays to be encoded
 */
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================
// ROUTE MOUNTING
// ============================================

/**
 * Mount task routes at /api/tasks
 * All routes defined in routes/tasks.js will be prefixed with /api/tasks
 * For example:
 * - GET /api/tasks -> lists all tasks
 * - POST /api/tasks -> creates a new task
 * - GET /api/tasks/:id -> gets a specific task
 */
app.use('/api/tasks', taskRoutes);

/**
 * Root Endpoint
 * Simple health check endpoint to verify the API is running
 * Access at: http://localhost:5000/
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global Error Handling Middleware
 * This middleware catches any errors that occur during request processing
 * It must be defined AFTER all other middleware and routes
 *
 * Parameters:
 * - err: The error object
 * - req: Request object
 * - res: Response object
 * - next: Next middleware function
 *
 * Note: The 'next' parameter is required even if unused,
 * so Express recognizes this as error-handling middleware
 */
app.use((err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error('Error occurred:', err.stack);

  // Send error response to client
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// SERVER STARTUP
// ============================================

/**
 * Start the Express server
 * Listens for incoming HTTP requests on the specified PORT
 * The callback function runs once the server successfully starts
 */
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Task Manager API Server`);
  console.log(`========================================`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/`);
  console.log(`Tasks API: http://localhost:${PORT}/api/tasks`);
  console.log(`========================================`);
});

// Export the app for testing purposes
module.exports = app;
