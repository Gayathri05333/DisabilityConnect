package com.disabilityconnect.service;

import com.disabilityconnect.model.Place;
import com.disabilityconnect.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    public List<Place> getAll() {
        return placeRepository.findAll();
    }

    public Optional<Place> getById(Long id) {
        return placeRepository.findById(id);
    }

    public Place add(Place place) {
        return placeRepository.save(place);
    }

    public Place update(Long id, Place updated) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Place not found"));
        place.setName(updated.getName());
        place.setCategory(updated.getCategory());
        place.setAddress(updated.getAddress());
        place.setDescription(updated.getDescription());
        place.setImage(updated.getImage());
        place.setWheelchairAccess(updated.isWheelchairAccess());
        place.setPhone(updated.getPhone());
        place.setLatitude(updated.getLatitude());
        place.setLongitude(updated.getLongitude());
        return placeRepository.save(place);
    }

    public void delete(Long id) {
        placeRepository.deleteById(id);
    }
}
