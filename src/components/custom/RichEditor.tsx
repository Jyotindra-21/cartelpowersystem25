'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useRef, useEffect } from 'react'
import {
    FaBold,
    FaItalic,
    FaCode,
    FaQuoteRight,
    FaListUl,
    FaListOl,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaImage,
    FaLink,
    FaUnderline,
    FaStrikethrough,
    FaHighlighter,
    FaFont,
    FaPalette,
    FaTasks,
    FaTable,
    FaSubscript,
    FaSuperscript,
    FaUndo,
    FaRedo,
    FaParagraph,
    FaHeading,
    FaAlignJustify,
} from 'react-icons/fa'
import { BiCodeBlock, BiHorizontalLeft } from 'react-icons/bi'
import { MdFontDownload } from 'react-icons/md'

interface RichEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
    const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)
    const [codeContent, setCodeContent] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Code,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 p-4 rounded font-mono text-sm',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:underline',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg',
                },
            }),
            Underline,
            Strike,
            Subscript,
            Superscript,
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            FontFamily,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    const showCodeDialog = () => {
        if (editor) {
            setCodeContent(editor.getHTML())
            setIsCodeDialogOpen(true)
        }
    }

    const updateEditorContent = () => {
        if (editor && textareaRef.current) {
            const newContent = textareaRef.current.value
            editor.commands.setContent(newContent)
            setIsCodeDialogOpen(false)
            onChange(newContent)
        }
    }

    useEffect(() => {
        if (isCodeDialogOpen && textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.select()
        }
    }, [isCodeDialogOpen])

    if (!editor) return <div className="p-4 border rounded-lg">Loading editor...</div>

    return (
        <div className="border rounded-lg overflow-hidden">
            <MenuBar editor={editor} onShowCodeDialog={showCodeDialog} />
            <EditorContent editor={editor} />
            
            {/* Code Dialog */}
            {isCodeDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Edit HTML Code</h3>
                            <button 
                                onClick={() => setIsCodeDialogOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                aria-label="Close dialog"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto mb-4">
                            <textarea
                                ref={textareaRef}
                                value={codeContent}
                                onChange={(e) => setCodeContent(e.target.value)}
                                className="w-full h-full p-4 border rounded-md font-mono text-sm"
                                style={{ minHeight: '300px' }}
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(codeContent)
                                    // You could add a toast notification here
                                }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Copy Code
                            </button>
                            <button
                                onClick={() => setIsCodeDialogOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateEditorContent}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

interface MenuBarProps {
    editor: any
    onShowCodeDialog: () => void
}

function MenuBar({ editor, onShowCodeDialog }: MenuBarProps) {
    const addImage = () => {
        const url = window.prompt('Enter the URL of the image:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addTable = () => {
        const rows = Number(prompt('How many rows?', '3'))
        const cols = Number(prompt('How many columns?', '3'))

        if (rows && cols) {
            editor
                .chain()
                .focus()
                .insertTable({ rows, cols, withHeaderRow: true })
                .run()
        }
    }

    const addTaskList = () => {
        editor.chain().focus().toggleTaskList().run()
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
            {/* History */}
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                title="Undo"
            >
                <FaUndo />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                title="Redo"
            >
                <FaRedo />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Text Formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                title="Bold"
            >
                <FaBold />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                title="Underline"
            >
                <FaUnderline />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                title="Strikethrough"
            >
                <FaStrikethrough />
            </button>
            <button
                type="button"
                onClick={onShowCodeDialog}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
                title="Edit HTML Code"
            >
                <FaCode />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
                title="Code block"
            >
                <BiCodeBlock />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('subscript') ? 'bg-gray-200' : ''}`}
                title="Subscript"
            >
                <FaSubscript />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('superscript') ? 'bg-gray-200' : ''}`}
                title="Superscript"
            >
                <FaSuperscript />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Headings */}
            <select
                onChange={(e) => {
                    const value = e.target.value
                    if (value === 'paragraph') {
                        editor.chain().focus().setParagraph().run()
                    } else {
                        editor.chain().focus().toggleHeading({ level: Number(value) }).run()
                    }
                }}
                className="p-2 rounded hover:bg-gray-200 border border-gray-300 text-sm"
                value={
                    editor.isActive('heading', { level: 1 })
                        ? '1'
                        : editor.isActive('heading', { level: 2 })
                            ? '2'
                            : editor.isActive('heading', { level: 3 })
                                ? '3'
                                : editor.isActive('heading', { level: 4 })
                                    ? '4'
                                    : editor.isActive('heading', { level: 5 })
                                        ? '5'
                                        : editor.isActive('heading', { level: 6 })
                                            ? '6'
                                            : 'paragraph'
                }
            >
                <option value="paragraph">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
            </select>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                title="Bullet list"
            >
                <FaListUl />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                title="Ordered list"
            >
                <FaListOl />
            </button>
            <button
                type="button"
                onClick={addTaskList}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
                title="Task list"
            >
                <FaTasks />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Block Elements */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                title="Blockquote"
            >
                <FaQuoteRight />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Horizontal rule"
            >
                <BiHorizontalLeft />
            </button>
            <button
                type="button"
                onClick={addTable}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('table') ? 'bg-gray-200' : ''}`}
                title="Table"
            >
                <FaTable />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Text Alignment */}
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                title="Align left"
            >
                <FaAlignLeft />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                title="Align center"
            >
                <FaAlignCenter />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                title="Align right"
            >
                <FaAlignRight />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
                title="Align justify"
            >
                <FaAlignJustify />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Text Styling */}
            <div className="relative group">
                <button
                    type="button"
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
                    title="Highlight"
                >
                    <FaHighlighter />
                </button>
                <div className="absolute z-10 hidden group-hover:flex bg-white p-2 rounded shadow-lg border">
                    <input
                        type="color"
                        onInput={(e: any) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
                        value={editor.getAttributes('highlight').color || '#ffcc00'}
                        title="Highlight color"
                    />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetHighlight().run()}
                        className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="relative group">
                <button
                    type="button"
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('textStyle') && editor.getAttributes('textStyle').color ? 'bg-gray-200' : ''}`}
                    title="Text color"
                >
                    <FaPalette />
                </button>
                <div className="absolute z-10 hidden group-hover:flex bg-white p-2 rounded shadow-lg border">
                    <input
                        type="color"
                        onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        title="Text color"
                    />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="relative group">
                <button
                    type="button"
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('textStyle') && editor.getAttributes('textStyle').fontFamily ? 'bg-gray-200' : ''}`}
                    title="Font family"
                >
                    <MdFontDownload />
                </button>
                <div className="absolute z-10 hidden group-hover:flex bg-white p-2 rounded shadow-lg border flex-col">
                    <select
                        onChange={(e) => {
                            const font = e.target.value
                            if (font === 'default') {
                                editor.chain().focus().unsetFontFamily().run()
                            } else {
                                editor.chain().focus().setFontFamily(font).run()
                            }
                        }}
                        value={editor.getAttributes('textStyle').fontFamily || 'default'}
                        className="p-1 text-sm border rounded"
                    >
                        <option value="default">Default</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </div>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Media */}
            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
                title="Link"
            >
                <FaLink />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200"
                title="Image"
            >
                <FaImage />
            </button>
        </div>
    )
}