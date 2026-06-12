class App {
    constructor() {
        this.currentPage = 'login';
        this.user = null;
        this.token = localStorage.getItem('token');
        this.apiUrl = 'http://localhost:8000';

        if (this.token) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        this.currentPage = 'login';
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Notes App</h1>
                    <div id="alert"></div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit" class="btn-primary auth-button">Login</button>
                    </form>
                    <div class="auth-link">
                        Don't have an account? <a href="#" onclick="app.showSignup()">Signup</a>
                    </div>
                    <div class="auth-link">
                        Forgot password? <a href="#" onclick="app.showForgotPassword()">Reset</a>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    showSignup() {
        this.currentPage = 'signup';
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Create Account</h1>
                    <div id="alert"></div>
                    <form id="signupForm">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="name" required>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" required>
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" required>
                        </div>

                        <button type="submit" class="btn-primary auth-button">
                            Signup
                        </button>
                    </form>
                    <div class="auth-link">
                        Already have an account? <a href="#" onclick="app.showLogin()">Login</a>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
    }

    showForgotPassword() {
        this.currentPage = 'forgot-password';
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Reset Password</h1>
                    <div id="alert"></div>
                    <div id="step1">
                        <form id="generateOtpForm">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="email" required>
                            </div>
                            <button type="submit" class="btn-primary auth-button">Generate OTP</button>
                        </form>
                        <div class="auth-link">
                            <a href="#" onclick="app.showLogin()">Back to Login</a>
                        </div>
                    </div>
                    <div id="step2" style="display:none;">
                        <form id="resetPasswordForm">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="resetEmail" required>
                            </div>
                            <div class="form-group">
                                <label>OTP</label>
                                <input type="text" id="otp" required>
                            </div>
                            <div class="form-group">
                                <label>New Password</label>
                                <input type="password" id="newPassword" required>
                            </div>
                            <button type="submit" class="btn-primary auth-button">Reset Password</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('generateOtpForm').addEventListener('submit', (e) => this.handleGenerateOtp(e));
        document.getElementById('resetPasswordForm').addEventListener('submit', (e) => this.handleResetPassword(e));
    }

    showDashboard() {
        this.currentPage = 'dashboard';
        document.getElementById('app').innerHTML = `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Menu</h2>
                    <ul class="sidebar-menu">
                        <li><button onclick="app.loadNotes()">My Notes</button></li>
                    </ul>
                    <button class="logout-btn" onclick="app.logout()">Logout</button>
                </aside>
                <main class="main-content">
                    <div id="alert"></div>
                    <div id="content"></div>
                </main>
            </div>
            <div id="noteModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">View Note</h2>
                        <button class="close-btn" onclick="app.closeModal()">&times;</button>
                    </div>
                    <div id="modalBody"></div>
                </div>
            </div>
        `;
        this.loadNotes();
    }

    async loadNotes() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="notes-header">
                <h1>My Notes</h1>
                <button class="btn-primary" onclick="app.showCreateNoteModal()">+ Add Note</button>
            </div>
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading notes...</p>
            </div>
        `;

        try {
            const notes = await api.getNotes(this.token);
            this.renderNotes(notes);
        } catch (error) {
            this.showAlert('Error loading notes', 'error');
        }
    }

    renderNotes(notes) {
        const content = document.getElementById('content');
        let html = `
            <div class="notes-header">
                <h1>My Notes</h1>
                <button class="btn-primary" onclick="app.showCreateNoteModal()">+ Add Note</button>
            </div>
        `;

        if (notes.length === 0) {
            html += '<p style="text-align: center; color: var(--text-secondary);">No notes yet. Create one!</p>';
        } else {
            html += '<div class="notes-grid">';
            notes.forEach(note => {
                html += `
                    <div class="note-card">
                        <h3>${this.escapeHtml(note.title)}</h3>
                        <p>${this.escapeHtml(note.content.substring(0, 100))}</p>
                        <div class="note-actions">
                            <button class="btn-primary" onclick="app.viewNote(${note.id})">View</button>
                            <button class="btn-danger" onclick="app.deleteNote(${note.id})">Delete</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        content.innerHTML = html;
    }

    showCreateNoteModal() {
        document.getElementById('modalTitle').textContent = 'Create Note';
        document.getElementById('modalBody').innerHTML = `
            <form id="createNoteForm">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="noteTitle" required>
                </div>
                <div class="form-group">
                    <label>Upload Note File</label>
                    <input type="file" id="noteFile" accept=".txt,.pdf,.doc,.docx" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Create Note</button>
            </form>
        `;
        document.getElementById('createNoteForm').addEventListener('submit', (e) => this.handleCreateNote(e));
        document.getElementById('noteModal').classList.add('active');
    }

    async viewNote(noteId) {
        try {
            const note = await api.getNote(noteId, this.token);
            document.getElementById('modalTitle').textContent = 'View Note';
            document.getElementById('modalBody').innerHTML = `
                <h3>${this.escapeHtml(note.title)}</h3>
                <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 20px;">
                    ${new Date(note.path).toLocaleString()}
                </p>
                <div style="background: var(--bg-color); padding: 15px; border-radius: 6px; max-height: 400px; overflow-y: auto;">
                    <p>${this.escapeHtml(note.content)}</p>
                </div>
            `;
            document.getElementById('noteModal').classList.add('active');
        } catch (error) {
            this.showAlert('Error loading note', 'error');
        }
    }

    async handleCreateNote(e) {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const file = document.getElementById('noteFile').files[0];

        if (!title || !file) {
            this.showAlert('Please fill all fields', 'error');
            return;
        }

        try {
            await api.createNote(title, file, this.token);
            this.closeModal();
            this.showAlert('Note created successfully', 'success');
            this.loadNotes();
        } catch (error) {
            this.showAlert(error.message || 'Error creating note', 'error');
        }
    }

    async deleteNote(noteId) {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.deleteNote(noteId, this.token);
            this.showAlert('Note deleted successfully', 'success');
            this.loadNotes();
        } catch (error) {
            this.showAlert('Error deleting note', 'error');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await api.login(email, password);
            this.token = response.token;
            localStorage.setItem('token', this.token);
            this.showDashboard();
            this.showAlert('Login successful', 'success');
        } catch (error) {
            this.showAlert(error.message || 'Login failed', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await api.signup(name, email, password);
            this.showAlert('Signup successful! Please login', 'success');
            setTimeout(() => this.showLogin(), 1500);
        } catch (error) {
            this.showAlert(error.message || 'Signup failed', 'error');
        }
    }

    async handleGenerateOtp(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            await api.generateOtp(email);
            this.showAlert('OTP sent to your email', 'success');
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('resetEmail').value = email;
        } catch (error) {
            this.showAlert(error.message || 'Error generating OTP', 'error');
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const otp = document.getElementById('otp').value;
        const newPassword = document.getElementById('newPassword').value;

        try {
            await api.verifyOtp(email, otp);
            await api.resetPassword(email, newPassword);
            this.showAlert('Password reset successful! Please login', 'success');
            setTimeout(() => this.showLogin(), 1500);
        } catch (error) {
            this.showAlert(error.message || 'Error resetting password', 'error');
        }
    }

    closeModal() {
        document.getElementById('noteModal').classList.remove('active');
    }

    logout() {
        localStorage.removeItem('token');
        this.token = null;
        this.showLogin();
        this.showAlert('Logged out successfully', 'success');
    }

    showAlert(message, type = 'info') {
        const alertEl = document.getElementById('alert');
        if (!alertEl) return;

        alertEl.className = `alert alert-${type} active`;
        alertEl.textContent = message;
        setTimeout(() => alertEl.classList.remove('active'), 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const app = new App();
