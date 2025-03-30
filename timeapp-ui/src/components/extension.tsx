import { useExtensionStatus } from "../../lib/hooks";

export const ExtensionPrompt = () => {
    const isExtensionActive = useExtensionStatus();

    return (
        <>
            {/* 🛠 Always rendered so MutationObserver can track it */}
            <div id="data-container" data-active="" style={{ display: "none" }} />

            {/* Prompt is only shown when inactive */}
            {!isExtensionActive && (
                <div id="extensionPrompt" className="mt-4 text-sm text-yellow-400">
                    For the best experience, please{" "}
                    <span id="installLink" rel="noopener noreferrer">
                        <a target="_blank" href="#" className="underline">install</a>
                        {" "} and {" "} activate
                    </span>{" "}
                    <a
                        id="enableLink"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        activate
                    </a>{" "}
                    the Timer Keeper Active extension.
                </div>
            )}
        </>
    );
};

export default ExtensionPrompt;
