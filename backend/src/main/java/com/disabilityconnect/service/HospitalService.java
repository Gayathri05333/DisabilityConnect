package com.disabilityconnect.service;

import com.disabilityconnect.model.Hospital;
import com.disabilityconnect.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getAll() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> getById(Long id) {
        return hospitalRepository.findById(id);
    }

    public Hospital add(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital update(Long id, Hospital updated) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        hospital.setName(updated.getName());
        hospital.setAddress(updated.getAddress());
        hospital.setPhone(updated.getPhone());
        hospital.setImage(updated.getImage());
        hospital.setEmergencyAvailable(updated.isEmergencyAvailable());
        hospital.setLatitude(updated.getLatitude());
        hospital.setLongitude(updated.getLongitude());
        return hospitalRepository.save(hospital);
    }

    public void delete(Long id) {
        hospitalRepository.deleteById(id);
    }
}
