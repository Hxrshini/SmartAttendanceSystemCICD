export default function LiveAttendance({students}) {

return (

<div className="card">

<h2>Live Attendance</h2>

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
<td style={{color:s.present?"lime":"red"}}>
{s.present?"Present":"Absent"}
</td>
</tr>

))}

</tbody>

</table>

</div>

)

}