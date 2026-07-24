import { FaChartBar, FaUsers,FaSignOutAlt } from "react-icons/fa";
  

export default function Sidebar({ setView }) {
const handleLogout = () => {
    // clear stored login data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // redirect to login page
    window.location.href = "/";
  };
  return (
    <div className="sidebar">
      <h2>HOD Panel</h2>

      <button onClick={()=>setView("dashboard")}>
        <FaChartBar /> Dashboard
      </button>

      <button onClick={()=>setView("reports")}>
        <FaUsers /> Reports
      </button>

<button onClick={() => setView("assignTutor")}>
  Assign Tutor
</button>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
      
    </div>
  );
}