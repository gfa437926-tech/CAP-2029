import React, { useState } from 'react';
import { DataSourceItem, CAPMessageRecord } from '../../types/wams';
import { mockDataSources, mockCapMessages } from '../../data/mockData';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  PlusCircle, 
  Database, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  FileCode,
  Eye,
  ExternalLink
} from 'lucide-react';

interface DataSourcesViewProps {
  onSelectCapMessage?: (msg: CAPMessageRecord) => void;
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = () => {
  const [sources, setSources] = useState<DataSourceItem[]>(mockDataSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleManualSync = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setSuccessToast(`تمت مزامنة المصدر "${name}" بنجاح وجلب أحدث رسائل CAP.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            إدارة مصادر وتغذيات التحذيرات (Data Sources & Ingestion Feeds)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة نقاط النهاية (Endpoints)، خلاصات CAP Atom/XML، وتغذيات الرادار مع التحقق الأمني
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>سياسة الأمان: <strong className="text-emerald-400">حظر أي اتصال غير مصرح</strong></span>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(source => {
          const isConnected = source.status === 'connected';
          const isSyncing = syncingId === source.id;

          return (
            <div
              key={source.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-slate-500 uppercase">{source.type}</span>
                  <div className="flex items-center gap-1.5">
                    {isConnected ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>متصل ونشط</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>غير متصل (يتطلب موافقة)</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{source.nameAr}</h3>
                <span className="font-mono text-xs text-sky-400 block truncate bg-slate-950 p-1.5 rounded border border-slate-800" dir="ltr">
                  {source.endpoint}
                </span>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {source.notes}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">المستورد:</span>
                    <span className="font-mono font-bold text-white tabular-nums">{source.importedCount}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">المرفوض:</span>
                    <span className="font-mono font-bold text-red-400 tabular-nums">{source.rejectedCount}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">المسودة الآلية:</span>
                    <span className="font-semibold text-emerald-400">{source.autoDraft ? 'مفعلة' : 'معطلة'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-500 text-[11px]">آخر مزامنة: {source.lastSync}</span>

                <button
                  onClick={() => handleManualSync(source.id, source.nameAr)}
                  disabled={!isConnected || isSyncing}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-1.5 border border-slate-700 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
                  <span>{isSyncing ? 'جارٍ الجلب...' : 'مزامنة يدوية'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CapLogsView: React.FC = () => {
  const [messages] = useState<CAPMessageRecord[]>(mockCapMessages);
  const [selectedMsg, setSelectedMsg] = useState<CAPMessageRecord | null>(messages[0] || null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          سجل رسائل CAP 1.2 المستلمة (CAP Message Audit Log)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          أرشيف كامل لجميع رسائل التنبيه والتحديث والإلغاء المستلمة من المصادر الخارجية ونتائج التحقق
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            الرسائل المستلمة حديثاً ({messages.length})
          </h3>

          <div className="space-y-2">
            {messages.map(m => {
              const isSelected = selectedMsg?.id === m.id;
              const isValid = m.validationStatus === 'valid';

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-slate-950 border-amber-500/80 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-sky-400 truncate max-w-xs">{m.identifier}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${isValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {isValid ? 'صحيحة ومطابقة' : 'مرفوضة'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium text-white">{m.eventAr}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{m.sent.slice(0, 16).replace('T', ' ')}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>المرسل: {m.sender}</span>
                    <span className="font-mono text-amber-400">{m.msgType} / {m.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected XML Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          {selectedMsg ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">معاينة الرسالة الأصلية</span>
                <h4 className="text-sm font-bold text-white truncate">{selectedMsg.eventAr}</h4>
              </div>

              {selectedMsg.validationErrors && selectedMsg.validationErrors.length > 0 && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs space-y-1">
                  <span className="text-red-300 font-bold block">أسباب الرفض المسجلة:</span>
                  {selectedMsg.validationErrors.map((err, i) => (
                    <div key={i} className="text-red-200 text-[11px]">· {err}</div>
                  ))}
                </div>
              )}

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">كود XML المحفوظ في قاعدة البيانات:</span>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[10px] font-mono text-emerald-400 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed" dir="ltr">
                  {selectedMsg.rawXml}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-slate-500">
              اختر رسالة من القائمة لعرض تفاصيلها
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
