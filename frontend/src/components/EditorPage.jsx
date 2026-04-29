import { useEffect, useState } from "react";
import { api } from "../api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

export default function EditorPage({ documentId, currentUser, users, onSaved }) {
  const [title, setTitle] = useState("");
  const [sharedUserId, setSharedUserId] = useState("");
  const [message, setMessage] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
  });

  useEffect(() => {
    async function loadDoc() {
      const res = await api.get(`/documents/${documentId}`);
      setTitle(res.data.title);
      editor?.commands.setContent(res.data.content || "");
      setMessage("");
    }

    if (documentId && editor) {
      loadDoc();
    }
  }, [documentId, editor]);

  const saveDocument = async () => {
    await api.put(`/documents/${documentId}`, {
      title,
      content: editor.getHTML(),
    });

    setMessage("Document saved.");
    onSaved();
  };

  const shareDocument = async () => {
    if (!sharedUserId) {
      setMessage("Please select a user to share with.");
      return;
    }

    await api.post(`/documents/${documentId}/share`, {
      userId: Number(sharedUserId),
    });

    setMessage("Document shared successfully.");
    setSharedUserId("");
    onSaved();
  };

  if (!editor) return <p>Loading editor...</p>;

  return (
  <div className="editor-card">
    <input
      className="title-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        Heading
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Bullet List
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        Numbered List
      </button>
    </div>

    <div className="document-page">
      <EditorContent editor={editor} />
    </div>

    <div className="save-row">
      <button className="save-button" onClick={saveDocument}>
        Save
      </button>
      {message && <p className="status-message">{message}</p>}
    </div>

    <div className="share-panel">
      <h3>Share Document</h3>

      <select
        value={sharedUserId}
        onChange={(e) => setSharedUserId(e.target.value)}
      >
        <option value="">Select user</option>
        {users
          .filter((user) => user.id !== currentUser.id)
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
      </select>

      <button onClick={shareDocument}>Share</button>
    </div>
  </div>
);
}