import { UserId } from './UserId';

export class TaskAssignment {
  private constructor(
    private readonly assignedTo: UserId,
    private readonly assignedAt: Date,
    private readonly assignedBy: UserId
  ) {}

  static create(assignedTo: UserId, assignedBy: UserId): TaskAssignment {
    return new TaskAssignment(assignedTo, new Date(), assignedBy);
  }

  static reconstitute(assignedTo: UserId, assignedAt: Date, assignedBy: UserId): TaskAssignment {
    return new TaskAssignment(assignedTo, assignedAt, assignedBy);
  }

  getAssignedTo(): UserId {
    return this.assignedTo;
  }

  getAssignedBy(): UserId {
    return this.assignedBy;
  }

  getAssignedAt(): Date {
    return this.assignedAt;
  }

  isAssignedTo(userId: UserId): boolean {
    return this.assignedTo.equals(userId);
  }

  toJSON() {
    return {
      assignedTo: this.assignedTo.toString(),
      assignedAt: this.assignedAt.toISOString(),
      assignedBy: this.assignedBy.toString()
    };
  }
}
