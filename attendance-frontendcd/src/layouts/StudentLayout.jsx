import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/studentlayout.css";

export default function StudentLayout(){

return(

<div className="dashboard-container">

<StudentSidebar/>

<div className="main-content">

<Outlet/>

</div>

</div>

);

}