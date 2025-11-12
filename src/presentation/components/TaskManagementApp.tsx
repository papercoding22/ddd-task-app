import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TaskManagementApp: React.FC = () => {
  const currentUserId = 'user-123';
  const {
    tasks,
    loading,
    error,
    eventLog,
    createTask,
    assignTask,
    completeTask,
    reopenTask,
    clearEventLog
  } = useTaskManagement(currentUserId);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [showEventLog, setShowEventLog] = useState(true);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreateTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask(newTaskTitle, selectedPriority);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }, [newTaskTitle, selectedPriority, createTask]);

  const handleAssignToMe = useCallback(async (taskId: string) => {
    try {
      await assignTask(taskId, currentUserId);
    } catch (err) {
      console.error('Failed to assign task:', err);
    }
  }, [assignTask, currentUserId]);

  const handleComplete = useCallback(async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  }, [completeTask]);

  const handleReopen = useCallback(async (taskId: string) => {
    try {
      await reopenTask(taskId);
      toast.success('Task successfully reopened!');
    } catch (err) {
      console.error('Failed to reopen task:', err);
    }
  }, [reopenTask]);

  const canReopenTask = useCallback((task: any): boolean => {
    if (!task.status.isDone() || !task.completedAt) {
      return false;
    }

    const completedAt = new Date(task.completedAt);
    const daysSinceCompletion = (new Date().getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceCompletion <= 7;
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const completedTasksCount = useMemo(() => {
    return tasks.filter(t => t.status.isDone()).length;
  }, [tasks]);

  const activeTasksCount = useMemo(() => {
    return tasks.filter(t => !t.status.isDone()).length;
  }, [tasks]);

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Management System
          </h1>
          <p className="text-gray-600">Domain-Driven Design + Domain Events Demo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Task Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as any)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🟠 High Priority</option>
                    <option value="critical">🔴 Critical Priority</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Tasks ({tasks.length})
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ {completedTasksCount} Completed
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ⏳ {activeTasksCount} Active
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-lg">No tasks yet</p>
                    <p className="text-gray-400 text-sm">Create your first task above to get started!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id.toString()}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={task.status.isDone()}
                          onChange={() => handleComplete(task.id.toString())}
                          disabled={task.status.isDone()}
                          className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`text-lg font-semibold ${task.status.isDone() ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title.toString()}
                            </h3>
                            <div className="flex gap-2">
                              {!task.assignment && !task.status.isDone() && (
                                <button
                                  onClick={() => handleAssignToMe(task.id.toString())}
                                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                                >
                                  Assign to Me
                                </button>
                              )}
                              {canReopenTask(task) && (
                                <button
                                  onClick={() => handleReopen(task.id.toString())}
                                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                                >
                                  🔄 Reopen
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status.toString())}`}>
                              {task.status.toString().replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority.toString())}`}>
                              {task.priority.toString()}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {task.getAgeInDays()} days old
                            </span>
                          </div>

                          {task.assignment && (
                            <p className="text-sm text-gray-600">
                              👤 Assigned to: <span className="font-medium">{task.assignment.getAssignedTo().toString()}</span>
                            </p>
                          )}

                          {task.isOverdue() && (
                            <div className="mt-2 flex items-center text-red-600 text-sm font-semibold">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              OVERDUE
                            </div>
                          )}

                          {task.hasBlockingDependencies() && (
                            <div className="mt-2 flex items-center text-yellow-600 text-sm font-semibold">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Has blocking dependencies
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Event Log Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Domain Events
                </h2>
                <button
                  onClick={() => setShowEventLog(!showEventLog)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showEventLog ? 'Hide' : 'Show'}
                </button>
              </div>

              {showEventLog && (
                <>
                  <div className="flex justify-between items-center mb-3 pb-3 border-b">
                    <span className="text-sm text-gray-600">
                      {eventLog.length} events
                    </span>
                    <button
                      onClick={clearEventLog}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {eventLog.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          No events yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Perform actions to see domain events!
                        </p>
                      </div>
                    ) : (
                      eventLog.map((log, index) => (
                        <div
                          key={index}
                          className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 hover:border-indigo-300 transition"
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2 text-indigo-900">💡 Try These:</h3>
                    <ul className="text-xs space-y-1 text-indigo-800">
                      <li>• Create a task</li>
                      <li>• Assign task to yourself</li>
                      <li>• Complete a task</li>
                      <li>• Reopen a completed task</li>
                      <li>• Check console for details</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
