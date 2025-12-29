/**
 * Task API Endpoint Tests
 *
 * Comprehensive tests for all task-related API endpoints
 * Tests cover:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Input validation
 * - Error handling
 * - Edge cases
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('../routes/tasks');
const db = require('../database');

// Create test app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/tasks', taskRoutes);

// ============================================
// TEST SETUP AND TEARDOWN
// ============================================

/**
 * Before all tests: Clear the database
 */
beforeAll((done) => {
  db.run('DELETE FROM tasks', done);
});

/**
 * After each test: Clean up the database
 */
afterEach((done) => {
  db.run('DELETE FROM tasks', done);
});

/**
 * After all tests: Close database connection
 */
afterAll((done) => {
  db.close(done);
});

// ============================================
// POST /api/tasks - CREATE TASK TESTS
// ============================================

describe('POST /api/tasks', () => {
  test('should create a new task with valid data', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'Test Description'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('task');
    expect(response.body.task).toHaveProperty('id');
    expect(response.body.task.title).toBe(newTask.title);
    expect(response.body.task.description).toBe(newTask.description);
    expect(response.body.task.status).toBe('pending');
    expect(response.body.task).toHaveProperty('createdAt');
    expect(response.body.task).toHaveProperty('updatedAt');
  });

  test('should create a task without description', async () => {
    const newTask = {
      title: 'Task without description'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body.task.title).toBe(newTask.title);
    expect(response.body.task.description).toBe('');
  });

  test('should create a task with completed status', async () => {
    const newTask = {
      title: 'Completed Task',
      description: 'Already done',
      status: 'completed'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body.task.status).toBe('completed');
  });

  test('should fail when title is missing', async () => {
    const newTask = {
      description: 'No title provided'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Title is required');
  });

  test('should fail when title is empty string', async () => {
    const newTask = {
      title: '   ',
      description: 'Empty title'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(400);

    expect(response.body.error).toBe('Title is required');
  });

  test('should fail with invalid status', async () => {
    const newTask = {
      title: 'Invalid Status Task',
      status: 'invalid-status'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(400);

    expect(response.body.error).toBe('Status must be either "pending" or "completed"');
  });

  test('should trim whitespace from title and description', async () => {
    const newTask = {
      title: '  Trim Test  ',
      description: '  Trim Description  '
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body.task.title).toBe('Trim Test');
    expect(response.body.task.description).toBe('Trim Description');
  });
});

// ============================================
// GET /api/tasks - READ ALL TASKS TESTS
// ============================================

describe('GET /api/tasks', () => {
  test('should return empty array when no tasks exist', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('tasks');
    expect(response.body.tasks).toEqual([]);
  });

  test('should return all tasks', async () => {
    // Create test tasks
    await request(app).post('/api/tasks').send({ title: 'Task 1' });
    await request(app).post('/api/tasks').send({ title: 'Task 2' });
    await request(app).post('/api/tasks').send({ title: 'Task 3' });

    const response = await request(app)
      .get('/api/tasks')
      .expect(200);

    expect(response.body.tasks).toHaveLength(3);
  });

  test('should return tasks ordered by creation date (newest first)', async () => {
    // Create tasks with delay to ensure different timestamps
    await request(app).post('/api/tasks').send({ title: 'First Task' });
    await new Promise(resolve => setTimeout(resolve, 10));
    await request(app).post('/api/tasks').send({ title: 'Second Task' });
    await new Promise(resolve => setTimeout(resolve, 10));
    await request(app).post('/api/tasks').send({ title: 'Third Task' });

    const response = await request(app)
      .get('/api/tasks')
      .expect(200);

    // Newest task should be first
    expect(response.body.tasks[0].title).toBe('Third Task');
    expect(response.body.tasks[2].title).toBe('First Task');
  });
});

// ============================================
// GET /api/tasks/:id - READ SINGLE TASK TESTS
// ============================================

describe('GET /api/tasks/:id', () => {
  test('should return a specific task by ID', async () => {
    // Create a task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Specific Task', description: 'Find me' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(200);

    expect(response.body).toHaveProperty('task');
    expect(response.body.task.id).toBe(taskId);
    expect(response.body.task.title).toBe('Specific Task');
  });

  test('should return 404 for non-existent task', async () => {
    const response = await request(app)
      .get('/api/tasks/99999')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Task not found');
  });
});

// ============================================
// PUT /api/tasks/:id - UPDATE TASK TESTS
// ============================================

describe('PUT /api/tasks/:id', () => {
  test('should update task title', async () => {
    // Create a task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Original Title' });

    const taskId = createResponse.body.task.id;

    // Update the task
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Title' })
      .expect(200);

    expect(response.body.task.title).toBe('Updated Title');
    expect(response.body.task.id).toBe(taskId);
  });

  test('should update task description', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task', description: 'Original' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ description: 'Updated Description' })
      .expect(200);

    expect(response.body.task.description).toBe('Updated Description');
    expect(response.body.task.title).toBe('Task'); // Title unchanged
  });

  test('should update task status', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'completed' })
      .expect(200);

    expect(response.body.task.status).toBe('completed');
  });

  test('should update multiple fields at once', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Original', description: 'Original Desc' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'New Title',
        description: 'New Description',
        status: 'completed'
      })
      .expect(200);

    expect(response.body.task.title).toBe('New Title');
    expect(response.body.task.description).toBe('New Description');
    expect(response.body.task.status).toBe('completed');
  });

  test('should update updatedAt timestamp', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task' });

    const taskId = createResponse.body.task.id;
    const originalUpdatedAt = createResponse.body.task.updatedAt;

    // Wait to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task' })
      .expect(200);

    expect(response.body.task.updatedAt).not.toBe(originalUpdatedAt);
  });

  test('should fail when updating with empty title', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: '   ' })
      .expect(400);

    expect(response.body.error).toBe('Title cannot be empty');
  });

  test('should fail with invalid status', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'invalid' })
      .expect(400);

    expect(response.body.error).toBe('Status must be either "pending" or "completed"');
  });

  test('should fail when no fields provided', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task' });

    const taskId = createResponse.body.task.id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({})
      .expect(400);

    expect(response.body.error).toBe('No fields to update');
  });

  test('should return 404 for non-existent task', async () => {
    const response = await request(app)
      .put('/api/tasks/99999')
      .send({ title: 'Updated' })
      .expect(404);

    expect(response.body.error).toBe('Task not found');
  });
});

