import { QuestMission } from "@/components/quest/QuestMission";
import { createDemoGraph } from "@/lib/demo/graph";

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const graph = createDemoGraph();
  const quest = graph.quests.find((item) => item.id === id) ?? graph.quests[0];
  return <QuestMission quest={quest} />;
}
