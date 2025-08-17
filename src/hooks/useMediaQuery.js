import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        console.log(query)
        const media = window.matchMedia(query);
        console.log("window.matchMedia(query): " + media.matches)
        if(media.matches !== matches) {
            setMatches(media.matches);
        }
             
        let listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => { media.removeEventListener('change',listener) };
    }, [matches, query]);

    return matches;
}

