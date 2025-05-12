import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useOAuthPopup } from "../../lib/hooks/use-oauth-popups.ts";
import { BACKEND_URL, SOCIAL_AUTH_LOGIN_ENDPOINT } from "../../constant.ts";

/**
 * OAuthButtons Component
 *
 * Renders social login buttons (Facebook, Google, LinkedIn) and handles
 * the popup-based OAuth authentication flow.
 *
 * Props:
 * - onLogin: Callback function called upon successful authentication.
 *   Receives the access and refresh tokens as arguments.
 */
export function OAuthButtons({onLogin, }: {
    onLogin(access: string, refresh: string): void;
}) {
    // Logs errors during OAuth process
    const handleError = (msg: string) => console.error(msg);

    // Custom hook to initiate OAuth login in a popup window
    const startSocialLogin = useOAuthPopup(onLogin, handleError);

    /**
     * Initiates social login for the specified provider
     * @param socialAppName One of 'Facebook', 'Google', or 'LinkedIn'
     */
    const handleSocialLogin = (socialAppName: string) => {
        const url = `${BACKEND_URL}${SOCIAL_AUTH_LOGIN_ENDPOINT}?provider=${socialAppName}`;
        startSocialLogin(url);
    };

    return (
        <div className="flex justify-center gap-4 mb-6">
            {/* Facebook Login Button */}
            <button
                onClick={() => handleSocialLogin("facebook")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-600 shadow hover:scale-110 transition"
                aria-label="Continue with Facebook"
            >
                <FaFacebookF />
            </button>

            {/* Google Login Button */}
            <button
                onClick={() => handleSocialLogin("google")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 shadow hover:scale-110 transition"
                aria-label="Continue with Google"
            >
                <FaGoogle />
            </button>

            {/* LinkedIn Login Button */}
            <button
                onClick={() => handleSocialLogin("linkedIn")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-700 shadow hover:scale-110 transition"
                aria-label="Continue with LinkedIn"
            >
                <FaLinkedinIn />
            </button>
        </div>
    );
}
