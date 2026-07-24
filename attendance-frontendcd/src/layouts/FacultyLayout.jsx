import { Outlet } from "react-router-dom";
import FacultySidebar from "../components/FacultySidebar";
import "../styles/facultydashboard.css";

export default function FacultyLayout(){

return(

<div className="layout">

<FacultySidebar/>

<div className="content">
<Outlet/>
</div>

</div>

)

}