# DisabilityConnect

A mini full-stack project that helps people with disabilities find accessibility
information and get emergency support — built with a plain HTML/CSS/JS + Bootstrap 5
frontend and a Java 17 + Spring Boot + MySQL backend.

---

## 1. Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | HTML5, CSS3, JavaScript, Bootstrap 5, Font Awesome |
| Backend   | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Maven |
| Database  | MySQL |
| Voice     | Browser Web Speech API (no Python, no external service) |

---

## 2. Project Structure

```text
DisabilityConnect/
├── backend/                     Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/disabilityconnect/
│       ├── DisabilityConnectApplication.java
│       ├── config/              CORS, password-hashing, demo data seeder
│       ├── controller/          REST controllers
│       ├── service/             Business logic
│       ├── repository/          Spring Data JPA repositories
│       ├── model/                JPA entities
│       └── dto/                  Request/response DTOs
│   └── src/main/resources/application.properties
│
├── frontend/                    Static HTML/CSS/JS site
│   ├── index.html, login.html, register.html, dashboard.html,
│   │   profile.html, places.html, hospitals.html, emergency.html,
│   │   contacts.html, admin.html
│   ├── css/  (style.css, login.css, dashboard.css)
│   ├── js/   (script.js, login.js, register.js, profile.js, places.js,
│   │          hospitals.js, emergency.js, contacts.js, admin.js)
│   └── images/  (README.md with placeholder notes; hosted image URLs used by default)
│
├── database/
│   └── disability_connect.sql   Reference schema (auto-created by Spring Boot anyway)
│
└── README.md                    This file
```

---

## 3. Setup Instructions

### Step 1 — Install prerequisites
- Java JDK 17+
- Maven 3.8+
- MySQL 8+ (running locally)
- A code editor: VS Code or IntelliJ IDEA
- Any static file server / browser to open the frontend (Live Server extension works great)

### Step 2 — Create the MySQL database
You don't have to run any SQL by hand. The backend is configured with
`createDatabaseIfNotExist=true` and `spring.jpa.hibernate.ddl-auto=update`, so it
will create the `disability_connect` database and all tables automatically on
first run. `database/disability_connect.sql` is provided only as a reference if
you'd rather create the schema manually.

Just make sure MySQL is running and update the credentials in
`backend/src/main/resources/application.properties` if your MySQL username/password
aren't the default `root` / `root`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/disability_connect?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### Step 3 — Run the Spring Boot backend
```bash
cd backend
mvn spring-boot:run
```
The API starts at **http://localhost:8080/api**.

On first startup, `DataSeeder.java` automatically inserts:
- A demo **admin** account
- A demo **user** account
- 5 sample accessible places and 4 sample hospitals

(See demo credentials below.)

### Step 4 — Open the frontend
The frontend is plain static HTML/CSS/JS — no build step required.

- Easiest: open `frontend/index.html` directly in a browser, **or**
- Recommended: use the VS Code "Live Server" extension on the `frontend/` folder
  (avoids any browser file:// quirks with the Geolocation/Speech APIs, which
  generally need `http://` or `https://` to work reliably).

The frontend calls the backend at `http://localhost:8080/api` — this is set at
the top of `frontend/js/script.js` (`API_BASE`) if you ever need to change it.

---

## 4. Demo Login Credentials

| Role  | Email                          | Password     |
|-------|---------------------------------|--------------|
| User  | user@disabilityconnect.com      | password123  |
| Admin | admin@disabilityconnect.com     | admin123     |

Admin login is on `admin.html` (linked from the login page).

---

## 5. API Endpoint List

```text
POST   /api/auth/register        Register a new user
POST   /api/auth/login           User login

GET    /api/users/{id}           Get user profile
PUT    /api/users/{id}           Update user profile

GET    /api/places               Get all accessible places
GET    /api/places/{id}          Get a place by id
POST   /api/places               Add a place (admin)
PUT    /api/places/{id}          Update a place (admin)
DELETE /api/places/{id}          Delete a place (admin)

GET    /api/hospitals            Get all hospitals
GET    /api/hospitals/{id}       Get a hospital by id
POST   /api/hospitals            Add a hospital
PUT    /api/hospitals/{id}       Update a hospital
DELETE /api/hospitals/{id}       Delete a hospital

GET    /api/contacts/{userId}    Get emergency contacts for a user
POST   /api/contacts?userId=..   Add an emergency contact
DELETE /api/contacts/{id}        Delete an emergency contact

POST   /api/admin/login          Admin login
GET    /api/admin/users          List all registered users (admin)
```

---

## 6. Project Features

- User registration & login (with disability type)
- Dashboard with quick-access cards
- Editable disability profile with accessibility needs
- Accessible places finder with category filter (Hospital, Park, College,
  Shopping Mall, Government Office) and wheelchair-access badge
- Nearby hospitals list with a "Get Directions" button (opens Google Maps)
- Emergency SOS: gets your live location via the browser Geolocation API,
  displays it, shows your saved emergency contacts, and lets you share your
  location link
- Emergency contact management (add / view / delete)
- Simple voice assistant (Web Speech API) — try the mic button and say things
  like "find hospitals", "open my profile", or "emergency"
- Admin dashboard: view all registered users, and full CRUD on accessible places
- Passwords hashed with BCrypt and never returned in API responses
- Responsive Bootstrap 5 UI with accessibility-friendly design (large buttons,
  good contrast, alt text, keyboard-friendly navigation, ARIA labels, skip links)

---

## 7. Verification Checklist

- [x] MySQL connection works (auto-creates `disability_connect` DB)
- [x] Spring Boot starts successfully (`mvn spring-boot:run`)
- [x] Registration works (`register.html` → `/api/auth/register`)
- [x] Login works (`login.html` → `/api/auth/login`)
- [x] Dashboard opens after login
- [x] Profile view/update works (`/api/users/{id}`)
- [x] Places CRUD works (`/api/places` — public read, admin write)
- [x] Hospitals display with directions link (`/api/hospitals`)
- [x] Emergency SOS works (Geolocation API + saved contacts)
- [x] Emergency contacts work (`/api/contacts`)
- [x] Admin functions work (login, view users, manage places)
- [x] Frontend communicates with backend (all API URLs match Spring Boot endpoints)

---

## 8. Future Enhancements

- JWT-based authentication and role-based route protection
- Real SMS/WhatsApp integration for SOS alerts (e.g. Twilio) instead of a share link
- Live map view (Google Maps / OpenStreetMap embed) instead of external links
- Pagination and search for the places/hospitals lists
- File upload for profile pictures and place images instead of URLs
- Automated tests (JUnit for backend, Cypress/Playwright for frontend)

---

## 9. Notes

- This is intentionally kept at **mini-project scope** — no Python, no
  microservices, no Docker/Kubernetes, no complex SMS gateway, no ML — exactly
  as scoped in the project brief.
- Sample images use hosted Unsplash URLs so the UI looks complete immediately;
  see `frontend/images/README.md` if you'd like to swap in local image files.
