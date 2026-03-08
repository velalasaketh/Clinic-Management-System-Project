# 🏥 Advanced Clinic Management System

A **web-based Clinic Management System** built using **HTML, CSS, and JavaScript** that helps clinics manage patients, prescriptions, billing, and daily operations efficiently.

This system includes **three user roles**:
- 👨‍⚕️ Doctor
- 🧑‍💼 Receptionist
- 🛠 Admin

It is designed as a **single-page frontend application** with modular JavaScript architecture and a clean UI.

---

# 🚀 Features

## 🔐 Authentication System
- Role-based login
- Three roles supported:
  - Doctor
  - Receptionist
  - Admin

Demo credentials:

| Role | Username | Password |
|-----|-----|-----|
| Doctor | doctor | doctor123 |
| Receptionist | receptionist | recep123 |
| Admin | admin | admin123 |

---

# 👩‍💼 Receptionist Dashboard

Receptionist can:

- Register new patients
- Generate patient tokens
- View patient queue
- Generate bills
- Track daily revenue
- Monitor waiting & completed patients

### Patient Registration
Includes:
- Name
- Age
- Gender
- Phone
- Symptoms

Each patient gets a **unique token number**.

### Billing System
Receptionist can generate bills with:
- Consultation fee
- Medicine charges
- Total amount calculation

---

# 👨‍⚕️ Doctor Dashboard

Doctor can:

- View waiting patients
- See patient details
- Add prescriptions
- Add diagnosis
- Add medicines
- Add instructions
- Schedule follow-ups
- View patient history

Patient history includes:
- Symptoms
- Diagnosis
- Medicines
- Instructions
- Follow-up dates

---

# 🛠 Admin Dashboard

Admin can monitor:

- Total patients
- Total revenue
- All registered patients
- All generated bills

This provides a **complete overview of clinic operations**.

---

# 📊 System Statistics

The system automatically tracks:

- Total patients
- Waiting patients
- Completed consultations
- Total prescriptions
- Total revenue
- Total bills

---

# 🧠 Architecture

The application uses **modular JavaScript architecture**:

### 1️⃣ Logger Module
Tracks system activities such as:
- Login events
- Database operations
- Errors

### 2️⃣ Database Module
Handles in-memory data storage:

Stores:
- Patients
- Prescriptions
- Bills
- Appointments

Functions include:
- Add patient
- Generate token
- Add prescription
- Generate bill
- Fetch patient history
- Calculate revenue

### 3️⃣ Authentication Module
Handles:
- Login validation
- User sessions
- Logout

### 4️⃣ UI Module
Handles:
- Rendering dashboards
- Updating statistics
- Showing patient lists
- Displaying bills
- Managing screens

---

# 📁 Project Structure

```
clinic-management-system
│
├── index.html     # Main application UI
├── style.css      # Application styling
├── script.js      # Application logic
└── README.md      # Project documentation
```

---

# 🎨 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Font Awesome Icons

No external frameworks are required.

---

# ⚙️ How to Run

1. Download or clone the repository

```bash
git clone https://github.com/yourusername/clinic-management-system.git
```

2. Open the project folder

3. Run the application by opening:

```
index.html
```

in your browser.

No server or installation required.

---

# 💡 Sample Workflow

### Receptionist
1. Login
2. Register patient
3. Generate token
4. Generate bill

### Doctor
1. Login
2. Select patient
3. Add diagnosis
4. Add prescription

### Admin
1. Login
2. View reports
3. Monitor revenue

---

# 📱 Responsive Design

The UI is fully responsive and supports:

- Desktop
- Tablet
- Mobile devices

---

# 🔮 Future Improvements

Possible enhancements:

- Database integration (MongoDB / MySQL)
- Backend API (Node.js / Express)
- Patient appointment scheduling
- PDF bill generation
- Doctor availability system
- Multi-doctor support
- Patient login portal
- Cloud deployment

---

# 🧑‍💻 Author
Velala Saketh

Developed as a **frontend clinic management system** for learning and demonstration purposes.

---

# 📄 License

This project is open-source and available under the **MIT License**.

---

⭐ If you like this project, consider giving it a star!
