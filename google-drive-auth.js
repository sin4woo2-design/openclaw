import "dotenv/config";
import readline from "node:readline";
import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
console.error("Missing env vars. Check .env");
process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const scopes = [
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/calendar",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/gmail.send"
];

const authUrl = oauth2Client.generateAuthUrl({
access_type: "offline",
scope: scopes,
prompt: "consent",
});

console.log("1) Open this URL:\n", authUrl);
console.log("\n2) Paste the code param here:");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("> ", async (code) => {
try {
const { tokens } = await oauth2Client.getToken(code.trim());
console.log("\nTOKENS:\n", JSON.stringify(tokens, null, 2));
} catch (e) {
console.error("Token error:", e.message);
} finally {
rl.close();
}
});
