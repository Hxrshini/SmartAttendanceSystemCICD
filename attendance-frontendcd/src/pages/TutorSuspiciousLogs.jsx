import { useEffect, useState } from "react";
import API from "../api";

export default function TutorSuspiciousLogs(){

const [logs,setLogs] = useState([]);

useEffect(()=>{

loadLogs();

},[]);


const loadLogs = async ()=>{

try{

const res = await API.get("/api/tutor/suspicious-logs");

setLogs(res.data);

}catch(err){

console.log(err);

}

};


return(

<div className="card">

<h2>Suspicious Activity Logs</h2>

<table>

<thead>

<tr>

<th>Roll No</th>
<th>Issue</th>
<th>Device</th>
<th>IP Address</th>
<th>Time</th>

</tr>

</thead>

<tbody>

{logs.map((l,i)=>(

<tr key={i}>

<td>{l.rollNo}</td>
<td style={{color:"red",fontWeight:"bold"}}>{l.issue}</td>
<td>{l.device}</td>
<td>{l.ipAddress}</td>
<td>{new Date(l.time).toLocaleString()}</td>

</tr>

))}

</tbody>

</table>

</div>

);

}