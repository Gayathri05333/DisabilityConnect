package com.disabilityconnect.service;

import com.disabilityconnect.model.EmergencyContact;
import com.disabilityconnect.model.User;
import com.disabilityconnect.repository.EmergencyContactRepository;
import com.disabilityconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EmergencyContact> getByUser(Long userId) {
        return emergencyContactRepository.findByUserId(userId);
    }

    public EmergencyContact addContact(Long userId, EmergencyContact contact) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        contact.setUser(user);
        return emergencyContactRepository.save(contact);
    }

    public void deleteContact(Long id) {
        emergencyContactRepository.deleteById(id);
    }
}
