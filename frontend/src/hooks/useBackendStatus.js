import axios from "axios";
import { useEffect, useState } from "react";

export function useBackendStatus(pingUrl = 'http://127.0.0.1:5000/api/v1/ping') {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const checkBackend = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                if (!navigator.onLine) {
                    setIsOnline(false)
                }

                try {
                    await axios.get(pingUrl,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        },
                    );
                    if (!isOnline) setIsOnline(true);
                } catch (error) {
                    if (isOnline) setIsOnline(false);
                }
                console.log("Backend status (isOnline): ", isOnline);
            }
        }
        checkBackend();
        const interval = setInterval(checkBackend, 10000);
        return () => { clearInterval(interval) }

    }, [pingUrl, isOnline])
    return isOnline;
}  