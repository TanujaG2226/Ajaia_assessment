const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Seed/mock users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    const seededUsers = await prisma.user.createMany({
      data: [
        { name: "Tanuja", email: "tanuja@example.com" },
        { name: "Reviewer", email: "reviewer@example.com" },
      ],
    });
  }

  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// Get owned + shared documents
app.get("/documents", async (req, res) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const owned = await prisma.document.findMany({
    where: { ownerId: userId },
    include: { owner: true },
    orderBy: { updatedAt: "desc" },
  });

  const shared = await prisma.document.findMany({
    where: {
      shares: {
        some: { userId },
      },
      NOT: { ownerId: userId },
    },
    include: { owner: true },
    orderBy: { updatedAt: "desc" },
  });

  res.json({ owned, shared });
});

// Create document
app.post("/documents", async (req, res) => {
  const { title, content = "", ownerId } = req.body;

  if (!title || !ownerId) {
    return res.status(400).json({ error: "title and ownerId are required" });
  }

  const document = await prisma.document.create({
    data: {
      title,
      content,
      ownerId: Number(ownerId),
    },
  });

  res.status(201).json(document);
});

// Get single document
app.get("/documents/:id", async (req, res) => {
  const id = Number(req.params.id);

  const document = await prisma.document.findUnique({
    where: { id },
    include: { owner: true, shares: { include: { user: true } } },
  });

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.json(document);
});

// Update document
app.put("/documents/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  const document = await prisma.document.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  res.json(document);
});

// Share document
app.post("/documents/:id/share", async (req, res) => {
  const documentId = Number(req.params.id);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const share = await prisma.share.upsert({
    where: {
      documentId_userId: {
        documentId,
        userId: Number(userId),
      },
    },
    update: {},
    create: {
      documentId,
      userId: Number(userId),
    },
  });

  res.status(201).json(share);
});

// Upload .txt or .md into a new document
app.post("/upload", upload.single("file"), async (req, res) => {
  const ownerId = Number(req.body.ownerId);

  if (!req.file || !ownerId) {
    return res.status(400).json({ error: "file and ownerId are required" });
  }

  const allowedTypes = [".txt", ".md"];
  const fileName = req.file.originalname;
  const isAllowed = allowedTypes.some((ext) => fileName.endsWith(ext));

  if (!isAllowed) {
    return res.status(400).json({ error: "Only .txt and .md files are supported" });
  }

  const content = req.file.buffer.toString("utf-8");

  const document = await prisma.document.create({
    data: {
      title: fileName.replace(/\.(txt|md)$/i, ""),
      content,
      ownerId,
    },
  });

  res.status(201).json(document);
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;