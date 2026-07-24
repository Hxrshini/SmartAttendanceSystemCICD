package com.smart.attendance.service.impl;

import org.springframework.security.core.Authentication;
import com.smart.attendance.dto.*;
import com.smart.attendance.entity.*;
import com.smart.attendance.repository.*;

import com.smart.attendance.service.StudentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ProfileEditRequestRepository profileEditRequestRepository;

    // =====================================================
    // 🔐 COMMON METHOD
    // =====================================================

   private Student getLoggedInStudent(Authentication authentication) {

    if(authentication == null){
        throw new RuntimeException("User not authenticated");
    }

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));

    if (!user.getRole().equals(Role.STUDENT)) {
        throw new RuntimeException("Access denied. Not a student");
    }

    return studentRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Student record not found"));
}

    // =====================================================
    // 📍 DISTANCE CALCULATION (GPS VALIDATION)
    // =====================================================

    private double calculateDistance(double lat1, double lon1,
                                     double lat2, double lon2) {

        final int EARTH_RADIUS = 6371000;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2)
                * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    // =====================================================
    // ✅ MARK ATTENDANCE
    // =====================================================

    @Override
public String markAttendance(MarkAttendanceDTO dto,
                             Authentication authentication) {

    Student student = getLoggedInStudent(authentication);

    AttendanceSession session = sessionRepository
            .findByQrToken(dto.getQrToken())
            .orElseThrow(() -> new RuntimeException("Invalid QR Code"));

    if (!session.isActive()) {
        throw new RuntimeException("Session is closed");
    }

    if (!student.getClassEmail().equals(session.getClassEmail())) {
        throw new RuntimeException("You are not allowed in this session");
    }

    if (LocalDateTime.now().isAfter(session.getEndTime())) {

        session.setActive(false);
        session.setExpired(true);
        sessionRepository.save(session);

        throw new RuntimeException("QR expired");
    }

    Attendance attendance = attendanceRepository
            .findBySession_IdAndStudent_Id(session.getId(), student.getId())
            .orElseGet(() -> {

                Attendance newAttendance = new Attendance();
                newAttendance.setSession(session);
                newAttendance.setStudent(student);
                newAttendance.setPresent(false);

                return attendanceRepository.save(newAttendance);
            });

    if (attendance.isPresent()) {
        throw new RuntimeException("Attendance already marked");
    }

    // ================= GPS VALIDATION =================

    double distance = calculateDistance(
            session.getLatitude(),
            session.getLongitude(),
            dto.getLatitude(),
            dto.getLongitude()
    );

    if (distance > session.getRadius()) {
        throw new RuntimeException("You are outside the allowed attendance area");
    }

    // ================= MARK ATTENDANCE =================

    attendance.setPresent(true);
    attendance.setLatitude(dto.getLatitude());
    attendance.setLongitude(dto.getLongitude());
    attendance.setMarkedAt(LocalDateTime.now());

    attendanceRepository.save(attendance);

    return "Attendance marked successfully";
}
    @Override
    public List<AttendanceReportDTO> getAttendanceHistory(Authentication authentication) {

        Student student = getLoggedInStudent(authentication);

        return attendanceRepository
                .findByStudent_Id(student.getId())
                .stream()
                .map(att -> AttendanceReportDTO.builder()
                        .rollNo(student.getRollNo())
                        .studentName(student.getUser().getName())
                        .subject(att.getSession().getSubject())
                        .present(att.isPresent())
                        .markedAt(att.getMarkedAt())
                        .build())
                .toList();
    }

    // =====================================================
    // 📈 ATTENDANCE PERCENTAGE
    // =====================================================

    @Override
    public Double getAttendancePercentage(Authentication authentication) {

        Student student = getLoggedInStudent(authentication);

        long totalClasses =
                attendanceRepository.countByStudent_Id(student.getId());

        if (totalClasses == 0) {
            return 0.0;
        }

        long totalPresent =
                attendanceRepository.countByStudent_IdAndPresentTrue(student.getId());

        return (totalPresent * 100.0) / totalClasses;
    }

    // =====================================================
    // 👤 PROFILE
    // =====================================================

    @Override
    public StudentProfileDTO getProfile(Authentication authentication) {

        Student student = getLoggedInStudent(authentication);

        User user = student.getUser();
        Faculty tutor = student.getTutor();

        return StudentProfileDTO.builder()
                .studentId(student.getId())
                .name(user.getName())
                .email(user.getEmail())
                .rollNo(student.getRollNo())
                .classEmail(student.getClassEmail())
                .department(tutor != null ? tutor.getDepartment() : null)
                .tutorName(tutor != null ? tutor.getUser().getName() : null)
                .profilePhotoPath(student.getProfilePhotoPath())
                .active(user.isActive())
                .build();
    }

    // =====================================================
    // 📊 DASHBOARD
    // =====================================================

    @Override
    public StudentDashboardDTO getDashboard(Authentication authentication) {

        Student student = getLoggedInStudent(authentication);

        long totalClasses =
                attendanceRepository.countByStudentId(student.getId());

        long totalPresent =
                attendanceRepository.countByStudentIdAndPresentTrue(student.getId());

        long totalAbsent = totalClasses - totalPresent;

        double percentage = totalClasses == 0
                ? 0.0
                : (totalPresent * 100.0) / totalClasses;

        boolean markedToday =
                attendanceRepository.existsByStudentIdAndMarkedAtBetween(
                        student.getId(),
                        java.time.LocalDate.now().atStartOfDay(),
                        java.time.LocalDate.now().atTime(23, 59, 59)
                );

        return StudentDashboardDTO.builder()
                .name(student.getUser().getName())
                .rollNo(student.getRollNo())
                .totalClasses(totalClasses)
                .totalPresent(totalPresent)
                .totalAbsent(totalAbsent)
                .percentage(percentage)
                .markedToday(markedToday)
                .build();
    }

    // =====================================================
    // 📷 PROFILE PHOTO UPLOAD
    // =====================================================
@Override
public String uploadProfilePhoto(Authentication authentication,
                                 MultipartFile file) throws IOException {

    Student student = getLoggedInStudent(authentication);

    if(file == null || file.isEmpty()){
        throw new RuntimeException("No file selected");
    }

    String uploadDir = System.getProperty("user.dir") + "/uploads/students/";

    File dir = new File(uploadDir);
    if (!dir.exists()) {
        dir.mkdirs();
    }

    String fileName = student.getId() + ".jpg";

    File destination = new File(dir, fileName);

    file.transferTo(destination);

    student.setProfilePhotoPath("uploads/students/" + fileName);

    studentRepository.save(student);

    return "Photo uploaded successfully";
}
@Override
public String requestPhotoChange(Authentication authentication) {

    Student student = getLoggedInStudent(authentication);

    ProfileEditRequest request = new ProfileEditRequest();

    request.setStudent(student);
    request.setRequestedField("PROFILE_PHOTO");
request.setNewValue("CHANGE_REQUEST");
    request.setStatus("PENDING");


request.setRequestedAt(LocalDateTime.now());

    profileEditRequestRepository.save(request);

    return "Photo change request sent to class email";
}
@Override
public String updateProfile(Authentication authentication,
                            StudentProfileUpdateDTO dto) {

    Student student = getLoggedInStudent(authentication);

    student.getUser().setName(dto.getName());
    student.setRollNo(dto.getRollNo());

    userRepository.save(student.getUser());
    studentRepository.save(student);

    return "Profile updated successfully";
}
}