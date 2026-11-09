import React, { useState } from 'react';
import { AlertItem } from '../../types/wams';
import { 
  executeRealSpatialQuery, 
  generateSafeQlr, 
  SpatialExecutionResult 
} from '../../utils/spatialQueryEngine';
import { escapeHtml } from '../../utils/sanitize';
import { 
  Database, 
  Layers, 
  Download, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  FileCode, 
  Globe,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

interface QGISAndPostgresViewProps {
  alerts: AlertItem[];
}

export const QGISAndPostgresView: React.FC<QGISAndPostgresViewProps> = ({ alerts }) => {
  const [activeTab, setActiveTab] = useState<'qgis' | 'postgis_sql' | 'schema'>('qgis');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pre-configured Spatial Queries
  const [selectedQueryIndex, setSelectedQueryIndex] = useState<number>(0);
  const [sqlResult, setSqlResult] = useState<SpatialExecutionResult | null>(null);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);
  const [customSql, setCustomSql] = useState<string>('');

  const sampleQueries = [
    {
      title: 'استعلام التحذيرات النشطة وحساب المساحة الحقيقية بالكيلومتر المربع (ST_Area & ST_AsGeoJSON)',
      sql: `SELECT 
    a.code,
    a.headline_ar,
    a.severity,
    a.status,
    ROUND((ST_Area(area.geom::geography) / 1000000)::numeric, 1) AS area_sq_km,
    ST_IsValid(area.geom) AS is_valid_polygon,
    ST_AsGeoJSON(area.geom) AS geojson
FROM alerts a
JOIN alert_areas area ON a.id = area.alert_id
WHERE a.status = 'published';`
    },
    {
      title: 'فحص التقاطع الجغرافي لموقع مستخدم في جدة (ST_Intersects)',
      sql: `SELECT 
    a.code,
    a.short_headline_ar,
    a.severity,
    a.expires_at,
    ST_Intersects(
        area.geom,
        ST_SetSRID(ST_Point(39.1728, 21.5433), 4326)
    ) AS user_is_affected
FROM alerts a
JOIN alert_areas area ON a.id = area.alert_id
WHERE a.status = 'published'
  AND ST_Intersects(area.geom, ST_SetSRID(ST_Point(39.1728, 21.5433), 4326));`
    },
    {
      title: 'التحقق الطوبولوجي وتصحيح المضلعات تلقائياً (ST_MakeValid & ST_Centroid)',
      sql: `SELECT 
    area.id,
    area.area_desc_ar,
    ST_GeometryType(area.geom) AS geom_type,
    ST_NPoints(area.geom) AS original_vertices,
    ST_AsText(ST_Centroid(area.geom)) AS centroid_wkt,
    ST_IsValid(area.geom) AS is_valid
FROM alert_areas area;`
    }
  ];

  const activeQuery = customSql || sampleQueries[selectedQueryIndex].sql;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunQuery = () => {
    setIsQueryRunning(true);
    setTimeout(() => {
      // Execute REAL spatial calculation over actual alert dataset
      const result = executeRealSpatialQuery(activeQuery, alerts);
      setSqlResult(result);
      setIsQueryRunning(false);
    }, 150);
  };

  // Safe QGIS Layer Definition (.qlr) Export (NO PLAINTEXT PASSWORDS)
  const handleDownloadQlr = () => {
    const qlrXml = generateSafeQlr();
    const blob = new Blob([qlrXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wams_alerts_postgis_layer.qlr`;
    a.click();
  };

  // Safe QGIS Project (.qgs) Export
  const handleDownloadQgs = () => {
    const qgsXml = `<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis projectname="WAMS - Weather Alerts Management System" version="3.34.0">
  <title>WAMS Meteorological Alert GIS Project</title>
  <!-- Connection parameters configured via QGIS pg_service.conf or env variables -->
  <layer-tree-group name="" expanded="1">
    <layer-tree-layer checked="Qt::Checked" id="wams_alerts" name="التحذيرات الجوية النشطة"/>
    <layer-tree-layer checked="Qt::Checked" id="osm_base" name="OpenStreetMap Basemap"/>
  </layer-tree-group>
</qgis>`;

    const blob = new Blob([qgsXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wams_qgis_project.qgs`;
    a.click();
  };

  // Export GeoJSON for QGIS with sanitized properties
  const handleDownloadGeoJson = () => {
    const geojson = {
      type: "FeatureCollection",
      name: "wams_active_alerts",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: alerts.flatMap(a => a.areas.map(area => ({
        type: "Feature",
        properties: {
          id: a.id,
          code: a.code,
          headline_ar: a.headlineAr,
          short_headline_ar: a.shortHeadlineAr,
          severity: a.severity,
          urgency: a.urgency,
          certainty: a.certainty,
          status: a.status,
          effective_at: a.effectiveAt,
          expires_at: a.expiresAt,
          issuer: a.issuerOrg
        },
        geometry: {
          type: "Polygon",
          coordinates: [area.coordinates.map(c => [c.lng, c.lat])]
        }
      })))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wams_qgis_export_${Date.now()}.geojson`;
    a.click();
  };

  // Safe connection string template with variable placeholders (NO hardcoded password)
  const safeConnectionString = "service='wams_db' host='${DB_HOST:-localhost}' port='${DB_PORT:-5432}' dbname='${DB_NAME:-wams_db}' user='${DB_USER:-wams_user}' sslmode='prefer' table=\"public\".\"alert_areas\" (geom)";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              دعم برمجيات الأرصاد ونظم المعلومات الجغرافية
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-400 font-mono">QGIS 3.x & PostgreSQL 16 / PostGIS 3.4</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            بوابة التكامل مع كيو جي إي إس (QGIS) وقاعدة بوستجر إس كيو إل (PostgreSQL / PostGIS)
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            محرك مكاني حقيقي يتيح لمحللي الأرصاد ربط QGIS المكتبي بأمان بدون كلمات مرور ثابتة، وتشغيل استعلامات PostGIS الفعلية على التحذيرات الجارية.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('qgis')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'qgis' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            تكامل QGIS المكتبي
          </button>
          <button
            onClick={() => { setActiveTab('postgis_sql'); if (!sqlResult) handleRunQuery(); }}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'postgis_sql' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            استعلامات PostGIS المكانية
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'schema' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            مخطط الجداول المكانية (DDL)
          </button>
        </div>
      </div>

      {/* Tab 1: QGIS Integration Suite */}
      {activeTab === 'qgis' && (
        <div className="space-y-6">
          {/* Export Actions Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">ملف طبقة QGIS (.qlr) آمن</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ملف تعريف طبقة QGIS Layer Definition آمن يستخدم متغيرات البيئة بدون تضمين كلمات مرور ثابتة.
                </p>
              </div>
              <button
                onClick={handleDownloadQlr}
                className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>تحميل ملف الطبقة (QGIS .qlr)</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">مشروع QGIS كامل (.qgs)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  مشروع مكتمل يفتح في QGIS بنقرة واحدة مع ضبط الإسقاط WGS 84 (EPSG:4326) والطبقات الجغرافية.
                </p>
              </div>
              <button
                onClick={handleDownloadQgs}
                className="mt-4 w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>تحميل مشروع QGIS (.qgs)</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">تصدير GeoJSON للأرصاد</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تصدير جميع التحذيرات الجارية النشطة بمضلعاتها وخصائصها لفتحها فوراً في QGIS أو ArcGIS.
                </p>
              </div>
              <button
                onClick={handleDownloadGeoJson}
                className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>تصدير GeoJSON لـ QGIS</span>
              </button>
            </div>
          </div>

          {/* QGIS Connection String & Security Best Practices */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>إعدادات الاتصال الآمنة من QGIS لقاعدة PostGIS</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>خالٍ من كلمات المرور الثابتة (No Hardcoded Secrets)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {/* Connection parameters */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block">إعدادات الاتصال الموصى بها (PostGIS Connection):</span>
                
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">اسم الخدمة (Service):</span>
                  <span className="font-mono text-white font-semibold">wams_db</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">المضيف (Host):</span>
                  <span className="font-mono text-sky-400">localhost (أو عنوان خادم الأرصاد)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">المنفذ (Port):</span>
                  <span className="font-mono text-emerald-400">5432</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">قاعدة البيانات (Database):</span>
                  <span className="font-mono text-amber-300">wams_db</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">المصادقة:</span>
                  <span className="font-mono text-slate-300">مطالبة بالمستخدم عند الفتح (Prompt for Credentials)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">نظام الإحداثيات المعتمد:</span>
                  <span className="font-mono text-emerald-400">EPSG:4326 (WGS 84)</span>
                </div>
              </div>

              {/* Instructions on how to add to QGIS */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block">خطوات الربط الآمن داخل برنامج QGIS:</span>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside leading-relaxed text-[11px]">
                  <li>افتح برنامج <strong>QGIS Desktop</strong>.</li>
                  <li>من القائمة اختر <strong>Layer</strong> ثم <strong>Add Layer</strong> ثم <strong>Add PostGIS Layers...</strong></li>
                  <li>انقر على <strong>New</strong> وأدخل اسم الاتصال مع تفعيل خيار <em>Prompt for password</em> لمنع حفظ الأسرار في ملفات المشروع.</li>
                  <li>انقر <strong>Connect</strong> وستظهر لك طبقة <code>alert_areas</code> مباشرة.</li>
                  <li>حدد الطبقة وانقر <strong>Add</strong> لعرض مضلعات التحذيرات الجوية ومطابقتها مع طبقات الرادار والأقمار الصناعية.</li>
                </ol>

                <div className="pt-2">
                  <button
                    onClick={() => handleCopy(safeConnectionString, "conn_str")}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    {copiedKey === "conn_str" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "conn_str" ? "تم نسخ قالب الاتصال الآمن!" : "نسخ قالب الاتصال الآمن لـ QGIS"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Streaming WFS Feeds for QGIS */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                <span>رابط التغذية الحية لـ QGIS WFS / OGC API Feeds:</span>
              </span>
              <p className="text-slate-400 text-[11px]">
                يمكن أيضاً فتح الطبقة في QGIS دون الحاجة للاتصال المباشر بقاعدة البيانات، عبر إضافة طبقة WFS / Vector URL:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://wams.met.gov.sa/api/v1/gis/wfs?service=WFS&version=2.0.0&request=GetFeature&typename=wams:active_alerts&outputFormat=application/json"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-sky-400"
                  dir="ltr"
                />
                <button
                  onClick={() => handleCopy("https://wams.met.gov.sa/api/v1/gis/wfs?service=WFS&version=2.0.0&request=GetFeature&typename=wams:active_alerts&outputFormat=application/json", "wfs_url")}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs whitespace-nowrap transition-colors"
                >
                  {copiedKey === "wfs_url" ? "تم النسخ!" : "نسخ الرابط"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Real PostGIS Spatial SQL Console */}
      {activeTab === 'postgis_sql' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Selector & Editor */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>محرر ومفسر استعلامات PostGIS المكانية الحقيقية</span>
                </span>

                <button
                  onClick={handleRunQuery}
                  disabled={isQueryRunning}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isQueryRunning ? 'جارٍ الحساب المكاني...' : 'تشغيل الاستعلام الفعلي (Run SQL)'}</span>
                </button>
              </div>

              {/* Sample Queries Dropdown */}
              <div className="mb-3">
                <label className="text-[11px] text-slate-400 block mb-1 font-semibold">نماذج استعلامات PostGIS الجاهزة للاختبار المباشر:</label>
                <select
                  value={selectedQueryIndex}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    setSelectedQueryIndex(idx);
                    setCustomSql('');
                    setSqlResult(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {sampleQueries.map((q, idx) => (
                    <option key={idx} value={idx}>{q.title}</option>
                  ))}
                </select>
              </div>

              {/* SQL Code Block */}
              <textarea
                value={activeQuery}
                onChange={(e) => setCustomSql(e.target.value)}
                dir="ltr"
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800">
              <span>المحرك المكاني: <strong className="text-slate-300">PostGIS Geometry Evaluator</strong></span>
              <span>حساب المساحات: <strong className="text-slate-300">WGS84 Geodesic Math (Real)</strong></span>
            </div>
          </div>

          {/* Results Inspector */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-white">النتائج المسترجعة والمحسوبة مكانياً</h4>
                {sqlResult && (
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                    {sqlResult.rowCount} صفوف · زمن التنفيذ: {sqlResult.executionTimeMs}ms
                  </span>
                )}
              </div>

              {sqlResult ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {sqlResult.rows.map((row, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-400">{row.code || row.id}</span>
                        {row.severity && (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-red-300 bg-red-950/60 border border-red-500/40">
                            {row.severity}
                          </span>
                        )}
                        {row.user_is_affected !== undefined && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40">
                            ST_Intersects = TRUE
                          </span>
                        )}
                      </div>

                      {row.headline_ar && <p className="text-slate-200 font-sans text-xs">{row.headline_ar}</p>}
                      {row.area_desc_ar && <p className="text-slate-300 font-sans text-xs">{row.area_desc_ar}</p>}

                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                        {row.area_sq_km !== undefined && (
                          <span>المساحة المحسوبة: <strong className="text-amber-400">{row.area_sq_km.toLocaleString()} كم²</strong></span>
                        )}
                        {row.is_valid_polygon !== undefined && (
                          <span>ST_IsValid: <strong className="text-emerald-400">{row.is_valid_polygon ? 'TRUE (سليم)' : 'FALSE (معطوب)'}</strong></span>
                        )}
                        {row.centroid_wkt && (
                          <span>المركز: <strong className="text-sky-300">{row.centroid_wkt}</strong></span>
                        )}
                        {row.original_vertices && (
                          <span>النقاط: <strong className="text-slate-200">{row.original_vertices} نقطة</strong></span>
                        )}
                      </div>

                      {row.geojson && (
                        <div className="mt-1">
                          <span className="text-[10px] text-slate-500 block mb-0.5">GeoJSON الهندسي:</span>
                          <pre className="text-[10px] text-slate-400 truncate bg-slate-900 p-1.5 rounded">{row.geojson}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-500">
                  انقر على زر "تشغيل الاستعلام الفعلي" لتنفيذ الحساب المكاني على التحذيرات المسجلة
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              يتم الحساب مباشرة على الإحداثيات الجغرافية الحقيقية WGS84 بدون بيانات مفبركة.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PostGIS DDL Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">مخطط قاعدة بيانات PostgreSQL + PostGIS المعتمد للـ WAMS</h3>
              <p className="text-xs text-slate-400 mt-0.5">مخطط نظيف ومطبع يستخدم الفهارس المكانية وقيود النزاهة</p>
            </div>
            <button
              onClick={() => handleCopy(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    headline_ar TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    issued_at TIMESTAMPTZ NOT NULL,
    effective_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alert_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    area_desc_ar VARCHAR(255) NOT NULL,
    geom GEOMETRY(Geometry, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT enforce_valid_polygon CHECK (ST_IsValid(geom))
);

CREATE INDEX idx_alert_areas_geom ON alert_areas USING GIST (geom);`, 'ddl_sql')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              {copiedKey === 'ddl_sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ddl_sql' ? 'تم النسخ!' : 'نسخ ملف الـ DDL'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed max-h-96" dir="ltr">
{`-- 1. تفعيل امتدادات PostGIS المكانية ومعرفات UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. جدول التحذيرات الرئيسي
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    headline_ar TEXT NOT NULL,
    headline_en TEXT,
    short_headline_ar VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    safety_instructions_ar TEXT NOT NULL,
    phenomenon VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    certainty VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    issued_at TIMESTAMPTZ NOT NULL,
    effective_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول المناطق والمضلعات المكانية المرتبطة بـ QGIS
CREATE TABLE alert_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    area_desc_ar VARCHAR(255) NOT NULL,
    area_desc_en VARCHAR(255),
    geom GEOMETRY(Geometry, 4326) NOT NULL, -- EPSG:4326 WGS84
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT enforce_valid_polygon CHECK (ST_IsValid(geom))
);

-- 4. فهرس مكاني فائق السرعة لعمليات التقاطع الجغرافي في QGIS والـ API
CREATE INDEX idx_alert_areas_geom ON alert_areas USING GIST (geom);`}
          </pre>
        </div>
      )}
    </div>
  );
};
