import { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";


export default function AssignTutorModal({ show, close }) {

  const [facultyId, setFacultyId] = useState("");
  const [classEmail, setClassEmail] = useState("");

  if (!show) return null;

  const assignTutor = async () => {
    try {
      await API.put("/hod/assign-tutor", null, {
        params: { facultyId, classEmail }
      });
      toast.success("Tutor Assigned Successfully!");
      close();
    } catch {
      toast.error("Failed to assign tutor");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Assign Tutor</h3>

        <input
          placeholder="Faculty ID"
          value={facultyId}
          onChange={(e)=>setFacultyId(e.target.value)}
        />

        <input
          placeholder="Class Email"
          value={classEmail}
          onChange={(e)=>setClassEmail(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={assignTutor}>Assign</button>
          <button className="cancel-btn" onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}