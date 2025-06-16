import { useEffect, useState } from 'react';

export function useIosInstall(): { showBanner: boolean } {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const isIos = /iP(hone|ad|od)/.test(navigator.platform);
        const isStandalone = navigator.standalone === true;
        setShowBanner(isIos && !isStandalone);
    }, []);

    return { showBanner };
}