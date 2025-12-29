/**
 * TaskForm Component Tests
 *
 * Tests for the TaskForm component functionality including:
 * - Rendering
 * - Form submission
 * - Validation
 * - Edit mode
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  test('renders create form by default', () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    expect(screen.getByText(/create new task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('renders edit form when editingTask is provided', () => {
    const editingTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description'
    };

    render(
      <TaskForm
        onSubmit={jest.fn()}
        editingTask={editingTask}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  // ============================================
  // FORM SUBMISSION TESTS
  // ============================================

  test('calls onSubmit with form data when creating task', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description'
    });
  });

  test('trims whitespace from inputs', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, '  Trimmed Title  ');
    await user.type(descriptionInput, '  Trimmed Description  ');
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Trimmed Title',
      description: 'Trimmed Description'
    });
  });

  test('clears form after successful submission', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================

  test('shows alert when title is empty', async () => {
    const mockSubmit = jest.fn();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Title is required');
    expect(mockSubmit).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  test('allows submission with empty description', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Task without description');
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Task without description',
      description: ''
    });
  });

  // ============================================
  // EDIT MODE TESTS
  // ============================================

  test('populates form with editing task data', () => {
    const editingTask = {
      id: 1,
      title: 'Edit This',
      description: 'Edit Description'
    };

    render(
      <TaskForm
        onSubmit={jest.fn()}
        editingTask={editingTask}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('Edit This')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Description')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const mockCancel = jest.fn();
    const user = userEvent.setup();
    const editingTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description'
    };

    render(
      <TaskForm
        onSubmit={jest.fn()}
        editingTask={editingTask}
        onCancel={mockCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });

  // ============================================
  // LOADING STATE TESTS
  // ============================================

  test('disables inputs when submitting', () => {
    render(<TaskForm onSubmit={jest.fn()} submitting={true} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /processing/i });

    expect(titleInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('shows processing text when submitting', () => {
    render(<TaskForm onSubmit={jest.fn()} submitting={true} />);

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });
});
