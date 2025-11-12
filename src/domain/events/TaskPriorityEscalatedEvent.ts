import { TaskId } from '../valueObjects/TaskId';
import { TaskPriority } from '../valueObjects/TaskPriority';
import { DomainEvent } from './DomainEvent';

export class TaskPriorityEscalatedEvent implements DomainEvent {
  public readonly eventType = 'TaskPriorityEscalated';
  public readonly occurredAt: Date;

  constructor(
    public readonly taskId: TaskId,
    public readonly oldPriority: TaskPriority,
    public readonly newPriority: TaskPriority
  ) {
    this.occurredAt = new Date();
  }
}
