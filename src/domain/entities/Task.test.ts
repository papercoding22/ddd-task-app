import { describe, it, expect, beforeEach } from 'vitest';
import { Task } from './Task';
import { TaskTitle } from '../valueObjects/TaskTitle';
import { TaskPriority } from '../valueObjects/TaskPriority';
import { UserId } from '../valueObjects/UserId';
import { TaskStatus } from '../valueObjects/TaskStatus';
import { TaskCompletedEvent } from '../events/TaskCompletedEvent';
import { TaskAssignedEvent } from '../events/TaskAssignedEvent';

describe('Task', () => {
  let task: Task;
  let userId: UserId;

  beforeEach(() => {
    const title = TaskTitle.create('Test Task');
    task = Task.create(title, TaskPriority.medium());
    userId = UserId.create('user-123');
  });

  describe('create', () => {
    it('should create a task with default values', () => {
      const title = TaskTitle.create('New Task');
      const newTask = Task.create(title);

      expect(newTask.title.toString()).toBe('New Task');
      expect(newTask.status.isTodo()).toBe(true);
      expect(newTask.priority.getLevel()).toBe(TaskPriority.medium().getLevel());
      expect(newTask.dependencies).toHaveLength(0);
      expect(newTask.assignment).toBeUndefined();
    });

    it('should create a task with custom priority', () => {
      const title = TaskTitle.create('High Priority Task');
      const newTask = Task.create(title, TaskPriority.high());

      expect(newTask.priority.getLevel()).toBe(TaskPriority.high().getLevel());
    });

    it('should create a task with due date', () => {
      const title = TaskTitle.create('Task with Due Date');
      const dueDate = new Date('2025-12-31');
      const newTask = Task.create(title, TaskPriority.medium(), dueDate);

      expect(newTask.dueDate).toEqual(dueDate);
    });
  });

  describe('assignTo', () => {
    it('should assign a task to a user', () => {
      const assignedBy = UserId.create('manager-456');
      task.assignTo(userId, assignedBy);

      expect(task.assignment).toBeDefined();
      expect(task.isAssignedTo(userId)).toBe(true);
    });

    it('should emit TaskAssignedEvent when assigned', () => {
      const assignedBy = UserId.create('manager-456');
      task.assignTo(userId, assignedBy);

      const events = task.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TaskAssignedEvent);
    });

    it('should throw error when assigning completed task', () => {
      task.assignTo(userId, userId);
      task.complete(userId);

      const anotherUser = UserId.create('user-789');
      expect(() => task.assignTo(anotherUser, userId)).toThrow(
        'Cannot assign completed task'
      );
    });
  });

  describe('complete', () => {
    it('should complete a task', () => {
      task.assignTo(userId, userId);
      task.complete(userId);

      expect(task.status.isDone()).toBe(true);
      expect(task.completedAt).toBeDefined();
    });

    it('should emit TaskCompletedEvent when completed', () => {
      task.assignTo(userId, userId);
      task.complete(userId);

      const events = task.pullDomainEvents();
      const completedEvents = events.filter(e => e instanceof TaskCompletedEvent);
      expect(completedEvents).toHaveLength(1);
    });

    it('should throw error when completing already completed task', () => {
      task.assignTo(userId, userId);
      task.complete(userId);

      expect(() => task.complete(userId)).toThrow('Task is already completed');
    });

    it('should throw error when non-assigned user tries to complete', () => {
      const assignedUser = UserId.create('assigned-user');
      const otherUser = UserId.create('other-user');

      task.assignTo(assignedUser, assignedUser);

      expect(() => task.complete(otherUser)).toThrow(
        'Only assigned user can complete this task'
      );
    });
  });

  describe('startProgress', () => {
    it('should start a task when assigned', () => {
      task.assignTo(userId, userId);
      task.startProgress(userId);

      expect(task.status.toString()).toBe('IN_PROGRESS');
    });

    it('should throw error when starting unassigned task', () => {
      expect(() => task.startProgress(userId)).toThrow(
        'Task must be assigned before starting'
      );
    });

    it('should throw error when non-todo task is started', () => {
      task.assignTo(userId, userId);
      task.startProgress(userId);

      expect(() => task.startProgress(userId)).toThrow(
        'Can only start tasks that are in TODO status'
      );
    });
  });

  describe('changePriority', () => {
    it('should change task priority', () => {
      task.changePriority(TaskPriority.high(), userId);

      expect(task.priority.getLevel()).toBe(TaskPriority.high().getLevel());
    });

    it('should emit escalation event when priority increases', () => {
      task.changePriority(TaskPriority.high(), userId);

      const events = task.pullDomainEvents();
      expect(events.length).toBeGreaterThan(0);
    });

    it('should throw error when changing priority of completed task', () => {
      task.assignTo(userId, userId);
      task.complete(userId);

      expect(() => task.changePriority(TaskPriority.high(), userId)).toThrow(
        'Cannot change priority of completed task'
      );
    });
  });

  describe('isOverdue', () => {
    it('should return false when no due date is set', () => {
      expect(task.isOverdue()).toBe(false);
    });

    it('should return false when task is completed', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const title = TaskTitle.create('Overdue Task');
      const overdueTask = Task.create(title, TaskPriority.medium(), pastDate);

      overdueTask.assignTo(userId, userId);
      overdueTask.complete(userId);

      expect(overdueTask.isOverdue()).toBe(false);
    });

    it('should return true when past due date and not completed', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const title = TaskTitle.create('Overdue Task');
      const overdueTask = Task.create(title, TaskPriority.medium(), pastDate);

      expect(overdueTask.isOverdue()).toBe(true);
    });
  });

  describe('pullDomainEvents', () => {
    it('should return and clear domain events', () => {
      task.assignTo(userId, userId);

      const events = task.pullDomainEvents();
      expect(events).toHaveLength(1);

      const secondPull = task.pullDomainEvents();
      expect(secondPull).toHaveLength(0);
    });
  });
});
