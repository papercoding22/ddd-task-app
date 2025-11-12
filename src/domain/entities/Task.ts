import { TaskId } from '../valueObjects/TaskId';
import { TaskTitle } from '../valueObjects/TaskTitle';
import { TaskStatus } from '../valueObjects/TaskStatus';
import { TaskPriority } from '../valueObjects/TaskPriority';
import { TaskAssignment } from '../valueObjects/TaskAssignment';
import { TaskDependency } from '../valueObjects/TaskDependency';
import { UserId } from '../valueObjects/UserId';
import { DomainEvent } from '../events/DomainEvent';
import { TaskCompletedEvent } from '../events/TaskCompletedEvent';
import { TaskAssignedEvent } from '../events/TaskAssignedEvent';
import { TaskPriorityEscalatedEvent } from '../events/TaskPriorityEscalatedEvent';

interface TaskProps {
  id: TaskId;
  title: TaskTitle;
  status: TaskStatus;
  priority: TaskPriority;
  assignment?: TaskAssignment;
  dependencies: TaskDependency[];
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export class Task {
  private domainEvents: DomainEvent[] = [];

  private constructor(private props: TaskProps) {}

  static create(
    title: TaskTitle,
    priority: TaskPriority = TaskPriority.medium(),
    dueDate?: Date
  ): Task {
    return new Task({
      id: TaskId.create(),
      title,
      status: TaskStatus.todo(),
      priority,
      dependencies: [],
      createdAt: new Date(),
      dueDate
    });
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): TaskId {
    return this.props.id;
  }

  get title(): TaskTitle {
    return this.props.title;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get priority(): TaskPriority {
    return this.props.priority;
  }

  get assignment(): TaskAssignment | undefined {
    return this.props.assignment;
  }

  get dependencies(): ReadonlyArray<TaskDependency> {
    return this.props.dependencies;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get dueDate(): Date | undefined {
    return this.props.dueDate;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  updateTitle(newTitle: TaskTitle, userId: UserId): void {
    if (this.props.status.isDone()) {
      throw new Error('Cannot update title of completed task');
    }

    if (this.props.assignment && !this.props.assignment.isAssignedTo(userId)) {
      throw new Error('Only assigned user can update task title');
    }

    this.props.title = newTitle;
  }

  assignTo(userId: UserId, assignedBy: UserId): void {
    if (this.props.status.isDone()) {
      throw new Error('Cannot assign completed task');
    }

    this.props.assignment = TaskAssignment.create(userId, assignedBy);
    this.addDomainEvent(new TaskAssignedEvent(this.props.id, userId, assignedBy));
  }

  unassign(): void {
    if (!this.props.assignment) {
      throw new Error('Task is not assigned');
    }
    this.props.assignment = undefined;
  }

  changePriority(newPriority: TaskPriority, userId: UserId): void {
    if (this.props.status.isDone()) {
      throw new Error('Cannot change priority of completed task');
    }

    const oldPriority = this.props.priority;
    this.props.priority = newPriority;

    if (newPriority.isHigherThan(oldPriority)) {
      this.addDomainEvent(new TaskPriorityEscalatedEvent(this.props.id, oldPriority, newPriority));
    }
  }

  checkAndEscalatePriority(): void {
    const ageInDays = this.getAgeInDays();
    
    if (this.props.priority.shouldEscalate(ageInDays)) {
      const oldPriority = this.props.priority;
      this.props.priority = this.props.priority.escalate();
      this.addDomainEvent(
        new TaskPriorityEscalatedEvent(this.props.id, oldPriority, this.props.priority)
      );
    }
  }

  addDependency(dependency: TaskDependency): void {
    const exists = this.props.dependencies.some(
      d => d.getDependentTaskId().equals(dependency.getDependentTaskId())
    );

    if (exists) {
      throw new Error('Dependency already exists');
    }

    if (dependency.getDependentTaskId().equals(this.props.id)) {
      throw new Error('Task cannot depend on itself');
    }

    this.props.dependencies.push(dependency);
  }

  removeDependency(dependentTaskId: TaskId): void {
    this.props.dependencies = this.props.dependencies.filter(
      d => !d.getDependentTaskId().equals(dependentTaskId)
    );
  }

  hasBlockingDependencies(): boolean {
    return this.props.dependencies.some(d => d.isBlocking());
  }

  getBlockingDependencies(): TaskDependency[] {
    return this.props.dependencies.filter(d => d.isBlocking());
  }

  startProgress(userId: UserId): void {
    if (!this.props.status.isTodo()) {
      throw new Error('Can only start tasks that are in TODO status');
    }

    if (!this.props.assignment) {
      throw new Error('Task must be assigned before starting');
    }

    if (!this.props.assignment.isAssignedTo(userId)) {
      throw new Error('Only assigned user can start this task');
    }

    if (this.hasBlockingDependencies()) {
      throw new Error('Cannot start task: blocked by dependencies');
    }

    this.props.status = TaskStatus.inProgress();
  }

  complete(userId: UserId): void {
    if (this.props.status.isDone()) {
      throw new Error('Task is already completed');
    }

    if (this.props.assignment && !this.props.assignment.isAssignedTo(userId)) {
      throw new Error('Only assigned user can complete this task');
    }

    this.props.status = TaskStatus.done();
    this.props.completedAt = new Date();

    this.addDomainEvent(new TaskCompletedEvent(
      this.props.id,
      userId,
      this.props.completedAt
    ));
  }

  reopen(userId: UserId): void {
    if (!this.props.status.isDone()) {
      throw new Error('Can only reopen completed tasks');
    }

    this.props.status = TaskStatus.todo();
    this.props.completedAt = undefined;
  }

  isOverdue(): boolean {
    if (!this.props.dueDate || this.props.status.isDone()) {
      return false;
    }
    return new Date() > this.props.dueDate;
  }

  getAgeInDays(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.props.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isAssignedTo(userId: UserId): boolean {
    return this.props.assignment?.isAssignedTo(userId) ?? false;
  }

  toDTO() {
    return {
      id: this.props.id.toString(),
      title: this.props.title.toString(),
      status: this.props.status.toString(),
      priority: this.props.priority.toJSON(),
      assignment: this.props.assignment?.toJSON(),
      dependencies: this.props.dependencies.map(d => d.toJSON()),
      createdAt: this.props.createdAt.toISOString(),
      completedAt: this.props.completedAt?.toISOString(),
      dueDate: this.props.dueDate?.toISOString(),
      isOverdue: this.isOverdue(),
      ageInDays: this.getAgeInDays()
    };
  }
}
