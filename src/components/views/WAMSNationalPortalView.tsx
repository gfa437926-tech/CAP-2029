/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck2, 
  Layers, 
  Database, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  Radio,
  FileCode,
  MapPin,
  Lock,
  Workflow
} from 'lucide-react';
import { wamsNationalPhase1Docs, Phase1DocumentSection } from '../../data/wamsNationalPhase1';
import { ScreenId } from '../Navigation';

interface WAMSNationalPortalViewProps {
  onNavigateToScreen: (screen: ScreenId) => void;
  onProceedToSignOff: () => void;
}

export const WAMSNationalPortalView: React.FC<WAMSNationalPortalViewProps> = ({
  onNavigateToScreen,
  onProceedToSignOff
}) => {
  const [activeStepId, setActiveStepId] = useState<string>(wamsNationalPhase1Docs[0].id);

  const activeDoc = wamsNationalPhase1Docs.find(d => d.id === activeStepId) || wamsNationalPhase1Docs[0];
  const activeIndex = wamsNationalPhase1Docs.findIndex(d => d.id === activeStepId);

  const handleNextStep = () => {
    if (activeIndex < wamsNationalPhase1Docs.length - 1) {
      setActiveStepId(wamsNationalPhase1Docs[activeIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (activeIndex > 0) {
      setActiveStepId(wamsNationalPhase1Docs[activeIndex - 1].id);
    }
  };

  const handleExportMarkdown = () => {
    const fullReport = wamsNationalPhase1Docs.map(d => (
      `# ${d.titleAr}\n\n` +
      `**الموجز:** ${d.summaryAr}\n\n` +
      d.contentMarkdown + '\n\n---\n\n'
    )).join('\n');

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(fullReport);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `wams-national-phase1-master-spec-${Date.now()}.md`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Hero Executive Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-amber-400 text-slate-950">
                المرحلة الأولى: التأسيس وحماية الموجود
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                الخطوات 1 إلى 7 مكتملة 100%
              </span>
              <span className="text-slate-500 text-xs font-mono">
                الفرع: feat/wams-national-phase1-foundation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              WAMS National – المنصة الوطنية للإنذار المبكر وإدارة المخاطر
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-3xl leading-relaxed">
              منصة مؤسسية موحدة تخدم المركز الوطني للأرصاد الجوية والمناخ، وزارة الطوارئ وإدارة الكوارث السورية، والقطاعات الصحية والزراعية والطيران والموانئ والمرور، وتغطي كافة الأخطار الطبيعية والتقنية وفق أعلى معايير الأمان والهندسة البرمجية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تصدير الوثيقة الوطنية MD</span>
            </button>
            <button
              onClick={onProceedToSignOff}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>اعتماد مخرجات المرحلة الأولى</span>
            </button>
          </div>
        </div>

        {/* Phase 1 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">المستودع المعتمد</div>
            <div className="font-bold text-white text-xs mt-0.5 truncate">CAP-2029 (Main)</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">الجهات الشريكة</div>
            <div className="font-bold text-amber-400 text-xs mt-0.5">9 وزارات وقطاعات</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">سجل الأخطار الوطني</div>
            <div className="font-bold text-emerald-400 text-xs mt-0.5">8 مجموعات كبرى</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">أصول الرصد والاستشعار</div>
            <div className="font-bold text-sky-400 text-xs mt-0.5">7 شبكات وطنية</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">نمط المعمارية</div>
            <div className="font-bold text-purple-400 text-xs mt-0.5">Decoupled Engines</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">حالة قاعدة البيانات</div>
            <div className="font-bold text-amber-300 text-xs mt-0.5">محمية (تصميم ERD)</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px]">الأمن السيبراني</div>
            <div className="font-bold text-emerald-300 text-xs mt-0.5">Zero-Trust & CI</div>
          </div>
        </div>
      </div>

      {/* Quick Interactive Tool Links Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-amber-400" />
          <span>الأدوات التفاعلية للمرحلة الأولى:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToScreen('national_registry' as ScreenId)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>سجل الأخطار التفاعلي (8 أخطار)</span>
          </button>
          <button
            onClick={() => onNavigateToScreen('national_catalogue' as ScreenId)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>كتالوج شبكات الرصد (7 شبكات)</span>
          </button>
          <button
            onClick={() => onNavigateToScreen('qgis_postgis' as ScreenId)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>استوديو QGIS ومحرك PostGIS المكاني</span>
          </button>
          <button
            onClick={() => onNavigateToScreen('gis_map' as ScreenId)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>الخريطة المكانية الحية (OSM/Leaflet)</span>
          </button>
        </div>
      </div>

      {/* Main Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {wamsNationalPhase1Docs.map((step) => {
          const isCurrent = step.id === activeStepId;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-400/10 border-amber-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isCurrent ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  الخطوة {step.stepNumber}
                </span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400' : 'text-emerald-500'}`} />
              </div>
              <h3 className={`font-bold text-xs leading-snug line-clamp-2 ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                {step.badge}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Step Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                الخطوة {activeDoc.stepNumber} من 7
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeDoc.titleEn}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{activeDoc.titleAr}</h2>
            <p className="text-sm text-slate-400 mt-1">{activeDoc.summaryAr}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevStep}
              disabled={activeIndex === 0}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="الخطوة السابقة"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">
              {activeIndex + 1} / {wamsNationalPhase1Docs.length}
            </span>
            <button
              onClick={handleNextStep}
              disabled={activeIndex === wamsNationalPhase1Docs.length - 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="الخطوة التالية"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeDoc.metrics.map((m, idx) => (
            <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-500">{m.label}</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Markdown Content Display */}
        <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-4">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-amber-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
            <div className="whitespace-pre-wrap font-sans text-sm">
              {activeDoc.contentMarkdown}
            </div>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={handlePrevStep}
            disabled={activeIndex === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق: الخطوة {activeIndex > 0 ? activeIndex : ''}</span>
          </button>

          {activeIndex < wamsNationalPhase1Docs.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>التالي: الخطوة {activeIndex + 2}</span>
              <ArrowLeft className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <button
              onClick={onProceedToSignOff}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>اكتمال الخطوات السبع · الانتقال للاعتماد الرسمي</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
