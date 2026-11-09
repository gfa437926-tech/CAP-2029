import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Download, 
  Upload, 
  Settings, 
  ShieldCheck, 
  Clock, 
  Lock, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Save,
  Plus
} from 'lucide-react';

export const AdminRegionsView: React.FC = () => {
  const [regions, setRegions] = useState([
    { code: 'SA-01', nameAr: 'منطقة الرياض', nameEn: 'Riyadh Region', governoratesCount: 20, center: '24.71°N, 46.67°E' },
    { code: 'SA-02', nameAr: 'منطقة مكة المكرمة', nameEn: 'Makkah Region', governoratesCount: 16, center: '21.38°N, 39.85°E' },
    { code: 'SA-03', nameAr: 'منطقة المدينة المنورة', nameEn: 'Madinah Region', governoratesCount: 8, center: '24.52°N, 39.56°E' },
    { code: 'SA-04', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Province', governoratesCount: 11, center: '26.42°N, 50.08°E' },
    { code: 'SA-05', nameAr: 'منطقة عسير', nameEn: 'Asir Region', governoratesCount: 15, center: '18.21°N, 42.50°E' },
    { code: 'SA-06', nameAr: 'منطقة تبوك', nameEn: 'Tabuk Region', governoratesCount: 6, center: '28.38°N, 36.57°E' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            إدارة المناطق والحدود الإدارية (Administrative Boundaries)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ربط التحذيرات بالمناطق الجغرافية الرسمية (ISO 3166-2) وتخزين حدود GeoJSON في قاعدة بيانات PostGIS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>تصدير حدود المناطق (GeoJSON)</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">المناطق الإدارية المعتمدة في النظام</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">رمز المنطقة (ISO Code)</th>
                <th className="py-3 px-4">اسم المنطقة (العربية)</th>
                <th className="py-3 px-4">Name (English)</th>
                <th className="py-3 px-4">عدد المحافظات</th>
                <th className="py-3 px-4">المركز الجغرافي</th>
                <th className="py-3 px-4">حالة الحدود المكانية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {regions.map(r => (
                <tr key={r.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{r.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{r.nameAr}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{r.nameEn}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-400">{r.governoratesCount} محافظة</td>
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{r.center}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      مضلعات PostGIS محفوظة
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

export const SettingsView: React.FC = () => {
  const [autoExpire, setAutoExpire] = useState<boolean>(true);
  const [defaultDuration, setDefaultDuration] = useState<number>(12);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            إعدادات النظام العامة (System Configuration)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ضبط سياسات دورة حياة التحذيرات، مواقيت الانتهاء التلقائي، وتخصيص الظواهر الجوية
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تم حفظ الإعدادات بنجاح وتطبيقها على محرك النظام.</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Time and Timezone Policy */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>سياسة المواقيت والتخزين (UTC Storage Policy)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            وفق المعايير الدولية للأرصاد الجوية (WMO): يتم تخزين جميع التواريخ والأوقات في قاعدة البيانات بالتوقيت العالمي الموحد (UTC)، مع تحويلها آلياً للتوقيت المحلي للمستخدم في واجهة العرض.
          </p>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">التوقيت المرجعي الداخلي:</span>
            <span className="font-mono text-emerald-400 font-bold">UTC (GMT+0)</span>
          </div>
        </div>

        {/* Automatic Expiry Cron */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">الانتهاء الآلي للتحذيرات (Auto-Expiration Worker)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديث حالة التحذير المنشور إلى Expired تلقائياً عند تجاوز وقت الصلاحية المحدد وإخطار تطبيق الطقس
              </p>
            </div>
            <button
              onClick={() => setAutoExpire(!autoExpire)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${autoExpire ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoExpire ? 'translate-x-0' : '-translate-x-6'}`} />
            </button>
          </div>
        </div>

        {/* Default Duration */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">المدة الافتراضية المقترحة للتحذيرات الجديدة</h3>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 12)}
              className="w-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white text-center"
            />
            <span className="text-xs text-slate-400">ساعة من وقت بدء التأثير (Onset)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginView: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('sarah.q@met.gov.sa');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [mfaCode, setMfaCode] = useState<string>('842910');

  return (
    <div className="min-h-[560px] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-black text-xl mx-auto shadow-lg">
            W
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            تسجيل الدخول إلى منصة WAMS
          </h2>
          <p className="text-xs text-slate-400">
            نظام إدارة التحذيرات الجوية - منسوبو الأرصاد والإنذار المبكر
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-semibold">البريد الإلكتروني المؤسسي:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-semibold">كلمة المرور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-semibold">رمز التحقق الثنائي (MFA Token):</label>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-mono tracking-widest text-center"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg mt-2"
          >
            تسجيل الدخول الآمن
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          هذا النظام مخصص للجهات والأفراد المصرح لهم في الأرصاد الجوية الوطنية.
        </div>
      </div>
    </div>
  );
};
