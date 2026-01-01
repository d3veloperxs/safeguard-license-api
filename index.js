const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (ZEER BELANGRIJK)
app.use(cors());
app.use(express.json());

// In-memory storage (voor nu)
let licenses = [];

// Health check
app.get("/", (req, res) => {
    res.send("SafeGuard License API is running");
});

// BUY ENDPOINT (DIT MISSE JE)
app.post("/buy", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email required" });
    }

    // License genereren: SG-XXXXXXXX
    const licenseKey = "SG-" + Math.floor(10000000 + Math.random() * 90000000);

    licenses.push({
        email,
        licenseKey,
        createdAt: new Date()
    });

    console.log("NEW LICENSE:", licenseKey, "EMAIL:", email);

    // (Mock mail — frontend toont bericht)
    res.json({
        success: true,
        license: licenseKey,
        message: "Your license key is being sent to your email"
    });
});

// VERIFY ENDPOINT (voor FiveM)
app.get("/verify/:key", (req, res) => {
    const { key } = req.params;

    const found = licenses.find(l => l.licenseKey === key);

    if (!found) {
        return res.json({ valid: false });
    }

    res.json({ valid: true });
});

app.listen(PORT, () => {
    console.log(`SafeGuard API running on port ${PORT}`);
});
