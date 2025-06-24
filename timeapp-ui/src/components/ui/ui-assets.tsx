import React from "react"


// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const buttonStyles = cva(
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 ease-fluid',
    {
        variants: {
            variant: {
                default: 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow',
                outline: 'border-2 border-secondary text-secondary hover:bg-secondary/10',
                ghost: 'bg-transparent text-text hover:bg-surface/20',
            },
            size: {
                sm: 'px-3 py-1 text-sm',
                md: 'px-4 py-2 text-base',
                lg: 'px-6 py-3 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonStyles>

export function Button({
                           className,
                           variant,
                           size,
                           ...props
                       }: ButtonProps) {
    return (
        <button
            className={twMerge(buttonStyles({ variant, size }), className)}
            {...props}
        />
    )
}
