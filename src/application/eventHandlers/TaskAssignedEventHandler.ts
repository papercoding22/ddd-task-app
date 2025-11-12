import { DomainEvent } from '../../domain/events/DomainEvent';
import { TaskAssignedEvent } from '../../domain/events/TaskAssignedEvent';

export class TaskAssignedEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event.eventType !== 'TaskAssigned') return;

    const taskAssignedEvent = event as TaskAssignedEvent;

    console.log('👤 Task Assigned Event Triggered!');
    console.log(`Task ID: ${taskAssignedEvent.taskId.toString()}`);
    console.log(`Assigned to: ${taskAssignedEvent.assignedTo.toString()}`);
    console.log(`Assigned by: ${taskAssignedEvent.assignedBy.toString()}`);

    await this.notifyAssignedUser(taskAssignedEvent);
    await this.updateUserTaskList(taskAssignedEvent);
  }

  private async notifyAssignedUser(event: TaskAssignedEvent): Promise<void> {
    console.log(`📧 Email sent to ${event.assignedTo.toString()}: You have been assigned a new task`);
  }

  private async updateUserTaskList(event: TaskAssignedEvent): Promise<void> {
    console.log(`📝 User task list updated for ${event.assignedTo.toString()}`);
  }
}
