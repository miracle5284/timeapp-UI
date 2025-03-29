// FlipDigit.tsx
import { useEffect, useState } from "react";
import "../styles/flip.css";
import "../styles/fancy-flip.css";

// Props for basic flip digit
type FlipCharProps = {
    value: string | number;
};

/**
 * FlipChar component: animates a simple digit flip when value changes
 * Uses basic flip animation defined in flip.css
 */
const FlipChar = ({ value }: FlipCharProps) => {
    const [displayValue, setDisplayValue] = useState(value);   // Currently shown digit
    const [flipping, setFlipping] = useState(false);           // Flip animation toggle

    useEffect(() => {
        if (value !== displayValue) {
            setFlipping(true);                                 // Start flip animation
            setTimeout(() => {
                setDisplayValue(value);                         // Update displayed digit
                setFlipping(false);                             // End flip animation
            }, 300); // Duration matches CSS animation
        }
    }, [value, displayValue]);

    return (
        <div className={`flip-container ${flipping ? "flip" : ""}`}>
            <div className="digit">{displayValue}</div>
        </div>
    );
};

export default FlipChar;

// Props for fancier flip digit
type FancyFlipDigitProps = {
    value: string | number;
};

/**
 * FancyFlipDigit component: animates a more detailed flip effect
 * Uses top/bottom separation for a 3D flip look defined in fancy-flip.css
 */
export const FancyFlipDigit = ({ value }: FancyFlipDigitProps) => {
    const [prevValue, setPrevValue] = useState(value);      // Previously displayed digit
    const [currentValue, setCurrentValue] = useState(value); // Currently shown digit
    const [isFlipping, setIsFlipping] = useState(false);     // Flip animation toggle

    useEffect(() => {
        if (value !== currentValue) {
            setPrevValue(currentValue);                      // Store current as previous
            setIsFlipping(true);                             // Begin flip animation

            const timeout = setTimeout(() => {
                // Use animation frame to sync update with rendering
                requestAnimationFrame(() => {
                    setCurrentValue(value);                 // Update digit post-flip
                    setIsFlipping(false);                   // End flip animation
                });
            }, 500); // Match CSS flip timing

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
