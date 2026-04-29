export default function DocumentList({ documents, selectedDocId, onSelect }) {
  return (
    <div>
      <h3>Owned</h3>
      {documents.owned.length === 0 && <p>No owned documents yet.</p>}

      {documents.owned.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`doc-item ${selectedDocId === doc.id ? "active" : ""}`}
        >
          {doc.title}
        </div>
      ))}

      <h3>Shared</h3>
      {documents.shared.length === 0 && <p>No shared documents yet.</p>}

      {documents.shared.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`doc-item shared ${selectedDocId === doc.id ? "active" : ""}`}
        >
          {doc.title}
        </div>
      ))}
    </div>
  );
}