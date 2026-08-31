package com.disabilityconnect.controller;

import com.disabilityconnect.dto.ApiResponse;
import com.disabilityconnect.model.EmergencyContact;
import com.disabilityconnect.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class EmergencyController {

    @Autowired
    private EmergencyService emergencyService;

    @GetMapping("/{userId}")
    public List<EmergencyContact> getByUser(@PathVariable Long userId) {
        return emergencyService.getByUser(userId);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestParam Long userId, @RequestBody EmergencyContact contact) {
        try {
            return ResponseEntity.ok(emergencyService.addContact(userId, contact));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        emergencyService.deleteContact(id);
        return ResponseEntity.ok(ApiResponse.ok("Contact deleted", null));
    }
}
