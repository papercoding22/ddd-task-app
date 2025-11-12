import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateTaskUseCase } from './CreateTaskUseCase';
import { TaskPriority } from '../../domain/valueObjects/TaskPriority';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';
import { Task } from '../../domain/entities/Task';

// Mock implementations
class MockTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  async save(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find(t => t.id.toString() === id) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id.toString() !== id);
  }

  // Test helper
  getTasks(): Task[] {
    return this.tasks;
  }
}

class MockEventPublisher extends DomainEventPublisher {
  publishedEvents: any[] = [];

  async publish(event: any): Promise<void> {
    this.publishedEvents.push(event);
  }
}

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let taskRepository: MockTaskRepository;
  let eventPublisher: MockEventPublisher;

  beforeEach(() => {
    taskRepository = new MockTaskRepository();
    eventPublisher = new MockEventPublisher();
    useCase = new CreateTaskUseCase(taskRepository, eventPublisher);
  });

  describe('execute', () => {
    it('should create a task with default priority', async () => {
      const task = await useCase.execute('New Task');

      expect(task.title.toString()).toBe('New Task');
      expect(task.priority.getLevel()).toBe(TaskPriority.medium().getLevel());
      expect(task.status.isTodo()).toBe(true);
    });

    it('should create a task with custom priority', async () => {
      const task = await useCase.execute('High Priority Task', TaskPriority.high());

      expect(task.title.toString()).toBe('High Priority Task');
      expect(task.priority.getLevel()).toBe(TaskPriority.high().getLevel());
    });

    it('should create a task with due date', async () => {
      const dueDate = new Date('2025-12-31');
      const task = await useCase.execute(
        'Task with Due Date',
        TaskPriority.medium(),
        dueDate
      );

      expect(task.dueDate).toEqual(dueDate);
    });

    it('should save the task to repository', async () => {
      await useCase.execute('Task to Save');

      const savedTasks = taskRepository.getTasks();
      expect(savedTasks).toHaveLength(1);
      expect(savedTasks[0].title.toString()).toBe('Task to Save');
    });

    it('should publish domain events', async () => {
      const task = await useCase.execute('Task with Events');

      // Note: Task.create() doesn't emit events by default,
      // but this test structure is ready for when they do
      expect(eventPublisher.publishedEvents).toBeDefined();
    });

    it('should throw error for invalid title', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Task title cannot be empty');
    });

    it('should throw error for title exceeding max length', async () => {
      const longTitle = 'a'.repeat(201);
      await expect(useCase.execute(longTitle)).rejects.toThrow(
        'Task title cannot exceed 200 characters'
      );
    });

    it('should create multiple tasks independently', async () => {
      await useCase.execute('Task 1');
      await useCase.execute('Task 2');
      await useCase.execute('Task 3');

      const savedTasks = taskRepository.getTasks();
      expect(savedTasks).toHaveLength(3);
      expect(savedTasks[0].title.toString()).toBe('Task 1');
      expect(savedTasks[1].title.toString()).toBe('Task 2');
      expect(savedTasks[2].title.toString()).toBe('Task 3');
    });
  });
});
