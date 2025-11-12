export class TaskTitle {
  private static readonly MAX_LENGTH = 200;
  
  private constructor(private readonly value: string) {
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      throw new Error('Task title cannot be empty');
    }
    
    if (trimmed.length > TaskTitle.MAX_LENGTH) {
      throw new Error(`Task title cannot exceed ${TaskTitle.MAX_LENGTH} characters`);
    }
    
    this.value = trimmed;
  }

  static create(value: string): TaskTitle {
    return new TaskTitle(value);
  }

  toString(): string {
    return this.value;
  }
}
