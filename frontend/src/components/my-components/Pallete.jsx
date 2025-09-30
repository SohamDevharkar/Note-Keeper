import { useQueryClient } from "@tanstack/react-query";
import { useNoteUpdateMutation } from "../../hooks/useNoteUpdateMutation";
import { isDev } from "../../utils/devLoggerUtil";

export const Pallete = ({ id, setShowPalette, setBgColor, isOnline, selectedNote}) => {
    
    const Colors = [
        'bg-white',
        'bg-yellow-300',
        'bg-green-300',
        'bg-blue-300',
        'bg-pink-300',
        'bg-purple-300',
    ]

    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username')
    const updateNoteMutation = useNoteUpdateMutation(userName, queryClient, isOnline);

    const onColorChange = (targetColor) => {
        if(id && !selectedNote) {          
            const existingNote = queryClient.getQueryData(['notes', userName])?.find(note => note.client_id === id);
            updateNoteMutation.mutate({
                ...existingNote,
                bgColor: targetColor, 
                updated_at: new Date().toISOString(), 
                sync_status: isOnline ? 'synced' :'pending'
            })
        }

        if(setBgColor) {
            if(isDev()) {console.log("changing bgcolor for either modal or noteinput.");}
            setBgColor(targetColor);
        }

        if(setShowPalette) {
            setShowPalette(false);
        }
    }

    return (
        <div className={` ${id ? 'absolute bottom-full  left-1/2 -translate-x-1/2 flex border-0 opacity-100 rounded bg-white shadow' 
        : 'absolute bottom-full right-1/2 -translate-x-1/2  translate-y-56 flex border-0 opacity-100 rounded bg-white shadow'}`}>
            {
                Colors.map((color) => (
                    <button
                        key={color}
                        className={`${color} w-5 h-5 rounded-full mx-1 border-2 border-gray-200 hover:border-black 
                        focus:border-black`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPalette(false)
                            onColorChange(color);
                            setShowPalette(false);
                        }}
                    />
                ))
            }
        </div>
    )
}