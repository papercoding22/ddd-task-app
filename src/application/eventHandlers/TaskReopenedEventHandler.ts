import { DomainEvent } from '../../domain/events/DomainEvent';
import { TaskReopenedEvent } from '../../domain/events/TaskReopenedEvent';

export class TaskReopenedEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event.eventType !== 'TaskReopened') return;

    const taskReopenedEvent = event as TaskReopenedEvent;

    console.log('🔄 Task Reopened Event Triggered!');
    console.log(`Task ID: ${taskReopenedEvent.taskId.toString()}`);
    console.log(`Reopened by: ${taskReopenedEvent.reopenedBy.toString()}`);
    console.log(`Reopened at: ${taskReopenedEvent.reopenedAt.toISOString()}`);

    await this.sendNotification(taskReopenedEvent);
    await this.trackReopen(taskReopenedEvent);
  }

  private async sendNotification(event: TaskReopenedEvent): Promise<void> {
    console.log(`📧 Sending notification: Task reopened by user ${event.reopenedBy.toString()}`);
  }

  private async trackReopen(event: TaskReopenedEvent): Promise<void> {
    console.log(`📊 Analytics: Task reopen recorded`);
  }
}
