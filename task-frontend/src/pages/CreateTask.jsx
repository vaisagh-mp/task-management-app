import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./createTask.css";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const navigate = useNavigate();

  const createTask = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    await api.post("tasks/", { title, priority });
    navigate("/tasks");
  };

  return (
    <div className="create-task-container">

      {/* Back Button */}
      <Link to="/tasks" className="back-btn">← Back</Link>

      <div className="create-task-card">
        <h2 className="create-task-title">Create New Task</h2>

        <input
          className="task-input"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="task-label">Priority:</label>
        <select
          className="task-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="create-btn" onClick={createTask}>
          Create Task
        </button>
      </div>
    </div>
  );
}
