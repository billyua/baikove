"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Введіть URL посилання:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toolbarButtonStyle = (isActive) => ({
    padding: "6px 10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: isActive ? "#333" : "#fff",
    color: isActive ? "#fff" : "#333",
    cursor: "pointer",
  });

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "6px" }}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px",
          borderBottom: "1px solid #ccc",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={toolbarButtonStyle(editor.isActive("bold"))}
        >
          Жирний
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={toolbarButtonStyle(editor.isActive("italic"))}
        >
          Курсив
        </button>
        <button
          type="button"
          onClick={setLink}
          style={toolbarButtonStyle(editor.isActive("link"))}
        >
          Посилання
        </button>
      </div>
      <div style={{ padding: "10px", minHeight: "150px" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
