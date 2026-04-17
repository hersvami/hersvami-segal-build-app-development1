import { ChevronDown, ChevronUp, Plus, Sparkles, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

type CategoryOption = { id: string; label: string };
type GroupedCategories = Record<string, CategoryOption[]>;

type Recognition = {
  categoryId: string;
  label: string;
  confidence: number;
};

type ScopeSummary = {
  id: string;
  categoryLabel: string;
  description: string;
};

type Props = {
  documentType: 'quote' | 'variation';
  scopeInput: string;
  setScopeInput: (value: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  recognised: Recognition[];
  showCategoryBrowser: boolean;
  setShowCategoryBrowser: (value: boolean) => void;
  groupedCategories: GroupedCategories;
  selectedLabel?: string;
  scopes: ScopeSummary[];
  geminiKey: string;
  setGeminiKey: (value: string) => void;
  apiPolishing: boolean;
  varRefQuote: string;
  setVarRefQuote: (value: string) => void;
  varReason: string;
  setVarReason: (value: string) => void;
  approvedQuotes: Array<{ id: string; title: string }>;
  lastAiModel: string;
  onRecognise: () => void;
  onPolish: () => Promise<void>;
  onAddScope: (categoryId: string) => void;
  onRemoveScope: (index: number) => void;
};

export function ScopeStep(props: Props) {
  const {
    documentType,
    scopeInput,
    setScopeInput,
    selectedCategoryId,
    setSelectedCategoryId,
    recognised,
    showCategoryBrowser,
    setShowCategoryBrowser,
    groupedCategories,
    selectedLabel,
    scopes,
    geminiKey,
    setGeminiKey,
    apiPolishing,
    varRefQuote,
    setVarRefQuote,
    varReason,
    setVarReason,
    approvedQuotes,
    lastAiModel,
    onRecognise,
    onPolish,
    onAddScope,
    onRemoveScope,
  } = props;

  return (
    <div className="space-y-4">
      {documentType === 'variation' && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-900">Variation Details</h3>
          <select
            value={varRefQuote}
            onChange={(e) => setVarRefQuote(e.target.value)}
            className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
          >
            <option value="">Reference Quote...</option>
            {approvedQuotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.title}
              </option>
            ))}
          </select>
          <select
            value={varReason}
            onChange={(e) => setVarReason(e.target.value)}
            className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
          >
            <option value="">Reason for Change...</option>
            {['Client Request', 'Site Condition', 'Design Change', 'Compliance', 'Other'].map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={scopeInput}
            onChange={(e) => {
              setScopeInput(e.target.value);
              setSelectedCategoryId('');
            }}
            placeholder="Describe scope: e.g. bathroom reno 3x2.5m full gut"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={onRecognise} className="rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
            Recognise
          </button>
          {geminiKey && (
            <button
              onClick={onPolish}
              disabled={apiPolishing}
              className="rounded-lg bg-purple-600 px-3 text-white hover:bg-purple-700 disabled:opacity-50"
              title="Polish description"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
        </div>

        {!geminiKey && (
          <div className="space-y-1">
            <input
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Gemini API Key (optional — enables AI polish)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500"
            />
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline">
              Get free API key from Google AI Studio →
            </a>
          </div>
        )}

        {geminiKey && (
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> AI Active
            </span>
            {lastAiModel && (
              <span className="text-slate-400">Last used: {lastAiModel}</span>
            )}
            {apiPolishing && (
              <span className="text-purple-500">Processing...</span>
            )}
            <span className="ml-auto text-slate-400">
              Free cascade: Flash → Lite → 1.5 → 2.0
            </span>
          </div>
        )}

        {recognised.length > 0 && !selectedCategoryId && (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-sm font-medium text-slate-700">Detected Categories:</p>
            <div className="flex flex-wrap gap-2">
              {recognised.map((result) => (
                <button
                  key={result.categoryId}
                  onClick={() => setSelectedCategoryId(result.categoryId)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                    selectedCategoryId === result.categoryId
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white hover:border-blue-400',
                  )}
                >
                  {result.label} ({Math.round(result.confidence * 100)}%)
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCategoryBrowser(!showCategoryBrowser)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
          Browse All 43 Categories
          {showCategoryBrowser ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showCategoryBrowser && (
          <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-4">
            {Object.entries(groupedCategories).map(([group, categories]) => (
              <div key={group}>
                <h4 className="mb-1 text-xs font-semibold uppercase text-slate-500">{group}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onAddScope(category.id)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs transition-colors hover:border-blue-400 hover:text-blue-600"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategoryId && (
          <button
            onClick={() => onAddScope(selectedCategoryId)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Scope - {selectedLabel}
          </button>
        )}
      </div>

      {scopes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900">Added Scopes ({scopes.length})</h3>
          {scopes.map((scope, index) => (
            <div key={scope.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{scope.categoryLabel}</p>
                <p className="text-xs text-slate-500">{scope.description}</p>
              </div>
              <button onClick={() => onRemoveScope(index)} className="p-1 hover:text-red-600" aria-label="Remove scope">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}