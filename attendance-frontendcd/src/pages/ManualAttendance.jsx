import { useEffect, useState } from "react";
import API from "../api";

export default function ManualAttendance(){

const [students,setStudents] = useState([]);
const [rollNo,setRollNo] = useState("");
const sessionId = localStorage.getItem("sessionId");

useEffect(()=>{
loadStudents();
},[]);

const loadStudents = async ()=>{

try{

const res = await API.get("/faculty/class-students");

setStudents(res.data);

}catch(err){
console.log(err);
}

};

const markManual = async (status)=>{

if(!rollNo){
alert("Enter Roll Number");
return;
}

try{

await API.post("/api/faculty/manual-attendance",{

sessionId:sessionId,
rollNo:rollNo,
present:status

});

alert("Attendance Updated");

setRollNo("");

}catch(err){

alert("Failed");

}

};

return(

<div className="card">

<h2>Manual Attendance Entry</h2>

<input
placeholder="Enter Roll Number"
value={rollNo}
onChange={(e)=>setRollNo(e.target.value)}
/>

<div style={{marginTop:"15px"}}>

<button
onClick={()=>markManual(true)}
style={{background:"green",color:"white",marginRight:"10px"}}
>

Mark Present

</button>

<button
onClick={()=>markManual(false)}
style={{background:"red",color:"white"}}
>

Mark Absent

</button>

</div>

<h3 style={{marginTop:"30px"}}>Class Students</h3>

<table>

<thead>
<tr>
<th>Roll No</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{students.map((s,i)=>(

<tr key={i}>
<td>{s.rollNo}</td>
<td>{s.present ? "Present" : "Not Marked"}</td>
</tr>

))}

</tbody>

</table>

</div>

);

}