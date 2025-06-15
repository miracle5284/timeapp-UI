import React, { useEffect, useState, useRef, useCallback } from "react";
import Display, { Colon } from '../../components/ui/display';
import { Button } from '../../components/ui/ui-assets';
import { useQuery, useMutation } from "@tanstack/react-query";
import {getCountdown, startCountdown, pauseCountdown, resetCountdown, completeCountdown, renameCountdown} from "./api";
import { GrAdd, GrSubtract } from "react-icons/gr";
import {
    CountdownState,
    HoverTarget,
    ICompleteCountdown,
    IDisplay,
    IPauseCountdown, IRenameCountdown,
    IResetCountdown, IStartCountdown, Timer,
} from "./dtypes.tsx";
import { sendNotification, useNotificationPermission } from "../../../lib";

import './index.css';
import timeLogo from "../../assets/clock-circle-svgrepo-com.svg";
import {FiSettings, FiTrash2} from "react-icons/fi";

// Default initial display for hours/minutes/seconds
const INITIAL_DISPLAY = [0, 0];
interface ICountdownProps {
    id: string;
    timerId: string;
    isActive?: boolean;
    onDelete?: () => void;
}

/**
 * Main Countdown component
 * Handles timer setup, countdown logic, session persistence, and UI interaction
 */
