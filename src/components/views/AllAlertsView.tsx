import React, { useState } from 'react';
import { AlertItem, AlertSeverity, AlertStatus } from '../../types/wams';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  Edit3, 
  Ban, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { ScreenId } from '../Navigation';

interface AllAlertsViewProps {
  alerts: AlertItem[];
  initialFilter?: AlertStatus | 'all';
  onNavigate: (screen: ScreenId) => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const AllAlertsView: React.FC<AllAlertsViewProps> = ({
  alerts,
  initialFilter = 'all',
  onNavigate,
  onSelectAlert
}) => {
  const [activeTab, setActiveTab] = useState<AlertStatus | 'all'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    // Filter by tab status
    if (activeTab !== 'all' && a.status !== activeTab) return false;

    // Filter by severity
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = a.code.toLowerCase().includes(q);
      const matchHeadlineAr = a.headlineAr.toLowerCase().includes(q);
      const matchShortAr = a.shortHeadlineAr.toLowerCase().includes(q);
      const matchCreatedBy = a.createdBy.toLowerCase().includes(q);
      if (!matchCode && !matchHeadlineAr && !matchShortAr && !matchCreatedBy) return false;
    }

    return true;
  });

  const getSeverityBadgeClass = (severity: AlertSeverity) => {
    switch (severity) {
      case 'extreme': return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'severe': return 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
      case 'moderate': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'minor': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'published': return <span className="text-emerald-400 font-medium">منشور ونشط</span>;
      case 'pending_review': return <span className="text-amber-400 font-medium">قيد المراجعة</span>;
      case 'scheduled': return <span className="text-sky-400 font-medium">مجدول</span>;
      case 'draft': return <span className="text-slate-400 font-medium">مسودة</span>;
      case 'approved': return <span className="text-indigo-400 font-medium">معتمد</span>;
      case 'expired': return <span className="text-slate-500 font-medium">منتهي</span>;
      case 'cancelled': return <span className="text-red-400 font-medium line-through">ملغي</span>;
      case 'archived': return <span className="text-slate-600 font-medium">مؤرشف</span>;
      default: return <span className="text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            سجل التحذيرات الجوية العام (Alerts Registry)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة ومتابعة جميع حالات التحذير الجوي عبر دورة حياتها الرسمية وتطبيق قواعد الفرز المتقدم
          </p>
        </div>

        <button
          onClick={() => onNavigate('create_alert')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء تحذير جديد</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          الكل ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'published' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          النشطة المنشورة ({alerts.filter(a => a.status === 'published').length})
        </button>
        <button
          onClick={() => setActiveTab('pending_review')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'pending_review' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          قيد المراجعة ({alerts.filter(a => a.status === 'pending_review').length})
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'scheduled' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          المجدولة ({alerts.filter(a => a.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'draft' ? 'bg-slate-300 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          المسودات ({alerts.filter(a => a.status === 'draft').length})
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'expired' ? 'bg-slate-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          المنتهية ({alerts.filter(a => a.status === 'expired').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'cancelled' ? 'bg-red-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          الملغاة ({alerts.filter(a => a.status === 'cancelled').length})
        </button>
      </div>

      {/* Search and Secondary Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالمعرف، العنوان، أو المنشئ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">الخطورة:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">جميع مستويات الخطورة</option>
            <option value="extreme">أحمر (Extreme)</option>
            <option value="severe">برتقالي (Severe)</option>
            <option value="moderate">أصفر (Moderate)</option>
            <option value="minor">أخضر (Minor)</option>
            <option value="informational">أزرق (Informational)</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">المعرف (Code)</th>
                <th className="py-3 px-4">عنوان التحذير الجوي</th>
                <th className="py-3 px-4">الظاهرة</th>
                <th className="py-3 px-4">مستوى الخطورة</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">الإصدار</th>
                <th className="py-3 px-4">فترة الصلاحية</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectAlert(alert)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {alert.code}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <span className="font-semibold text-white block leading-snug">{alert.headlineAr}</span>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">{alert.shortHeadlineAr}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {alert.phenomenon}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase ${getSeverityBadgeClass(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(alert.status)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                      v{alert.currentVersion}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400 font-mono whitespace-nowrap tabular-nums">
                      <div>من: {alert.effectiveAt.slice(5, 16).replace('T', ' ')}</div>
                      <div>إلى: {alert.expiresAt.slice(5, 16).replace('T', ' ')}</div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectAlert(alert)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    لا توجد تحذيرات تطابق خيارات التصفية الحالية
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
