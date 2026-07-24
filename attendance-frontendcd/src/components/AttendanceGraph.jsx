export default function AttendanceGraph({present, absent}) {

return (

<div className="card">

<h2>Attendance Stats</h2>

<div style={{display:"flex", justifyContent:"space-around"}}>

<div style={{color:"#00ff88"}}>
<h3>Present</h3>
<h1>{present}</h1>
</div>

<div style={{color:"#ff4d4d"}}>
<h3>Absent</h3>
<h1>{absent}</h1>
</div>

</div>

</div>

)

}