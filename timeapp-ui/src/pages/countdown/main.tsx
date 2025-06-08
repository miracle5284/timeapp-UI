import React, { useEffect, useState, useRef, useCallback } from "react";
import Display, { Colon } from '../../components/ui/display';
import { Button } from '../../components/ui/ui-assets';
import { useQuery, useMutation } from "@tanstack/react-query";
import {getCountdown, startCountdown, pauseCountdown, resetCountdown, completeCountdown} from "./api";
import { GrAdd, GrSubtract } from "react-icons/gr";
import {
    CountdownState,
    HoverTarget,
    ICompleteCountdown,
    IDisplay,
    IPauseCountdown,
    IResetCountdown, IStartCountdown,
    TimerResponse
} from "./dtypes.tsx";
import { sendNotification, useNotificationPermission } from "../../../lib";

import './index.css';
import timeLogo from "../../assets/clock-circle-svgrepo-com.svg";

// Default initial display for hours/minutes/seconds
const INITIAL_DISPLAY = [0, 0];

/**
 * Main Countdown component
 * Handles timer setup, countdown logic, session persistence, and UI interaction
 */
function CountDownComponent() {
    const [countdownData, setCountdownData] = useState<CountdownState>({
        id: null,         // Timer ID
        isActive: false,      // Is timer currently running
        timeUp: false,        // Flag for when timer hits zero
        durationSeconds: 0,   // Original set duration in seconds
        remainingDurationSeconds: 0, // Remaining duration in seconds
        startAt: null,        // Start time
        pausedAt: null,       // Pause time
        resumedAt: null,      // Resume time
    });

    const [countdownDuration, setCountdownDuration] = useState(0); // Remaining duration
    const [uiChange, setUiChange] = useState(false); // Track if UI was manually changed
    const [display, setDisplay] = useState({        // Time display state
        hours: INITIAL_DISPLAY,
        minutes: INITIAL_DISPLAY,
        seconds: INITIAL_DISPLAY,
    });

    const [timerIndex, setTimerIndex] = useState<number | null>(null); // For tracking which digit is being changed
    const [triggerCompletion, setTriggerCompletion] = useState(false); // For tracking which digit is being changed
    const [isHover, setIsHover] = useState<HoverTarget>([null, null]); // For tracking hovered digit

    const intervalRef = useRef<NodeJS.Timeout | null>(null);  // Interval handler
    const endTimeRef = useRef<number>(0);                    // Reference to target end time
    const audioRef = useRef<HTMLAudioElement | null>(null);  // Alarm sound reference

    const {isGranted: notificationPermissionGranted} = useNotificationPermission();

    /**
     * Converts seconds to hours/minutes/seconds digit arrays for display
     */
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

    /**
     * Main countdown logic executed every second
     */
    const countDown = useCallback(() => {
        const now = performance.now();
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);
        const safeRemaining = Math.max(0, remaining);
        updateDisplay(safeRemaining);

        if (safeRemaining <= 0) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setCountdownData(prev => ({ ...prev, timeUp: true, isActive: false }));
            setTriggerCompletion(true)
            setCountdownDuration(0);
        }
    }, [updateDisplay]);

    /**
     * Converts display digits to total seconds
     */
    const calculatedTotalSeconds = useCallback((display: IDisplay) => {
        return display.hours[0] * 36000 + display.hours[1] * 3600 +
            display.minutes[0] * 600 + display.minutes[1] * 60 +
            display.seconds[0] * 10 + display.seconds[1];
    }, []);

    // Preload the alarm sound once
    useEffect(() => {
        const audio = new Audio('/audio/clock-alarm-8761.mp3');
        audio.loop = false;
        audio.preload = 'auto';
        audioRef.current = audio;
    }, []);

    // Trigger notification and sound when timer is up
    useEffect(() => {
        console.log(timerIndex)
        if (countdownData.timeUp) {
            sendNotification({
                notificationPermissionGranted,
                title: "Timer Up",
                body: `Your ${countdownData.durationSeconds} seconds has finished`,
                requireInteraction: true,
                icon: timeLogo
            });

            audioRef.current?.play();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdownData.timeUp]);

    useEffect(() => {
        if (triggerCompletion) {
            completeTimerMutation.mutate({
                id: countdownData.id!,
                timestamp: new Date().toISOString()
            })
        }

        setTriggerCompletion(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerCompletion]);

    /**
     * Initializes and starts the timer with specified duration
     */
    const startTimer = useCallback((duration: number, skipEndTimeCalculate?: boolean) => {
        if (!skipEndTimeCalculate) endTimeRef.current = performance.now() + duration * 1000;
        intervalRef.current = setInterval(countDown, 1000);
        setCountdownData(prev => ({ ...prev, isActive: true }));
        updateDisplay(duration);
    }, [countDown, updateDisplay]);

    // Fetch timer state from backend on mount
    const { data, isLoading } = useQuery<TimerResponse>({
        queryKey: ['getTimer'],
        queryFn: getCountdown,
    });

    useEffect(() => {
        if (!isLoading && data?.results && data.results.length > 0) {
            const index = data.results.length - 1;
            setTimerIndex(index)
            const _data = data.results[index];
            endTimeRef.current = performance.now() + _data.remainingDurationSeconds * 1000;
            setCountdownData({
                id: _data.id,
                isActive: _data.status === "active",
                timeUp: _data.status === "completed",
                status: _data.status,
                durationSeconds: _data.durationSeconds,
                remainingDurationSeconds: _data.remainingDurationSeconds,
                startAt: _data.startAt || null, pausedAt: _data.pausedAt || null, resumedAt: _data.resumedAt || null,
            });

            updateDisplay(_data.remainingDurationSeconds);
            setCountdownDuration(_data.remainingDurationSeconds);

            if (_data.status === 'active' && _data.remainingDurationSeconds > 0) {
                startTimer(_data.remainingDurationSeconds, false);
            }
        }

    }, [data, isLoading, startTimer, updateDisplay]);

    // Set timer mutation
    const setTimerMutation = useMutation({
        mutationFn: ({ id, name, durationSeconds, timestamp }: IStartCountdown) =>
            startCountdown(id!, name, durationSeconds, timestamp),
        onSuccess: (response) => {
            if (response.status === "active") {
                startTimer(countdownDuration);
            }
            setUiChange(false);
        },
    });

    // Pause timer mutation
    const pauseTimerMutation = useMutation({
        mutationFn: ({ id, remainingDurationSeconds, timestamp }: IPauseCountdown) =>
            pauseCountdown(id, remainingDurationSeconds, timestamp),
        onSuccess: (response) => {
            if (response.status === "paused") {
                setCountdownData(prev => ({ ...prev, isActive: false }));
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        },
    });

    // Reset timer mutation
    const resetTimerMutation = useMutation({
        mutationFn: ({ id } : IResetCountdown) => resetCountdown(id),
        onSuccess: (response) => {
            if (response.status === "inactive") {
                setCountdownData(prev => ({ ...prev, isActive: false, timeUp: false }));
                if (intervalRef.current) clearInterval(intervalRef.current);
                setCountdownDuration(countdownData.durationSeconds);
                updateDisplay(countdownData.durationSeconds);
            }
        },
    });

    const completeTimerMutation = useMutation({
        mutationFn: ({ id, timestamp } : ICompleteCountdown) => completeCountdown(id, timestamp),

    });

    /**
     * Handles timer start or pause toggle based on current state
     */
    const toggleTimer = () => {
        const calculatedDuration = calculatedTotalSeconds(display);
        if (!countdownData.isActive) {

            // setCountdownData(prev => ({ ...prev, durationSeconds: countdownDuration }));
            setCountdownDuration(calculatedDuration);
            setTimerMutation.mutate({
                id: countdownData?.id || null,
                name: "",
                durationSeconds: uiChange ? countdownDuration : countdownData.durationSeconds,
                timestamp: new Date().toISOString()
            });
        } else {
            pauseTimerMutation.mutate({
                id: countdownData.id!,
                remainingDurationSeconds: calculatedDuration,
                timestamp: new Date().toISOString()
            });
        }
    };

    /**
     * Adjusts individual digit of display for given unit and index
     */
    const handleFaceSignBtns = (sign: '+' | '-', face: keyof typeof display, index: number | null) => {
        if (index === null) return;

        setDisplay(prev => {
            const value = display[face][index];
            const increment = sign === '+' ? 1 : -1;
            const newVal = Math.min(9, Math.max(0, value + increment));

            const newFaceValues = prev[face].map((v, i) => (i === index ? newVal : v)) as [number, number];
            const newDisplay = { ...prev, [face]: newFaceValues };
            const newDuration = calculatedTotalSeconds(newDisplay);

            setCountdownData(prev => ({ ...prev, timeUp: false }));
            setCountdownDuration(newDuration);
            setUiChange(true);

            return newDisplay;
        });
    };

    const handleMouseOver = useCallback((unit: string, e: React.MouseEvent<HTMLElement>) => {
        const id = e.currentTarget.id;
        setIsHover([unit, id]);
    }, []);

    const handleMouseLeave = useCallback(() => setIsHover([null, null]), []);

    /**
     * Returns increment button if hovered
     */
    const getTopComponent = (unit: "hours" | "minutes" | "seconds") => {
        if (isHover[0] === unit) {
            return [
                <button
                    type="button"
                    disabled={countdownData.isActive ||
                        isHover[1] !== null && display[unit][parseInt(isHover[1])] === (
                            isHover[1] === '0' && (unit === 'hours' ? 9 : 5) || 9
                        )}
                    className="disabled:opacity-30"
                >
                    <GrAdd className="cursor-pointer" onClick={() => {
                        handleFaceSignBtns('+', unit, isHover[1] === null ? null : Number(isHover[1]));
                    }} />
                </button>
            ];
        } else return undefined;
    };

    /**
     * Returns decrement button if hovered
     */
    const getDownComponent = (unit: "hours" | "minutes" | "seconds") => {
        if (isHover[0] === unit) {
            return [
                <button
                    type="button"
                    disabled={countdownData.isActive ||
                        isHover[1] !== null && display[unit][parseInt(isHover[1])] === 0}
                    className="disabled:opacity-30"
                >
                    <GrSubtract
                        className="cursor-pointer transition-all duration-300 ease-in-out smooth-appear"
                        onClick={() => {
                            handleFaceSignBtns('-', unit, isHover[1] === null ? null : Number(isHover[1]));
                        }}
                    />
                </button>
            ];
        } else return undefined;
    };

    return (
        <>
            <div className="t-container">
                {/* Timer display */}
                <div className="mt-6 sm:mt-20 mb-4 sm:mb-12 flex flex-wrap justify-center items-center gap-3 sm:gap-6 px-2 sm:px-4">
                {(['hours', 'minutes', 'seconds'] as const).map((unit, i) => (
                        <React.Fragment key={`wrapper-${i}`}>
                            <Display
                                key={unit}
                                value={display[unit]}
                                label={unit.toUpperCase()}
                                childrenEvents={{
                                    onMouseEnter: (e) => handleMouseOver(unit, e),
                                    onMouseLeave: handleMouseLeave
                                }}
                                triggerIndex={isHover[1]}
                                topComponent={getTopComponent(unit)}
                                downComponent={getDownComponent(unit)}
                                useFlip={true}
                            />
                            {i < 2 && <Colon />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Time-up message */}
                <div className="text-pink-200 text-2xl sm:text-5xl m-4 sm:m-10 px-2 sm:px-6 text-center">
                {countdownData.timeUp && <p>Time Up!!!</p>}
                </div>

                {/* Timer controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center w-full text-center gap-3 sm:gap-10 px-4 md:px-20 mt-4">

                    <Button
                        text={countdownData.isActive ? "Pause" : "Start"}
                        className="w-full sm:min-w-[6rem] text-sm sm:text-lg md:text-xl"
                        disabled={!countdownDuration}
                        onClick={toggleTimer}
                    />
                    <Button
                        text="Reset"
                        className="w-full sm:min-w-[6rem] text-sm sm:text-lg md:text-xl"
                        disabled={!countdownData.durationSeconds}
                        onClick={() => resetTimerMutation.mutate({id: countdownData.id!})}
                    />
                </div>
            </div>
        </>
    );
}

export default CountDownComponent;
