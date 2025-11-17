import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "./tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const loadTasks = async () => {
    const res = await api.get("tasks/");

    if (role === "admin") {
      setTasks(res.data.results);
    } else {
      const myTasks = res.data.results.filter(
        (task) => task.assignee === Number(localStorage.getItem("user_id"))
      );
      setTasks(myTasks);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await api.delete(`tasks/${taskId}/`);
    alert("Task deleted successfully");
    loadTasks();
  };

  return (
    <div className="task-page">

      {/* TOP BAR */}
      <div className="task-topbar">
        <h2 className="task-title">Tasks</h2>

        <div className="task-right">
          {username && <span className="task-user">Hi, {username} 👋</span>}
          <button className="task-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Admin Buttons */}
      {role === "admin" && (
        <div className="task-admin-buttons">
          <Link to="/tasks/create" className="task-btn">+ Create Task</Link>
          <Link to="/users/create" className="task-btn user-btn">+ Create User</Link>
          <Link to="/employees" className="task-btn emp-btn">👥 Employee List</Link>
        </div>
      )}

      {/* No Tasks */}
      {tasks.length === 0 ? (
        <p className="no-tasks-msg">No tasks found 🙂</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-card">

              <Link to={`/tasks/${task.id}`} className="task-link">
                <div className="task-left">
                  <span className="task-name">{task.title}</span>

                  <div className="task-dates">
                    <small>📅 Created: {formatDate(task.created_at)}</small>
                    <small>⏳ Due: {formatDate(task.due_date)}</small>
                  </div>
                </div>

                <span className="task-status">{task.status}</span>
              </Link>

              {/* Admin: Edit & Delete */}
              {role === "admin" && (
                <div className="task-actions">
                  <Link to={`/tasks/${task.id}/edit`} className="edit-btn">
                    ✏️ Edit
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
