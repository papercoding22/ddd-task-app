export enum TaskStatusType {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export class TaskStatus {
  private constructor(private readonly value: TaskStatusType) {}

  static todo(): TaskStatus {
    return new TaskStatus(TaskStatusType.TODO);
  }

  static inProgress(): TaskStatus {
    return new TaskStatus(TaskStatusType.IN_PROGRESS);
  }

  static done(): TaskStatus {
    return new TaskStatus(TaskStatusType.DONE);
  }

  static fromString(status: string): TaskStatus {
    const statusType = TaskStatusType[status as keyof typeof TaskStatusType];
    if (!statusType) {
      throw new Error(`Invalid task status: ${status}`);
    }
    return new TaskStatus(statusType);
  }

  toString(): string {
    return this.value;
  }

  isTodo(): boolean {
    return this.value === TaskStatusType.TODO;
  }

  isDone(): boolean {
    return this.value === TaskStatusType.DONE;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}
