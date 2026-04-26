import { AuthPanel } from "@/components/auth/AuthPanel";

export default function AuthPage() {
  return (
    <main className="app-surface relative grid min-h-screen place-items-center overflow-hidden px-5 text-warm-white">
      <AuthPanel />
    </main>
  );
}
