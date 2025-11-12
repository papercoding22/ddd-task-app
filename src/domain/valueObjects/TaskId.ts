export class TaskId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }
  }

  static create(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  static fromString(id: string): TaskId {
    return new TaskId(id);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }
}
