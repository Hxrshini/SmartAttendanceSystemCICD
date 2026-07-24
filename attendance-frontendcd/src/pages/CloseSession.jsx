import { useState } from "react";
import api from "../api";

export default function CloseSession(){

const [loading,setLoading] = useState(false);

const sessionNumber = localStorage.getItem("sessionNumber");

const closeSession = async ()=>{

if(!sessionNumber){
alert("No active session found");
return;
}

try{

setLoading(true);

await api.put(`/api/faculty/close-session-number/${sessionNumber}`);

alert("Session closed successfully");

localStorage.removeItem("sessionNumber");
localStorage.removeItem("qrToken");

window.location.href="/faculty";

}catch(err){

console.log(err);
alert("Failed to close session");

}finally{
setLoading(false);
}

}

return(

<div className="card">

<h2>Close Active Session</h2>

<p>
Current Session Number: {sessionNumber ? sessionNumber : "No active session"}
</p>

<button
onClick={closeSession}
disabled={loading}
style={{
background:"#ff4d4d",
color:"white",
padding:"12px 25px",
border:"none",
borderRadius:"10px",
cursor:"pointer"
}}
>

{loading ? "Closing..." : "Close Session"}

</button>

</div>

);

}