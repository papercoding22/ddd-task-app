import { TaskId } from '../valueObjects/TaskId';
import { UserId } from '../valueObjects/UserId';
import { DomainEvent } from './DomainEvent';

export class TaskCompletedEvent implements DomainEvent {
  public readonly eventType = 'TaskCompleted';
  public readonly occurredAt: Date;

  constructor(
    public readonly taskId: TaskId,
    public readonly completedBy: UserId,
    public readonly completedAt: Date
  ) {
    this.occurredAt = new Date();
  }
}
