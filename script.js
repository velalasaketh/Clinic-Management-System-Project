// ============================================
// ADVANCED CLINIC MANAGEMENT SYSTEM
// ============================================

// Logger Module
const Logger = {
    logs: [],
    
    log(action, details) {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, action, details };
        this.logs.push(logEntry);
        console.log(`[${timestamp}] ${action}:`, details);
    },
    
    error(action, error) {
        const timestamp = new Date().toISOString();
        const errorEntry = { timestamp, action, error: error.message || error };
        this.logs.push(errorEntry);
        console.error(`[${timestamp}] ERROR - ${action}:`, error);
    },
    
    getLogs() {
        return this.logs;
    }
};

// Database Module
const Database = {
    patients: [],
    prescriptions: [],
    bills: [],
    appointments: [],
    
    init() {
        Logger.log('DATABASE_INIT', { message: 'Database initialized' });
        this.loadSampleData();
    },
    
    loadSampleData() {
        // Add 5 sample patients
        const samplePatients = [
            { name: 'Rajesh Kumar', age: '45', gender: 'Male', phone: '9876543210', symptoms: 'Fever and headache for 3 days' },
            { name: 'Priya Sharma', age: '32', gender: 'Female', phone: '9876543211', symptoms: 'Persistent cough and cold' },
            { name: 'Amit Patel', age: '28', gender: 'Male', phone: '9876543212', symptoms: 'Back pain and stiffness' },
            { name: 'Sneha Reddy', age: '35', gender: 'Female', phone: '9876543213', symptoms: 'Stomach ache and nausea' },
            { name: 'Vikram Singh', age: '50', gender: 'Male', phone: '9876543214', symptoms: 'High blood pressure symptoms' }
        ];
        
        samplePatients.forEach(p => this.addPatient(p));
    },
    
    generateToken() {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const token = `TKN${dateStr}${random}`;
        Logger.log('TOKEN_GENERATED', { token });
        return token;
    },
    
    addPatient(patientData) {
        try {
            const patient = {
                id: Date.now().toString(),
                token: this.generateToken(),
                ...patientData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                doctor: patientData.doctor || 'Not Assigned'
            };
            this.patients.push(patient);
            Logger.log('PATIENT_ADDED', { patient });
            return patient;
        } catch (error) {
            Logger.error('ADD_PATIENT_ERROR', error);
            throw error;
        }
    },
    
    getPatients() {
        return this.patients;
    },
    
    getPatientByToken(token) {
        return this.patients.find(p => p.token === token);
    },
    
    updatePatientStatus(token, status) {
        const patient = this.getPatientByToken(token);
        if (patient) {
            patient.status = status;
            Logger.log('PATIENT_STATUS_UPDATED', { token, status });
            return true;
        }
        return false;
    },
    
    addPrescription(prescriptionData) {
        try {
            const prescription = {
                id: Date.now().toString(),
                ...prescriptionData,
                createdAt: new Date().toISOString()
            };
            this.prescriptions.push(prescription);
            this.updatePatientStatus(prescriptionData.token, 'completed');
            Logger.log('PRESCRIPTION_ADDED', { prescription });
            return prescription;
        } catch (error) {
            Logger.error('ADD_PRESCRIPTION_ERROR', error);
            throw error;
        }
    },
    
    getPrescriptionsByToken(token) {
        return this.prescriptions.filter(p => p.token === token);
    },
    
    addBill(billData) {
        try {
            const bill = {
                id: Date.now().toString(),
                ...billData,
                createdAt: new Date().toISOString()
            };
            this.bills.push(bill);
            Logger.log('BILL_GENERATED', { bill });
            return bill;
        } catch (error) {
            Logger.error('ADD_BILL_ERROR', error);
            throw error;
        }
    },
    
    getBills() {
        return this.bills;
    },
    
    getTotalRevenue() {
        return this.bills.reduce((sum, bill) => sum + bill.total, 0);
    },
    
    getPatientHistory(searchTerm) {
        if (!searchTerm) {
            return this.patients.map(patient => ({
                patient,
                prescriptions: this.getPrescriptionsByToken(patient.token)
            }));
        }
        
        const filtered = this.patients.filter(p => 
            p.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return filtered.map(patient => ({
            patient,
            prescriptions: this.getPrescriptionsByToken(patient.token)
        }));
    },
    
    getStats() {
        return {
            totalPatients: this.patients.length,
            waitingPatients: this.patients.filter(p => p.status === 'pending').length,
            completedPatients: this.patients.filter(p => p.status === 'completed').length,
            todayRevenue: this.getTotalRevenue(),
            totalPrescriptions: this.prescriptions.length,
            totalBills: this.bills.length
        };
    }
};

// Authentication Module
const Auth = {
    currentUser: null,
    userType: null,
    
    credentials: {
        doctor: { username: 'doctor', password: 'doctor123' },
        receptionist: { username: 'receptionist', password: 'recep123' },
        admin: { username: 'admin', password: 'admin123' }
    },
    
    login(username, password, type) {
        try {
            const creds = this.credentials[type];
            if (creds && creds.username === username && creds.password === password) {
                this.currentUser = username;
                this.userType = type;
                Logger.log('USER_LOGIN', { username, type });
                return true;
            }
            Logger.log('LOGIN_FAILED', { username, type });
            return false;
        } catch (error) {
            Logger.error('LOGIN_ERROR', error);
            return false;
        }
    },
    
    logout() {
        Logger.log('USER_LOGOUT', { username: this.currentUser, type: this.userType });
        this.currentUser = null;
        this.userType = null;
    },
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
};

// UI Module
const UI = {
    currentTab: 'doctor',
    selectedPatient: null,
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },
    
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateTimeStr = now.toLocaleDateString('en-IN', options);
        
        ['recepDateTime', 'docDateTime', 'adminDateTime'].forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = dateTimeStr;
        });
    },
    
    updateStats() {
        const stats = Database.getStats();
        
        // Receptionist stats
        const elem = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        
        elem('totalPatients', stats.totalPatients);
        elem('waitingPatients', stats.waitingPatients);
        elem('completedPatients', stats.completedPatients);
        elem('todayRevenue', `₹${stats.todayRevenue}`);
        
        // Doctor stats
        elem('docWaiting', stats.waitingPatients);
        elem('docCompleted', stats.completedPatients);
        elem('docPrescriptions', stats.totalPrescriptions);
        elem('docAppointments', 0);
        
        // Admin stats
        elem('adminTotal', stats.totalPatients);
        elem('adminRevenue', `₹${stats.todayRevenue}`);
    },
    
    renderPatientQueue(filter = 'all') {
        const queue = document.getElementById('patientQueue');
        let patients = Database.getPatients();
        
        if (filter !== 'all') {
            patients = patients.filter(p => p.status === filter);
        }
        
        if (patients.length === 0) {
            queue.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i><br>No patients in queue</p>';
            return;
        }
        
        queue.innerHTML = patients.map(patient => `
            <div class="patient-item">
                <h4><i class="fas fa-user"></i> ${patient.name}</h4>
                <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                <p><i class="fas fa-phone"></i> ${patient.phone}</p>
                <p><i class="fas fa-notes-medical"></i> ${patient.symptoms}</p>
                <span class="token-badge"><i class="fas fa-ticket-alt"></i> ${patient.token}</span>
                <span class="status-badge status-${patient.status}">
                    <i class="fas fa-circle"></i> ${patient.status.toUpperCase()}
                </span>
            </div>
        `).join('');
        
        this.updateStats();
    },
    
    renderDoctorPatientList() {
        const list = document.getElementById('doctorPatientList');
        const patients = Database.getPatients().filter(p => p.status === 'pending');
        
        if (patients.length === 0) {
            list.innerHTML = '<p class="empty-state"><i class="fas fa-user-clock"></i><br>No waiting patients</p>';
            return;
        }
        
        list.innerHTML = patients.map(patient => `
            <div class="patient-item" onclick="selectPatient('${patient.token}', event)">
                <h4><i class="fas fa-user"></i> ${patient.name}</h4>
                <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                <p><i class="fas fa-phone"></i> ${patient.phone}</p>
                <p><i class="fas fa-notes-medical"></i> ${patient.symptoms}</p>
                <span class="token-badge"><i class="fas fa-ticket-alt"></i> ${patient.token}</span>
            </div>
        `).join('');
    },
    
    showPatientDetails(token) {
        const patient = Database.getPatientByToken(token);
        if (!patient) return;
        
        const details = document.getElementById('patientDetails');
        details.innerHTML = `
            <p><strong><i class="fas fa-ticket-alt"></i> Token:</strong> ${patient.token}</p>
            <p><strong><i class="fas fa-user"></i> Name:</strong> ${patient.name}</p>
            <p><strong><i class="fas fa-birthday-cake"></i> Age:</strong> ${patient.age}</p>
            <p><strong><i class="fas fa-venus-mars"></i> Gender:</strong> ${patient.gender}</p>
            <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${patient.phone}</p>
            <p><strong><i class="fas fa-notes-medical"></i> Symptoms:</strong> ${patient.symptoms}</p>
            <p><strong><i class="fas fa-clock"></i> Registration:</strong> ${new Date(patient.createdAt).toLocaleString('en-IN')}</p>
        `;
        
        document.getElementById('prescriptionToken').value = token;
    },
    
    renderHistory(searchTerm = '') {
        const display = document.getElementById('historyDisplay');
        const history = Database.getPatientHistory(searchTerm);
        
        if (history.length === 0) {
            display.innerHTML = '<p class="empty-state"><i class="fas fa-search"></i><br>No patient history found</p>';
            return;
        }
        
        display.innerHTML = history.map(({ patient, prescriptions }) => `
            <div class="history-item">
                <h4><i class="fas fa-user"></i> ${patient.name} - <span class="token-badge">${patient.token}</span></h4>
                <p><strong><i class="fas fa-calendar"></i> Date:</strong> ${new Date(patient.createdAt).toLocaleString('en-IN')}</p>
                <p><strong><i class="fas fa-notes-medical"></i> Symptoms:</strong> ${patient.symptoms}</p>
                ${prescriptions.length > 0 ? `
                    <p><strong><i class="fas fa-stethoscope"></i> Diagnosis:</strong> ${prescriptions[0].diagnosis}</p>
                    <p><strong><i class="fas fa-pills"></i> Medicines:</strong> ${prescriptions[0].medicines}</p>
                    <p><strong><i class="fas fa-comment-medical"></i> Instructions:</strong> ${prescriptions[0].instructions}</p>
                    ${prescriptions[0].followUp ? `<p><strong><i class="fas fa-calendar-alt"></i> Follow-up:</strong> ${prescriptions[0].followUp}</p>` : ''}
                ` : '<p><em><i class="fas fa-info-circle"></i> No prescription added yet</em></p>'}
            </div>
        `).join('');
    },
    
    renderBillsList() {
        const list = document.getElementById('billsList');
        const bills = Database.getBills();
        
        if (bills.length === 0) {
            list.innerHTML = '<p class="empty-state"><i class="fas fa-receipt"></i><br>No bills generated today</p>';
            return;
        }
        
        list.innerHTML = bills.map(bill => `
            <div class="history-item">
                <h4><i class="fas fa-receipt"></i> ${bill.patientName} - ${bill.token}</h4>
                <p><strong>Consultation:</strong> ₹${bill.consultationFee} | <strong>Medicine:</strong> ₹${bill.medicineCharges}</p>
                <p><strong><i class="fas fa-rupee-sign"></i> Total:</strong> <span style="font-size: 18px; color: #667eea; font-weight: 700;">₹${bill.total}</span></p>
                <p><strong><i class="fas fa-clock"></i> Generated:</strong> ${new Date(bill.createdAt).toLocaleString('en-IN')}</p>
            </div>
        `).join('');
    },
    
    renderAdminData() {
        const patientList = document.getElementById('adminPatientList');
        const billsList = document.getElementById('adminBillsList');
        
        const patients = Database.getPatients();
        const bills = Database.getBills();
        
        patientList.innerHTML = patients.length === 0 
            ? '<p class="empty-state">No patients</p>'
            : patients.map(p => `
                <div class="history-item">
                    <h4>${p.name} - ${p.token}</h4>
                    <p>Status: <span class="status-badge status-${p.status}">${p.status}</span></p>
                </div>
            `).join('');
        
        billsList.innerHTML = bills.length === 0
            ? '<p class="empty-state">No bills</p>'
            : bills.map(b => `
                <div class="history-item">
                    <h4>${b.patientName} - ₹${b.total}</h4>
                    <p>${new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
            `).join('');
    }
};

