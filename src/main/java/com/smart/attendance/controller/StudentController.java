        package com.smart.attendance.controller;

        import org.springframework.security.core.Authentication;
        import com.smart.attendance.dto.*;
        import com.smart.attendance.service.StudentService;
        import lombok.RequiredArgsConstructor;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;
        import org.springframework.web.multipart.MultipartFile;

        import java.io.IOException;
        import java.util.List;
        @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
        @RestController
        @RequestMapping("/api/student")
        @RequiredArgsConstructor
        public class StudentController {

        private final StudentService studentService;

        // ✅ Mark Attendance
        @PostMapping("/mark-attendance")
        public ResponseEntity<String> markAttendance(
                @RequestBody MarkAttendanceDTO dto,
                Authentication authentication) throws IOException {

                return ResponseEntity.ok(
                        studentService.markAttendance(dto, authentication)
                );
        }

        // ✅ Attendance History
        @GetMapping("/history")
        public ResponseEntity<List<AttendanceReportDTO>> getHistory(
                Authentication authentication) {

                return ResponseEntity.ok(
                        studentService.getAttendanceHistory(authentication)
                );
        }

        // ✅ Attendance Percentage
        @GetMapping("/percentage")
        public ResponseEntity<Double> getPercentage(
                Authentication authentication) {

                return ResponseEntity.ok(
                        studentService.getAttendancePercentage(authentication)
                );
        }

        // ✅ Get Profile
        @GetMapping("/profile")
        public ResponseEntity<StudentProfileDTO> getProfile(
                Authentication authentication) {

                return ResponseEntity.ok(
                        studentService.getProfile(authentication)
                );
        }

        // ✅ Dashboard
        @GetMapping("/dashboard")
        public ResponseEntity<StudentDashboardDTO> getDashboard(
                Authentication authentication) {

                return ResponseEntity.ok(
                        studentService.getDashboard(authentication)
                );
        }

        @PostMapping("/upload-photo")
        public ResponseEntity<String> uploadProfilePhoto(
                Authentication authentication,
                @RequestParam("file") MultipartFile file) throws IOException {

        return ResponseEntity.ok(
                studentService.uploadProfilePhoto(authentication, file)
        );
        }
        @PostMapping("/request-photo-change")
        public ResponseEntity<String> requestPhotoChange(Authentication authentication) {

        return ResponseEntity.ok(
                studentService.requestPhotoChange(authentication)
        );
        }
        @PutMapping("/update-profile")
        public ResponseEntity<String> updateProfile(
                Authentication authentication,
                @RequestBody StudentProfileUpdateDTO dto) {

        return ResponseEntity.ok(
                studentService.updateProfile(authentication, dto)
        );
        }
        }