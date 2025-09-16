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
import { Node } from '@tiptap/core'
import { useState, useRef, useEffect } from 'react'

import {
  FaBold, FaItalic, FaCode, FaQuoteRight, FaListUl, FaListOl,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaImage, FaLink,
  FaUnderline, FaStrikethrough, FaHighlighter, FaTasks, FaTable,
  FaSubscript, FaSuperscript, FaUndo, FaRedo, FaAlignJustify, FaPalette,
  FaHeading, FaParagraph
} from 'react-icons/fa'
import { BiCodeBlock, BiHorizontalLeft } from 'react-icons/bi'
import { MdFontDownload } from 'react-icons/md'

/** ✅ Enhanced PreserveTag to handle more attributes */
const PreserveTag = (tag: string, inline = false, content = '') =>
  Node.create({
    name: tag,
    group: inline ? 'inline' : 'block',
    content: content || (inline ? '' : 'block+'),
    inline,
    defining: true,
    parseHTML() {
      return [{ tag }]
    },
    renderHTML({ HTMLAttributes }) {
      return [tag, HTMLAttributes, 0]
    },
    addAttributes() {
      return {
        class: { default: null },
        style: { default: null },
        id: { default: null },
        'data-aos': { default: null },
        'data-aos-duration': { default: null },
        'data-aos-delay': { default: null },
        alt: { default: null },
        href: { default: null },
        target: { default: null },
        rel: { default: null },
        src: { default: null },
        width: { default: null },
        height: { default: null },
        viewBox: { default: null },
        fill: { default: null },
        'clip-rule': { default: null },
        'fill-rule': { default: null },
        'stroke-linejoin': { default: null },
        'stroke-miterlimit': { default: null },
        version: { default: null },
        'xlink:href': { default: null },
        startOffset: { default: null },
      }
    },
  })

