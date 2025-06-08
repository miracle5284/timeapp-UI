import './index.css';
import { Routes, Route } from "react-router-dom"
import CountDown from "./pages/countdown";
import Navbar from "./components/navbar.tsx";
import OAuthPopup from "./pages/popups/oauth-popup.tsx";
// import { registerSW } from 'virtual:pwa-register';
import {NotificationPermissionPrompt} from "./components/permission-prompt.tsx";

// registerSW({
//     onNeedRefresh() {
//         console.log('Chrona is ready for online use;')
//
//     },
//     onOfflineReady() {
//         console.log('Chrona is ready for offline use;')
//     }
// })

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('/sw.js', {
//             scope: '/'
//         })
//         .then(async registration => {
//             console.log('Service worker registered:', registration);
//
//             const swReady = await navigator.serviceWorker.ready;
//
//             console.log('[SW] Ready', swReady)
//
//             if (swReady.active) {
//                 swReady.active.postMessage({type: 'PING'});
//             }
//
//             fetch('/sw-ping?_=' + Date.now()).catch(() => {});
//         })
//         .catch(error => {
//             console.error('Service worker registration failed:', error);
//         });
// }

function App() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#222222]">
                <Routes>
                    <Route path="/" element={<CountDown />} />
                    <Route path="/countdown" element={<CountDown />} />
                    {/*<Route path="/stopwatch" element={<Stopwatch />} />*/}
                    <Route path="/oauth/popup" element={<OAuthPopup />} />
                </Routes>
            </main>
            <NotificationPermissionPrompt />
        </>
    )
}

export default App;
