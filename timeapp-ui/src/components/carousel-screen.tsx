import React, {
    Children,
    cloneElement,
    ReactElement,
    useState,
    MouseEvent,
} from "react";
import {ChevronLeftIcon, ChevronRightIcon, PlusIcon} from "lucide-react";
import {Button} from "./ui/ui-assets.tsx";

interface SlideProps {
    className?: string
    isActive?: boolean
}

interface CarouselProps {
    children: React.ReactElement<SlideProps>[];
    onSlideChange?: (slide: number) => void;
    initialSlide?: number;
    slideWidthClass?: string; // e.g. "w-80"
    addButtonFn?: () => void;
}

/**
 * CarouselScreen component
 *
 * A horizontally scrollable carousel for displaying slides (children).
 *
 * Props:
 * - children: Array of React elements (slides) to display.
 * - onSlideChange: Optional callback when the active slide changes.
 * - initialSlide: Optional index to set the initial active slide.
 * - slideWidthClass: Optional Tailwind width class for each slide (e.g., 'w-80').
 * - addButtonFn: Optional callback for an add button (e.g., to add a new slide).
 *
 * Each child should accept SlideProps (className, isActive).
 *
 * Example usage:
 * <CarouselScreen initialSlide={0} onSlideChange={...} slideWidthClass="w-80">
 *   <SlideComponent ... />
 *   <SlideComponent ... />
 * </CarouselScreen>
 */
const CarouselScreen = ({
                            children,
                            onSlideChange,
                            initialSlide=0,
                            slideWidthClass = "min-w-[320px] max-w-[750px]",
                            addButtonFn,
                        }: CarouselProps) => {
    const slides = Children.toArray(children).filter(
        React.isValidElement
    ) as ReactElement<SlideProps>[];
    const [current, setCurrent] = useState(initialSlide);

    const setSlide = (slide: number) => {
        setCurrent(slide);
        onSlideChange?.(slide);
    }

    const prev = (e: MouseEvent) => {
        e.stopPropagation();
        setSlide(current === 0 ? slides.length - 1 : current - 1);
    };

    const next = (e: MouseEvent) => {
        e.stopPropagation();
        setSlide(current === slides.length - 1 ? 0 : current + 1);
    };

    const addSlide = () => {
        if (addButtonFn) {
            addButtonFn();
            setCurrent(0);
        }


    }

    return (
        <div
            className={
                // Responsive: full width on mobile, max width on desktop
                `relative mx-auto w-full max-w-[750px] sm:${slideWidthClass} overflow-hidden`
            }
        >
            {/* TRACK */}
            <div
                className="flex transition-transform duration-300 gap-4 sm:gap-10"
                style={{
                    width: `${slides.length * 100}%`,
                    transform: `translateX(-${(100 / slides.length) * current}%)`,
                }}
            >
                {slides.map((slide, index) =>
                    cloneElement(slide, {
                        key: index,
                        // Responsive: slide fills viewport on mobile, fixed width on desktop
                        className: `flex-shrink-0 w-full max-w-full px-2 sm:${slideWidthClass} ${slide?.props.className ?? ''}`,
                        isActive: index === current,
                    })
                )}
            </div>

            {/* Navigation arrows - repositioned for mobile */}
            {current > 0 && (
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full
                        hover:bg-gray-700 cursor-pointer z-20 sm:left-2"
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon size={20} className="text-white" />
                </button>
            )}
            {current < slides.length - 1 && (
                <Button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full
                        hover:bg-gray-700 cursor-pointer z-20 sm:right-2"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon size={20} className="text-white" />
                </Button>
            )}

            {/* Pagination dots and add button - always visible and centered on mobile */}
            <div className="relative w-full flex flex-col items-center px-2 h-16 mt-2 mb-2 sm:px-6 sm:h-10 sm:my-5">
                <div className="flex justify-center items-center h-full space-x-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-colors duration-200
                                ${i === current ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-600"}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
                {addButtonFn && (
                    <div className="absolute right-4 bottom-0 sm:right-6 sm:top-1/2 sm:transform sm:-translate-y-1/2">
                        <Button
                            onClick={addSlide}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex
                                via-purple-500 items-center shadow-lg hover:scale-110 transition-transform
                                justify-center cursor-pointer"
                            aria-label="Add timer"
                        >
                            <PlusIcon size={28} className="text-white" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarouselScreen;
