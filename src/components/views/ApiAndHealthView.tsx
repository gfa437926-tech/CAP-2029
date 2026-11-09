import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  Radio,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ApiAndIntegrationsView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/alerts/active');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/alerts/active',
      descAr: 'استرجاع جميع التحذيرات الجوية المنشورة والنشطة حالياً لتطبيق الطقس',
      auth: 'عام (Public)',
      sampleQuery: ''
    },
    {
      method: 'GET',
      path: '/api/v1/alerts/nearby',
      descAr: 'استعلام مكاني (Spatial Query) لتحديد التحذيرات المتقاطعة مع إحداثيات المستخدم',
      auth: 'عام (Public)',
      sampleQuery: '?lat=21.5422&lon=39.1728'
    },
    {
      method: 'GET',
      path: '/api/v1/alerts/{id}/geometry',
      descAr: 'استرجاع مضلعات الـ GeoJSON الدقيقة للتحذير لرسمها على خرائط الهواتف',
      auth: 'عام (Public)',
      sampleQuery: 'id=alt-2026-881'
    },
    {
      method: 'GET',
      path: '/api/v1/regions',
      descAr: 'استرجاع قائمة المناطق الإدارية والمحافظات',
      auth: 'عام (Public)',
      sampleQuery: ''
    },
    {
      method: 'GET',
      path: '/api/v1/health',
      descAr: 'فحص جاهزية الخادم وقاعدة البيانات المكانية',
      auth: 'عام (Public)',
      sampleQuery: ''
    }
  ];

  const handleTestCall = (path: string) => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (path.includes('nearby')) {
        setResponseOutput(JSON.stringify({
          status: 'success',
          code: 200,
          meta: {
            query: { lat: 21.5422, lon: 39.1728 },
            intersectedAlerts: 1,
            cached: true,
            etag: 'W/"wams-sa-881-v2"'
          },
          data: [
            {
              id: 'alt-2026-881',
              code: 'WAMS-SA-2026-0881',
              headline: 'أمطار رعدية شديدة الغزارة مع خطر تشكل السيول المفاجئة',
              severity: 'extreme',
              urgency: 'immediate',
              certainty: 'observed',
              instructions: 'الابتعاد عن مجاري الأودية ومستنقعات المياه.',
              effectiveAt: '2026-11-08T13:00:00Z',
              expiresAt: '2026-11-09T04:00:00Z'
            }
          ]
        }, null, 2));
      } else {
        setResponseOutput(JSON.stringify({
          status: 'success',
          code: 200,
          count: 2,
          timestamp: new Date().toISOString(),
          data: [
            {
              id: 'alt-2026-881',
              code: 'WAMS-SA-2026-0881',
              headline: 'أمطار رعدية شديدة الغزارة مع خطر تشكل السيول المفاجئة',
              severity: 'extreme',
              status: 'published'
            },
            {
              id: 'alt-2026-882',
              code: 'WAMS-SA-2026-0882',
              headline: 'عاصفة غبارية جدارية تؤدي لانعدام الرؤية الأفقية',
              severity: 'severe',
              status: 'published'
            }
          ]
        }, null, 2));
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            واجهات برمجة تطبيق الطقس (Weather App REST API & OpenAPI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            توثيق كامل للـ API الموجهة لمستخدمي تطبيق الطقس وخرائطه، مع دعم الاستعلام المكاني والتخزين المؤقت
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono">
            OpenAPI v3.0.3 / REST
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoints Directory */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            نقاط النهاية العامة (Public Endpoints)
          </h3>

          <div className="space-y-2">
            {endpoints.map(ep => {
              const isSelected = selectedEndpoint === ep.path;
              return (
                <div
                  key={ep.path}
                  onClick={() => { setSelectedEndpoint(ep.path); handleTestCall(ep.path); }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-slate-950 border-amber-500/80 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      {ep.method}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{ep.auth}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-200 block truncate" dir="ltr">{ep.path}</span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ep.descAr}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
            <span className="block text-slate-400 font-semibold">ضمانات خصوصية البيانات:</span>
            <span className="block">· المسودات والملاحظات الداخلية محجوبة كلياً عن الـ API</span>
            <span className="block">· سجلات التدقيق والمستخدمين تتطلب جلسة إدارية مصرحة</span>
          </div>
        </div>

        {/* Right Column: Live Console & Response Inspector */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white font-mono" dir="ltr">GET {selectedEndpoint}</span>
              </div>

              <button
                onClick={() => handleTestCall(selectedEndpoint)}
                disabled={isRunning}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? 'جارٍ الإرسال...' : 'تنفيذ طلب تجريبي'}</span>
              </button>
            </div>

            {/* Response Viewer */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <span>الاستجابة الفعلية من الخادم (Response Payload):</span>
                <span className="text-emerald-400 font-mono text-[11px]">HTTP 200 OK · 42ms</span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80 leading-relaxed" dir="ltr">
                {responseOutput || '// انقر على "تنفيذ طلب تجريبي" لاختبار الاستجابة'}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>رؤوس التخزين: <code className="text-sky-300 font-mono">ETag, Cache-Control: max-age=60</code></span>
            <span>معدل الطلبات: <code className="text-slate-400 font-mono">1,000 req/min</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SystemHealthView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            صفحة حالة النظام والخدمات (System Health & Diagnostics)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مراقبة سلامة قاعدة البيانات، محرك PostGIS، طابور الإشعارات، وزمن الاستجابة الحقيقي
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>الحالة العامة: <strong className="text-emerald-400">جميع الخدمات تعمل بكفاءة</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>قاعدة البيانات المكانية</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">PostgreSQL 16 + PostGIS</div>
          <div className="text-xs text-emerald-400 font-medium">متصلة · زمن الاستعلام 2.1ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>واجهة برمجة تطبيق الطقس</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">REST API Engine</div>
          <div className="text-xs text-emerald-400 font-medium">99.98% توافرية · 48ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>طابور الإشعارات</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">Transactional Outbox</div>
          <div className="text-xs text-emerald-400 font-medium">3 وظائف قيد المعالجة · 0 خطأ</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>محرك استيراد CAP 1.2</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">XML Schema Parser</div>
          <div className="text-xs text-emerald-400 font-medium">نشط · تم فحص 1,420 رسالة</div>
        </div>
      </div>
    </div>
  );
};