function CountDownComponent({
    id, timerId, isActive = false, onDelete }: ICountdownProps) {

    const [countdownData, setCountdownData] = useState<CountdownState>({
        id: null,         // Timer ID
        name: "",
        isActive: false,      // Is timer currently running
        inActive: false,
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

    const [triggerCompletion, setTriggerCompletion] = useState(false); // For tracking which digit is being changed
    const [isHover, setIsHover] = useState<HoverTarget>([null, null]); // For tracking hovered digit
    const [notificationPermission, setNotificationPermission] = useState(false); // Notification toggle
    const [showControls, setShowControls] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);  // Interval handler
    const endTimeRef = useRef<number>(0);                    // Reference to target end time
    const audioRef = useRef<HTMLAudioElement | null>(null);  // Alarm sound reference

    useNotificationPermission({ permissionHook: [notificationPermission, setNotificationPermission] });

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

        if (!countdownData.inActive && safeRemaining <= 0) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setCountdownData(prev => ({ ...prev, timeUp: true, isActive: false }));
            setTriggerCompletion(true)
            setCountdownDuration(0);
        }
    }, [countdownData.inActive, updateDisplay]);

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
    const notify = useCallback(() => {
        sendNotification({
            notificationPermission,
            title: "Timer Up",
            body: `Your ${countdownData.name} has finished`,
            requireInteraction: true,
            icon: timeLogo
        });

        audioRef.current?.play();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (triggerCompletion) {
            completeTimerMutation.mutate({
                id: countdownData.id!,
                timestamp: new Date().toISOString()
            })
            notify()
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
    const { data, isLoading, refetch } = useQuery<Timer>({
        queryKey: ['getTimer', timerId],
        queryFn: () => getCountdown(timerId),
        enabled: isActive
    })

    useEffect(() => {
        console.log('ISS ACTIVE', isActive)
        if (isActive) {
            console.log('ISS INIT', )
            refetch();
        }
    }, [isActive, refetch, timerId]);

    useEffect(() => {
        console.log("timer  active", timerId, isActive)
        console.log("timer  countdown", countdownData, data)
    }, [countdownData, isActive, timerId, data]);

    useEffect(() => {
        console.log("timer  sssssss", timerId, data, isLoading)
        if (!isLoading && data) {
            endTimeRef.current = performance.now() + data.remainingDurationSeconds * 1000;
            setCountdownData({
                id: data.id,
                isActive: data.status === "active",
                inActive: data.status === "inactive",
                name: data.name,
                timeUp: data.status === "completed",
                durationSeconds: data.durationSeconds,
                remainingDurationSeconds: data.remainingDurationSeconds,
                startAt: data.startAt || null, pausedAt: data.pausedAt || null, resumedAt: data.resumedAt || null,
            });

            updateDisplay(data.remainingDurationSeconds);
            setCountdownDuration(data.remainingDurationSeconds);

            if (data.status === 'active' && data.remainingDurationSeconds > 0) {
                startTimer(data.remainingDurationSeconds, false);
            }
        }

    }, [data, isLoading, startTimer, timerId, updateDisplay]);

    const setTimerName = useMutation({
        mutationFn: ({id, name} : IRenameCountdown) =>
            renameCountdown(id, name),
        onSuccess: (response) =>
            setCountdownData(prev => ({...prev, name: response.data?.name}))
    })

    // Set timer mutation
    const setTimerMutation = useMutation({
        mutationFn: ({ id, name, durationSeconds, timestamp }: IStartCountdown) =>
            startCountdown(id!, name, durationSeconds, timestamp),
        onSuccess: (response) => {
            if (response.status === "active") {
                startTimer(countdownDuration);
                if (uiChange) setCountdownData(prev => ({ ...prev, durationSeconds: countdownDuration }));
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
                console.log('PAUSEDDDDDDD', response);
                setCountdownData(prev => ({ ...prev, isActive: false }));
                if (intervalRef.current) {
                    console.log('PAUSED Cleared');
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

            setCountdownDuration(calculatedDuration);
            setTimerMutation.mutate({
                id: countdownData?.id || null,
                name: countdownData.name!,
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
        <div
            className="t-container"
            id={id}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div
                className="absolute inset-0 flex justify-between items-start p-4"
            >

                <button
                    className={`absolute top-4 hover:scale-120
                        cursor-pointer text-gray-400 hover:text-white z-99 p-5
                        transition-opacity duration-300 ease-in-out
                        ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <FiSettings color="purple" size={24} />
                </button>

                <input
                    type="text" name="timer-name" defaultValue={countdownData.name}
                    onBlur={(e) =>
                        e.target.value !== countdownData.name &&
                        setTimerName.mutate({id: timerId, name: e.target.value})}
                    className="mx-4 top-4 p-5 flex-grow bg-transparent text-center text-lg font-medium border-none
                                outline-none"
                />

                <button
                    className={`absolute top-4 right-4 hover:scale-120
                        cursor-pointer text-gray-400 hover:text-white z-99 p-5
                        transition-opacity duration-300 ease-in-out
                        ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <FiTrash2 size={24} color="purple" onClick={onDelete} />
                </button>

            </div>

            {/* Timer display */}
            <div className="mt-6 sm:mt-20 mb-4 sm:mb-12 flex flex-wrap justify-center items-center gap-3 sm:gap-6 px-2 sm:px-4">
                {(['hours', 'minutes', 'seconds'] as const).map((unit, i) => (
                    <React.Fragment key={unit}>
                        <Display
                            value={display[unit]}
                            label={unit.toUpperCase()}
                            childrenEvents={{
                                onMouseEnter: (e) => handleMouseOver(unit, e),
                                onMouseLeave: handleMouseLeave,
                            }}
                            triggerIndex={isHover[1]}
                            topComponent={getTopComponent(unit)}
                            downComponent={getDownComponent(unit)}
                            useFlip={true}
                            className="shadow-glow rounded-lg"
                        />
                        {i < 2 && <Colon />}
                    </React.Fragment>
                ))}
            </div>

            {/* Time-up message */}
            {countdownData.timeUp && !countdownData.inActive && (
                <div className="text-[var(--color-accent)] text-3xl sm:text-5xl font-bold m-4 animate-pulse">
                    Time’s Up!
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center w-full text-center gap-3 sm:gap-10 px-4 md:px-20 mt-6">
                <Button
                    onClick={toggleTimer}
                    disabled={!countdownDuration}
                    className="ctrl-btn smooth shadow-glow
                   disabled:brightness-75"
                >
                    {countdownData.isActive ? 'Pause' : 'Start'}
                </Button>

                <Button
                    onClick={() => resetTimerMutation.mutate({id: countdownData.id!})}
                    disabled={!countdownData.durationSeconds}
                    className="ctrl-btn smooth shadow-glow
                   bg-[var(--color-accent)] hover:brightness-110
                   disabled:brightness-50"
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}

export default CountDownComponent;
