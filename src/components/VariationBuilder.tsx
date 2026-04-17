import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import type { Project, QuoteScope, Variation } from '../types/domain';
import { cn, formatCurrency, generateId } from '../utils/helpers';
import { getCategoryById } from '../utils/categories/extended';
import { getAllCategories, recogniseScope } from '../utils/pricing/scopeRecogniser';
import { generateSolutionFromCategory } from '../utils/pricing/engine';
import { calculateQuote } from '../utils/pricing/quoteCalculator';
import { getDefaultExclusions, getDefaultInclusions, getDefaultPCItems } from '../utils/pricing/quoteDefaults';
import { polishScopeWithAI } from '../utils/services';
import { ScopeStep } from './variationBuilder/ScopeStep';
import { PCItemEditor, ScopeDetailEditor } from './variationBuilder/Editors';
type Props = {
  project: Project;
  documentType: 'quote' | 'variation';
  existingQuotes: Variation[];
  companyOH: number;
  companyProfit: number;
  onSave: (variation: Variation) => void;
  onCancel: () => void;
};

type Step = 'scope' | 'details' | 'pricing' | 'review';
export function VariationBuilder({ project, documentType, existingQuotes, companyOH, companyProfit, onSave, onCancel }: Props) {
  const [step, setStep] = useState<Step>('scope');
  const [scopeInput, setScopeInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [scopes, setScopes] = useState<QuoteScope[]>([]);
  const [ohPct, setOhPct] = useState(companyOH);
  const [profitPct, setProfitPct] = useState(companyProfit);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [varRefQuote, setVarRefQuote] = useState('');
  const [varReason, setVarReason] = useState('');
  const [geminiKey, setGeminiKey] = useState(project.geminiApiKey || '');
  const [apiPolishing, setApiPolishing] = useState(false);
  const [lastAiModel, setLastAiModel] = useState('');

  const recognised = scopeInput.length > 2 ? recogniseScope(scopeInput) : [];
  const groupedCategories = useMemo(groupCategories, []);
  const approvedQuotes = existingQuotes.filter((q) => q.documentType === 'quote' && q.status === 'approved');
  const pricing = calculateQuote(
    scopes.reduce((sum, scope) => sum + scope.stages.reduce((stageSum, stage) => stageSum + (stage.cost || 0), 0), 0) ||
      scopes.reduce((sum, scope) => {
        const category = getCategoryById(scope.categoryId);
        if (!category) return sum;
        const area = scope.dimensions.width * scope.dimensions.length || 100;
        return (
          sum +
          category.stages.reduce((stageSum, stage) => {
            const cost = stage.unit === 'area' ? stage.rate * area : stage.unit === 'linear' ? stage.rate * scope.dimensions.width : stage.rate;
            return stageSum + cost;
          }, 0)
        );
      }, 0),
    ohPct,
    profitPct,
    contingencyPct,
  );

  const canNext = step === 'scope'
    ? scopes.length > 0 && (documentType === 'quote' || (Boolean(varRefQuote) && Boolean(varReason)))
    : true;
  const handleAddScope = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (!category) return;

    const { scope, stages } = generateSolutionFromCategory(categoryId, scopeInput || category.label, { width: 10, length: 10, height: 3 });
    scope.stages = stages;
    scope.pcItems = getDefaultPCItems(categoryId);
    scope.inclusions = getDefaultInclusions(categoryId);
    scope.exclusions = getDefaultExclusions(categoryId);

    setScopes((prev) => [...prev, scope]);
    setScopeInput('');
    setSelectedCategoryId('');
  };

  const handlePolish = async () => {
    if (!geminiKey || !scopeInput.trim()) return;
    setApiPolishing(true);
    const result = await polishScopeWithAI(scopeInput, geminiKey);
    setScopeInput(result.text);
    if (result.model) setLastAiModel(result.model);
    setApiPolishing(false);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const nextVariationCount = existingQuotes.filter((v) => v.documentType === 'variation').length + 1;
    onSave({
      id: generateId(),
      title: documentType === 'quote' ? `Quote - ${project.name}` : `Variation ${scopes.map((s) => s.categoryLabel).join(', ')}`,
      description: scopes.map((s) => s.description).join('; '),
      status: 'draft',
      documentType,
      scopes,
      pricing,
      changeLog: [
        {
          id: generateId(),
          action: 'created',
          timestamp: now,
          user: 'Builder',
          details: `${documentType} created with ${scopes.length} scope(s)`,
        },
      ],
      createdAt: now,
      updatedAt: now,
      internalNotes: [],
      source: 'internal',
      referenceQuoteId: documentType === 'variation' ? varRefQuote : undefined,
      reasonForChange: documentType === 'variation' ? varReason : undefined,
      variationNumber: documentType === 'variation' ? `V-${String(nextVariationCount).padStart(3, '0')}` : undefined,
      costImpact: documentType === 'variation' ? 'additional' : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        <header className="shrink-0 border-b border-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{documentType === 'quote' ? 'New Quote' : 'New Variation'}</h2>
            <button onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close builder">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {(['scope', 'details', 'pricing', 'review'] as Step[]).map((name, i) => (
              <div
                key={name}
                className={cn('flex-1 rounded-lg py-2 text-center text-sm font-medium', name === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500')}
              >
                {i + 1}. {name.charAt(0).toUpperCase() + name.slice(1)}
              </div>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {step === 'scope' && (
            <ScopeStep
              documentType={documentType}
              scopeInput={scopeInput}
              setScopeInput={setScopeInput}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              recognised={recognised}
              showCategoryBrowser={showCategoryBrowser}
              setShowCategoryBrowser={setShowCategoryBrowser}
              groupedCategories={groupedCategories}
              selectedLabel={getCategoryById(selectedCategoryId)?.label}
              scopes={scopes}
              geminiKey={geminiKey}
              setGeminiKey={setGeminiKey}
              apiPolishing={apiPolishing}
              varRefQuote={varRefQuote}
              setVarRefQuote={setVarRefQuote}
              varReason={varReason}
              setVarReason={setVarReason}
              approvedQuotes={approvedQuotes.map((q) => ({ id: q.id, title: q.title }))}
              onRecognise={() => setSelectedCategoryId(recogniseScope(scopeInput)[0]?.categoryId ?? '')}
              onPolish={handlePolish}
              lastAiModel={lastAiModel}
              onAddScope={handleAddScope}
              onRemoveScope={(index) => setScopes((prev) => prev.filter((_, i) => i !== index))}
            />
          )}

          {step === 'details' && (
            <div className="space-y-6">
              {scopes.map((scope, index) => (
                <ScopeDetailEditor
                  key={scope.id}
                  scope={scope}
                  index={index}
                  onChange={(next) => setScopes((prev) => prev.map((s, i) => (i === index ? next : s)))}
                />
              ))}
            </div>
          )}

          {step === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <PercentInput label="Overhead %" value={ohPct} onChange={setOhPct} />
                <PercentInput label="Profit %" value={profitPct} onChange={setProfitPct} />
                <PercentInput label="Contingency %" value={contingencyPct} onChange={setContingencyPct} />
              </div>
              {scopes.map((scope, scopeIndex) => (
                <div key={scope.id} className="rounded-xl border p-4">
                  <h3 className="mb-3 font-semibold">{scope.categoryLabel}</h3>
                  <PCItemEditor
                    items={scope.pcItems}
                    onChange={(items) => setScopes((prev) => prev.map((s, i) => (i === scopeIndex ? { ...s, pcItems: items } : s)))}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 'review' && <ReviewStep scopes={scopes} pricing={pricing} ohPct={ohPct} profitPct={profitPct} contingencyPct={contingencyPct} />}
        </main>

        <footer className="flex shrink-0 justify-between border-t border-slate-200 p-4">
          <button onClick={() => moveStep(step, setStep, -1)} disabled={step === 'scope'} className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step === 'review' ? (
            <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700">
              <Check className="h-4 w-4" /> Save {documentType === 'quote' ? 'Quote' : 'Variation'}
            </button>
          ) : (
            <button onClick={() => canNext && moveStep(step, setStep, 1)} disabled={!canNext} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

function groupCategories() {
  const groups: Record<string, Array<{ id: string; label: string }>> = {};
  for (const category of getAllCategories()) {
    if (!groups[category.group]) groups[category.group] = [];
    groups[category.group].push({ id: category.id, label: category.label });
  }
  return groups;
}

function moveStep(step: Step, setStep: (value: Step) => void, delta: number) {
  const steps: Step[] = ['scope', 'details', 'pricing', 'review'];
  const index = steps.indexOf(step);
  const next = index + delta;
  if (next >= 0 && next < steps.length) setStep(steps[next]);
}

function PercentInput({ label, value, onChange }: { label: string; value: number; onChange: (next: number) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
    </div>
  );
}

function ReviewStep({
  scopes,
  pricing,
  ohPct,
  profitPct,
  contingencyPct,
}: {
  scopes: QuoteScope[];
  pricing: ReturnType<typeof calculateQuote>;
  ohPct: number;
  profitPct: number;
  contingencyPct: number;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-6">
        <h3 className="mb-4 text-lg font-bold">Pricing Summary</h3>
        <div className="space-y-2 text-sm">
          <PriceRow label="Trade Cost" value={pricing.tradeCost} strong />
          <PriceRow label={`Overhead (${ohPct}%)`} value={pricing.overhead} />
          <PriceRow label={`Profit (${profitPct}%)`} value={pricing.profit} />
          <PriceRow label={`Contingency (${contingencyPct}%)`} value={pricing.contingency} />
          <PriceRow label="Subtotal" value={pricing.clientTotal} strong bordered />
          <PriceRow label="GST (10%)" value={pricing.gst} />
          <PriceRow label="Total Inc GST" value={pricing.totalIncGst} strong bordered big />
        </div>
      </div>

      {scopes.map((scope, index) => (
        <div key={scope.id} className="rounded-xl border p-4">
          <h4 className="flex items-center gap-2 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">{index + 1}</span>
            {scope.categoryLabel}
          </h4>
          <p className="mt-1 text-sm text-slate-500">{scope.description}</p>
          <p className="mt-1 text-sm text-slate-500">
            Dimensions: {scope.dimensions.width}m x {scope.dimensions.length}m x {scope.dimensions.height}m
          </p>
          <p className="mt-2 text-sm text-slate-500">{scope.stages.length} stages</p>
        </div>
      ))}
    </div>
  );
}

function PriceRow({ label, value, strong, bordered, big }: { label: string; value: number; strong?: boolean; bordered?: boolean; big?: boolean }) {
  return (<div className={cn('flex justify-between', bordered && 'border-t pt-2', strong && 'font-medium', big && 'text-lg font-bold text-blue-600')}><span>{label}</span><span>{formatCurrency(value)}</span></div>);
}