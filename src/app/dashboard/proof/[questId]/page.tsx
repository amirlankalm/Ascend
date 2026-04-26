import { ProofWorkbench } from "@/components/proof/ProofWorkbench";

export default async function ProofPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  return <ProofWorkbench questId={questId} />;
}
