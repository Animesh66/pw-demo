/**
 * Authentication Configuration
 * Stores paths and configuration for authentication state management
 */

export const AuthConfig = {
    /**
     * Path to the authentication state JSON file
     * This file stores cookies and localStorage after login
     */
    STORAGE_STATE_PATH: 'playwright/.auth/user.json',

    /**
     * Directory for authentication files
     */
    AUTH_DIR: 'playwright/.auth',
};
