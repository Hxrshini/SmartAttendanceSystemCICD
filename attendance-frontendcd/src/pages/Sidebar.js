import React from "react";
import "./sidebar.css";

export default function Sidebar({role,setPage}){

return(

<div className="sidebar">

<h2>Faculty Panel</h2>

<button onClick={()=>setPage("dashboard")}>Dashboard</button>

<button onClick={()=>setPage("start")}>Start Session</button>

<button onClick={()=>setPage("manual")}>Manual Edit</button>

<button onClick={()=>setPage("report")}>Session Report</button>

<button onClick={()=>setPage("download")}>Download Report</button>

{role==="TUTOR" && (

<>
<button onClick={()=>setPage("pending")}>Pending Requests</button>

<button onClick={()=>setPage("approve")}>Approve Profile</button>

<button onClick={()=>setPage("device")}>Device History</button>

<button onClick={()=>setPage("logs")}>Suspicious Logs</button>
</>

)}

</div>

)

}