// ============================================
// EVENT HANDLERS
// ============================================

function switchTab(type) {
    UI.currentTab = type;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    Logger.log('TAB_SWITCHED', { type });
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (Auth.login(username, password, UI.currentTab)) {
        if (UI.currentTab === 'doctor') {
            UI.showScreen('doctorScreen');
            UI.renderDoctorPatientList();
            UI.renderHistory();
            UI.updateDateTime();
        } else if (UI.currentTab === 'admin') {
            UI.showScreen('adminScreen');
            UI.updateStats();
            UI.renderAdminData();
            UI.updateDateTime();
        } else {
            UI.showScreen('receptionistScreen');
            UI.renderPatientQueue();
            UI.renderBillsList();
            UI.updateDateTime();
        }
        
        document.getElementById('loginForm').reset();
        setInterval(() => UI.updateDateTime(), 60000);
    } else {
        alert('❌ Invalid credentials! Please try again.');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
        UI.showScreen('loginScreen');
        document.getElementById('loginForm').reset();
    }
}

function addPatient(event) {
    event.preventDefault();
    
    const patientData = {
        name: document.getElementById('patientName').value,
        age: document.getElementById('patientAge').value,
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        symptoms: document.getElementById('patientSymptoms').value
    };
    
    try {
        const patient = Database.addPatient(patientData);
        alert(`✅ Patient registered successfully!
        
Token: ${patient.token}
Name: ${patient.name}

Please share this token number with the patient.`);
        
        document.getElementById('addPatientForm').reset();
        UI.renderPatientQueue();
        UI.updateStats();
    } catch (error) {
        alert('❌ Error adding patient. Please try again.');
    }
}

