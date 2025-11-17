import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "./employeeList.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = async () => {
    try {
      const res = await api.get("users/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="emp-container">

      {/* ⭐ Modern Back Button */}
      <Link to="/tasks" className="emp-back-btn">
        ← Back to Tasks
      </Link>

      <h2 className="emp-title">Employee List</h2>

      {employees.length === 0 ? (
        <p className="emp-empty">No employees found.</p>
      ) : (
        <ul className="emp-list">
          {employees.map((emp) => (
            <li key={emp.id} className="emp-card">
              <div className="emp-name">👤 {emp.username}</div>
              <div className="emp-email">{emp.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
