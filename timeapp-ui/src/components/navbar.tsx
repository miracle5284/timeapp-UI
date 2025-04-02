import { Menu, X } from "lucide-react"
import {useEffect, useState} from "react";
import {navItems} from "../../constant.ts";
import {Modal} from "./ui/modal.tsx";
import AuthSwitcher from "./auth-switcher.tsx";

function Navbar() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<null | string>(null);

    useEffect(() => {
        console.log(authModalView, 'view')
    }, [authModalView]);

    const toggleNavbar  = () => setMobileNavOpen(!mobileNavOpen);
    return (
        <>
            <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
                <div className="container px-4 mx-auto relative text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center flex-shrink-0">
                            <span className="text-xl tracking-tight">Chrona</span>
                        </div>
                        <ul className="hidden lg:flex ml-14 space-x-12">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <a href={item.href}>{item.label}</a>
                                </li>
                            ))}
                        </ul>
                        <div className="hidden lg:flex justify-center space-x-12 items-center">
                            <a href="#" className="py-2 px-3 rounded-md" onClick={() => setAuthModalView("sign-in")}>Sign In</a>
                            <a href="#" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                                onClick={() => setAuthModalView("sign-up")}
                            >
                                Create an account
                            </a>
                        </div>
                        <div className="lg:hidden md:flex flex-col justify-end">
                            <button onClick={toggleNavbar}>
                                {mobileNavOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                    {mobileNavOpen && (
                        <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul>
                            {navItems.map((item, index) => (
                                <li key={index} className="py-4">
                                    <a href={item.href}>{item.label}</a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex space-x-6">
                            <a href="#" className="py-2 px-3 rounded-md" onClick={() => {
                                setAuthModalView("sign-in")
                            }}>
                                Sign In
                            </a>
                            <a href="#" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3
                            rounded-md" onClick={() => setAuthModalView("sign-up")}>
                                Create an account
                            </a>
                        </div>
                    </div>
                    )}
                </div>
            </nav>
            {authModalView && (
                <Modal
                    isOpen={!!authModalView}
                    onClose={() => setTimeout(() => setAuthModalView(null), 1300)}
                >
                    <AuthSwitcher signUp={authModalView === "sign-up"}/>

                </Modal>
                )
            }
        </>
    )
}

export default Navbar;