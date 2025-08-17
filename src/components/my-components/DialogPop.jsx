<Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center cursor-pointer w-[680px] mx-auto border-2 bg-white shadow-lg h-12 rounded-2xl m-8 px-4"
                    tabIndex={0}
                    onClick={() => setOpen(true)}>
                    <span className="flex-1 text-gray-500">Take a note...</span>
                    <span className="ml-2 font-bold text-xl text-gray-400">+</span>
                </div>
            </DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
            <DialogContent className="fixed h-[600px] w-full flex items-center justify-center z-50 p-6">

                <DialogHeader>
                    <DialogTitle className="">Add Note</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 mb-4">
                    <button title="Formatting">F</button>
                    <button title="Archive">A</button>
                    <button title="Background">B</button>
                    <button title="Undo">U</button>
                    <button title="Redo">R</button>
                </div>

                <div className="mb-4 border-b border-gray-300 pb-2">
                    <TipTapEditor value={title} onChange={setTitle} placeholder={"Title"}
                        className="focus:outline-none text-xl font-semibold w-full"
                        singleLine={true}
                    />
                </div>

                <div className="flex-1 min-h-[150px]">
                    <TipTapEditor value={content} onChange={setContent} placeholder="Write your note ..."
                        className="focus:outline-none w-full min-h-[150px]"
                    />
                </div>


                <DialogFooter className="flex justify-end mt-6 relative">
                    <DialogClose asChild>
                        <Button className="absolute bottom-0 right-0" variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>