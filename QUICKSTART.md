# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
cd ddd-task-app
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit `http://localhost:5173`

That's it! The app should now be running.

## 🎮 What to Try

### 1. Create Your First Task
1. Enter a task title: "Implement user authentication"
2. Select priority: "High Priority"
3. Click "Create Task"
4. **Watch the Domain Events log** → You'll see events flowing through the system!

### 2. Assign a Task
1. Click "Assign to Me" on any task
2. **Check the event log** → See `TaskAssignedEvent`
3. **Open browser console** → See detailed event information

### 3. Complete a Task
1. Check the checkbox on an assigned task
2. **Watch multiple events fire**:
   - TaskCompletedEvent
   - Analytics update
   - Notification simulation
3. Notice the task is now marked as completed

### 4. Observe Business Rules
Try these to see domain rules in action:

- ✅ Create a task → Works fine
- ❌ Try to complete a task without assigning it first → Error!
- ❌ Try to complete an already completed task → Error!
- ✅ Assign a task then complete it → Works!

## 🔍 What's Happening Behind the Scenes

### When You Create a Task:

```
UI Component
    ↓
useTaskManagement Hook
    ↓
CreateTaskUseCase
    ↓
Task.create() [Domain Logic]
    ↓
LocalStorageTaskRepository.save()
    ↓
Domain Events Published
    ↓
Event Handlers Execute
    ↓
UI Updates
```

### Domain Events in Action:

Open your browser's **Developer Console** (F12) and perform actions. You'll see:

```
✅ Event Publisher initialized with all handlers
🎉 Task Completed Event Triggered!
Task ID: 550e8400-e29b-41d4-a716-446655440000
Completed by: user-123
📧 Sending notification: Task completed by user user-123
📊 Analytics: Task completion recorded
📈 Secondary handler: Updating dashboard metrics
```

## 📁 File Structure Overview

```
src/
├── domain/           ← Business Logic (Start here!)
│   ├── entities/     ← Task entity with business rules
│   ├── valueObjects/ ← Validated, immutable objects
│   └── events/       ← Domain events
│
├── application/      ← Use Cases (Business workflows)
│   ├── useCases/     ← CreateTask, AssignTask, etc.
│   └── eventHandlers/← React to domain events
│
├── infrastructure/   ← External concerns
│   ├── repositories/ ← Data persistence
│   └── di/          ← Dependency injection
│
└── presentation/     ← UI Layer
    ├── components/   ← React components
    └── hooks/        ← React hooks
```

## 🎓 Learning Path

### Beginner: Understanding the Basics
1. Open `src/domain/valueObjects/TaskTitle.ts`
   - See how validation is enforced
   - Try to create an empty title (it will fail!)

2. Open `src/domain/entities/Task.ts`
   - See business rules like `complete()` method
   - Notice how it creates domain events

3. Open `src/presentation/components/TaskManagementApp.tsx`
   - See how UI calls use cases
   - Notice it never touches domain objects directly

### Intermediate: Following the Flow
1. **Set a breakpoint** in `CreateTaskUseCase.execute()`
2. Create a task in the UI
3. **Step through** the code:
   - Value object creation
   - Entity creation
   - Repository save
   - Event publishing

### Advanced: Extending the System
Try adding new features:

1. **Add Task Description**:
   - Create `TaskDescription` value object
   - Update `Task` entity
   - Update UI

2. **Add New Event**:
   - Create `TaskDeletedEvent`
   - Create event handler
   - Wire it up in `EventPublisherFactory`

3. **Add Priority Auto-Escalation**:
   - Already built! Just needs a scheduler
   - See `task.checkAndEscalatePriority()`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Check TypeScript
npm run build

# If errors, check tsconfig.json
```

## 💡 Tips for Learning DDD

### 1. Start with Domain Layer
Don't start with the UI. Start with:
- What is a Task?
- What can you do with a Task?
- What rules govern Tasks?

### 2. Think in Business Terms
Use language like:
- "Complete a task" (not "update status field")
- "Assign to user" (not "set userId property")
- "Escalate priority" (not "increment priority value")

### 3. Protect Your Domain
The domain layer should:
- ✅ Have no framework dependencies
- ✅ Contain all business rules
- ✅ Be completely testable
- ❌ Never import from React
- ❌ Never know about HTTP or databases

### 4. Listen to Domain Events
Events tell you what happened:
- `TaskCompletedEvent` → "A task was completed"
- `TaskAssignedEvent` → "A task was assigned"

They enable:
- Audit logs
- Notifications
- Analytics
- Eventual consistency

## 🎯 Next Steps

1. **Read the docs**:
   - `README.md` - Project overview
   - `ARCHITECTURE.md` - Deep dive into architecture

2. **Explore the code**:
   - Start with `Task.ts` entity
   - Follow a use case end-to-end
   - See how events flow

3. **Experiment**:
   - Add new features
   - Break things (see what fails)
   - Add tests

4. **Build something**:
   - Apply these patterns to your own project
   - Start small with one domain

## 📚 Resources

- [Domain-Driven Design Quickly (Free PDF)](https://www.infoq.com/minibooks/domain-driven-design-quickly/)
- [Microsoft's DDD Guide](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)
- [Martin Fowler's Blog on DDD](https://martinfowler.com/tags/domain%20driven%20design.html)

## 🤝 Questions?

- Check the console for detailed event logs
- Read the ARCHITECTURE.md for design decisions
- Explore the code - it's heavily commented!

---

Happy coding! 🚀
