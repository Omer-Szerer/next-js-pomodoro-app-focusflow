'use client';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styles from '../styles/TaskList.module.scss';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [newSubtasks, setNewSubtasks] = useState({});

  const addTask = () => {
    if (newTask.trim() === '') return;
    const task = {
      id: Date.now().toString(),
      name: newTask,
      completed: false,
      subtasks: [],
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const addSubtask = (taskId) => {
    const subtaskName = newSubtasks[taskId] || '';
    if (subtaskName.trim() === '') return;

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                { id: Date.now().toString(), name: subtaskName },
              ],
            }
          : task,
      ),
    );

    setNewSubtasks({ ...newSubtasks, [taskId]: '' });
  };

  const handleSubtaskInputChange = (taskId, value) => {
    setNewSubtasks({ ...newSubtasks, [taskId]: value });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
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

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
  };

  const saveTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, name: editedTaskName } : task,
      ),
    );
    setEditingTaskId(null);
    setEditedTaskName('');
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'TASK') {
      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks(reorderedTasks);
    } else if (type === 'SUBTASK') {
      const taskIndex = tasks.findIndex(
        (task) => task.id === source.droppableId,
      );
      const task = tasks[taskIndex];
      const reorderedSubtasks = Array.from(task.subtasks);
      const [movedSubtask] = reorderedSubtasks.splice(source.index, 1);
      reorderedSubtasks.splice(destination.index, 0, movedSubtask);

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, subtasks: reorderedSubtasks };
      setTasks(updatedTasks);
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <div>
        <input
          className={styles.input}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className={styles.button} onClick={addTask}>
          Add Task
        </button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks" type="TASK">
            {(providedDroppable) => (
              <ul
                {...providedDroppable.droppableProps}
                ref={providedDroppable.innerRef}
                className={styles.taskList}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={`task-${task.id}`}
                    draggableId={task.id}
                    index={index}
                  >
                    {(providedDraggable) => (
                      <li
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        className={styles.taskItem}
                      >
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
                          <span
                            role="button"
                            tabIndex="0"
                            onClick={() => startEditing(task)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                startEditing(task);
                              }
                            }}
                            className={`${styles.taskName} ${task.completed ? styles.completed : ''}`}
                          >
                            {task.name}
                          </span>
                        )}

                        <button
                          className={styles.button}
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>

                        <div>
                          <input
                            className={styles.input}
                            value={newSubtasks[task.id] || ''}
                            onChange={(e) =>
                              handleSubtaskInputChange(task.id, e.target.value)
                            }
                            placeholder="Add a subtask"
                          />
                          <button
                            className={styles.button}
                            onClick={() => addSubtask(task.id)}
                          >
                            Add Subtask
                          </button>
                        </div>

                        <Droppable droppableId={task.id} type="SUBTASK">
                          {(providedDroppableSubtask) => (
                            <ul
                              {...providedDroppableSubtask.droppableProps}
                              ref={providedDroppableSubtask.innerRef}
                              className={styles.subtaskList}
                            >
                              {task.subtasks.map((subtask, subIndex) => (
                                <Draggable
                                  key={`subtask-${subtask.id}`}
                                  draggableId={subtask.id}
                                  index={subIndex}
                                >
                                  {(providedDraggableSubtask) => (
                                    <li
                                      ref={providedDraggableSubtask.innerRef}
                                      {...providedDraggableSubtask.draggableProps}
                                      {...providedDraggableSubtask.dragHandleProps}
                                      className={styles.subtaskItem}
                                    >
                                      {subtask.name}
                                      <button
                                        className={styles.button}
                                        onClick={() =>
                                          deleteSubtask(task.id, subtask.id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  )}
                                </Draggable>
                              ))}
                              {providedDroppableSubtask.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </li>
                    )}
                  </Draggable>
                ))}
                {providedDroppable.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskList;
