import { useState } from "react";
import API from "../api";
import "../styles/register.css";

export default function Register() {

  const [role, setRole] = useState("");
  const [form, setForm] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {

    let url = "";

if (role === "HOD") url = "/api/auth/register-hod";
if (role === "FACULTY") url = "/api/auth/register-faculty";
if (role === "STUDENT") url = "/api/auth/register-student";

    try {
      await API.post(url, form);
      alert("Registration Successful!");
    } catch (err) {
      alert("Registration Failed!");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>

      <div className="role-tabs">
        {["HOD","FACULTY","STUDENT"].map(r => (
          <button
            key={r}
            className={role===r ? "active" : ""}
            onClick={()=>setRole(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <input name="name" placeholder="Name" onChange={handleChange}/>
      <input name="email" type="email" placeholder="Email" onChange={handleChange}/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange}/>

      {role === "FACULTY" && (
  <div className="faculty-fields">
    <input name="department" placeholder="Department" onChange={handleChange}/>
    <input name="secretCode" placeholder="Secret Code" onChange={handleChange}/>
  </div>
)}
      {role === "HOD" && (
  <div className="hod-fields">
    <input name="secretCode" placeholder="Secret Code" onChange={handleChange}/>
  </div>
)}
      {role === "STUDENT" && (
  <div className="student-fields">
    <input name="rollNo" placeholder="Roll No" onChange={handleChange}/>
    <input name="classEmail" placeholder="Class Email" onChange={handleChange}/>
  </div>
)}

      <button className="register-btn" onClick={register}>
  Register
</button>

      <div className="switch-link" onClick={()=>window.location="/"}>
        Already have account? Login
      </div>
    </div>
  );
}