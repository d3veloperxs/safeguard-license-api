const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "licenses.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

app.get("/", (req, res) => {
  res.send("SafeGuard License API running");
});

app.get("/licenses", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

app.post("/generate", (req, res) => {
  const licenses = JSON.parse(fs.readFileSync(FILE));

  let key;
  do {
    key = "SG-" + Math.floor(10000000 + Math.random() * 90000000);
  } while (licenses.includes(key));

  licenses.push(key);
  fs.writeFileSync(FILE, JSON.stringify(licenses, null, 2));

  res.json({ key });
});

app.get("/verify", (req, res) => {
  const { key } = req.query;
  const licenses = JSON.parse(fs.readFileSync(FILE));

  res.json({ valid: licenses.includes(key) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
