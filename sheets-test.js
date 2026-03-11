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

const sheets = google.sheets({ version: "v4", auth });

async function main() {
// 1) 스프레드시트 생성
const createRes = await sheets.spreadsheets.create({
requestBody: {
properties: { title: `OpenClaw Sheets Test ${Date.now()}` },
sheets: [{ properties: { title: "Logs" } }],
},
});

const spreadsheetId = createRes.data.spreadsheetId;
console.log("✅ Spreadsheet created:", spreadsheetId);
console.log(createRes.data.spreadsheetUrl);

// 2) 데이터 한 줄 입력
await sheets.spreadsheets.values.append({
spreadsheetId,
range: "Logs!A:C",
valueInputOption: "RAW",
requestBody: {
values: [[new Date().toISOString(), "status", "Sheets 연동 성공 ✅"]],
},
});

console.log("✅ Row appended");
}

main().catch((e) => {
console.error("❌ Error:", e.response?.data || e.message);
});
