import { Link, useLocation } from "react-router-dom";
import {
FaUserTie,
FaUserClock,
FaLaptop,
FaExclamationTriangle,
FaChartBar,
FaDownload,
FaArrowLeft,
FaSignOutAlt
} from "react-icons/fa";
import "../styles/tutorsidebar.css";
export default function TutorSidebar(){

const location = useLocation();

const isDashboard = location.pathname === "/tutor";

return(

<div className="sidebar">

<h2>Tutor Panel</h2>

{!isDashboard && (
<>
<Link to="/tutor">
<FaUserTie/> Tutor Dashboard
</Link>

<Link to="/tutor/pending">
<FaUserClock/> Pending Requests
</Link>

<Link to="/tutor/device-history">
<FaLaptop/> Device History
</Link>

<Link to="/tutor/suspicious">
<FaExclamationTriangle/> Suspicious Logs
</Link>

<Link to="/tutor/class-report">
<FaChartBar/> Class Report
</Link>

<Link to="/tutor/download-report">
<FaDownload/> Download Report
</Link>
</>
)}

<Link to="/faculty">
<FaArrowLeft/> Faculty Panel
</Link>

<Link to="/">
<FaSignOutAlt/> Logout
</Link>

</div>

);

}