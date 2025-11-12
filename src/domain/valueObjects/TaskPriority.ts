export enum PriorityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export class TaskPriority {
  private constructor(
    private readonly level: PriorityLevel,
    private readonly autoEscalationDate?: Date
  ) {}

  static low(): TaskPriority {
    return new TaskPriority(PriorityLevel.LOW);
  }

  static medium(): TaskPriority {
    return new TaskPriority(PriorityLevel.MEDIUM);
  }

  static high(): TaskPriority {
    return new TaskPriority(PriorityLevel.HIGH);
  }

  static critical(): TaskPriority {
    return new TaskPriority(PriorityLevel.CRITICAL);
  }

  static fromLevel(level: PriorityLevel): TaskPriority {
    return new TaskPriority(level);
  }

  static reconstitute(level: PriorityLevel, autoEscalationDate?: Date): TaskPriority {
    return new TaskPriority(level, autoEscalationDate);
  }

  getLevel(): PriorityLevel {
    return this.level;
  }

  escalate(): TaskPriority {
    const newLevel = Math.min(this.level + 1, PriorityLevel.CRITICAL) as PriorityLevel;
    return new TaskPriority(newLevel, new Date());
  }

  shouldEscalate(daysOld: number): boolean {
    switch (this.level) {
      case PriorityLevel.LOW:
        return daysOld > 30;
      case PriorityLevel.MEDIUM:
        return daysOld > 14;
      case PriorityLevel.HIGH:
        return daysOld > 7;
      case PriorityLevel.CRITICAL:
        return false;
    }
  }

  isHigherThan(other: TaskPriority): boolean {
    return this.level > other.level;
  }

  equals(other: TaskPriority): boolean {
    return this.level === other.level;
  }

  toString(): string {
    return PriorityLevel[this.level];
  }

  toJSON() {
    return {
      level: this.level,
      autoEscalationDate: this.autoEscalationDate?.toISOString()
    };
  }
}
