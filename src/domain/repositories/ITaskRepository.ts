import { Task } from '../entities/Task';
import { TaskId } from '../valueObjects/TaskId';

export interface ITaskRepository {
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  delete(id: TaskId): Promise<void>;
}
