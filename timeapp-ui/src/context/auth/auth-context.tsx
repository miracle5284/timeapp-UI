import React, {useEffect, useState} from "react";
import API from "../../../lib/api.ts";
import { useQuery } from "@tanstack/react-query";
import { AuthContext, User } from "./user-context.ts";
import {setRefetch} from "../../../lib/api";
import {setupPush} from "../../../lib/push";

// Expected API response format for the user query
interface UserResponse {
    results: User[];
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize tokens from localStorage
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

    // Query to fetch authenticated user data
    const { data: user_response, refetch, isLoading } = useQuery<UserResponse>({
        queryKey: ["user"],
        queryFn: async () => {
            const resp = await API.get("/users/");
            return resp.data;
        },
        enabled: !!accessToken && !!refreshToken, // only run if both tokens exist
        retry: false, // do not retry on failure
    });

    // Handles login: saves tokens, sets auth header, and triggers user fetch
    const login = (access: string, refresh: string) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
        API.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        refetch(); // fetch user data after setting token

        // TODO: move push setup to settings page.
        setupPush();
    };

    // Handles logout: removes tokens and auth header
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
        delete API.defaults.headers.common["Authorization"];
    };

    useEffect(() => {
        setRefetch(refetch); // update refetch function on mount

    }, [refetch]);

    return (
        <AuthContext.Provider
            value={{
                user: user_response?.results[0], // expose the first user object
                login,
                logout,
                loading: isLoading,
                refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
