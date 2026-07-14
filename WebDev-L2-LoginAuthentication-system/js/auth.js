/* ==========================================================================
   AuthSystem Modular Authentication Model
   Oasis Infobyte Internship - Login Authentication System
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Cryptographical SHA-256 Digest Hasher (Browser Native SubtleCrypto)
// --------------------------------------------------------------------------
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert Buffer to Hexadecimal string representation
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --------------------------------------------------------------------------
// 2. Database Fetch & Save Helpers
// --------------------------------------------------------------------------
function getUsers() {
    try {
        const usersStr = localStorage.getItem('auth_users');
        return usersStr ? JSON.parse(usersStr) : [];
    } catch (e) {
        console.error('Error fetching users from database: ', e);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('auth_users', JSON.stringify(users));
}

// --------------------------------------------------------------------------
// 3. Registration Handler
// --------------------------------------------------------------------------
export async function registerUser(name, email, password) {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const exists = users.some(u => u.email === normalizedEmail);
    if (exists) {
        throw new Error('This email address is already registered.');
    }

    // Hash the password asynchronously
    const passwordHash = await hashPassword(password);

    const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        bio: '',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    return true;
}

// --------------------------------------------------------------------------
// 4. Login & Session Management
// --------------------------------------------------------------------------
export async function loginUser(email, password, rememberMe) {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();

    const user = users.find(u => u.email === normalizedEmail);
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    // Verify password hash match
    const currentHash = await hashPassword(password);
    if (user.passwordHash !== currentHash) {
        throw new Error('Invalid email or password.');
    }

    // Generate random secure token
    const token = 'token_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const session = {
        email: user.email,
        name: user.name,
        token,
        remember: rememberMe
    };

    // Store session depending on 'Remember Me' choice
    if (rememberMe) {
        localStorage.setItem('auth_session', JSON.stringify(session));
        sessionStorage.removeItem('auth_session'); // Clean session storage to avoid confusion
    } else {
        sessionStorage.setItem('auth_session', JSON.stringify(session));
        localStorage.removeItem('auth_session');
    }

    return session;
}

export function logoutUser() {
    localStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_session');
    window.location.replace('login.html');
}

export function getCurrentSession() {
    const localSession = localStorage.getItem('auth_session');
    const sessionSession = sessionStorage.getItem('auth_session');
    
    if (localSession) return JSON.parse(localSession);
    if (sessionSession) return JSON.parse(sessionSession);
    
    return null;
}

// Get database record for currently authenticated user
export function getAuthenticatedUserRecord() {
    const session = getCurrentSession();
    if (!session) return null;

    const users = getUsers();
    return users.find(u => u.email === session.email) || null;
}

// --------------------------------------------------------------------------
// 5. Profile & Credentials Update Management
// --------------------------------------------------------------------------
export function updateProfileInfo(name, bio) {
    const session = getCurrentSession();
    if (!session) throw new Error('Unauthenticated user request.');

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === session.email);

    if (userIndex === -1) throw new Error('User record not found.');

    // Update fields
    users[userIndex].name = name.trim();
    users[userIndex].bio = bio.trim();
    saveUsers(users);

    // Sync current session memory to reflect new name changes
    session.name = users[userIndex].name;
    if (session.remember) {
        localStorage.setItem('auth_session', JSON.stringify(session));
    } else {
        sessionStorage.setItem('auth_session', JSON.stringify(session));
    }

    return users[userIndex];
}

export async function updatePassword(oldPassword, newPassword) {
    const session = getCurrentSession();
    if (!session) throw new Error('Unauthenticated user request.');

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === session.email);

    if (userIndex === -1) throw new Error('User record not found.');

    // Verify current password hash
    const oldHash = await hashPassword(oldPassword);
    if (users[userIndex].passwordHash !== oldHash) {
        throw new Error('Current password is incorrect.');
    }

    // Hash and save new password
    const newHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newHash;
    saveUsers(users);
    return true;
}
