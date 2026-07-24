package com.smart.attendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.smart.attendance.entity.AttendanceSession;
import com.smart.attendance.entity.Faculty;
import com.smart.attendance.entity.User;

import java.util.Optional;
import java.util.List;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    Optional<AttendanceSession> findByQrToken(String qrToken);

    List<AttendanceSession> findByClassEmailAndActiveTrue(String classEmail);

    List<AttendanceSession> findByCreatedById(Long facultyId);

    Optional<AttendanceSession> findByQrTokenAndActiveTrue(String qrToken);
 boolean existsByCreatedByAndActiveTrue(Faculty createdBy); 
 Optional<AttendanceSession> findByCreatedByAndActiveTrue(Faculty faculty);
 boolean existsByClassEmailAndPeriodAndActiveTrue(String classEmail, String period);

Optional<AttendanceSession> findBySessionNumber(Long sessionNumber);
@Query("SELECT MAX(s.sessionNumber) FROM AttendanceSession s")
    Long findLastSessionNumber();
Optional<AttendanceSession> findTopByClassEmailAndPeriodAndActiveTrue(
        String classEmail,
        String period);
}