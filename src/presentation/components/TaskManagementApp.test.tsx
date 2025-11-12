import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManagementApp } from './TaskManagementApp';
import { Task } from '../../domain/entities/Task';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle';
import { TaskPriority } from '../../domain/valueObjects/TaskPriority';

// Mock the useTaskManagement hook
vi.mock('../hooks/useTaskManagement', () => ({
  useTaskManagement: vi.fn(),
}));

import { useTaskManagement } from '../hooks/useTaskManagement';

describe('TaskManagementApp', () => {
  const mockCreateTask = vi.fn();
  const mockAssignTask = vi.fn();
  const mockCompleteTask = vi.fn();
  const mockReopenTask = vi.fn();
  const mockClearEventLog = vi.fn();
  const mockRefreshTasks = vi.fn();

  const defaultHookReturn = {
    tasks: [],
    loading: false,
    error: null,
    eventLog: [],
    createTask: mockCreateTask,
    assignTask: mockAssignTask,
    completeTask: mockCompleteTask,
    reopenTask: mockReopenTask,
    clearEventLog: mockClearEventLog,
    refreshTasks: mockRefreshTasks,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTaskManagement).mockReturnValue(defaultHookReturn);
  });

  describe('Initial Render', () => {
    it('should render the app header', () => {
      render(<TaskManagementApp />);

      expect(screen.getByText('Task Management System')).toBeInTheDocument();
      expect(screen.getByText('Domain-Driven Design + Domain Events Demo')).toBeInTheDocument();
    });

    it('should render the create task form', () => {
      render(<TaskManagementApp />);

      expect(screen.getByPlaceholderText('Enter task title...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    });

    it('should show loading state when loading', () => {
      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        loading: true,
      });

      render(<TaskManagementApp />);

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    it('should show empty state when no tasks exist', () => {
      render(<TaskManagementApp />);

      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first task above to get started!')).toBeInTheDocument();
    });
  });

  describe('Create Task', () => {
    it('should call createTask when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TaskManagementApp />);

      const input = screen.getByPlaceholderText('Enter task title...');
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(input, 'New Test Task');
      await user.click(submitButton);

      expect(mockCreateTask).toHaveBeenCalledWith('New Test Task', 'medium');
    });

    it('should clear input after successful task creation', async () => {
      const user = userEvent.setup();
      mockCreateTask.mockResolvedValue(undefined);

      render(<TaskManagementApp />);

      const input = screen.getByPlaceholderText('Enter task title...') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(input, 'New Test Task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should not submit empty task title', async () => {
      const user = userEvent.setup();
      render(<TaskManagementApp />);

      const submitButton = screen.getByRole('button', { name: /create task/i });
      await user.click(submitButton);

      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it('should create task with selected priority', async () => {
      const user = userEvent.setup();
      render(<TaskManagementApp />);

      const input = screen.getByPlaceholderText('Enter task title...');
      const prioritySelect = screen.getByRole('combobox');
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(input, 'High Priority Task');
      await user.selectOptions(prioritySelect, 'high');
      await user.click(submitButton);

      expect(mockCreateTask).toHaveBeenCalledWith('High Priority Task', 'high');
    });
  });

  describe('Task List Display', () => {
    it('should render tasks when they exist', () => {
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks: [task],
      });

      render(<TaskManagementApp />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('should display task count', () => {
      const tasks = [
        Task.create(TaskTitle.create('Task 1'), TaskPriority.medium()),
        Task.create(TaskTitle.create('Task 2'), TaskPriority.high()),
        Task.create(TaskTitle.create('Task 3'), TaskPriority.low()),
      ];

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks,
      });

      render(<TaskManagementApp />);

      expect(screen.getByText('Tasks (3)')).toBeInTheDocument();
    });

    it('should show completed and active task counts', () => {
      const task1 = Task.create(TaskTitle.create('Active Task'), TaskPriority.medium());
      const task2 = Task.create(TaskTitle.create('Completed Task'), TaskPriority.medium());
      task2.complete(task2.id as any); // Simulating completion

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks: [task1, task2],
      });

      render(<TaskManagementApp />);

      // Check for active and completed counts in badges
      const badges = screen.getAllByText(/\d+ (Active|Completed)/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Task Actions', () => {
    it('should show assign button for unassigned tasks', () => {
      const task = Task.create(TaskTitle.create('Unassigned Task'), TaskPriority.medium());

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks: [task],
      });

      render(<TaskManagementApp />);

      expect(screen.getByRole('button', { name: /assign to me/i })).toBeInTheDocument();
    });

    it('should call assignTask when assign button is clicked', async () => {
      const user = userEvent.setup();
      const task = Task.create(TaskTitle.create('Task to Assign'), TaskPriority.medium());

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks: [task],
      });

      render(<TaskManagementApp />);

      const assignButton = screen.getByRole('button', { name: /assign to me/i });
      await user.click(assignButton);

      expect(mockAssignTask).toHaveBeenCalledWith(task.id.toString(), 'user-123');
    });

    it('should call completeTask when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const task = Task.create(TaskTitle.create('Task to Complete'), TaskPriority.medium());

      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        tasks: [task],
      });

      render(<TaskManagementApp />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(mockCompleteTask).toHaveBeenCalledWith(task.id.toString());
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        error: 'Something went wrong',
      });

      render(<TaskManagementApp />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Event Log', () => {
    it('should render event log panel', () => {
      render(<TaskManagementApp />);

      expect(screen.getByText('Domain Events')).toBeInTheDocument();
    });

    it('should display events when they exist', () => {
      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        eventLog: ['[12:00:00] TaskCreated', '[12:01:00] TaskAssigned'],
      });

      render(<TaskManagementApp />);

      expect(screen.getByText('[12:00:00] TaskCreated')).toBeInTheDocument();
      expect(screen.getByText('[12:01:00] TaskAssigned')).toBeInTheDocument();
    });

    it('should show empty state when no events exist', () => {
      render(<TaskManagementApp />);

      expect(screen.getByText('No events yet')).toBeInTheDocument();
    });

    it('should call clearEventLog when clear button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(useTaskManagement).mockReturnValue({
        ...defaultHookReturn,
        eventLog: ['[12:00:00] TaskCreated'],
      });

      render(<TaskManagementApp />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockClearEventLog).toHaveBeenCalled();
    });

    it('should toggle event log visibility', async () => {
      const user = userEvent.setup();
      render(<TaskManagementApp />);

      const toggleButton = screen.getByRole('button', { name: /hide/i });
      await user.click(toggleButton);

      expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument();
    });
  });
});
