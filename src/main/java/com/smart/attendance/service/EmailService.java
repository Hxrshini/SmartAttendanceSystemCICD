package com.smart.attendance.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otp);

}