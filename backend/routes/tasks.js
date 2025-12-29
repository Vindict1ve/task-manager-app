/**
 * Task Routes Module
 *
 * This module defines all RESTful API endpoints for task management.
 * Implements CRUD operations: Create, Read, Update, Delete
 *
 * All routes are prefixed with /api/tasks (defined in server.js)
 *
 * Endpoints:
 * - GET    /api/tasks       - Retrieve all tasks
 * - GET    /api/tasks/:id   - Retrieve a single task by ID
 * - POST   /api/tasks       - Create a new task
 * - PUT    /api/tasks/:id   - Update an existing task
 * - DELETE /api/tasks/:id   - Delete a task
 */

// Import required dependencies
const express = require('express');  // Express framework
const router = express.Router();     // Create a new router instance
const db = require('../database');   // Import the SQLite database connection

// ============================================
// GET ALL TASKS
// ============================================

/**
 * GET /api/tasks
 *
 * Retrieves all tasks from the database, ordered by creation date (newest first)
 *
 * Request: No body or parameters required
 *
 * Response:
 * - Status 200: Success
 *   {
 *     "tasks": [
 *       {
 *         "id": 1,
 *         "title": "Task title",
 *         "description": "Task description",
 *         "status": "pending",
 *         "createdAt": "2025-12-29 10:30:00",
 *         "updatedAt": "2025-12-29 10:30:00"
 *       },
 *       ...
 *     ]
 *   }
 *
 * - Status 500: Database error
 *   { "error": "error message" }
 */
