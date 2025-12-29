const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all tasks
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tasks ORDER BY createdAt DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// GET single task by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE id = ?';

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ task: row });
  });
});

// POST create new task
router.post('/', (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const sql = `
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `;
  const params = [title, description || '', status || 'pending'];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Fetch the created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ task: row });
    });
  });
});

// PUT update task
router.put('/:id', (req, res) => {
  const { title, description, status } = req.body;
  const updates = [];
  const params = [];

  if (title !== undefined) {
    updates.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (status !== undefined) {
    if (status !== 'pending' && status !== 'completed') {
      res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
      return;
    }
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  params.push(req.params.id);

  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Fetch the updated task
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ task: row });
    });
  });
});

// DELETE task
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM tasks WHERE id = ?';

  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
