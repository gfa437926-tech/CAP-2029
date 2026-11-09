import React, { useState } from 'react';
import { stage1Deliverables, DeliverableSection } from '../../data/stage1Deliverables';
import { 
  FileText, 
  Layers, 
  Map, 
  Compass, 
  Database, 
  ShieldCheck, 
  GitBranch, 
  Code2, 
  CheckCircle2, 
  DollarSign, 
  ChevronLeft,
  Download,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface DeliverablesHubViewProps {
  onNavigateToScreen?: (screenId: string) => void;
  onProceedToSignOff?: () => void;
}

export const DeliverablesHubView: React.FC<DeliverablesHubViewProps> = ({
  onNavigateToScreen,
  onProceedToSignOff
}) => {
  const [selectedId, setSelectedId] = useState<string>('srs');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedDeliverable = stage1Deliverables.find(d => d.id === selectedId) || stage1Deliverables[0];

  const getDeliverableIcon = (id: string) => {
    switch (id) {
      case 'srs': return FileText;
      case 'architecture': return Layers;
      case 'screens-design': return Map;
      case 'navigation-flow': return Compass;
      case 'db-schema': return Database;
      case 'rbac-matrix': return ShieldCheck;
      case 'lifecycle': return GitBranch;
      case 'api-specs': return Code2;
      case 'test-plan': return CheckCircle2;
      case 'cost-estimate': return DollarSign;
      default: return FileText;
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(selectedDeliverable.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              المرحلة 1 من 12: التخطيط والتصميم المعماري
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-400">فريق الهندسة المتكامل (برمجيات · أرصاد · GIS · قواعد بيانات · UX · أمن)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            مستودع المخرجات والوثائق الهندسية لنظام WAMS
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            تم إعداد جميع الوثائق الـ 10 المطلوبة بدقة هندسية ومطابقة لمعايير الأرصاد الجوية (WMO / CAP 1.2)، مع جاهزية كاملة للمراجعة قبل الانتقال إلى المرحلة الثانية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProceedToSignOff}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>بوابة المراجعة والاعتماد الرسمي</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs / Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Deliverables Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 px-2 mb-2 flex items-center justify-between">
            <span>فهرس المخرجات الـ 10 المطلوبة</span>
            <span className="text-emerald-400 font-mono">10 / 10 مكتملة</span>
          </div>

          <div className="space-y-1.5">
            {stage1Deliverables.map(item => {
              const Icon = getDeliverableIcon(item.id);
              const isSelected = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex items-start gap-3 ${isSelected ? 'bg-slate-900 border-amber-500/80 text-white shadow-md' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {item.number}. {item.titleAr}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">#{item.number}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.summaryAr}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Deliverable Document Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col">
          {/* Document Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                  {selectedDeliverable.badge}
                </span>
                <span className="text-xs text-slate-400">المخرج رقم {selectedDeliverable.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedDeliverable.titleAr}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedDeliverable.titleEn}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص البرمجي'}</span>
              </button>
            </div>
          </div>

          {/* Quick Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {selectedDeliverable.highlights.map((h, i) => (
              <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-400 block mb-0.5">{h.labelAr}</span>
                <span className="text-xs font-semibold text-slate-200 leading-tight block">{h.valueAr}</span>
              </div>
            ))}
          </div>

          {/* Document Body (Markdown rendered) */}
          <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4 overflow-y-auto max-h-[620px] pr-2">
            <div className="whitespace-pre-wrap font-sans">
              {selectedDeliverable.contentMarkdown}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>هذه الوثيقة معتمدة ومطابقة لجميع شروط وبنود المرحلة 1.</span>
            </span>

            <button
              onClick={() => {
                const nextIdx = (selectedDeliverable.number % 10);
                setSelectedId(stage1Deliverables[nextIdx].id);
              }}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>الانتقال للمخرج التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
