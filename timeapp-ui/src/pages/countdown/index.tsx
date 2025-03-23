import Display, { Colon } from '../../components/ui/display';
import { Button } from '../../components/ui/ui-assets';
import './index.css'


function CountDown() {

    return (
        <div
            className="t-container">
            <div className="mt-20 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Display value={['1', '4']} label="HOURS" />
                <Colon />
                <Display value={['3', '7']} label="MINUTES" />
                <Colon />
                <Display value={['0', '8']} label="SECONDS" />
            </div>

            <div className="justify-center items-center w-full text-center h-15 m-10 text-pink-200 text-5xl">
                <p>Time Up!!!</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center w-full text-center h-15 gap-5 sm:gap-10 px-5 md:px-25 mt-4">
                <Button text="Start" className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl" />
                <Button text="Reset" className="w-full sm:min-w-4 text-lg sm:text-xl md:text-2xl" />
            </div>
        </div>

    )
}

export default CountDown;