function filterPatients(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    UI.renderPatientQueue(filter);
}

function generateBill(event) {
    event.preventDefault();
    
    const token = document.getElementById('billToken').value;
    const consultationFee = parseFloat(document.getElementById('consultationFee').value);
    const medicineCharges = parseFloat(document.getElementById('medicineCharges').value);
    
    const patient = Database.getPatientByToken(token);
    
    if (!patient) {
        alert('❌ Invalid token number!');
        return;
    }
    
    const total = consultationFee + medicineCharges;
    
    const billData = {
        token,
        patientName: patient.name,
        consultationFee,
        medicineCharges,
        total
    };
    
    try {
        Database.addBill(billData);
        
        const billDisplay = document.getElementById('billDisplay');
        billDisplay.innerHTML = `
            <div class="bill-card">
                <h4><i class="fas fa-receipt"></i> Bill Generated Successfully</h4>
                <div class="bill-row">
                    <span><i class="fas fa-user"></i> Patient Name:</span>
                    <span><strong>${billData.patientName}</strong></span>
                </div>
                <div class="bill-row">
                    <span><i class="fas fa-ticket-alt"></i> Token:</span>
                    <span><strong>${billData.token}</strong></span>
                </div>
                <div class="bill-row">
                    <span><i class="fas fa-user-md"></i> Consultation Fee:</span>
                    <span>₹${consultationFee}</span>
                </div>
                <div class="bill-row">
                    <span><i class="fas fa-pills"></i> Medicine Charges:</span>
                    <span>₹${medicineCharges}</span>
                </div>
                <div class="bill-row bill-total">
                    <span><i class="fas fa-rupee-sign"></i> Total Amount:</span>
                    <span>₹${total}</span>
                </div>
                <p style="text-align: center; margin-top: 15px; color: #6b7280;">
                    <i class="fas fa-clock"></i> Generated on ${new Date().toLocaleString('en-IN')}
                </p>
            </div>
        `;
        
        document.getElementById('billingForm').reset();
        UI.renderPatientQueue();
        UI.renderBillsList();
        UI.updateStats();
    } catch (error) {
        alert('❌ Error generating bill. Please try again.');
    }
}

