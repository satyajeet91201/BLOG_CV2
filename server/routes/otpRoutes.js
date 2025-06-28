// routes/otpRoutes.js
import express from "express";
import fs from "fs";
import path from "path";

const otpRouter = express.Router();

otpRouter.get('/', (req, res) => {
  const filePath = path.join(path.resolve(), 'otp_logs.txt');

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const messages = content
      .trim()
      .split('---OTP_SEPARATOR---')
      .filter(Boolean);

    const htmlOTPs = messages.map((msg, index) => `
      <div class="otp-box">
        <h3>🔐 OTP #${index + 1}</h3>
        <pre>${msg.trim()}</pre>
      </div>
    `).join("<hr>");

    const htmlResponse = `
      <html>
        <head>
          <title>Verification OTP Log</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              padding: 2rem;
              background: #f2f2f2;
              color: #333;
            }
            .otp-box {
              background: white;
              padding: 1.5rem;
              border-left: 5px solid #007bff;
              border-radius: 6px;
              box-shadow: 0 0 8px rgba(0,0,0,0.05);
              margin-bottom: 2rem;
            }
            hr {
              border: none;
              border-top: 1px solid #ddd;
            }
            h2 {
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <h2>🔐 All OTP Messages</h2>
          ${htmlOTPs}
        </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (err) {
    res.status(500).send("Failed to load OTP logs.");
  }
});

export default otpRouter;
