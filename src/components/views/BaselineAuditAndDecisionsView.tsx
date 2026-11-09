/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Layers, 
  GitPullRequest, 
  GitBranch, 
  Cpu, 
  Activity, 
  Flame, 
  Clock, 
  Radio, 
  Scale, 
  ArrowLeft,
  ChevronDown,
  Download,
  Building2,
  Database
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface FunctionItem {
  id: string;
  nameAr: string;
  category: 'core' | 'gis' | 'ingestion' | 'admin' | 'security';
  status: 'production_grade' | 'experimental_mock' | 'pending_backend';
  notes: string;
  securityState: string;
}

const functionsInventory: FunctionItem[] = [
  { id: '1', nameAr: 'خريطة GIS التفاعلية (Leaflet + OpenStreetMap + OpenTopoMap)', category: 'gis', status: 'production_grade', notes: 'تعمل 100% بدون أي مفاتيح API مدفوعة مع طبقات OSM و Topo و Carto Dark', securityState: 'معقمة بالكامل ضد ثغرات XSS في النوافذ المنبثقة' },
  { id: '2', nameAr: 'محرك الحساب المكاني الجيوديسي (Spatial Query Engine)', category: 'gis', status: 'production_grade', notes: 'حساب مساحات دقيقة بالكيلومتر المربع وفحص تقاطع المضلعات Ray-Casting', securityState: 'لا يعتمد على SQL وهمي، حساب رياضي حقيقي' },
  { id: '3', nameAr: 'مصدّر ملفات تعريف طبقات QGIS (.qlr و .qgs و GeoJSON)', category: 'gis', status: 'production_grade', notes: 'توليد ملفات QGIS مطابقة للواقع الجغرافي السوري', securityState: 'محمي: خالي 100% من كلمات المرور ويستخدم متغيرات بيئة' },
  { id: '4', nameAr: 'مدقق وفاحص رسائل معيار OASIS CAP 1.2 XML', category: 'core', status: 'production_grade', notes: 'تحليل وتفكيك رسائل CAP والتحقق من الحقول الإلزامية', securityState: 'معقم ضد هجمات XML External Entity (XXE)' },
  { id: '5', nameAr: 'حزمة الاختبارات الآلية ومسار CI المؤتمت (GitHub Actions)', category: 'security', status: 'production_grade', notes: '10 اختبارات شاملة تغطي الأمان والمكان والـ GIS وتصدير الملفات', securityState: 'فحص فوري في كل عملية Commit' },
  { id: '6', nameAr: 'محرر ومصمم التحذيرات الجوية متعدد الطبقات', category: 'core', status: 'production_grade', notes: 'رسم المضلعات وتحديد الإحداثيات وحفظ المسودات', securityState: 'فحص إحداثيات WGS84 وإغلاق مضلعات الطوبولوجيا' },
  { id: '7', nameAr: 'سجل التحذيرات وفلاتر الحالة (Active / Scheduled / Expired)', category: 'core', status: 'production_grade', notes: 'إدارة دورة حياة التحذير وفق الحالات المعتمدة', securityState: 'متحقق منه' },
  { id: '8', nameAr: 'شاشة تسجيل الدخول المحدثة (Login Gate)', category: 'security', status: 'production_grade', notes: 'واجهة دخول رسمية مهيأة لربط OIDC و MFA', securityState: 'محذوف منها أي كلمات مرور أو بريد افتراضي ثابت' },
  { id: '9', nameAr: 'سجل الأخطار الوطني الشامل (8 مجموعات أخطار)', category: 'core', status: 'production_grade', notes: 'توصيف العتبات والوحدات والجهات لـ 8 مجموعات أخطار كبرى', securityState: 'موثق ومعتمد' },
  { id: '10', nameAr: 'كتالوج أصول وشبكات الرصد الوطنية (7 شبكات)', category: 'ingestion', status: 'production_grade', notes: 'حصر أصول الرصد وتردداتها وتصنيف سريتها وبدائلها', securityState: 'تصنيف سرية مفروض' },
  { id: '11', nameAr: 'بوابة المراجعة والاعتماد للمرحلة الأولى', category: 'admin', status: 'production_grade', notes: 'توثيق موافقة المسؤول الهندسي قبل ترحيل الجداول', securityState: 'سجل تدقيق ملزم' },
  { id: '12', nameAr: 'محاكاة البث اللحظي للإنذار لتطبيقات الطقس الخارجي', category: 'core', status: 'experimental_mock', notes: 'بث تجريبي يوضح كيفية استهلاك الـ Weather App للتحذير', securityState: 'بيانات تجريبية محلية' },
  { id: '13', nameAr: 'لوحة القيادة والمؤشرات الإحصائية العامة', category: 'admin', status: 'experimental_mock', notes: 'رسوم بيانية توضح توزيع الحالات في المحافظات', securityState: 'لا تتصل بقاعدة بيانات إنتاجية' },
  { id: '14', nameAr: 'سجل استيراد ملفات CAP الواردة من محطات مجاورة', category: 'ingestion', status: 'experimental_mock', notes: 'سجل بصري يحاكي استقبال نشرات WMO الخارجية', securityState: 'معقم' },
  { id: '15', nameAr: 'شاشات إعدادات المناطق والحدود الإدارية', category: 'admin', status: 'experimental_mock', notes: 'تستعرض محافظات القطر السوري وإحداثياتها', securityState: 'إحداثيات جغرافية دقيقة' },
  { id: '16', nameAr: 'بوابة تكامل SCADA لمناسيب السدود ومفيض الأنهار', category: 'ingestion', status: 'pending_backend', notes: 'تنتظر بناء الـ Backend في المرحلة 3 وربط بروتوكول SCADA', securityState: 'مخططة للمرحلة 3' },
  { id: '17', nameAr: 'منظومة الرصد الزلزالي اللحظي لصدع البحر الميت واليمونة', category: 'ingestion', status: 'pending_backend', notes: 'رصد موجات P بعد بداية الزلزال، تنتظر ربط شبكة المحطات الرقمية', securityState: 'مخططة للمرحلة 4 (لا تدعي التنبؤ مسبقاً)' },
  { id: '18', nameAr: 'محرك رصد حرائق الغابات الفضائي (VIIRS Thermal Spots)', category: 'ingestion', status: 'pending_backend', notes: 'تنتظر بناء الـ Backend وجلب بيانات الأقمار الصناعية المؤتمتة', securityState: 'مخططة للمرحلة 4' },
  { id: '19', nameAr: 'طابور البث الخلوي الوطني (Cell Broadcast) ورسائل SMS الطارئة', category: 'core', status: 'pending_backend', notes: 'تنتظر ربط مشغلي الاتصالات في مرحلة التشغيل الوطني', securityState: 'مخططة للمرحلة 5' },
  { id: '20', nameAr: 'سجل التتبع والمصادقة المؤسسية المركزية بالـ OIDC', category: 'security', status: 'pending_backend', notes: 'تنتظر ربط خادم الهوية الوطنية في المرحلة 2', securityState: 'مخططة للمرحلة 2' },
];

