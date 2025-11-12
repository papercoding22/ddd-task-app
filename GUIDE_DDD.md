# Domain-Driven Design Implementation Guide

## Table of Contents
1. [Introduction to DDD in this Project](#introduction)
2. [Project Architecture Overview](#architecture)
3. [Step-by-Step Guide to Adding Features](#step-by-step)
4. [Complete Example: Adding Task Delegation](#example)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#pitfalls)
7. [Testing Strategy](#testing)

---

## Introduction to DDD in this Project {#introduction}

This project follows **Domain-Driven Design (DDD)** principles to create a maintainable, scalable task management system. DDD helps us:

- **Separate business logic** from technical concerns
- **Use domain events** to notify the system of important changes
- **Maintain consistency** through aggregates and value objects
- **Make the codebase reflect** the business domain

### Core DDD Concepts Used

| Concept | Description | Example in Project |
|---------|-------------|-------------------|
| **Entity** | Object with unique identity | `Task` |
| **Value Object** | Immutable object without identity | `TaskTitle`, `TaskPriority`, `UserId` |
| **Aggregate** | Cluster of entities with a root | `Task` (root) with dependencies |
| **Domain Event** | Something that happened in the domain | `TaskCompletedEvent`, `TaskReopenedEvent` |
| **Use Case** | Application service orchestrating domain logic | `CompleteTaskUseCase`, `ReopenTaskUseCase` |
| **Repository** | Abstraction for data persistence | `ITaskRepository` |

---

## Project Architecture Overview {#architecture}

```
src/
├── domain/                    # 🎯 Core Business Logic (No dependencies)
│   ├── entities/             # Objects with identity
│   │   └── Task.ts          # Task aggregate root
│   ├── valueObjects/        # Immutable domain concepts
│   │   ├── TaskId.ts
│   │   ├── TaskTitle.ts
│   │   ├── TaskPriority.ts
│   │   └── UserId.ts
│   ├── events/              # Domain events
│   │   ├── DomainEvent.ts
│   │   ├── TaskCompletedEvent.ts
│   │   └── TaskReopenedEvent.ts
│   └── repositories/        # Interfaces (implementation in infrastructure)
│       └── ITaskRepository.ts
│
├── application/             # 📋 Application Logic (orchestration)
│   ├── useCases/           # Business workflows
│   │   ├── CompleteTaskUseCase.ts
│   │   └── ReopenTaskUseCase.ts
│   ├── eventHandlers/      # Domain event handlers
│   │   ├── TaskCompletedEventHandler.ts
│   │   └── TaskReopenedEventHandler.ts
│   └── services/           # Application services
│       └── DomainEventPublisher.ts
│
├── infrastructure/         # 🔧 Technical Details (frameworks, persistence)
│   ├── repositories/      # Repository implementations
│   │   └── LocalStorageTaskRepository.ts
│   ├── events/           # Event infrastructure
│   │   └── EventPublisherFactory.ts
│   └── di/              # Dependency injection
│       └── ServiceContainer.ts
│
└── presentation/          # 🎨 User Interface
    ├── components/       # React components
    │   └── TaskManagementApp.tsx
    └── hooks/           # React hooks
        └── useTaskManagement.ts
```

### Layer Responsibilities

#### 🎯 Domain Layer (Pure Business Logic)
- **No external dependencies**
- Contains all business rules
- Entities decide what's allowed
- Emits domain events when important things happen

#### 📋 Application Layer (Orchestration)
- Coordinates domain objects
- Manages transactions
- Publishes domain events
- **Thin layer** - delegates to domain

#### 🔧 Infrastructure Layer (Technical Implementation)
- Database access
- External APIs
- Framework specifics
- Event dispatching

#### 🎨 Presentation Layer (User Interface)
- React components
- User interactions
- Displays data from application layer

---

## Step-by-Step Guide to Adding Features {#step-by-step}

### Phase 1: Domain Layer (Business Logic)

#### Step 1: Create Domain Event (if needed)
**Location:** `src/domain/events/`

```typescript
// Example: TaskDelegatedEvent.ts
import { TaskId } from '../valueObjects/TaskId';
import { UserId } from '../valueObjects/UserId';
import { DomainEvent } from './DomainEvent';

export class TaskDelegatedEvent implements DomainEvent {
  public readonly eventType = 'TaskDelegated';
  public readonly occurredAt: Date;

  constructor(
    public readonly taskId: TaskId,
    public readonly delegatedFrom: UserId,
    public readonly delegatedTo: UserId,
    public readonly delegatedAt: Date
  ) {
    this.occurredAt = new Date();
  }
}
```

**✅ Checklist:**
- [ ] Implements `DomainEvent` interface
- [ ] Has descriptive `eventType` string
- [ ] Captures all relevant information
- [ ] Uses value objects, not primitives

#### Step 2: Add Business Logic to Entity
**Location:** `src/domain/entities/Task.ts`

```typescript
import { TaskDelegatedEvent } from '../events/TaskDelegatedEvent';

// Inside Task class:
delegate(fromUserId: UserId, toUserId: UserId): void {
  // 1️⃣ Validate business rules
  if (this.props.status.isDone()) {
    throw new Error('Cannot delegate completed task');
  }

  if (!this.props.assignment) {
    throw new Error('Cannot delegate unassigned task');
  }

  if (!this.props.assignment.isAssignedTo(fromUserId)) {
    throw new Error('Only assigned user can delegate this task');
  }

  if (fromUserId.equals(toUserId)) {
    throw new Error('Cannot delegate task to yourself');
  }

  // 2️⃣ Update state
  const previousAssignment = this.props.assignment;
  this.props.assignment = TaskAssignment.create(toUserId, fromUserId);

  // 3️⃣ Emit domain event
  this.addDomainEvent(new TaskDelegatedEvent(
    this.props.id,
    fromUserId,
    toUserId,
    new Date()
  ));
}
```

**✅ Checklist:**
- [ ] All business rules are validated
- [ ] Clear error messages
- [ ] State changes are applied
- [ ] Domain event is emitted
- [ ] Method is on the appropriate entity

#### Step 3: Write Entity Tests
**Location:** `src/domain/entities/Task.test.ts`

```typescript
describe('delegate', () => {
  it('should delegate task to another user', () => {
    const task = Task.create(TaskTitle.create('Test Task'));
    const fromUser = UserId.create('user-1');
    const toUser = UserId.create('user-2');

    task.assignTo(fromUser, fromUser);
    task.delegate(fromUser, toUser);

    expect(task.assignment?.getAssignedTo()).toEqual(toUser);
  });

  it('should emit TaskDelegatedEvent', () => {
    const task = Task.create(TaskTitle.create('Test Task'));
    const fromUser = UserId.create('user-1');
    const toUser = UserId.create('user-2');

    task.assignTo(fromUser, fromUser);
    task.delegate(fromUser, toUser);

    const events = task.pullDomainEvents();
    const delegatedEvents = events.filter(e => e instanceof TaskDelegatedEvent);
    expect(delegatedEvents).toHaveLength(1);
  });

  it('should throw error when delegating completed task', () => {
    const task = Task.create(TaskTitle.create('Test Task'));
    const fromUser = UserId.create('user-1');
    const toUser = UserId.create('user-2');

    task.assignTo(fromUser, fromUser);
    task.complete(fromUser);

    expect(() => task.delegate(fromUser, toUser)).toThrow(
      'Cannot delegate completed task'
    );
  });

  it('should throw error when non-assigned user tries to delegate', () => {
    const task = Task.create(TaskTitle.create('Test Task'));
    const assignedUser = UserId.create('user-1');
    const otherUser = UserId.create('user-2');
    const targetUser = UserId.create('user-3');

    task.assignTo(assignedUser, assignedUser);

    expect(() => task.delegate(otherUser, targetUser)).toThrow(
      'Only assigned user can delegate this task'
    );
  });
});
```

**✅ Checklist:**
- [ ] Happy path test
- [ ] Domain event emission test
- [ ] All business rule violation tests
- [ ] Edge cases covered

### Phase 2: Application Layer (Use Cases)

#### Step 4: Create Use Case
**Location:** `src/application/useCases/DelegateTaskUseCase.ts`

```typescript
import { TaskId } from '../../domain/valueObjects/TaskId';
import { UserId } from '../../domain/valueObjects/UserId';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';

export class DelegateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async execute(
    taskId: string,
    fromUserId: string,
    toUserId: string
  ): Promise<void> {
    // 1️⃣ Parse value objects
    const id = TaskId.fromString(taskId);
    const fromUser = UserId.create(fromUserId);
    const toUser = UserId.create(toUserId);

    // 2️⃣ Load aggregate
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    // 3️⃣ Execute business logic
    task.delegate(fromUser, toUser);

    // 4️⃣ Persist changes
    await this.taskRepository.save(task);

    // 5️⃣ Publish domain events
    const events = task.pullDomainEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
  }
}
```

**✅ Checklist:**
- [ ] Follows the same pattern as other use cases
- [ ] Loads aggregate from repository
- [ ] Delegates business logic to entity
- [ ] Saves aggregate
- [ ] Publishes domain events

#### Step 5: Write Use Case Tests
**Location:** `src/application/useCases/DelegateTaskUseCase.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { DelegateTaskUseCase } from './DelegateTaskUseCase';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';
import { Task } from '../../domain/entities/Task';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle';
import { UserId } from '../../domain/valueObjects/UserId';
import { TaskId } from '../../domain/valueObjects/TaskId';
import { TaskDelegatedEvent } from '../../domain/events/TaskDelegatedEvent';

// Mock implementations (same pattern as other tests)
class MockTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id.toString(), task);
  }

  async findById(id: TaskId): Promise<Task | null> {
    return this.tasks.get(id.toString()) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async delete(id: TaskId): Promise<void> {
    this.tasks.delete(id.toString());
  }

  addTask(task: Task): void {
    this.tasks.set(task.id.toString(), task);
  }
}

class MockEventPublisher extends DomainEventPublisher {
  publishedEvents: any[] = [];

  async publish(event: any): Promise<void> {
    this.publishedEvents.push(event);
  }
}

describe('DelegateTaskUseCase', () => {
  let useCase: DelegateTaskUseCase;
  let taskRepository: MockTaskRepository;
  let eventPublisher: MockEventPublisher;

  beforeEach(() => {
    taskRepository = new MockTaskRepository();
    eventPublisher = new MockEventPublisher();
    useCase = new DelegateTaskUseCase(taskRepository, eventPublisher);
  });

  it('should delegate task from one user to another', async () => {
    const fromUser = UserId.create('user-1');
    const toUser = UserId.create('user-2');

    const task = Task.create(TaskTitle.create('Test Task'));
    task.assignTo(fromUser, fromUser);
    taskRepository.addTask(task);

    await useCase.execute(task.id.toString(), fromUser.toString(), toUser.toString());

    const delegatedTask = await taskRepository.findById(task.id);
    expect(delegatedTask?.assignment?.getAssignedTo()).toEqual(toUser);
  });

  it('should publish TaskDelegatedEvent', async () => {
    const fromUser = UserId.create('user-1');
    const toUser = UserId.create('user-2');

    const task = Task.create(TaskTitle.create('Test Task'));
    task.assignTo(fromUser, fromUser);
    task.pullDomainEvents(); // Clear previous events
    taskRepository.addTask(task);

    await useCase.execute(task.id.toString(), fromUser.toString(), toUser.toString());

    expect(eventPublisher.publishedEvents).toHaveLength(1);
    expect(eventPublisher.publishedEvents[0]).toBeInstanceOf(TaskDelegatedEvent);
  });

  it('should throw error when task not found', async () => {
    await expect(
      useCase.execute('non-existent', 'user-1', 'user-2')
    ).rejects.toThrow('Task not found');
  });
});
```

**✅ Checklist:**
- [ ] Tests successful execution
- [ ] Tests event publishing
- [ ] Tests error cases
- [ ] Uses mock implementations

#### Step 6: Create Event Handler
**Location:** `src/application/eventHandlers/TaskDelegatedEventHandler.ts`

```typescript
import { DomainEvent } from '../../domain/events/DomainEvent';
import { TaskDelegatedEvent } from '../../domain/events/TaskDelegatedEvent';

export class TaskDelegatedEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event.eventType !== 'TaskDelegated') return;

    const taskDelegatedEvent = event as TaskDelegatedEvent;

    console.log('🔄 Task Delegated Event Triggered!');
    console.log(`Task ID: ${taskDelegatedEvent.taskId.toString()}`);
    console.log(`Delegated from: ${taskDelegatedEvent.delegatedFrom.toString()}`);
    console.log(`Delegated to: ${taskDelegatedEvent.delegatedTo.toString()}`);
    console.log(`Delegated at: ${taskDelegatedEvent.delegatedAt.toISOString()}`);

    await this.sendNotifications(taskDelegatedEvent);
    await this.trackDelegation(taskDelegatedEvent);
  }

  private async sendNotifications(event: TaskDelegatedEvent): Promise<void> {
    console.log(`📧 Notifying ${event.delegatedTo.toString()} about new assignment`);
    console.log(`📧 Notifying ${event.delegatedFrom.toString()} about delegation`);
  }

  private async trackDelegation(event: TaskDelegatedEvent): Promise<void> {
    console.log(`📊 Analytics: Task delegation recorded`);
  }
}
```

**✅ Checklist:**
- [ ] Checks event type
- [ ] Logs relevant information
- [ ] Performs side effects (notifications, analytics)
- [ ] Follows pattern of other event handlers

### Phase 3: Infrastructure Layer

#### Step 7: Register in Event Publisher Factory
**Location:** `src/infrastructure/events/EventPublisherFactory.ts`

```typescript
import { TaskDelegatedEventHandler } from '../../application/eventHandlers/TaskDelegatedEventHandler';

export class EventPublisherFactory {
  static create(): DomainEventPublisher {
    const publisher = new DomainEventPublisher();

    const taskCompletedHandler = new TaskCompletedEventHandler();
    const taskAssignedHandler = new TaskAssignedEventHandler();
    const taskReopenedHandler = new TaskReopenedEventHandler();
    const taskDelegatedHandler = new TaskDelegatedEventHandler(); // ✅ Add this

    publisher.subscribe('TaskCompleted', (event) => taskCompletedHandler.handle(event));
    publisher.subscribe('TaskAssigned', (event) => taskAssignedHandler.handle(event));
    publisher.subscribe('TaskReopened', (event) => taskReopenedHandler.handle(event));
    publisher.subscribe('TaskDelegated', (event) => taskDelegatedHandler.handle(event)); // ✅ Add this

    // ... other subscriptions
    return publisher;
  }
}
```

#### Step 8: Register Use Case in Service Container
**Location:** `src/infrastructure/di/ServiceContainer.ts`

```typescript
import { DelegateTaskUseCase } from '../../application/useCases/DelegateTaskUseCase';

export class ServiceContainer {
  // ... existing code ...

  get delegateTaskUseCase(): DelegateTaskUseCase {
    return new DelegateTaskUseCase(this.taskRepository, this.eventPublisher);
  }
}
```

**✅ Checklist:**
- [ ] Import added
- [ ] Getter method created
- [ ] Follows naming convention

### Phase 4: Presentation Layer

#### Step 9: Add Hook Function
**Location:** `src/presentation/hooks/useTaskManagement.ts`

```typescript
// Add to useEffect
publisher.subscribe('TaskDelegated', eventLogger);

// Add function
const delegateTask = async (taskId: string, toUserId: string) => {
  try {
    setError(null);
    await container.delegateTaskUseCase.execute(taskId, currentUserId, toUserId);
    await loadTasks();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delegate task');
    throw err;
  }
};

// Add to return
return {
  tasks,
  loading,
  error,
  eventLog,
  createTask,
  assignTask,
  completeTask,
  reopenTask,
  delegateTask, // ✅ Add this
  clearEventLog,
  refreshTasks: loadTasks
};
```

#### Step 10: Add UI Component
**Location:** `src/presentation/components/TaskManagementApp.tsx`

```typescript
const {
  tasks,
  loading,
  error,
  eventLog,
  createTask,
  assignTask,
  completeTask,
  reopenTask,
  delegateTask, // ✅ Destructure this
  clearEventLog
} = useTaskManagement(currentUserId);

const [delegateDialogOpen, setDelegateDialogOpen] = useState(false);
const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

const handleDelegate = useCallback(async (taskId: string, targetUserId: string) => {
  try {
    await delegateTask(taskId, targetUserId);
    toast.success('Task delegated successfully!');
    setDelegateDialogOpen(false);
  } catch (err) {
    console.error('Failed to delegate task:', err);
  }
}, [delegateTask]);

// In the task list UI:
{task.assignment && task.isAssignedTo(currentUserId) && !task.status.isDone() && (
  <button
    onClick={() => {
      setSelectedTaskId(task.id.toString());
      setDelegateDialogOpen(true);
    }}
    className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
  >
    👥 Delegate
  </button>
)}
```

**✅ Checklist:**
- [ ] Hook integrated
- [ ] UI components added
- [ ] Toast notifications
- [ ] Error handling

---

## Complete Example: Adding Task Delegation {#example}

This section shows the complete implementation of a task delegation feature.

### Business Requirements
- Users should be able to delegate their assigned tasks to other users
- Only the currently assigned user can delegate
- Cannot delegate completed tasks
- Cannot delegate to yourself
- System should track who delegated to whom

### Implementation Files

```
✅ src/domain/events/TaskDelegatedEvent.ts
✅ src/domain/entities/Task.ts (add delegate method)
✅ src/domain/entities/Task.test.ts (add tests)
✅ src/application/useCases/DelegateTaskUseCase.ts
✅ src/application/useCases/DelegateTaskUseCase.test.ts
✅ src/application/eventHandlers/TaskDelegatedEventHandler.ts
✅ src/infrastructure/events/EventPublisherFactory.ts (register handler)
✅ src/infrastructure/di/ServiceContainer.ts (register use case)
✅ src/presentation/hooks/useTaskManagement.ts (add delegateTask)
✅ src/presentation/components/TaskManagementApp.tsx (add UI)
```

### Testing Checklist

```bash
# Run unit tests
npm test

# Run build
npm run build

# Manual testing:
# 1. Create a task
# 2. Assign it to yourself
# 3. Click "Delegate" button
# 4. Select another user
# 5. Verify task is reassigned
# 6. Check console for domain events
# 7. Check event log in UI
```

---

## Best Practices {#best-practices}

### 1. Domain Layer Purity
✅ **DO:**
- Keep domain logic independent of frameworks
- Use value objects for domain concepts
- Validate all business rules in entities
- Emit domain events for important state changes

❌ **DON'T:**
- Import React, Express, or database libraries
- Access external services directly
- Use primitives instead of value objects
- Leave business rules in use cases

### 2. Value Objects vs Entities
✅ **Use Value Objects when:**
- Object has no identity
- Object is immutable
- Objects with same values are interchangeable

✅ **Use Entities when:**
- Object has unique identity
- Object changes over time
- Identity matters more than attributes

### 3. Domain Events
✅ **DO:**
- Name events in past tense (`TaskCompleted`, not `CompleteTask`)
- Include all relevant context
- Make events immutable
- Emit events AFTER state changes

❌ **DON'T:**
- Use events for validation
- Include complex objects (use IDs)
- Emit events before validating

### 4. Use Cases
✅ **DO:**
- Keep use cases thin
- Follow single responsibility principle
- Always pull and publish domain events
- Handle transaction boundaries

❌ **DON'T:**
- Put business logic in use cases
- Skip event publishing
- Return entities directly to presentation

### 5. Testing
✅ **DO:**
- Test business rules in domain tests
- Test orchestration in use case tests
- Test integration in presentation tests
- Use descriptive test names

❌ **DON'T:**
- Mock domain objects in domain tests
- Test implementation details
- Skip edge cases

---

## Common Pitfalls {#pitfalls}

### 1. Business Logic Leakage

❌ **Wrong:**
```typescript
// Use case with business logic
export class CompleteTaskUseCase {
  async execute(taskId: string, userId: string): Promise<void> {
    const task = await this.repository.findById(taskId);

    // ❌ Business logic in use case
    if (task.status === 'DONE') {
      throw new Error('Task is already completed');
    }

    if (task.assignedTo !== userId) {
      throw new Error('Only assigned user can complete');
    }

    task.status = 'DONE';
    task.completedAt = new Date();
    await this.repository.save(task);
  }
}
```

✅ **Correct:**
```typescript
// Use case delegates to domain
export class CompleteTaskUseCase {
  async execute(taskId: string, userId: string): Promise<void> {
    const task = await this.repository.findById(taskId);

    // ✅ Entity handles business logic
    task.complete(UserId.create(userId));

    await this.repository.save(task);
    this.publishEvents(task.pullDomainEvents());
  }
}

// Domain entity with business logic
class Task {
  complete(userId: UserId): void {
    // ✅ All validation here
    if (this.props.status.isDone()) {
      throw new Error('Task is already completed');
    }

    if (this.props.assignment && !this.props.assignment.isAssignedTo(userId)) {
      throw new Error('Only assigned user can complete this task');
    }

    this.props.status = TaskStatus.done();
    this.props.completedAt = new Date();
    this.addDomainEvent(new TaskCompletedEvent(/*...*/));
  }
}
```

### 2. Primitive Obsession

❌ **Wrong:**
```typescript
// Using primitives everywhere
interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: string;
}

// Hard to validate, easy to misuse
task.priority = "super-mega-urgent"; // No compile-time safety
```

✅ **Correct:**
```typescript
// Using value objects
class TaskPriority {
  private constructor(private readonly level: number) {}

  static low() { return new TaskPriority(1); }
  static medium() { return new TaskPriority(2); }
  static high() { return new TaskPriority(3); }

  isHigherThan(other: TaskPriority): boolean {
    return this.level > other.level;
  }
}

// Type-safe, encapsulated
task.changePriority(TaskPriority.high());
```

### 3. Forgotten Domain Events

❌ **Wrong:**
```typescript
// Forgetting to publish events
class Task {
  complete(userId: UserId): void {
    this.props.status = TaskStatus.done();
    this.props.completedAt = new Date();
    // ❌ No event! System won't be notified
  }
}
```

✅ **Correct:**
```typescript
class Task {
  complete(userId: UserId): void {
    this.props.status = TaskStatus.done();
    this.props.completedAt = new Date();

    // ✅ Always emit events
    this.addDomainEvent(new TaskCompletedEvent(
      this.props.id,
      userId,
      this.props.completedAt
    ));
  }
}
```

### 4. Anemic Domain Model

❌ **Wrong:**
```typescript
// All getters/setters, no behavior
class Task {
  getStatus() { return this.status; }
  setStatus(status) { this.status = status; }
  getAssignment() { return this.assignment; }
  setAssignment(assignment) { this.assignment = assignment; }
}

// Business logic in service
class TaskService {
  completeTask(task: Task) {
    if (task.getStatus() === 'TODO') {
      task.setStatus('DONE');
      task.setCompletedAt(new Date());
    }
  }
}
```

✅ **Correct:**
```typescript
// Rich domain model with behavior
class Task {
  complete(userId: UserId): void {
    // Business rules
    if (this.props.status.isDone()) {
      throw new Error('Task is already completed');
    }

    // State changes
    this.props.status = TaskStatus.done();
    this.props.completedAt = new Date();

    // Events
    this.addDomainEvent(new TaskCompletedEvent(/*...*/));
  }
}
```

---

## Testing Strategy {#testing}

### Domain Layer Tests
```typescript
// Test business rules, not implementation
describe('Task.complete', () => {
  it('should mark task as done', () => {
    const task = createAssignedTask();
    task.complete(assignedUser);
    expect(task.status.isDone()).toBe(true);
  });

  it('should set completion timestamp', () => {
    const before = new Date();
    const task = createAssignedTask();
    task.complete(assignedUser);
    expect(task.completedAt).toBeInstanceOf(Date);
    expect(task.completedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('should emit TaskCompletedEvent', () => {
    const task = createAssignedTask();
    task.complete(assignedUser);
    const events = task.pullDomainEvents();
    expect(events).toContainEqual(expect.any(TaskCompletedEvent));
  });

  it('should reject completion by non-assigned user', () => {
    const task = createAssignedTask();
    const otherUser = UserId.create('other');
    expect(() => task.complete(otherUser)).toThrow();
  });
});
```

### Use Case Tests
```typescript
// Test orchestration and integration
describe('CompleteTaskUseCase', () => {
  it('should save completed task', async () => {
    const task = await setupTask();
    await useCase.execute(task.id, userId);
    const saved = await repository.findById(task.id);
    expect(saved.status.isDone()).toBe(true);
  });

  it('should publish domain events', async () => {
    const task = await setupTask();
    await useCase.execute(task.id, userId);
    expect(eventPublisher.publishedEvents).toContainEqual(
      expect.any(TaskCompletedEvent)
    );
  });
});
```

### Test Coverage Goals
- **Domain Layer:** 100% (all business rules)
- **Application Layer:** 90%+ (all use cases and handlers)
- **Infrastructure Layer:** 70%+ (complex logic only)
- **Presentation Layer:** 80%+ (user interactions)

---

## Quick Reference Checklist

When adding a new feature:

### Domain Layer
- [ ] Create domain event (if needed)
- [ ] Add method to entity with business rules
- [ ] Emit domain event after state change
- [ ] Write comprehensive entity tests
- [ ] Ensure no external dependencies

### Application Layer
- [ ] Create use case following the pattern
- [ ] Load aggregate, call domain method, save, publish events
- [ ] Write use case tests with mocks
- [ ] Create event handler
- [ ] Write event handler tests (optional)

### Infrastructure Layer
- [ ] Register event handler in `EventPublisherFactory`
- [ ] Register use case in `ServiceContainer`

### Presentation Layer
- [ ] Add function to `useTaskManagement` hook
- [ ] Subscribe to new domain event for event log
- [ ] Add UI component in `TaskManagementApp`
- [ ] Add toast notifications
- [ ] Test end-to-end manually

### Final Steps
- [ ] Run all tests: `npm test`
- [ ] Run build: `npm run build`
- [ ] Manual testing in UI
- [ ] Update documentation if needed

---

## Resources

- **Original DDD Book:** *Domain-Driven Design* by Eric Evans
- **Practical DDD:** *Implementing Domain-Driven Design* by Vaughn Vernon
- **Event Sourcing:** Greg Young's talks and blog posts
- **Project Tests:** Best examples of patterns in `src/domain/entities/Task.test.ts`

---

## Questions?

When in doubt:
1. **Look at existing code** - Follow the pattern of `CompleteTaskUseCase` and `ReopenTaskUseCase`
2. **Ask:** "Does this belong in the domain?" - If yes, put it in an entity
3. **Remember:** Use cases orchestrate, entities decide
4. **Test first** - Write the test to understand what you're building

Happy coding! 🚀
