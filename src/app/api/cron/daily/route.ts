import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    actions: [
      "refresh_today_quests",
      "check_upcoming_opportunity_deadlines",
      "create_activity_log_entries",
      "mark_urgent_opportunities",
    ],
  });
}
