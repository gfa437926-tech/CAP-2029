import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AlertItem, GeoArea } from '../types/wams';
import { 
  Layers, 
  MapPin, 
  ShieldAlert, 
  CloudRain, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  MousePointer, 
  Trash2,
  Eye,
  CheckCircle2,
  Crosshair
} from 'lucide-react';

interface GISMapCanvasProps {
  alerts: AlertItem[];
  selectedAlertId?: string;
  onSelectAlert?: (alert: AlertItem) => void;
  isEditable?: boolean;
  onPolygonCreated?: (area: GeoArea) => void;
}

export const GISMapCanvas: React.FC<GISMapCanvasProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  isEditable = false,
  onPolygonCreated
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.FeatureGroup | null>(null);
  const drawingLayerRef = useRef<L.FeatureGroup | null>(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState<'osm' | 'topo' | 'hot' | 'dark'>('osm');
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [showCities, setShowCities] = useState<boolean>(true);
  const [mouseCoord, setMouseCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawnPoints, setDrawnPoints] = useState<L.LatLng[]>([]);

  // Severity color lookup
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return '#ef4444';
      case 'severe': return '#f97316';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#10b981';
      case 'informational':
      default: return '#3b82f6';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center over Saudi Arabia / Arabian Peninsula [24.0, 45.0]
    const map = L.map(mapContainerRef.current, {
      center: [24.0, 45.0],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Create 100% Free Open-Source Tile Layers (NO API KEYS, NO TOKENS, NO CREDIT CARD)
    const baseLayers = {
      osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }),
      topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        subdomains: 'abc',
        attribution: '© OpenTopoMap'
      }),
      hot: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '© OpenStreetMap France'
      }),
      dark: L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap © CARTO'
      })
    };

    // Default to OpenStreetMap (100% free open source)
    baseLayers.osm.addTo(map);

    // Feature group for alert polygons
    const layersGroup = L.featureGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    // Feature group for drawing
    const drawingGroup = L.featureGroup().addTo(map);
    drawingLayerRef.current = drawingGroup;

    // Track mouse coordinate
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setMouseCoord({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Map click for drawing
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (drawingLayerRef.current && (window as any).__WAMS_DRAWING_MODE__) {
        setDrawnPoints(prev => {
          const next = [...prev, e.latlng];
          // Update visual preview of points
          drawingLayerRef.current?.clearLayers();
          
          if (next.length > 1) {
            L.polyline(next, { color: '#38bdf8', weight: 3, dashArray: '6, 6' }).addTo(drawingLayerRef.current!);
          }
          next.forEach((pt, i) => {
            L.circleMarker(pt, {
              radius: i === 0 ? 7 : 5,
              color: '#ffffff',
              fillColor: i === 0 ? '#10b981' : '#38bdf8',
              fillOpacity: 1,
              weight: 2
            }).addTo(drawingLayerRef.current!);
          });

          return next;
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Base Layer when activeBaseLayer changes (100% Free Open Source Tiles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old base layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let newTileLayer: L.TileLayer;
    if (activeBaseLayer === 'topo') {
      newTileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        subdomains: 'abc',
        attribution: '© OpenTopoMap'
      });
    } else if (activeBaseLayer === 'hot') {
      newTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '© OpenStreetMap France'
      });
    } else if (activeBaseLayer === 'dark') {
      newTileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap © CARTO'
      });
    } else {
      // Standard 100% Free OpenStreetMap
      newTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      });
    }

    newTileLayer.addTo(map);
    newTileLayer.bringToBack();
  }, [activeBaseLayer]);

  // Sync Alerts Polygons on Map
  useEffect(() => {
    const layersGroup = layersGroupRef.current;
    if (!layersGroup) return;

    layersGroup.clearLayers();

    alerts.forEach(alert => {
      const isSelected = alert.id === selectedAlertId;
      const strokeColor = getSeverityColor(alert.severity);

      alert.areas.forEach(area => {
        if (area.coordinates && area.coordinates.length > 0) {
          const latLngs = area.coordinates.map(c => [c.lat, c.lng] as [number, number]);

          const polygon = L.polygon(latLngs, {
            color: strokeColor,
            weight: isSelected ? 3.5 : 2,
            fillColor: strokeColor,
            fillOpacity: isSelected ? 0.55 : 0.35,
            dashArray: alert.status === 'cancelled' ? '6, 6' : undefined
          });

          // Arabic Tooltip & Popup
          polygon.bindTooltip(
            `<div style="font-family: 'IBM Plex Sans Arabic', sans-serif; direction: rtl; text-align: right;">
              <strong>${alert.shortHeadlineAr}</strong><br/>
              <span style="font-size: 11px; color: ${strokeColor}; font-weight: bold;">خطورة: ${alert.severity}</span>
            </div>`,
            { direction: 'top', sticky: true }
          );

          polygon.bindPopup(
            `<div style="font-family: 'IBM Plex Sans Arabic', sans-serif; direction: rtl; text-align: right; min-width: 200px;">
              <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold;">${alert.headlineAr}</h4>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">${alert.descriptionAr}</p>
              <div style="font-size: 11px; margin-bottom: 4px;"><strong>تعليمات السلامة:</strong> ${alert.safetyInstructionsAr}</div>
              <div style="font-size: 10px; color: #64748b;">المعرف: <code>${alert.code}</code> | الإصدار: v${alert.currentVersion}</div>
            </div>`
          );

          polygon.on('click', () => {
            if (onSelectAlert) onSelectAlert(alert);
          });

          polygon.addTo(layersGroup);
        }
      });
    });

    // Simulated Radar Layer
    if (showRadar) {
      // Convective storm cluster near Western Coast (Jeddah/Makkah)
      const radarCircle = L.circle([21.6, 39.4], {
        radius: 85000,
        color: '#ef4444',
        weight: 1.5,
        fillColor: '#ef4444',
        fillOpacity: 0.25
      }).bindTooltip('رادار الأمطار: خلايا ركامية رعدية نشطة (dBZ > 55)');
      radarCircle.addTo(layersGroup);

      const radarCore = L.circle([21.6, 39.4], {
        radius: 40000,
        color: '#b91c1c',
        weight: 2,
        fillColor: '#dc2626',
        fillOpacity: 0.45
      });
      radarCore.addTo(layersGroup);
    }

    // City Markers
    if (showCities) {
      const cities = [
        { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
        { name: 'جدة', lat: 21.5433, lng: 39.1728 },
        { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
        { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
        { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
        { name: 'أبها', lat: 18.2164, lng: 42.5053 },
        { name: 'تبوك', lat: 28.3835, lng: 36.5662 }
      ];

      cities.forEach(c => {
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: 4,
          color: '#ffffff',
          fillColor: '#38bdf8',
          fillOpacity: 0.9,
          weight: 1.5
        }).bindTooltip(c.name, { permanent: true, direction: 'right', className: 'wams-city-label' });
        marker.addTo(layersGroup);
      });
    }
  }, [alerts, selectedAlertId, showRadar, showCities]);

  // Handle Drawing Mode
  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDrawnPoints([]);
    (window as any).__WAMS_DRAWING_MODE__ = true;
  };

  const handleFinishDrawing = () => {
    (window as any).__WAMS_DRAWING_MODE__ = false;
    setIsDrawing(false);

    if (drawnPoints.length >= 3 && onPolygonCreated) {
      const coords = drawnPoints.map(p => ({ lat: p.lat, lng: p.lng }));
      const newArea: GeoArea = {
        id: `area-${Date.now()}`,
        nameAr: 'مضلع تحذير جديد مرسوم في الـ GIS',
        nameEn: 'Newly Drawn GIS Warning Polygon',
        type: 'polygon',
        coordinates: coords
      };
      onPolygonCreated(newArea);
    }
    drawingLayerRef.current?.clearLayers();
    setDrawnPoints([]);
  };

  const handleCancelDrawing = () => {
    (window as any).__WAMS_DRAWING_MODE__ = false;
    setIsDrawing(false);
    drawingLayerRef.current?.clearLayers();
    setDrawnPoints([]);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Map Layer Selector & Drawing Toolbar */}
      <div className="absolute top-3 right-3 left-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Base Layer Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-xl text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 font-bold text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>خرائط مجانية 100% (بدون API Key)</span>
          </div>

          <button
            onClick={() => setActiveBaseLayer('osm')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${activeBaseLayer === 'osm' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            OpenStreetMap (الافتراضية)
          </button>
          <button
            onClick={() => setActiveBaseLayer('topo')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${activeBaseLayer === 'topo' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            تضاريس وجبال (OpenTopoMap)
          </button>
          <button
            onClick={() => setActiveBaseLayer('hot')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${activeBaseLayer === 'hot' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            خريطة التباين (OSM HOT)
          </button>
          <button
            onClick={() => setActiveBaseLayer('dark')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${activeBaseLayer === 'dark' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            داكنة أرصادية (Dark)
          </button>
        </div>

        {/* Layer Toggles & Drawing */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-xl text-xs">
          <button
            onClick={() => setShowRadar(r => !r)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${showRadar ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <CloudRain className="w-3.5 h-3.5 text-red-400" />
            <span>رادار الأمطار</span>
          </button>
          <button
            onClick={() => setShowCities(c => !c)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${showCities ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>المدن</span>
          </button>

          {isEditable && (
            <div className="border-r border-slate-700 pr-1.5 mr-1.5 flex items-center gap-1.5">
              {!isDrawing ? (
                <button
                  onClick={handleStartDrawing}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-colors flex items-center gap-1"
                >
                  <MousePointer className="w-3.5 h-3.5" />
                  <span>رسم مضلع جديد (Polygon)</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs px-1 font-mono">نقاط: {drawnPoints.length}</span>
                  <button
                    onClick={handleFinishDrawing}
                    disabled={drawnPoints.length < 3}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded font-bold transition-colors"
                  >
                    حفظ وإغلاق
                  </button>
                  <button
                    onClick={handleCancelDrawing}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Bottom Floating Navigation Controls & Coordinates */}
      <div className="absolute bottom-3 right-3 left-3 z-[1000] flex items-center justify-between pointer-events-none">
        {/* Coordinates Inspector */}
        <div className="px-3 py-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto text-xs font-mono text-slate-300 flex items-center gap-3 shadow-lg">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>الإحداثيات:</span>
          {mouseCoord ? (
            <span className="text-sky-300 font-bold tabular-nums">
              {mouseCoord.lat.toFixed(4)}°N · {mouseCoord.lng.toFixed(4)}°E
            </span>
          ) : (
            <span className="text-slate-500">حرك المؤشر فوق الخريطة</span>
          )}
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">WGS84 / EPSG:4326</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg pointer-events-auto shadow-xl">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.setView([24.0, 45.0], 6)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="إعادة ضبط الرؤية للجزيرة العربية"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
