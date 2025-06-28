import express from "express";
import fs from "fs";
import path from "path";

const emailRouter = express.Router();

emailRouter.get("/", (req, res) => {
  const filePath = path.join(process.cwd(), "welcome_logs.txt");

  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();

    const messages = content
      .split("---EMAIL_SEPARATOR---")
      .map(msg => msg.trim())
      .filter(Boolean);

    const htmlEmails = messages.map((msg, index) => `
      <div class="email-box">
        <h3>📩 Email #${index + 1}</h3>
        <pre>${msg}</pre>
      </div>
    `).join("");

    const htmlResponse = `
      <html>
        <head>
          <title>Welcome Email Log</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: #f0f2f5;
              padding: 2rem;
            }
            .email-box {
              background: #fff;
              padding: 1.5rem;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              margin-bottom: 2rem;
            }
            h3 {
              color: #333;
              margin-bottom: 0.5rem;
            }
            pre {
              background: #f8f8f8;
              padding: 1rem;
              border-radius: 5px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <h1>📨 Welcome Email Preview</h1>
          ${htmlEmails}
        </body>
      </html>
    `;

    res.send(htmlResponse);

  } catch (err) {
    console.error("Error reading email log:", err.message);
    res.status(500).send("Failed to load email content.");
  }
});

export default emailRouter;
