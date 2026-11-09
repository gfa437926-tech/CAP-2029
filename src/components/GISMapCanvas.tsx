import React, { useState, useRef, useEffect } from 'react';
import { AlertItem, GeoArea } from '../types/wams';
import { Layers, Maximize2, ZoomIn, ZoomOut, Compass, Eye, ShieldAlert, Wind, CloudRain, MapPin, MousePointer, Slash } from 'lucide-react';

interface GISMapCanvasProps {
  alerts: AlertItem[];
  selectedAlertId?: string;
  onSelectAlert?: (alert: AlertItem) => void;
  isEditable?: boolean;
  onPolygonCreated?: (area: GeoArea) => void;
  activeLayers?: {
    alerts: boolean;
    radar: boolean;
    satellite: boolean;
    wind: boolean;
    adminBoundaries: boolean;
  };
}

export const GISMapCanvas: React.FC<GISMapCanvasProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  isEditable = false,
  onPolygonCreated
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Drawing mode for GIS polygon editing
  const [drawMode, setDrawMode] = useState<'none' | 'polygon' | 'circle'>('none');
  const [drawnPoints, setDrawnPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [mouseCoord, setMouseCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    alerts: true,
    radar: true,
    satellite: false,
    wind: false,
    adminBoundaries: true
  });

  // Map geographic bounds roughly covering Arabian Peninsula / Middle East: Lat 15 to 33, Lng 34 to 56
  const minLat = 15.0;
  const maxLat = 33.0;
  const minLng = 34.0;
  const maxLng = 56.0;

  // Coordinate projection math
  const project = (lat: number, lng: number, width: number, height: number) => {
    const xRatio = (lng - minLng) / (maxLng - minLng);
    const yRatio = 1 - (lat - minLat) / (maxLat - minLat); // Invert for canvas Y
    const x = (xRatio * width * zoom) + pan.x + (width * (1 - zoom)) / 2;
    const y = (yRatio * height * zoom) + pan.y + (height * (1 - zoom)) / 2;
    return { x, y };
  };

  const unproject = (screenX: number, screenY: number, width: number, height: number) => {
    const adjustedX = (screenX - pan.x - (width * (1 - zoom)) / 2) / (width * zoom);
    const adjustedY = (screenY - pan.y - (height * (1 - zoom)) / 2) / (height * zoom);
    const lng = minLng + adjustedX * (maxLng - minLng);
    const lat = maxLat - adjustedY * (maxLat - minLat);
    return { lat, lng };
  };

  // Severity color lookup
  const getSeverityColor = (severity: string, alpha = 0.4) => {
    switch (severity) {
      case 'extreme': return `rgba(239, 68, 68, ${alpha})`;
      case 'severe': return `rgba(249, 115, 22, ${alpha})`;
      case 'moderate': return `rgba(245, 158, 11, ${alpha})`;
      case 'minor': return `rgba(16, 185, 129, ${alpha})`;
      case 'informational':
      default: return `rgba(59, 130, 246, ${alpha})`;
    }
  };

  const getSeverityStroke = (severity: string) => {
    switch (severity) {
      case 'extreme': return '#ef4444';
      case 'severe': return '#f97316';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#10b981';
      case 'informational':
      default: return '#3b82f6';
    }
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background (Dark ocean)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Draw Coordinate Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let lng = 35; lng <= 55; lng += 5) {
      const p1 = project(minLat, lng, width, height);
      const p2 = project(maxLat, lng, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(`${lng}°E`, p1.x + 4, height - 12);
    }
    for (let lat = 15; lat <= 30; lat += 5) {
      const p1 = project(lat, minLng, width, height);
      const p2 = project(lat, maxLng, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(`${lat}°N`, 8, p1.y - 4);
    }

    // Draw Land Mass (Arabian Peninsula outline)
    const landCoords = [
      { lat: 31.5, lng: 34.8 },
      { lat: 29.5, lng: 35.0 },
      { lat: 28.0, lng: 34.6 },
      { lat: 26.0, lng: 36.6 },
      { lat: 22.0, lng: 39.0 },
      { lat: 19.5, lng: 41.5 },
      { lat: 16.5, lng: 42.8 },
      { lat: 12.6, lng: 43.5 },
      { lat: 12.8, lng: 45.0 },
      { lat: 14.5, lng: 49.5 },
      { lat: 16.5, lng: 53.0 },
      { lat: 18.0, lng: 55.5 },
      { lat: 22.5, lng: 59.8 },
      { lat: 24.5, lng: 57.0 },
      { lat: 26.0, lng: 56.4 },
      { lat: 25.5, lng: 55.0 },
      { lat: 24.0, lng: 52.5 },
      { lat: 26.0, lng: 50.5 },
      { lat: 28.0, lng: 49.0 },
      { lat: 30.0, lng: 48.0 },
      { lat: 31.0, lng: 47.0 },
      { lat: 32.5, lng: 44.0 },
      { lat: 32.0, lng: 38.0 },
      { lat: 31.5, lng: 35.5 }
    ];

    ctx.beginPath();
    landCoords.forEach((pt, i) => {
      const p = project(pt.lat, pt.lng, width, height);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Red Sea and Gulf Water labels
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.font = '12px "IBM Plex Sans Arabic", sans-serif';
    const redSeaPos = project(21.0, 38.0, width, height);
    ctx.fillText('البحر الأحمر', redSeaPos.x, redSeaPos.y);

    const gulfPos = project(26.5, 52.0, width, height);
    ctx.fillText('الخليج العربي', gulfPos.x, gulfPos.y);

    // Administrative boundaries (provinces / major cities)
    if (layers.adminBoundaries) {
      const cities = [
        { name: 'الرياض', lat: 24.71, lng: 46.67 },
        { name: 'جدة', lat: 21.54, lng: 39.17 },
        { name: 'مكة المكرمة', lat: 21.38, lng: 39.85 },
        { name: 'المدينة المنورة', lat: 24.52, lng: 39.56 },
        { name: 'الدمام', lat: 26.42, lng: 50.08 },
        { name: 'أبها', lat: 18.21, lng: 42.50 },
        { name: 'تبوك', lat: 28.38, lng: 36.57 },
        { name: 'بريدة', lat: 26.35, lng: 43.98 }
      ];

      cities.forEach(city => {
        const cp = project(city.lat, city.lng, width, height);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
        ctx.font = '11px "IBM Plex Sans Arabic", sans-serif';
        ctx.fillText(city.name, cp.x + 6, cp.y + 3);
      });
    }

    // Simulated Radar Echoes (Convective rain cells over Western Coast)
    if (layers.radar) {
      const radarCenter = project(21.6, 39.4, width, height);
      const radGrad = ctx.createRadialGradient(radarCenter.x, radarCenter.y, 5, radarCenter.x, radarCenter.y, 75 * zoom);
      radGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)'); // Extreme red dBZ
      radGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)'); // Orange
      radGrad.addColorStop(0.6, 'rgba(234, 179, 8, 0.35)'); // Yellow
      radGrad.addColorStop(0.85, 'rgba(34, 197, 94, 0.2)'); // Green
      radGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(radarCenter.x, radarCenter.y, 75 * zoom, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Alerts polygons
    if (layers.alerts) {
      alerts.forEach(alert => {
        const isSelected = alert.id === selectedAlertId;
        const color = getSeverityColor(alert.severity, isSelected ? 0.6 : 0.35);
        const strokeColor = getSeverityStroke(alert.severity);

        alert.areas.forEach(area => {
          if (area.coordinates && area.coordinates.length > 0) {
            ctx.beginPath();
            area.coordinates.forEach((pt, idx) => {
              const p = project(pt.lat, pt.lng, width, height);
              if (idx === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isSelected ? 3 : 1.8;
            if (alert.status === 'cancelled') {
              ctx.setLineDash([4, 4]);
            } else {
              ctx.setLineDash([]);
            }
            ctx.stroke();

            // Draw label at centroid
            const firstPt = area.coordinates[0];
            const labelPos = project(firstPt.lat, firstPt.lng, width, height);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "IBM Plex Sans Arabic", sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(alert.shortHeadlineAr, labelPos.x + 8, labelPos.y);
            ctx.shadowBlur = 0;
          }
        });
      });
    }

    // Draw user active drawing points
    if (drawnPoints.length > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      drawnPoints.forEach((pt, i) => {
        const p = project(pt.lat, pt.lng, width, height);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw vertex handles
      drawnPoints.forEach((pt, i) => {
        const p = project(pt.lat, pt.lng, width, height);
        ctx.fillStyle = i === 0 ? '#10b981' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  }, [alerts, selectedAlertId, zoom, pan, layers, drawnPoints]);

  // Handle Canvas Mouse Events for Panning & Drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawMode !== 'none') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const coord = unproject(x, y, rect.width, rect.height);
      setDrawnPoints(prev => [...prev, coord]);
      return;
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = unproject(x, y, rect.width, rect.height);
    setMouseCoord(coord);

    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFinishPolygon = () => {
    if (drawnPoints.length >= 3 && onPolygonCreated) {
      const newArea: GeoArea = {
        id: `area-${Date.now()}`,
        nameAr: 'مضلع تحذير جديد مرسوم',
        nameEn: 'Newly Drawn Warning Polygon',
        type: 'polygon',
        coordinates: drawnPoints
      };
      onPolygonCreated(newArea);
    }
    setDrawMode('none');
    setDrawnPoints([]);
  };

  const handleClearDrawing = () => {
    setDrawnPoints([]);
    setDrawMode('none');
  };

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col select-none">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-lg text-xs">
          <button
            onClick={() => setLayers(l => ({ ...l, alerts: !l.alerts }))}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${layers.alerts ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>التحذيرات النشطة</span>
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, radar: !l.radar }))}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${layers.radar ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <CloudRain className="w-3.5 h-3.5 text-red-400" />
            <span>رادار الأمطار</span>
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, adminBoundaries: !l.adminBoundaries }))}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${layers.adminBoundaries ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>المدن والحدود</span>
          </button>
        </div>

        {/* GIS Editing Tools if enabled */}
        {isEditable ? (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-lg text-xs">
            {drawMode === 'none' ? (
              <button
                onClick={() => { setDrawMode('polygon'); setDrawnPoints([]); }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors flex items-center gap-1.5"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span>رسم مضلع جديد (Polygon)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-xs px-1">انقر على الخريطة لتحديد النقاط ({drawnPoints.length})</span>
                <button
                  onClick={handleFinishPolygon}
                  disabled={drawnPoints.length < 3}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded font-medium transition-colors"
                >
                  إغلاق وحفظ
                </button>
                <button
                  onClick={handleClearDrawing}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full flex-1 cursor-crosshair"
      />

      {/* Bottom Floating Navigation Controls & Coordinate Inspector */}
      <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Real-time Coordinate Display */}
        <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto text-xs font-mono text-slate-300 flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>الإحداثيات:</span>
          </div>
          {mouseCoord ? (
            <span className="text-sky-300 font-semibold tabular-nums">
              {mouseCoord.lat.toFixed(4)}°N · {mouseCoord.lng.toFixed(4)}°E
            </span>
          ) : (
            <span className="text-slate-500">حرك المؤشر فوق الخريطة</span>
          )}
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">التكبير: <span className="text-white font-semibold">{(zoom * 100).toFixed(0)}%</span></span>
        </div>

        {/* Zoom In/Out Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-lg">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.25, 3.0))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="تكبير الخريطة"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.25, 0.75))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="تصغير الخريطة"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1.2); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="إعادة ضبط الموضع"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
