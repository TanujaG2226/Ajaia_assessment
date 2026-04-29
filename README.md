# Ajaia Docs

A lightweight collaborative document editor built for the Ajaia Technical Program and Project Manager (AI Delivery) assessment.

The goal of this project was to design and ship a functional, end-to-end document editing product within a constrained time window, demonstrating strong product judgment, full-stack execution, and effective use of AI tools.

---

## 🚀 Features

### Core Functionality
- Create new documents
- Rename documents
- Edit document content in the browser
- Save and reopen documents
- Persistent storage across sessions

### Rich Text Editing
- Bold, italic, underline
- Headings
- Bulleted lists
- Numbered lists

### File Upload
- Upload `.txt` or `.md` files (no .docx file upload ability)
- Automatically convert uploaded files into editable documents
- Content is stored in the database (not as raw files)

### Sharing
- Each document has an owner
- Documents can be shared with another user
- Clear distinction between:
  - Owned documents
  - Shared documents

### Persistence
- Documents stored using SQLite via Prisma
- Formatting preserved using HTML content
- Sharing relationships persisted in database

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TipTap (rich text editor)
- Axios (API calls)

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite
- Multer (file upload handling)

### Testing
- Jest
- Supertest

---
## Test Users
Start backend
Visit: http://localhost:5001/users

Available users:
Tanuja (default)
Reviewer (to test sharing permissions)

## Running Tests
```bash
cd backend
npm test
```
## ⚙️ Local Setup


```bash
git clone <your-repo-link>
cd Ajaia_assessment

cd backend
npm install
npx prisma migrate dev
npm run dev

cd frontend
npm install
npm run dev
```
### Optional Stretch
- Added basic Markdown export for edited documents.