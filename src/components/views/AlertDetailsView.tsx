import React, { useState } from 'react';
import { AlertItem } from '../../types/wams';
import { GISMapCanvas } from '../GISMapCanvas';
import { 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  History, 
  CheckCircle2, 
  Edit3, 
  Ban, 
  Send, 
  AlertTriangle,
  FileCode,
  Layers,
  Copy
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface AlertDetailsViewProps {
  alert: AlertItem;
  onBack: () => void;
  onEdit: (alert: AlertItem) => void;
  onApprove: (alert: AlertItem) => void;
  onPublish: (alert: AlertItem) => void;
  onCancelAlert: (alert: AlertItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const AlertDetailsView: React.FC<AlertDetailsViewProps> = ({
  alert,
  onBack,
  onEdit,
  onApprove,
  onPublish,
  onCancelAlert,
  onNavigate
}) => {
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(alert.currentVersion);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'cap'>('overview');

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'severe': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'minor': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with back button and quick status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
            title="العودة للقائمة"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                {alert.code}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase border ${getSeverityBadgeClass(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className="text-xs text-slate-400 font-mono">الإصدار v{alert.currentVersion}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {alert.headlineAr}
            </h2>
          </div>
        </div>

        {/* Dynamic Workflow Actions according to current state */}
        <div className="flex items-center gap-2">
          {alert.status === 'draft' && (
            <button
              onClick={() => onEdit(alert)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل المسودة</span>
            </button>
          )}

          {alert.status === 'pending_review' && (
            <button
              onClick={() => onApprove(alert)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>اعتماد التحذير (Approve)</span>
            </button>
          )}

          {alert.status === 'approved' && (
            <button
              onClick={() => onPublish(alert)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-slate-950" />
              <span>نشر فوري لتطبيق الطقس</span>
            </button>
          )}

          {alert.status === 'published' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(alert)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>إصدار تحديث جديد (v{alert.currentVersion + 1})</span>
              </button>
              <button
                onClick={() => onCancelAlert(alert)}
                className="px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5 text-red-400" />
                <span>إلغاء التحذير رسمياً</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              تفاصيل المحتوى وتعليمات الطقس
            </h3>

            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">العنوان المختصر لبطاقات تطبيق الطقس</span>
              <p className="text-sm font-semibold text-white">{alert.shortHeadlineAr}</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">الوصف التفصيلي</span>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.descriptionAr}</p>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>تعليمات السلامة للمواطنين:</span>
              </span>
              <p className="text-xs text-amber-100 leading-relaxed font-medium">
                {alert.safetyInstructionsAr}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الظاهرة:</span>
                <span className="font-semibold text-slate-200">{alert.phenomenon}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">درجة اليقين:</span>
                <span className="font-semibold text-slate-200 capitalize">{alert.certainty}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الاستعجال:</span>
                <span className="font-semibold text-slate-200 capitalize">{alert.urgency}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الجهة المصدرة:</span>
                <span className="font-semibold text-slate-200">{alert.issuerOrg}</span>
              </div>
            </div>

            {/* Chain of Custody */}
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-slate-300 block mb-1">سلسلة المسؤولية والاعتماد (Chain of Custody):</span>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span>أنشأه: <strong className="text-white">{alert.createdBy}</strong></span>
                {alert.reviewedBy && <span>دققّه: <strong className="text-white">{alert.reviewedBy}</strong></span>}
                {alert.approvedBy && <span>اعتمده: <strong className="text-white">{alert.approvedBy}</strong></span>}
                {alert.publishedBy && <span>نشره: <strong className="text-white">{alert.publishedBy}</strong></span>}
              </div>
            </div>
          </div>

          {/* Version History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-400" />
              <span>سجل إصدارات التحذير (Version History)</span>
            </h3>

            {alert.versionHistory.length > 0 ? (
              <div className="space-y-2">
                {alert.versionHistory.map(v => (
                  <div key={v.versionNumber} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-sky-400">الإصدار #{v.versionNumber} ({v.status})</span>
                      <span className="text-slate-500 tabular-nums">{v.updatedAt.replace('T', ' ').replace('Z', ' UTC')}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{v.changeSummary}</p>
                    <span className="text-[10px] text-slate-500 block">المعدل: {v.updatedBy}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 p-2">هذا هو الإصدار الأولي ولا توجد تعديلات سابقة.</div>
            )}
          </div>
        </div>

        {/* Right Column: GIS Preview & Coordinates Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>المناطق الجغرافية والمضلعات</span>
              <span className="text-xs text-slate-400 font-mono">{alert.areas.length} مضلع</span>
            </h3>

            <div className="h-64 rounded-lg overflow-hidden border border-slate-800">
              <GISMapCanvas
                alerts={[alert]}
                selectedAlertId={alert.id}
              />
            </div>

            {/* Coordinates table */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">إحداثيات نقاط المضلع (WGS84 Coordinates):</span>
              <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                {alert.areas.flatMap(a => a.coordinates).map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-0.5 text-slate-400">
                    <span>نقطة #{i + 1}</span>
                    <span className="text-sky-300 tabular-nums">{c.lat.toFixed(4)}°N, {c.lng.toFixed(4)}°E</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
