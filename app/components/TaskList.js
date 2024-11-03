'use client';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
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

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'TASK') {
      const reorderedTasks = Array.from(tasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);
      setTasks(reorderedTasks);
    } else if (type === 'SUBTASK') {
      const taskIndex = tasks.findIndex(
        (task) => task.id === source.droppableId,
      );
      const task = tasks[taskIndex];

      const reorderedSubtasks = Array.from(task.subtasks);
      const [removed] = reorderedSubtasks.splice(source.index, 1);
      reorderedSubtasks.splice(destination.index, 0, removed);

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, subtasks: reorderedSubtasks };
      setTasks(updatedTasks);
    }
  };

  const toggleSubtaskInputVisibility = (taskId) => {
    setShowSubtaskInput((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="tasks"
          type="TASK"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
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
                      className={styles.taskItem}
                    >
                      <div className={styles.taskRow}>
                        <span
                          {...providedDraggable.dragHandleProps}
                          className={styles.dragHandle}
                        >
                          ⋮⋮
                        </span>
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
                            onClick={() =>
                              toggleSubtaskInputVisibility(task.id)
                            }
                          >
                            +
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => deleteTask(task.id)}
                          >
                            ✕
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
                      <Droppable
                        droppableId={task.id}
                        type="SUBTASK"
                        isDropDisabled={false}
                        isCombineEnabled={false}
                        ignoreContainerClipping={false}
                      >
                        {(providedDroppableSubtask) => (
                          <ul
                            {...providedDroppableSubtask.droppableProps}
                            ref={providedDroppableSubtask.innerRef}
                            className={styles.subtaskList}
                          >
                            {task.subtasks.map((subtask, i) => (
                              <Draggable
                                key={`subtask-${subtask.id}`}
                                draggableId={subtask.id}
                                index={i}
                              >
                                {(providedDraggableSubtask) => (
                                  <li
                                    ref={providedDraggableSubtask.innerRef}
                                    {...providedDraggableSubtask.draggableProps}
                                    className={styles.subtaskItem}
                                  >
                                    <div className={styles.subtaskRow}>
                                      <span
                                        {...providedDraggableSubtask.dragHandleProps}
                                        className={styles.dragHandle}
                                      >
                                        ⋮⋮
                                      </span>
                                      <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() =>
                                          toggleSubtaskCompletion(
                                            task.id,
                                            subtask.id,
                                          )
                                        }
                                        className={styles.checkbox}
                                      />
                                      {editingSubtaskId?.subtaskId ===
                                        subtask.id &&
                                      editingSubtaskId.taskId === task.id ? (
                                        <input
                                          value={
                                            editedSubtaskName[subtask.id] || ''
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setEditedSubtaskName({
                                              ...editedSubtaskName,
                                              [subtask.id]: value,
                                            });

                                            // Delete the subtask if the input is empty
                                            if (value.trim() === '') {
                                              deleteSubtask(
                                                task.id,
                                                subtask.id,
                                              );
                                            }
                                          }}
                                          onBlur={() =>
                                            saveSubtask(task.id, subtask.id)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              saveSubtask(task.id, subtask.id);
                                            }
                                          }}
                                          className={styles.editInput}
                                        />
                                      ) : (
                                        <button
                                          onClick={() =>
                                            startEditingSubtask(
                                              task.id,
                                              subtask,
                                            )
                                          }
                                          className={`${styles.subtaskName} ${
                                            subtask.completed
                                              ? styles.completed
                                              : ''
                                          }`}
                                        >
                                          {subtask.name}
                                        </button>
                                      )}
                                    </div>
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
  );
};

export default TaskList;
