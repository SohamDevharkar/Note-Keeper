import axios from "axios";
import { useEffect, useState } from "react";
import { isDev } from "../utils/devLoggerUtil";
import baseUrl from "../utils/apiConfig"

export function useBackendStatus(pingUrl = `${baseUrl}/api/v1/ping`) {
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
                if(isDev()){console.log("Backend status (isOnline): ", isOnline);}
            }
        }
        checkBackend();
        const interval = setInterval(checkBackend, 10000);
        return () => { clearInterval(interval) }

    }, [pingUrl, isOnline])
    return isOnline;
}  