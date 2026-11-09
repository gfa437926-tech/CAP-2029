import React, { useState } from 'react';
import { AlertItem, AlertSeverity, AlertCertainty, AlertUrgency, PhenomenonType, GeoArea } from '../../types/wams';
import { GISMapCanvas } from '../GISMapCanvas';
import { WeatherMobilePreview } from '../WeatherMobilePreview';
import { 
  Save, 
  Send, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface CreateEditAlertViewProps {
  initialAlert?: AlertItem | null;
  onSaveDraft: (alert: AlertItem) => void;
  onSubmitForReview: (alert: AlertItem) => void;
  onCancel: () => void;
}

export const CreateEditAlertView: React.FC<CreateEditAlertViewProps> = ({
  initialAlert,
  onSaveDraft,
  onSubmitForReview,
  onCancel
}) => {
  const [headlineAr, setHeadlineAr] = useState<string>(initialAlert?.headlineAr || 'أمطار رعدية غزيرة مصحوبة برياح نشطة وزخات من البرد');
  const [headlineEn, setHeadlineEn] = useState<string>(initialAlert?.headlineEn || 'Heavy Thunderstorms with Active Downbursts and Hail');
  const [shortHeadlineAr, setShortHeadlineAr] = useState<string>(initialAlert?.shortHeadlineAr || 'أمطار رعدية غزيرة وسيول');
  const [descriptionAr, setDescriptionAr] = useState<string>(initialAlert?.descriptionAr || 'تتأثر المنطقة بنشاط رعدي ممطر مصحوب بتدفق للسيول في الشعاب والأودية ورياح هابطة نشطة السرعة.');
  const [safetyInstructionsAr, setSafetyInstructionsAr] = useState<string>(initialAlert?.safetyInstructionsAr || 'الابتعاد عن مجاري السيول وتجمعات المياه واتباع تعليمات السلامة الصادرة من الدفاع المدني.');
  
  const [phenomenon, setPhenomenon] = useState<PhenomenonType>(initialAlert?.phenomenon || 'heavy_rain');
  const [severity, setSeverity] = useState<AlertSeverity>(initialAlert?.severity || 'severe');
  const [urgency, setUrgency] = useState<AlertUrgency>(initialAlert?.urgency || 'expected');
  const [certainty, setCertainty] = useState<AlertCertainty>(initialAlert?.certainty || 'likely');
  
  const [issuerOrg, setIssuerOrg] = useState<string>(initialAlert?.issuerOrg || 'المركز الوطني للأرصاد');
  const [effectiveHours, setEffectiveHours] = useState<number>(1);
  const [durationHours, setDurationHours] = useState<number>(12);
  const [internalNotes, setInternalNotes] = useState<string>(initialAlert?.internalNotes || 'مخرجات النموذج العددي عالي الدقة (WRF-3km) تشير لتطور السحب الحملية.');

  const [areas, setAreas] = useState<GeoArea[]>(initialAlert?.areas || [
    {
      id: 'area-new-01',
      nameAr: 'المنطقة الوسطى والدرعية والخرج',
      nameEn: 'Central Region, Diriyah, and Kharj',
      type: 'polygon',
      coordinates: [
        { lat: 25.0, lng: 46.2 },
        { lat: 25.1, lng: 47.1 },
        { lat: 24.3, lng: 47.3 },
        { lat: 24.1, lng: 46.0 }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'editor' | 'gis' | 'preview'>('editor');
  const [validationError, setValidationError] = useState<string | null>(null);

  const buildCurrentAlertObject = (): AlertItem => {
    const now = new Date();
    const effectiveDate = new Date(now.getTime() + effectiveHours * 3600 * 1000);
    const expireDate = new Date(effectiveDate.getTime() + durationHours * 3600 * 1000);

    return {
      id: initialAlert?.id || `alt-${Date.now()}`,
      code: initialAlert?.code || `WAMS-SA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      headlineAr,
      headlineEn,
      shortHeadlineAr,
      descriptionAr,
      descriptionEn: headlineEn,
      safetyInstructionsAr,
      phenomenon,
      severity,
      urgency,
      certainty,
      status: initialAlert?.status || 'draft',
      issuerOrg,
      createdBy: initialAlert?.createdBy || 'م. سارة القحطاني',
      issuedAt: now.toISOString(),
      effectiveAt: effectiveDate.toISOString(),
      onsetAt: effectiveDate.toISOString(),
      expiresAt: expireDate.toISOString(),
      areas,
      currentVersion: initialAlert?.currentVersion || 1,
      versionHistory: initialAlert?.versionHistory || [],
      sourceType: 'manual',
      internalNotes,
      tags: [phenomenon, severity]
    };
  };

  const handleValidateAndSubmit = (forReview = false) => {
    if (!headlineAr.trim()) {
      setValidationError('عنوان التحذير بالعربية مطلوب.');
      return;
    }
    if (!shortHeadlineAr.trim()) {
      setValidationError('العنوان المختصر مطلوب لظهوره في بطاقات تطبيق الطقس.');
      return;
    }
    if (!safetyInstructionsAr.trim()) {
      setValidationError('تعليمات السلامة للمواطنين إلزامية لجميع التحذيرات الجوية.');
      return;
    }
    if (areas.length === 0) {
      setValidationError('يجب تحديد منطقة جغرافية متأثرة واحدة على الأقل على الخريطة.');
      return;
    }

    setValidationError(null);
    const alertObj = buildCurrentAlertObject();
    if (forReview) {
      alertObj.status = 'pending_review';
      onSubmitForReview(alertObj);
    } else {
      onSaveDraft(alertObj);
    }
  };

  const previewAlert = buildCurrentAlertObject();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialAlert ? 'تعديل مسودة التحذير الجوي' : 'إنشاء وتصميم تحذير جوي جديد'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            صياغة بيانات التحذير، تحديد درجات الخطورة والاستعجال، رسم المضلعات، ومعاينة النشر
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'editor' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            محرر البيانات الأساسية
          </button>
          <button
            onClick={() => setActiveTab('gis')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'gis' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            تحديد المضلع الجغرافي ({areas.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'preview' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            معاينة تطبيق الطقس الحي
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Editor Tab Content */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>محتوى التحذير وتعليمات السلامة</span>
            </h3>

            {/* Arabic Headline */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                عنوان التحذير الكامل (العربية): <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={headlineAr}
                onChange={(e) => setHeadlineAr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* Short Headline */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                العنوان المختصر لبطاقات تطبيق الطقس والإشعارات الفورية: <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={shortHeadlineAr}
                onChange={(e) => setShortHeadlineAr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* English Headline */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                Headline in English:
              </label>
              <input
                type="text"
                value={headlineEn}
                onChange={(e) => setHeadlineEn(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                الوصف التفصيلي للحالة الجوية ومحطات الرصد:
              </label>
              <textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Safety Instructions */}
            <div>
              <label className="text-xs text-amber-400 font-semibold block mb-1">
                تعليمات وإرشادات السلامة للمواطنين والمقيمين: <span className="text-red-400">*</span>
              </label>
              <textarea
                value={safetyInstructionsAr}
                onChange={(e) => setSafetyInstructionsAr(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">
                ملاحظات داخلية للمدقق والمعتمد (لا تظهر لمستخدم تطبيق الطقس):
              </label>
              <input
                type="text"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          {/* Meteorological Metadata & Severity Settings */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
                <span>تصنيف الظاهرة والخطورة</span>
              </h3>

              {/* Phenomenon Picker */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">نوع الظاهرة الجوية:</label>
                <select
                  value={phenomenon}
                  onChange={(e) => setPhenomenon(e.target.value as PhenomenonType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="heavy_rain">أمطار غزيرة (Heavy Rain)</option>
                  <option value="flash_flood">سيول وفيضانات (Flash Flood)</option>
                  <option value="thunderstorm">عواصف رعدية (Thunderstorm)</option>
                  <option value="dust_storm">عواصف ترابية ورملية (Dust Storm)</option>
                  <option value="dense_fog">ضباب كثيف (Dense Fog)</option>
                  <option value="gale_winds">رياح شديدة (Gale Winds)</option>
                  <option value="snowfall">ثلوج (Snowfall)</option>
                  <option value="frost_ice">صقيع وجليد (Frost & Ice)</option>
                  <option value="marine_surge">اضطرابات بحرية وأمواج عالية (Marine Surge)</option>
                  <option value="heatwave">موجة حر (Heatwave)</option>
                  <option value="coldwave">موجة برد (Coldwave)</option>
                  <option value="other">ظواهر أخرى (Other)</option>
                </select>
              </div>

              {/* Severity Level */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">مستوى الخطورة (Severity):</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'extreme', name: 'أحمر - استثنائي (Extreme)', bg: 'bg-red-500/20 text-red-300 border-red-500/50' },
                    { id: 'severe', name: 'برتقالي - شديد (Severe)', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/50' },
                    { id: 'moderate', name: 'أصفر - متوسط (Moderate)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
                    { id: 'minor', name: 'أخضر - طفيف (Minor)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
                    { id: 'informational', name: 'أزرق - إرشادي (Informational)', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id as AlertSeverity)}
                      className={`w-full text-right p-2 rounded-lg text-xs font-semibold border transition-all ${severity === s.id ? `${s.bg} ring-2 ring-white/20` : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency & Certainty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">درجة الاستعجال:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as AlertUrgency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="immediate">عاجل (Immediate)</option>
                    <option value="expected">متوقع (Expected)</option>
                    <option value="future">مستقبلي (Future)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">درجة اليقين:</label>
                  <select
                    value={certainty}
                    onChange={(e) => setCertainty(e.target.value as AlertCertainty)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="observed">مرصود (Observed)</option>
                    <option value="likely">محتمل جداً (Likely)</option>
                    <option value="possible">ممكن (Possible)</option>
                  </select>
                </div>
              </div>

              {/* Validity Timing */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">فترة التأثير والصلاحية:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">البدء بعد:</span>
                    <span className="font-bold text-white tabular-nums">{effectiveHours} ساعة</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">مدة التأثير:</span>
                    <span className="font-bold text-white tabular-nums">{durationHours} ساعة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-2">
              <button
                type="button"
                onClick={() => handleValidateAndSubmit(true)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>إرسال التحذير للمراجعة والتدقيق</span>
              </button>

              <button
                type="button"
                onClick={() => handleValidateAndSubmit(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <Save className="w-4 h-4 text-slate-400" />
                <span>حفظ كمسودة (Draft)</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              >
                إلغاء والعودة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GIS Polygon Assignment Tab */}
      {activeTab === 'gis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">تحديد المناطق الجغرافية المتأثرة للتحذير</h3>
              <span className="text-xs text-slate-400">انقر على الخريطة لرسم مضلع أو اختيار محافظة جاهزة</span>
            </div>
            <button
              onClick={() => setActiveTab('editor')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 font-medium"
            >
              العودة للمحرر
            </button>
          </div>

          <div className="h-[520px] rounded-lg overflow-hidden border border-slate-800">
            <GISMapCanvas
              alerts={[previewAlert]}
              selectedAlertId={previewAlert.id}
              isEditable={true}
              onPolygonCreated={(newArea) => setAreas(prev => [...prev, newArea])}
            />
          </div>
        </div>
      )}

      {/* Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">معاينة قبل النشر كما سيظهر في تطبيق الطقس</h3>
              <span className="text-xs text-slate-400">يضمن هذا الفحص سلامة النصوص وألوان الخطورة قبل الاعتماد</span>
            </div>
            <button
              onClick={() => setActiveTab('editor')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 font-medium"
            >
              العودة للتعديل
            </button>
          </div>
          <WeatherMobilePreview alerts={[previewAlert]} />
        </div>
      )}
    </div>
  );
};
