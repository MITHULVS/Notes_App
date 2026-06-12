class API {
    constructor() {
        this.baseUrl = 'http://localhost:8000';
    }

    async request(method, endpoint, data = null, token = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    async requestFormData(method, endpoint, formData, token) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    // User Endpoints
    async login(email, password) {
        return this.request('POST', '/user/login', { email, password });
    }

    async signup(email, password) {
        return this.request('POST', '/user/signup', { email, password });
    }

    async generateOtp(email) {
        return this.request('POST', '/user/generate_otp', { email });
    }

    async verifyOtp(email, otp) {
        return this.request('POST', '/user/verify_otp', { email, otp });
    }

    async resetPassword(email, password) {
        return this.request('PATCH', '/user/reset_password', { email, password });
    }

    // Note Endpoints
    async getNotes(token) {
        return this.request('GET', '/note/get_notes', null, token);
    }

    async getNote(noteId, token) {
        return this.request('GET', `/note/get_note/${noteId}`, null, token);
    }

    async createNote(title, file, token) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        return this.requestFormData('POST', '/note/add_note', formData, token);
    }

    async deleteNote(noteId, token) {
        return this.request('DELETE', `/note/delete_note/${noteId}`, null, token);
    }
}

const api = new API();