function selectPatient(token, event) {
    UI.selectedPatient = token;
    UI.showPatientDetails(token);
    
    document.querySelectorAll('.patient-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function searchPatients() {
    const searchTerm = document.getElementById('searchPatient').value.toLowerCase();
    const patients = Database.getPatients().filter(p => 
        p.status === 'pending' && (
            p.name.toLowerCase().includes(searchTerm) ||
            p.token.toLowerCase().includes(searchTerm)
        )
    );
    
    const list = document.getElementById('doctorPatientList');
    if (patients.length === 0) {
        list.innerHTML = '<p class="empty-state">No patients found</p>';
        return;
    }
    
    list.innerHTML = patients.map(patient => `
        <div class="patient-item" onclick="selectPatient('${patient.token}', event)">
            <h4><i class="fas fa-user"></i> ${patient.name}</h4>
            <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
            <p><i class="fas fa-phone"></i> ${patient.phone}</p>
            <p><i class="fas fa-notes-medical"></i> ${patient.symptoms}</p>
            <span class="token-badge"><i class="fas fa-ticket-alt"></i> ${patient.token}</span>
        </div>
    `).join('');
}

function addPrescription(event) {
    event.preventDefault();
    
    const token = document.getElementById('prescriptionToken').value;
    
    if (!token) {
        alert('⚠️ Please select a patient first!');
        return;
    }
    
    const prescriptionData = {
        token,
        diagnosis: document.getElementById('diagnosis').value,
        medicines: document.getElementById('medicines').value,
        instructions: document.getElementById('instructions').value,
        followUp: document.getElementById('followUp').value
    };
    
    try {
        Database.addPrescription(prescriptionData);
        alert('✅ Prescription added successfully!');
        
        document.getElementById('prescriptionForm').reset();
        document.getElementById('prescriptionToken').value = '';
        document.getElementById('patientDetails').innerHTML = '<p class="empty-state"><i class="fas fa-hand-pointer"></i><br>Select a patient to view details</p>';
        
        UI.renderDoctorPatientList();
        UI.renderHistory();
        UI.updateStats();
    } catch (error) {
        alert('❌ Error adding prescription. Please try again.');
    }
}

function searchHistory() {
    const searchTerm = document.getElementById('searchHistory').value;
    UI.renderHistory(searchTerm);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    Database.init();
    UI.updateDateTime();
    Logger.log('APPLICATION_STARTED', { timestamp: new Date().toISOString() });
});