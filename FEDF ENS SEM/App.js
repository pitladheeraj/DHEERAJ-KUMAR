import React, { useState } from "react";
import initialTasks from "./tasks.json";

function App() {
  // State for tasks (data from JSON file)
  const [tasks, setTasks] = useState(initialTasks);

  // Controlled form state for creating a new task
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // State for editing (Update)
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Helper to generate next ID
  const getNextId = () => {
    if (tasks.length === 0) return 1;
    const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), tasks[0].id);
    return maxId + 1;
  };

  // CREATE: add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const newTask = {
      id: getNextId(),
      title: trimmed,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  // READ is simply rendering the list (see JSX below)

  // UPDATE: toggle completion
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // UPDATE: begin editing a task title
  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  // UPDATE: save edited title
  const handleSaveEdit = (id) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: trimmed } : task
      )
    );
    setEditingId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // DELETE: remove a task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const hasTasks = tasks.length > 0;

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Todo App</h1>

      {/* Controlled form to add new tasks */}
      <form
        onSubmit={handleAddTask}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      {/* Conditional rendering: show message when no tasks */}
      {!hasTasks && (
        <p style={{ textAlign: "center", color: "#777" }}>
          No tasks yet. Add your first one!
        </p>
      )}

      {/* READ: render task list */}
      {hasTasks && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id} // important key
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
              />

              {/* If currently editing this task, show input; otherwise plain text */}
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.3rem 0.5rem",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#888" : "inherit",
                    }}
                  >
                    {task.title}
                  </span>
                  <button onClick={() => handleStartEdit(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
