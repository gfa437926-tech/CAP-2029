/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertItem, DataSourceItem, GeoArea } from './types/wams';
import { mockAlerts, mockDataSources } from './data/mockData';
import { Navigation, ScreenId } from './components/Navigation';
import { DeliverablesHubView } from './components/views/DeliverablesHubView';
import { Stage1ApprovalView } from './components/views/Stage1ApprovalView';
import { DashboardView } from './components/views/DashboardView';
import { GISMapView } from './components/views/GISMapView';
import { AllAlertsView } from './components/views/AllAlertsView';
import { CreateEditAlertView } from './components/views/CreateEditAlertView';
import { AlertDetailsView } from './components/views/AlertDetailsView';
import { ReviewAlertsView } from './components/views/ReviewAlertsView';
import { CapImportView } from './components/views/CapImportView';
import { DataSourcesView, CapLogsView } from './components/views/DataSourcesView';
import { AuditLogView, NotificationsOutboxView } from './components/views/AuditLogView';
import { ReportsView, UsersAndRbacView } from './components/views/ReportsAndUsersView';
import { ApiAndIntegrationsView, SystemHealthView } from './components/views/ApiAndHealthView';
import { AdminRegionsView, SettingsView, LoginView } from './components/views/AdminRegionsAndSettingsView';
import { QGISAndPostgresView } from './components/views/QGISAndPostgresView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('stage1_deliverables');
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [sources, setSources] = useState<DataSourceItem[]>(mockDataSources);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(mockAlerts[0] || null);
  const [editingAlert, setEditingAlert] = useState<AlertItem | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [stage1Approved, setStage1Approved] = useState<boolean>(false);
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync language with document direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handlers for Alert Lifecycle operations
  const handleSelectAlert = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setCurrentScreen('alert_details');
  };

  const handleEditAlert = (alert: AlertItem) => {
    setEditingAlert(alert);
    setCurrentScreen('edit_alert');
  };

  const handleSaveDraft = (alert: AlertItem) => {
    setAlerts(prev => {
      const idx = prev.findIndex(a => a.id === alert.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = alert;
        return updated;
      }
      return [alert, ...prev];
    });
    setSelectedAlert(alert);
    setCurrentScreen('alert_details');
  };

  const handleSubmitForReview = (alert: AlertItem) => {
    const updatedAlert: AlertItem = {
      ...alert,
      status: 'pending_review'
    };
    handleSaveDraft(updatedAlert);
  };

  const handleApproveAlert = (alert: AlertItem) => {
    const updatedAlert: AlertItem = {
      ...alert,
      status: 'approved',
      approvedBy: 'م. عبد الرحمن البلوشي'
    };
    handleSaveDraft(updatedAlert);
  };

  const handlePublishAlert = (alert: AlertItem) => {
    const updatedAlert: AlertItem = {
      ...alert,
      status: 'published',
      publishedBy: 'أمل العتيبي'
    };
    handleSaveDraft(updatedAlert);
  };

  const handleCancelAlert = (alert: AlertItem) => {
    const updatedAlert: AlertItem = {
      ...alert,
      status: 'cancelled',
      currentVersion: alert.currentVersion + 1,
      versionHistory: [
        ...alert.versionHistory,
        {
          versionNumber: alert.currentVersion + 1,
          updatedAt: new Date().toISOString(),
          updatedBy: 'أمل العتيبي',
          changeSummary: 'إلغاء رسمي للتحذير لزوال الحالة الجوية',
          status: 'cancelled',
          headlineAr: alert.headlineAr,
          severity: alert.severity
        }
      ]
    };
    handleSaveDraft(updatedAlert);
  };

  const handleAddPolygonToSelected = (area: GeoArea) => {
    if (!selectedAlert) return;
    const updatedAlert = {
      ...selectedAlert,
      areas: [...selectedAlert.areas, area]
    };
    handleSaveDraft(updatedAlert);
  };

  const handleStage1Approval = (notes: string) => {
    setStage1Approved(true);
    setApprovalNotes(notes);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          if (screen === 'create_alert') setEditingAlert(null);
          setCurrentScreen(screen);
        }}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(d => !d)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stage 1 Deliverables Hub */}
        {currentScreen === 'stage1_deliverables' && (
          <DeliverablesHubView
            onNavigateToScreen={(s) => setCurrentScreen(s as ScreenId)}
            onProceedToSignOff={() => setCurrentScreen('stage1_approval')}
          />
        )}

        {/* Stage 1 Formal Approval View */}
        {currentScreen === 'stage1_approval' && (
          <Stage1ApprovalView
            onBackToDeliverables={() => setCurrentScreen('stage1_deliverables')}
            onApproveStage1={handleStage1Approval}
          />
        )}

        {/* 1. Dashboard View */}
        {currentScreen === 'dashboard' && (
          <DashboardView
            alerts={alerts}
            sources={sources}
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {/* 2. GIS Map View */}
        {currentScreen === 'gis_map' && (
          <GISMapView
            alerts={alerts}
            selectedAlert={selectedAlert || undefined}
            onSelectAlert={(a) => setSelectedAlert(a)}
            onAddNewArea={handleAddPolygonToSelected}
          />
        )}

        {/* QGIS & PostgreSQL / PostGIS Integration Studio */}
        {currentScreen === 'qgis_postgis' && (
          <QGISAndPostgresView alerts={alerts} />
        )}

        {/* 3. All Alerts & Status Filtering */}
        {currentScreen === 'all_alerts' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="all"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentScreen === 'active_alerts' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="published"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentScreen === 'scheduled_alerts' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="scheduled"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentScreen === 'expired_alerts' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="expired"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentScreen === 'cancelled_alerts' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="cancelled"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentScreen === 'archive' && (
          <AllAlertsView
            alerts={alerts}
            initialFilter="all"
            onNavigate={setCurrentScreen}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {/* 4. Create / Edit Alert Views */}
        {currentScreen === 'create_alert' && (
          <CreateEditAlertView
            initialAlert={null}
            onSaveDraft={handleSaveDraft}
            onSubmitForReview={handleSubmitForReview}
            onCancel={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'edit_alert' && (
          <CreateEditAlertView
            initialAlert={editingAlert || selectedAlert}
            onSaveDraft={handleSaveDraft}
            onSubmitForReview={handleSubmitForReview}
            onCancel={() => setCurrentScreen('alert_details')}
          />
        )}

        {/* 5. Alert Details View */}
        {currentScreen === 'alert_details' && selectedAlert && (
          <AlertDetailsView
            alert={selectedAlert}
            onBack={() => setCurrentScreen('all_alerts')}
            onEdit={handleEditAlert}
            onApprove={handleApproveAlert}
            onPublish={handlePublishAlert}
            onCancelAlert={handleCancelAlert}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* 6. Review & Approvals Gate */}
        {currentScreen === 'review_alerts' && (
          <ReviewAlertsView
            alerts={alerts}
            onApproveAlert={handleApproveAlert}
            onRejectAlert={(a) => handleSaveDraft({ ...a, status: 'draft' })}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {/* 7. CAP 1.2 Import */}
        {currentScreen === 'cap_import' && (
          <CapImportView
            onConvertToDraft={handleSaveDraft}
            onNavigateToLogs={() => setCurrentScreen('cap_logs')}
          />
        )}

        {/* 8. CAP Messages Log */}
        {currentScreen === 'cap_logs' && (
          <CapLogsView />
        )}

        {/* 9. Data Sources */}
        {currentScreen === 'data_sources' && (
          <DataSourcesView />
        )}

        {/* 10. Audit Logs */}
        {currentScreen === 'audit_logs' && (
          <AuditLogView />
        )}

        {/* 11. Push Notifications Outbox */}
        {currentScreen === 'notifications_outbox' && (
          <NotificationsOutboxView />
        )}

        {/* 12. Reports & Analytics */}
        {currentScreen === 'reports' && (
          <ReportsView />
        )}

        {/* 13. Users & RBAC */}
        {currentScreen === 'users' && (
          <UsersAndRbacView />
        )}

        {currentScreen === 'rbac_matrix' && (
          <UsersAndRbacView />
        )}

        {/* 14. API Documentation & Integration */}
        {currentScreen === 'api_docs' && (
          <ApiAndIntegrationsView />
        )}

        {/* 15. System Health Diagnostics */}
        {currentScreen === 'system_health' && (
          <SystemHealthView />
        )}

        {/* 16. Admin Boundaries */}
        {currentScreen === 'admin_regions' && (
          <AdminRegionsView />
        )}

        {/* 17. System Settings */}
        {currentScreen === 'settings' && (
          <SettingsView />
        )}

        {/* 18. Login Screen */}
        {currentScreen === 'login' && (
          <LoginView onLoginSuccess={() => setCurrentScreen('dashboard')} />
        )}
      </main>

      {/* Footer bar */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">WAMS – Weather Alerts Management System</span>
          <span>·</span>
          <span>نظام إدارة التحذيرات الجوية</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>WMO / OASIS CAP v1.2</span>
          <span>·</span>
          <span>PostgreSQL + PostGIS</span>
          <span>·</span>
          <span>REST API /v1</span>
        </div>
      </footer>
    </div>
  );
}
