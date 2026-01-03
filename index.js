const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./licenses.json";

// init file
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

function generateKey() {
  return "SG-" + Math.floor(10000000 + Math.random() * 90000000);
}

// BUY LICENSE
app.post("/buy", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const licenses = JSON.parse(fs.readFileSync(FILE));
  const key = generateKey();

  licenses.push({
    key,
    email,
    createdAt: new Date().toISOString()
  });

  fs.writeFileSync(FILE, JSON.stringify(licenses, null, 2));

  res.json({ key });
});

// CHECK LICENSE (ANTICHEAT)
app.get("/check/:key", (req, res) => {
  const licenses = JSON.parse(fs.readFileSync(FILE));
  const found = licenses.find(l => l.key === req.params.key);

  res.json({ valid: !!found });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on", PORT));
