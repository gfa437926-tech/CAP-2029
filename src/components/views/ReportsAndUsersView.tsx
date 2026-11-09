import React, { useState } from 'react';
import { User, UserRole } from '../../types/wams';
import { mockUsers } from '../../data/mockData';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  PlusCircle, 
  Search,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('30days');
  const [exportedToast, setExportedToast] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportedToast(`تم تجهيز وتصدير التقرير بصيغة ${format.toUpperCase()} بنجاح.`);
    setTimeout(() => setExportedToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            التقارير والإحصاءات الأرصادية (Meteorological Reports & Analytics)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تحليل تكرار الظواهر، متوسط مدد التحذيرات، أكثر المناطق تعرضاً، وأداء قنوات النشر والإشعار
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>تصدير CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>تصدير PDF</span>
          </button>
        </div>
      </div>

      {exportedToast && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <span>{exportedToast}</span>
        </div>
      )}

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">متوسط مدة سريان التحذير</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            14.2 <span className="text-sm font-normal text-slate-400">ساعة</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">ضمن النطاق القياسي للتحذيرات</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">أكثر الظواهر المسجلة</span>
          <div className="text-xl font-bold text-amber-400">
            أمطار رعدية وسيول
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">تمثل 48% من التحذيرات الصادرة</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">أكثر المناطق تأثراً</span>
          <div className="text-xl font-bold text-sky-400">
            القطاع الغربي والوسطى
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">مكة، جدة، والرياض</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">نسبة إلغاء التحذيرات المبكرة</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            4.1%
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">دقة تنبؤ سينوبتيكي فائقة</span>
        </div>
      </div>

      {/* Visual Frequency Chart Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
          تكرار التحذيرات الجوية حسب الظاهرة خلال الشهر الحالي
        </h3>

        <div className="space-y-3">
          {[
            { label: 'أمطار غزيرة وسيول جارفة (Flash Flood & Heavy Rain)', count: 28, pct: '70%', color: 'bg-red-500' },
            { label: 'عواصف رعدية ورياح هابطة (Thunderstorm)', count: 19, pct: '48%', color: 'bg-orange-500' },
            { label: 'عواصف غبارية وانعدام رؤية (Dust Storm)', count: 14, pct: '35%', color: 'bg-amber-500' },
            { label: 'ضباب كثيف وتدني الرؤية (Dense Fog)', count: 11, pct: '28%', color: 'bg-sky-500' },
            { label: 'اضطرابات بحرية وأمواج عالية (Marine Surge)', count: 8, pct: '20%', color: 'bg-blue-500' },
            { label: 'موجات صقيع وانخفاض حاد (Frost & Coldwave)', count: 4, pct: '10%', color: 'bg-indigo-500' }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-400 font-mono font-bold tabular-nums">{item.count} تحذير</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const UsersAndRbacView: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [separationOfDuties, setSeparationOfDuties] = useState<boolean>(true);

  // 14 Granular permissions defined in SRS & Section 13
  const permissionsList = [
    { key: 'create_alert', nameAr: 'إنشاء التحذيرات الجوية' },
    { key: 'edit_draft', nameAr: 'تعديل المسودات' },
    { key: 'send_review', nameAr: 'إرسال للمراجعة' },
    { key: 'review_alert', nameAr: 'مراجعة وتدقيق التحذيرات' },
    { key: 'approve_alert', nameAr: 'اعتماد التحذير (Approve)' },
    { key: 'publish_alert', nameAr: 'نشر التحذير فوراً' },
    { key: 'update_published', nameAr: 'تحديث تحذير منشور' },
    { key: 'cancel_alert', nameAr: 'إلغاء تحذير منشور' },
    { key: 'manage_sources', nameAr: 'إدارة مصادر CAP' },
    { key: 'manage_regions', nameAr: 'إدارة المناطق الإدارية' },
    { key: 'manage_users', nameAr: 'إدارة المستخدمين' },
    { key: 'view_audit_logs', nameAr: 'الاطلاع على سجل التدقيق' },
    { key: 'manage_settings', nameAr: 'إدارة إعدادات النظام' },
    { key: 'view_alerts_only', nameAr: 'عرض التحذيرات فقط' }
  ];

  // Role permissions mapping
  const rolePermissions: Record<UserRole, string[]> = {
    super_admin: permissionsList.map(p => p.key),
    administrator: permissionsList.filter(p => !['approve_alert', 'publish_alert', 'manage_settings'].includes(p.key)).map(p => p.key),
    alert_creator: ['create_alert', 'edit_draft', 'send_review', 'update_published', 'view_alerts_only'],
    reviewer: ['review_alert', 'view_alerts_only'],
    approver: ['review_alert', 'approve_alert', 'cancel_alert', 'view_alerts_only'],
    publisher: ['publish_alert', 'update_published', 'cancel_alert', 'view_alerts_only'],
    viewer: ['view_alerts_only']
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            إدارة المستخدمين ومصفوفة الأدوار والصلاحيات (RBAC)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة حسابات منسوبي الأرصاد، توزيع الصلاحيات الـ 14، وتطبيق سياسة الفصل بين المهام (Four-Eyes Principle)
          </p>
        </div>

        {/* Separation of Duties Toggle */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-lg">
          <div className="text-right">
            <span className="text-xs font-bold text-white block">مبدأ الفصل بين المهام:</span>
            <span className="text-[10px] text-slate-400 block">منع منشئ التحذير من اعتماده أو نشره</span>
          </div>
          <button
            onClick={() => setSeparationOfDuties(!separationOfDuties)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${separationOfDuties ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${separationOfDuties ? 'translate-x-0' : '-translate-x-6'}`} />
          </button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">دليل موظفي الأرصاد والإنذار المبكر</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">الاسم الكامل</th>
                <th className="py-3 px-4">البريد المؤسسي</th>
                <th className="py-3 px-4">الإدارة / القسم</th>
                <th className="py-3 px-4">الدور الوظيفي (Role)</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">آخر نشاط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-sky-400">{u.email}</td>
                  <td className="py-3 px-4 text-slate-300">{u.department}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-amber-400 uppercase">{u.role}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      نشط
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">مصفوفة الصلاحيات التفصيلية (7 أدوار × 14 صلاحية)</h3>
          <span className="text-xs text-slate-400 font-mono">Backend Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">الصلاحية</th>
                <th className="py-3 px-2 text-center">Super Admin</th>
                <th className="py-3 px-2 text-center">Admin</th>
                <th className="py-3 px-2 text-center">Creator</th>
                <th className="py-3 px-2 text-center">Reviewer</th>
                <th className="py-3 px-2 text-center">Approver</th>
                <th className="py-3 px-2 text-center">Publisher</th>
                <th className="py-3 px-2 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissionsList.map(perm => (
                <tr key={perm.key} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-200">{perm.nameAr}</td>
                  <td className="py-2.5 px-2 text-center">
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.administrator.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.alert_creator.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.reviewer.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.approver.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.publisher.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {rolePermissions.viewer.includes(perm.key) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
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
