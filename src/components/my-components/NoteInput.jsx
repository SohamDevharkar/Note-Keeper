import { useEffect, useState, useRef} from "react";
import {TipTapEditor} from "./Tiptap";
import { MdFormatColorText } from "react-icons/md";
import { RiInboxArchiveLine } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";

export const NoteInput = ({setNotes, inputOpen, setInputOpen}) => {
        
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showTipTapMenu, setShowTipTapMenu] = useState(false);
    
    const wrapperRef = useRef(null);
    const titleRef = useRef();

    useEffect(() => {
        if(inputOpen && titleRef.current) {
            titleRef.current.focus();
        }
    },[inputOpen])

    useEffect(()=> {
        function handleClickOutside(e) {
            if(wrapperRef.current && !wrapperRef.current.contains(e.target)){
                handleClose();
            }
        }

        if(open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputOpen, title, content,])


    function handleClose() {
        if(!title.trim() && !content.trim()) {
            setInputOpen(false);
        } else {
            addNote();
            setTitle("");
            setContent("");
            setInputOpen(false);
        }
    }

    function addNote() {
        const newNote = {
            id: crypto.randomUUID(),
            title: title,
            content: content,
            view: 'notes',
            prevView: undefined,
            color: 'bg-white'
        }
        const existingNotes = JSON.parse(sessionStorage.getItem('noteList')) || [];
        const updatedNotes = [...existingNotes, newNote];
        sessionStorage.setItem('noteList', JSON.stringify(updatedNotes));
        setNotes(updatedNotes)
        console.log("Note saved: ", {id: newNote.id, title: title, content: content });  
    }
 
 /*className={` w-[600px] bg-red-500 flex flex-col mt-1 mx-[400px] rounded-sm shadow-2xl border z-20 note-expand${open ? ' open' : ''}`}*/  
 /**min-w-[300px] max-w-[720px] */ 

    
    return (
    <div ref={wrapperRef} 
        className={`relative top-5 transform left-1/2 -translate-x-1/2 w-full max-w-[680px]
        min-w-[300px] px-8 sm:px-18 md:px-20 sm:ml-0 transition-transform duration-300
        `}>
            {!inputOpen ? (
                //collapsed state
                <div onClick={() => setInputOpen(true)}
                    className="bg-white shadow-md rounded-xl px-4 py-3 
                    cursor-text border hover:shadow-lg transition-all">
                        <span className="text-gray-500">
                            Take a note...
                        </span>

                </div>
            ):(
                //expanded state
                <div className="bg-white shadow-xl rounded-xl px-4 py-4 transition-all duration-500 z-100 min-h-[150px]">
                    <input ref={titleRef} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-lg font-medium focus:outline-none mb-4" />
                    <hr/>    
                    <div className={`${inputOpen ? 'pt-1 w-full' : 'hidden'} bg-white  `}>
                        <TipTapEditor
                            value={content}
                            onChange={setContent}
                            showTipTapMenu={showTipTapMenu}
                            placeholder="Write your note..."
                            className="w-full min-h-[100px] resize-none focus:outline-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-4 text-gray-600">
                                <button title="Formatting" className="hover:text-black" onClick={
                                ()=> setShowTipTapMenu(!showTipTapMenu)}>
                                    <MdFormatColorText />
                                </button>
                                <button title="Archive" className="hover:text-black">
                                    <RiInboxArchiveLine/>
                                </button>
                                <button title="Background" className=" hover:text-black">
                                    <IoColorPaletteOutline />
                                </button>
                            </div>       
                            <button title="Close" className="text-sm px-3 py-1 bg-gray-100 
                                hover:bg-gray-200 rounded"  onClick={() => 
                                    handleClose()}>
                                    Close
                            </button>        
                        </div>
                    </div>
                </div>    
            )}    
        </div>
    )
};


