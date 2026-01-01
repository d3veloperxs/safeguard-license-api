const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let licenses = [];

app.get("/", (req, res) => {
    res.send("SafeGuard License API Running");
});

app.post("/buy", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success:false });

    const key = "SG-" + Math.floor(10000000 + Math.random()*90000000);

    licenses.push({ key, email, created: Date.now() });
    console.log("NEW LICENSE:", key);

    res.json({ success:true, license:key });
});

app.get("/verify/:key", (req, res) => {
    const found = licenses.find(l => l.key === req.params.key);
    res.json({ valid: !!found });
});

app.listen(process.env.PORT || 3000);
