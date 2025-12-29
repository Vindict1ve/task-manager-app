/**
 * App Component Tests
 *
 * Integration tests for the main App component including:
 * - Rendering
 * - Task statistics
 * - Error handling
 * - Loading states
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  test('renders app header', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    expect(screen.getByText(/task manager/i)).toBeInTheDocument();
    expect(screen.getByText(/organize your tasks efficiently/i)).toBeInTheDocument();
  });

  test('renders task statistics', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/total tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // LOADING STATE TESTS
  // ============================================

  test('shows loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  test('hides loading state after tasks are fetched', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });
  });

  // ============================================
  // TASK STATISTICS TESTS
  // ============================================

  test('calculates total tasks correctly', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 2, title: 'Task 2', status: 'completed', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 3, title: 'Task 3', status: 'pending', createdAt: '2025-12-29', updatedAt: '2025-12-29' }
    ];

    axios.get.mockResolvedValueOnce({ data: { tasks: mockTasks } });

    render(<App />);

    await waitFor(() => {
      const totalTasksElements = screen.getAllByText('3');
      expect(totalTasksElements.length).toBeGreaterThan(0);
    });
  });

  test('calculates pending tasks correctly', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 2, title: 'Task 2', status: 'completed', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 3, title: 'Task 3', status: 'pending', createdAt: '2025-12-29', updatedAt: '2025-12-29' }
    ];

    axios.get.mockResolvedValueOnce({ data: { tasks: mockTasks } });

    render(<App />);

    await waitFor(() => {
      // Find the pending count (should be 2)
      const pendingSection = screen.getByText(/pending/i).closest('div');
      expect(pendingSection).toHaveTextContent('2');
    });
  });

  test('calculates completed tasks correctly', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 2, title: 'Task 2', status: 'completed', createdAt: '2025-12-29', updatedAt: '2025-12-29' },
      { id: 3, title: 'Task 3', status: 'completed', createdAt: '2025-12-29', updatedAt: '2025-12-29' }
    ];

    axios.get.mockResolvedValueOnce({ data: { tasks: mockTasks } });

    render(<App />);

    await waitFor(() => {
      // Find the completed count (should be 2)
      const completedSection = screen.getByText(/completed/i).closest('div');
      expect(completedSection).toHaveTextContent('2');
    });
  });

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================

  test('displays error message when fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks exist', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // COMPONENT PRESENCE TESTS
  // ============================================

  test('renders TaskForm component', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  test('renders create task button', async () => {
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    });
  });
});
