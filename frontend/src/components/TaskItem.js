/**
 * TaskItem Component
 *
 * Displays an individual task with actions
 * Features:
 * - Status indicator (pending/completed)
 * - Edit and delete actions
 * - Toggle status functionality
 * - Responsive card design
 * - Hover effects
 * - Date formatting
 */

import React from 'react';

function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Format date to a readable string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============================================
  // RENDER
  // ============================================

  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md hover:shadow-xl
        transition-all duration-200 overflow-hidden
        border-l-4 ${isCompleted ? 'border-green-500' : 'border-yellow-500'}
      `}
    >
      <div className="p-6">
        {/* Header with Title and Status */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {task.title}
            </h3>
          </div>

          {/* Status Badge */}
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }
            `}
          >
            {isCompleted ? '✓ Completed' : '○ Pending'}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📅</span>
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
          {task.updatedAt !== task.createdAt && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">✏️</span>
              <span>Updated: {formatDate(task.updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Toggle Status Button */}
          <button
            onClick={() => onToggleStatus(task)}
            className={`
              flex-1 min-w-[120px] px-4 py-2 rounded-lg font-semibold
              transition-smooth flex items-center justify-center gap-2
              ${isCompleted
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <>
                <span>↩️</span>
                <span>Reopen</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Complete</span>
              </>
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-smooth flex items-center gap-2"
            title="Edit task"
          >
            <span>✎</span>
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-smooth flex items-center gap-2"
            title="Delete task"
          >
            <span>🗑</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
