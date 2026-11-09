import React, { useState } from 'react';
import { AlertItem } from '../types/wams';
import { Bell, ShieldAlert, CloudRain, Wind, AlertTriangle, ChevronDown, CheckCircle, Navigation, Radio, RefreshCw, Smartphone } from 'lucide-react';

interface WeatherMobilePreviewProps {
  alerts: AlertItem[];
}

export const WeatherMobilePreview: React.FC<WeatherMobilePreviewProps> = ({ alerts }) => {
  const [selectedCity, setSelectedCity] = useState<'jeddah' | 'riyadh' | 'abha' | 'dammam'>('jeddah');
  const [activeTab, setActiveTab] = useState<'screen' | 'api' | 'notification'>('screen');
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(true);

  // Coordinates for the simulated user devices
  const cityCoordinates = {
    jeddah: { nameAr: 'جدة - حي الشاطئ', lat: 21.54, lon: 39.17, temp: 29, weatherAr: 'عواصف رعدية عنيفة وأمطار' },
    riyadh: { nameAr: 'الرياض - حي النخيل', lat: 24.71, lon: 46.67, temp: 26, weatherAr: 'عاصفة ترابية شديدة' },
    abha: { nameAr: 'أبها - السودة', lat: 18.21, lon: 42.50, temp: 16, weatherAr: 'ضباب كثيف مع رذاذ' },
    dammam: { nameAr: 'الدمام - كورنيش سيهات', lat: 26.42, lon: 50.08, temp: 24, weatherAr: 'رياح نشطة وأمواج عالية' }
  };

  const currentCityData = cityCoordinates[selectedCity];

  // Filter alerts that intersect with the user's city location
  // Note: Only PUBLISHED alerts are delivered to the Weather App! Drafts & pending are strictly barred!
  const publishedAlerts = alerts.filter(a => a.status === 'published');
  
  // Simulated spatial intersection check
  const activeAlertForCity = publishedAlerts.find(a => {
    if (selectedCity === 'jeddah') return a.id === 'alt-2026-881';
    if (selectedCity === 'riyadh') return a.id === 'alt-2026-882';
    return false;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col xl:flex-row gap-6">
      {/* Left Column: Device Mockup Container */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span className="font-medium text-slate-300">محاكاة هاتف مستخدم تطبيق الطقس</span>
          <span>·</span>
          <span className="text-emerald-400">اتصال API نشط</span>
        </div>

        {/* Mobile Phone Device Frame */}
        <div className="w-[310px] h-[580px] bg-slate-950 border-4 border-slate-700 rounded-[38px] p-2.5 shadow-2xl relative flex flex-col overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900"></div>
          </div>

          {/* Simulated App Screen Header */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-1 font-semibold text-slate-100">
              <Navigation className="w-3 h-3 text-sky-400" />
              <span>{currentCityData.nameAr}</span>
            </div>
            <span className="text-slate-400 tabular-nums">16:35</span>
          </div>

          {/* Push Notification Banner Toast (if available) */}
          {activeAlertForCity && showNotificationToast && (
            <div className="bg-red-950/95 border border-red-500/80 text-white p-2.5 rounded-xl shadow-2xl mb-2 text-xs animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-red-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>تنبيه طوارئ أرصادي عاجل</span>
                </div>
                <span className="text-[10px] text-red-300">الآن</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-red-100">
                {activeAlertForCity.shortHeadlineAr}
              </p>
              <div className="mt-1 flex justify-end">
                <button
                  onClick={() => setShowNotificationToast(false)}
                  className="text-[10px] text-red-300 underline"
                >
                  إغلاق الإشعار
                </button>
              </div>
            </div>
          )}

          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-4 mb-2 text-center relative overflow-hidden">
            <span className="text-xs text-slate-400">{currentCityData.weatherAr}</span>
            <div className="text-4xl font-bold tracking-tight text-white my-1 tabular-nums">
              {currentCityData.temp}°<span className="text-xl font-normal text-slate-400">C</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-2">
              <span>الرطوبة: 78%</span>
              <span>·</span>
              <span>الرياح: 45 كم/س</span>
            </div>
          </div>

          {/* Critical Alert Warning Card (if alert applies to current coordinates) */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {activeAlertForCity ? (
              <div className={`p-3 rounded-xl border ${activeAlertForCity.severity === 'extreme' ? 'bg-red-950/40 border-red-500/50 text-red-100' : 'bg-orange-950/40 border-orange-500/50 text-orange-100'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className={`w-4 h-4 ${activeAlertForCity.severity === 'extreme' ? 'text-red-400' : 'text-orange-400'}`} />
                  <span className="font-bold text-xs">
                    تحذير أرصادي نشط: {activeAlertForCity.shortHeadlineAr}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200 mb-2">
                  {activeAlertForCity.descriptionAr}
                </p>
                
                {/* Safety Instruction Box */}
                <div className="bg-black/40 p-2 rounded-lg text-[10px] border border-white/10 space-y-1">
                  <div className="font-semibold text-amber-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-amber-400" />
                    <span>إرشادات السلامة للمواطنين:</span>
                  </div>
                  <p className="text-slate-300 leading-normal">
                    {activeAlertForCity.safetyInstructionsAr}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>المصدر: {activeAlertForCity.issuerOrg}</span>
                  <span className="tabular-nums">سارٍ حتى 04:00 UTC</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                <span className="font-semibold text-slate-200 block mb-0.5">الأجواء مستقرة في موقعك</span>
                <span>لا توجد تحذيرات جوية صادرة لمنطقتك حالياً</span>
              </div>
            )}
          </div>

          {/* Bottom Bar Simulation */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
        </div>
      </div>

      {/* Right Column: API & GPS Location Inspector */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h4 className="font-bold text-base text-white">معاينة واجهة برمجة تطبيق الطقس (Weather App Integration)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                فحص فوري للاستعلام المكاني بـ GPS وكيف يستقبل تطبيق الطقس التحذيرات المنشورة فقط
              </p>
            </div>
            
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('screen')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'screen' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                محاكاة الموقع
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'api' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                استجابة الـ API الفعلية (JSON)
              </button>
            </div>
          </div>

          {/* Location Picker */}
          <div className="mb-4">
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              اختر موقع المستخدم الافتراضي لاختبار التقاطع الجغرافي المكاني (Spatial Intersects):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => { setSelectedCity('jeddah'); setShowNotificationToast(true); }}
                className={`p-2.5 rounded-lg border text-right transition-colors ${selectedCity === 'jeddah' ? 'bg-red-950/30 border-red-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className="text-xs font-semibold text-slate-200">جدة (منطقة السيول)</div>
                <div className="text-[11px] text-red-400 font-medium">تحذير أحمر نشط</div>
              </button>

              <button
                onClick={() => { setSelectedCity('riyadh'); setShowNotificationToast(true); }}
                className={`p-2.5 rounded-lg border text-right transition-colors ${selectedCity === 'riyadh' ? 'bg-orange-950/30 border-orange-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className="text-xs font-semibold text-slate-200">الرياض (منطقة الغبار)</div>
                <div className="text-[11px] text-orange-400 font-medium">تحذير برتقالي نشط</div>
              </button>

              <button
                onClick={() => { setSelectedCity('abha'); setShowNotificationToast(false); }}
                className={`p-2.5 rounded-lg border text-right transition-colors ${selectedCity === 'abha' ? 'bg-sky-950/30 border-sky-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className="text-xs font-semibold text-slate-200">أبها (الضباب)</div>
                <div className="text-[11px] text-slate-400">تحذير مجدول (ليس نشطاً)</div>
              </button>

              <button
                onClick={() => { setSelectedCity('dammam'); setShowNotificationToast(false); }}
                className={`p-2.5 rounded-lg border text-right transition-colors ${selectedCity === 'dammam' ? 'bg-sky-950/30 border-sky-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className="text-xs font-semibold text-slate-200">الدمام (الخليج العربي)</div>
                <div className="text-[11px] text-slate-400">قيد المراجعة (محجوب)</div>
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'screen' ? (
            <div className="space-y-3 bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-white">الاستعلام الجغرافي المنفذ من تطبيق الهاتف:</span>
                <span className="font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                  GET /api/v1/alerts/nearby?lat={currentCityData.lat}&lon={currentCityData.lon}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg space-y-2 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>أمان البيانات:</strong> المسودات، الملاحظات الداخلية، وهوية المدققين محجوبة بالكامل.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>الاستعلام المكاني:</strong> استخدمت قاعدة البيانات دالة <code className="text-sky-300 font-mono">ST_Intersects(geom, ST_SetSRID(ST_Point(...), 4326))</code>.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>التخزين المؤقت:</strong> تم تزويد الاستجابة بـ <code className="text-amber-300 font-mono">ETag: "wams-881-v2"</code> لتوفير استهلاك باقة الإنترنت على الهاتف.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60">
              <pre className="text-emerald-400">
{JSON.stringify({
  status: 'success',
  timestamp: new Date().toISOString(),
  queryLocation: {
    lat: currentCityData.lat,
    lon: currentCityData.lon,
    resolvedArea: currentCityData.nameAr
  },
  activeAlertsCount: activeAlertForCity ? 1 : 0,
  data: activeAlertForCity ? [
    {
      id: activeAlertForCity.id,
      code: activeAlertForCity.code,
      headline: activeAlertForCity.headlineAr,
      shortHeadline: activeAlertForCity.shortHeadlineAr,
      description: activeAlertForCity.descriptionAr,
      instructions: activeAlertForCity.safetyInstructionsAr,
      severity: activeAlertForCity.severity,
      urgency: activeAlertForCity.urgency,
      certainty: activeAlertForCity.certainty,
      effective: activeAlertForCity.effectiveAt,
      expires: activeAlertForCity.expiresAt,
      source: activeAlertForCity.issuerOrg,
      geometryEndpoint: `/api/v1/alerts/${activeAlertForCity.id}/geometry`
    }
  ] : []
}, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="mt-4 p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-xs text-blue-300 flex items-center justify-between">
          <span>هذا المكون يضمن التحقق العملي من أن موظفي الأرصاد يرون المخرج النهائي لتطبيق الطقس قبل الاعتماد والنشر.</span>
          <button
            onClick={() => setShowNotificationToast(true)}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة إرسال الإشعار التجريبي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
