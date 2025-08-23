export const Pallete = ({ id, setShowPalette, setColor, notes, setNotes }) => {
    //{ id, showPalette, setShowPalette, notes, setNotes, setSelectedNote}
    const Colors = [
        'bg-white',
        'bg-yellow-300',
        'bg-green-300',
        'bg-blue-300',
        'bg-pink-300',
        'bg-purple-300',
    ]

    const onColorChange = (id, targetColor) => {
        if (setColor) {
            //updating  bg-color locally for modal view container
            setColor(targetColor);
        } else {
            // updating globally for note cards.
            const updatedNotes = notes.map((note) => {
                if (id === note.id) {
                    return { ...note, color: targetColor }
                }
                return note;
            })
            setNotes(updatedNotes);
            sessionStorage.setItem("noteList", JSON.stringify(updatedNotes));
        }
        setShowPalette(false);
    }

    return (
        <div className="absolute bottom-full  left-1/2 -translate-x-1/2 
                flex border-0 opacity-100 rounded bg-white shadow ">
            {
                Colors.map((color) => (
                    <button
                        key={color}
                        className={`${color} w-5 h-5 rounded-full mx-1 border-2 border-gray-200 hover:border-black 
                        focus:border-black`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPalette(false)
                            onColorChange(id, color);
                            
                            console.log("modal expected color: " + color);
                            // update local modal color only'

                            setShowPalette(false);
                        }}
                    />
                ))
            }

        </div>
    )
}