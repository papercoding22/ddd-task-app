# Domain-Driven Design Task Management Application

A complete React + TypeScript application demonstrating **Domain-Driven Design (DDD)** principles with **Domain Events**, built with a clean architecture.

## 🎯 What This Demo Shows

This application demonstrates advanced DDD concepts:

- ✅ **Value Objects** - Encapsulated business rules (TaskId, TaskTitle, TaskPriority, etc.)
- ✅ **Entities** - Rich domain models with business logic (Task entity)
- ✅ **Domain Events** - Decoupled side effects (TaskCompleted, TaskAssigned, TaskPriorityEscalated)
- ✅ **Domain Services** - Multi-entity operations (TaskDependencyService)
- ✅ **Repositories** - Data persistence abstraction
- ✅ **Use Cases** - Application layer orchestration
- ✅ **Event-Driven Architecture** - Publisher/Subscriber pattern
- ✅ **Dependency Injection** - Service container pattern
- ✅ **Clean Architecture** - Layered separation of concerns

## 📁 Project Structure

```
src/
├── domain/                      # Business logic (Framework-independent)
│   ├── entities/
│   │   └── Task.ts             # Rich domain entity with business rules
│   ├── valueObjects/           # Immutable value objects
│   │   ├── TaskId.ts
│   │   ├── TaskTitle.ts
│   │   ├── TaskStatus.ts
│   │   ├── TaskPriority.ts
│   │   ├── TaskAssignment.ts
│   │   ├── TaskDependency.ts
│   │   └── UserId.ts
│   ├── events/                 # Domain events
│   │   ├── DomainEvent.ts
│   │   ├── TaskCompletedEvent.ts
│   │   ├── TaskAssignedEvent.ts
│   │   └── TaskPriorityEscalatedEvent.ts
│   ├── services/               # Domain services
│   │   └── TaskDependencyService.ts
│   └── repositories/           # Repository interfaces
│       └── ITaskRepository.ts
│
├── application/                # Application logic
│   ├── useCases/              # Business use cases
│   │   ├── CreateTaskUseCase.ts
│   │   ├── AssignTaskUseCase.ts
│   │   ├── CompleteTaskUseCase.ts
│   │   └── GetAllTasksUseCase.ts
│   ├── services/              # Application services
│   │   └── DomainEventPublisher.ts
│   └── eventHandlers/         # Event handlers (side effects)
│       ├── TaskCompletedEventHandler.ts
│       ├── TaskAssignedEventHandler.ts
│       └── TaskPriorityEscalatedEventHandler.ts
│
├── infrastructure/            # External concerns
│   ├── repositories/
│   │   └── LocalStorageTaskRepository.ts
│   ├── events/
│   │   └── EventPublisherFactory.ts
│   └── di/
│       └── ServiceContainer.ts
│
└── presentation/              # UI layer
    ├── components/
    │   └── TaskManagementApp.tsx
    └── hooks/
        └── useTaskManagement.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## 🎮 Features & Demo

### 1. Create Tasks with Business Rules
- Task titles are validated (1-200 characters)
- Priority levels: Low, Medium, High, Critical
- Domain events are automatically triggered

### 2. Task Assignment
- Assign tasks to users
- Only assigned users can complete tasks
- Assignment events trigger notifications

### 3. Task Completion
- Complete tasks and see completion events
- Completed tasks cannot be modified
- Completion triggers multiple event handlers

### 4. Domain Events Log
- Real-time event log in the sidebar
- See all domain events as they occur
- Console shows detailed event information

### 5. Business Rules Enforcement
- Tasks must be assigned before starting
- Completed tasks cannot be reassigned
- Dependency management prevents circular dependencies
- Priority auto-escalation based on age

## 🏗️ Architecture Highlights

### Value Objects (Immutability + Validation)
```typescript
// TaskTitle enforces business rules
const title = TaskTitle.create("My Task"); // ✅ Valid
const invalid = TaskTitle.create(""); // ❌ Throws error
```

### Rich Domain Entities
```typescript
// Business logic lives in the domain
task.assignTo(userId, assignedBy);
task.complete(userId);
task.checkAndEscalatePriority();
```

### Domain Events (Decoupling)
```typescript
// Events are created in domain logic
task.complete(userId); // Creates TaskCompletedEvent

// Event handlers respond independently
TaskCompletedEventHandler → Send notifications
TaskCompletedEventHandler → Update analytics
```

### Repository Pattern (Persistence Abstraction)
```typescript
// Easy to swap implementations
const repository = new LocalStorageTaskRepository();
// Could easily become: new ApiTaskRepository()
```

## 💡 Key DDD Concepts Demonstrated

### 1. **Ubiquitous Language**
Code uses business terms: Task, Assignment, Priority, Dependencies

### 2. **Bounded Context**
Task Management is a complete bounded context

### 3. **Aggregate Roots**
Task is an aggregate root managing its own consistency

### 4. **Domain Events**
Business events trigger cross-cutting concerns

### 5. **Value Objects**
Immutable, validated objects with business meaning

### 6. **Entities**
Objects with identity and lifecycle

### 7. **Domain Services**
Operations spanning multiple entities

## 🧪 Testing Domain Logic

The domain layer is completely framework-independent and easily testable:

```typescript
describe('Task', () => {
  it('should not allow completing a task twice', () => {
    const task = Task.create(TaskTitle.create('Test'));
    const userId = UserId.create('user-1');
    
    task.complete(userId);
    
    expect(() => task.complete(userId))
      .toThrow('Task is already completed');
  });
});
```

## 🎓 Learning Resources

This application demonstrates patterns from:
- Eric Evans' "Domain-Driven Design"
- Vaughn Vernon's "Implementing Domain-Driven Design"
- Martin Fowler's "Patterns of Enterprise Application Architecture"

## 📝 Next Steps

To extend this application:

1. **Add More Domain Logic**: Task dependencies, subtasks, time tracking
2. **Implement API Repository**: Replace localStorage with REST API
3. **Add Authentication**: Real user management
4. **Create More Events**: TaskStarted, TaskBlocked, etc.
5. **Add Specifications**: Complex query patterns
6. **Implement CQRS**: Separate read and write models

## 🤝 Contributing

This is a demonstration project for learning DDD principles. Feel free to:
- Fork and experiment
- Add new features following DDD patterns
- Share improvements

## 📄 License

MIT

---

**Built with ❤️ to demonstrate Domain-Driven Design in React + TypeScript**
