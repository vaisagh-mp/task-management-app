import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./taskDetail.css";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [employees, setEmployees] = useState([]);

  const role = localStorage.getItem("role");

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date set";
    return new Date(dateStr).toDateString();
  };

  // Load Task
  const loadTask = async () => {
    try {
      const res = await api.get(`tasks/${id}/`);
      setTask(res.data);
    } catch (error) {
      console.error("Error loading task", error);
    }
  };

  // Load Comments
  const loadComments = async () => {
    try {
      const res = await api.get(`tasks/${id}/comments/`);
      setComments(res.data);
    } catch (error) {
      console.error("Error loading comments", error);
    }
  };

  // Load employees (admin only)
  const loadEmployees = async () => {
    try {
      const res = await api.get("users/employees/");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error loading employees", error);
    }
  };

  useEffect(() => {
    loadTask();
    loadComments();

    if (role === "admin") {
      loadEmployees();
    }
  }, []);

  // Update status
  const updateStatus = async () => {
    await api.put(`tasks/${id}/`, { status: task.status });
    navigate("/tasks");
  };

  // Add new comment
  const addComment = async () => {
    if (!text.trim()) return;

    await api.post(`tasks/${id}/comments/`, { content: text });
    setText("");
    loadComments();
  };

  // Assign Task
  const assignTask = async () => {
    if (!task.assignee) {
      alert("Please select an employee!");
      return;
    }

    await api.post(`tasks/${id}/assign/`, {
      assignee: task.assignee,
    });

    alert("Task assigned!");
    navigate("/tasks");
  };

  if (!task) return <p className="loading-text">Loading...</p>;

  return (
    <div className="task-detail-container">

      <Link to="/tasks" className="back-btn">← Back to Tasks</Link>

      <div className="task-card-detail">
        <h2 className="task-title-detail">{task.title}</h2>

        {/* Priority */}
        <p className="task-priority">
          Priority:{" "}
          <strong style={{ textTransform: "capitalize" }}>
            {task.priority}
          </strong>
        </p>

        {/* Due Date */}
        <p className="task-due-date">
          Due Date: <strong>{formatDate(task.due_date)}</strong>
        </p>

        {/* Status Update */}
        {(role === "admin" || role === "employee") && (
          <div className="status-update-box">
            <label>Update Status:</label>

            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="status-dropdown"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <button className="update-status-btn" onClick={updateStatus}>
              Update
            </button>
          </div>
        )}

        {/* ASSIGN TASK (Admin Only) */}
        {role === "admin" && (
          <div className="assign-box">
            <label>Assign To:</label>

            <select
              className="assign-dropdown"
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

            <button
              className="assign-btn"
              disabled={!task.assignee}
              onClick={assignTask}
            >
              Assign Task
            </button>
          </div>
        )}

        {/* Admin: Show assigned-to */}
        {role === "admin" && task.assignee && (
          <p className="task-assignee">
            Assigned To:{" "}
            <strong>
              {employees.find((e) => e.id === task.assignee)?.username ||
                "Loading..."}
            </strong>
          </p>
        )}

        {/* Employee: Show assigned-by */}
        {role === "employee" && task.creator && (
          <p className="task-assignee">
            Assigned By: <strong>{task.creator.username}</strong>
          </p>
        )}

        {/* Description Section with Heading */}
        <h3 className="desc-heading">Description</h3>
        <p className="task-desc">
          {task.description || "No description added."}
        </p>
      </div>

      {/* Comments Section */}
      <h3 className="comments-heading">Comments</h3>

      <div className="comments-box">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-author">👤 {c.author.username}</div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="add-comment-section">
        <input
          className="comment-input"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="comment-btn" onClick={addComment}>
          Send
        </button>
      </div>

    </div>
  );
}
