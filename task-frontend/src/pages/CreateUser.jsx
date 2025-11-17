import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./createUser.css";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const createUser = async () => {
    try {
      await api.post("users/register/", {
        username,
        email,
        role,
        password,
      });

      alert("User created successfully!");
      navigate("/tasks");
    } catch (error) {
      alert("Error creating user");
    }
  };

  return (
    <div className="create-user-container">

      {/* BACK BUTTON */}
      <Link className="cu-back-btn" to="/tasks">
        ← Back to Tasks
      </Link>

      <div className="create-user-box">
        <h2>Create User</h2>

        <input
          className="cu-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="cu-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="cu-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <input
          className="cu-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="cu-btn" onClick={createUser}>
          Create User
        </button>
      </div>
    </div>
  );
}
