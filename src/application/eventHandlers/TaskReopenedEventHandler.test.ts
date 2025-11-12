import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskReopenedEventHandler } from './TaskReopenedEventHandler';
import { TaskReopenedEvent } from '../../domain/events/TaskReopenedEvent';
import { TaskId } from '../../domain/valueObjects/TaskId';
import { UserId } from '../../domain/valueObjects/UserId';

describe('TaskReopenedEventHandler', () => {
  let handler: TaskReopenedEventHandler;
  let consoleLogSpy: any;

  beforeEach(() => {
    handler = new TaskReopenedEventHandler();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('handle', () => {
    it('should handle TaskReopened event and log to console', async () => {
      // Arrange
      const taskId = TaskId.create();
      const userId = UserId.create('user-123');
      const reopenedAt = new Date();
      const event = new TaskReopenedEvent(taskId, userId, reopenedAt);

      // Act
      await handler.handle(event);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('🔄 Task Reopened Event Triggered!');
      expect(consoleLogSpy).toHaveBeenCalledWith(`Task ID: ${taskId.toString()}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(`Reopened by: ${userId.toString()}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(`Reopened at: ${reopenedAt.toISOString()}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(`📧 Sending notification: Task reopened by user ${userId.toString()}`);
      expect(consoleLogSpy).toHaveBeenCalledWith('📊 Analytics: Task reopen recorded');
    });

    it('should not handle events of other types', async () => {
      // Arrange
      const otherEvent = {
        eventType: 'TaskCompleted',
        occurredAt: new Date(),
        taskId: TaskId.create(),
      };

      // Act
      await handler.handle(otherEvent as any);

      // Assert
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log all details of the reopened event', async () => {
      // Arrange
      const taskId = TaskId.create();
      const userId = UserId.create('john-doe');
      const reopenedAt = new Date('2025-01-15T10:30:00Z');
      const event = new TaskReopenedEvent(taskId, userId, reopenedAt);

      // Act
      await handler.handle(event);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(6);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, '🔄 Task Reopened Event Triggered!');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, `Task ID: ${taskId.toString()}`);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Reopened by: john-doe');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(4, 'Reopened at: 2025-01-15T10:30:00.000Z');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '📧 Sending notification: Task reopened by user john-doe');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(6, '📊 Analytics: Task reopen recorded');
    });
  });
});
