import React from "react";
import { FancyFlipDigit } from './flip';

// Props for the Display component
type DisplayProps = React.HTMLAttributes<HTMLDivElement> & {
    value: string[] | number[],              // Array of characters or numbers to display
    label: string,                           // Label under the display (e.g., HOURS)
    topComponent?: React.ReactNode[],        // Optional component above each digit (e.g., increment button)
    downComponent?: React.ReactNode[],       // Optional component below each digit (e.g., decrement button)
    childrenEvents?: Partial<React.HTMLAttributes<HTMLElement>>, // Event handlers (hover, etc.)
    triggerIndex: string | null,             // Index of the digit currently hovered
    useFlip?: boolean                        // Whether to use flip animation
}

/**
 * Display Component
 * Renders a group of styled digits with optional interactive elements above/below each digit.
 */
const Display: React.FC<DisplayProps> = (
    { value, label, topComponent, downComponent, childrenEvents, triggerIndex, useFlip, ...props }) => {
    return (
        <div className="flex flex-col items-center text-white" {...props}>
            <div className="flex">
                {value.map((char, index) => (
                        <div
                            id={`${label}${index}`}
                            className="flex flex-col justify-center items-center opacity-80 pb-0"
                            key={`${label}${index}`}
                            {...childrenEvents}
                        >
                            {/* Top Component (e.g., + button) */}
                            <div className="h-4" key={`tp${label}${index}`}>
                                {(!childrenEvents || (triggerIndex && triggerIndex === String(index))) && topComponent}
                            </div>

                            {/* Main digit block */}
                            <div key={index} className="overflow-hidden mx-[0.5px] mt-3 bg-[#111] h-30 w-20 relative rounded-sm my-[2px]
                                border border-black shadow-[0_2px_4px_rgba(0,0,0,0.5)] before:content-[''] before:absolute
                                before:top-1/2 before:left-0 before:right-0 before:bg-[#333] before:z-[2] before:h-0.5">

                                {/* Left hinge effect */}
                                <div className="absolute w-2 h-5 bg-[#222] z-3 left-[-4px] top-[calc(50%-10px)]"></div>

                                {/* Digit content */}
                                <div className="relative flex w-full h-full justify-center text-center items-center">
                                    {useFlip
                                        ? <FancyFlipDigit value={char} />
                                        : <div className="text-[5rem] font-thin leading-none">{char}</div>}
                                </div>

                                {/* Right hinge effect */}
                                <div className="absolute w-2 h-5 bg-[#222] z-3 right-[-4px] top-[calc(50%-10px)]"></div>
                            </div>

                            {/* Bottom Component (e.g., - button) */}
                            <div className="h-4">
                                {childrenEvents ? triggerIndex && triggerIndex === String(index) && downComponent : downComponent}
                            </div>
                        </div>
                ))}
            </div>
            {/* Label under digits */}
            <div className="text-[#666] text-[0.8rem] tracking-[2px] mt-2 text-center">{label}</div>
        </div>
    );
};

export default Display;

/**
 * Colon Component
 * A simple colon (:) made of two dots for separating hour, minute, and second displays.
 */
export const Colon = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 mx-2 opacity-80 pb-6">
            <div className="bg-[#666] w-3 h-3 rounded-full"></div>
            <div className="bg-[#666] w-3 h-3 rounded-full"></div>
        </div>
    );
};
