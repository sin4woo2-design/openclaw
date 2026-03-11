import "dotenv/config";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const query = process.argv.slice(2).join(" ") || "오사카 라멘 맛집";

if (!apiKey) {
console.error("❌ GOOGLE_MAPS_API_KEY 없음 (.env 확인)");
process.exit(1);
}

const url = "https://places.googleapis.com/v1/places:searchText";

const body = {
textQuery: query,
languageCode: "ko",
regionCode: "KR",
maxResultCount: 5
};

const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-Goog-Api-Key": apiKey,
"X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri"
},
body: JSON.stringify(body)
});

if (!res.ok) {
console.error("❌ HTTP", res.status, await res.text());
process.exit(1);
}

const data = await res.json();
const places = data.places || [];

if (!places.length) {
console.log("결과 없음");
process.exit(0);
}

console.log(`\n📍 Query: ${query}\n`);
for (const [i, p] of places.entries()) {
console.log(`${i + 1}. ${p.displayName?.text ?? "이름 없음"}`);
console.log(` 주소: ${p.formattedAddress ?? "-"}`);
console.log(` 평점: ${p.rating ?? "-"} (${p.userRatingCount ?? 0})`);
console.log(` 지도: ${p.googleMapsUri ?? "-"}`);
}
