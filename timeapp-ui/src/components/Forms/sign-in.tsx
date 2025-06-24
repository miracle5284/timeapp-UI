import { useForm } from "react-hook-form";
import { Button } from "../ui/ui-assets";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {useAuth} from "../../context/use-auth";
import {USER_AUTH_TOKEN_ENDPOINT} from "../../../constant";
import API from "../../../lib/api";

const signinSchema = z
    .object({
        email: z.string().min(1, "This field is required").email("Invalid email"),
        password: z.string().min(1, "This field is required").min(6, "Password must be at least 6 characters"),
    });

type SignInFormValues = z.infer<typeof signinSchema>;

export function SignInForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signinSchema),
        mode: "onBlur",
    });

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    //const [error, setError] = useState("");
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: SignInFormValues) => {
        setLoading(true);
        try {
            const { email, password } = data;
            const resp = await API.post(USER_AUTH_TOKEN_ENDPOINT, { email, password });
            const { access, refresh } = resp.data;
            if (access && refresh) {
                login(access, refresh);
                toast.success("Login successful");
            } else {
                toast.error("Invalid credentials");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            console.error("Sign in error:", err);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 text-sm md:text-base w-full max-w-md mx-auto">
            {[{ label: "Email", name: "email", type: "email" }].map((field, i) => (
                <div key={i} className="relative pt-5">
                    <input
                        type={field.type}
                        placeholder=" "
                        {...register(field.name as keyof SignInFormValues)}
                        onBlur={() => trigger(field.name as keyof SignInFormValues)}
                        aria-invalid={!!errors[field.name as keyof SignInFormValues]}
                        aria-describedby={`${field.name}-error`}
                        autoComplete="email"
                        className="peer w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-transparent peer-valid:bg-gray-100"
                    />
                    <label
                        htmlFor={field.name}
                        className="absolute left-4 top-2.5 text-gray-500 text-sm bg-white px-1 z-10 transition-all
                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
                    >
                        {field.label} <span className="text-[#d46a6a]">*</span>
                    </label>
                    {errors[field.name as keyof SignInFormValues] && (
                        <p id={`${field.name}-error`} className="text-[#d46a6a] text-sm mt-1">
                            {errors[field.name as keyof SignInFormValues]?.message as string}
                        </p>
                    )}
                </div>
            ))}

            <div className="relative pt-5">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    {...register("password")}
                    onBlur={() => trigger("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                    autoComplete="current-password"
                    className="peer w-full px-4 py-2 pr-10 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-transparent peer-valid:bg-gray-100"
                />
                <label
                    htmlFor="password"
                    className="absolute left-4 top-2.5 text-gray-500 text-sm bg-white px-1 z-10 transition-all
                peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
                >
                    Password <span className="text-[#d46a6a]">*</span>
                </label>
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform text-gray-500"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                    <p id="password-error" className="text-[#d46a6a] text-sm mt-1">
                        {errors.password.message as string}
                    </p>
                )}
            </div>

            <a href="#" className="text-sm text-blue-600 block text-right">
                Forgot your password?
            </a>

            <div className="flex justify-center">
                <Button
                    className="w-full max-w-sm ctrl-btn smooth shadow-glow
                                        bg-[var(--color-accent)] hover:brightness-110"
                    disabled={loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </Button>
            </div>
        </form>
    );
}