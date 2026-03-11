import "dotenv/config";

const q = process.argv.slice(2).join(" ") || "도쿄 3박4일 여행 일정 추천";
const apiKey = process.env.BRAVE_API_KEY;

if (!apiKey) {
console.error("❌ BRAVE_API_KEY 없음 (.env 확인)");
process.exit(1);
}

const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=5&country=kr&search_lang=ko`;

const res = await fetch(url, {
headers: {
"Accept": "application/json",
"X-Subscription-Token": apiKey
}
});

if (!res.ok) {
console.error("❌ HTTP", res.status, await res.text());
process.exit(1);
}

const data = await res.json();
const results = data?.web?.results || [];

console.log(`\n🔎 Query: ${q}\n`);
for (const [i, r] of results.entries()) {
console.log(`${i + 1}. ${r.title}`);
console.log(` ${r.url}`);
}