// ============================================
// DELETE /api/tasks/:id - DELETE TASK TESTS
// ============================================

describe('DELETE /api/tasks/:id', () => {
  test('should delete a task', async () => {
    // Create a task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task to Delete' });

    const taskId = createResponse.body.task.id;

    // Delete the task
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Task deleted successfully');
    expect(response.body.deletedId).toBe(taskId);

    // Verify task is deleted
    await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(404);
  });

  test('should return 404 when deleting non-existent task', async () => {
    const response = await request(app)
      .delete('/api/tasks/99999')
      .expect(404);

    expect(response.body.error).toBe('Task not found');
  });

  test('should not affect other tasks when deleting one task', async () => {
    // Create multiple tasks
    const task1 = await request(app).post('/api/tasks').send({ title: 'Task 1' });
    const task2 = await request(app).post('/api/tasks').send({ title: 'Task 2' });
    const task3 = await request(app).post('/api/tasks').send({ title: 'Task 3' });

    // Delete middle task
    await request(app)
      .delete(`/api/tasks/${task2.body.task.id}`)
      .expect(200);

    // Verify other tasks still exist
    const allTasks = await request(app).get('/api/tasks');
    expect(allTasks.body.tasks).toHaveLength(2);
    expect(allTasks.body.tasks.some(t => t.id === task1.body.task.id)).toBe(true);
    expect(allTasks.body.tasks.some(t => t.id === task3.body.task.id)).toBe(true);
  });
});

// ============================================
// INTEGRATION TESTS - COMPLETE WORKFLOWS
// ============================================

describe('Complete Task Workflows', () => {
  test('should handle complete CRUD lifecycle', async () => {
    // CREATE
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Lifecycle Task', description: 'Test CRUD' })
      .expect(201);

    const taskId = createResponse.body.task.id;
    expect(createResponse.body.task.status).toBe('pending');

    // READ
    const readResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(200);

    expect(readResponse.body.task.title).toBe('Lifecycle Task');

    // UPDATE
    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'completed' })
      .expect(200);

    expect(updateResponse.body.task.status).toBe('completed');

    // DELETE
    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .expect(200);

    // VERIFY DELETION
    await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(404);
  });

  test('should handle multiple simultaneous operations', async () => {
    // Create multiple tasks simultaneously
    const promises = [];
    for (let i = 1; i <= 5; i++) {
      promises.push(
        request(app).post('/api/tasks').send({ title: `Task ${i}` })
      );
    }

    const responses = await Promise.all(promises);

    // All should succeed
    responses.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body.task).toHaveProperty('id');
    });

    // Verify all tasks exist
    const allTasks = await request(app).get('/api/tasks');
    expect(allTasks.body.tasks).toHaveLength(5);
  });
});
