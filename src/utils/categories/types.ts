/* ─── Segal Build — Category System ─── */

export type UnitType = 'area' | 'linear' | 'item' | 'allow';

export type ScopeQuestion = {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  options?: string[];
};

export type CategoryRelation = {
  categoryId: string;
  type: 'auto' | 'suggested';
};

export type WorkCategory = {
  id: string;
  label: string;
  icon: string;
  group: string;
  questions: ScopeQuestion[];
  stages: Array<{ name: string; trade: string; rate: number; unit: UnitType; duration: number; description: string }>;
  pcItems: Array<{ description: string; allowance: number; unit: string }>;
  inclusions: string[];
  exclusions: string[];
  relations: CategoryRelation[];
  contingencySuggestion: number;
  workType: string;
};

/* ── Category Groups ── */
export const CATEGORY_GROUPS: Record<string, string> = {
  wet: 'Wet Areas & Interiors',
  structural: 'Structural & Extensions',
  external: 'External Works',
  trades: 'Trades & Services',
  specialty: 'Specialty',
};

/* ── Compact category factory ── */
export function cat(
  id: string, label: string, icon: string, group: string,
  questions: ScopeQuestion[],
  stages: WorkCategory['stages'],
  pcItems: WorkCategory['pcItems'],
  inclusions: string[],
  exclusions: string[],
  relations: CategoryRelation[],
  contingency = 10,
  workType = 'renovation',
): WorkCategory {
  return { id, label, icon, group, questions, stages, pcItems, inclusions, exclusions, relations, contingencySuggestion: contingency, workType };
}
