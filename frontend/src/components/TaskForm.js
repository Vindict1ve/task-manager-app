/**
 * TaskForm Component
 *
 * A modern form for creating and editing tasks
 * Features:
 * - Create new tasks
 * - Edit existing tasks
 * - Form validation
 * - Loading states during submission
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, editingTask, onCancel, submitting }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Populate form when editing a task
   * Clear form when creating a new task
   */
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle form submission
   * Validates input and calls onSubmit prop
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate title
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    // Submit task data
    onSubmit({ title: title.trim(), description: description.trim() });

    // Clear form if creating new task
    if (!editingTask) {
      setTitle('');
      setDescription('');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 animate-slide-up">
      {/* Form Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {editingTask ? (
            <>
              <span className="text-blue-600">✎</span>
              Edit Task
            </>
          ) : (
            <>
              <span className="text-green-600">+</span>
              Create New Task
            </>
          )}
        </h2>
        {editingTask && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-smooth"
            type="button"
            title="Cancel editing"
          >
            ×
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-smooth text-gray-800 placeholder-gray-400"
            required
            disabled={submitting}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-smooth resize-none text-gray-800 placeholder-gray-400"
            disabled={submitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-smooth ${
              editingTask
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            } shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{editingTask ? '💾 Update Task' : '➕ Create Task'}</span>
              </>
            )}
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
