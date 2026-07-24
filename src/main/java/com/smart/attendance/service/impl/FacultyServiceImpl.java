package com.smart.attendance.service.impl;

import com.smart.attendance.dto.AttendanceReportDTO;
import com.smart.attendance.dto.StartSessionDTO;
import com.smart.attendance.entity.*;
import com.smart.attendance.repository.*;
import com.smart.attendance.service.FacultyService;
import com.smart.attendance.util.QRCodeGenerator;

import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

   @Override
public Map<String, Object> startSession(StartSessionDTO dto, Authentication authentication) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Faculty not registered"));

    if (!user.getRole().equals(Role.FACULTY)) {
        throw new RuntimeException("User is not a faculty");
    }

    Faculty faculty = facultyRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Faculty details not found"));

    // Check active session for same class + period
    AttendanceSession existingSession =
            sessionRepository.findTopByClassEmailAndPeriodAndActiveTrue(
                    dto.getClassEmail(),
                    dto.getPeriod())
                    .orElse(null);

    if (existingSession != null) {

        // If expired → auto close
        if (existingSession.getEndTime().isBefore(LocalDateTime.now())) {

            existingSession.setActive(false);
            existingSession.setExpired(true);
            sessionRepository.save(existingSession);

        } else {

            throw new RuntimeException(
                    "Session already active for this class and period");
        }
    }

    LocalDateTime start = LocalDateTime.now();
    LocalDateTime end = start.plusMinutes(dto.getDurationMinutes());

    Long lastNumber = sessionRepository.findLastSessionNumber();
    Long newSessionNumber = (lastNumber == null) ? 1 : lastNumber + 1;

    String qrToken = UUID.randomUUID().toString();

    AttendanceSession session = AttendanceSession.builder()
            .sessionNumber(newSessionNumber)
            .createdBy(faculty)
            .classEmail(dto.getClassEmail())
            .subject(dto.getSubject())
            .period(dto.getPeriod())
            .latitude(dto.getLatitude())
            .longitude(dto.getLongitude())
            .radius(dto.getRadius())
            .startTime(start)
            .endTime(end)
            .active(true)
            .expired(false)
            .qrToken(qrToken)
            .build();

    sessionRepository.save(session);

  List<Student> students = studentRepository.findByClassEmail(dto.getClassEmail());

List<Attendance> attendanceList = new ArrayList<>();

for (Student student : students) {

    Attendance attendance = Attendance.builder()
            .student(student)
            .session(session)
            .present(false)
            .markedAt(null)
            .build();

    attendanceList.add(attendance);
}

attendanceRepository.saveAll(attendanceList);

 String qrImage = QRCodeGenerator.generateQRCodeImage(qrToken);

return Map.of(
        "sessionNumber", session.getSessionNumber(),
        "qrToken", qrToken,
        "qrImage", qrImage
);
}
    @Override
public String closeSessionByNumber(Long sessionNumber) {

    AttendanceSession session = sessionRepository
            .findBySessionNumber(sessionNumber)
            .orElseThrow(() -> new RuntimeException("Session not found"));

    session.setActive(false);
    session.setExpired(true);
    session.setEndTime(LocalDateTime.now());

    sessionRepository.save(session);

    return "Session closed successfully";
}

    @Override
    public String manualEditAttendance(Long attendanceId, boolean present) {

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setPresent(present);
        attendanceRepository.save(attendance);

        return "Attendance updated successfully";
    }

    @Override
    public List<AttendanceSession> getActiveSessionsByFaculty(Long facultyId) {

        return sessionRepository.findByCreatedById(facultyId)
                .stream()
                .filter(AttendanceSession::isActive)
                .toList();
    }

   @Override
