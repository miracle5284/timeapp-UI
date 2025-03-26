import React from "react";


type DisplayProps = React.HTMLAttributes<HTMLDivElement> & {
    value: string[] | number[],
    label: string,
    topComponent?: React.ReactNode[],
    downComponent?: React.ReactNode[],
    childrenEvents?: Partial<React.HTMLAttributes<HTMLElement>>,
    triggerIndex: string | null
}
const Display: React.FC<DisplayProps> = (
    {value, label, topComponent, downComponent, childrenEvents, triggerIndex, ...props}) => {
    return (
        <div className="flex flex-col items-center text-white" {...props}>
            <div className="flex">
                {value.map((char, index) =>  (
                        <>
                            <div
                                id={`${index}`}
                                className="flex flex-col justify-center items-center opacity-80 pb-6"
                                {...childrenEvents}
                            >
                                <div className="h-4">
                                    {(!childrenEvents || (triggerIndex && triggerIndex === String(index))) && topComponent}
                                </div>
                                <div key={index} className="overflow-hidden mx-[0.5px] mt-3 bg-[#111] h-30 w-20 relative rounded-sm my-[2px]
                             border border-black shadow-[0_2px_4px_rgba(0,0,0,0.5)] before:content-[''] before:absolute
                              before:top-1/2 before:left-0 before:right-0 before:bg-[#333] before:z-[2] before:h-0.5">
                                    <div className="absolute w-2 h-5 bg-[#222] z-3 left-[-4px] top-[calc(50%-10px)]"></div>
                                    <div className="relative flex w-full h-full justify-center text-center items-center">
                                        <div className="text-[5rem] font-thin leading-none">{`${char}`}</div>
                                    </div>
                                    <div className="absolute w-2 h-5 bg-[#222] z-3 right-[-4px] top-[calc(50%-10px)]"></div>
                                </div>
                                <div className="h-4">
                                    {childrenEvents? triggerIndex && triggerIndex === String(index) && downComponent: downComponent}
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
            <div className="text-[#666] text-[0.8rem] tracking-[2px] mt-2 text-center">{label}</div>
        </div>
    )
};

export default Display;

export const Colon = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 mx-2 opacity-80 pb-6">
            <div className="bg-[#666] w-3 h-3 rounded-full"></div>
            <div className="bg-[#666] w-3 h-3 rounded-full"></div>
        </div>
    )
}
