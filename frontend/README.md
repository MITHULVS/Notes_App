# Notes App - Frontend

A modern, responsive frontend for the Notes App built with vanilla HTML, CSS, and JavaScript.

## Features

- ✅ User Authentication (Login, Signup, Password Reset with OTP)
- ✅ Create Notes with File Upload
- ✅ View All Notes
- ✅ Delete Notes
- ✅ Responsive Design
- ✅ Modern UI/UX

## File Structure

```
frontend/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # All styles
├── js/
│   ├── main.js               # App logic and routing
│   └── api.js                # API calls to backend
└── README.md                 # This file
```

## Getting Started

### 1. Prerequisites

- Backend API running on `http://localhost:8000`
- Modern web browser (Chrome, Firefox, Edge, Safari)

### 2. Setup

1. **Navigate to frontend directory:**
   ```bash
   cd App/frontend
   ```

2. **Start a local server:**
   
   **Using Python 3:**
   ```bash
   python -m http.server 8080
   ```
   
   **Using Python 2:**
   ```bash
   python -m SimpleHTTPServer 8080
   ```
   
   **Using Node.js (if installed):**
   ```bash
   npx http-server -p 8080
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

## API Endpoints Used

### User Routes
- `POST /user/login` - User login
- `POST /user/signup` - User registration
- `POST /user/generate_otp` - Generate OTP for password reset
- `POST /user/verify_otp` - Verify OTP
- `PATCH /user/reset_password` - Reset password

### Note Routes
- `GET /note/get_notes` - Get all notes
- `GET /note/get_note/{note_id}` - Get single note
- `POST /note/add_note` - Create new note
- `DELETE /note/delete_note/{note_id}` - Delete note

## How to Use

### 1. Authentication
- **Sign Up**: Create a new account with email and password
- **Log In**: Enter your credentials
- **Forgot Password**: Use OTP verification to reset your password

### 2. Notes Management
- **Create Note**: Click "Add Note" button, select file and enter title
- **View Note**: Click "View" on any note card to see full content
- **Delete Note**: Click "Delete" to remove a note (confirmation required)

## Configuration

To change the backend API URL, edit `js/api.js`:

```javascript
class API {
    constructor() {
        this.baseUrl = 'http://localhost:8000';  // Change this URL
    }
}
```

## Features Overview

### Login Page
- Email and password input
- Links to signup and password reset
- Form validation

### Signup Page
- Email and password input
- Account creation
- Link back to login

### Password Reset
- Two-step process with OTP
- Email verification
- Password update

### Dashboard
- Sidebar with logout option
- Notes grid layout
- Quick actions (View, Delete)
- Add Note button

### Note Cards
- Note title display
- Preview of content (first 100 chars)
- Quick action buttons
- Hover effects

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Styling Highlights

- **Color Scheme**: Modern purple gradient
- **Responsive Grid**: Auto-adjusting note cards
- **Smooth Animations**: Hover effects and transitions
- **Modal Dialogs**: For creating and viewing notes
- **Mobile Optimized**: Fully responsive design

## Security Features

- Token-based authentication (JWT)
- Secure token storage in localStorage
- CORS enabled for local development
- XSS prevention with HTML escaping

## Troubleshooting

### Notes not loading?
- Check if backend is running on `http://localhost:8000`
- Verify token is valid in browser console
- Check browser console for errors

### File upload not working?
- Ensure backend has file upload handler
- Check file size limits
- Verify correct file formats

### CORS errors?
- Make sure backend has CORS enabled
- Check API base URL in `js/api.js`

## Development Tips

1. **Debug**: Open browser DevTools (F12) to see console logs
2. **Token**: Check `localStorage.getItem('token')` to verify login
3. **API Response**: Monitor Network tab to see API calls

## Future Enhancements

- Search and filter notes
- Edit existing notes
- Note categories/tags
- Dark mode toggle
- Note sharing
- Rich text editor
