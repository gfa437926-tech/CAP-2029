import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  PlusCircle, 
  Clock, 
  CheckSquare, 
  History, 
  FileCode, 
  Database, 
  Globe, 
  Users, 
  Shield, 
  FileText, 
  Bell, 
  BarChart3, 
  Settings, 
  Activity, 
  Code2, 
  BookOpen, 
  Smartphone,
  Sparkles,
  Layers,
  Archive,
  Ban,
  CheckCircle2
} from 'lucide-react';

export type ScreenId = 
  | 'login'
  | 'dashboard'
  | 'gis_map'
  | 'all_alerts'
  | 'create_alert'
  | 'edit_alert'
  | 'alert_details'
  | 'review_alerts'
  | 'scheduled_alerts'
  | 'active_alerts'
  | 'expired_alerts'
  | 'cancelled_alerts'
  | 'archive'
  | 'cap_import'
  | 'cap_logs'
  | 'data_sources'
  | 'admin_regions'
  | 'users'
  | 'rbac_matrix'
  | 'audit_logs'
  | 'notifications_outbox'
  | 'reports'
  | 'settings'
  | 'api_docs'
  | 'system_health'
  | 'qgis_postgis'
  // Stage 1 Engineering Portals
  | 'stage1_deliverables'
  | 'stage1_approval';

