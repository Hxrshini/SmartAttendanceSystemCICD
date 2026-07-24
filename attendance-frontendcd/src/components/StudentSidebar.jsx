import { Link } from "react-router-dom";

export default function StudentSidebar(){

return(

<div className="sidebar">

<h2>Student Panel</h2>
<Link to="/student">Dashboard</Link>
<Link to="/student/history">Attendance History</Link>
<Link to="/student/percentage">Attendance Percentage</Link>
<Link to="/student/profile">Profile</Link>
<Link to="/">Logout</Link>
</div>

);

}