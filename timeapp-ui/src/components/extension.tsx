import { useExtensionStatus } from "../../lib/hooks"


export const ExtensionPrompt = () => {
    const isExtensionActive = useExtensionStatus();

    if (isExtensionActive) return null;

    return (
        <>
            <div
                id="data-container"
                data-active=""
            ></div>
            <div id="extensionPrompt" className="mt-4 text-sm text-yellow-400">
                For the best experience, please{" "}
                <span
                    id="installLink"
                    rel="noopener noreferrer"
                >
                    <a target="_blank" href="#" className="underline">
                        install
                    </a>
                    {" "} and activate
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
        </>
    );
};

export default ExtensionPrompt;