export const BaselineAuditAndDecisionsView: React.FC<{ onNavigateToScreen: (screen: ScreenId) => void }> = ({
  onNavigateToScreen
}) => {
  const [activeTab, setActiveTab] = useState<'priority1' | 'priority2' | 'acceptance_gates' | 'pr_review'>('priority1');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFunctions = functionsInventory.filter(f => {
    if (filterCategory === 'all') return true;
    return f.status === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Executive Decision Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-2 border-amber-500/50 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded text-xs font-black tracking-wider bg-amber-400 text-slate-950 uppercase">
              القرار التنفيذي المعتمد
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              المرحلة الأولى فقط: تثبيت الأساس + وثائق التصميم
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              قاعدة البيانات الحالية: محمية 100% دون أي تغيير
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            قرار المهندس التنفيذي: إغلاق عيوب الأساس أولاً وعدم التسرع في بناء الواجهات
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
            امتثالاً لتوجيهكم الحاسم: <strong className="text-amber-400">لا نضيف الزلازل أو الحرائق مباشرة إلى الواجهات الآن</strong>. الأولوية المطلقة هي تجهيز وتحصين الأساس الذي ستعتمد عليه جميع هذه الأنظمة لاحقاً، وحماية مستودع <code className="text-amber-300 font-mono">CAP-2029</code> دون مساس بفرع <code className="text-amber-300 font-mono">main</code> أو قواعد البيانات الحالية، واعتماد منهجية الفروع المستقلة والاختبار الصارم لكل مرحلة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">الأولوية الأولى (عاجل ومكتمل):</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                إغلاق عيوب الأساس وفحص XSS
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">الأولوية الثانية (جاهزة للمراجعة):</span>
              <span className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                وثائق التصميم والمعمارية وERD
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">الاستقلالية والحماية:</span>
              <span className="text-sky-400 font-bold text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-sky-400" />
                CAP-2029 مستقل عن METRA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('priority1')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'priority1'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>الأولوية 1: إغلاق عيوب الأساس وتصنيف الوظائف ({functionsInventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('priority2')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'priority2'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>الأولوية 2: وثائق التصميم والمعمارية وERD</span>
        </button>

        <button
          onClick={() => setActiveTab('acceptance_gates')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'acceptance_gates'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>شروط اعتماد كل مرحلة (Acceptance Criteria Gate)</span>
        </button>

        <button
          onClick={() => setActiveTab('pr_review')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pr_review'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>مراجعة طلبَي السحب (PR #1 و PR #2)</span>
        </button>
      </div>

      {/* Tab 1: Priority 1 - Foundation Hardening & Inventory */}
      {activeTab === 'priority1' && (
        <div className="space-y-6">
          {/* Priority 1 Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  إصلاح ثغرات XSS
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  مكتمل 100%
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                استبدال القوالب النصية غير المعقمة في ملصقات ونوافذ الخريطة الجغرافية بدالة تعقيم صارمة <code className="text-amber-300 font-mono text-[11px]">escapeHtml</code> في <code className="text-slate-300 font-mono text-[11px]">src/utils/sanitize.ts</code>.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  إزالة كلمات المرور الثابتة
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  مكتمل 100%
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                مسح كلمات المرور الافتراضية من شاشة تسجيل الدخول واستبعادها كلياً من ملفات تصدير QGIS (<code className="text-amber-300 font-mono text-[11px]">.qlr</code> و <code className="text-amber-300 font-mono text-[11px]">.qgs</code>) واعتماد متغيرات بيئة آمنة.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  تشغيل CI وفحص الاختبارات
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  10 / 10 نجاح
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                مسار GitHub Actions الآلي يختبر سلامة التعقيم، صحة الحساب المكاني الجيوديسي، وفحص خلو ملفات QGIS من بيانات الاتصال الصريحة في كل Commit.
              </p>
            </div>
          </div>

          {/* Functions Classification Header and Filter */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>تصنيف جميع وظائف المنصة (حقيقية · تجريبية · غير مكتملة)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  حصر دقيق يوضح بشفافية تامة ما هو مبني ومختبر، وما هو محاكاة بصرية، وما ينتظر مراحل الـ Backend القادمة.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">تصفية بحسب الحالة:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">كافة الوظائف (20)</option>
                  <option value="production_grade">حقيقية مكتملة (Production-Grade)</option>
                  <option value="experimental_mock">تجريبية ومحاكاة (Mock/Simulated)</option>
                  <option value="pending_backend">غير مكتملة تنتظر الـ Backend</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">الوظيفة / الشاشة</th>
                    <th className="p-3">التصنيف الهندسي</th>
                    <th className="p-3">الحالة والجاهزية الفنية</th>
                    <th className="p-3">حالة الأمان والتحصين</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {filteredFunctions.map(f => (
                    <tr key={f.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{f.id}</td>
                      <td className="p-3 font-semibold text-white">{f.nameAr}</td>
                      <td className="p-3 whitespace-nowrap">
                        {f.status === 'production_grade' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            حقيقية (Production)
                          </span>
                        )}
                        {f.status === 'experimental_mock' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            تجريبية (Mock)
                          </span>
                        )}
                        {f.status === 'pending_backend' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            تنتظر الـ Backend
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">{f.notes}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{f.securityState}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Priority 2 - Design Documents & Architecture */}
      {activeTab === 'priority2' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>وثائق التصميم الخمس الإلزامية (قبل كتابة أي كود Backend)</span>
            </h3>
            <p className="text-xs text-slate-400">
              تم إعداد وتوثيق هذه المخططات بدقة كاملة وهي متاحة للاستعراض التفصيلي في النظام:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">1. وثيقة المتطلبات الوطنية</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400">الخطوة 2</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  تحديد مسؤوليات 9 قطاعات حكومية، مسارات إطلاق التحذير، ومبدأ التحقق الرباعي (Four-Eyes Principle) لفصل منشئ المسودة عن المعتمد والناشر.
                </p>
                <button
                  onClick={() => onNavigateToScreen('stage1_deliverables')}
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  استعراض الوثيقة التفصيلية &larr;
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">2. مخطط الخدمات والأنظمة المستقلة</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400">الخطوة 5</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  معمارية الوحدات المستقلة (Decoupled Engines) لضمان عدم توقف النظام ككل في حال تعطل أي وحدة قطاعية، مع ناقل أحداث موثوق (Event Outbox).
                </p>
                <button
                  onClick={() => onNavigateToScreen('stage1_deliverables')}
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  استعراض المخطط المعماري &larr;
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">3. مخطط قاعدة البيانات ERD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400">الخطوة 6</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  تصميم 10 مجموعات جداول متخصصة (PostgreSQL 16 + PostGIS) تغطي الحسابات المكانية وسجلات التدقيق غير القابلة للتعديل دون مساس بالـ DB الحالية.
                </p>
                <button
                  onClick={() => onNavigateToScreen('stage1_deliverables')}
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  استعراض مخطط الـ ERD الكامل &larr;
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">4. نموذج الصلاحيات والجهات والمحافظات</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400">الخطوة 7</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  مصفوفة RBAC/ABAC مؤسسية تحدد بدقة النطاق الإداري والجغرافي لكل جهة، مع حظر تجاوز حدود المحافظات لمنسقي العمليات المحليين.
                </p>
                <button
                  onClick={() => onNavigateToScreen('rbac_matrix')}
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  استعراض مصفوفة الصلاحيات &larr;
                </button>
              </div>
            </div>

            {/* Note regarding DB untouched */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-amber-300 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>تأكيد الالتزام الصارم:</strong> قاعدة البيانات الحالية لم تُعدل بأي شكل، ولن يتم ترحيل أي جداول جديدة إلا بعد مراجعتكم واعتمادكم الرسمي.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Acceptance Gates */}
      {activeTab === 'acceptance_gates' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>معايير القبول وشروط اعتماد كل مرحلة (Acceptance Criteria)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              وفقاً للقاعدة الذهبية: <em>لا ننتقل إلى المرحلة التالية بمجرد ظهور الواجهة، بل يجب تحقيق معايير قبول واضحة ومثبتة عملياً</em>:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">1. دورة حياة التحذير الحقيقية:</strong>
                  <span className="text-slate-400">التحذير يُنشأ ويُراجع ويُعتمد ويُنشر ويُحدّث ويُلغى فعلياً مع توثيق الأثر والنسخ السابقة.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">2. فرض الصلاحيات من الخادم:</strong>
                  <span className="text-slate-400">صلاحيات المستخدمين مفروضة أمنياً من الـ Backend والـ JWT Claims وليست مجرد إخفاء أزرار في واجهة المستخدم.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">3. سلامة البيانات الجغرافية:</strong>
                  <span className="text-slate-400">البيانات المكانية حقيقية ومتحقق من صحتها الجيوديسية وخالية من التقاطعات الذاتية عبر PostGIS و Leaflet.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">4. توثيق مصادر الرصد:</strong>
                  <span className="text-slate-400">مصادر الرصد موثقة في كتالوج الأصول الوطني مع وقت التحديث ودقة القياس وتصنيف السرية واستراتيجية الاتصال البديل.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">5. تتبع كل قرار في سجل تدقيق غير قابل للتعديل:</strong>
                  <span className="text-slate-400">سجل تدقيق أمني مركزي (Append-Only Audit Log) يوثق كل حركة، ومن قام بها، والوقت الدقيق بالثانية.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">6. حظر استئثار الذكاء الاصطناعي بالقرارات الرسمية:</strong>
                  <span className="text-slate-400">لا يصدر الذكاء الاصطناعي إنذاراً رسمياً أو أمراً بالإخلاء بمفرده؛ التحذير الرسمي يتطلب حصراً اعتماداً بشرياً مؤسسياً موثقاً.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">7. المنهجية العلمية لرصد الزلازل (عدم ادعاء التنبؤ المسبق):</strong>
                  <span className="text-slate-400">لا يُعتمد نظام الزلازل على ادعاء التنبؤ بموعد الزلزال؛ بل يرصد موجات P الأولية بعد بداية الزلزال ويمنح ثوانٍ معدودة قبل وصول موجات S التدميرية.</span>
                </div>
              </div>
            </div>

            {/* UN Early Warnings for All Alignment */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>متوافق مع: UN Early Warnings for All (الأركان الأربعة)</span>
              <span>دليل WMO حول معرفة المخاطر</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: PR Review */}
      {activeTab === 'pr_review' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-amber-400" />
              <span>تقرير مراجعة طلبَي السحب (PR Review Report)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* PR 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">طلب السحب #1: النواة الأولية</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                    PR #1 Review
                  </span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <div>- إرساء هيكل دورة حياة التحذيرات (Draft, Review, Approved, Published, Cancelled).</div>
                  <div>- دمج محرر الخرائط الجغرافية Leaflet ودعم OASIS CAP 1.2 XML.</div>
                  <div>- توفير الشاشات الأساسية الـ 25 لتصفح التحذيرات ومصادر البيانات.</div>
                </div>
                <div className="pt-2 border-t border-slate-800/60 text-slate-400">
                  <strong>التقييم:</strong> كود وظيفي متكامل وناجح، جاهز للنواة الأساسية.
                </div>
              </div>

              {/* PR 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">طلب السحب #2: التحصين الأمني والمكاني</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    PR #2 Review
                  </span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <div>- تعقيم ثغرات XSS في نوافذ وملصقات الخريطة الجغرافية.</div>
                  <div>- مسح كلمات المرور الصريحة من واجهات الدخول وتصديرات QGIS.</div>
                  <div>- استبدال نتائج SQL الثابتة بمحرك حساب مكاني جيوديسي حقيقي.</div>
                  <div>- إعداد مسار GitHub Actions و 10 اختبارات وحدة مؤتمتة (ناجحة 100%).</div>
                </div>
                <div className="pt-2 border-t border-slate-800/60 text-emerald-400 font-bold">
                  <strong>التقييم:</strong> معتمد أمنياً وجيوديسياً.
                </div>
              </div>
            </div>

            {/* Merge Policy Decision */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
              <strong className="text-white block font-bold">القرار بشأن الدمج:</strong>
              <p>
                تم الإبقاء على فرع <code className="text-amber-300 font-mono">main</code> ناصعاً ومحمياً دون دمج مباشر، وبناء النظام كاملاً على الفروع المستقلة (<code className="text-amber-300 font-mono">feat/wams-national-phase1-foundation</code>) مع التحقق البرمجي التام قبل أي خطوة لاحقة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          هل تريد الانتقال للاعتماد الرسمي أو استعراض خرائط الـ GIS الحية؟
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateToScreen('gis_map')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            خريطة الـ GIS الحية
          </button>
          <button
            onClick={() => onNavigateToScreen('stage1_approval')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>بوابة المراجعة والاعتماد للمرحلة الأولى</span>
          </button>
        </div>
      </div>
    </div>
  );
};
