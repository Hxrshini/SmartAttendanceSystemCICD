import { useState } from "react";
import api from "../api";
import "../styles/startsession.css";
  import FacultySidebar from "../components/FacultySidebar";
export default function StartSession(){
const [qrImage,setQrImage] = useState(null);
const [classEmail,setClassEmail] = useState("");
const [subject,setSubject] = useState("");
const [period,setPeriod] = useState("");
const [duration,setDuration] = useState("");
const [radius,setRadius] = useState("");

const [lat,setLat] = useState("");
const [lng,setLng] = useState("");

const [mode,setMode] = useState("auto"); // auto or manual

const [qrToken,setQrToken] = useState(null);
const [sessionNumber,setSessionNumber] = useState(null);


const getLocation = () => {

if(!navigator.geolocation){
alert("GPS not supported");
return;
}

navigator.geolocation.getCurrentPosition((pos)=>{

setLat(pos.coords.latitude);
setLng(pos.coords.longitude);

},()=>{
alert("Location permission denied");
});

};


const startSession = async () => {

try{

if(!lat || !lng){
alert("Location required");
return;
}

const body = {
classEmail,
subject,
period,
durationMinutes: parseInt(duration),
radius: parseFloat(radius),
latitude: parseFloat(lat),
longitude: parseFloat(lng)
};

console.log("Sending request:", body);

const res = await api.post("/api/faculty/start-session", body);

const qr = res.data.qrToken;
const session = res.data.sessionNumber;
const image = res.data.qrImage;

setQrToken(qr);
setSessionNumber(session);
setQrImage(image);

localStorage.setItem("qrToken", qr);
localStorage.setItem("sessionNumber", session);
localStorage.setItem("qrImage", image);

alert("Session Started Successfully");
setTimeout(()=>{
  window.location.href="/faculty";
},500);
}catch(err){

console.log("ERROR:", err);
alert("Failed to start session");

}

};


return(

<div className="card">

<h2>Start Attendance Session</h2>

<input
placeholder="Class Email"
value={classEmail}
onChange={(e)=>setClassEmail(e.target.value)}
/>

<input
placeholder="Subject"
value={subject}
onChange={(e)=>setSubject(e.target.value)}
/>

<input
placeholder="Period"
value={period}
onChange={(e)=>setPeriod(e.target.value)}
/>

<input
type="number"
min="1"
max="15"
placeholder="Duration (minutes)"
value={duration}
onChange={(e)=>setDuration(e.target.value)}
/>

<input
placeholder="Radius (meters)"
value={radius}
onChange={(e)=>setRadius(e.target.value)}
/>


{/* LOCATION MODE */}

<h3>Location Mode</h3>

<select
value={mode}
onChange={(e)=>setMode(e.target.value)}
>

<option value="auto">Automatic GPS</option>
<option value="manual">Manual</option>

</select>


{/* AUTO GPS */}

{mode === "auto" && (

<button onClick={getLocation}>
Allow GPS
</button>

)}


{/* MANUAL ENTRY */}

{mode === "manual" && (

<>

<input
placeholder="Latitude"
value={lat}
onChange={(e)=>setLat(e.target.value)}
/>

<input
placeholder="Longitude"
value={lng}
onChange={(e)=>setLng(e.target.value)}
/>

</>

)}


<button
onClick={startSession}
disabled={!lat || !lng}
>
Start Session
</button>


{/* QR DISPLAY */}

{qrToken && (

<div style={{marginTop:"30px",textAlign:"center"}}>

<h3>Session Number: {sessionNumber}</h3>

<img
src={`data:image/png;base64,${qrImage}`}
width="250"
/>

<p>Students scan this QR to mark attendance</p>

</div>

)}

</div>

);

}