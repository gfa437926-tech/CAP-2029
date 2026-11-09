import React, { useState } from 'react';
import { AuditLogItem, NotificationJob } from '../../types/wams';
import { mockAuditLogs, mockNotificationJobs } from '../../data/mockData';
import { 
  Shield, 
  Lock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  Send, 
  RefreshCw, 
  Clock, 
  Users, 
  Smartphone,
  AlertTriangle
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter(l => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.targetId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            سجل التدقيق الأمني غير القابل للتعديل (Append-Only Audit Trail)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            توثيق كامل للعمليات الحساسة (إنشاء، اعتماد، تصعيد، إلغاء) مع بصمة المستخدم وعنوان الـ IP والوقت الدقيق بالـ UTC
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>الأمان: <strong className="text-amber-400">محمي من الحذف أو التعديل برمجياً</strong></span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-950/60">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالفاعل، العملية، أو معرف الكيان..."
            className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">الوقت (UTC)</th>
                <th className="py-3 px-4">المستخدم والوظيفة</th>
                <th className="py-3 px-4">نوع العملية (Action)</th>
                <th className="py-3 px-4">الكيان والهدف</th>
                <th className="py-3 px-4">عنوان IP</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-white block">{log.actor}</span>
                    <span className="text-[10px] text-slate-400 block">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sky-400 font-semibold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300 whitespace-nowrap">
                    {log.targetId}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {log.status === 'success' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                        ناجحة
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300">
                        مرفوضة
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const NotificationsOutboxView: React.FC = () => {
  const [jobs] = useState<NotificationJob[]>(mockNotificationJobs);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            طابور إشعارات تطبيق الطقس (Notification Outbox & Queue)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة مهام الإشعارات الفورية الموجهة جغرافياً (Geo-targeted Push)، منع التكرار، ومراقبة نسب التسليم
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>طابور آمن (Transactional Outbox): <strong className="text-emerald-400">يعمل بكفاءة</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">إجمالي الإشعارات المسلمة بنجاح</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            692,260
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">نسبة التسليم: 99.4%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">المهام قيد الإرسال أو الانتظار</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            95,000
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">مجدولة مع بداية وقت Onset</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">منع التكرار (Idempotency)</span>
          <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums">
            0 تكرار
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">توليد مفاتيح بصمة فريدة لكل مستخدم</span>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">مهام الإشعار المجدولة والمرسلة</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">رقم المهمة</th>
                <th className="py-3 px-4">التحذير المرتبط</th>
                <th className="py-3 px-4">الحدث</th>
                <th className="py-3 px-4">المناطق الجغرافية المستهدفة</th>
                <th className="py-3 px-4">المستلمون المتوقعون</th>
                <th className="py-3 px-4">المسلمون</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{j.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{j.alertId}</td>
                  <td className="py-3 px-4 font-semibold text-white capitalize">{j.event}</td>
                  <td className="py-3 px-4 text-slate-300">{j.targetGeoAreas.join(', ')}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">{j.recipientsCount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-emerald-400 font-bold">{j.deliveredCount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${j.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {j.status === 'delivered' ? 'تم التسليم' : 'في الانتظار'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
