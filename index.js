import express from "express";

const app = express();
app.use(express.json());

// === TEST LICENSES ===
const VALID_LICENSES = [
  "SG-1234",
  "SG-TEST-OK"
];

app.post("/api/verify", (req, res) => {
  const { license } = req.body;

  console.log("License check:", license);

  if (VALID_LICENSES.includes(license)) {
    return res.json({ valid: true });
  }

  return res.json({ valid: false });
});

app.listen(3000, () => {
  console.log("SafeGuard API running on port 3000");
});
