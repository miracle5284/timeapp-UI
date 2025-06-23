import './index.css';
import { Routes, Route } from "react-router-dom";
import CountDown from "./pages/countdown";
import Navbar from "./components/navbar";
import OAuthPopup from "./pages/popups/oauth-popup";
//import { registerSW } from 'virtual:pwa-register';
import { NotificationPermissionPrompt } from "./components/permission-prompt";
import { useInstallPrompt }     from "../lib/hooks/useInstallPrompt";
import { useIosInstall }         from "../lib/hooks/useIosInstall";
import { useSafariInstallBanner } from "../lib/hooks/useSafariInstall";

// registerSW({
//     onNeedRefresh()  { console.log('Chrona is ready for online use;') },
//     onOfflineReady() { console.log('Chrona is ready for offline use;') }
// });

function App() {
    const { ready, promptInstall }  = useInstallPrompt();
    const { showBanner }            = useIosInstall();
    const showSafariBanner          = useSafariInstallBanner();

    return (
        <div className="min-h-screen max-h-screen h-screen flex flex-col bg-[#111]">
            {/* macOS Safari: File→Add to Home Screen */}
            {showSafariBanner && (
                <div
                    className="
                      fixed
                      inset-x-0
                      top-16               /* push below a 4rem-high navbar */
                      bg-yellow-300
                      text-gray-800
                      text-center
                      px-4 py-2
                      z-50
                    "
                >
                    To install Chrona on macOS Safari:<br/>
                    • On Sonoma+ (Safari 17): File → Add to Dock…<br/>
                    • On earlier Safari: use the Share ▶︎ menu—choose “Add to Home Screen” or “Add to Dock” as available.
                </div>

            )}

            {/* iOS in-browser: Share→A2HS */}
            {showBanner && (
                <div className="fixed inset-x-0 top-0 bg-blue-600 text-white text-center px-4 py-2 z-50">
                    Tap <strong>Share ⤴</strong> then <strong>Add to Home Screen</strong>
                </div>
            )}

            {/* Chromium install button */}
            {ready && (
                <button
                    onClick={promptInstall}
                    className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full shadow-lg z-50 transition"
                >
                    Install Chrona
                </button>
            )}

            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <Routes>
                    <Route path="/"            element={<CountDown />} />
                    <Route path="/countdown"   element={<CountDown />} />
                    <Route path="/oauth/popup" element={<OAuthPopup />} />
                </Routes>
            </main>

            <NotificationPermissionPrompt />
        </div>
    );
}

export default App;
