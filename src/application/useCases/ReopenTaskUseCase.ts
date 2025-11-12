import { TaskId } from '../../domain/valueObjects/TaskId';
import { UserId } from '../../domain/valueObjects/UserId';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { DomainEventPublisher } from '../services/DomainEventPublisher';

export class ReopenTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async execute(taskId: string, userId: string): Promise<void> {
    const id = TaskId.fromString(taskId);
    const user = UserId.create(userId);

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    task.reopen(user);

    await this.taskRepository.save(task);

    const events = task.pullDomainEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
  }
}
