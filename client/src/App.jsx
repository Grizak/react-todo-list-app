import React, { useState, useEffect } from "react";
import "./App.css"; // Assuming you have a CSS file for global styles

function LoginModal({ show, onClose, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (form.email && form.password) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        setSuccess("Login successful!");
        setTimeout(() => {
          onLoginSuccess && onLoginSuccess(data.user.email, data.token);
          setForm({ email: "", password: "" });
          setSuccess("");
          onClose();
        }, 1000);
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl min-w-80 max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-center text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded text-center text-sm">
            {success}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function RegisterModal({ show, onClose, onRegisterSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess("Registration successful!");
      setTimeout(() => {
        onRegisterSuccess && onRegisterSuccess(data.user.email, data.token);
        setForm({ username: "", email: "", password: "" });
        setSuccess("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl min-w-80 max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username:
            </label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-center text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded text-center text-sm">
            {success}
          </div>
        )}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EditTaskModal({ show, task, onClose, onSave }) {
  const [taskName, setTaskName] = useState(task?.name || "");

  useEffect(() => {
    setTaskName(task?.name || "");
  }, [task]);

  const handleSave = () => {
    if (taskName.trim()) {
      onSave(taskName.trim());
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl min-w-80 max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Edit Task
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name:
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [userToken, setUserToken] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const storedUserToken = localStorage.getItem("token");
    if (storedUserToken) {
      fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: storedUserToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser({ email: data.user.email });
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("token", userToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [userToken]);

  function handleLoginSuccess(email, token) {
    setUser({ email });
    setUserToken(token);
  }

  function handleLogout() {
    setUser(null);
  }

  function addTask() {
    if (taskInput.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(), // Simple ID generation
        name: taskInput.trim(),
        completed: false,
      },
    ]);
    setTaskInput("");
  }

  function handleInputChange(e) {
    setTaskInput(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  const removeTask = (id) => () => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id) => () => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const openEditModal = (task) => () => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveEdit = (newName) => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? { ...task, name: newName } : task
      )
    );
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main
        className={`max-w-lg mx-auto pt-10 px-4 ${
          showLoginModal || showEditModal ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to Listify
            </h1>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Hello, {user.email}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </header>

          {/* Add Task Section */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Task Name..."
              value={taskInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
            >
              Add Task
            </button>
          </div>

          {/* Tasks List */}
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0 ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={toggleTaskCompletion(task.id)}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={openEditModal(task)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={removeTask(task.id)}
                      className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors duration-200 font-bold"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                No tasks yet. Add one above to get started!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterSuccess={handleLoginSuccess}
      />

      <EditTaskModal
        show={showEditModal}
        task={editingTask}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
