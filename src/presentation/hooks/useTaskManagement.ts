import { useState, useEffect } from 'react';
import { Task } from '../../domain/entities/Task';
import { TaskPriority } from '../../domain/valueObjects/TaskPriority';
import { ServiceContainer } from '../../infrastructure/di/ServiceContainer';

export const useTaskManagement = (currentUserId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const container = ServiceContainer.getInstance();

  useEffect(() => {
    const publisher = container.eventPublisher;

    const eventLogger = (event: any) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `[${timestamp}] ${event.eventType}`;
      setEventLog(prev => [logMessage, ...prev].slice(0, 20));
    };

    publisher.subscribe('TaskCompleted', eventLogger);
    publisher.subscribe('TaskAssigned', eventLogger);
    publisher.subscribe('TaskPriorityEscalated', eventLogger);

    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await container.getAllTasksUseCase.execute();
      setTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (
    title: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    dueDate?: Date
  ) => {
    try {
      setError(null);
      
      let taskPriority: TaskPriority;
      switch (priority) {
        case 'low': taskPriority = TaskPriority.low(); break;
        case 'high': taskPriority = TaskPriority.high(); break;
        case 'critical': taskPriority = TaskPriority.critical(); break;
        default: taskPriority = TaskPriority.medium();
      }

      await container.createTaskUseCase.execute(title, taskPriority, dueDate);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const assignTask = async (taskId: string, assignedToUserId: string) => {
    try {
      setError(null);
      await container.assignTaskUseCase.execute(taskId, assignedToUserId, currentUserId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign task');
      throw err;
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      setError(null);
      await container.completeTaskUseCase.execute(taskId, currentUserId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
      throw err;
    }
  };

  const clearEventLog = () => {
    setEventLog([]);
  };

  return {
    tasks,
    loading,
    error,
    eventLog,
    createTask,
    assignTask,
    completeTask,
    clearEventLog,
    refreshTasks: loadTasks
  };
};
