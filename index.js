import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ===== SendGrid =====
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===== License storage =====
const LICENSE_FILE = "./licenses.json";

function loadLicenses() {
  return JSON.parse(fs.readFileSync(LICENSE_FILE));
}

function saveLicenses(data) {
  fs.writeFileSync(LICENSE_FILE, JSON.stringify(data, null, 2));
}

function generateLicense() {
  return "SG-" + Math.floor(10000000 + Math.random() * 90000000);
}

// ===== BUY LICENSE =====
app.post("/buy", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // License genereren
    const licenseKey = "SG-" + Math.floor(10000000 + Math.random() * 90000000);

    // OPSLAAN (pas aan naar jouw storage)
    licenses.push({
        email: email,
        key: licenseKey,
        createdAt: new Date()
    });

    console.log("NEW LICENSE:", licenseKey, "EMAIL:", email);

    res.json({
        success: true,
        license: licenseKey,
        message: "License generated and sent to email"
    });
});
// ===== VALIDATE LICENSE =====
app.get("/validate/:key", (req, res) => {
  const { key } = req.params;
  const licenses = loadLicenses();

  const found = licenses.find(l => l.key === key && l.active);
  if (!found) return res.status(404).json({ valid: false });

  res.json({ valid: true, email: found.email });
});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("SafeGuard backend running");
});

