import { NextResponse } from "next/server";
import { loadPersistedState } from "@/lib/supabase/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ state: null, mode: "demo" });
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ state: null, mode: "anonymous" });
  }

  const state = await loadPersistedState(supabase, data.user.id);
  return NextResponse.json({ state, mode: "supabase" });
}
