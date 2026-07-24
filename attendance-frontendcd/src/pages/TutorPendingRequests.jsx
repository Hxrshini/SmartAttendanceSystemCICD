import { useEffect, useState } from "react";
import API from "../api";

export default function TutorPendingRequests(){

const [requests,setRequests] = useState([]);

useEffect(()=>{
loadRequests();
},[]);

const loadRequests = async ()=>{

const res = await API.get("/api/tutor/pending-requests");

setRequests(res.data);

};

const approve = async(id)=>{

await API.put(`/api/tutor/approve-profile/${id}`);

loadRequests();

};

const reject = async(id)=>{

await API.put(`/api/tutor/reject-profile/${id}`);

loadRequests();

};

return(

<div className="card">

<h2>Pending Profile Requests</h2>

<table>

<thead>
<tr>
<th>Roll No</th>
<th>Name</th>
<th>Requested Field</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{requests.map(r=>(

<tr key={r.requestId}>

<td>{r.rollNo}</td>
<td>{r.studentName}</td>
<td>{r.requestedField}</td>

<td>

<button
onClick={()=>approve(r.requestId)}
style={{background:"green",color:"white"}}
>
Approve
</button>

<button
onClick={()=>reject(r.requestId)}
style={{background:"red",color:"white",marginLeft:"10px"}}
>
Reject
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}