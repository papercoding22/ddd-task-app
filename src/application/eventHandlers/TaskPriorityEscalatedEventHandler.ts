import { DomainEvent } from '../../domain/events/DomainEvent';
import { TaskPriorityEscalatedEvent } from '../../domain/events/TaskPriorityEscalatedEvent';

export class TaskPriorityEscalatedEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event.eventType !== 'TaskPriorityEscalated') return;

    const escalationEvent = event as TaskPriorityEscalatedEvent;

    console.log('⚠️ Task Priority Escalated Event Triggered!');
    console.log(`Task ID: ${escalationEvent.taskId.toString()}`);
    console.log(`Old Priority: ${escalationEvent.oldPriority.toString()}`);
    console.log(`New Priority: ${escalationEvent.newPriority.toString()}`);

    await this.alertStakeholders(escalationEvent);
    await this.syncWithProjectManagement(escalationEvent);
  }

  private async alertStakeholders(event: TaskPriorityEscalatedEvent): Promise<void> {
    console.log(`🚨 Alert: Task priority escalated from ${event.oldPriority.toString()} to ${event.newPriority.toString()}`);
  }

  private async syncWithProjectManagement(event: TaskPriorityEscalatedEvent): Promise<void> {
    console.log(`🔄 Syncing priority change with external systems`);
  }
}
