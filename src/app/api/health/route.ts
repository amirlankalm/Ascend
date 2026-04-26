import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    app: "ok",
    timestamp: new Date().toISOString(),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    cronSecret: Boolean(process.env.CRON_SECRET),
  };

  const mode =
    checks.supabaseUrl && checks.supabaseAnonKey
      ? "persistent"
      : "demo-fallback";

  return NextResponse.json({
    service: "ascend",
    status: "ok",
    mode,
    checks,
  });
}

