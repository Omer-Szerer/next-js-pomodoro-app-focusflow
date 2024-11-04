'use client';
import React, { useState } from 'react';
import styles from '../styles/TaskList.module.scss';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newSubtaskValues, setNewSubtaskValues] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState({
    taskId: null,
    subtaskId: null,
  });
  const [editedSubtaskName, setEditedSubtaskName] = useState({});
  const [showSubtaskInput, setShowSubtaskInput] = useState({});

  const addTask = () => {
    if (newTaskName.trim() === '') return;
    setTasks((prevTasks) => [
      ...prevTasks,
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
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
  };

  const saveTask = (taskId) => {
    // Check if editedTaskName is not empty
    if (editedTaskName.trim() === '') {
      setEditingTaskId(null); // Exit editing mode without saving
      return; // Prevent saving if the name is empty
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: editedTaskName } : task,
      ),
    );
    setEditingTaskId(null);
    setEditedTaskName('');
  };

  const handleSubtaskInputChange = (taskId, value) => {
    setNewSubtaskValues({ ...newSubtaskValues, [taskId]: value });
  };

  const addSubtask = (taskId) => {
    if (newSubtaskValues[taskId]?.trim() === '') return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: Date.now().toString(),
                  name: newSubtaskValues[taskId],
                  completed: false,
                },
              ],
            }
          : task,
      ),
    );
    setNewSubtaskValues((prev) => ({ ...prev, [taskId]: '' }));
    setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
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
    setEditedSubtaskName((prev) => ({ ...prev, [subtask.id]: subtask.name }));
  };

  const saveSubtask = (taskId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks
                .filter((subtask) => {
                  if (subtask.id === subtaskId) {
                    return editedSubtaskName[subtaskId]?.trim() !== ''; // Check if the name is not empty
                  }
                  return true; // Keep other subtasks
                })
                .map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, name: editedSubtaskName[subtaskId] }
                    : subtask,
                ),
            }
          : task,
      ),
    );
    setEditingSubtaskId({ taskId: null, subtaskId: null });
    setEditedSubtaskName((prev) => ({ ...prev, [subtaskId]: '' }));
  };

  const toggleSubtaskInputVisibility = (taskId) => {
    setShowSubtaskInput((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Function to move tasks up or down
  const moveTask = (taskId, direction) => {
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((task) => task.id === taskId);
      if (index === -1) return prevTasks;

      const newTasks = [...prevTasks];
      if (direction === 'up' && index > 0) {
        // Swap with the previous task
        [newTasks[index], newTasks[index - 1]] = [
          newTasks[index - 1],
          newTasks[index],
        ];
      } else if (direction === 'down' && index < newTasks.length - 1) {
        // Swap with the next task
        [newTasks[index], newTasks[index + 1]] = [
          newTasks[index + 1],
          newTasks[index],
        ];
      }
      return newTasks;
    });
  };

  const moveSubtask = (taskId, subtaskId, direction) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const newTasks = [...prevTasks];
      const subtaskIndex = newTasks[taskIndex].subtasks.findIndex(
        (subtask) => subtask.id === subtaskId,
      );
      if (subtaskIndex === -1) return prevTasks;

      if (direction === 'up' && subtaskIndex > 0) {
        // Swap with the previous subtask
        [
          newTasks[taskIndex].subtasks[subtaskIndex],
          newTasks[taskIndex].subtasks[subtaskIndex - 1],
        ] = [
          newTasks[taskIndex].subtasks[subtaskIndex - 1],
          newTasks[taskIndex].subtasks[subtaskIndex],
        ];
      } else if (
        direction === 'down' &&
        subtaskIndex < newTasks[taskIndex].subtasks.length - 1
      ) {
        // Swap with the next subtask
        [
          newTasks[taskIndex].subtasks[subtaskIndex],
          newTasks[taskIndex].subtasks[subtaskIndex + 1],
        ] = [
          newTasks[taskIndex].subtasks[subtaskIndex + 1],
          newTasks[taskIndex].subtasks[subtaskIndex],
        ];
      }

      return newTasks;
    });
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
        {tasks.map((task) => (
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
                  className={styles.moveButton}
                  onClick={() => moveTask(task.id, 'up')}
                  disabled={tasks.indexOf(task) === 0}
                >
                  ↑
                </button>
                <button
                  className={styles.moveButton}
                  onClick={() => moveTask(task.id, 'down')}
                  disabled={tasks.indexOf(task) === tasks.length - 1}
                >
                  ↓
                </button>
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
              </div>
            </div>

            {showSubtaskInput[task.id] && (
              <div className={styles.subtaskContainer}>
                <input
                  className={styles.subtaskInput}
                  value={newSubtaskValues[task.id] || ''}
                  onChange={(e) =>
                    handleSubtaskInputChange(task.id, e.target.value)
                  }
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
                    {editingSubtaskId.subtaskId === subtask.id &&
                    editingSubtaskId.taskId === task.id ? (
                      <input
                        value={editedSubtaskName[subtask.id] || ''}
                        onChange={(e) =>
                          setEditedSubtaskName((prev) => ({
                            ...prev,
                            [subtask.id]: e.target.value,
                          }))
                        }
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
                        className={`${styles.subtaskName} ${
                          subtask.completed ? styles.completed : ''
                        }`}
                      >
                        {subtask.name}
                      </button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => moveSubtask(task.id, subtask.id, 'up')}
                        className={styles.moveButton}
                        disabled={task.subtasks.indexOf(subtask) === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveSubtask(task.id, subtask.id, 'down')}
                        className={styles.moveButton}
                        disabled={
                          task.subtasks.indexOf(subtask) ===
                          task.subtasks.length - 1
                        }
                      >
                        ↓
                      </button>
                    </div>
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
