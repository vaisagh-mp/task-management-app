import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./taskEdit.css";

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);

  const role = localStorage.getItem("role");

  // Load current task
  const loadTask = async () => {
    const res = await api.get(`tasks/${id}/`);
    setTask(res.data);
  };

  // Load employees (only admin)
  const loadEmployees = async () => {
    if (role === "admin") {
      const res = await api.get("users/employees/");
      setEmployees(res.data);
    }
  };

  useEffect(() => {
    loadTask();
    loadEmployees();
  }, []);

  const handleUpdate = async () => {
    await api.put(`tasks/${id}/`, task);

    alert("Task updated successfully!");
    navigate("/tasks");
  };

  if (!task) return <p className="loading-text">Loading...</p>;

  return (
    <div className="edit-task-container">

      {/* Back Button */}
      <Link to="/tasks" className="edit-back-btn">← Back</Link>

      <div className="edit-task-card">
        <h2 className="edit-task-title">Edit Task</h2>

        {/* Title */}
        <label className="edit-label">Title</label>
        <input
          className="edit-input"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />

        {/* Description */}
        <label className="edit-label">Description</label>
        <textarea
          className="edit-textarea"
          value={task.description || ""}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />

        {/* Priority */}
        <label className="edit-label">Priority</label>
        <select
          className="edit-input"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Due Date */}
        <label className="edit-label">Due Date</label>
        <input
          type="date"
          className="edit-input"
          value={task.due_date || ""}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
        />

        {/* Status (admin + employee) */}
        <label className="edit-label">Status</label>
        <select
          className="edit-input"
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Assign To (admin only) */}
        {role === "admin" && (
          <>
            <label className="edit-label">Assign To</label>
            <select
              className="edit-input"
              value={task.assignee || ""}
              onChange={(e) =>
                setTask({ ...task, assignee: Number(e.target.value) })
              }
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.username}
                </option>
              ))}
            </select>
          </>
        )}

        <button className="edit-save-btn" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
