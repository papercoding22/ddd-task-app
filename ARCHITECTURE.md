# Architecture Guide

## Overview

This application follows **Domain-Driven Design (DDD)** with **Clean Architecture** principles, creating a maintainable, testable, and scalable codebase.

## Layer Architecture

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                     │
│  (React Components, Hooks)                       │
│  - TaskManagementApp.tsx                         │
│  - useTaskManagement.ts                          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│           Application Layer                      │
│  (Use Cases, Event Handlers)                     │
│  - CreateTaskUseCase                             │
│  - AssignTaskUseCase                             │
│  - TaskCompletedEventHandler                     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│           Domain Layer                           │
│  (Business Logic - Framework Independent)        │
│  - Task Entity                                   │
│  - Value Objects (TaskId, TaskTitle, etc.)       │
│  - Domain Events                                 │
│  - Domain Services                               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│           Infrastructure Layer                   │
│  (External Concerns)                             │
│  - LocalStorageTaskRepository                    │
│  - EventPublisherFactory                         │
│  - ServiceContainer (DI)                         │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Task

```
1. User enters task title in UI
   ↓
2. TaskManagementApp calls createTask()
   ↓
3. useTaskManagement hook calls CreateTaskUseCase
   ↓
4. CreateTaskUseCase:
   - Creates TaskTitle value object (validates)
   - Creates Task entity with domain logic
   - Saves via Repository
   - Publishes domain events
   ↓
5. Event handlers execute side effects
   ↓
6. UI updates with new task list
```

### Domain Event Flow

```
Task.complete(userId)
   ↓
Domain Event Created: TaskCompletedEvent
   ↓
Event added to Task's internal events array
   ↓
UseCase calls task.pullDomainEvents()
   ↓
EventPublisher.publish(event)
   ↓
All subscribed handlers execute:
   - TaskCompletedEventHandler
   - Analytics handler
   - Notification handler
```

## Key Design Patterns

### 1. Value Objects

**Purpose**: Encapsulate business rules and ensure immutability

**Example**: TaskTitle
```typescript
class TaskTitle {
  private constructor(private readonly value: string) {
    // Validation in constructor
    if (trimmed.length === 0) {
      throw new Error('Task title cannot be empty');
    }
  }
  
  static create(value: string): TaskTitle {
    return new TaskTitle(value);
  }
}
```

**Benefits**:
- Validation happens once at creation
- Cannot be modified (immutable)
- Type-safe
- Self-documenting

### 2. Aggregate Root

**Purpose**: Maintain consistency boundaries

**Example**: Task Entity
```typescript
class Task {
  // Task is responsible for maintaining its own consistency
  assignTo(userId: UserId, assignedBy: UserId): void {
    if (this.props.status.isDone()) {
      throw new Error('Cannot assign completed task');
    }
    // ... other business rules
  }
}
```

**Benefits**:
- Business rules are enforced
- Consistency is guaranteed
- Clear ownership

### 3. Repository Pattern

**Purpose**: Abstract data persistence

**Example**:
```typescript
interface ITaskRepository {
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}

// Can be implemented as:
- LocalStorageTaskRepository
- ApiTaskRepository
- InMemoryTaskRepository (for testing)
```

**Benefits**:
- Easy to test (mock repositories)
- Easy to swap implementations
- Domain layer doesn't know about persistence

### 4. Domain Events

**Purpose**: Decouple side effects from business logic

**Example**:
```typescript
// When task is completed
task.complete(userId); // Creates TaskCompletedEvent

// Separate handlers respond:
class TaskCompletedEventHandler {
  async handle(event: TaskCompletedEvent) {
    await this.sendNotification();
    await this.updateAnalytics();
  }
}
```

**Benefits**:
- Business logic stays focused
- Side effects are isolated
- Easy to add new reactions
- Supports eventual consistency

### 5. Use Case Pattern

**Purpose**: Orchestrate domain objects to fulfill business requirements

