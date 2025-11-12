import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { LocalStorageTaskRepository } from '../repositories/LocalStorageTaskRepository';
import { DomainEventPublisher } from '../../application/services/DomainEventPublisher';
import { EventPublisherFactory } from '../events/EventPublisherFactory';
import { CreateTaskUseCase } from '../../application/useCases/CreateTaskUseCase';
import { AssignTaskUseCase } from '../../application/useCases/AssignTaskUseCase';
import { CompleteTaskUseCase } from '../../application/useCases/CompleteTaskUseCase';
import { GetAllTasksUseCase } from '../../application/useCases/GetAllTasksUseCase';

export class ServiceContainer {
  private static instance: ServiceContainer;
  
  private _taskRepository?: ITaskRepository;
  private _eventPublisher?: DomainEventPublisher;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get taskRepository(): ITaskRepository {
    if (!this._taskRepository) {
      this._taskRepository = new LocalStorageTaskRepository();
    }
    return this._taskRepository;
  }

  get eventPublisher(): DomainEventPublisher {
    if (!this._eventPublisher) {
      this._eventPublisher = EventPublisherFactory.create();
      console.log('✅ Event Publisher initialized with all handlers');
    }
    return this._eventPublisher;
  }

  get createTaskUseCase(): CreateTaskUseCase {
    return new CreateTaskUseCase(this.taskRepository, this.eventPublisher);
  }

  get assignTaskUseCase(): AssignTaskUseCase {
    return new AssignTaskUseCase(this.taskRepository, this.eventPublisher);
  }

  get completeTaskUseCase(): CompleteTaskUseCase {
    return new CompleteTaskUseCase(this.taskRepository, this.eventPublisher);
  }

  get getAllTasksUseCase(): GetAllTasksUseCase {
    return new GetAllTasksUseCase(this.taskRepository);
  }
}
