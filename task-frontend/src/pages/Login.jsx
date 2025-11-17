import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import styles

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);

      // Save JWT tokens
      localStorage.setItem("token", response.access);
      localStorage.setItem("refresh", response.refresh);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user_id", response.id);
      localStorage.setItem("username", response.username);

      navigate("/tasks");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2 className="login-title">Task Management Login</h2>

        <input
          className="login-input"
          placeholder="Enter Username"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          onChange={(e) => setPass(e.target.value)}
        />

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
