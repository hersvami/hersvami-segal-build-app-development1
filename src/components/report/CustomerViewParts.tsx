import { Check, X, Camera } from 'lucide-react';
import type { ProgressPhoto } from '../../types/domain';
import { formatCurrency, formatDate } from '../../utils/helpers';

/* ─── Progress Photos Section (shown in customer report) ─── */
type PhotoProps = {
  photos?: ProgressPhoto[];
};

export function CustomerProgressPhotos({ photos }: PhotoProps) {
  if (!photos || photos.length === 0) return null;
  return (
    <div className="p-6 border-t border-slate-200">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
        <Camera className="w-4 h-4" />
        Progress Photos
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="rounded-lg overflow-hidden border border-slate-200">
            <img src={photo.url} alt={photo.caption || 'Progress photo'} className="w-full h-32 object-cover" />
            <div className="p-2 bg-slate-50">
              {photo.stage && (
                <span className="inline-block text-[10px] uppercase font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mb-1">
                  {photo.stage}
                </span>
              )}
              {photo.caption && <p className="text-xs text-slate-600 line-clamp-2">{photo.caption}</p>}
              <p className="text-[10px] text-slate-400 mt-1">{formatDate(photo.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Scope Table ─── */
type ScopeTableProps = {
  scope: {
    id: string;
    categoryLabel: string;
    description: string;
    stages: Array<{ name: string; cost: number }>;
    pcItems: Array<{ id: string; description: string; allowance: number }>;
    inclusions: Array<{ id: string; text: string }>;
    exclusions: Array<{ id: string; text: string }>;
  };
  index: number;
};

export function CustomerScopeSection({ scope, index }: ScopeTableProps) {
  return (
    <div>
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs">
          {index + 1}
        </span>
        {scope.categoryLabel}
      </h3>
      <p className="text-sm text-slate-500 mb-3">{scope.description}</p>

      {scope.stages.length > 0 && (
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {scope.stages.map((stage, si) => (
              <tr key={si} className="border-b border-slate-50">
                <td className="py-2">{stage.name}</td>
                <td className="py-2 text-right">{formatCurrency(stage.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PC Items */}
      {scope.pcItems.length > 0 && (
        <div className="mb-3 bg-blue-50 rounded-lg p-3">
          <h4 className="text-xs uppercase text-blue-700 font-semibold mb-2">Prime Cost Items (Allowances)</h4>
          {scope.pcItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1 text-blue-900">
              <span>{item.description}</span>
              <span className="font-medium">{formatCurrency(item.allowance)} allowance</span>
            </div>
          ))}
          <p className="text-xs text-blue-600 mt-2 italic">
            * PC items are allowances. Actual costs may vary and will be adjusted accordingly.
          </p>
        </div>
      )}

      {/* Inclusions */}
      {scope.inclusions.length > 0 && (
        <div className="mb-2 bg-emerald-50 rounded-lg p-3">
          <h4 className="text-xs uppercase text-emerald-700 font-semibold mb-1">Inclusions</h4>
          {scope.inclusions.map((inc) => (
            <div key={inc.id} className="flex items-center gap-2 text-sm text-emerald-800 py-0.5">
              <Check className="w-3 h-3 flex-shrink-0" />
              {inc.text}
            </div>
          ))}
        </div>
      )}

      {/* Exclusions */}
      {scope.exclusions.length > 0 && (
        <div className="bg-red-50 rounded-lg p-3">
          <h4 className="text-xs uppercase text-red-700 font-semibold mb-1">Exclusions</h4>
          {scope.exclusions.map((exc) => (
            <div key={exc.id} className="flex items-center gap-2 text-sm text-red-800 py-0.5">
              <X className="w-3 h-3 flex-shrink-0" />
              {exc.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
