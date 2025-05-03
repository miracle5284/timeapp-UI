export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const CHROME_EXTENSION_PREFIX_URL = "https://chromewebstore.google.com/detail";
export const USER_DATA_ENDPOINT = `/users`;
export const USER_AUTH_TOKEN_ENDPOINT = `/users/auth/token`;
export const REGISTER_USER_ENDPOINT = `/users/register`;

export const navItems = [
    {
        href: "/countdown",
        label: "Timer"
    },
]