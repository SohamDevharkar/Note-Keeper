import { useEditor, EditorContent } from '@tiptap/react'
import { FontSizeCounter } from './FonstSizeCounter';
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { useEffect, useRef } from 'react'
import { FaBold } from "react-icons/fa";
import { ImUnderline } from "react-icons/im";
import { FiItalic } from "react-icons/fi";

export function TipTapEditor({ value, onChange, placeholder, className, singleLine, showTipTapMenu }) {

    const editor = useEditor({
        extensions: [StarterKit.configure({
            history: {
                depth: 1000,
            }
        }),
        TextStyle,      // needed for styling marks like font size
        FontSize.configure({ types: ['textStyle'] }),
    ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange((editor.getText()))
        },
        editorProps: {
            attributes: {
                class: className,
                placeholder: placeholder,
                style: singleLine ? "min-height: 2.5rem;" : "",
            },
            handleReturn: singleLine
                ? () => true // disables new line in title (single line)
                : undefined,
        },
    })

    // Sync editor content if prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getText()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) return null
    return (<div>
        <EditorContent editor={editor} />
        {showTipTapMenu && <Menubar editor={editor} />}
    </div>)
}

function Menubar({ editor }) {
    if (!editor) return null

    const fontSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    
    const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';

    return (
        <div className="flex px-5 gap-2 bg-white w-full   ">
            {/* Formatting (Bold as example; replace with dropdown for full menu) */}
            <button
                title="Bold"
                type="button"
                className={`${editor.isActive('bold') ? 'bg-gray-300' : ''} px-1 py-1 hover:bg-gray-300 rounded-4xl`}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <FaBold />
            </button>

            {/* Underline */}
            <button
                title="Underline"
                type="button"
                className={`${editor.isActive('underline') ? 'bg-gray-300' : ''} px-1 py-1 hover:bg-gray-300 rounded-4xl`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <ImUnderline />
            </button>

            {/* Italic */}
            <button
                title="Italic"
                type="button"
                className={`${editor.isActive('italic') ? 'bg-gray-300' : ''} px-1 py-1 hover:bg-gray-300 rounded-4xl`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FiItalic />
            </button>

            {/* font size*/}
            <div className='flex items-center gap-1'>
                {/* <span className='text-sm w-15'>font size:</span>
                <select className='w-12 ml-0 py-0.5 max-height: 150px overflow-y: auto' aria-label='Select font size'
                    value={currentFontSize.replace('px', '')}
                    onChange={e => {
                        const size = e.target.value;
                        if (size === '') {
                            editor.chain().focus().unsetFontSize().run();
                        } else {
                            editor.chain().focus().setFontSize(size + 'px').run();
                        }
                    }} >
                    <option value="">${currentFontSize.replace('px','')}</option>
                    {fontSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select> */}
                <FontSizeCounter editor={editor} min={8} max={40} step={1} />
            </div>
        </div>
    )
}
