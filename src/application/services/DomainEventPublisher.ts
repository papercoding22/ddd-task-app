import { DomainEvent } from '../../domain/events/DomainEvent';

type EventHandler = (event: DomainEvent) => Promise<void> | void;

export class DomainEventPublisher {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventType}:`, error);
      }
    }
  }
}
