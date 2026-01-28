'use client';

// Manages the secure storage and retrieval of access credentials
// Explicit logic as requested - no hidden libraries

const KEY_TOKEN = 'access_pass_v1';
const KEY_USER = 'user_identity_v1';

export const Vault = {
    storeIdentity(token: string, user: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(KEY_TOKEN, token);
            localStorage.setItem(KEY_USER, JSON.stringify(user));
        }
    },

    retrievePass() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(KEY_TOKEN);
        }
        return null;
    },

    retrieveIdentity() {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem(KEY_USER);
            return raw ? JSON.parse(raw) : null;
        }
        return null;
    },

    wipe() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(KEY_TOKEN);
            localStorage.removeItem(KEY_USER);
        }
    },

    isAuthenticated() {
        return !!this.retrievePass();
    }
};
