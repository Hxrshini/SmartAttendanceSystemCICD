import API from "../api";

export default function TutorDownloadReport(){

const downloadReport = async ()=>{

try{

const res = await API.get("/api/tutor/class-report/download",{

responseType:"blob"

});

const url = window.URL.createObjectURL(new Blob([res.data]));

const link = document.createElement("a");

link.href = url;
link.setAttribute("download","class_attendance_report.xlsx");

document.body.appendChild(link);

link.click();

}catch(err){

console.log(err);
alert("Download failed");

}

};

return(

<div className="card">

<h2>Download Class Attendance Report</h2>

<p>You can download the full attendance report in Excel format.</p>

<button
onClick={downloadReport}
style={{
background:"#4CAF50",
color:"white",
padding:"12px 20px",
border:"none",
borderRadius:"10px",
cursor:"pointer"
}}
>

Download Excel Report

</button>

</div>

);

}