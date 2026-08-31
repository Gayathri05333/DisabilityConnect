package com.disabilityconnect.controller;

import com.disabilityconnect.dto.ApiResponse;
import com.disabilityconnect.model.Hospital;
import com.disabilityconnect.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping
    public List<Hospital> getAll() {
        return hospitalService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return hospitalService.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Hospital add(@RequestBody Hospital hospital) {
        return hospitalService.add(hospital);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Hospital hospital) {
        try {
            return ResponseEntity.ok(hospitalService.update(id, hospital));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        hospitalService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hospital deleted", null));
    }
}
