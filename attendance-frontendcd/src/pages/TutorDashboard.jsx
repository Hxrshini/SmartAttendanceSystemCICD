import { Link } from "react-router-dom";
import "../styles/tutordashboard.css";
export default function TutorDashboard(){

return(

<>

<h1 style={{color:"white"}}>Tutor Panel</h1>

<div className="menu">

<Link to="/tutor/pending" className="card">
<h3>Pending Requests</h3>
<p>Approve student profile requests</p>
</Link>

<Link to="/tutor/device-history" className="card">
<h3>Device History</h3>
<p>View student login devices</p>
</Link>

<Link to="/tutor/suspicious" className="card">
<h3>Suspicious Logs</h3>
<p>Detect abnormal activity</p>
</Link>

<Link to="/tutor/class-report" className="card">
<h3>Class Report</h3>
<p>View attendance analytics</p>
</Link>

<Link to="/tutor/download-report" className="card">
<h3>Download Report</h3>
<p>Export attendance report</p>
</Link>

</div>

</>

);

}