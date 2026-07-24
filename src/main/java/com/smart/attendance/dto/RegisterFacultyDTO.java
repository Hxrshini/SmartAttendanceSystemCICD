package com.smart.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class RegisterFacultyDTO {
@Email(message="Invalid email")
@NotBlank(message="Email required")
private String email;
    private String name;
    private String department;
    private boolean tutor;
    private String password;      // ✅ ADD THIS
    private String secretCode;
}