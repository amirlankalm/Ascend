"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing. Use Continue demo or configure .env.local.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard/graph");
  }

  async function signUp() {
    setLoading(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing. Use Continue demo or configure .env.local.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <section className="terrain-panel pixel-frame pixel-border relative z-10 w-full max-w-md p-6">
      <div className="grid h-12 w-12 place-items-center border border-ember-line bg-hot-orange/20 text-sun-orange">
        <Glyph name="ascend" size="lg" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold">Enter Ascend</h1>
      <p className="mt-3 leading-6 text-ash-muted">Use Supabase Auth in production, or continue with the local demo path for the hackathon loop.</p>
      <form className="mt-7 space-y-4" onSubmit={(event) => event.preventDefault()}>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" />
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        {message && <p className="pixel-frame border border-ember-line bg-black/24 p-3 text-sm text-ash-muted">{message}</p>}
        <Button className="w-full" type="button" onClick={signIn} disabled={loading || !email || !password}>
          <Glyph name="check" size="sm" />
          {loading ? "Checking..." : "Sign in"}
        </Button>
        <Button className="w-full" type="button" variant="ghost" onClick={signUp} disabled={loading || !email || password.length < 6}>
          <Glyph name="proof" size="sm" />
          Create account
        </Button>
      </form>
      <Link href="/onboarding" className="mt-4 block">
        <Button variant="ghost" className="w-full">
          <Glyph name="arrow" size="sm" />
          Continue demo
        </Button>
      </Link>
    </section>
  );
}
