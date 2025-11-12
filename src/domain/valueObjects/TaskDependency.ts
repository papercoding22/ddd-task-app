import { TaskId } from './TaskId';

export enum DependencyType {
  BLOCKS = 'BLOCKS',
  BLOCKED_BY = 'BLOCKED_BY',
  RELATED = 'RELATED'
}

export class TaskDependency {
  private constructor(
    private readonly dependentTaskId: TaskId,
    private readonly type: DependencyType
  ) {}

  static blocks(taskId: TaskId): TaskDependency {
    return new TaskDependency(taskId, DependencyType.BLOCKS);
  }

  static blockedBy(taskId: TaskId): TaskDependency {
    return new TaskDependency(taskId, DependencyType.BLOCKED_BY);
  }

  static relatedTo(taskId: TaskId): TaskDependency {
    return new TaskDependency(taskId, DependencyType.RELATED);
  }

  static reconstitute(dependentTaskId: TaskId, type: DependencyType): TaskDependency {
    return new TaskDependency(dependentTaskId, type);
  }

  getDependentTaskId(): TaskId {
    return this.dependentTaskId;
  }

  getType(): DependencyType {
    return this.type;
  }

  isBlocking(): boolean {
    return this.type === DependencyType.BLOCKED_BY;
  }

  toJSON() {
    return {
      dependentTaskId: this.dependentTaskId.toString(),
      type: this.type
    };
  }
}
