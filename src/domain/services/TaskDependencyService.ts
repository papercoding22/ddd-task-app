import { Task } from '../entities/Task';
import { TaskId } from '../valueObjects/TaskId';
import { TaskDependency } from '../valueObjects/TaskDependency';

export class TaskDependencyService {
  static wouldCreateCircularDependency(
    task: Task,
    newDependency: TaskDependency,
    allTasks: Task[]
  ): boolean {
    const visited = new Set<string>();
    const dependentTaskId = newDependency.getDependentTaskId();

    return this.hasCyclicDependency(
      dependentTaskId,
      task.id,
      allTasks,
      visited
    );
  }

  private static hasCyclicDependency(
    currentTaskId: TaskId,
    targetTaskId: TaskId,
    allTasks: Task[],
    visited: Set<string>
  ): boolean {
    if (currentTaskId.equals(targetTaskId)) {
      return true;
    }

    const currentTaskIdStr = currentTaskId.toString();
    
    if (visited.has(currentTaskIdStr)) {
      return false;
    }

    visited.add(currentTaskIdStr);

    const currentTask = allTasks.find(t => t.id.equals(currentTaskId));
    if (!currentTask) {
      return false;
    }

    for (const dep of currentTask.dependencies) {
      if (this.hasCyclicDependency(
        dep.getDependentTaskId(),
        targetTaskId,
        allTasks,
        visited
      )) {
        return true;
      }
    }

    return false;
  }

  static getBlockingTasks(task: Task, allTasks: Task[]): Task[] {
    const blockingDeps = task.getBlockingDependencies();
    
    return blockingDeps
      .map(dep => allTasks.find(t => t.id.equals(dep.getDependentTaskId())))
      .filter((t): t is Task => t !== undefined && !t.status.isDone());
  }

  static canComplete(task: Task, allTasks: Task[]): boolean {
    const blockingTasks = this.getBlockingTasks(task, allTasks);
    return blockingTasks.length === 0;
  }
}
