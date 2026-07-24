package com.smart.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;

import com.smart.attendance.dto.AttendanceReportDTO;
import com.smart.attendance.dto.StartSessionDTO;
import com.smart.attendance.entity.AttendanceSession;

public interface FacultyService {

    public Map<String, Object> startSession(StartSessionDTO dto, Authentication authentication);

    String closeSessionByNumber(Long sessionNumber);

    String manualEditAttendance(Long attendanceId, boolean present);

    List<AttendanceSession> getActiveSessionsByFaculty(Long facultyId);

 

    byte[] generateSessionExcel(Long sessionId, Authentication authentication) throws Exception;

byte[] generateSessionExcelByNumber(Long sessionNumber) throws Exception;
    List<AttendanceReportDTO> getSessionReportByNumber(Long sessionNumber);
}