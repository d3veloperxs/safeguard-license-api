import express from "express";

const app = express();
app.use(express.json());

// ================================
// TEST LICENSES (tijdelijk)
// ================================
const VALID_LICENSES = [
  "SG-1234",
  "SG-TEST-OK"
];

// ================================
// VERIFY ENDPOINT
// ================================
app.post("/api/verify", (req, res) => {
  const { license, resource } = req.body;

  console.log("License check:", license, resource);

  if (!license) {
    return res.json({ valid: false });
  }

  if (VALID_LICENSES.includes(license)) {
    return res.json({ valid: true });
  }

  return res.json({ valid: false });
});

// ================================
// RENDER PORT (BELANGRIJK)
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ SafeGuard API running on port ${PORT}`);
});
