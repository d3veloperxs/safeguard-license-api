const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./licenses.json";

// Zorg dat bestand bestaat
if (!fs.existsSync(FILE)) {
  fs.writeJsonSync(FILE, []);
}

// License generator
function generateKey() {
  return "SG-" + Math.floor(10000000 + Math.random() * 90000000);
}

// Buy endpoint
app.post("/buy", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const licenses = await fs.readJson(FILE);
  const key = generateKey();

  licenses.push({
    email,
    key,
    createdAt: new Date().toISOString()
  });

  await fs.writeJson(FILE, licenses, { spaces: 2 });

  res.json({ success: true, key });
});

// Verify endpoint (voor anticheat)
app.get("/verify/:key", async (req, res) => {
  const { key } = req.params;
  const licenses = await fs.readJson(FILE);

  const found = licenses.find(l => l.key === key);
  res.json({ valid: !!found });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on", PORT));
