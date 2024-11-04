'use client';
import React, { useState } from 'react';
import styles from '../styles/TaskList.module.scss';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newSubtasks, setNewSubtasks] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editedSubtaskName, setEditedSubtaskName] = useState({});
  const [showSubtaskInput, setShowSubtaskInput] = useState({});

  const addTask = () => {
    if (newTaskName.trim() === '') return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        name: newTaskName,
        completed: false,
        subtasks: [],
      },
    ]);
    setNewTaskName('');
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
  };

  const saveTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, name: editedTaskName } : task,
      ),
    );
    setEditingTaskId(null);
    setEditedTaskName('');
  };

  const handleSubtaskInputChange = (taskId, value) => {
    setNewSubtasks({ ...newSubtasks, [taskId]: value });
  };

  const addSubtask = (taskId) => {
    if (newSubtasks[taskId]?.trim() === '') return;
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: Date.now().toString(),
                  name: newSubtasks[taskId],
                  completed: false,
                },
              ],
            }
          : task,
      ),
    );
    setNewSubtasks({ ...newSubtasks, [taskId]: '' });
    setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask.id !== subtaskId,
              ),
            }
          : task,
      ),
    );
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask,
              ),
            }
          : task,
      ),
    );
  };

  const startEditingSubtask = (taskId, subtask) => {
    setEditingSubtaskId({ taskId, subtaskId: subtask.id });
    setEditedSubtaskName({ ...editedSubtaskName, [subtask.id]: subtask.name });
  };

  const saveSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, name: editedSubtaskName[subtaskId] }
                  : subtask,
              ),
            }
          : task,
      ),
    );
    setEditingSubtaskId(null);
    setEditedSubtaskName({ ...editedSubtaskName, [subtaskId]: '' });
  };

  const toggleSubtaskInputVisibility = (taskId) => {
    setShowSubtaskInput((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const moveTaskUp = (taskId) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index > 0) {
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(index, 1);
      newTasks.splice(index - 1, 0, movedTask);
      setTasks(newTasks);
    }
  };

  const moveTaskDown = (taskId) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(index, 1);
      newTasks.splice(index + 1, 0, movedTask);
      setTasks(newTasks);
    }
  };

  return (
    <div className={styles.taskContainer}>
      <h2 className={styles.title}>Tasks</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add a new task"
        />
        <button className={styles.addButton} onClick={addTask}>
          Add Task
        </button>
      </div>

      <ul className={styles.taskList}>
        {tasks.map((task, index) => (
          <li key={`task-${task.id}`} className={styles.taskItem}>
            <div className={styles.taskRow}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className={styles.checkbox}
              />
              {editingTaskId === task.id ? (
                <input
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  onBlur={() => saveTask(task.id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') saveTask(task.id);
                  }}
                  className={styles.editInput}
                />
              ) : (
                <button
                  onClick={() => startEditing(task)}
                  className={`${styles.taskName} ${
                    task.completed ? styles.completed : ''
                  }`}
                >
                  {task.name}
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className={styles.addSubtaskButton}
                  onClick={() => toggleSubtaskInputVisibility(task.id)}
                >
                  +
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteTask(task.id)}
                >
                  x
                </button>
                <button
                  className={styles.moveButton}
                  onClick={() => moveTaskUp(task.id)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className={styles.moveButton}
                  onClick={() => moveTaskDown(task.id)}
                  disabled={index === tasks.length - 1}
                >
                  ↓
                </button>
              </div>
            </div>

            {showSubtaskInput[task.id] && (
              <div className={styles.subtaskContainer}>
                <input
                  className={styles.subtaskInput}
                  value={newSubtasks[task.id] || ''}
                  onChange={(e) =>
                    handleSubtaskInputChange(task.id, e.target.value)
                  }
                  placeholder="Add a subtask"
                />
                <button
                  className={styles.addSubtaskButton}
                  onClick={() => addSubtask(task.id)}
                >
                  Add
                </button>
              </div>
            )}
            <ul className={styles.subtaskList}>
              {task.subtasks.map((subtask) => (
                <li
                  key={`subtask-${subtask.id}`}
                  className={styles.subtaskItem}
                >
                  <div className={styles.subtaskRow}>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() =>
                        toggleSubtaskCompletion(task.id, subtask.id)
                      }
                      className={styles.checkbox}
                    />
                    {editingSubtaskId?.subtaskId === subtask.id &&
                    editingSubtaskId.taskId === task.id ? (
                      <input
                        value={editedSubtaskName[subtask.id] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEditedSubtaskName({
                            ...editedSubtaskName,
                            [subtask.id]: value,
                          });

                          // Delete the subtask if the input is empty
                          if (value.trim() === '') {
                            deleteSubtask(task.id, subtask.id);
                          }
                        }}
                        onBlur={() => saveSubtask(task.id, subtask.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            saveSubtask(task.id, subtask.id);
                          }
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <button
                        onClick={() => startEditingSubtask(task.id, subtask)}
                        className={styles.subtaskName}
                      >
                        {subtask.name}
                      </button>
                    )}
                    <button
                      className={styles.deleteSubtaskButton}
                      onClick={() => deleteSubtask(task.id, subtask.id)}
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
