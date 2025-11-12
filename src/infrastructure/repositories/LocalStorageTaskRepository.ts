import { Task } from '../../domain/entities/Task';
import { TaskId } from '../../domain/valueObjects/TaskId';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle';
import { TaskStatus } from '../../domain/valueObjects/TaskStatus';
import { TaskPriority, PriorityLevel } from '../../domain/valueObjects/TaskPriority';
import { TaskAssignment } from '../../domain/valueObjects/TaskAssignment';
import { TaskDependency, DependencyType } from '../../domain/valueObjects/TaskDependency';
import { UserId } from '../../domain/valueObjects/UserId';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class LocalStorageTaskRepository implements ITaskRepository {
  private readonly STORAGE_KEY = 'ddd-tasks';

  async save(task: Task): Promise<void> {
    const tasks = await this.findAll();
    const index = tasks.findIndex(t => t.id.equals(task.id));
    
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    
    const dtos = tasks.map(t => t.toDTO());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos));
  }

  async findById(id: TaskId): Promise<Task | null> {
    const tasks = await this.findAll();
    return tasks.find(task => task.id.equals(id)) || null;
  }

  async findAll(): Promise<Task[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      const dtos = JSON.parse(data);
      return dtos.map((dto: any) => 
        Task.reconstitute({
          id: TaskId.fromString(dto.id),
          title: TaskTitle.create(dto.title),
          status: TaskStatus.fromString(dto.status),
          priority: TaskPriority.reconstitute(
            dto.priority.level as PriorityLevel,
            dto.priority.autoEscalationDate ? new Date(dto.priority.autoEscalationDate) : undefined
          ),
          assignment: dto.assignment ? TaskAssignment.reconstitute(
            UserId.create(dto.assignment.assignedTo),
            new Date(dto.assignment.assignedAt),
            UserId.create(dto.assignment.assignedBy)
          ) : undefined,
          dependencies: dto.dependencies.map((dep: any) => 
            TaskDependency.reconstitute(
              TaskId.fromString(dep.dependentTaskId),
              dep.type as DependencyType
            )
          ),
          createdAt: new Date(dto.createdAt),
          completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
        })
      );
    } catch (error) {
      console.error('Error parsing tasks from localStorage:', error);
      return [];
    }
  }

  async delete(id: TaskId): Promise<void> {
    const tasks = await this.findAll();
    const filtered = tasks.filter(task => !task.id.equals(id));
    const dtos = filtered.map(t => t.toDTO());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos));
  }
}
