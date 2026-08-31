package com.disabilityconnect.config;

import com.disabilityconnect.model.*;
import com.disabilityconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds demo data on first startup so the project can be demonstrated
 * immediately: a demo admin account, a demo user account, sample
 * accessible places, and sample hospitals. Runs only if the tables are
 * empty, so it is safe to restart the app repeatedly.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PlaceRepository placeRepository;
    @Autowired private HospitalRepository hospitalRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedPlaces();
        seedHospitals();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@disabilityconnect.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setDisabilityType("Other");
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User demoUser = new User();
            demoUser.setName("Demo User");
            demoUser.setEmail("user@disabilityconnect.com");
            demoUser.setPassword(passwordEncoder.encode("password123"));
            demoUser.setPhone("9876543210");
            demoUser.setDisabilityType("Mobility");
            demoUser.setAccessibilityNeeds("Wheelchair accessible entrances and restrooms");
            demoUser.setRole("USER");
            userRepository.save(demoUser);

            System.out.println("Seeded demo accounts: admin@disabilityconnect.com / admin123, user@disabilityconnect.com / password123");
        }
    }

    private void seedPlaces() {
        if (placeRepository.count() == 0) {
            placeRepository.save(place("City Central Park", "Park",
                    "12 Park Avenue, City Center", "Large accessible park with paved paths, accessible restrooms, and sensory garden.",
                    "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600", true, "011-2345001", 28.6139, 77.2090));

            placeRepository.save(place("Greenfield College", "College",
                    "45 Education Road, Uptown", "Ramps at all entrances, accessible classrooms, and a dedicated support office.",
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600", true, "011-2345002", 28.6448, 77.2167));

            placeRepository.save(place("Horizon Shopping Mall", "Shopping Mall",
                    "78 Market Street, Downtown", "Elevators, accessible parking, and wheelchairs available at the help desk.",
                    "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600", true, "011-2345003", 28.6304, 77.2177));

            placeRepository.save(place("District Government Office", "Government Office",
                    "5 Civic Complex, Sector 9", "Ramp access, accessible restrooms, and priority queue for visitors with disabilities.",
                    "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=600", true, "011-2345004", 28.6129, 77.2295));

            placeRepository.save(place("Unity Community Center", "Government Office",
                    "22 Unity Lane, Riverside", "Fully accessible hall, hearing loop installed, sign-language interpreters on request.",
                    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600", true, "011-2345005", 28.5983, 77.2094));
        }
    }

    private void seedHospitals() {
        if (hospitalRepository.count() == 0) {
            hospitalRepository.save(hospital("City General Hospital", "1 Health Street, City Center",
                    "011-1002001", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600", true, 28.6141, 77.2100));

            hospitalRepository.save(hospital("Sunrise Multi-Specialty Hospital", "88 Wellness Road, Uptown",
                    "011-1002002", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600", true, 28.6455, 77.2172));

            hospitalRepository.save(hospital("Riverside Community Clinic", "14 River Lane, Riverside",
                    "011-1002003", "https://images.unsplash.com/photo-1580281657702-257584239a55?w=600", false, 28.5990, 77.2100));

            hospitalRepository.save(hospital("St. Mary's Care Hospital", "30 Market Street, Downtown",
                    "011-1002004", "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600", true, 28.6310, 77.2180));
        }
    }

    private Place place(String name, String category, String address, String description,
                         String image, boolean wheelchairAccess, String phone, double lat, double lng) {
        Place p = new Place();
        p.setName(name);
        p.setCategory(category);
        p.setAddress(address);
        p.setDescription(description);
        p.setImage(image);
        p.setWheelchairAccess(wheelchairAccess);
        p.setPhone(phone);
        p.setLatitude(lat);
        p.setLongitude(lng);
        return p;
    }

    private Hospital hospital(String name, String address, String phone, String image,
                               boolean emergencyAvailable, double lat, double lng) {
        Hospital h = new Hospital();
        h.setName(name);
        h.setAddress(address);
        h.setPhone(phone);
        h.setImage(image);
        h.setEmergencyAvailable(emergencyAvailable);
        h.setLatitude(lat);
        h.setLongitude(lng);
        return h;
    }
}