public List<AttendanceReportDTO> getSessionReportByNumber(Long sessionNumber) {

    AttendanceSession session = sessionRepository
            .findBySessionNumber(sessionNumber)
            .orElseThrow(() -> new RuntimeException("Session not found"));

    List<Attendance> attendanceList =
            attendanceRepository.findBySession(session);

    return attendanceList.stream()
            .map(att -> AttendanceReportDTO.builder()
                    .rollNo(att.getStudent().getRollNo())
                    .studentName(att.getStudent().getUser().getName())
                    .subject(session.getSubject())
                    .present(att.isPresent())
                    .markedAt(att.getMarkedAt())
                    .build())
            .toList();
}

    @Override
    public byte[] generateSessionExcel(Long sessionId,
                                       Authentication authentication) throws Exception {

        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        String classEmail = session.getClassEmail();
        String className = classEmail.substring(0, classEmail.indexOf("@"));

        List<Student> students = studentRepository.findByClassEmail(classEmail);

        long totalStudents = students.size();

        long presentCount =
                attendanceRepository.countBySession_IdAndPresentTrue(sessionId);

        long absentCount = totalStudents - presentCount;

        List<Attendance> sessionAttendances =
                attendanceRepository.findBySession_Id(sessionId);

        List<String> presentRollNos = sessionAttendances.stream()
                .filter(Attendance::isPresent)
                .map(a -> a.getStudent().getRollNo())
                .toList();

        List<String> absentRollNos = students.stream()
                .map(Student::getRollNo)
                .filter(roll -> !presentRollNos.contains(roll))
                .toList();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Session Report");

        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        header.createCell(0).setCellValue("Class Name");
        header.createCell(1).setCellValue(className);

        Row row1 = sheet.createRow(rowNum++);
        row1.createCell(0).setCellValue("Total Students");
        row1.createCell(1).setCellValue(totalStudents);

        Row row2 = sheet.createRow(rowNum++);
        row2.createCell(0).setCellValue("Present");
        row2.createCell(1).setCellValue(presentCount);

        Row row3 = sheet.createRow(rowNum++);
        row3.createCell(0).setCellValue("Absent");
        row3.createCell(1).setCellValue(absentCount);

        rowNum++;

        Row absentHeader = sheet.createRow(rowNum++);
        absentHeader.createCell(0).setCellValue("Absent Roll Numbers");

        for (String roll : absentRollNos) {
            Row r = sheet.createRow(rowNum++);
            r.createCell(0).setCellValue(roll);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
@Override
public byte[] generateSessionExcelByNumber(Long sessionNumber) throws Exception {

    AttendanceSession session = sessionRepository
            .findBySessionNumber(sessionNumber)
            .orElseThrow(() -> new RuntimeException("Session not found"));

    String classEmail = session.getClassEmail();
    String className = classEmail.substring(0, classEmail.indexOf("@"));

    List<Student> students = studentRepository.findByClassEmail(classEmail);

    long totalStudents = students.size();

    long presentCount =
            attendanceRepository.countBySession_IdAndPresentTrue(session.getId());

    long absentCount = totalStudents - presentCount;

    List<Attendance> sessionAttendances =
            attendanceRepository.findBySession_Id(session.getId());

    List<String> presentRollNos = sessionAttendances.stream()
            .filter(Attendance::isPresent)
            .map(a -> a.getStudent().getRollNo())
            .toList();

    List<String> absentRollNos = students.stream()
            .map(Student::getRollNo)
            .filter(roll -> !presentRollNos.contains(roll))
            .toList();

    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Session Report");

    int rowNum = 0;

    Row header = sheet.createRow(rowNum++);
    header.createCell(0).setCellValue("Class Name");
    header.createCell(1).setCellValue(className);

    Row row1 = sheet.createRow(rowNum++);
    row1.createCell(0).setCellValue("Total Students");
    row1.createCell(1).setCellValue(totalStudents);

    Row row2 = sheet.createRow(rowNum++);
    row2.createCell(0).setCellValue("Present");
    row2.createCell(1).setCellValue(presentCount);

    Row row3 = sheet.createRow(rowNum++);
    row3.createCell(0).setCellValue("Absent");
    row3.createCell(1).setCellValue(absentCount);

    rowNum++;

    Row absentHeader = sheet.createRow(rowNum++);
    absentHeader.createCell(0).setCellValue("Absent Roll Numbers");

    for (String roll : absentRollNos) {
        Row r = sheet.createRow(rowNum++);
        r.createCell(0).setCellValue(roll);
    }

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    workbook.close();

    return out.toByteArray();
}
}