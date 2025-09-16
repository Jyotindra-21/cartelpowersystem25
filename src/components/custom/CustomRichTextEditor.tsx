'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
    FaBold, FaItalic, FaQuoteRight, FaListUl, FaListOl,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaImage, FaLink,
    FaUnderline, FaStrikethrough, FaHeading, FaParagraph,
    FaAlignJustify, FaPalette, FaUndo, FaRedo, FaTable
} from 'react-icons/fa'
import { BiCodeBlock } from 'react-icons/bi'
import { MdFontDownload } from 'react-icons/md'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface RichTextEditorProps {
    content: string
    onChange: (value: string) => void
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
    const [isHtmlMode, setIsHtmlMode] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // ✅ Initialize content only when switching modes or first load
    useEffect(() => {
        if (!isHtmlMode && editorRef.current) {
            if (editorRef.current.innerHTML !== content) {
                editorRef.current.innerHTML = content || ''
            }
        }
        if (isHtmlMode && textareaRef.current) {
            if (textareaRef.current.value !== content) {
                textareaRef.current.value = content || ''
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHtmlMode]) // ⚡ only run on mode toggle, not on every keystroke

    const exec = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        handleChange()
    }

    const handleChange = () => {
        const value = isHtmlMode
            ? textareaRef.current?.value || ''
            : editorRef.current?.innerHTML || ''
        onChange(value)
    }

    const toggleHtml = () => {
        setIsHtmlMode((prev) => !prev)
        handleChange()
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
            {/* Enhanced Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">

                {/* Text styles */}
                <div className="flex items-center gap-1 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('bold')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaBold className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('italic')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaItalic className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('underline')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaUnderline className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Underline</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('strikeThrough')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaStrikethrough className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Strikethrough</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Lists */}
                <div className="flex items-center gap-1 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('insertOrderedList')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaListOl className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaListUl className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaQuoteRight className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Blockquote</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Headings */}
                <div className="flex items-center gap-1 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('formatBlock', '<h1>')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaHeading className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('formatBlock', '<p>')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaParagraph className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Paragraph</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Alignment */}
                <div className="flex items-center gap-1 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('justifyLeft')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaAlignLeft className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('justifyCenter')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaAlignCenter className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('justifyRight')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaAlignRight className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('justifyFull')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaAlignJustify className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Justify</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Color pickers */}
                <div className="flex items-center gap-2 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <input id="text-color" type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-7 h-7 border rounded cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Text Color</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <input id="bg-color" type="color" onChange={(e) => exec('hiliteColor', e.target.value)} className="w-7 h-7 border rounded cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Background Color</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Font selector */}
                <div className="flex items-center gap-1 mr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <select onChange={(e) => exec('fontName', e.target.value)} className="p-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Georgia">Georgia</option>
                            </select>
                        </TooltipTrigger>
                        <TooltipContent>Font Family</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Insert buttons */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => { const url = prompt('Enter link URL:'); if (url) exec('createLink', url) }} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaLink className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => { const url = prompt('Enter image URL:'); if (url) exec('insertImage', url) }} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaImage className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Image</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => exec('insertHorizontalRule')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <BiCodeBlock className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Horizontal Line</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => document.execCommand('undo')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaUndo className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => document.execCommand('redo')} className="p-2 rounded hover:bg-gray-200 transition-colors">
                                <FaRedo className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                {/* Toggle HTML */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" onClick={toggleHtml} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors flex items-center gap-1">
                            {isHtmlMode ? (
                                <>
                                    <MdFontDownload className="h-4 w-4" />
                                    Rich Text
                                </>
                            ) : (
                                <>
                                    <BiCodeBlock className="h-4 w-4" />
                                    HTML
                                </>
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle HTML / Rich Text</TooltipContent>
                </Tooltip>
            </div>

            {/* Editor */}
            <div className="p-4 min-h-[300px] bg-white">
                {isHtmlMode ? (
                    <textarea
                        ref={textareaRef}
                        defaultValue={content}
                        onInput={handleChange}
                        className="w-full h-[300px] p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your HTML content here..."
                    />
                ) : (
                    <div
                        ref={editorRef}
                        onInput={handleChange}
                        className="prose max-w-none focus:outline-none min-h-[300px] p-2 border border-transparent focus:border-gray-300 rounded"
                        contentEditable
                        suppressContentEditableWarning
                    />
                )}
            </div>
        </div>

    )
}

export default RichTextEditor