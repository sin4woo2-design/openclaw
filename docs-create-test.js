import "dotenv/config";
import { google } from "googleapis";

const {
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET,
GOOGLE_REDIRECT_URI,
GOOGLE_REFRESH_TOKEN,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !GOOGLE_REFRESH_TOKEN) {
console.error("❌ .env 값 누락");
process.exit(1);
}

const auth = new google.auth.OAuth2(
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET,
GOOGLE_REDIRECT_URI
);
auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const docs = google.docs({ version: "v1", auth });

async function main() {
const createRes = await docs.documents.create({
requestBody: { title: `token-rotation-test-${Date.now()}` },
});

const docId = createRes.data.documentId;

await docs.documents.batchUpdate({
documentId: docId,
requestBody: {
requests: [
{
insertText: {
location: { index: 1 },
text: "키 교체 후 Docs API 테스트 성공 ✅",
},
},
],
},
});

console.log("✅ Docs OK");
console.log(`https://docs.google.com/document/d/${docId}/edit`);
}

main().catch((e) => {
console.error("❌ Error:", e.response?.data || e.message);
});
