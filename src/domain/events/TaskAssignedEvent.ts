import { TaskId } from '../valueObjects/TaskId';
import { UserId } from '../valueObjects/UserId';
import { DomainEvent } from './DomainEvent';

export class TaskAssignedEvent implements DomainEvent {
  public readonly eventType = 'TaskAssigned';
  public readonly occurredAt: Date;

  constructor(
    public readonly taskId: TaskId,
    public readonly assignedTo: UserId,
    public readonly assignedBy: UserId
  ) {
    this.occurredAt = new Date();
  }
}
