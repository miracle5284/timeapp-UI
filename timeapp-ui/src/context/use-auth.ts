import { useContext } from "react";
import { AuthContext } from "./user-context.ts";

/**
 * Custom hook to access authentication context.
 * Provides user object, login/logout functions, and loading state.
 */
export const useAuth = () => useContext(AuthContext);
