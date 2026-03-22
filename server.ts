import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial data structure
const initialData = {
  students: [
    {
      id: "1",
      name: "Alex Johnson",
      rollNo: "201",
      div: "A",
      marks: { em: 85, ds: 92, dsgt: 78, dlca: 88, dbms: 70, os: 95 },
      nextExamDate: "2026-04-15T09:00:00Z",
    },
    {
      id: "2",
      name: "Sarah Miller",
      rollNo: "202",
      div: "A",
      marks: { em: 72, ds: 68, dsgt: 95, dlca: 92, dbms: 98, os: 65 },
      nextExamDate: "2026-04-16T10:00:00Z",
    },
    {
      id: "3",
      name: "David Chen",
      rollNo: "203",
      div: "B",
      marks: { em: 98, ds: 96, dsgt: 82, dlca: 75, dbms: 60, os: 99 },
      nextExamDate: "2026-04-15T09:00:00Z",
    },
    {
      id: "4",
      name: "Emma Wilson",
      rollNo: "204",
      div: "B",
      marks: { em: 88, ds: 85, dsgt: 88, dlca: 85, dbms: 88, os: 85 },
      nextExamDate: "2026-04-18T11:00:00Z",
    }
  ],
  subjects: [
    { id: 'em', label: 'Engineering Math', maxMarks: 100 },
    { id: 'ds', label: 'Data Structures', maxMarks: 100 },
    { id: 'dsgt', label: 'Discrete Structures', maxMarks: 100 },
    { id: 'dlca', label: 'Logic Design', maxMarks: 100 },
    { id: 'dbms', label: 'Database Systems', maxMarks: 100 },
    { id: 'os', label: 'Operating Systems', maxMarks: 100 },
  ],
  tests: [],
  settings: {
    institutionName: "StudentPulse Academy",
    teacherName: "Ghadigaonkar Sir",
    academicYear: "2025-26",
    facultyUsername: "admin",
    facultyPassword: "password",
    facultyMobile: "1234567890"
  }
};

// Load data from file or use initial data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      console.error("Failed to parse data file, using initial data", e);
      return initialData;
    }
  }
  return initialData;
}

// Save data to file
function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let dbData = loadData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/students", (req, res) => {
    res.json(dbData.students);
  });

  app.post("/api/students", (req, res) => {
    dbData.students = req.body;
    saveData(dbData);
    res.json({ status: "ok" });
  });

  app.get("/api/subjects", (req, res) => {
    res.json(dbData.subjects);
  });

  app.post("/api/subjects", (req, res) => {
    dbData.subjects = req.body;
    saveData(dbData);
    res.json({ status: "ok" });
  });

  app.get("/api/tests", (req, res) => {
    res.json(dbData.tests);
  });

  app.post("/api/tests", (req, res) => {
    dbData.tests = req.body;
    saveData(dbData);
    res.json({ status: "ok" });
  });

  app.get("/api/settings", (req, res) => {
    res.json(dbData.settings);
  });

  app.post("/api/settings", (req, res) => {
    dbData.settings = req.body;
    saveData(dbData);
    res.json({ status: "ok" });
  });

  app.post("/api/clear", (req, res) => {
    dbData = { ...initialData, tests: [] };
    saveData(dbData);
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
