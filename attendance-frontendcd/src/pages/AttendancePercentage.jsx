import { useEffect,useState } from "react";
import api from "../api";
// StudentDashboard.jsx

export default function AttendancePercentage(){

const [percentage,setPercentage] = useState(0);

useEffect(()=>{

api.get("/api/student/percentage")
.then(res=>{
setPercentage(res.data);
});

},[]);

return(

<div className="dashboard-card">

<h2>Attendance Percentage</h2>

<h1>{percentage}%</h1>

</div>

);

}