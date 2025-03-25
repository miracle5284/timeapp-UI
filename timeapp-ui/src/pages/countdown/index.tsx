import { useEffect, useState, useRef, useCallback } from "react";
import Display, { Colon } from '../../components/ui/display';
import { Button } from '../../components/ui/ui-assets';
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCountdown, startCountdown, pauseCountdown, resetCountdown } from "./api";
import { GrAdd, GrSubtract } from "react-icons/gr";
import { CountDownHttpData } from "./dtypes.tsx";
import './index.css';

const INITIAL_DISPLAY = [0, 0];

function CountDown() {
    const [countdownData, setCountdownData] = useState({
        isActive: false,
        extensionId: '',
        timeUp: false,
        //initialDuration: 0,
    });

    const [secondsLeft, setSecondsLeft] = useState(0);
    const [countdownDuration, setCountdownDuration] = useState(0);
    const [display, setDisplay] = useState({
        hours: INITIAL_DISPLAY,
        minutes: INITIAL_DISPLAY,
        seconds: INITIAL_DISPLAY,
    });
    console.log(secondsLeft)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const endTimeRef = useRef<number>(0);

    const updateDisplay = useCallback((secs: number) => {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;

        setDisplay({
            hours: [Math.floor(hours / 10), hours % 10],
            minutes: [Math.floor(minutes / 10), minutes % 10],
            seconds: [Math.floor(seconds / 10), seconds % 10],
        });
    }, []);

    const countDown = useCallback(() => {
        const now = performance.now();
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);
        const safeRemaining = Math.max(0, remaining);
        setSecondsLeft(safeRemaining);
        updateDisplay(safeRemaining);

        if (safeRemaining <= 0) {
            clearInterval(intervalRef.current!);
            setCountdownData(prev => ({ ...prev, timeUp: true, isActive: false }));
        }
    }, [updateDisplay]);

    const startTimer = useCallback((duration: number) => {
        endTimeRef.current = performance.now() + duration * 1000;
        intervalRef.current = setInterval(countDown, 1000);
        setCountdownData(prev => ({ ...prev, isActive: true }));
        setSecondsLeft(duration);
        updateDisplay(duration);
    }, [countDown, updateDisplay]);

    const { data, isLoading } = useQuery<CountDownHttpData>({
        queryKey: ['getTimer'],
        queryFn: getCountdown,
    });

    useEffect(() => {
        if (!isLoading && data) {
            setCountdownData({
                isActive: data.active,
                extensionId: data.extensionId,
                timeUp: data.timeUp,
                initialDuration: data.initialDuration,
            });

            setSecondsLeft(data.duration);
            updateDisplay(data.duration);

            if (data.active && data.duration > 0) {
                startTimer(data.duration);
            }
        }
    }, [data, isLoading, startTimer, updateDisplay]);

    const setTimerMutation = useMutation({
        mutationFn: ({ duration, initialDuration }: { duration: number; initialDuration: number }) =>
            startCountdown(duration, initialDuration),
        onSuccess: (response) => {
            if (response.success) startTimer(countdownDuration);
        },
    });

    const pauseTimerMutation = useMutation({
        mutationFn: pauseCountdown,
        onSuccess: (response) => {
            if (response.success) {
                setCountdownData(prev => ({ ...prev, isActive: false }));
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        },
    });

    const resetTimerMutation = useMutation({
        mutationFn: resetCountdown,
        onSuccess: (response) => {
            if (response.success) {
                setCountdownData(prev => ({ ...prev, isActive: false, timeUp: false }));
                if (intervalRef.current) clearInterval(intervalRef.current);
                setSecondsLeft(countdownDuration);
                updateDisplay(countdownDuration);
            }
        },
    });

    const toggleTimer = () => {
        if (!countdownData.isActive) {
            const newDuration = display.hours[0] * 36000 + display.hours[1] * 3600 +
                display.minutes[0] * 600 + display.minutes[1] * 60 +
                display.seconds[0] * 10 + display.seconds[1];

            setCountdownDuration(newDuration);
            setTimerMutation.mutate({ duration: newDuration, initialDuration: countdownDuration });
        } else {
            pauseTimerMutation.mutate();
        }
    };

    const handleFaceSignBtns = (sign: '+' | '-', face: keyof typeof display, index: number) => {
        const value = display[face][index];
        const increment = sign === '+' ? 1 : -1;
        const newVal = Math.min(9, Math.max(0, value + increment));

        setDisplay(prev => ({
            ...prev,
            [face]: prev[face].map((v, i) => (i === index ? newVal : v)) as [number, number],
        }));

        setCountdownData(prev => ({...prev, timeUp: false}))
    };

    return (
        <div className="t-container">
            <div className="mt-20 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {(['hours', 'minutes', 'seconds'] as const).map((unit, i) => (
                    <>
                        <Display
                            key={unit}
                            value={display[unit]}
                            topComponent={[
                                <GrAdd className="cursor-pointer" onClick={() => handleFaceSignBtns('+', unit, 0)} />,
                                <GrAdd className="cursor-pointer" onClick={() => handleFaceSignBtns('+', unit, 1)} />
                            ]}
                            downComponent={[
                                <GrSubtract className="cursor-pointer" onClick={() => handleFaceSignBtns('-', unit, 0)} />,
                                <GrSubtract className="cursor-pointer" onClick={() => handleFaceSignBtns('-', unit, 1)} />
                            ]}
                            label={unit.toUpperCase()}
                        />
                        {i < 2 && <Colon />}
                    </>
                ))}
            </div>

            {countdownData.timeUp && (
                <div className="justify-center items-center w-full text-center h-15 m-10 text-pink-200 text-5xl">
                    <p>Time Up!!!</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center w-full text-center h-15 gap-5 sm:gap-10 px-5 md:px-25 mt-4">
                <Button text={countdownData.isActive ? "Pause" : "Start"} className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl" onClick={toggleTimer} />
                <Button text="Reset"
                        className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl"
                        disabled={!countdownDuration}
                        onClick={() => resetTimerMutation.mutate()} />
            </div>
        </div>
    );
}

export default CountDown;