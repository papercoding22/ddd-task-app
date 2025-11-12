import { DomainEventPublisher } from '../../application/services/DomainEventPublisher';
import { TaskCompletedEventHandler } from '../../application/eventHandlers/TaskCompletedEventHandler';
import { TaskAssignedEventHandler } from '../../application/eventHandlers/TaskAssignedEventHandler';
import { TaskPriorityEscalatedEventHandler } from '../../application/eventHandlers/TaskPriorityEscalatedEventHandler';

export class EventPublisherFactory {
  static create(): DomainEventPublisher {
    const publisher = new DomainEventPublisher();

    const taskCompletedHandler = new TaskCompletedEventHandler();
    const taskAssignedHandler = new TaskAssignedEventHandler();
    const priorityEscalatedHandler = new TaskPriorityEscalatedEventHandler();

    publisher.subscribe('TaskCompleted', (event) => taskCompletedHandler.handle(event));
    publisher.subscribe('TaskAssigned', (event) => taskAssignedHandler.handle(event));
    publisher.subscribe('TaskPriorityEscalated', (event) => priorityEscalatedHandler.handle(event));

    publisher.subscribe('TaskCompleted', async (event) => {
      console.log('📈 Secondary handler: Updating dashboard metrics');
    });

    return publisher;
  }
}
