import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import CreateUser from "./pages/CreateUser";
import EmployeeList from "./pages/EmployeeList";
import TaskEdit from "./pages/TaskEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/users/create" element={<CreateUser />} />
         <Route path="/employees" element={<EmployeeList />} />
         <Route path="/tasks/:id/edit" element={<TaskEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
