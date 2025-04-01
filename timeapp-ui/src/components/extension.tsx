import { useExtensionStatus } from "../../lib/hooks";

export const ExtensionPrompt = () => {
    const isExtensionActive = useExtensionStatus();

    return (
        <>
            {/* Hidden container for MutationObserver */}
            <div id="data-container" data-active="" style={{ display: "none" }} />

            {!isExtensionActive && (
                <div
                    id="extensionPrompt"
                    className="text-center text-xs sm:text-sm text-yellow-300 mt-4 sm:mt-6 px-4 sm:px-0 max-w-[90%] sm:max-w-full"
                >
                    For the best experience, please{" "}
                    <a
                        id="installLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="#"
                        className="underline underline-offset-2 hover:text-yellow-200 transition"
                    >
                        install
                    </a>{" "}
                    and{" "}
                    <a
                        id="enableLink"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-yellow-200 transition"
                    >
                        activate
                    </a>{" "}
                    the <strong>Timer Keeper Active</strong> extension.
                </div>
            )}
        </>
    );
};

export default ExtensionPrompt;
