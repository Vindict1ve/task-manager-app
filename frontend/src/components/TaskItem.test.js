/**
 * TaskItem Component Tests
 *
 * Tests for the TaskItem component including:
 * - Rendering different task states
 * - Action button functionality
 * - Date formatting
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    createdAt: '2025-12-29T10:30:00.000Z',
    updatedAt: '2025-12-29T10:30:00.000Z'
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onToggleStatus: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  test('renders pending task correctly', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
  });

  test('renders completed task correctly', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    render(<TaskItem task={completedTask} {...mockHandlers} />);

    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reopen/i })).toBeInTheDocument();
  });

  test('renders task without description', () => {
    const taskWithoutDesc = { ...mockTask, description: '' };
    render(<TaskItem task={taskWithoutDesc} {...mockHandlers} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('displays created date', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.getByText(/created:/i)).toBeInTheDocument();
  });

  test('shows updated date when different from created date', () => {
    const updatedTask = {
      ...mockTask,
      updatedAt: '2025-12-29T11:30:00.000Z'
    };
    render(<TaskItem task={updatedTask} {...mockHandlers} />);

    expect(screen.getByText(/created:/i)).toBeInTheDocument();
    expect(screen.getByText(/updated:/i)).toBeInTheDocument();
  });

  test('hides updated date when same as created date', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.getByText(/created:/i)).toBeInTheDocument();
    expect(screen.queryByText(/updated:/i)).not.toBeInTheDocument();
  });

  // ============================================
  // ACTION BUTTON TESTS
  // ============================================

  test('calls onToggleStatus when complete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const completeButton = screen.getByRole('button', { name: /complete/i });
    await user.click(completeButton);

    expect(mockHandlers.onToggleStatus).toHaveBeenCalledWith(mockTask);
  });

  test('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  // ============================================
  // VISUAL STATE TESTS
  // ============================================

  test('applies correct styling for pending task', () => {
    const { container } = render(<TaskItem task={mockTask} {...mockHandlers} />);

    const taskCard = container.querySelector('.border-yellow-500');
    expect(taskCard).toBeInTheDocument();
  });

  test('applies correct styling for completed task', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    const { container } = render(<TaskItem task={completedTask} {...mockHandlers} />);

    const taskCard = container.querySelector('.border-green-500');
    expect(taskCard).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test('has accessible button labels', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
