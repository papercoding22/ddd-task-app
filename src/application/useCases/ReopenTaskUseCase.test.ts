import { describe, it, expect, beforeEach } from 'vitest';
import { ReopenTaskUseCase } from './ReopenTaskUseCase';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';
import { Task } from '../../domain/entities/Task';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle';
import { TaskPriority } from '../../domain/valueObjects/TaskPriority';
import { UserId } from '../../domain/valueObjects/UserId';
import { TaskId } from '../../domain/valueObjects/TaskId';
import { TaskReopenedEvent } from '../../domain/events/TaskReopenedEvent';

// Mock implementations
class MockTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id.toString(), task);
  }

  async findById(id: TaskId): Promise<Task | null> {
    return this.tasks.get(id.toString()) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async delete(id: TaskId): Promise<void> {
    this.tasks.delete(id.toString());
  }

  // Test helper
  addTask(task: Task): void {
    this.tasks.set(task.id.toString(), task);
  }
}

class MockEventPublisher extends DomainEventPublisher {
  publishedEvents: any[] = [];

  async publish(event: any): Promise<void> {
    this.publishedEvents.push(event);
  }
}

describe('ReopenTaskUseCase', () => {
  let useCase: ReopenTaskUseCase;
  let taskRepository: MockTaskRepository;
  let eventPublisher: MockEventPublisher;
  let userId: UserId;

  beforeEach(() => {
    taskRepository = new MockTaskRepository();
    eventPublisher = new MockEventPublisher();
    useCase = new ReopenTaskUseCase(taskRepository, eventPublisher);
    userId = UserId.create('user-123');
  });

  describe('execute', () => {
    it('should reopen a completed task', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(userId, userId);
      task.complete(userId);
      taskRepository.addTask(task);

      // Act
      await useCase.execute(task.id.toString(), userId.toString());

      // Assert
      const reopenedTask = await taskRepository.findById(task.id);
      expect(reopenedTask).toBeDefined();
      expect(reopenedTask!.status.isTodo()).toBe(true);
      expect(reopenedTask!.completedAt).toBeUndefined();
    });

    it('should publish TaskReopenedEvent', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(userId, userId);
      task.complete(userId);
      // Clear events from assignment and completion
      task.pullDomainEvents();
      taskRepository.addTask(task);

      // Act
      await useCase.execute(task.id.toString(), userId.toString());

      // Assert
      expect(eventPublisher.publishedEvents).toHaveLength(1);
      expect(eventPublisher.publishedEvents[0]).toBeInstanceOf(TaskReopenedEvent);
      expect(eventPublisher.publishedEvents[0].taskId).toEqual(task.id);
      expect(eventPublisher.publishedEvents[0].reopenedBy).toEqual(userId);
    });

    it('should throw error when task is not found', async () => {
      // Act & Assert
      await expect(
        useCase.execute('non-existent-id', userId.toString())
      ).rejects.toThrow('Task not found');
    });

    it('should throw error when task is not completed', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      taskRepository.addTask(task);

      // Act & Assert
      await expect(
        useCase.execute(task.id.toString(), userId.toString())
      ).rejects.toThrow('Can only reopen completed tasks');
    });

    it('should throw error when task was completed more than 24 hours ago', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(userId, userId);

      // Complete the task and manually set completedAt to 25 hours ago
      task.complete(userId);
      const twentyFiveHoursAgo = new Date();
      twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);

      // Use reconstitute to create task with old completion date
      const taskProps = {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignment: task.assignment,
        dependencies: task.dependencies as any,
        createdAt: task.createdAt,
        completedAt: twentyFiveHoursAgo
      };
      const oldTask = Task.reconstitute(taskProps);
      taskRepository.addTask(oldTask);

      // Act & Assert
      await expect(
        useCase.execute(oldTask.id.toString(), userId.toString())
      ).rejects.toThrow('Can only reopen tasks completed within 24 hours');
    });

    it('should throw error when non-owner tries to reopen', async () => {
      // Arrange
      const ownerUserId = UserId.create('owner-123');
      const otherUserId = UserId.create('other-456');

      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(ownerUserId, ownerUserId);
      task.complete(ownerUserId);
      taskRepository.addTask(task);

      // Act & Assert
      await expect(
        useCase.execute(task.id.toString(), otherUserId.toString())
      ).rejects.toThrow('Only the original task owner can reopen this task');
    });

    it('should allow reopening task completed within 24 hours', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(userId, userId);
      task.complete(userId);

      // Set completedAt to 23 hours ago (within the 24-hour window)
      const twentyThreeHoursAgo = new Date();
      twentyThreeHoursAgo.setHours(twentyThreeHoursAgo.getHours() - 23);

      const taskProps = {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignment: task.assignment,
        dependencies: task.dependencies as any,
        createdAt: task.createdAt,
        completedAt: twentyThreeHoursAgo
      };
      const recentTask = Task.reconstitute(taskProps);
      taskRepository.addTask(recentTask);

      // Act
      await useCase.execute(recentTask.id.toString(), userId.toString());

      // Assert
      const reopenedTask = await taskRepository.findById(recentTask.id);
      expect(reopenedTask).toBeDefined();
      expect(reopenedTask!.status.isTodo()).toBe(true);
      expect(reopenedTask!.completedAt).toBeUndefined();
    });

    it('should save the reopened task to repository', async () => {
      // Arrange
      const task = Task.create(TaskTitle.create('Test Task'), TaskPriority.medium());
      task.assignTo(userId, userId);
      task.complete(userId);
      taskRepository.addTask(task);

      // Act
      await useCase.execute(task.id.toString(), userId.toString());

      // Assert
      const allTasks = await taskRepository.findAll();
      expect(allTasks).toHaveLength(1);
      expect(allTasks[0].status.isTodo()).toBe(true);
    });
  });
});
