/**
 * SQLite Database Configuration
 *
 * This module handles:
 * - Database connection initialization
 * - Table schema creation
 * - Database export for use in other modules
 *
 * SQLite is a file-based database, perfect for small to medium applications.
 * The database file is created automatically in the backend directory.
 */

// Import required dependencies
const sqlite3 = require('sqlite3').verbose(); // SQLite3 driver with verbose mode for detailed error messages
const path = require('path');                 // Node.js path module for file path operations

// ============================================
// DATABASE CONNECTION
// ============================================

/**
 * Database File Path
 * Constructs the absolute path to the SQLite database file
 * __dirname: Current directory (backend/)
 * Result: /path/to/backend/tasks.db
 */
const dbPath = path.join(__dirname, 'tasks.db');

/**
 * Initialize SQLite Database Connection
 *
 * Creates a new database connection. If tasks.db doesn't exist,
 * SQLite will automatically create it.
 *
 * The callback function handles connection success/failure
 */
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // Connection failed - log error and exit
    console.error('❌ Error opening database:', err.message);
    process.exit(1); // Exit the application if database fails
  } else {
    // Connection successful
    console.log('✅ Connected to SQLite database at:', dbPath);
  }
});

// ============================================
// DATABASE SCHEMA
// ============================================

/**
 * Create Tasks Table
 *
 * db.serialize() ensures all database operations inside execute sequentially
 * This prevents race conditions when initializing the database
 */
db.serialize(() => {
  /**
   * CREATE TABLE IF NOT EXISTS
   * This statement creates the tasks table only if it doesn't already exist
   * Safe to run every time the server starts
   *
   * Schema Breakdown:
   * ----------------
   * id: Unique identifier for each task
   *     - INTEGER: Numeric data type
   *     - PRIMARY KEY: Uniquely identifies each row
   *     - AUTOINCREMENT: Automatically generates sequential IDs (1, 2, 3...)
   *
   * title: Task title/name
   *     - TEXT: String data type (no length limit in SQLite)
   *     - NOT NULL: This field is required, cannot be empty
   *
   * description: Detailed task description
   *     - TEXT: String data type
   *     - Optional: Can be NULL (not specified means nullable)
   *
   * status: Current state of the task
   *     - TEXT: String data type
   *     - DEFAULT 'pending': New tasks start as 'pending'
   *     - CHECK(status IN ('pending', 'completed')): Validates only these two values allowed
   *
   * createdAt: When the task was created
   *     - DATETIME: Timestamp data type
   *     - DEFAULT CURRENT_TIMESTAMP: Automatically set to current date/time when row is inserted
   *
   * updatedAt: When the task was last modified
   *     - DATETIME: Timestamp data type
   *     - DEFAULT CURRENT_TIMESTAMP: Initially set to creation time
   *     - Updated manually in UPDATE queries
   */
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      // Table creation failed
      console.error('❌ Error creating tasks table:', err.message);
    } else {
      // Table created successfully or already exists
      console.log('✅ Tasks table ready');
    }
  });
});

// ============================================
// DATABASE EXPORT
// ============================================

/**
 * Export the database connection
 * This allows other modules (like routes/tasks.js) to import and use the database
 *
 * Usage in other files:
 * const db = require('./database');
 * db.all('SELECT * FROM tasks', [], (err, rows) => { ... });
 */
module.exports = db;
