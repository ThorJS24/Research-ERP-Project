// authService.js - Local JSON-based authentication service

class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // Default users factory (so we can reuse)
  getDefaultUsers() {
    return {
      users: [
        {
          id: 1,
          username: "deepak",
          email: "deepak@christuniversity.in",
          password: "deepak123",
          fullName: "Dr. Deepak",
          department: "Computer Science",
          role: "faculty",
          registeredAt: new Date().toISOString(),
          lastLogin: null,
          isActive: true
        },
        {
          id: 2,
          username: "john.doe",
          email: "john.doe@christuniversity.in",
          password: "password123",
          fullName: "Dr. John Doe",
          department: "Mathematics",
          role: "faculty",
          registeredAt: new Date().toISOString(),
          lastLogin: null,
          isActive: true
        }
      ],
      settings: {
        passwordMinLength: 6,
        allowedEmailDomains: ["christuniversity.in", "btech.christuniversity.in"],
        sessionTimeout: 3600000,
        maxLoginAttempts: 5
      }
    };
  }

  // Load users from localStorage (simulating JSON file)
  loadUsers() {
    const defaultUsers = this.getDefaultUsers();
    const stored = localStorage.getItem('users_db');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate shape
        if (!parsed || !Array.isArray(parsed.users)) {
          console.warn('users_db has invalid format — resetting to defaults');
          this.saveUsers(defaultUsers);
          return defaultUsers;
        }
        return parsed;
      } catch (error) {
        console.error('Error parsing users data:', error);
        // Reset to defaults to avoid app crash
        this.saveUsers(defaultUsers);
        return defaultUsers;
      }
    } else {
      // Initialize with default users
      this.saveUsers(defaultUsers);
      return defaultUsers;
    }
  }

  // Save users to localStorage
  saveUsers(usersData) {
    try {
      localStorage.setItem('users_db', JSON.stringify(usersData, null, 2));
      this.users = usersData;
    } catch (error) {
      console.error('Error saving users data:', error);
    }
  }

  // Load current user session
  loadCurrentUser() {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      try {
        return JSON.parse(currentUser);
      } catch (error) {
        console.error('Error parsing current user:', error);
        return null;
      }
    }
    return null;
  }

  // Save current user session
  saveCurrentUser(user) {
    try {
      const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('current_user', JSON.stringify(userSession));
      this.currentUser = userSession;
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // ✅ Robust Login function (trim + case-insensitive + trim stored password)
  async login(usernameOrEmail, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.users || !Array.isArray(this.users.users)) {
          reject({ success: false, message: "User database not found or corrupt" });
          return;
        }

        if (!usernameOrEmail || !password) {
          reject({ success: false, message: "Please provide username/email and password" });
          return;
        }

        const cleanInput = String(usernameOrEmail).trim().toLowerCase();
        const cleanPassword = String(password).trim();

        const user = this.users.users.find(u => {
          const uname = String(u.username || '').trim().toLowerCase();
          const uemail = String(u.email || '').trim().toLowerCase();
          const upwd = String(u.password || '').trim();
          return (uname === cleanInput || uemail === cleanInput) && upwd === cleanPassword && u.isActive;
        });

        if (user) {
          // Update last login
          user.lastLogin = new Date().toISOString();
          this.saveUsers(this.users);

          // Save user session
          this.saveCurrentUser(user);

          resolve({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullName: user.fullName,
              department: user.department,
              role: user.role
            },
            message: 'Login successful'
          });
        } else {
          reject({
            success: false,
            message: 'Invalid username/email or password'
          });
        }
      }, 250); // small simulated delay
    });
  }

  // Register function
  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, email, password, fullName, department } = userData;

        // Validation
        if (!username || !email || !password || !fullName) {
          reject({
            success: false,
            message: 'All required fields must be filled'
          });
          return;
        }

        if (password.length < this.users.settings.passwordMinLength) {
          reject({
            success: false,
            message: `Password must be at least ${this.users.settings.passwordMinLength} characters long`
          });
          return;
        }

        // Check if user already exists
        const existingUser = this.users.users.find(u => 
          u.username === username || u.email === email
        );

        if (existingUser) {
          reject({
            success: false,
            message: 'Username or email already exists'
          });
          return;
        }

        // Check email domain
        const emailDomain = email.split('@')[1];
        if (!this.users.settings.allowedEmailDomains.includes(emailDomain)) {
          reject({
            success: false,
            message: `Email must be from allowed domains: ${this.users.settings.allowedEmailDomains.join(', ')}`
          });
          return;
        }

        // Create new user
        const newUser = {
          id: Math.max(...this.users.users.map(u => u.id)) + 1,
          username,
          email,
          password,
          fullName,
          department: department || 'Not specified',
          role: 'faculty',
          registeredAt: new Date().toISOString(),
          lastLogin: null,
          isActive: true
        };

        // Add user to database
        this.users.users.push(newUser);
        this.saveUsers(this.users);

        resolve({
          success: true,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            department: newUser.department,
            role: newUser.role
          },
          message: 'Registration successful'
        });
      }, 500);
    });
  }

  // Logout function
  logout() {
    localStorage.removeItem('current_user');
    this.currentUser = null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return (this.users && Array.isArray(this.users.users)) ? this.users.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      department: user.department,
      role: user.role,
      registeredAt: user.registeredAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    })) : [];
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject({
            success: false,
            message: 'User not found'
          });
          return;
        }

        // Update user data (except sensitive fields)
        const allowedFields = ['fullName', 'department', 'email'];
        allowedFields.forEach(field => {
          if (updateData[field] !== undefined) {
            this.users.users[userIndex][field] = updateData[field];
          }
        });

        this.saveUsers(this.users);

        // Update current session if it's the same user
        if (this.currentUser && this.currentUser.id === userId) {
          this.saveCurrentUser(this.users.users[userIndex]);
        }

        resolve({
          success: true,
          message: 'Profile updated successfully',
          user: {
            id: this.users.users[userIndex].id,
            username: this.users.users[userIndex].username,
            email: this.users.users[userIndex].email,
            fullName: this.users.users[userIndex].fullName,
            department: this.users.users[userIndex].department,
            role: this.users.users[userIndex].role
          }
        });
      }, 300);
    });
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.users.find(u => u.id === userId);
        
        if (!user) {
          reject({
            success: false,
            message: 'User not found'
          });
          return;
        }

        if (String(user.password).trim() !== String(currentPassword).trim()) {
          reject({
            success: false,
            message: 'Current password is incorrect'
          });
          return;
        }

        if (newPassword.length < this.users.settings.passwordMinLength) {
          reject({
            success: false,
            message: `Password must be at least ${this.users.settings.passwordMinLength} characters long`
          });
          return;
        }

        user.password = newPassword;
        this.saveUsers(this.users);

        resolve({
          success: true,
          message: 'Password changed successfully'
        });
      }, 300);
    });
  }

  // Export users data (for backup)
  exportUsersData() {
    return JSON.stringify(this.users, null, 2);
  }

  // Import users data (for restore)
  importUsersData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.users && Array.isArray(data.users)) {
        this.saveUsers(data);
        return { success: true, message: 'Data imported successfully' };
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      return { success: false, message: 'Failed to import data: ' + error.message };
    }
  }

  // Reset users to defaults (useful if localStorage got corrupted)
  resetToDefaults() {
    const defaults = this.getDefaultUsers();
    this.saveUsers(defaults);
    try { localStorage.removeItem('current_user'); } catch (e) {}
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    return { success: true, message: 'Reset to default users' };
  }

  // Debug helper: returns current users object (inspect in console)
  dumpUsers() {
    return this.users;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
