/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  Activity, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Flame,
  CloudRain,
  Waves,
  HeartPulse,
  Truck,
  Wind,
  AlertTriangle,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { HazardCategory, HazardDefinition, HazardSeverity, SectorType } from '../../types/national';
import { nationalHazardsRegistry, nationalSectors } from '../../data/nationalRegistry';

const categoryLabels: Record<HazardCategory, { ar: string; en: string; icon: React.ElementType; color: string }> = {
  meteorological: { ar: 'أخطار جوية', en: 'Meteorological', icon: CloudRain, color: 'text-sky-400 bg-sky-950/60 border-sky-800/60' },
  hydrological: { ar: 'أخطار مائية وسيول', en: 'Hydrological', icon: Waves, color: 'text-blue-400 bg-blue-950/60 border-blue-800/60' },
  geological: { ar: 'أخطار جيولوجية وزلزالية', en: 'Geological & Seismic', icon: Activity, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' },
  wildfire: { ar: 'حرائق الغابات', en: 'Wildfires', icon: Flame, color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' },
  maritime: { ar: 'أخطار بحرية وموانئ', en: 'Maritime & Waves', icon: Waves, color: 'text-teal-400 bg-teal-950/60 border-teal-800/60' },
  health: { ar: 'أخطار صحية وأوبئة', en: 'Health & Medical', icon: HeartPulse, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' },
  environmental: { ar: 'أخطار بيئية وغبار', en: 'Environmental', icon: Wind, color: 'text-orange-400 bg-orange-950/60 border-orange-800/60' },
  technological: { ar: 'أخطار تقنية وصناعية', en: 'Technological & Hazmat', icon: Truck, color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' },
};

const severityBadges: Record<HazardSeverity, { labelAr: string; colorClass: string }> = {
  informational: { labelAr: 'إشعاري', colorClass: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  minor: { labelAr: 'طفيف', colorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  moderate: { labelAr: 'متوسط', colorClass: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  severe: { labelAr: 'شديد', colorClass: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  extreme: { labelAr: 'أقصى / كارثي', colorClass: 'bg-rose-950/80 text-rose-300 border-rose-800' },
};

export const NationalRegistryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHazard, setActiveHazard] = useState<HazardDefinition | null>(nationalHazardsRegistry[0] || null);

  const filteredHazards = useMemo(() => {
    return nationalHazardsRegistry.filter(h => {
      if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
      if (selectedSector !== 'all' && h.primarySector !== selectedSector && !h.participatingSectors.includes(selectedSector as SectorType)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = h.nameAr.toLowerCase().includes(q);
        const matchEn = h.nameEn.toLowerCase().includes(q);
        const matchCode = h.code.toLowerCase().includes(q);
        const matchUnit = h.monitoringUnit.toLowerCase().includes(q);
        if (!matchAr && !matchEn && !matchCode && !matchUnit) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSector, searchQuery]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredHazards, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `wams-national-hazard-registry-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const getSectorName = (sectorKey: SectorType) => {
    const sec = nationalSectors.find(s => s.sector === sectorKey);
    return sec ? sec.nameAr : sectorKey;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                WAMS NATIONAL · الخطوة 3
              </span>
              <span className="text-slate-500 text-xs font-mono">معيار OASIS CAP 1.2 / OGC</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <span>سجل الأخطار الوطني الشامل (National Hazard Registry)</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              السجل المركزي الموحد لتوصيف وتصنيف الأخطار الطبيعية والتقنية في الجغرافيا السورية، مع تحديد وحدات المراقبة وعتبات الثقة ومستويات التدرج الخمسة والجهات المختصة لكل خطر.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تصدير السجل JSON</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">مجموعات الأخطار</div>
            <div className="text-xl font-bold text-white mt-1">8 مجموعات</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">الظواهر المسجلة في السجل</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{nationalHazardsRegistry.length} ظاهرة</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">القطاعات والوزارات المعتمدة</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{nationalSectors.length} جهات حكومية</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">مستويات التدرج والخطورة</div>
            <div className="text-xl font-bold text-rose-400 mt-1">5 مستويات (CAP)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم العربي، الإنجليزي أو الرمز..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Sector filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">كافة القطاعات والوزارات</option>
              {nationalSectors.map(s => (
                <option key={s.sector} value={s.sector}>{s.nameAr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>كافة الأخطار ({nationalHazardsRegistry.length})</span>
        </button>
        {Object.entries(categoryLabels).map(([catKey, info]) => {
          const Icon = info.icon;
          const count = nationalHazardsRegistry.filter(h => h.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                selectedCategory === catKey
                  ? 'bg-slate-800 text-white border-amber-400/80 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{info.ar} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hazards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
          {filteredHazards.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>لم يتم العثور على أخطار تطابق معايير البحث والفلترة الحالية.</p>
            </div>
          ) : (
            filteredHazards.map(h => {
              const catInfo = categoryLabels[h.category] || categoryLabels.meteorological;
              const Icon = catInfo.icon;
              const isSelected = activeHazard?.id === h.id;

              return (
                <div
                  key={h.id}
                  onClick={() => setActiveHazard(h)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400/70 shadow-md shadow-amber-950/20'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border shrink-0 ${catInfo.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {h.code}
                          </span>
                          <span className="text-xs text-slate-400">{catInfo.ar}</span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">{h.nameAr}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{h.nameEn}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 mt-1 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : ''}`} />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{getSectorName(h.primarySector)}</span>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">{h.alertLevels.length} مستويات إنذار</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Hazard Detail Inspector */}
        <div className="lg:col-span-7">
          {activeHazard ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 sticky top-20">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {activeHazard.code}
                    </span>
                    <span className="text-xs text-slate-400">
                      {categoryLabels[activeHazard.category]?.ar}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{activeHazard.nameAr}</h2>
                  <p className="text-sm font-mono text-slate-400">{activeHazard.nameEn}</p>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[11px] text-slate-500 block">وحدة المراقبة</span>
                  <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/60 block mt-1">
                    {activeHazard.monitoringUnit}
                  </span>
                </div>
              </div>

              {/* Responsible Sector & Confidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>الجهة الحكومية المسؤولة أساسياً</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {getSectorName(activeHazard.primarySector)}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>عتبة موثوقية الرصد (Confidence)</span>
                  </div>
                  <div className="text-white font-semibold text-sm font-mono">
                    {activeHazard.confidenceThreshold}
                  </div>
                </div>
              </div>

              {/* Participating Sectors & Data Sources */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1.5">الجهات والقطاعات المشاركة في الاستجابة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeHazard.participatingSectors.map(secKey => (
                      <span key={secKey} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {getSectorName(secKey)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1.5">مصادر البيانات الحية وشبكات الرصد:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeHazard.dataSources.map((ds, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono text-[11px]">
                        {ds}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5 Alert Levels Matrix */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>مستويات الإنذار الخمسة (CAP Severity Tiers & Actions)</span>
                </h4>

                <div className="space-y-2.5">
                  {activeHazard.alertLevels.map((lvl, index) => {
                    const badge = severityBadges[lvl.level] || severityBadges.minor;
                    return (
                      <div key={index} className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.colorClass}`}>
                            {badge.labelAr} ({lvl.level.toUpperCase()})
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">المستوى {index + 1} من 5</span>
                        </div>

                        <div className="space-y-1.5">
                          <div>
                            <span className="text-slate-500 font-medium">شرط إطلاق الإنذار: </span>
                            <span className="text-slate-200 font-mono text-[11px]">{lvl.triggerCondition}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">الإجراء المؤسسي المطلوب: </span>
                            <span className="text-amber-300/90">{lvl.actionRequired}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Impacted Vulnerabilities */}
              <div className="border-t border-slate-800 pt-4 text-xs">
                <span className="text-slate-400 block mb-2 font-medium">الأصول والقطاعات الحيوية المعرضة للخطر:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeHazard.impactedVulnerabilities.map((vul, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-rose-950/30 text-rose-300 border border-rose-800/40 text-[11px]">
                      {vul}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p>اختر أحد الأخطار من القائمة لعرض تفاصيله ومعايير إطلاقه.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
