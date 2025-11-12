import { DomainEvent } from '../../domain/events/DomainEvent';
import { TaskCompletedEvent } from '../../domain/events/TaskCompletedEvent';

export class TaskCompletedEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event.eventType !== 'TaskCompleted') return;

    const taskCompletedEvent = event as TaskCompletedEvent;

    console.log('🎉 Task Completed Event Triggered!');
    console.log(`Task ID: ${taskCompletedEvent.taskId.toString()}`);
    console.log(`Completed by: ${taskCompletedEvent.completedBy.toString()}`);
    console.log(`Completed at: ${taskCompletedEvent.completedAt.toISOString()}`);

    await this.sendNotification(taskCompletedEvent);
    await this.trackCompletion(taskCompletedEvent);
    
    console.log('✅ Checking for unblocked tasks...');
  }

  private async sendNotification(event: TaskCompletedEvent): Promise<void> {
    console.log(`📧 Sending notification: Task completed by user ${event.completedBy.toString()}`);
  }

  private async trackCompletion(event: TaskCompletedEvent): Promise<void> {
    console.log(`📊 Analytics: Task completion recorded`);
  }
}