**Example**:
```typescript
class AssignTaskUseCase {
  async execute(taskId: string, userId: string) {
    // 1. Load aggregate
    const task = await this.repository.findById(id);
    
    // 2. Execute domain logic
    task.assignTo(userId, assignedBy);
    
    // 3. Persist changes
    await this.repository.save(task);
    
    // 4. Publish events
    const events = task.pullDomainEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
  }
}
```

**Benefits**:
- Single responsibility
- Clear business intention
- Easy to test
- Transaction boundaries

## Dependency Rules

**The Dependency Rule**: Source code dependencies must point inward

```
Presentation → Application → Domain ← Infrastructure
```

- ✅ Presentation can depend on Application
- ✅ Application can depend on Domain
- ✅ Infrastructure can depend on Domain
- ❌ Domain NEVER depends on outer layers
- ❌ Domain NEVER depends on frameworks

## Testing Strategy

### Domain Layer (Unit Tests)
```typescript
// Pure business logic - No frameworks needed
describe('Task', () => {
  it('enforces business rules', () => {
    const task = Task.create(TaskTitle.create('Test'));
    expect(() => task.complete(userId).toThrow();
  });
});
```

### Application Layer (Integration Tests)
```typescript
// Test use cases with in-memory repository
describe('CreateTaskUseCase', () => {
  it('creates and persists task', async () => {
    const repository = new InMemoryTaskRepository();
    const useCase = new CreateTaskUseCase(repository, eventPublisher);
    
    await useCase.execute('Test Task', TaskPriority.high());
    
    const tasks = await repository.findAll();
    expect(tasks).toHaveLength(1);
  });
});
```

### Presentation Layer (Component Tests)
```typescript
// Test React components
describe('TaskManagementApp', () => {
  it('renders tasks', () => {
    render(<TaskManagementApp />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });
});
```

## Why This Architecture?

### ✅ Benefits

1. **Testability**: Domain logic can be tested without UI or database
2. **Flexibility**: Easy to change UI framework or database
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new features
5. **Team Collaboration**: Different layers can be worked on independently
6. **Business Alignment**: Code reflects business terminology

### ⚠️ Trade-offs

1. **More Code**: More files and abstractions than simple CRUD
2. **Learning Curve**: Team needs to understand DDD concepts
3. **Initial Overhead**: Takes longer to set up initially

### 🎯 When to Use This Architecture

**Good fit for**:
- Complex business logic
- Long-term projects
- Large teams
- Evolving requirements
- Need for testability

**Overkill for**:
- Simple CRUD applications
- Prototypes
- Very small projects
- Static requirements

## Common Pitfalls to Avoid

### ❌ Anemic Domain Model
```typescript
// BAD: Just data containers
class Task {
  id: string;
  title: string;
  status: string;
}

// Business logic in services
class TaskService {
  completeTask(task: Task) {
    task.status = 'DONE';
  }
}
```

### ✅ Rich Domain Model
```typescript
// GOOD: Behavior with data
class Task {
  complete(userId: UserId) {
    if (this.status.isDone()) {
      throw new Error('Already completed');
    }
    this.status = TaskStatus.done();
    this.addEvent(new TaskCompletedEvent(...));
  }
}
```

### ❌ Leaking Domain to UI
```typescript
// BAD: UI knows about domain objects
function TaskCard({ task }: { task: Task }) {
  // Don't use domain entities directly in UI
}
```

### ✅ Using DTOs
```typescript
// GOOD: Convert to DTOs for UI
function TaskCard({ task }: { task: TaskDTO }) {
  // Use plain objects in UI
}

const taskDTO = task.toDTO();
```

## Further Reading

- **Domain-Driven Design** by Eric Evans
- **Implementing Domain-Driven Design** by Vaughn Vernon
- **Clean Architecture** by Robert C. Martin
- **Patterns of Enterprise Application Architecture** by Martin Fowler

---

This architecture enables building complex applications that are maintainable, testable, and aligned with business needs.