interface NavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeDeliverableTab?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onToggleLang,
  isDarkMode,
  onToggleTheme
}) => {
  const navSections = [
    {
      categoryAr: 'مخرجات المرحلة الأولى (Stage 1 Deliverables)',
      categoryEn: 'Stage 1 Architecture & Design',
      items: [
        { id: 'stage1_deliverables' as ScreenId, nameAr: 'وثائق ومخططات المرحلة 1 (الـ 10 كاملة)', nameEn: 'Stage 1 Deliverables (10 Specs)', icon: BookOpen, isHighlighted: true },
        { id: 'stage1_approval' as ScreenId, nameAr: 'بوابة المراجعة والاعتماد للمرحلة 2', nameEn: 'Stage 2 Sign-Off & Approval', icon: CheckCircle2, isHighlighted: true }
      ]
    },
    {
      categoryAr: 'العمليات والإنذار المباشر',
      categoryEn: 'Operations & Live Alerts',
      items: [
        { id: 'dashboard' as ScreenId, nameAr: 'لوحة التحكم الرئيسية', nameEn: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'gis_map' as ScreenId, nameAr: 'خريطة التحذيرات (GIS)', nameEn: 'GIS Alert Map', icon: Map },
        { id: 'active_alerts' as ScreenId, nameAr: 'التحذيرات النشطة الحالية', nameEn: 'Live Active Alerts', icon: AlertTriangle },
        { id: 'scheduled_alerts' as ScreenId, nameAr: 'التحذيرات المجدولة', nameEn: 'Scheduled Alerts', icon: Clock },
        { id: 'review_alerts' as ScreenId, nameAr: 'مراجعة واعتماد التحذيرات', nameEn: 'Review & Approvals', icon: CheckSquare },
        { id: 'create_alert' as ScreenId, nameAr: 'إنشاء تحذير جديد', nameEn: 'Create New Alert', icon: PlusCircle }
      ]
    },
    {
      categoryAr: 'سجلات التحذيرات',
      categoryEn: 'Alert Registries',
      items: [
        { id: 'all_alerts' as ScreenId, nameAr: 'جميع التحذيرات', nameEn: 'All Alerts Registry', icon: FileText },
        { id: 'expired_alerts' as ScreenId, nameAr: 'التحذيرات المنتهية', nameEn: 'Expired Alerts', icon: History },
        { id: 'cancelled_alerts' as ScreenId, nameAr: 'التحذيرات الملغاة', nameEn: 'Cancelled Alerts', icon: Ban },
        { id: 'archive' as ScreenId, nameAr: 'أرشيف التحذيرات التاريخي', nameEn: 'Historical Archive', icon: Archive }
      ]
    },
    {
      categoryAr: 'معيار CAP ومصادر البيانات',
      categoryEn: 'CAP 1.2 & Ingestion',
      items: [
        { id: 'cap_import' as ScreenId, nameAr: 'استيراد CAP والتحقق', nameEn: 'CAP 1.2 Import', icon: FileCode },
        { id: 'cap_logs' as ScreenId, nameAr: 'سجل رسائل CAP المستلمة', nameEn: 'CAP Messages Log', icon: Database },
        { id: 'data_sources' as ScreenId, nameAr: 'إدارة مصادر البيانات', nameEn: 'Data Ingestion Feeds', icon: Layers }
      ]
    },
    {
      categoryAr: 'الجغرافيا ونشر تطبيق الطقس',
      categoryEn: 'GIS & Weather App Distribution',
      items: [
        { id: 'qgis_postgis' as ScreenId, nameAr: 'تكامل QGIS و PostgreSQL / PostGIS', nameEn: 'QGIS & PostGIS Studio', icon: Database, isHighlighted: true },
        { id: 'admin_regions' as ScreenId, nameAr: 'المناطق والحدود الإدارية', nameEn: 'Admin Boundaries', icon: Globe },
        { id: 'notifications_outbox' as ScreenId, nameAr: 'طابور إشعارات تطبيق الطقس', nameEn: 'Push Outbox Queue', icon: Bell },
        { id: 'api_docs' as ScreenId, nameAr: 'واجهات API وتكامل الطقس', nameEn: 'Weather App API & OpenAPI', icon: Code2 }
      ]
    },
    {
      categoryAr: 'الأمان والتقارير والنظام',
      categoryEn: 'Security & System',
      items: [
        { id: 'audit_logs' as ScreenId, nameAr: 'سجل التدقيق الأمني غير القابل للتعديل', nameEn: 'Append-Only Audit Log', icon: Shield },
        { id: 'reports' as ScreenId, nameAr: 'التقارير والإحصاءات', nameEn: 'Reports & Analytics', icon: BarChart3 },
        { id: 'users' as ScreenId, nameAr: 'إدارة المستخدمين', nameEn: 'User Directory', icon: Users },
        { id: 'rbac_matrix' as ScreenId, nameAr: 'مصفوفة الأدوار والصلاحيات', nameEn: 'RBAC Matrix', icon: Shield },
        { id: 'settings' as ScreenId, nameAr: 'إعدادات النظام والظواهر', nameEn: 'System Configuration', icon: Settings },
        { id: 'system_health' as ScreenId, nameAr: 'حالة الخدمات وقاعدة البيانات', nameEn: 'System Diagnostics', icon: Activity },
        { id: 'login' as ScreenId, nameAr: 'شاشة تسجيل الدخول', nameEn: 'Login Screen', icon: Users }
      ]
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 text links) - Zone 3 (1 primary action) */}
      <header className="h-16 px-6 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-8 sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-black text-sm">
              W
            </div>
            <span>WAMS للأرصاد الجوية</span>
          </button>
          <span className="hidden lg:inline text-xs text-slate-500 font-mono">
            نظام إدارة التحذيرات الجوية v1.0
          </span>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('gis_map')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${currentScreen === 'gis_map' ? 'text-amber-400 font-bold' : ''}`}
          >
            <span>خريطة الـ GIS الحية</span>
          </button>
          <button
            onClick={() => onNavigate('qgis_postgis')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${currentScreen === 'qgis_postgis' ? 'text-emerald-400 font-bold' : ''}`}
          >
            <span>تكامل QGIS و PostGIS</span>
          </button>
          <button
            onClick={() => onNavigate('stage1_deliverables')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentScreen === 'stage1_deliverables' ? 'text-amber-400 font-bold' : ''}`}
          >
            وثائق ومخططات المرحلة 1
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentScreen === 'dashboard' ? 'text-amber-400 font-bold' : ''}`}
          >
            لوحة العمليات
          </button>
          <button
            onClick={() => onNavigate('api_docs')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentScreen === 'api_docs' ? 'text-amber-400 font-bold' : ''}`}
          >
            تطبيق الطقس (API)
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg text-xs transition-colors"
            title="تبديل الوضع اللوني (داكن / فاتح)"
          >
            {isDarkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
          </button>
          <button
            onClick={() => onNavigate('stage1_approval')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>مراجعة واعتماد المرحلة 1</span>
          </button>
        </div>
      </header>

      {/* Secondary Quick Jump Navigation Bar for 25 Screens */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-2 overflow-x-auto text-xs text-slate-400 flex items-center gap-2">
        <span className="text-slate-500 whitespace-nowrap font-medium">الشاشات الـ 25:</span>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {navSections.flatMap(s => s.items).map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 rounded transition-colors ${currentScreen === item.id ? 'bg-slate-800 text-white font-medium border border-slate-700' : 'hover:text-slate-200 hover:bg-slate-950/60'}`}
            >
              {item.nameAr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
