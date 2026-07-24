import { useEffect, useState } from "react";
import API from "../api";

export default function TutorClassReport(){

const [report,setReport] = useState([]);

useEffect(()=>{
loadReport();
},[]);

const loadReport = async ()=>{

try{

const res = await API.get("/api/tutor/class-report");

setReport(res.data);

}catch(err){
console.log(err);
}

};

return(

<div className="card">

<h2>Class Attendance Report</h2>

<table>

<thead>

<tr>

<th>Roll No</th>
<th>Name</th>
<th>Subject</th>
<th>Status</th>
<th>Date</th>

</tr>

</thead>

<tbody>

{report.map((r,i)=>(

<tr key={i}>

<td>{r.rollNo}</td>
<td>{r.name}</td>
<td>{r.subject}</td>

<td style={{color:r.present?"green":"red"}}>

{r.present?"Present":"Absent"}

</td>

<td>{new Date(r.markedAt).toLocaleDateString()}</td>

</tr>

))}

</tbody>

</table>

</div>

);

}