/** ✅ Custom SVG extension */
const SVGElement = Node.create({
  name: 'svgElement',
  group: 'block',
  content: 'text*',
  defining: true,
  
  parseHTML() {
    return [
      { tag: 'svg' },
      { tag: 'path' },
      { tag: 'circle' },
      { tag: 'text' },
      { tag: 'textPath' },
      { tag: 'defs' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    const tag = HTMLAttributes.tag || 'svg'
    delete HTMLAttributes.tag
    return [tag, HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
      id: { default: null },
      width: { default: null },
      height: { default: null },
      viewBox: { default: null },
      fill: { default: null },
      d: { default: null },
      'clip-rule': { default: null },
      'fill-rule': { default: null },
      'stroke-linejoin': { default: null },
      'stroke-miterlimit': { default: null },
      version: { default: null },
      'xlink:href': { default: null },
      startOffset: { default: null },
      cx: { default: null },
      cy: { default: null },
      r: { default: null },
      tag: { default: null },
    }
  },
})

/** ✅ Custom extension to handle complex HTML structures */
const ComplexHTML = Node.create({
  name: 'complexHtml',
  group: 'block',
  content: 'block+',
  defining: true,
  
  parseHTML() {
    return [
      { tag: 'div.container' },
      { tag: 'div.row' },
      { tag: 'div[class*="col-"]' },
      { tag: 'div.about-one-leftbox' },
      { tag: 'div.about-one-rightbox' },
      { tag: 'div.pbmit-heading-subheading' },
      { tag: 'div.spinner-box' },
      { tag: 'div.pbmit-spinner' },
      { tag: 'div.pbmit-ihbox-box' },
      { tag: 'div.pbmit-ihbox-icon' },
      { tag: 'div.pbmit-ihbox-icon-wrapper' },
      { tag: 'div.list-group-col' },
      { tag: 'div.about-02-img-col' },
      { tag: 'div.about-img' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    // Preserve the original tag and attributes
    const tag = HTMLAttributes.tag || 'div'
    delete HTMLAttributes.tag
    return [tag, HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
      style: { default: null },
      id: { default: null },
      'data-aos': { default: null },
      'data-aos-duration': { default: null },
      'data-aos-delay': { default: null },
      tag: { default: null },
    }
  },
})

/** ✅ Custom list item extension to preserve structure */
const CustomListItem = Node.create({
  name: 'customListItem',
  group: 'listItem',
  content: 'inline*',
  defining: true,
  
  parseHTML() {
    return [
      { tag: 'li.list-group-item' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['li', HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
    }
  },
})

/** ✅ Custom icon extension */
const IconElement = Node.create({
  name: 'iconElement',
  group: 'inline',
  content: 'text*',
  inline: true,
  
  parseHTML() {
    return [
      { tag: 'i' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['i', HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
    }
  },
})

/** ✅ Custom span extension for icon lists */
const IconListText = Node.create({
  name: 'iconListText',
  group: 'inline',
  content: 'text*',
  inline: true,
  
  parseHTML() {
    return [
      { tag: 'span.pbmit-icon-list-text' },
      { tag: 'span.pbmit-icon-list-icon' },
      { tag: 'span.pbmit-button-text' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
    }
  },
})

/** ✅ Custom button extension */
const CustomButton = Node.create({
  name: 'customButton',
  group: 'inline',
  content: 'text*',
  inline: true,
  
  parseHTML() {
    return [
      { tag: 'a.pbmit-btn' },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0]
  },
  
  addAttributes() {
    return {
      class: { default: null },
      href: { default: null },
      target: { default: null },
      rel: { default: null },
    }
  },
})

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichEditorProps) {
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)
  const [codeContent, setCodeContent] = useState('')
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        // Disable the default list item behavior
        listItem: {
          HTMLAttributes: {
            class: null,
          },
        },
        // Configure paragraph to not add extra wrapping
        paragraph: {
          HTMLAttributes: {
            class: null,
          },
        },
      }),
      Code,
      CodeBlock.configure({
        HTMLAttributes: { class: 'bg-gray-100 p-4 rounded font-mono text-sm' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { 
          class: 'text-blue-500 hover:underline',
          target: '_blank',
          rel: 'noopener noreferrer nofollow'
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: { 
          class: 'img-fluid rounded-4', // Preserve original classes
        },
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontFamily,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),

      // ✅ Enhanced semantic tags preservation
      PreserveTag('section'),
      PreserveTag('header'),
      PreserveTag('footer'),
      PreserveTag('article'),
      PreserveTag('main'),
      PreserveTag('nav'),
      PreserveTag('aside'),
      PreserveTag('figure'),
      
      // ✅ SVG elements
      SVGElement,
      
      // ✅ Custom extensions for complex HTML
      ComplexHTML,
      CustomListItem,
      IconElement,
      IconListText,
      CustomButton,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
      // Handle paste events to preserve HTML structure
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false
        
        const html = clipboardData.getData('text/html')
        if (html) {
          // Allow the default paste behavior but don't let TipTap process it
          // This helps preserve the original HTML structure
          return false
        }
        
        return false
      },
      // Handle drop events similarly
      handleDrop: (view, event) => {
        const dropData = event.dataTransfer
        if (!dropData) return false
        
        const html = dropData.getData('text/html')
        if (html) {
          return false
        }
        
        return false
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
      const newContent = textareaRef.current.value;
      editor.commands.setContent(newContent, {
        emitUpdate: false // This is the correct way to prevent update emission
      });
      setIsCodeDialogOpen(false);
      onChange(newContent);
    }
  }

  const showLinkDialog = () => {
    if (editor) {
      const previousUrl = editor.getAttributes('link').href
      setLinkUrl(previousUrl || '')
      setIsLinkDialogOpen(true)
    }
  }

  const addLink = () => {
    if (editor) {
      if (linkUrl === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      }
      setIsLinkDialogOpen(false)
      setLinkUrl('')
    }
  }

  const showImageDialog = () => {
    setIsImageDialogOpen(true)
  }

  const addImage = () => {
    if (editor && imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setIsImageDialogOpen(false)
      setImageUrl('')
    }
  }

  const addTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
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
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <MenuBar 
        editor={editor} 
        onShowCodeDialog={showCodeDialog}
        onShowLinkDialog={showLinkDialog}
        onShowImageDialog={showImageDialog}
        onAddTable={addTable}
      />
      <EditorContent editor={editor} />

      {/* Code Dialog */}
      {isCodeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit HTML Code</h3>
              <button type="button" onClick={() => setIsCodeDialogOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                Paste your HTML code here. The editor will try to preserve your structure as much as possible.
              </p>
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
              <button type="button"
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Copy Code
              </button>
              <button type="button"
                onClick={() => setIsCodeDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button type="button"
                onClick={updateEditorContent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{linkUrl ? 'Edit Link' : 'Add Link'}</h3>
              <button type="button" onClick={() => setIsLinkDialogOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button type="button"
                onClick={addLink}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Insert Image</h3>
              <button type="button" onClick={() => setIsImageDialogOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button type="button"
                onClick={() => setIsImageDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Insert
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
  onShowLinkDialog: () => void
  onShowImageDialog: () => void
  onAddTable: () => void
}

function MenuBar({ editor, onShowCodeDialog, onShowLinkDialog, onShowImageDialog, onAddTable }: MenuBarProps) {
  const [currentColor, setCurrentColor] = useState('#000000')
  const [currentHighlight, setCurrentHighlight] = useState('#ffff00')

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
      {/* 🔄 Undo / Redo */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" title="Undo"><FaUndo /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" title="Redo"><FaRedo /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`} title="Paragraph"><FaParagraph /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`} title="Heading 1"><FaHeading className="inline mr-1" />1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`} title="Heading 2"><FaHeading className="inline mr-1" />2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`} title="Heading 3"><FaHeading className="inline mr-1" />3</button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* ✍️ Bold / Italic / Underline / Strike */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`} title="Bold"><FaBold /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`} title="Italic"><FaItalic /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`} title="Underline"><FaUnderline /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`} title="Strikethrough"><FaStrikethrough /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Subscript / Superscript */}
      <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('subscript') ? 'bg-gray-200' : ''}`} title="Subscript"><FaSubscript /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('superscript') ? 'bg-gray-200' : ''}`} title="Superscript"><FaSuperscript /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* 🔧 Code / Block / HTML */}
      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`} title="Inline Code"><FaCode /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`} title="Code Block"><BiCodeBlock /></button>
      <button type="button" onClick={onShowCodeDialog} className="p-2 rounded hover:bg-gray-200" title="Edit HTML"><FaCode className="text-red-500" /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists / Tasks */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`} title="Bullet List"><FaListUl /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`} title="Numbered List"><FaListOl /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`} title="Task List"><FaTasks /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Blockquote / Divider / Table */}
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`} title="Blockquote"><FaQuoteRight /></button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 rounded hover:bg-gray-200" title="Horizontal Line"><BiHorizontalLeft /></button>
      <button type="button" onClick={onAddTable} className="p-2 rounded hover:bg-gray-200" title="Insert Table"><FaTable /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Align */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`} title="Align Left"><FaAlignLeft /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`} title="Align Center"><FaAlignCenter /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`} title="Align Right"><FaAlignRight /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`} title="Justify"><FaAlignJustify /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Color / Highlight */}
      <div className="relative group">
        <button type="button" className="p-2 rounded hover:bg-gray-200" title="Text Color"><FaPalette /></button>
        <div className="absolute hidden group-hover:block z-10 bg-white p-2 rounded shadow-md">
          <input 
            type="color" 
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value)
              editor.chain().focus().setColor(e.target.value).run()
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
      
      <div className="relative group">
        <button type="button" className="p-2 rounded hover:bg-gray-200" title="Highlight"><FaHighlighter /></button>
        <div className="absolute hidden group-hover:block z-10 bg-white p-2 rounded shadow-md">
          <input 
            type="color" 
            value={currentHighlight}
            onChange={(e) => {
              setCurrentHighlight(e.target.value)
              editor.chain().focus().setHighlight({ color: e.target.value }).run()
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>

      <button type="button" onClick={() => editor.chain().focus().setFontFamily('Inter').run()} className="p-2 rounded hover:bg-gray-200" title="Font Family"><MdFontDownload /></button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Media */}
      <button type="button" onClick={onShowLinkDialog} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`} title="Insert Link"><FaLink /></button>
      <button type="button" onClick={onShowImageDialog} className="p-2 rounded hover:bg-gray-200" title="Insert Image"><FaImage /></button>
    </div>
  )
}