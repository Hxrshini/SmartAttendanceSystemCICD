package com.smart.attendance.service.impl;

import com.smart.attendance.service.FaceVerificationService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class FaceVerificationServiceImpl implements FaceVerificationService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean verifyFace(String profilePhotoPath, String selfieBase64) {

        String url = "http://localhost:5000/verify-face";

        Map<String, Object> request = new HashMap<>();

        request.put("profilePhotoPath", profilePhotoPath);
        request.put("selfie", selfieBase64);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, request, Map.class);

        return (Boolean) response.getBody().get("match");
    }
}