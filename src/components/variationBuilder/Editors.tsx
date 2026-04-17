import { Plus, X } from 'lucide-react';
import type { QuoteScope } from '../../types/domain';
import { generateId } from '../../utils/helpers';

type ScopeDetailProps = {
  scope: QuoteScope;
  index: number;
  onChange: (next: QuoteScope) => void;
};

export function ScopeDetailEditor({ scope, index, onChange }: ScopeDetailProps) {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
          {index + 1}
        </span>
        {scope.categoryLabel}
      </h3>

      <div className="grid grid-cols-3 gap-3">
        <DimensionInput
          label="Width (m)"
          value={scope.dimensions.width}
          onChange={(value) => onChange({ ...scope, dimensions: { ...scope.dimensions, width: value } })}
        />
        <DimensionInput
          label="Length (m)"
          value={scope.dimensions.length}
          onChange={(value) => onChange({ ...scope, dimensions: { ...scope.dimensions, length: value } })}
        />
        <DimensionInput
          label="Height (m)"
          value={scope.dimensions.height}
          onChange={(value) => onChange({ ...scope, dimensions: { ...scope.dimensions, height: value } })}
        />
      </div>

      {scope.stages.length > 0 && (
        <div className="space-y-1">
          {scope.stages.map((stage, stageIndex) => (
            <div key={stageIndex} className="flex items-center gap-3 rounded bg-slate-50 p-2 text-sm">
              <span className="w-40 truncate font-medium">{stage.name}</span>
              <span className="w-24 text-slate-500">{stage.trade}</span>
              <span className="text-slate-500">{stage.duration}d</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type PCItemEditorProps = {
  items: Array<{ id: string; description: string; allowance: number; unit: string }>;
  onChange: (next: Array<{ id: string; description: string; allowance: number; unit: string }>) => void;
};

export function PCItemEditor({ items, onChange }: PCItemEditorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-slate-700">PC Items</h4>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], description: e.target.value };
              onChange(next);
            }}
            className="flex-1 rounded border px-2 py-1 text-sm"
          />
          <input
            type="number"
            value={item.allowance}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], allowance: Number(e.target.value) };
              onChange(next);
            }}
            className="w-24 rounded border px-2 py-1 text-sm"
          />
          <span className="w-16 text-xs text-slate-500">{item.unit}</span>
          <button onClick={() => onChange(items.filter((_, i) => i !== index))} className="p-1 hover:text-red-600" aria-label="Delete PC item">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      <button
        onClick={() => onChange([...items, { id: generateId(), description: '', allowance: 0, unit: 'allowance' }])}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-3 w-3" />
        Add PC Item
      </button>
    </div>
  );
}

type DimensionInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function DimensionInput({ label, value, onChange }: DimensionInputProps) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border px-2 py-1.5 text-sm"
      />
    </div>
  );
}