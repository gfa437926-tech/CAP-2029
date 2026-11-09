/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ShieldCheck, 
  Radio, 
  Satellite, 
  Activity, 
  Download, 
  ExternalLink, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { DataClassification, NationalDataSource } from '../../types/national';
import { nationalDataCatalogue } from '../../data/nationalRegistry';

const classificationStyles: Record<DataClassification, { labelAr: string; colorClass: string }> = {
  public: { labelAr: 'عام (Public)', colorClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-800' },
  restricted: { labelAr: 'مقيد (Restricted)', colorClass: 'bg-blue-950/70 text-blue-300 border-blue-800' },
  sensitive: { labelAr: 'حساس (Sensitive)', colorClass: 'bg-amber-950/70 text-amber-300 border-amber-800' },
  top_secret: { labelAr: 'سري للغاية (Top Secret)', colorClass: 'bg-rose-950/70 text-rose-300 border-rose-800' },
};

const collectionMethodLabels: Record<string, { labelAr: string; icon: React.ElementType }> = {
  telemetry: { labelAr: 'تيليميتري لاسلكي', icon: Radio },
  satellite: { labelAr: 'أقمار صناعية', icon: Satellite },
  radar: { labelAr: 'رادار دوبلري', icon: Activity },
  iot_sensor: { labelAr: 'مجسات إنترنت الأشياء IoT', icon: HardDrive },
  field_report: { labelAr: 'بلاغات ميدانية', icon: Building },
  api: { labelAr: 'واجهة API مؤتمتة', icon: Database },
};

export const NationalDataCatalogueView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<NationalDataSource | null>(nationalDataCatalogue[0] || null);

  const filteredCatalogue = useMemo(() => {
    return nationalDataCatalogue.filter(item => {
      if (selectedClassification !== 'all' && item.dataClassification !== selectedClassification) return false;
      if (selectedMethod !== 'all' && item.collectionMethod !== selectedMethod) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = item.nameAr.toLowerCase().includes(q);
        const matchEn = item.nameEn.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchOwner = item.ownerMinistry.toLowerCase().includes(q);
        if (!matchAr && !matchEn && !matchCode && !matchOwner) return false;
      }
      return true;
    });
  }, [searchQuery, selectedClassification, selectedMethod]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredCatalogue, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `wams-national-data-catalogue-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WAMS NATIONAL · الخطوة 4
              </span>
              <span className="text-slate-500 text-xs font-mono">كتالوج أصول الرصد الوطنية</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-400" />
              <span>كتالوج وخريطة البيانات الوطنية (National Data Catalogue)</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              حصر شامل ومفصل لكافة شبكات الاستشعار ومصادر الرصد المكانية والحسية التابعة للوزارات السورية، مع توثيق تردد التحديث، دقة القياس، تصنيف السرية، واستراتيجيات الاتصال البديل في حالات الطوارئ.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تصدير الكتالوج JSON</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">إجمالي شبكات الرصد الوطنية</div>
            <div className="text-xl font-bold text-white mt-1">{nationalDataCatalogue.length} شبكات رئيسية</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">حالة الربط اللحظي</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% نشطة وموثقة</span>
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">استراتيجيات البدائل (Failover)</div>
            <div className="text-xl font-bold text-amber-400 mt-1">VSAT / TETRA / Iridium</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <div className="text-slate-400">أعلى تردد زمني للرصد</div>
            <div className="text-xl font-bold text-sky-400 mt-1 font-mono">100 Hz (الزلازل)</div>
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
            placeholder="بحث بالشبكة، المالك أو الرمز..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
          {/* Classification Filter */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
            >
              <option value="all">كافة تصنيفات السرية</option>
              <option value="public">عام (Public)</option>
              <option value="restricted">مقيد (Restricted)</option>
              <option value="sensitive">حساس (Sensitive)</option>
              <option value="top_secret">سري للغاية (Top Secret)</option>
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
            >
              <option value="all">كافة وسائل الجمع والاستشعار</option>
              {Object.entries(collectionMethodLabels).map(([key, label]) => (
                <option key={key} value={key}>{label.labelAr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Split View: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredCatalogue.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>لم يتم العثور على شبكات رصد تطابق معايير الفلترة.</p>
            </div>
          ) : (
            filteredCatalogue.map(item => {
              const method = collectionMethodLabels[item.collectionMethod] || collectionMethodLabels.telemetry;
              const MethodIcon = method.icon;
              const classification = classificationStyles[item.dataClassification];
              const isSelected = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-400/80 shadow-md shadow-emerald-950/20'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 shrink-0">
                        <MethodIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {item.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${classification.colorClass}`}>
                            {classification.labelAr}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">{item.nameAr}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.nameEn}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{item.ownerMinistry}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-mono shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{item.updateFrequency}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Asset Inspector */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 sticky top-20">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {activeItem.code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${classificationStyles[activeItem.dataClassification].colorClass}`}>
                      {classificationStyles[activeItem.dataClassification].labelAr}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{activeItem.nameAr}</h2>
                  <p className="text-sm font-mono text-slate-400">{activeItem.nameEn}</p>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[11px] text-slate-500 block">حالة الأصل الوطني</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60 block mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>نشط بالكامل</span>
                  </span>
                </div>
              </div>

              {/* Ownership & Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>الجهة الحكومية المالكة والمشغلة</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {activeItem.ownerMinistry}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                    <span>وسيلة الجمع والاستشعار</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {collectionMethodLabels[activeItem.collectionMethod]?.labelAr || activeItem.collectionMethod}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>تردد ومعدل التحديث الزمني</span>
                  </div>
                  <div className="text-white font-semibold text-sm font-mono">
                    {activeItem.updateFrequency}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/70">
                  <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    <span>دقة القياس والحساسية المكانية</span>
                  </div>
                  <div className="text-white font-semibold text-sm font-mono">
                    {activeItem.accuracy}
                  </div>
                </div>
              </div>

              {/* Failover & Resilience Section */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span>استراتيجية الاستمرارية والاتصال البديل (Failover Link)</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeItem.fallbackStrategy}
                </p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    الخط الأساسي: IP Fibers / 4G VPN
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    الخط الاحتياطي: Satellite / TETRA
                  </span>
                </div>
              </div>

              {/* Data Flow & Integration Pipeline */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 block font-medium">مسار تكامل البيانات مع محرك WAMS الوطني:</span>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>1. المصدر: <span className="text-emerald-400">{activeItem.ownerMinistry}</span> ({activeItem.collectionMethod})</div>
                  <div>2. معيار النقل: <span className="text-amber-400">OGC / MQTT / REST API (EPSG:4326)</span></div>
                  <div>3. التخزين الجغرافي: <span className="text-sky-400">PostGIS 3.4 Spatial Tables & GIST Index</span></div>
                  <div>4. التوزيع: <span className="text-rose-400">WAMS National Integration Hub & OASIS CAP v1.2</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
              <Database className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p>اختر أحد أصول الرصد من القائمة لعرض مواصفاته التقنية.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
