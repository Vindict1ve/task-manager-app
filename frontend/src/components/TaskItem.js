import React from 'react';

function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <li className={`task-item ${task.status}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${task.status}`}>
          {task.status.toUpperCase()}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div>Created: {formatDate(task.createdAt)}</div>
        {task.updatedAt !== task.createdAt && (
          <div>Updated: {formatDate(task.updatedAt)}</div>
        )}
      </div>

      <div className="task-actions">
        <button
          onClick={() => onToggleStatus(task)}
          className={`btn ${task.status === 'pending' ? 'btn-success' : 'btn-secondary'}`}
        >
          {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="btn btn-primary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
