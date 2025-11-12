import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DomainEventPublisher } from './DomainEventPublisher';
import { DomainEvent } from '../../domain/events/DomainEvent';

describe('DomainEventPublisher', () => {
  let publisher: DomainEventPublisher;

  beforeEach(() => {
    publisher = new DomainEventPublisher();
  });

  const createMockEvent = (eventType: string): DomainEvent => ({
    eventType,
    occurredAt: new Date(),
  });

  describe('subscribe', () => {
    it('should subscribe a handler to an event type', () => {
      const handler = vi.fn();

      expect(() => {
        publisher.subscribe('TestEvent', handler);
      }).not.toThrow();
    });

    it('should allow multiple handlers for the same event type', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      publisher.subscribe('TestEvent', handler1);
      publisher.subscribe('TestEvent', handler2);
      publisher.subscribe('TestEvent', handler3);

      // No error should be thrown
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).not.toHaveBeenCalled();
    });

    it('should allow subscribing to different event types', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      publisher.subscribe('EventA', handler1);
      publisher.subscribe('EventB', handler2);

      // Both should be subscribed without issues
      expect(() => {
        publisher.subscribe('EventA', handler1);
        publisher.subscribe('EventB', handler2);
      }).not.toThrow();
    });
  });

  describe('publish', () => {
    it('should publish event to subscribed handler', async () => {
      const handler = vi.fn();
      const event = createMockEvent('TestEvent');

      publisher.subscribe('TestEvent', handler);
      await publisher.publish(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should publish event to all subscribed handlers', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();
      const event = createMockEvent('TestEvent');

      publisher.subscribe('TestEvent', handler1);
      publisher.subscribe('TestEvent', handler2);
      publisher.subscribe('TestEvent', handler3);

      await publisher.publish(event);

      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);
      expect(handler3).toHaveBeenCalledWith(event);
    });

    it('should only publish to handlers subscribed to the event type', async () => {
      const handlerA = vi.fn();
      const handlerB = vi.fn();
      const eventA = createMockEvent('EventA');

      publisher.subscribe('EventA', handlerA);
      publisher.subscribe('EventB', handlerB);

      await publisher.publish(eventA);

      expect(handlerA).toHaveBeenCalledWith(eventA);
      expect(handlerB).not.toHaveBeenCalled();
    });

    it('should not throw when publishing event with no subscribers', async () => {
      const event = createMockEvent('UnsubscribedEvent');

      await expect(publisher.publish(event)).resolves.not.toThrow();
    });

    it('should handle async handlers', async () => {
      const asyncHandler = vi.fn().mockImplementation(async (event: DomainEvent) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return Promise.resolve();
      });

      const event = createMockEvent('AsyncEvent');
      publisher.subscribe('AsyncEvent', asyncHandler);

      await publisher.publish(event);

      expect(asyncHandler).toHaveBeenCalledWith(event);
    });

    it('should handle sync handlers', async () => {
      const syncHandler = vi.fn().mockImplementation((event: DomainEvent) => {
        // Synchronous operation
        return;
      });

      const event = createMockEvent('SyncEvent');
      publisher.subscribe('SyncEvent', syncHandler);

      await publisher.publish(event);

      expect(syncHandler).toHaveBeenCalledWith(event);
    });

    it('should catch and log errors from handlers without stopping other handlers', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const failingHandler = vi.fn().mockRejectedValue(new Error('Handler failed'));
      const successHandler = vi.fn().mockResolvedValue(undefined);

      const event = createMockEvent('ErrorEvent');

      publisher.subscribe('ErrorEvent', failingHandler);
      publisher.subscribe('ErrorEvent', successHandler);

      await publisher.publish(event);

      expect(failingHandler).toHaveBeenCalledWith(event);
      expect(successHandler).toHaveBeenCalledWith(event);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error handling event ErrorEvent:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should continue processing remaining handlers if one throws synchronously', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const throwingHandler = vi.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      const normalHandler = vi.fn();

      const event = createMockEvent('SyncErrorEvent');

      publisher.subscribe('SyncErrorEvent', throwingHandler);
      publisher.subscribe('SyncErrorEvent', normalHandler);

      await publisher.publish(event);

      expect(throwingHandler).toHaveBeenCalledWith(event);
      expect(normalHandler).toHaveBeenCalledWith(event);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle multiple publishes to the same handlers', async () => {
      const handler = vi.fn();
      const event1 = createMockEvent('MultiEvent');
      const event2 = createMockEvent('MultiEvent');

      publisher.subscribe('MultiEvent', handler);

      await publisher.publish(event1);
      await publisher.publish(event2);

      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler).toHaveBeenNthCalledWith(1, event1);
      expect(handler).toHaveBeenNthCalledWith(2, event2);
    });

    it('should handle complex event data', async () => {
      const handler = vi.fn();
      const complexEvent: DomainEvent = {
        eventType: 'ComplexEvent',
        occurredAt: new Date('2025-01-01T00:00:00Z'),
      };

      publisher.subscribe('ComplexEvent', handler);
      await publisher.publish(complexEvent);

      expect(handler).toHaveBeenCalledWith(complexEvent);
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple event types with multiple handlers each', async () => {
      const handlerA1 = vi.fn();
      const handlerA2 = vi.fn();
      const handlerB1 = vi.fn();
      const handlerB2 = vi.fn();

      publisher.subscribe('EventA', handlerA1);
      publisher.subscribe('EventA', handlerA2);
      publisher.subscribe('EventB', handlerB1);
      publisher.subscribe('EventB', handlerB2);

      const eventA = createMockEvent('EventA');
      const eventB = createMockEvent('EventB');

      await publisher.publish(eventA);
      await publisher.publish(eventB);

      expect(handlerA1).toHaveBeenCalledWith(eventA);
      expect(handlerA2).toHaveBeenCalledWith(eventA);
      expect(handlerB1).toHaveBeenCalledWith(eventB);
      expect(handlerB2).toHaveBeenCalledWith(eventB);
    });

    it('should maintain handler execution order', async () => {
      const executionOrder: number[] = [];

      const handler1 = vi.fn().mockImplementation(() => executionOrder.push(1));
      const handler2 = vi.fn().mockImplementation(() => executionOrder.push(2));
      const handler3 = vi.fn().mockImplementation(() => executionOrder.push(3));

      publisher.subscribe('OrderEvent', handler1);
      publisher.subscribe('OrderEvent', handler2);
      publisher.subscribe('OrderEvent', handler3);

      const event = createMockEvent('OrderEvent');
      await publisher.publish(event);

      expect(executionOrder).toEqual([1, 2, 3]);
    });
  });
});
