import React from 'react';
import { AlertItem, DataSourceItem } from '../../types/wams';
import { GISMapCanvas } from '../GISMapCanvas';
import { WeatherMobilePreview } from '../WeatherMobilePreview';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  History, 
  Ban, 
  Database, 
  Activity, 
  Bell, 
  Radio, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp,
  CloudRain,
  Wind
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface DashboardViewProps {
  alerts: AlertItem[];
  sources: DataSourceItem[];
  onNavigate: (screen: ScreenId) => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alerts,
  sources,
  onNavigate,
  onSelectAlert
}) => {
  // Statistics calculations
  const totalCount = alerts.length;
  const activeCount = alerts.filter(a => a.status === 'published').length;
  const pendingCount = alerts.filter(a => a.status === 'pending_review').length;
  const scheduledCount = alerts.filter(a => a.status === 'scheduled').length;
  const expiredCount = alerts.filter(a => a.status === 'expired').length;
  const cancelledCount = alerts.filter(a => a.status === 'cancelled').length;
  const draftCount = alerts.filter(a => a.status === 'draft').length;

  const severityCounts = {
    extreme: alerts.filter(a => a.severity === 'extreme').length,
    severe: alerts.filter(a => a.severity === 'severe').length,
    moderate: alerts.filter(a => a.severity === 'moderate').length,
    minor: alerts.filter(a => a.severity === 'minor').length,
    informational: alerts.filter(a => a.severity === 'informational').length
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'severe': return 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
      case 'moderate': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'minor': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            لوحة العمليات والتحذيرات الجوية المركزية
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة فورية للحالات الجوية النشطة، المراجعات الجارية، وتدفق رسائل CAP إلى تطبيق الطقس
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('create_alert')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء تحذير جديد</span>
          </button>
          <button
            onClick={() => onNavigate('gis_map')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-colors border border-slate-700 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-sky-400" />
            <span>فتح الخريطة الكاملة (GIS)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Clickable to navigate to linked list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('active_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-500/50 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">التحذيرات النشطة</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-400 tabular-nums">
            {activeCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">تبث حالياً لتطبيق الطقس</span>
        </button>

        <button
          onClick={() => onNavigate('review_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">قيد المراجعة</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {pendingCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">تنتظر اعتماد المدقق</span>
        </button>

        <button
          onClick={() => onNavigate('scheduled_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">المجدولة</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 tabular-nums">
            {scheduledCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">تبدأ في موعد محدد</span>
        </button>

        <button
          onClick={() => onNavigate('expired_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">المنتهية</span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300 tabular-nums">
            {expiredCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">أوقفت تلقائياً</span>
        </button>

        <button
          onClick={() => onNavigate('cancelled_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">الملغاة</span>
            <Ban className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300 tabular-nums">
            {cancelledCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">أُلغيت لزوال الحالة</span>
        </button>

        <button
          onClick={() => onNavigate('all_alerts')}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-right transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">إجمالي السجلات</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {totalCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">تشمل المسودات والأرشيف</span>
        </button>
      </div>

      {/* Main Grid: Live GIS Map (Left) & Severity Breakdown / Recent Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live GIS Map */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">الخريطة المباشرة للتحذيرات السارية (Live Warnings Map)</h3>
              <span className="text-xs text-slate-400">تحديث فوري للمناطق الجغرافية المتأثرة وخلايا الرادار</span>
            </div>
            <button
              onClick={() => onNavigate('gis_map')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <span>تكبير الخريطة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[420px] rounded-lg overflow-hidden border border-slate-800">
            <GISMapCanvas
              alerts={alerts}
              onSelectAlert={onSelectAlert}
            />
          </div>
        </div>

        {/* Right Column: Severity Breakdown & System Health summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Severity Matrix Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">
              توزيع التحذيرات حسب مستوى الخطورة
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/20 border border-red-500/20">
                <span className="text-xs font-medium text-red-300">أحمر (استثنائي / Extreme)</span>
                <span className="text-sm font-bold text-red-400 font-mono tabular-nums">{severityCounts.extreme}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-950/20 border border-orange-500/20">
                <span className="text-xs font-medium text-orange-300">برتقالي (شديد / Severe)</span>
                <span className="text-sm font-bold text-orange-400 font-mono tabular-nums">{severityCounts.severe}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-500/20">
                <span className="text-xs font-medium text-amber-300">أصفر (متوسط / Moderate)</span>
                <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">{severityCounts.moderate}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-xs font-medium text-emerald-300">أخضر (طفيف / Minor)</span>
                <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">{severityCounts.minor}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/20 border border-blue-500/20">
                <span className="text-xs font-medium text-blue-300">أزرق (إرشادي / Informational)</span>
                <span className="text-sm font-bold text-blue-400 font-mono tabular-nums">{severityCounts.informational}</span>
              </div>
            </div>
          </div>

          {/* Subsystem Telemetry Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">حالة البنية التحتية والأنظمة الفرعية</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg">
                <span className="text-slate-300">قاعدة بيانات PostgreSQL / PostGIS</span>
                <span className="text-emerald-400 font-medium">متصلة (2ms)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg">
                <span className="text-slate-300">واجهة برمجة تطبيق الطقس (Weather API)</span>
                <span className="text-emerald-400 font-medium">نشطة /v1 (48ms)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg">
                <span className="text-slate-300">طابور الإشعارات (Transactional Outbox)</span>
                <span className="text-emerald-400 font-medium">3 مهام قيد المعالجة</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg">
                <span className="text-slate-300">خلاصة CAP الوطنية الرسمية</span>
                <span className="text-emerald-400 font-medium">متصلة (مزامنة فورية)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather App Mobile Live Simulation Preview */}
      <WeatherMobilePreview alerts={alerts} />

      {/* Recent Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">أحدث التحذيرات المسجلة في النظام</h3>
            <span className="text-xs text-slate-400">انقر على أي تحذير لمعاينة تفاصيله ومضلعاته</span>
          </div>
          <button
            onClick={() => onNavigate('all_alerts')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            عرض جميع التحذيرات
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="py-2.5 px-3 font-semibold">المعرف</th>
                <th className="py-2.5 px-3 font-semibold">عنوان التحذير</th>
                <th className="py-2.5 px-3 font-semibold">مستوى الخطورة</th>
                <th className="py-2.5 px-3 font-semibold">الحالة</th>
                <th className="py-2.5 px-3 font-semibold">تاريخ الانتهاء</th>
                <th className="py-2.5 px-3 font-semibold">المنشئ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {alerts.slice(0, 5).map(alert => (
                <tr
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-slate-300">{alert.code}</td>
                  <td className="py-3 px-3 font-medium text-white max-w-md truncate">
                    {alert.headlineAr}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getSeverityBadgeClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-mono">
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono tabular-nums">
                    {alert.expiresAt.replace('T', ' ').replace('Z', ' UTC')}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{alert.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
