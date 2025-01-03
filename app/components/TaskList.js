'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from '../contexts/SessionContext';
import styles from '../styles/TaskList.module.scss';
import AddIcon from './AddIcon';
import DeleteIcon from './DeleteIcon';
import DownIcon from './DownIcon';
import UpIcon from './UpIcon';

const TaskList = ({ tasks: initialTasks, taskWithSubtask }) => {
  console.log('initialTasks', initialTasks);

  const [taskWithSubtasks, setTaskWithSubtasks] = useState(
    taskWithSubtask || [],
  );
  console.log('setTaskWithSubtasks', setTaskWithSubtasks);

  const [tasks, setTasks] = useState(taskWithSubtasks || []);
  const sessionToken = useSession();
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

  useEffect(() => {
    if (!sessionToken) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };

    fetchTasks().catch((error) => {
      console.error('Error in fetchTasks:', error.message);
      toast.error('Failed to load tasks.');
    });
  }, [sessionToken]);

  // ---ADD TASKS TO DB--- //
  const addTask = async () => {
    if (!sessionToken) {
      toast.error('Please sign in to add tasks');
      return;
    }

    if (newTaskName.trim() === '') {
      toast.error('Task name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ text_content: newTaskName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();

      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: data.task.id,
          textContent: data.task.textContent,
          checked: false,
          subtasks: [],
        },
      ]);
      setNewTaskName('');
    } catch (error) {
      console.error(error.message);
      toast.error('Error adding task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete task from the database');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedCheckedStatus = !task.checked;

    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, checked: updatedCheckedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task completion status');
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, checked: updatedCheckedStatus } : t,
        ),
      );
    } catch (error) {
      console.error('Error updating task:', error.message);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.textContent);
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

  const addSubtask = async (taskId) => {
    const subtaskValue = newSubtaskValues[taskId]?.trim();
    if (!subtaskValue) return; // Exit if the subtask is empty

    if (!sessionToken) {
      toast.error('Please sign in to add subtasks');
      return;
    }

    try {
      const response = await fetch('/api/subtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          taskId,
          text_content: subtaskValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subtask');
      }

      const data = await response.json();
      console.log('data', data);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: Array.isArray(task.subtasks)
                  ? [...task.subtasks, data.subtask]
                  : [data.subtask],
              }
            : task,
        ),
      );

      // Clear input and hide subtask input field
      setNewSubtaskValues((prev) => ({ ...prev, [taskId]: '' }));
      setShowSubtaskInput((prev) => ({ ...prev, [taskId]: false }));
    } catch (error) {
      console.error('Error adding subtask:', error.message);
      toast.error('Error adding subtask. Please try again.');
    }
  };

  const toggleSubtaskCompletion = async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const subtask = task.subtasks.find((s) => s.id === subtaskId);
    if (!subtask) return;

    const updatedCompletedStatus = !subtask.checked;

    try {
      const response = await fetch('/api/subtasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ subtaskId, checked: updatedCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subtask completion status');
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === subtaskId
                    ? { ...s, checked: updatedCompletedStatus }
                    : s,
                ),
              }
            : t,
        ),
      );
    } catch (error) {
      console.error('Error updating subtask:', error.message);
      toast.error('Failed to update subtask status. Please try again.');
    }
  };

  // --- DELETE SUBTASK FROM DB --- //
  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const response = await fetch('/api/subtasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, subtaskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete subtask from the database');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
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
    } catch (error) {
      console.error('Error deleting subtask:', error.message);
      toast.error('Failed to delete subtask. Please try again.');
    }
  };

  const startEditingSubtask = (taskId, subtask) => {
    setEditingSubtaskId({ taskId, subtaskId: subtask.id });
    setEditedSubtaskName((prev) => ({
      ...prev,
      [subtask.id]: subtask.textContent,
    }));
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

      const task = { ...prevTasks[taskIndex] };
      const subtaskIndex = task.subtasks.findIndex(
        (subtask) => subtask.id === subtaskId,
      );
      if (subtaskIndex === -1) return prevTasks;

      // Determine the new index for the subtask
      const newIndex = direction === 'up' ? subtaskIndex - 1 : subtaskIndex + 1;

      // Check if the new index is within bounds
      if (newIndex < 0 || newIndex >= task.subtasks.length) return prevTasks;

      // Remove the subtask from the current position
      const updatedSubtasks = [...task.subtasks];
      const [movedSubtask] = updatedSubtasks.splice(subtaskIndex, 1);

      // Insert the subtask into the new position
      updatedSubtasks.splice(newIndex, 0, movedSubtask);

      // Update the task with the reordered subtasks array
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = {
        ...task,
        subtasks: updatedSubtasks,
      };

      return updatedTasks;
    });
  };

  useEffect(() => {
    if (!sessionToken) {
      setTasks([]);
    }
  }, [sessionToken]);

  return (
    <div className={styles.taskContainer}>
      <h2 className={styles.title}>Tasks</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={newTaskName}
          onChange={(e) => {
            if (e.target.value.length <= 25) {
              setNewTaskName(e.target.value);
            }
          }}
          placeholder="Add new task"
        />
        <button className={styles.addTaskButton} onClick={addTask}>
          Add Task
        </button>
      </div>

      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={`task-${task.id}`} className={styles.taskItem}>
            <div className={styles.taskRow}>
              {/* Render task details */}
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id={`checkbox-${task.id}`}
                  checked={task.checked}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className={styles.checkbox}
                />
                <label
                  htmlFor={`checkbox-${task.id}`}
                  className={styles.checkboxLabel}
                >
                  <span className={styles.srOnly}>
                    Mark task as {task.checked ? 'incomplete' : 'complete'}
                  </span>
                </label>
              </div>
              {editingTaskId === task.id ? (
                <input
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  onBlur={() => saveTask(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTask(task.id);
                  }}
                  className={styles.editInput}
                />
              ) : (
                <button
                  onClick={() => startEditing(task)}
                  className={`${styles.taskName} ${
                    task.checked ? styles.checked : ''
                  }`}
                >
                  {task.textContent}
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className={styles.moveButton}
                  onClick={() => moveTask(task.id, 'up')}
                  disabled={tasks.indexOf(task) === 0}
                >
                  <UpIcon />
                </button>
                <button
                  className={styles.moveButton}
                  onClick={() => moveTask(task.id, 'down')}
                  disabled={tasks.indexOf(task) === tasks.length - 1}
                >
                  <DownIcon />
                </button>
                <button
                  className={styles.addSubtaskButton}
                  onClick={() => toggleSubtaskInputVisibility(task.id)}
                >
                  <AddIcon />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            {showSubtaskInput[task.id] && (
              <div className={styles.subtaskContainer}>
                <input
                  placeholder="Add a new subtask"
                  className={styles.subtaskInput}
                  value={newSubtaskValues[task.id] || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 25) {
                      handleSubtaskInputChange(task.id, e.target.value);
                    }
                  }}
                />
                <button
                  className={styles.addSubtaskInputButton}
                  onClick={() => addSubtask(task.id)}
                >
                  Add Subtask
                </button>
              </div>
            )}

            <ul className={styles.subtaskList}>
              {task.subtasks?.map((subtask) => (
                <li
                  key={`subtask-${subtask.id}`}
                  className={styles.subtaskItem}
                >
                  <div className={styles.subtaskRow}>
                    {/* Subtask Checkbox */}
                    <div className={styles.subtaskCheckboxContainer}>
                      <input
                        type="checkbox"
                        id={`subtask-checkbox-${subtask.id}`}
                        checked={subtask.checked}
                        onChange={() =>
                          toggleSubtaskCompletion(task.id, subtask.id)
                        }
                        className={styles.subtaskCheckbox}
                      />
                      <label
                        htmlFor={`subtask-checkbox-${subtask.id}`}
                        className={styles.subtaskCheckboxLabel}
                      >
                        <span className={styles.srOnly}>
                          Mark task as{' '}
                          {subtask.checked ? 'incomplete' : 'complete'}
                        </span>
                      </label>
                    </div>

                    {/* Editable or Static Subtask Name */}
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
                        onKeyDown={(e) => {
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
                          subtask.checked ? styles.checked : ''
                        }`}
                      >
                        {subtask.textContent}
                      </button>
                    )}

                    {/* Move Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => moveSubtask(task.id, subtask.id, 'up')}
                        className={styles.subtaskMoveButton}
                        disabled={task.subtasks.indexOf(subtask) === 0}
                      >
                        <UpIcon />
                      </button>
                      <button
                        onClick={() => moveSubtask(task.id, subtask.id, 'down')}
                        className={styles.subtaskMoveButton}
                        disabled={
                          task.subtasks.indexOf(subtask) ===
                          task.subtasks.length - 1
                        }
                      >
                        <DownIcon />
                      </button>
                      <button
                        onClick={() => deleteSubtask(task.id, subtask.id)}
                        className={`${styles.deleteButton} ${styles.deleteButtonSmall}`}
                      >
                        <DeleteIcon />
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
