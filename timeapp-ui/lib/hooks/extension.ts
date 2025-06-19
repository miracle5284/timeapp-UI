import { useEffect, useRef, useState } from "react";
import { useNotificationPermission } from "../browsers.ts";
import { sendNotification } from "../system.ts";
import { CHROME_EXTENSION_PREFIX_URL } from "../../constant.ts";
import timeLogo from "../../src/assets/clock-circle-svgrepo-com.svg";
import { useQuery } from "@tanstack/react-query";
import { getExtensionInfo } from "../api";

// Globals for managing extension status and observers
let observer: MutationObserver | null = null;
let extensionId: string;
let extensionTitle: string;

const extensionTrackerAttr = "data-timer-extension";
const extensionHandshakeInterval = 10000;
const extensionInstallBtnId = "installLink";
const extensionEnableBtnId = "enableLink";
const extensionPromptId = "extensionPrompt";
const dataContainerId = "data-container";
const extensionName = "timer-keeper";

/**
 * Custom hook to manage and monitor the status of the Timer Keeper Chrome Extension.
 */
export const useExtensionStatus = () => {
    const [isActive, setIsActive] = useState(false);
    const { isGranted: notificationPermissionGranted } = useNotificationPermission();
    const interval = useRef<NodeJS.Timeout | null>(null);
    const isHandshakeRunning = useRef(false);
    const dataContainerDivRef = useRef<HTMLElement | null>(null);
    const extensionPromptDivRef = useRef<HTMLElement | null>(null);

    /**
     * Update the DOM elements (prompt + container) based on extension status.
     */
    const updatePromptVisibility = () => {
        if (extensionPromptDivRef.current) extensionPromptDivRef.current.style.display = isActive ? "none" : "block";
        if (dataContainerDivRef.current) {
            dataContainerDivRef.current.setAttribute(extensionTrackerAttr, isActive ? "active" : "inactive");
        }
    };

    /**
     * Observe changes to the data-container element for extension status toggling.
     */
    const resumeObserver = () => {
        if (observer && dataContainerDivRef.current) {
            observer.observe(dataContainerDivRef.current, {
                attributes: true,
                attributeFilter: [extensionTrackerAttr],
            });
        }
    };

    /**
     * Stop observing changes to data-container attributes.
     */
    const stopObserver = () => {
        if (observer) observer.disconnect();
    };

    /**
     * Checks the extension cookie and adjusts install/enable prompt buttons accordingly.
     */
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
                    extensionInstallBtn.style.display = "none";
                    extensionEnableBtn.style.display = "inline";
                    extensionEnableBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        showExtensionWarning();
                    });
                }
            } else {
                if (extensionPrompt) extensionPrompt.style.display = "block";
                if (extensionInstallBtn) extensionInstallBtn.style.display = "inline";
                if (extensionEnableBtn) extensionEnableBtn.style.display = "none";

                extensionInstallBtn?.addEventListener("click", () => {
                    window.location.href = `${CHROME_EXTENSION_PREFIX_URL}/${extensionTitle}/${extensionId}`;
                });
            }
        } catch (error) {
            console.error("Error checking for extension:", error);
        }
    };

    /**
     * Sends a ping to the extension to confirm it's active.
     */
    const checkExtensionHandshake = () => {
        if (window.chrome?.runtime && extensionId) {
            window.chrome.runtime.sendMessage<PongResponse>(extensionId, { type: "PING_FROM_PAGE" }, (response) => {
                const success = !window.chrome?.runtime?.lastError && response?.type === "PONG_FROM_EXTENSION";
                setIsActive(success);
            });
        } else {
            setIsActive(false);
        }
    };

    /**
     * Starts the interval that checks for extension connection every few seconds.
     */
    const startExtensionHandshake = (instant?: boolean) => {
        if (isHandshakeRunning.current) return;

        if (instant) checkExtensionHandshake()
        interval.current = setInterval(checkExtensionHandshake, extensionHandshakeInterval);
        isHandshakeRunning.current = true;
    };

    /**
     * Initializes a MutationObserver to watch for status updates via data attributes.
     */
    const getExtensionObserver = () => {
        return new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes" && mutation.attributeName === extensionTrackerAttr) {
                    if ((mutation.target as HTMLElement).getAttribute(extensionTrackerAttr) === "active") {
                        if (!isHandshakeRunning.current) {
                            startExtensionHandshake(true);
                        }
                    }
                }
            }
        });
    };

    /**
     * Shows a modal warning if the extension is not detected.
     */
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

    /**
     * Wait for the DOM to fully mount before grabbing references and starting observation.
     */
    useEffect(() => {
        const waitForDOMRefs = () => {
            const prompt = document.getElementById(extensionPromptId);
            const container = document.getElementById(dataContainerId);

            if (prompt && container) {
                extensionPromptDivRef.current = prompt;
                dataContainerDivRef.current = container;

                observer = getExtensionObserver();

                // check if extension has already been injected, then we will manually mark the data div as active
                const preInjectedStatus = container.getAttribute(extensionTrackerAttr);
                if (preInjectedStatus === "active") {
                    setTimeout(() => {
                        dataContainerDivRef.current!.setAttribute(extensionTrackerAttr, "active")
                    }, 1000);
                }
                startExtensionHandshake();
                resumeObserver();
            } else {
                requestAnimationFrame(waitForDOMRefs);
            }
        };

        waitForDOMRefs();

        return () => {
            stopObserver();
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
            isHandshakeRunning.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * React to changes in `isActive` and update UI or notify user accordingly.
     */
    useEffect(() => {
        if (!isActive) {
            sendNotification({
                notificationPermissionGranted: notificationPermissionGranted && document.visibilityState !== "visible",
                title: "Timer Keeper is inactive",
                body: "Please enable the Timer Keeper extension for optimum results.",
                requireInteraction: true,
                icon: timeLogo
            });
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
            isHandshakeRunning.current = false;
            resumeObserver();
        } else {
            stopObserver();
        }

        checkForExtension();
        updatePromptVisibility();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, notificationPermissionGranted]);

    /**
     * Fetch extension metadata (ID, title) on mount.
     */
    const { data, isLoading } = useQuery({
        queryFn: getExtensionInfo,
        queryKey: ['getExtensionInfo']
    });

    useEffect(() => {
        if (data && !isLoading) {
            extensionId = data.EXTENSION_ID;
            extensionTitle = data.EXTENSION_NAME;
        }
    }, [data, isLoading]);

    return isActive;
};
