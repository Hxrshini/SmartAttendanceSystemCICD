import { useEffect, useState } from "react";
import API from "../api";

export default function TutorDeviceHistory(){

const [devices,setDevices] = useState([]);

useEffect(()=>{

loadHistory();

},[]);


const loadHistory = async ()=>{

try{

const res = await API.get("/api/tutor/device-history");

setDevices(res.data);

}catch(err){

console.log(err);

}

};


return(

<div className="card">

<h2>Device History</h2>

<table>

<thead>

<tr>

<th>Roll No</th>
<th>Device</th>
<th>IP Address</th>
<th>Time</th>

</tr>

</thead>

<tbody>

{devices.map((d,i)=>(

<tr key={i}>

<td>{d.rollNo}</td>
<td>{d.device}</td>
<td>{d.ipAddress}</td>
<td>{new Date(d.time).toLocaleString()}</td>

</tr>

))}

</tbody>

</table>

</div>

);

}