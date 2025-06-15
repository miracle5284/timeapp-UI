import CountDownComponent from "./main";
import ExtensionPrompt from "../../components/extension";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ICountdownResponse, IStartCountdown, TimerResponse} from "./dtypes.tsx";
import {deleteCountdown, getCountdown, startCountdown} from "./api.tsx";
import CarouselScreen from "../../components/carousel-screen.tsx";
import {useState} from "react";


function Countdown () {

    const queryClient = useQueryClient()
    const { data, isLoading, error } = useQuery<TimerResponse>({
        queryKey: ['getTimers'],
        queryFn: () => getCountdown(),
    })
    const removeTimer = useMutation({
        mutationFn: (id: string) => deleteCountdown(id),
        onSuccess: (_void, id) => {
            queryClient.invalidateQueries({ queryKey: ['getTimers'] });
            const idx = data?.results?.findIndex(t => t.id === id) ?? 0
            setCurrent(prev => Math.max(0, prev > idx ? prev - 1 : prev))
        }
    })

    const [current, setCurrent] = useState(0)

    const createTimer = useMutation<ICountdownResponse, Error, IStartCountdown>({
        mutationFn: ({ name, durationSeconds, timestamp }) =>
            startCountdown( null, name, durationSeconds, timestamp),
        onSuccess: () => {
            console.log("OOOOOOO");
            queryClient.invalidateQueries({queryKey: ['getTimers']})
            // setCurrent(0)
            }
        }
    )

    if (isLoading) return <div>Loading timers...</div>
    if (error || !data) return <div>Error loading timers...</div>

    return (
        <>
            <CarouselScreen
                initialSlide={current}
                onSlideChange={setCurrent}
                addButtonFn={() => {
                    console.log('aaaa',);
                    createTimer.mutate(
                { name: `Timer ${data.results.length + 1}`, durationSeconds: 0, timestamp: new Date().toISOString(),
                    id: null, status: "inactive" }
            )}}>
                {data.results.map((timers) =>
                    <CountDownComponent
                        id={timers.id}
                        timerId={timers.id}
                        onDelete={() => removeTimer.mutate(timers.id)}/>
                )}

            </CarouselScreen>
            <ExtensionPrompt />
        </>
    )
}

export default Countdown;