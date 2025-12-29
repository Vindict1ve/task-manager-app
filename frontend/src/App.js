/**
 * Task Manager Application - Main Component
 *
 * This is the root component that manages the entire application state.
 * Features:
 * - Task CRUD operations (Create, Read, Update, Delete)
 * - Loading states for better UX
 * - Error and success notifications
 * - API integration with backend
 * - Modern responsive design with Tailwind CSS
 */

import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axios from 'axios';

// API endpoint - uses proxy configuration from package.json
const API_URL = '/api/tasks';

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [tasks, setTasks] = useState([]);              // Array of all tasks
  const [editingTask, setEditingTask] = useState(null);// Currently editing task (null if not editing)
  const [error, setError] = useState('');              // Error message
  const [success, setSuccess] = useState('');          // Success message
  const [loading, setLoading] = useState(true);        // Loading state for initial fetch
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions

  // ============================================
  // LIFECYCLE - FETCH TASKS ON MOUNT
  // ============================================

  useEffect(() => {
    fetchTasks();
  }, []);

  // ============================================
  // API FUNCTIONS
  // ============================================

  /**
   * Fetch all tasks from the backend
   * Called on component mount and after certain operations
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please check your connection.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, status)
   */
  const handleCreateTask = async (taskData) => {
    try {
      setSubmitting(true);
      const response = await axios.post(API_URL, taskData);
      setTasks([response.data.task, ...tasks]);
      showSuccess('Task created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   */
  const handleUpdateTask = async (id, taskData) => {
    try {
      setSubmitting(true);
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      setTasks(tasks.map(task => task.id === id ? response.data.task : task));
      setEditingTask(null);
      showSuccess('Task updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Delete a task
   * @param {number} id - Task ID to delete
   */
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
        showSuccess('Task deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  /**
   * Toggle task status between pending and completed
   * @param {Object} task - Task object to toggle
   */
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await handleUpdateTask(task.id, { status: newStatus });
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Show success message and auto-hide after 3 seconds
   * @param {string} message - Success message to display
   */
  const showSuccess = (message) => {
    setSuccess(message);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  /**
   * Dismiss error message
   */
  const dismissError = () => setError('');

  /**
   * Dismiss success message
   */
  const dismissSuccess = () => setSuccess('');

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ===== HEADER ===== */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl mb-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              ✓ Task Manager
            </h1>
            <p className="text-blue-100 text-lg">
              Organize your tasks efficiently and stay productive
            </p>
          </div>

          {/* Task Statistics */}
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <div className="bg-white rounded-lg shadow px-6 py-3">
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow px-6 py-3">
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow px-6 py-3">
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </header>

        {/* ===== NOTIFICATIONS ===== */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">⚠</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={dismissError}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
              <button
                onClick={dismissSuccess}
                className="text-green-500 hover:text-green-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ===== TASK FORM ===== */}
        <TaskForm
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
          submitting={submitting}
        />

        {/* ===== TASK LIST ===== */}
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
