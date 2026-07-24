import { useState, useEffect, useRef } from "react";
import api from "../api";
import * as faceapi from "face-api.js";
import { Html5QrcodeScanner } from "html5-qrcode";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/markAttendance.css";

export default function MarkAttendance(){

const videoRef = useRef(null);
const scannerRef = useRef(null);

const [modelsLoaded,setModelsLoaded] = useState(false);

const [qrToken,setQrToken] = useState("");
const [latitude,setLatitude] = useState("");
const [longitude,setLongitude] = useState("");

const [profilePhoto,setProfilePhoto] = useState("");
const [profileDescriptor,setProfileDescriptor] = useState(null);

const [faceMatched,setFaceMatched] = useState(false);
const [instruction,setInstruction] = useState("Scan QR to start");
const [blinkDetected,setBlinkDetected] = useState(false);


/* ================= LOAD AI MODELS ================= */

const loadModels = async () => {

await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

setModelsLoaded(true);

console.log("AI models loaded");

};


/* ================= GET PROFILE ================= */

const getProfile = async () => {

const token = localStorage.getItem("token");

const res = await api.get(
"/api/student/profile",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setProfilePhoto(res.data.profilePhotoPath);

};


/* ================= LOAD PROFILE FACE ================= */

const loadProfileDescriptor = async () => {

if(!modelsLoaded) return;
if(!profilePhoto) return;

try{

const img = await faceapi.fetchImage(
"http://localhost:8080/" + profilePhoto
);

const detection = await faceapi
.detectSingleFace(img)
.withFaceLandmarks()
.withFaceDescriptor();

if(detection){
setProfileDescriptor(detection.descriptor);
}

}catch(e){
console.log("Profile descriptor error",e);
}

};


/* ================= CAMERA ================= */

const startCamera = async () => {

try{

const stream = await navigator.mediaDevices.getUserMedia({video:true});

if(videoRef.current){
videoRef.current.srcObject = stream;
}

}catch(e){

alert("Camera permission denied");

}

};


/* ================= QR SCANNER ================= */

const startScanner = () => {

if(scannerRef.current) return;

scannerRef.current = new Html5QrcodeScanner(
"reader",
{
fps:10,
qrbox:(viewfinderWidth, viewfinderHeight)=>{
const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
const qrboxSize = Math.floor(minEdge * 0.6);
return { width: qrboxSize, height: qrboxSize };
}
},
false
);

scannerRef.current.render(

async (decodedText)=>{

setQrToken(decodedText);
setInstruction("Position your face");

/* stop scanner properly */

if(scannerRef.current){
await scannerRef.current.clear();
scannerRef.current = null;
}

/* remove leftover HTML */

const reader = document.getElementById("reader");
if(reader) reader.innerHTML = "";

/* start camera */

startCamera();

},

(error)=>{}

);

};


/* ================= GPS ================= */

const getLocation = () => {

navigator.geolocation.getCurrentPosition((position)=>{

setLatitude(position.coords.latitude);
setLongitude(position.coords.longitude);

});

};


/* ================= FACE DETECTION ================= */

const detectFace = async () => {

if(!modelsLoaded) return;

const video = videoRef.current;

if(!video || video.readyState !== 4) return;

if(!profileDescriptor) return;

const detection = await faceapi
.detectSingleFace(video)
.withFaceLandmarks()
.withFaceDescriptor();

if(!detection){

setInstruction("Face not detected");
return;

}


/* ================= BLINK DETECTION ================= */

const leftEye = detection.landmarks.getLeftEye();

const eyeHeight = Math.abs(leftEye[1].y - leftEye[5].y);

if(eyeHeight < 6 && !blinkDetected){

setBlinkDetected(true);
setInstruction("Blink detected");

}


/* ================= FACE MATCH ================= */

if(blinkDetected && !faceMatched){

const distance = faceapi.euclideanDistance(
profileDescriptor,
detection.descriptor
);

if(distance < 0.65){

setFaceMatched(true);
setInstruction("Face verified");

}else{

setInstruction("Face does not match");

}

}

};


/* ================= MARK ATTENDANCE ================= */

const markAttendance = async () => {

if(!faceMatched){

alert("Face verification required");
return;

}

const token = localStorage.getItem("token");

try{

await api.post(
"/api/student/mark-attendance",
{
qrToken: qrToken,
latitude: Number(latitude),
longitude: Number(longitude)
},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

alert("Attendance Marked Successfully");

}catch(e){

alert("Attendance failed");

}

};


/* ================= INITIAL LOAD ================= */

useEffect(()=>{

loadModels();
getLocation();
getProfile();

},[]);


/* ================= LOAD PROFILE FACE ================= */

useEffect(()=>{

if(modelsLoaded && profilePhoto){

loadProfileDescriptor();

}

},[modelsLoaded,profilePhoto]);


/* ================= FACE LOOP ================= */

useEffect(()=>{

if(!modelsLoaded) return;

const interval = setInterval(()=>{

detectFace();

},1500);

return ()=> clearInterval(interval);

},[blinkDetected,profileDescriptor,modelsLoaded]);


return(

<div className="dashboard-container">

<StudentSidebar/>

<div className="main-content">

<h2>Mark Attendance</h2>

<button onClick={startScanner}>
Scan QR
</button>

<div id="reader"></div>

{qrToken && (
<div style={{marginTop:"10px"}}>

<p><b>QR Token:</b> {qrToken}</p>

<p><b>Latitude:</b> {latitude}</p>

<p><b>Longitude:</b> {longitude}</p>

</div>
)}

{qrToken && (

<>

<h3>Face Verification</h3>

<div className={`face-scanner ${faceMatched ? "green" : ""}`}>

<video ref={videoRef} autoPlay muted />

</div>

<p className="scan-text">{instruction}</p>

<button onClick={markAttendance} disabled={!faceMatched}>
Submit Attendance
</button>

</>

)}

</div>

</div>

);

}