router.get('/', (req, res) => {
  // SQL query to select all tasks, ordered by most recent first
  const sql = 'SELECT * FROM tasks ORDER BY createdAt DESC';

  /**
   * db.all() - Retrieves all rows that match the query
   *
   * Parameters:
   * 1. sql: The SQL query string
   * 2. []: Array of parameters for parameterized queries (empty here since no placeholders)
   * 3. callback: Function called when query completes
   *    - err: Error object if query failed
   *    - rows: Array of result objects
   */
  db.all(sql, [], (err, rows) => {
    if (err) {
      // Database error occurred
      console.error('GET /api/tasks - Database error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    // Success - return all tasks
    res.json({ tasks: rows });
  });
});

// ============================================
// GET SINGLE TASK BY ID
// ============================================

/**
 * GET /api/tasks/:id
 *
 * Retrieves a specific task by its ID
 *
 * Request:
 * - URL Parameter: id (task ID)
 *   Example: GET /api/tasks/5
 *
 * Response:
 * - Status 200: Success
 *   {
 *     "task": {
 *       "id": 5,
 *       "title": "Task title",
 *       "description": "Task description",
 *       "status": "pending",
 *       "createdAt": "2025-12-29 10:30:00",
 *       "updatedAt": "2025-12-29 10:30:00"
 *     }
 *   }
 *
 * - Status 404: Task not found
 *   { "error": "Task not found" }
 *
 * - Status 500: Database error
 *   { "error": "error message" }
 */
router.get('/:id', (req, res) => {
  /**
   * SQL query with parameterized placeholder (?)
   * The ? is replaced with the actual value from the params array
   * This prevents SQL injection attacks
   */
  const sql = 'SELECT * FROM tasks WHERE id = ?';

  /**
   * db.get() - Retrieves a single row (first match)
   *
   * Parameters:
   * 1. sql: The SQL query with placeholders
   * 2. [req.params.id]: Array of values to replace placeholders
   *    - req.params.id comes from the URL parameter :id
   * 3. callback: Function called when query completes
   *    - err: Error object if query failed
   *    - row: Single result object (or undefined if no match)
   */
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      // Database error occurred
      console.error(`GET /api/tasks/${req.params.id} - Database error:`, err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      // No task found with this ID
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Success - return the task
    res.json({ task: row });
  });
});

// ============================================
// CREATE NEW TASK
// ============================================

/**
 * POST /api/tasks
 *
 * Creates a new task in the database
 *
 * Request Body:
 * {
 *   "title": "Task title",           // Required
 *   "description": "Task details",   // Optional
 *   "status": "pending"              // Optional, defaults to "pending"
 * }
 *
 * Response:
 * - Status 201: Created successfully
 *   {
 *     "task": {
 *       "id": 6,
 *       "title": "Task title",
 *       "description": "Task details",
 *       "status": "pending",
 *       "createdAt": "2025-12-29 10:30:00",
 *       "updatedAt": "2025-12-29 10:30:00"
 *     }
 *   }
 *
 * - Status 400: Validation error
 *   { "error": "Title is required" }
 *
 * - Status 500: Database error
 *   { "error": "error message" }
 */
router.post('/', (req, res) => {
  /**
   * Extract data from request body
   * body-parser middleware (configured in server.js) parses the JSON
   * and makes it available as req.body
   */
  const { title, description, status } = req.body;

  // ============================================
  // INPUT VALIDATION
  // ============================================

  /**
   * Validate required field: title
   * Check if title exists and is not empty/whitespace
   */
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  /**
   * Validate status if provided
   * Must be either 'pending' or 'completed'
   */
  if (status && status !== 'pending' && status !== 'completed') {
    res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
    return;
  }

  // ============================================
  // DATABASE INSERTION
  // ============================================

  /**
   * SQL INSERT statement with parameterized placeholders
   * Creates a new row in the tasks table
   */
  const sql = `
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `;

  /**
   * Prepare parameters for the SQL query
   * - title: User-provided title
   * - description: User-provided description or empty string if not provided
   * - status: User-provided status or 'pending' as default
   */
  const params = [
    title.trim(),
    description ? description.trim() : '',
    status || 'pending'
  ];

  /**
   * db.run() - Executes a query that doesn't return rows (INSERT, UPDATE, DELETE)
   *
   * IMPORTANT: Use function(err) NOT arrow function (err) =>
   * We need 'this' context to access this.lastID (the ID of inserted row)
   * Arrow functions don't have their own 'this' context
   *
   * Parameters:
   * 1. sql: The SQL query with placeholders
   * 2. params: Array of values to replace placeholders
   * 3. callback: Function called when query completes
   *    - this.lastID: The ID of the newly inserted row
   *    - this.changes: Number of rows affected
   */
  db.run(sql, params, function(err) {
    if (err) {
      // Database error during insertion
      console.error('POST /api/tasks - Database error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    /**
     * Fetch the newly created task to return it to the client
     * this.lastID contains the auto-incremented ID of the inserted row
     *
     * We retrieve the full task object to include auto-generated fields
     * (id, createdAt, updatedAt) in the response
     */
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        // Error fetching the created task
        console.error('POST /api/tasks - Error fetching created task:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      // Success - return the created task with status 201 (Created)
      res.status(201).json({ task: row });
    });
  });
});

// ============================================
// UPDATE TASK
// ============================================

/**
 * PUT /api/tasks/:id
 *
 * Updates an existing task with new data
 * Supports partial updates - only provided fields are updated
 *
 * Request:
 * - URL Parameter: id (task ID to update)
 * - Body (all fields optional):
 *   {
 *     "title": "Updated title",
 *     "description": "Updated description",
 *     "status": "completed"
 *   }
 *
 * Response:
 * - Status 200: Updated successfully
 *   {
 *     "task": {
 *       "id": 5,
 *       "title": "Updated title",
 *       "description": "Updated description",
 *       "status": "completed",
 *       "createdAt": "2025-12-29 10:30:00",
 *       "updatedAt": "2025-12-29 11:45:00"  // Updated timestamp
 *     }
 *   }
 *
 * - Status 400: Validation error
 *   { "error": "No fields to update" }
 *   { "error": "Status must be either 'pending' or 'completed'" }
 *
 * - Status 404: Task not found
 *   { "error": "Task not found" }
 *
 * - Status 500: Database error
 *   { "error": "error message" }
 */
router.put('/:id', (req, res) => {
  /**
   * Extract potential update fields from request body
   */
  const { title, description, status } = req.body;

  // ============================================
  // DYNAMIC QUERY BUILDING
  // ============================================

  /**
   * Build UPDATE query dynamically based on provided fields
   * This allows partial updates - clients can update just title, or just status, etc.
   *
   * We build two arrays:
   * 1. updates: Array of "field = ?" strings for the SQL SET clause
   * 2. params: Array of values to replace the ? placeholders
   */
  const updates = [];
  const params = [];

  /**
   * Check each field and add to update query if provided
   * Using !== undefined allows updating to empty string if needed
   */

  // Update title if provided
  if (title !== undefined) {
    // Validate title is not empty
    if (title.trim() === '') {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }
    updates.push('title = ?');
    params.push(title.trim());
  }

  // Update description if provided
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description.trim());
  }

  // Update status if provided
  if (status !== undefined) {
    /**
     * INPUT VALIDATION: Validate status value
     * Must be either 'pending' or 'completed'
     */
    if (status !== 'pending' && status !== 'completed') {
      res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
      return;
    }
    updates.push('status = ?');
    params.push(status);
  }

  /**
   * Validate that at least one field was provided for update
   * If the updates array is empty, no fields were provided
   */
  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  /**
   * Always update the updatedAt timestamp
   * This tracks when the task was last modified
   */
  updates.push('updatedAt = CURRENT_TIMESTAMP');

  /**
   * Add the task ID as the final parameter
   * This is used in the WHERE clause to identify which task to update
   */
  params.push(req.params.id);

  // ============================================
  // EXECUTE UPDATE
  // ============================================

  /**
   * Build the final SQL UPDATE statement
   * Example result: "UPDATE tasks SET title = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?"
   *
   * updates.join(', ') combines array elements with commas:
   * ['title = ?', 'status = ?'] becomes 'title = ?, status = ?'
   */
  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

  /**
   * Execute the UPDATE query
   * Using regular function for 'this' context access
   */
  db.run(sql, params, function(err) {
    if (err) {
      // Database error during update
      console.error(`PUT /api/tasks/${req.params.id} - Database error:`, err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    /**
     * Check if any rows were actually updated
     * this.changes = 0 means no rows matched the WHERE clause (task ID not found)
     */
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    /**
     * Fetch and return the updated task
     * This ensures the client gets the latest data including the updated timestamp
     */
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        // Error fetching the updated task
        console.error(`PUT /api/tasks/${req.params.id} - Error fetching updated task:`, err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      // Success - return the updated task
      res.json({ task: row });
    });
  });
});

// ============================================
// DELETE TASK
// ============================================

/**
 * DELETE /api/tasks/:id
 *
 * Permanently deletes a task from the database
 *
 * Request:
 * - URL Parameter: id (task ID to delete)
 *   Example: DELETE /api/tasks/5
 *
 * Response:
 * - Status 200: Deleted successfully
 *   { "message": "Task deleted successfully" }
 *
 * - Status 404: Task not found
 *   { "error": "Task not found" }
 *
 * - Status 500: Database error
 *   { "error": "error message" }
 *
 * Note: This is a permanent deletion. Consider implementing soft deletes
 * (marking as deleted rather than removing) for production applications.
 */
router.delete('/:id', (req, res) => {
  /**
   * SQL DELETE statement with parameterized placeholder
   * Removes the row with the matching ID from the tasks table
   */
  const sql = 'DELETE FROM tasks WHERE id = ?';

  /**
   * Execute the DELETE query
   * Using regular function for 'this' context access
   *
   * Parameters:
   * 1. sql: The DELETE query with placeholder
   * 2. [req.params.id]: The task ID from URL parameter
   * 3. callback: Function called when deletion completes
   *    - this.changes: Number of rows deleted (0 or 1)
   */
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      // Database error during deletion
      console.error(`DELETE /api/tasks/${req.params.id} - Database error:`, err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    /**
     * Check if any rows were actually deleted
     * this.changes = 0 means no rows matched the WHERE clause (task ID not found)
     * this.changes = 1 means one row was successfully deleted
     */
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Success - task was deleted
    res.json({
      message: 'Task deleted successfully',
      deletedId: parseInt(req.params.id)
    });
  });
});

// ============================================
// EXPORT ROUTER
// ============================================

/**
 * Export the router so it can be imported in server.js
 * This makes all the routes defined above available to the Express app
 */
module.exports = router;