// <div className="w-full flex justify-center mt-8 ">
        //     {
        //         !open ? (
        //             <div className="flex items-center cursor-pointer w-[600px] border-2 bg-white shadow-lg h-12 rounded-2xl px-4"
        //                 onClick={() => setOpen(true)}
        //                 role="button"
        //                 tabIndex={0}
        //                 onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        //                 aria-label="Expand note input"
        //             >
        //                 <span className="flex-1 text-gray-500 select-none">
        //                     Take a note...
        //                 </span>
        //                 <span className="ml-2 font-bold text-xl text-gray-400 select-none">+</span>
        //             </div>
        //         ) : (
        //             <div
        //                 className="w-[600px] bg-white rounded-2xl shadow-xl p-6 flex flex-col relative 
        //                     "
        //                 style={{ minHeight: "300px" }}
        //             >
        //                 <div className="flex gap-4 mb-4">
        //                     <button title="Formatting" className="btn  rounded border">F</button>
        //                     <button title="Archive" className="btn  rounded border">A</button>
        //                     <button title="Undo" className="btn  rounded border">U</button>
        //                     <button title="Redo" className="btn  rounded border">R</button>
        //                     <button title="Background" className="btn  rounded border">B</button>
        //                 </div>

        //                 <div className="mb-4 border-b border-gray-300 pb-2">
        //                     <TipTapEditor
        //                         value={title}
        //                         onChange={setTitle}
        //                         placeholder="Title"
        //                         className="text-xl font-semibold w-full focus:outline-none"
        //                         singleLine={true}
        //                     />
        //                 </div>

        //                 <div className="flex-1 min-h-[150px]">
        //                     <TipTapEditor
        //                         value={content}
        //                         onChange={setContent}
        //                         placeholder="Write your note..."
        //                         className="w-full min-h-[150px] focus:outline-none"
        //                     />
        //                 </div>

        //                 <button
        //                     onClick={() => setOpen(false)}
        //                     className="absolute bottom-6 right-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        //                     aria-label="Close note input"
        //                 >
        //                     Close
        //                 </button>
        //             </div>
        //         )
        //     }
        // </div>

        // return (
    //     <div className={`w-[180px] sm:w-[360px] md:w-[540px] lg:w-[720px] bg-slate-500 flex flex-col rounded-sm shadow-2xl border-4 px-4 sm:px-6 md:px-8 lg:px-10`} >
    //         <div className="w-full  text-2xl font-sans " onClick={() => setOpen(true)}>
    //             { open ? <div><input placeholder="Title" className="w-full focus:outline-none text-3xl m-1.5" onChange={(e) => setTitle(e.target.value)}/></div> : <div className="w-full focus:outline-none text-2xl my-1.5 mx-2 text-slate-500">Take a note...</div> }

    //         </div>
    //         <hr />
    //         <div className={`${open ? 'pt-1 w-full' : 'hidden'} bg-white  `}>
    //             <TipTapEditor
    //                 value={content}
    //                 onChange={setContent}
    //                 showTipTapMenu={showTipTapMenu}
    //                 placeholder="Write your note..."
    //                 className="w-full min-h-[100px] focus:outline-none"
    //             />
    //             <div className="flex gap-4 mx-1.5 ">
    //                 <button title="Formatting" className="btn  hover:bg-gray-300 rounded-4xl" onClick={
    //                     ()=> setShowTipTapMenu(!showTipTapMenu)}><MdFormatColorText /></button>
    //                 <button title="Archive" className="btn  hover:bg-gray-300 rounded-4xl"><RiInboxArchiveLine/></button>
    //                 <button title="Background" className="btn  hover:bg-gray-300 rounded-4xl"><IoColorPaletteOutline /></button>
    //                 <button title="Save" className="btn px-1 my-2 w-20 ml-80 bg-white border hover:bg-green-300 rounded-md" onClick={() => {handleOnSubmit()}} >Save</button>
                
    //                 <button title="Close" className="btn px-1 my-2 w-20  bg-white border hover:bg-gray-300 rounded-md"  onClick={() => 
    //                     {setOpen(false); setShowTipTapMenu(false)}}>Close</button>
                    
    //             </div>
    //         </div>
    //     </div >


        // original 1st attempt
        // <div className=' flex flex-col w-full'>
        //     <input type="text" placeholder='Take a note...' className='w-[600px] 
        //       mx-100 placeholder:pl-4 border-2 bg-white shadow-lg h-12 rounded-2xl m-[32px]' />
        // </div>
    //);
