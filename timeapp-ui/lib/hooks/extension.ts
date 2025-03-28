import {useEffect, useState} from "react";
import {useNotificationPermission} from "../browsers.ts";
import {sendNotification} from "../system.ts";
import {CHROME_EXTENSION_PREFIX_URL} from "../../constant.ts";
import timeLogo from "../../src/assets/clock-circle-svgrepo-com.svg";
import {useQuery} from "@tanstack/react-query";
import {getExtensionInfo} from "../api.tsx";

let interval: number = 0;
let observer: MutationObserver | null = null;
let extensionInitialized: boolean | null = null;
let extensionId: string;
let extensionTitle: string;

const extensionTrackerAttr = "data-timer-extension";
const extensionHandshakeInterval = 10000;
const extensionInstallBtnId = "installLink";
const extensionEnableBtnId = "enableLink";
const extensionPromptId = "extensionPrompt";
const dataContainerId = "data-container";
const extensionName = "timer-keeper";



export const useExtensionStatus = () => {
    const [isActive, setIsActive] = useState(true);
    const [notificationPermission, setNotificationPermission] = useState(false);
    useNotificationPermission({permissionHook: [notificationPermission, setNotificationPermission]})
    const [ready, setReady] = useState(false);

    const req = document.getElementById(extensionPromptId);

    useEffect(() => {
        setReady(!!req)
    }, [req]);

    useEffect(() => {
        if (!isActive) {
            sendNotification({
                notificationPermission: notificationPermission && document.visibilityState !== "visible",
                title: "Timer Keeper is inactive",
                body: "Please enable the Timer Keeper extension for optimum results.",
                requireInteraction: true,
                icon: timeLogo
            })

        }
    }, [isActive, notificationPermission]);

    const {data, isLoading} = useQuery({
            queryFn: getExtensionInfo,
            queryKey: ['getExtensionInfo']
        }
    )

    useEffect(() => {

        if (data && !isLoading) {
            extensionId = data.EXTENSION_ID
            extensionTitle = data.EXTENSION_NAME
        }
    }, [data, isLoading]);

    useEffect(() => {
        const extensionPromptDiv = document.getElementById(extensionPromptId);
        const dataContainerDiv = document.getElementById(dataContainerId);


        const checkForExtension = () => {
            try {
                const extensionEnableBtn = document.getElementById(extensionEnableBtnId);
                const extensionInstallBtn = document.getElementById(extensionInstallBtnId);
                const extensionPrompt = document.getElementById(extensionPromptId);

                const extensionData = document.cookie
                    .split(";")
                    .map(row => row.trim())
                    .find(row => row.startsWith(`${extensionName}=`));
                if (extensionData) {
                    const extensionDetails = JSON.parse(extensionData.split("=")[1]);
                    if (extensionEnableBtn && extensionInstallBtn && extensionDetails.installed) {
                        extensionInitialized = true;
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        extensionInstallBtn && (extensionInstallBtn.style.display = "none")
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        extensionEnableBtn && (extensionEnableBtn.style.display = "inline");
                        extensionEnableBtn?.addEventListener("click", (e) => {
                            e.preventDefault();
                            showExtensionWarning()
                        });
                    }
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    extensionPrompt && (extensionPrompt.style.display = "block");
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    extensionInstallBtn && (extensionInstallBtn.style.display = "inline");
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    extensionEnableBtn && (extensionEnableBtn.style.display = "none");

                    extensionInstallBtn?.addEventListener("click", () => {
                        window.location.href = `${CHROME_EXTENSION_PREFIX_URL}/${extensionTitle}/${extensionId}`;
                    });
                }
            } catch (error) {
                console.error("Error checking for extension:", error);
            }
        };

        const checkExtensionHandshake = () => {
            if (window.chrome?.runtime && extensionId) {
                window.chrome.runtime.sendMessage(extensionId, { type: "PING_FROM_PAGE" }, (response) => {
                    const success = !window.chrome?.runtime?.lastError && response?.type === "PONG_FROM_EXTENSION";
                    setIsActive(success)
                    updatePromptVisibility(success)
                });
            } else {
                setIsActive(false);
                updatePromptVisibility(false);
            }
        };

        const updatePromptVisibility = (active: boolean) => {
            if (extensionPromptDiv) extensionPromptDiv.style.display = active ? "none" : "block";
            if (dataContainerDiv) {
                dataContainerDiv.setAttribute(extensionTrackerAttr, active ? "active" : "inactive");
            }
        };

        const getExtensionObserver = () => {
            return new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === extensionTrackerAttr) {
                        if ((mutation.target as HTMLElement).getAttribute(extensionTrackerAttr) === "active") {
                            startExtensionHandshake();
                        }
                    }
                }
            });
        };

        const startExtensionHandshake = () => {
            if (!extensionInitialized) {
                setTimeout(() => {
                    checkForExtension();
                    checkExtensionHandshake();
                });
            }
            interval = setInterval(checkExtensionHandshake, extensionHandshakeInterval);
        };

        const resumeObserver = () => {
            if (observer && dataContainerDiv) {
                observer.observe(dataContainerDiv, { attributes: true, attributeFilter: [extensionTrackerAttr] });
            }
        };

        const stopObserver = () => {
            if (observer) observer.disconnect();
        };

        const showExtensionWarning = () => {
            let modal = document.getElementById("instruction-modal");
            if (!modal) {
                modal = document.createElement("div");
                modal.id = "instruction-modal";
                modal.style.display = "flex";
                modal.innerHTML = `
          <div class="modal-content">
            <h2>Extension Not Detected ⚠️</h2>
            <p>Enable the Timer Keeper Active extension for the best performance.</p>
            <p><strong>Without the extension:</strong> Background timers may be throttled, affecting accuracy.</p>
            <ol>
              <li>Open <code>chrome://extensions</code> in Chrome.</li>
              <li>Find <strong>Timer Keeper Active</strong>.</li>
              <li>Enable the extension.</li>
            </ol>
            <p><a href="https://github.com/miracle5284/timer-keeper-extension" target="_blank">Need Help?</a></p>
            <button onclick="document.getElementById('instruction-modal').style.display='none'">Close</button>
          </div>
        `;
                document.body.appendChild(modal);
            }
            modal.style.display = "block";
        };

        observer = getExtensionObserver();
        startExtensionHandshake();
        resumeObserver();

        return () => {
            stopObserver();
            clearInterval(interval);
        };
    }, [ready]);

    return isActive;
};