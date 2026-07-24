import { Link } from "react-router-dom";
import { FaHome, FaPlay, FaStop, FaUserCheck, FaChartBar, FaUserTie } from "react-icons/fa";

export default function FacultySidebar(){

return(

<div className="sidebar">

<h2>Faculty Panel</h2>

<Link to="/faculty"><FaHome/> Dashboard</Link>

<Link to="/faculty/start"><FaPlay/> Start Session</Link>

<Link to="/faculty/close"><FaStop/> Close Session</Link>

<Link to="/faculty/manual"><FaUserCheck/> Manual Attendance</Link>

<Link to="/faculty/report"><FaChartBar/> Session Report</Link>

<Link to="/tutor"><FaUserTie/> Tutor Panel</Link>
<Link to="/">Logout</Link>
</div>

)

}