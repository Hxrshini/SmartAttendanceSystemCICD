import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/Statcard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/hodDashboard.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function HodDashboard() {

  const [view, setView] = useState("dashboard");
  const [summary, setSummary] = useState({});
  const [report, setReport] = useState([]);

  // ✅ MOVE HERE (not inside downloadReport)
  const [assignData, setAssignData] = useState({
    facultyId: "",
    classEmail: ""
  });

 const handleAssignTutor = async () => {

  try {

    await API.put("/api/hod/assign-tutor", null, {
      params: {
        facultyId: assignData.facultyId,
        classEmail: assignData.classEmail
      }
    });

    toast.success("Tutor assigned successfully!");

    setAssignData({
      facultyId: "",
      classEmail: ""
    });

  } catch (error) {

    console.error(error);

    toast.error("Failed to assign tutor");

  }

};

useEffect(() => {
  loadSummary();
}, []);

const loadSummary = async () => {
  try {

    const res = await API.get("/api/hod/department-report");

    setSummary(res.data);

  } catch (error) {

    console.error("Summary error:", error);
    toast.error("Failed to load summary");

  }
};
const loadReport = async (type) => {
  try {

    const res = await API.get(`/api/hod/report/${type}`);

    const data = res.data;

    const flatList = Object.entries(data).flatMap(([className, list]) =>
      list.map(item => ({
        ...item,
        className
      }))
    );

    setReport(flatList);
    setView("reports");

  } catch (error) {
    toast.error("Failed to load report");
  }
};
  const downloadReport = () => {
    if (!report || report.length === 0) {
      alert("No data available to download");
      return;
    }

    const headers = ["Class","Roll No", "Subject", "Status", "Date"];

    const rows = report.map(item => [
        item.className,
      item.rollNo,
      item.subject,
      item.present ? "Present" : "Absent",
      item.markedAt
    ]);
    

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
  };
  const chartData = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      label: "Attendance Overview",
      data: [
        summary.totalPresent || 0,
        summary.totalAbsent || 0
      ],
      backgroundColor: ["#1cc88a", "#e74a3b"]
    }
  ]
};
  return (
    <div className="dashboard-container">

      <Sidebar setView={setView} />

      <div className="main-section">
        <Topbar />

        {view === "dashboard" && (
  <>
    <div className="cards-container">
      <StatCard title="Total Present" value={summary.totalPresent || 0} color="#1cc88a"/>
      <StatCard title="Total Absent" value={summary.totalAbsent || 0} color="#e74a3b"/>
    </div>

    <div className="chart-box">
      <Bar data={chartData} />
    </div>
  </>
)}

        {view === "reports" && (
  <div className="report-table">
    <div className="report-buttons">
  <button onClick={()=>loadReport("daily")}>Daily</button>
  <button onClick={()=>loadReport("weekly")}>Weekly</button>
  <button onClick={()=>loadReport("monthly")}>Monthly</button>
  <button className="download-btn" onClick={downloadReport}>
    Download Report
  </button>
</div>
            <table>
              <thead>
                <tr>
                    <th>Class</th>
                  <th>Roll No</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.className}</td>
                    <td>{r.rollNo}</td>
                    <td>{r.subject}</td>
                    <td>{r.present ? "Present" : "Absent"}</td>
                    <td>{r.markedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}{view === "assignTutor" && (
  <div className="assign-box">
    <h3>Assign Tutor</h3>

    <input
      type="number"
      placeholder="Faculty ID"
      value={assignData.facultyId}
      onChange={(e) =>
        setAssignData({ ...assignData, facultyId: e.target.value })
      }
    />

    <input
      type="email"
      placeholder="Class Email"
      value={assignData.classEmail}
      onChange={(e) =>
        setAssignData({ ...assignData, classEmail: e.target.value })
      }
    />

    <button onClick={handleAssignTutor}>
      Assign Tutor
    </button>
  </div>
)}
      </div>

      <ToastContainer />
    </div>
  );
  
}