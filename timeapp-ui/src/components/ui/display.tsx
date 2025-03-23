import React from "react"


const Display: React.FC<{value: string[], label: string}> = ({value, label}) => {
    return (
        <div className="flex flex-col items-center text-white">
            <div className="flex">
                {value.map((char, index) => (
                    <div key={index} className="overflow-hidden mx-[0.5px] bg-[#111] h-30 w-20 relative rounded-sm my-[0px]
                     border border-black shadow-[0_2px_4px_rgba(0,0,0,0.5)] before:content-[''] before:absolute
                      before:top-1/2 before:left-0 before:right-0 before:bg-[#333] before:z-[2] before:h-0.5">
                        <div className="absolute w-2 h-5 bg-[#222] z-3 left-[-4px] top-[calc(50%-10px)]"></div>
                        <div className="relative flex w-full h-full justify-center text-center items-center">
                            <div className="text-[5rem] font-thin leading-none">{char}</div>
                        </div>
                        <div className="absolute w-2 h-5 bg-[#222] z-3 right-[-4px] top-[calc(50%-10px)]"></div>
                    </div>
                ))}
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
