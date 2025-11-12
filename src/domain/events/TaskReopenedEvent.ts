import { TaskId } from '../valueObjects/TaskId';
import { UserId } from '../valueObjects/UserId';
import { DomainEvent } from './DomainEvent';

export class TaskReopenedEvent implements DomainEvent {
  public readonly eventType = 'TaskReopened';
  public readonly occurredAt: Date;

  constructor(
    public readonly taskId: TaskId,
    public readonly reopenedBy: UserId,
    public readonly reopenedAt: Date
  ) {
    this.occurredAt = new Date();
  }
}
