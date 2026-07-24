import TutorSidebar from "../components/TutorSidebar";
import { Outlet } from "react-router-dom";

export default function TutorLayout(){

return(

<div className="layout">

<TutorSidebar/>

<div className="content">
<Outlet/>
</div>

</div>

);

}