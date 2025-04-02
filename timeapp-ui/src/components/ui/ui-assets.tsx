import React from "react"


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
}

export const Button: React.FC<ButtonProps> = ({text, className="", ...rest}) => {
    return (
        <button {...rest} className={`bg-[#333] text-white p-2 ctrl-btn ${className}`}>
            {text}
        </button>
    )
}