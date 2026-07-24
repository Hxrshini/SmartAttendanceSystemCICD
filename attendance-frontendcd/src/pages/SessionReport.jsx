import { useEffect, useState } from "react";
import API from "../api";

export default function SessionReport(){

const [students,setStudents] = useState([]);
const [present,setPresent] = useState(0);
const [absent,setAbsent] = useState(0);

useEffect(()=>{

const sessionNumber = localStorage.getItem("sessionNumber");

if(!sessionNumber) return;

loadReport(sessionNumber);

},[]);

const loadReport = async (sessionNumber)=>{

try{

const res = await API.get(`/api/faculty/session-report-number/${sessionNumber}`);

setStudents(res.data);

const presentCount = res.data.filter(s=>s.present).length;
const absentCount = res.data.filter(s=>!s.present).length;

setPresent(presentCount);
setAbsent(absentCount);

}catch(err){

console.log(err);

}

};
const downloadReport = async () => {

const sessionNumber = localStorage.getItem("sessionNumber");

try{

const res = await API.get(
`/api/faculty/session-report-number/${sessionNumber}/download`,
{ responseType: "blob" }
);

const url = window.URL.createObjectURL(new Blob([res.data]));
const link = document.createElement("a");

link.href = url;
link.download = "session-report.xlsx";
link.click();

}catch(err){
console.log(err);
}

};
return(

<div className="card">

<h2>Session Report</h2>

<h3>Total Present: {present}</h3>
<h3>Total Absent: {absent}</h3>
<button
onClick={downloadReport}
style={{
background:"#4CAF50",
color:"white",
padding:"10px 20px",
border:"none",
borderRadius:"6px",
marginBottom:"20px",
cursor:"pointer"
}}
>
Download Report
</button>
<table>

<thead>
<tr>
<th>Roll No</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{students.map((s)=>(
<tr key={s.rollNo}>
<td>{s.rollNo}</td>
<td>{s.present ? "Present" : "Absent"}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}