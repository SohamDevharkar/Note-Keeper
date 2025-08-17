import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        let listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => { media.removeEventListener('change', listener) };
    }, [matches, query]);

    return matches;
}

