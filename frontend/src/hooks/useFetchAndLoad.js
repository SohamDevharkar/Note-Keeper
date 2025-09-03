import axios from "axios";
import { useEffect } from "react";
import { db } from '../utils/indexedDB'
import { useQuery } from "@tanstack/react-query";

export const useFetchAndLoad = (queryClient, userName) => {
    const fetchNotesApi = async () => {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/api/v1/notes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // console.log("response data: " + response.data)
        return response.data;
    }

    useEffect(() => {
        async function loadIndexedDB() {
            const cachedNotes = await db.notes.toArray();
            queryClient.setQueryData(['notes', userName], [...cachedNotes]);
        }
        loadIndexedDB();
    }, [userName, queryClient])


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notes', userName],
        queryFn: fetchNotesApi,
        staleTime: 1 * 60 * 1000,
        cacheTime: 2 * 60 * 1000
    })

    useEffect(() => {
        if (data && data.length > 0) {
            console.log("Fresh notes from api: ", data);
            async function cacheNotes() {
                await db.notes.clear();
                await db.notes.bulkPut(data);
            }
            // queryClient.setQueryData(['notes', userName], data)
            cacheNotes();
            console.log("notes cached in IndexedDB");
        }
    }, [data])

    return {data, isLoading, error, isError}

}