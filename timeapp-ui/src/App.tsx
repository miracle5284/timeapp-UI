import './index.css';
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";

function App() {
    return (
        <main className="">
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </main>
    )
}

export default App
