import './index.css';
import { Routes, Route } from "react-router-dom"
import CountDown from "./pages/countdown";
import Navbar from "./components/navbar.tsx";
import OAuthPopup from "./pages/popups/oauth-popup.tsx";

function App() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#222222]">
                <Routes>
                    <Route path="/" element={<CountDown />} />
                    <Route path="/countdown" element={<CountDown />} />
                    <Route path="/stopwatch" element={<Stopwatch />} />
                    <Route path="/oauth/popup" element={<OAuthPopup />} />
                </Routes>
            </main>
        </>
    )
}

export default App;
