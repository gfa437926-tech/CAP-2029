import React, { useState } from 'react';
import { AlertItem } from '../../types/wams';
import { GISMapCanvas } from '../GISMapCanvas';
import { 
  CheckSquare, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Send, 
  Eye, 
  UserCheck, 
  Calendar, 
  Layers
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface ReviewAlertsViewProps {
  alerts: AlertItem[];
  onApproveAlert: (alert: AlertItem) => void;
  onRejectAlert: (alert: AlertItem, reason: string) => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const ReviewAlertsView: React.FC<ReviewAlertsViewProps> = ({
  alerts,
  onApproveAlert,
  onRejectAlert,
  onSelectAlert
}) => {
  const pendingAlerts = alerts.filter(a => a.status === 'pending_review' || a.status === 'draft');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(pendingAlerts[0] || null);
  const [rejectionNotes, setRejectionNotes] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleApprove = (alert: AlertItem) => {
    onApproveAlert(alert);
    setSuccessToast(`تم اعتماد التحذير ${alert.code} بنجاح وأصبح جاهزاً للنشر.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            بوابة المراجعة والاعتماد (Review & Approval Gate)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تدقيق المسودات وصحة المضلعات الجغرافية قبل إجازتها للنشر - مبدأ العينين الأربع (Four-Eyes Principle)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>سياسة الفصل بين المهام: <strong className="text-emerald-400">مُفعلة</strong></span>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main 2-Column Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Alerts Queue */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>طابور التحذيرات بانتظار المراجعة ({pendingAlerts.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {pendingAlerts.length > 0 ? (
              pendingAlerts.map(a => {
                const isSelected = selectedAlert?.id === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAlert(a)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-slate-950 border-amber-500/80 shadow-md' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-sky-400">{a.code}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                        {a.status === 'pending_review' ? 'بانتظار الاعتماد' : 'مسودة'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{a.headlineAr}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{a.descriptionAr}</p>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>المنشئ: {a.createdBy}</span>
                      <span className="capitalize text-amber-400 font-semibold">{a.severity}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="block font-medium text-slate-200">لا توجد تحذيرات قيد المراجعة حالياً</span>
                <span className="text-[11px] text-slate-500">جميع التحذيرات معتمدة أو تم الفصل فيها</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Inspection Checklist & Actions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          {selectedAlert ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">التدقيق الفني للتحذير</span>
                  <h3 className="text-base font-bold text-white">{selectedAlert.headlineAr}</h3>
                </div>
                <span className="text-xs font-mono text-amber-400 font-semibold">{selectedAlert.code}</span>
              </div>

              {/* GIS Mini Map of Area to Verify */}
              <div className="h-56 rounded-lg overflow-hidden border border-slate-800">
                <GISMapCanvas
                  alerts={[selectedAlert]}
                  selectedAlertId={selectedAlert.id}
                />
              </div>

              {/* Automated Quality & Policy Checks */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block">فحوصات الجودة الآلية (Automated Verification Checks):</span>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-slate-200">سلامة المضلع الجغرافي: <strong className="text-emerald-400">ST_IsValid = TRUE</strong> (مضلع مغلق بدون تقاطع ذاتي)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-slate-200">تعليمات السلامة: <strong className="text-emerald-400">مكتملة ومطابقة</strong> لإرشادات الدفاع المدني</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-slate-200">الفترة الزمنية: <strong className="text-emerald-400">صحيحة</strong> (وقت الانتهاء لاحق لوقت البدء)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-400">
                    <UserCheck className="w-4 h-4 flex-shrink-0" />
                    <span className="text-slate-200">مبدأ الفصل: <strong className="text-sky-300">المدقق يختلف عن منشئ المسودة</strong></span>
                  </div>
                </div>
              </div>

              {/* Safety Instructions Text */}
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-300 block">تعليمات السلامة المرفقة:</span>
                <p className="text-amber-100 leading-relaxed">{selectedAlert.safetyInstructionsAr}</p>
              </div>

              {/* Reviewer Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>إعادة للمنشئ مع ملاحظات</span>
                </button>

                <button
                  onClick={() => handleApprove(selectedAlert)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>إجازة واعتماد التحذير (Approve)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-slate-500">
              اختر تحذيراً من القائمة للبدء في مراجعته وتدقيقه
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
