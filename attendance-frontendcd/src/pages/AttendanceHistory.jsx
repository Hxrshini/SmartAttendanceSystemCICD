import { useEffect,useState } from "react";
import api from "../api";
import "../styles/attendancehistory.css";
// StudentDashboard.jsx

export default function AttendanceHistory(){

const [history,setHistory] = useState([]);

useEffect(()=>{

api.get("/api/student/history")
.then(res=>{
setHistory(res.data);
});

},[]);

return(

<div className="dashboard-card">

<h2>Attendance History</h2>

<table>

<thead>
<tr>
<th>Roll No</th>
<th>Subject</th>
<th>Status</th>
<th>Date</th>
</tr>
</thead>

<tbody>

{history.map((h,index)=>(

<tr key={index}>
<td>{h.rollNo}</td>
<td>{h.subject}</td>
<td>{h.present ? "Present":"Absent"}</td>
<td>{h.markedAt}</td>
</tr>

))}

</tbody>

</table>

</div>

);

}