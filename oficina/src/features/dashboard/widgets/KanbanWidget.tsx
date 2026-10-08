import { WorkBoard } from '../../kanban/components/WorkBoard';
import { useWorkItems } from '../../kanban/workService';

/** Kanban de trabajos en el Panel: mismas columnas y drag and drop, 4 tarjetas por columna. */
export function KanbanWidget() {
  const items = useWorkItems();
  return <WorkBoard items={items} compact maxPerColumn={4} />;
}
