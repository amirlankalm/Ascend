const requiredForProduction = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
  "CRON_SECRET",
];

const optionalServerOnly = ["SUPABASE_SERVICE_ROLE_KEY"];

const missing = requiredForProduction.filter((key) => !process.env[key]);
const optionalMissing = optionalServerOnly.filter((key) => !process.env[key]);
const strict = process.argv.includes("--strict");

console.log("Ascend environment check");
console.log("========================");

if (missing.length === 0) {
  console.log("Required production variables: present");
} else {
  console.log("Required production variables missing:");
  for (const key of missing) console.log(`- ${key}`);
}

if (optionalMissing.length > 0) {
  console.log("");
  console.log("Optional server variables missing:");
  for (const key of optionalMissing) console.log(`- ${key}`);
}

console.log("");
console.log("Mode summary:");
console.log(`- Supabase persistence: ${missing.includes("NEXT_PUBLIC_SUPABASE_URL") || missing.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY") ? "demo fallback" : "enabled"}`);
console.log(`- OpenAI live generation: ${missing.includes("OPENAI_API_KEY") ? "fallback generation" : "enabled"}`);
console.log(`- Cron protection: ${missing.includes("CRON_SECRET") ? "not configured" : "enabled"}`);

if (strict && missing.length > 0) {
  console.error("");
  console.error("Strict mode failed. Add missing env vars before production deploy.");
  process.exit(1);
}

