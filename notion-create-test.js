import "dotenv/config";
import { Client } from "@notionhq/client";

const notionKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID; // 연결한 페이지 ID

if (!notionKey) {
console.error("❌ NOTION_API_KEY 없음 (.env 확인)");
process.exit(1);
}
if (!parentPageId) {
console.error("❌ NOTION_PARENT_PAGE_ID 없음 (.env 확인)");
process.exit(1);
}

const notion = new Client({ auth: notionKey });

async function main() {
const res = await notion.pages.create({
parent: { page_id: parentPageId },
properties: {
title: {
title: [
{ text: { content: `OpenClaw Notion 테스트 ${new Date().toISOString()}` } }
]
}
},
children: [
{
object: "block",
type: "paragraph",
paragraph: {
rich_text: [
{ type: "text", text: { content: "노션 API 연동 테스트 성공 ✅" } }
]
}
}
]
});

console.log("✅ Page created:", res.url);
}

main().catch((e) => {
console.error("❌ Error:", e.body || e.message);
});
