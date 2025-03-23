import './index.css';
import { Routes, Route } from "react-router-dom"
import CountDown from "./pages/countdown";

function App() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#222222]">
            <Routes>
                <Route path="/" element={<CountDown />} />
            </Routes>
        </main>
    )
}

export default App
