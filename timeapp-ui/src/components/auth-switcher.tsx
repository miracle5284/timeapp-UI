// AuthSwitcher.tsx
import { useState } from "react";
import SignUpForm from "./Forms/sign-up";
import { SignInForm } from "./Forms/sign-in";
import { Button } from "./ui/ui-assets";
import {OAuthButtons} from "./oauth-buttons.tsx";
import {useAuth} from "../context/use-auth.ts";

type AuthSwitcherProps = {
    signUp?: boolean;
};

function AuthSwitcher({ signUp }: AuthSwitcherProps) {
    const [isSignUp, setIsSignUp] = useState(!!signUp);
    const { login } = useAuth()

    return (
        <div className="min-h-[800px] flex items-center justify-center relative overflow-hidden px-4">
            <div className="absolute inset-0 bg-[url('/bg/grid.svg')] opacity-10 z-0" />
            <div className="relative w-full max-w-5xl bg-white/10 backdrop-blur-md shadow-xl rounded-2xl overflow-visible border border-white/20 z-10">
                {/* Sliding container */}
                <div
                    className={`relative w-full h-full flex transition-transform duration-700 ease-in-out ${
                        isSignUp ? "translate-x-0 md:translate-x-1/2" : "translate-x-0"}`}
                >
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white z-10">
                        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 tracking-tight">
                            {isSignUp ? "Create Account" : "Sign In"}
                        </h2>
                        <OAuthButtons onLogin={login} />

                        <p className="text-center text-sm mb-6 text-gray-500">
                            {isSignUp ? "or use your email" : "or use your account"}
                        </p>
                        {isSignUp ? <SignUpForm /> : <SignInForm />}
                    </div>
                </div>

                {/* Side panel - render only on md+ screens and remove space on small screens */}
                {typeof window === "undefined" || window.innerWidth >= 768 ? (
                    <div
                        className={`absolute top-0 h-full w-1/2 p-10 flex-col justify-center items-center transition-all duration-700 ease-in-out text-white text-center hidden md:flex
                        ${isSignUp ? "left-0 bg-gradient-to-br from-blue-800 to-indigo-700 bg-[url('/bg/grid.svg')] bg-cover bg-center" : "left-1/2 bg-gradient-to-br from-cyan-600 to-teal-500 bg-[url('/bg/grid.svg')] bg-cover bg-center"}`}
                    >
                        {!isSignUp ? (
                            <>
                                <h2 className="text-3xl font-bold mb-4 text-white">Hello, Friend</h2>
                                <p className="text-sm mb-6">
                                    Enter your personal details and start your journey with us
                                </p>
                                <Button onClick={() => setIsSignUp(true)} className="mx-auto transition ctrl-btn smooth shadow-glow
                                        bg-[var(--color-accent)] hover:brightness-110
                                disabled:brightness-50">
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold mb-4 text-white">Welcome Back!</h2>
                                <p className="text-sm mb-6">
                                    To keep connected with us please login with your personal info
                                </p>
                                <Button onClick={() => setIsSignUp(false)} className="mx-auto transition ctrl-btn smooth shadow-glow
                                        bg-[var(--color-accent)] hover:brightness-110
                                disabled:brightness-50">
                                    Sign In
                                </Button>
                            </>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default AuthSwitcher;