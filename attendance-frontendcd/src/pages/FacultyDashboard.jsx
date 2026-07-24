  import { useEffect, useState } from "react";
  import FacultySidebar from "../components/FacultySidebar";
  import LiveAttendance from "../components/LiveAttendance";
  import AttendanceGraph from "../components/AttendanceGraph";
import "../styles/facultydashboard.css";
  import API from "../api";
 

  export default function FacultyDashboard(){

  const [students,setStudents] = useState([]);
  const [present,setPresent] = useState(0);
  const [absent,setAbsent] = useState(0);
  const [sessionNumber, setSessionNumber] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  useEffect(() => {

    const savedSession = localStorage.getItem("sessionNumber");
const savedImage = localStorage.getItem("qrImage");

    console.log("Stored session:", savedSession);
    console.log("Stored image:", savedImage);

    if(savedSession){
  setSessionNumber(Number(savedSession));
}

if(savedImage){
  setQrImage(savedImage);
}

  }, []);

  useEffect(()=>{
  if(!sessionNumber) return;

  loadAttendance();

  const interval = setInterval(loadAttendance,3000);
  console.log("Session Number:", sessionNumber);
  return ()=> clearInterval(interval);
  },[sessionNumber]);


  const loadAttendance = async ()=>{

  try{

  if(!sessionNumber || sessionNumber === "undefined")  return;

  const res = await API.get(`/api/faculty/session-report-number/${sessionNumber}`);

  setStudents(res.data);

  const presentCount = res.data.filter(s=>s.present).length;
  const absentCount = res.data.filter(s=>!s.present).length;

  setPresent(presentCount);
  setAbsent(absentCount);

  }catch(err){

  console.log("Attendance load error:", err);

  }

  }

  return(

  <div className="layout">

  <FacultySidebar/>

 <div className="content">

<div className="center-container">

<h1 className="page-title">Faculty Dashboard</h1>

<div className="grid">

  {/* QR */}

  <div className="card">

  <h2>Live QR Code</h2>

  <div className="qr-box">

  <div className="qr-glow">
{qrImage ? (
<img
src={`data:image/png;base64,${qrImage}`}
alt="QR Code"
/>
) : (
<p>No active session</p>
)}
  </div>

  </div>

  </div>


  {/* Graph */}

  <AttendanceGraph present={present} absent={absent}/>


  {/* Live Table */}

  <LiveAttendance students={students}/>

  </div>

  </div>

  </div>
  </div>

  )

  }