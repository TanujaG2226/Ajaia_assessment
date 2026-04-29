import { useEffect, useState } from "react";
import { api } from "./api";
import DocumentList from "./components/DocumentList";
import EditorPage from "./components/EditorPage";
import UserSwitcher from "./components/UserSwitcher";
import UploadButton from "./components/UploadButton";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState({ owned: [], shared: [] });
  const [selectedDocId, setSelectedDocId] = useState(null);

  const loadDocuments = async (userId) => {
    const res = await api.get(`/documents?userId=${userId}`);
    setDocuments(res.data);
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data);

        if (res.data.length > 0) {
          setCurrentUser(res.data[0]);
          await loadDocuments(res.data[0].id);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    }

    loadUsers();
  }, []);

  const handleUserChange = async (user) => {
    setCurrentUser(user);
    setSelectedDocId(null);
    await loadDocuments(user.id);
  };

  const createDocument = async () => {
    const res = await api.post("/documents", {
      title: "Untitled Document",
      content: "",
      ownerId: currentUser.id,
    });

    await loadDocuments(currentUser.id);
    setSelectedDocId(res.data.id);
  };

  if (!currentUser) {
    return <p>Loading users... Check console if this stays here.</p>;
  }

  return (
  <div className="app-shell">
    <header className="top-bar">
      <div>
        <h1>Ajaia Docs</h1>
        <p>Lightweight collaborative editor</p>
      </div>

      <div className="top-actions">
        <UserSwitcher
          users={users}
          currentUser={currentUser}
          onChange={handleUserChange}
        />
      </div>
    </header>

    <main className="workspace">
      <aside className="sidebar">
        <button className="primary-button" onClick={createDocument}>
          + New Document
        </button>

        <UploadButton
          currentUser={currentUser}
          onUploadComplete={(doc) => {
            loadDocuments(currentUser.id);
            setSelectedDocId(doc.id);
          }}
        />

        <DocumentList
          documents={documents}
          selectedDocId={selectedDocId}
          onSelect={setSelectedDocId}
        />
      </aside>

      <section className="editor-area">
        {selectedDocId ? (
          <EditorPage
            documentId={selectedDocId}
            currentUser={currentUser}
            users={users}
            onSaved={() => loadDocuments(currentUser.id)}
          />
        ) : (
          <div className="empty-state">
            <h2>Select or create a document</h2>
            <p>Your owned and shared docs will appear in the sidebar.</p>
          </div>
        )}
      </section>
    </main>
  </div>
);
}

export default App;