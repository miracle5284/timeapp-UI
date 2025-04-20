import { useContext } from "react";
import { AuthContext } from "./auth/user-context.ts";

/**
 * Custom hook to access authentication context.
 * Provides user object, login/logout functions, and loading state.
 */
export const useAuth = () => useContext(AuthContext);
