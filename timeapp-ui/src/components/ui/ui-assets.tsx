import React from "react"


type ButtonProps = {
    text: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset" | null;
}
export const Button: React.FC<ButtonProps> = ({text, onClick, className, type}) => {
    return (
        <button type={type ? type: 'button'} onClick={onClick} className={`bg-[#333] text-white h-full p-2 ctrl-btn ${className}`}>
            {text}
        </button>
    )
}