let users = {}; // Store all users
let currentUser = null; // Currently logged in user

// Load users from browser storage when page loads
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
    }
}

// Save users to browser storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Initialize - load existing users
loadUsers();

// When page loads, set up the forms
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if we're on Sign in.html page and have URL parameters (from signup)
    if (window.location.pathname.includes('Sign in.html') && window.location.search) {
        handleSignupFromURL();
    }
    
    // Sign Up Form (on Sign up.html page)
    const signupForm = document.querySelector('form[action*="/signup"]');
    if (signupForm) {
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Check if user already exists
            if (users[email]) {
                alert('Email already registered!');
                return;
            }
            
            // Check terms
            if (!terms) {
                alert('Please accept the terms!');
                return;
            }
            
            // Create new user
            users[email] = {
                name: name,
                email: email,
                password: password
            };
            console.log(users);
            saveUsers(); // Save to browser storage
            console.log(users);
            alert('Account created! You can now login.');
            window.location.href = 'log in.html';
        };
    }
    
    // Login Form (on log in.html page)
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Check if user exists and password is correct
            if (users[email] && users[email].password === password) {
                currentUser = users[email];
                saveUsers(); // Save current user to storage
                alert('Welcome ' + currentUser.name + '!');
                window.location.href = 'index.html'; // <-- Redirect to main page
            } else {
                alert('Wrong email or password!');
            }
        };
    }
});

// Handle signup data from URL parameters
function handleSignupFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const name = urlParams.get('fullname');
    const email = urlParams.get('email');
    const password = urlParams.get('password');
    const confirmPassword = urlParams.get('confirm-password');
    const terms = urlParams.get('terms');
    
    // Check if we have all required data
    if (!name || !email || !password || !confirmPassword || !terms) {
        alert('Missing signup information!');
        window.location.href = 'Sign up.html';
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        window.location.href = 'Sign up.html';
        return;
    }
    
    // Check if user already exists
    if (users[email]) {
        alert('Email already registered!');
        window.location.href = 'log in.html';
        return;
    }
    
    // Create new user
    users[email] = {
        name: name,
        email: email,
        password: password
    };
    
    saveUsers(); // Save to browser storage
    
    alert('Account created successfully! You can now login.');
    
    // Clear the URL and redirect to clean login page
    window.location.href = 'log in.html';
}

// Helper functions you can use anywhere
function getCurrentUser() {
    return currentUser;
}

function getAllUsers() {
    return users;
}

function logout() {
    currentUser = null;
    saveUsers(); // Clear current user from storage
    alert('Logged out!');
    window.location.href = 'log in.html';
}