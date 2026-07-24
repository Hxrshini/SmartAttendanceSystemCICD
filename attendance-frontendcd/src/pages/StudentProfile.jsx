import { useEffect, useState } from "react";
import api from "../api";
import "../styles/studentprofile.css";

export default function StudentProfile() {

const [profile,setProfile] = useState({});
const [photo,setPhoto] = useState(null);

// fetch profile
useEffect(()=>{

api.get("/api/student/profile")
.then(res=>{
setProfile(res.data);
})
.catch(err=>{
console.log(err);
});

},[]);


// upload photo
const uploadPhoto = async () => {

if(!photo){
alert("Please select photo");
return;
}

const formData = new FormData();
formData.append("file", photo);

try{

await api.post("/api/student/upload-photo", formData,{
headers:{
"Content-Type":"multipart/form-data"
}
});

alert("Photo uploaded successfully");
window.location.reload();

}catch(err){
alert("Photo upload failed");
}

};


// request photo change
const requestPhotoChange = async () => {

try{

await api.post("/api/student/request-photo-change");

alert("Photo change request sent");

}catch(err){
alert("Request failed");
}

};


return(

<div className="dashboard-card">

<h2>Student Profile</h2>

<div className="profile-container">

{profile.profilePhotoPath && (

<div style={{marginBottom:"15px"}}>

<img
src={`http://localhost:8080/${profile.profilePhotoPath}`}
alt="profile"
width="150"
style={{borderRadius:"10px"}}
/>

</div>

)}

<div className="profile-details">

<p><b>Name :</b> {profile.name}</p>
<p><b>Email :</b> {profile.email}</p>
<p><b>Roll No :</b> {profile.rollNo}</p>
<p><b>Class :</b> {profile.classEmail}</p>
<p><b>Department :</b> {profile.department}</p>
<p><b>Tutor :</b> {profile.tutorName}</p>

</div>

</div>


<h3>Profile Photo</h3>

{!profile.profilePhotoPath ? (

<div>

<input
type="file"
accept="image/*"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

<button onClick={uploadPhoto}>
Upload Photo
</button>

</div>

) : (

<div>

<p>Profile photo already uploaded ✔</p>

<button onClick={requestPhotoChange}>
Request Photo Change
</button>

</div>

)}

</div>

);

}