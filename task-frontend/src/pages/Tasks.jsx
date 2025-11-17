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

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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

      {/* Create Task (Admin only) */}
      {role === "admin" && (
  <div className="task-admin-buttons">
    <Link to="/tasks/create" className="task-btn">+ Create Task</Link>
    <Link to="/users/create" className="task-btn user-btn">+ Create User</Link>
    <Link to="/employees" className="task-btn emp-btn">👥 Employee List</Link>
  </div>
)}

      {/* IF NO TASKS */}
      {tasks.length === 0 ? (
        <p className="no-tasks-msg">No tasks found 🙂</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-card">
              <Link to={`/tasks/${task.id}`} className="task-link">
                <span className="task-name">{task.title}</span>
                <span className="task-status">{task.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
