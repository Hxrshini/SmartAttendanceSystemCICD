import React,{useState} from "react"
import axios from "axios"

export default function ManualEdit(){

const [sessionId,setSessionId]=useState("")
const [studentId,setStudentId]=useState("")
const [present,setPresent]=useState(true)

const updateAttendance=async()=>{

await axios.put("/api/faculty/manual-edit",{

sessionId:sessionId,
studentId:studentId,
present:present

})

alert("Attendance Updated")

}

return(

<div>

<h2>Manual Attendance Edit</h2>

<input
placeholder="Session ID"
onChange={(e)=>setSessionId(e.target.value)}
/>

<input
placeholder="Student ID"
onChange={(e)=>setStudentId(e.target.value)}
/>

<select onChange={(e)=>setPresent(e.target.value)}>

<option value={true}>Present</option>
<option value={false}>Absent</option>

</select>

<button onClick={updateAttendance}>
Update
</button>

</div>

)

}