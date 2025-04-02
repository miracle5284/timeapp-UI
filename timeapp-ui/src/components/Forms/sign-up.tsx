import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/ui-assets";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(1, "This field is required")
            .min(3, "Name is too short")
            .regex(/^[A-Za-z]+$/, "First name must contain only letters"),
        lastName: z
            .string()
            .min(1, "This field is required")
            .min(3, "Name is too short")
            .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
        email: z.string().min(1, "This field is required").email("Invalid email"),
        password: z.string().min(1, "This field is required").min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "This field is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type SignUpFormValues = z.infer<typeof signupSchema>;

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: SignUpFormValues) => {
        setLoading(true);
        try {
            console.log("Sign Up Data:", data);
            await new Promise((res) => setTimeout(res, 1000));
            toast.success("Account created successfully!");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            console.error("Sign Up Error:", err);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        field: { label: string; name: keyof SignUpFormValues; type?: string; autoComplete?: string },
        isPassword?: boolean,
        toggle?: () => void,
        visible?: boolean
    ) => (
        <div key={field.name} className="relative pt-5">
            <input
                type={isPassword ? (visible ? "text" : "password") : field.type || "text"}
                autoComplete={field.autoComplete}
                placeholder=" "
                {...register(field.name)}
                onBlur={() => trigger(field.name)}
                aria-invalid={!!errors[field.name]}
                aria-describedby={`${field.name}-error`}
                className="peer w-full px-4 py-2 pr-10 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-transparent peer-valid:bg-gray-100"
            />
            <label
                htmlFor={field.name}
                className="absolute left-4 top-2.5 text-gray-500 text-sm bg-white px-1 z-10 transition-all
            peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
                {field.label} <span className="text-[#d46a6a]">*</span>
            </label>
            {isPassword && toggle && (
                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-500"
                >
                    {visible ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
            {errors[field.name] && (
                <p id={`${field.name}-error`} className="text-[#d46a6a] text-sm mt-1">
                    {errors[field.name]?.message as string}
                </p>
            )}
        </div>
    );

    const fields: { label: string; name: keyof SignUpFormValues; type?: string; autoComplete?: string }[] = [
        { label: "First Name", name: "firstName", autoComplete: "given-name" },
        { label: "Last Name", name: "lastName", autoComplete: "family-name" },
        { label: "Email", name: "email", type: "email", autoComplete: "email" },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 text-sm md:text-base w-full max-w-md mx-auto">
            {fields.map((field) => renderInput(field))}
            {renderInput(
                { label: "Password", name: "password", type: "password", autoComplete: "new-password" },
                true,
                () => setShowPassword((prev) => !prev),
                showPassword
            )}
            {renderInput(
                { label: "Confirm Password", name: "confirmPassword", type: "password", autoComplete: "new-password" },
                true,
                () => setShowConfirmPassword((prev) => !prev),
                showConfirmPassword
            )}

            <div className="flex justify-center">
                <Button className="w-full max-w-sm" text={loading ? "Creating Account..." : "Sign Up"} disabled={loading} />
            </div>
        </form>
    );
}