import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StartSession from "./pages/StartSession";
import HodDashboard from "./pages/HodDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import CloseSession from "./pages/CloseSession";
import ManualAttendance from "./pages/ManualAttendance";
import TutorLayout from "./layouts/TutorLayout";
import StudentLayout from "./layouts/StudentLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import TutorPendingRequests from "./pages/TutorPendingRequests";
import TutorDeviceHistory from "./pages/TutorDeviceHistory";
import TutorSuspiciousLogs from "./pages/TutorSuspiciousLogs";
import TutorClassReport from "./pages/TutorClassReport";
import TutorDownloadReport from "./pages/TutorDownloadReport";
import StudentDashboard from "./pages/StudentDashboard";

import AttendanceHistory from "./pages/AttendanceHistory";
import AttendancePercentage from "./pages/AttendancePercentage";
import StudentProfile from "./pages/StudentProfile";
import SessionReport from "./pages/SessionReport";
// later you can add these
// import FacultyDashboard from "./pages/FacultyDashboard";
// import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (

    <Router>

      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* HOD Dashboard */}
        <Route path="/hod" element={<HodDashboard />} />
{/* Faculty */}
       <Route path="/faculty" element={<FacultyLayout />}>

  <Route index element={<FacultyDashboard />} />
  <Route path="start" element={<StartSession />} />
  <Route path="close" element={<CloseSession />} />
  <Route path="manual" element={<ManualAttendance />} />
  <Route path="report" element={<SessionReport />} />

</Route>
        
<Route path="/tutor" element={<TutorLayout />}>

  <Route index element={<TutorDashboard />} />
  <Route path="pending" element={<TutorPendingRequests />} />
  <Route path="device-history" element={<TutorDeviceHistory />} />
  <Route path="suspicious" element={<TutorSuspiciousLogs />} />
  <Route path="class-report" element={<TutorClassReport />} />
  <Route path="download-report" element={<TutorDownloadReport />} />

</Route>
        <Route path="/student" element={<StudentLayout />}>

  <Route index element={<StudentDashboard />} />
  <Route path="history" element={<AttendanceHistory />} />
  <Route path="percentage" element={<AttendancePercentage />} />
  <Route path="profile" element={<StudentProfile />} />

</Route>
        {/* Future pages */}
        {/* <Route path="/faculty" element={<FacultyDashboard />} /> */}
        {/* <Route path="/student" element={<StudentDashboard />} /> */}

      </Routes>

    </Router>

  );
}

export default App;