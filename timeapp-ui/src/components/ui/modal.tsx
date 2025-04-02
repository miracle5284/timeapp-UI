import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // ESC key close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleButtonClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClose]);

    // Manage visibility and mount state
    useEffect(() => {
        if (shouldRender) {
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
        }
    }, [shouldRender]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) {
            setShouldRender(false);
            onClose();
        }
    };

    const handleButtonClose = () => {
        setShouldRender(false);
        onClose()
    }

    return (
        <div
            ref={overlayRef}
            onClick={handleClickOutside}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-1000 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                ref={modalRef}
                className={`relative rounded-2xl p-6 shadow-xl sm:w-3/4 lg:w-2/3 transition-all duration-1000 ${
                    visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={handleButtonClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {children}
            </div>
        </div>
    );
};
