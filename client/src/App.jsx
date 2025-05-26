import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [taskInput, setTaskInput] = useState(
    localStorage.getItem("currentTaskToAdd") || ""
  );
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("currentTaskToAdd", taskInput);
  }, [taskInput]);

  function addTask() {
    if (taskInput.trim() === "") return;
    setTasks([
      ...tasks,
      {
        name: taskInput,
        completed: false,
      },
    ]);
    setTaskInput("");
    localStorage.removeItem("currentTaskToAdd");
  }

  function handleInputChange(e) {
    setTaskInput(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  const removeTask = (i) => () => {
    if (tasks[i]) {
      setTasks(tasks.filter((_, index) => index !== i));
    }
  };

  const changeTaskCom = (i) => () => {
    if (tasks[i]) {
      setTasks(
        tasks.map((t, index) => {
          if (index === i) {
            return {
              ...t,
              completed: !t.completed,
            };
          } else {
            return t;
          }
        })
      );
    }
  };

  const editTask = (i) => () => {
    if (tasks[i]) {
      setTasks(
        tasks.map((t, index) => {
          if (index === i) {
            const newName = prompt("What is the new name of the task?", t.name);

            return {
              ...t,
              name: newName,
            };
          } else {
            return t;
          }
        })
      );
    }
  };

  return (
    <div>
      <main>
        <h1>Welcome to Listify</h1>
        <div className="addTask">
          <input
            type="text"
            placeholder="Task Name..."
            id="addTask"
            value={taskInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul>
          {tasks.map((task, idx) => (
            <li key={idx}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={changeTaskCom(idx)}
              />
              {task.name} <button onClick={editTask(idx)}>Edit</button>
              <button className="right" onClick={removeTask(idx)}>
                X
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
