/**
 * TaskList Component
 *
 * Displays a list of all tasks with loading and empty states
 * Features:
 * - Loading spinner while fetching tasks
 * - Empty state when no tasks exist
 * - Responsive grid layout
 * - Task filtering display (all/pending/completed)
 */

import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onEdit, onDelete, onToggleStatus, loading }) {
  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Loading tasks...</p>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Tasks Yet
          </h3>
          <p className="text-gray-500 text-lg mb-6">
            Get started by creating your first task above. Stay organized and productive!
          </p>
          <div className="inline-block bg-blue-50 text-blue-700 px-6 py-3 rounded-lg">
            <p className="text-sm font-semibold">💡 Tip: Use the form above to add a task</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // TASKS LIST
  // ============================================

  return (
    <div className="animate-fade-in">
      {/* List Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-primary-600">📋</span>
          Your Tasks
        </h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow text-sm font-semibold text-gray-600">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <TaskItem
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
