import { useState } from "react";
import API from "../api";
import "../styles/login.css";
export default function Login() {

  const [form, setForm] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const login = async () => {
  try {
    const res = await API.post("/api/auth/login", form);

    console.log("Login Response:", res.data);

    // 🔥 remove [ and ]
    const role = res.data.role.replace("[", "").replace("]", "");

    console.log("Clean Role:", role);

    if (role === "ROLE_HOD") window.location="/hod";
    if (role === "ROLE_FACULTY") window.location="/faculty";
    if (role === "ROLE_STUDENT") window.location="/student";

  } catch (err) {
    alert("Invalid credentials");
  }
};

  return (
    <div className="card">
      <h2>Login</h2>

      <input 
        name="email" 
        placeholder="Email" 
        onChange={handleChange}
      />

      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        onChange={handleChange}
      />

      <button onClick={login}>Login</button>

      <div 
        className="switch-link" 
        onClick={()=>window.location="/register"}
      >
        Don't have account? Register
      </div>
    </div>
  );
}