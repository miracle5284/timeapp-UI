import { createContext } from "react";

/**
 * Represents the authenticated user object returned from the backend.
 */
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    account_id?: string;
    image?: string;
}

/**
 * The shape of the authentication context provided to components via AuthProvider.
 */
export interface AuthContextType {
    user: User | null | undefined; // null: logged out, undefined: loading
    login: (access: string, refresh: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    refetch: () => void;
}

// Create the context with a default fallback (will be overwritten by the Provider)
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
