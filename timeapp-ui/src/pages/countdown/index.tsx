import React, { useEffect, useState, useRef, useCallback } from "react";
import Display, { Colon } from '../../components/ui/display';
import { Button } from '../../components/ui/ui-assets';
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCountdown, startCountdown, pauseCountdown, resetCountdown } from "./api";
import { GrAdd, GrSubtract } from "react-icons/gr";
import { CountDownHttpData, HoverTarget } from "./dtypes.tsx";
import './index.css';

const INITIAL_DISPLAY = [0, 0];

function CountDown() {
    const [countdownData, setCountdownData] = useState({
        isActive: false,
        extensionId: '',
        timeUp: false,
        setDuration: 0,
    });

    const [countdownDuration, setCountdownDuration] = useState(0);
    const [uiChange, setUiChange] = useState(false);
    const [display, setDisplay] = useState({
        hours: INITIAL_DISPLAY,
        minutes: INITIAL_DISPLAY,
        seconds: INITIAL_DISPLAY,
    });


    const [isHover, setIsHover] = useState<HoverTarget>([null, null])

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const endTimeRef = useRef<number>(0);

    const updateDisplay = useCallback((secs: number) => {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;

        setDisplay({
            hours: [Math.floor(hours / 10), hours % 10],
            minutes: [Math.floor(minutes / 10), minutes % 10],
            seconds: [Math.floor(seconds / 10), Math.round(seconds % 10)],
        });
    }, []);

    const countDown = useCallback(() => {
        const now = performance.now();
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);
        const safeRemaining = Math.max(0, remaining);
        updateDisplay(safeRemaining);

        if (safeRemaining <= 0) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setCountdownData(prev => ({ ...prev, timeUp: true, isActive: false }));
            setCountdownDuration(0);
        }
    }, [updateDisplay]);

    const startTimer = useCallback((duration: number, skipEndTimeCalculate?: boolean) => {
        endTimeRef.current = performance.now() + duration * 1000;
        if (!skipEndTimeCalculate) intervalRef.current = setInterval(countDown, 1000);
        setCountdownData(prev => ({ ...prev, isActive: true }));
        updateDisplay(duration);
    }, [countDown, updateDisplay]);

    const { data, isLoading } = useQuery<CountDownHttpData>({
        queryKey: ['getTimer'],
        queryFn: getCountdown,
    });

    useEffect(() => {
        if (!isLoading && data) {
            endTimeRef.current = performance.now() + data.duration * 1000;
            setCountdownData({
                isActive: data.active,
                extensionId: data.extensionId,
                timeUp: data.timeUp,
                setDuration: data.setDuration,
            });

            updateDisplay(data.duration);
            setCountdownDuration(data.duration)


            if (data.active && data.duration > 0) {
                startTimer(data.duration, false);
            }
        }
    }, [data, isLoading, startTimer, updateDisplay]);

    const setTimerMutation = useMutation({
        mutationFn: ({ duration, setDuration }: { duration: number; setDuration: number }) =>
            startCountdown(duration, setDuration),
        onSuccess: (response) => {
            if (response.success) startTimer(countdownDuration);
            setUiChange(false);
        },
    });

    const pauseTimerMutation = useMutation({
        mutationFn: pauseCountdown,
        onSuccess: (response) => {
            if (response.success) {
                setCountdownData(prev => ({ ...prev, isActive: false }));
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        },
    });

    const resetTimerMutation = useMutation({
        mutationFn: resetCountdown,
        onSuccess: (response) => {
            if (response.success) {
                setCountdownData(prev => ({ ...prev, isActive: false, timeUp: false }));
                if (intervalRef.current) clearInterval(intervalRef.current);
                setCountdownDuration(countdownDuration);
                updateDisplay(countdownDuration);
            }
        },
    });

    const toggleTimer = () => {
        if (!countdownData.isActive) {

            setTimerMutation.mutate({ duration: countdownDuration,
                setDuration:  uiChange ? countdownDuration: countdownData.setDuration});
            setCountdownData(prev => ({ ...prev, setDuration: countdownDuration }));
        } else {
            pauseTimerMutation.mutate();
        }
    };

    const handleFaceSignBtns = (sign: '+' | '-', face: keyof typeof display, index: number | null) => {
        if (index === null) {
            return;
        }

        setDisplay(prev => {

            const value = display[face][index];
            const increment = sign === '+' ? 1 : -1;
            const newVal = Math.min(9, Math.max(0, value + increment));

            const newFaceValues = prev[face].map((v, i) => (i === index ? newVal : v)) as [number, number];
            const newDisplay = {
                ...prev,
                [face]: newFaceValues
            }

            const newDuration = newDisplay.hours[0] * 36000 + newDisplay.hours[1] * 3600 +
                newDisplay.minutes[0] * 600 + newDisplay.minutes[1] * 60 +
                newDisplay.seconds[0] * 10 + newDisplay.seconds[1];

            setCountdownData(prev => ({...prev, timeUp: false}))
            setCountdownDuration(newDuration)

            setUiChange(true)

            return newDisplay;
        })
    }

    const handleMouseOver = useCallback((unit: string, e: React.MouseEvent<HTMLElement>) => {
        const id = e.currentTarget.id;
        setIsHover([unit, id])
    }, [])

    const handleMouseLeave = useCallback(() => setIsHover([null, null]), [])

    const getTopComponent = (unit: "hours" | "minutes" | "seconds")=> {
        if (isHover[0] === unit) {
            return [
                <button
                    type="button"
                    disabled={countdownData.isActive ||
                        isHover[1] !==null && display[unit][parseInt(isHover[1])] === (
                            isHover[1] === '0' && (unit === 'hours' ? 9: 5) || 9
                        )}
                    className="disabled:opacity-30"
                >
                    <GrAdd className="cursor-pointer" onClick={() => {
                        handleFaceSignBtns('+', unit, isHover[1] === null ? null: Number(isHover[1]))
                    }}
                    />
                </button>
            ]
        } else return undefined
    }

    const getDownComponent = (unit: "hours" | "minutes" | "seconds") => {
        if (isHover[0] === unit) {
            return [
                <button
                    type="button"
                    disabled={countdownData.isActive ||
                        isHover[1] !==null && display[unit][parseInt(isHover[1])] === 0}
                    className="disabled:opacity-30"
                >
                    <GrSubtract
                        className="cursor-pointer transition-all duration-300 ease-in-out smooth-appear"
                        onClick={() => {
                            handleFaceSignBtns('-', unit, isHover[1] === null ? null: Number(isHover[1]))
                        }}
                    />
                </button>
            ]
        } else return undefined
    }

    return (
        <div className="t-container">
            <div className="mt-20 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {(['hours', 'minutes', 'seconds'] as const).map((unit, i) => (
                    <React.Fragment key={`wrapper-${i}`}>
                        <Display
                            key={unit}
                            value={display[unit]}
                            label={unit.toUpperCase()}
                            childrenEvents={{
                                onMouseEnter: (e) => handleMouseOver(unit, e),
                                onMouseLeave: handleMouseLeave
                                }
                            }
                            triggerIndex={isHover[1]}
                            topComponent={getTopComponent(unit)}
                            downComponent={getDownComponent(unit) }

                        />
                        {i < 2 && <Colon />}
                    </React.Fragment>
                ))}
            </div>

            <div className="justify-center items-center w-full text-center h-15 m-10 text-pink-200 text-5xl">
                {countdownData.timeUp && (
                    <p>Time Up!!!</p>
                    )
                }
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center w-full text-center h-15 gap-5 sm:gap-10 px-5 md:px-25 mt-4">
                <Button text={countdownData.isActive ? "Pause" : "Start"}
                        className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl"
                        disabled={!countdownDuration}
                        onClick={toggleTimer} />
                <Button text="Reset"
                        className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl"
                        disabled={!countdownData.setDuration}
                        onClick={() => resetTimerMutation.mutate()} />
            </div>
        </div>
    );
}

export default CountDown;