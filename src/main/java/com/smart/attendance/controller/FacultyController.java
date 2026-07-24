package com.smart.attendance.controller;
import com.smart.attendance.dto.AttendanceReportDTO;
import com.smart.attendance.dto.ManualEditDTO;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;   // ✅ CORRECT IMPORT
import org.springframework.web.bind.annotation.*;

import com.smart.attendance.dto.ManualEditDTO;
import com.smart.attendance.dto.StartSessionDTO;
import com.smart.attendance.entity.AttendanceSession;
import com.smart.attendance.service.FacultyService;


import jakarta.validation.Valid;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

  
    private final FacultyService facultyService;

@PostMapping("/start-session")
public Map<String, Object> startSession(
        @Valid @RequestBody StartSessionDTO dto,
        Authentication authentication) {

    return facultyService.startSession(dto, authentication);
}
   @GetMapping("/session-report-number/{sessionNumber}")
public List<AttendanceReportDTO> getSessionReportByNumber(
        @PathVariable Long sessionNumber) {

    return facultyService.getSessionReportByNumber(sessionNumber);
}

    @PutMapping("/close-session-number/{sessionNumber}")
public String closeSessionByNumber(@PathVariable Long sessionNumber) {
    return facultyService.closeSessionByNumber(sessionNumber);
}

    @PutMapping("/manual-edit")
public String manualEditAttendance(Long attendanceId, boolean present) {
    return facultyService.manualEditAttendance(attendanceId, present);
}
@GetMapping("/session-report-number/{sessionNumber}/download")
public ResponseEntity<byte[]> downloadExcelByNumber(@PathVariable Long sessionNumber) throws Exception {

    byte[] file = facultyService.generateSessionExcelByNumber(sessionNumber);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=session-report.xlsx")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(file);
}
}