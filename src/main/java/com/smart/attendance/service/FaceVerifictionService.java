package com.smart.attendance.service;

public interface FaceVerifictionService {

    boolean verifyFace(String profilePhotoPath, String capturedImageBase64);

}