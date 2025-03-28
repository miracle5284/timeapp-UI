// FlipDigit.tsx
import { useEffect, useState } from "react";
import "../styles/flip.css";
import "../styles/fancy-flip.css";

type FlipCharProps = {
    value: string | number;
};

const FlipChar = ({ value }: FlipCharProps) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setFlipping(true);
            setTimeout(() => {
                setDisplayValue(value);
                setFlipping(false);
            }, 300); // Match animation duration
        }
    }, [value, displayValue]);

    return (
        <div className={`flip-container ${flipping ? "flip" : ""}`}>
            <div className="digit">{displayValue}</div>
        </div>
    );
};

export default FlipChar;


type FancyFlipDigitProps = {
    value: string | number;
};

export const FancyFlipDigit = ({ value }: FancyFlipDigitProps) => {
    const [prevValue, setPrevValue] = useState(value);
    const [currentValue, setCurrentValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== currentValue) {
            setPrevValue(currentValue);
            setIsFlipping(true);

            const timeout = setTimeout(() => {
                // ⚡ Defer value update to next animation frame
                requestAnimationFrame(() => {
                    setCurrentValue(value);
                    setIsFlipping(false);
                });
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [value, currentValue]);

    return (
        <div className="flip-digit">
            <div className="upper">{isFlipping ? prevValue : currentValue}</div>
            <div className={`lower ${isFlipping ? "flip" : ""}`}>
                <div className="front">{prevValue}</div>
                <div className="back">{value}</div>
            </div>
        </div>
    );
};