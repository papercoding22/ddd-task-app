import { Task } from '../../domain/entities/Task';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle';
import { TaskPriority } from '../../domain/valueObjects/TaskPriority';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async execute(
    title: string,
    priority: TaskPriority = TaskPriority.medium(),
    dueDate?: Date
  ): Promise<Task> {
    const taskTitle = TaskTitle.create(title);
    const task = Task.create(taskTitle, priority, dueDate);
    
    await this.taskRepository.save(task);
    
    const events = task.pullDomainEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
    
    return task;
  }
}
