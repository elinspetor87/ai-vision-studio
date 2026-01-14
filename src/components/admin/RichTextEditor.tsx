import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Code
} from 'lucide-react';
import { useState } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    onImageUpload?: (file: File) => Promise<string>;
}

const RichTextEditor = ({
    content,
    onChange,
    placeholder = 'Escreva seu conteúdo aqui...',
    onImageUpload
}: RichTextEditorProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
            },
        },
    });

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file || !onImageUpload) return;

            try {
                setIsUploading(true);
                const url = await onImageUpload(file);
                editor?.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Erro ao fazer upload da imagem');
            } finally {
                setIsUploading(false);
            }
        };

        input.click();
    };

    const addLink = () => {
        const url = window.prompt('URL do link:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Negrito (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Itálico (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : ''
                        }`}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Lista com marcadores"
                >
                    <List className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Lista numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('codeBlock') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Bloco de código"
                >
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-border mx-1" />

                <button
                    type="button"
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('link') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Adicionar link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>

                {onImageUpload && (
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
                        title="Adicionar imagem"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                )}

                <div className="w-px h-8 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
                    title="Desfazer (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
                    title="Refazer (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            {/* Character count */}
            <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                {editor.storage.characterCount?.characters() || 0} caracteres
            </div>
        </div>
    );
};

export default RichTextEditor;
