export const BACKEND_URL = BACKEND_APP_URL
export const CHROME_EXTENSION_PREFIX_URL = "https://chromewebstore.google.com/detail";
export const USER_DATA_ENDPOINT = `/users`;
export const USER_AUTH_TOKEN_ENDPOINT = `/users/auth/token`;
export const REGISTER_USER_ENDPOINT = `/users/register`;
export const SOCIAL_AUTH_LOGIN_ENDPOINT = `/users/auth/social/login-url`
export const OAUTH_POPUP_TOKENS_ENDPOINT = `/users/auth/oauth/tokens/`
export const PUSH_SERVICE_NOTIFICATION_ENDPOINT = '/services/notifications/subscribe'
export const OAUTH_STORAGE_KEY = 'oauthPopupTokens';

export const navItems = [
    {
        href: "/countdown",
        label: "Timer"
    },
]