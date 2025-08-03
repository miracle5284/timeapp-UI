import React, {useEffect, useState} from "react";
import API from "../../../lib/api.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, User } from "./user-context.ts";
import {setRefetch} from "../../../lib/api";
import {setupPush} from "../../../lib/push";

// Expected API response format for the user query
interface UserResponse {
    results: User[];
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    
    // Initialize tokens from localStorage
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
    const [user, setUser] = useState<User | null>();

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

    useEffect(() => {
        if (!isLoading && user_response) {
            setUser(user_response.results[0]); // set user from response
        }
    }, [isLoading, user_response]);

    // Handles login: saves tokens, sets auth header, and triggers user fetch
    const login = async (access: string, refresh: string) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        API.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        
        // Update tokens state to enable the query
        setAccessToken(access);
        setRefreshToken(refresh);
        
        // Immediately set user to loading state
        setUser(undefined);
        
        // Fetch user data directly to ensure immediate update
        try {
            const resp = await API.get("/users/");
            if (resp.data && resp.data.results && resp.data.results.length > 0) {
                setUser(resp.data.results[0]);
            }
        } catch (error) {
            console.error("Failed to fetch user data after login:", error);
        }
        
        // TODO: move push setup to settings page.
        setupPush();
    };

    // Handles logout: removes tokens and auth header
    const logout = async () => {
        try {
            await API.post("/users/logout", {});
        } catch (e) {
            console.error("Error logging out: ", e)
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAccessToken(null);
            setRefreshToken(null);
            delete API.defaults.headers.common["Authorization"];
            setUser(null); // Immediately clear user state
            
            // Invalidate all queries to clear cached data
            queryClient.invalidateQueries();
        }
    };

    useEffect(() => {
        setRefetch(refetch); // update refetch function on mount

    }, [refetch]);

    return (
        <AuthContext.Provider
            value={{
                user, login, logout,
                loading: isLoading,
                refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
