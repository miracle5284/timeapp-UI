import { useAuth } from "../context/use-auth.ts";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Dropdown menu for authenticated users.
 * Displays user's avatar and username, and allows logout or profile access.
 */
export const Authenticated = () => {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Optionally handle unauthenticated edge case
    if (!user) return null;

    return (
        <div
            ref={dropdownRef}
            className="flex justify-center space-x-6 items-center relative"
        >
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={showMenu}
                aria-label="User menu toggle"
            >
                <img
                    src={user.image || "/default-avatar.png"}
                    alt={`${user.username}'s avatar`}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-neutral-300">@{user.username}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {showMenu && (
                <div
                    className="absolute top-12 right-0 mt-2 w-48 bg-white rounded shadow-lg z-50"
                    role="menu"
                >
                    <ul className="text-sm text-gray-700">
                        <li>
                            <a
                                href="/profile"
                                className="block px-4 py-2 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Edit Profile
                            </a>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
