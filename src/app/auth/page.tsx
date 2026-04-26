import { AuthPanel } from "@/components/auth/AuthPanel";
import { Mountains } from "@/components/design/Mountains";

export default function AuthPage() {
  return (
    <main className="mountain-sky relative grid min-h-screen place-items-center overflow-hidden px-5 text-warm-white">
      <div className="pixel-sun" aria-hidden="true" />
      <div className="pixel-overlay" aria-hidden="true" />
      <Mountains />
      <AuthPanel />
    </main>
  );
}
