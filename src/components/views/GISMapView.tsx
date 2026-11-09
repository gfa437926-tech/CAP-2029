import React, { useState } from 'react';
import { AlertItem, GeoArea } from '../../types/wams';
import { GISMapCanvas } from '../GISMapCanvas';
import { 
  Layers, 
  MapPin, 
  ShieldAlert, 
  CloudRain, 
  Wind, 
  Maximize2, 
  MousePointer, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface GISMapViewProps {
  alerts: AlertItem[];
  selectedAlert?: AlertItem;
  onSelectAlert: (alert: AlertItem) => void;
  onAddNewArea?: (area: GeoArea) => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({
  alerts,
  selectedAlert,
  onSelectAlert,
  onAddNewArea
}) => {
  const [createdAreas, setCreatedAreas] = useState<GeoArea[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  const handlePolygonCreated = (area: GeoArea) => {
    setCreatedAreas(prev => [...prev, area]);
    if (onAddNewArea) onAddNewArea(area);
    setNotificationMsg(`تم رسم المضلع بنجاح وحفظ ${area.coordinates.length} نقطة إحداثية في ذاكرة الـ GIS`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleExportGeoJson = () => {
    const geojson = {
      type: "FeatureCollection",
      features: alerts.flatMap(a => a.areas.map(area => ({
        type: "Feature",
        properties: {
          alertId: a.id,
          code: a.code,
          headline: a.headlineAr,
          severity: a.severity,
          status: a.status
        },
        geometry: {
          type: "Polygon",
          coordinates: [area.coordinates.map(c => [c.lng, c.lat])]
        }
      })))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wams_active_alerts_${Date.now()}.geojson`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & GIS Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            محرر ومستكشف الخرائط الجغرافية (GIS Map Studio)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            خرائط جغرافية حقيقية (Carto Dark · OpenStreetMap · Satellite) مع رسم مضلعات التحذيرات ودعم كامل لبرنامج QGIS وقاعدة PostGIS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportGeoJson}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>تصدير GeoJSON لـ QGIS</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Main 2-Column GIS Layout: Map Canvas (Left 9 cols) + Alert Inspector Drawer (Right 3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-9 h-[620px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <GISMapCanvas
            alerts={alerts}
            selectedAlertId={selectedAlert?.id}
            onSelectAlert={onSelectAlert}
            isEditable={true}
            onPolygonCreated={handlePolygonCreated}
          />
        </div>

        {/* Right Drawer: Selected Alert Details or GIS Layers */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>مفتش بيانات المنطقة الجغرافية</span>
              </h3>
              <span className="text-[11px] text-slate-400">انقر على أي مضلع في الخريطة لمعاينته</span>
            </div>

            {selectedAlert ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">المعرف الرسمي</span>
                  <span className="font-mono text-sky-400 font-bold">{selectedAlert.code}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">عنوان التحذير</span>
                  <span className="font-bold text-white block mt-0.5">{selectedAlert.shortHeadlineAr}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">مستوى الخطورة</span>
                    <span className="font-bold capitalize text-amber-400">{selectedAlert.severity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">الحالة</span>
                    <span className="font-mono text-emerald-400">{selectedAlert.status}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">المناطق المشمولة</span>
                  <div className="mt-1 space-y-1">
                    {selectedAlert.areas.map(a => (
                      <div key={a.id} className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[11px]">
                        <span className="font-medium text-slate-200 block">{a.nameAr}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {a.coordinates.length} نقاط مضلع مغلقة (WGS84)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">فترة التأثير</span>
                  <span className="text-[11px] text-slate-300 font-mono tabular-nums block mt-0.5">
                    حتى: {selectedAlert.expiresAt.replace('T', ' ').replace('Z', ' UTC')}
                  </span>
                </div>

                <div className="p-2 bg-blue-950/20 border border-blue-900/40 rounded text-[11px] text-blue-200 leading-relaxed">
                  {selectedAlert.safetyInstructionsAr}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <span className="block font-medium text-slate-300">لم يتم اختيار منطقة</span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  حدد مضلعاً من الخريطة أو استخدم أداة "رسم مضلع جديد" بالأعلى
                </span>
              </div>
            )}
          </div>

          {/* GIS Spatial Constraints Box */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
            <span className="block text-slate-400 font-semibold">ضوابط السلامة المكانية (PostGIS):</span>
            <span className="block">· التحقق الطوبولوجي عبر <code className="text-sky-400">ST_IsValid(geom)</code></span>
            <span className="block">· منع تقاطع المضلع مع نفسه (Self-intersection)</span>
            <span className="block">· إغلاق النقطة الأخيرة تلقائياً مع النقطة الأولى</span>
          </div>
        </div>
      </div>
    </div>
  );
};
