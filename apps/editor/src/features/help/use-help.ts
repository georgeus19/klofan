import { ReactNode, useState } from 'react';

export type ShownHelp = { content: ReactNode } | null;

export type Help = {
    shownHelp: ShownHelp;
    showHelp: (content: ReactNode) => void;
    hideHelp: () => void;
};

/**
 * Logic for showing help to user. Visualised Help is react component or null in which case nothing is shown.
 */
export function useHelp(): Help {
    const [shownHelp, setShownHelp] = useState<ShownHelp>(null);

    const showHelp = (content: ReactNode) => setShownHelp({ content: content });
    const hideHelp = () => setShownHelp(null);

    return {
        shownHelp,
        showHelp,
        hideHelp,
    };
}
