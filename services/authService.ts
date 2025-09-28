import { User, Role } from '../types';
import { LOCAL_STORAGE_KEYS, ADMIN_USERNAME } from '../constants';

class AuthService {
    private getUsers(): User[] {
        const users = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    }

    private saveUsers(users: User[]): void {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    initializeUsers(): void {
        const users = this.getUsers();
        if (users.length === 0) {
            this.createUser(ADMIN_USERNAME, 'admin', Role.ADMIN);
        }
    }

    login(username: string, password_provided: string): User | null {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password_provided);
        if (user) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            return user;
        }
        return null;
    }

    logout(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    }

    getCurrentUser(): User | null {
        const user = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    }

    getAllUsers(): User[] {
        return this.getUsers().map(({ password, ...user }) => user); // Exclude passwords
    }

    createUser(username: string, password_provided: string, role: Role): User | 'exists' {
        const users = this.getUsers();
        if (users.some(u => u.username === username)) {
            return 'exists';
        }
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            password: password_provided,
            role,
        };
        users.push(newUser);
        this.saveUsers(users);
        const { password, ...userToReturn } = newUser;
        return userToReturn;
    }

    deleteUser(userId: string): boolean {
        let users = this.getUsers();
        const initialLength = users.length;
        users = users.filter(u => u.id !== userId);
        if (users.length < initialLength) {
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    updateUserRole(userId: string, newRole: Role): boolean {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return false; // User not found
        }

        // Prevent changing the main admin's role
        if (users[userIndex].username === ADMIN_USERNAME) {
            console.warn("Attempted to change the primary admin's role.");
            return false;
        }

        users[userIndex].role = newRole;
        this.saveUsers(users);
        return true;
    }
}

export const authService = new AuthService();