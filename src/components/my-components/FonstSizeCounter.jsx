import { useState, useEffect } from "react";

export function FontSizeCounter({ editor, min = 8, max = 72, step = 1 }) {
    // Get the current font size from editor attributes (strip "px")
    const currentFontSizeRaw = editor.getAttributes('textStyle').fontSize || '';
    const currentFontSize =
        currentFontSizeRaw ? parseInt(currentFontSizeRaw.replace('px', '')) : 16; // Default to 16

    // Internal state to allow onBlur confirmation/user typing
    const [fontSize, setFontSize] = useState(currentFontSize);

    // Sync with editor updates
    useEffect(() => {
        setFontSize(currentFontSize);
    }, [currentFontSize]);

    const updateFontSize = (newSize) => {
        const safeSize = Math.max(min, Math.min(max, newSize));
        setFontSize(safeSize);
        editor.chain().focus().setFontSize(safeSize + "px").run();
    };

    return (
        <div className="flex items-center gap-1">
            
            <button
                onClick={() => updateFontSize(fontSize - step)}
                className="px-1 focus:bg-gray-200 rounded"
                disabled={fontSize <= min}
                aria-label="Decrease font size"
            >-</button>
            <input
                type="number"
                min={min}
                max={max}
                value={fontSize}
                onChange={e => {
                    const value = parseInt(e.target.value) || min;
                    setFontSize(value);
                }}
                onBlur={e => updateFontSize(parseInt(e.target.value) || min)}
                className="w-8 items-center text-center py-0.5 bg-slate-100 rounded border no-spin"
                aria-label="Font size input"
            />
            <button
                onClick={() => updateFontSize(fontSize + step)}
                className="px-1 focus:bg-slate-200 rounded"
                disabled={fontSize >= max}
                aria-label="Increase font size"
            >+</button>
        </div>
    );
}
