package com.smart.attendance.service;

import com.smart.attendance.dto.*;

import io.jsonwebtoken.io.IOException;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface StudentService {



    String markAttendance(MarkAttendanceDTO dto, Authentication authentication) throws java.io.IOException;

    Double getAttendancePercentage(Authentication authentication);

List<AttendanceReportDTO> getAttendanceHistory(Authentication authentication);

StudentProfileDTO getProfile(Authentication authentication);

StudentDashboardDTO getDashboard(Authentication authentication);
 String uploadProfilePhoto(Authentication authentication, MultipartFile file) throws IOException, java.io.IOException;

String requestPhotoChange(Authentication authentication);

String updateProfile(Authentication authentication, StudentProfileUpdateDTO dto);

 
}