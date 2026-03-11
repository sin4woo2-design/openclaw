import "dotenv/config";
import { google } from "googleapis";

const {
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET,
GOOGLE_REDIRECT_URI,
GOOGLE_REFRESH_TOKEN,
} = process.env;

const auth = new google.auth.OAuth2(
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET,
GOOGLE_REDIRECT_URI
);
auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth });

function makeRawEmail({ to, subject, body }) {
const str = [
`To: ${to}`,
`Subject: ${subject}`,
"Content-Type: text/plain; charset=UTF-8",
"",
body,
].join("\n");

return Buffer.from(str)
.toString("base64")
.replace(/\+/g, "-")
.replace(/\//g, "_")
.replace(/=+$/, "");
}

async function main() {
const to = process.argv[2]; // 예: 본인 이메일
if (!to) {
console.error("❌ 사용법: node gmail-send-test.js your@email.com");
process.exit(1);
}

const raw = makeRawEmail({
to,
subject: "OpenClaw Gmail API 테스트",
body: "Gmail API 연동 성공 ✅",
});

const res = await gmail.users.messages.send({
userId: "me",
requestBody: { raw },
});

console.log("✅ Mail sent:", res.data.id);
}

main().catch((e) => {
console.error("❌ Error:", e.response?.data || e.message);
});
