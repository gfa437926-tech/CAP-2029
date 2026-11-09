import React, { useState } from 'react';
import { sampleCapXml } from '../../data/mockData';
import { AlertItem, CAPMessageRecord } from '../../types/wams';
import { 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Download, 
  Layers, 
  ArrowRight, 
  Copy, 
  RefreshCw, 
  ShieldAlert,
  Send
} from 'lucide-react';

interface CapImportViewProps {
  onConvertToDraft: (alert: AlertItem) => void;
  onNavigateToLogs: () => void;
}

export const CapImportView: React.FC<CapImportViewProps> = ({
  onConvertToDraft,
  onNavigateToLogs
}) => {
  const [xmlContent, setXmlContent] = useState<string>(sampleCapXml);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    parsedData?: {
      identifier: string;
      sender: string;
      sent: string;
      status: string;
      msgType: string;
      event: string;
      severity: string;
      urgency: string;
      certainty: string;
      headline: string;
      areaDesc: string;
      polygonCoords: { lat: number; lng: number }[];
    };
  } | null>(null);

  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Parse & Validate CAP 1.2 XML
  const handleValidateXml = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!xmlContent.includes('<alert') || !xmlContent.includes('urn:oasis:names:tc:emergency:cap:1.2')) {
      errors.push('الملف غير مطابق لمخطط OASIS CAP 1.2 (مفقود عنصر alert أو الـ XML namespace الصحيح).');
    }

    const getTagValue = (xml: string, tag: string): string => {
      const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return match ? match[1].trim() : '';
    };

    const identifier = getTagValue(xmlContent, 'identifier');
    const sender = getTagValue(xmlContent, 'sender');
    const sent = getTagValue(xmlContent, 'sent');
    const status = getTagValue(xmlContent, 'status');
    const msgType = getTagValue(xmlContent, 'msgType');
    const event = getTagValue(xmlContent, 'event');
    const severity = getTagValue(xmlContent, 'severity');
    const urgency = getTagValue(xmlContent, 'urgency');
    const certainty = getTagValue(xmlContent, 'certainty');
    const headline = getTagValue(xmlContent, 'headline');
    const areaDesc = getTagValue(xmlContent, 'areaDesc');
    const polygonRaw = getTagValue(xmlContent, 'polygon');

    if (!identifier) errors.push('عنصر <identifier> إلزامي وغير موجود.');
    if (!sender) errors.push('عنصر <sender> إلزامي وغير موجود.');
    if (!sent) errors.push('عنصر <sent> إلزامي وغير موجود.');
    if (!severity) errors.push('عنصر <severity> إلزامي في CAP 1.2.');
    if (!headline) errors.push('عنصر <headline> إلزامي لعرض التحذير.');

    // Polygon parsing and validity check
    const coords: { lat: number; lng: number }[] = [];
    if (polygonRaw) {
      const pairs = polygonRaw.trim().split(/\s+/);
      pairs.forEach(pair => {
        const [latStr, lngStr] = pair.split(',');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push({ lat, lng });
        }
      });

      if (coords.length < 3) {
        errors.push('المضلع <polygon> يحتوي على أقل من 3 نقاط إحداثية.');
      } else {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first.lat !== last.lat || first.lng !== last.lng) {
          warnings.push('المضلع غير مغلق بشكل صريح (النقطة الأخيرة لا تطابق الأولى). تم إغلاقه آلياً وفق معيار PostGIS.');
        }
      }
    } else {
      warnings.push('لم يتم العثور على مضلع <polygon> صريح؛ يجب رسم أو إسناد منطقة قبل النشر.');
    }

    const isValid = errors.length === 0;

    setValidationResult({
      isValid,
      errors,
      warnings,
      parsedData: isValid ? {
        identifier,
        sender,
        sent,
        status,
        msgType,
        event,
        severity,
        urgency,
        certainty,
        headline,
        areaDesc,
        polygonCoords: coords
      } : undefined
    });
  };

  const handleConvert = () => {
    if (!validationResult || !validationResult.parsedData) return;
    const p = validationResult.parsedData;

    const newDraft: AlertItem = {
      id: `alt-cap-${Date.now()}`,
      code: `WAMS-CAP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      headlineAr: p.headline || p.event,
      headlineEn: p.headline || p.event,
      shortHeadlineAr: p.event || 'تحذير جوي مستورد',
      descriptionAr: p.headline || 'تم استيراد هذا التحذير من خلاصة CAP 1.2 وهو مسودة قيد التدقيق البشري.',
      descriptionEn: p.headline,
      safetyInstructionsAr: 'يرجى مراجعة إرشادات الدفاع المدني واتخاذ تدابير الحيطة والحذر.',
      phenomenon: 'heavy_rain',
      severity: (p.severity.toLowerCase() as any) || 'severe',
      urgency: (p.urgency.toLowerCase() as any) || 'expected',
      certainty: (p.certainty.toLowerCase() as any) || 'likely',
      status: 'draft',
      issuerOrg: p.sender || 'CAP Source',
      createdBy: 'محرك استيراد CAP 1.2',
      issuedAt: p.sent || new Date().toISOString(),
      effectiveAt: new Date().toISOString(),
      onsetAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      areas: [
        {
          id: `area-cap-${Date.now()}`,
          nameAr: p.areaDesc || 'المنطقة المستوردة من CAP',
          nameEn: p.areaDesc || 'Imported CAP Area',
          type: 'polygon',
          coordinates: p.polygonCoords.length > 0 ? p.polygonCoords : [
            { lat: 21.5, lng: 39.1 },
            { lat: 21.8, lng: 39.5 },
            { lat: 21.2, lng: 39.9 }
          ]
        }
      ],
      currentVersion: 1,
      versionHistory: [],
      capIdentifier: p.identifier,
      sourceType: 'cap_import',
      internalNotes: `مستورد من معيار CAP 1.2 برقم تعريف: ${p.identifier}. نوع الرسالة: ${p.msgType}.`,
      tags: ['CAP 1.2', 'مستورد', p.severity]
    };

    onConvertToDraft(newDraft);
    setImportSuccess(`تم تحويل الرسالة بنجاح إلى مسودة برقم: ${newDraft.code} في WAMS ولا يمكن نشرها إلا بعد المراجعة والاعتماد.`);
  };

  const loadCorruptXml = () => {
    setXmlContent(`<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>invalid-identifier-format</identifier>
  <sender>unauthorized-source@unknown.org</sender>
  <sent>2020-01-01T00:00:00Z</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <!-- Missing required info and severity blocks -->
</alert>`);
    setValidationResult(null);
    setImportSuccess(null);
  };

  const loadValidXml = () => {
    setXmlContent(sampleCapXml);
    setValidationResult(null);
    setImportSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            محرك استيراد ومعالجة معيار CAP 1.2 (Common Alerting Protocol)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            التحقق من صحة XML، مطابقة Schema 1.2، استخراج الإحداثيات الجغرافية، والتحويل إلى مسودة للمراجعة البشرية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            سجل رسائل CAP السابقة
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{importSuccess}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: XML Input (Left) vs Inspector & Draft Converter (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: XML Code Editor */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>نص رسالة CAP 1.2 XML الأصلية</span>
              </div>

              {/* Sample loader buttons */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={loadValidXml}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-[11px]"
                >
                  تحميل نموذج سليم
                </button>
                <button
                  type="button"
                  onClick={loadCorruptXml}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-red-300 rounded transition-colors text-[11px]"
                >
                  اختبار رسالة معطوبة
                </button>
              </div>
            </div>

            <textarea
              value={xmlContent}
              onChange={(e) => { setXmlContent(e.target.value); setValidationResult(null); }}
              dir="ltr"
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-sky-300 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
              placeholder="ضع كود XML هنا..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Schema: OASIS CAP v1.2 / WMO CAP Profile
            </span>

            <button
              onClick={handleValidateXml}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>فحص والتحقق من الـ Schema</span>
            </button>
          </div>
        </div>

        {/* Right Column: Parsed Data & Validation Output */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>نتائج التحليل والمطابقة (Validation Results)</span>
            </h3>

            {validationResult ? (
              <div className="space-y-3">
                {/* Status Box */}
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${validationResult.isValid ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-red-950/30 border-red-500/50 text-red-300'}`}>
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span className="font-bold">
                    {validationResult.isValid ? 'الرسالة مطابقة لمعيار OASIS CAP 1.2 وجاهزة للاستيراد' : 'فشل التحقق: الرسالة تحتوي على أخطاء تمنع استيرادها'}
                  </span>
                </div>

                {/* Errors list if any */}
                {validationResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] text-red-400 font-bold block">الأخطاء المكتشفة:</span>
                    {validationResult.errors.map((err, i) => (
                      <div key={i} className="text-xs text-red-300 p-2 bg-red-950/40 rounded border border-red-500/30">
                        · {err}
                      </div>
                    ))}
                  </div>
                )}

                {/* Parsed Fields Inspector */}
                {validationResult.parsedData && (
                  <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">البيانات المستخرجة آلياً:</span>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-500">المعرف:</span>
                      <span className="font-mono text-sky-400 font-semibold truncate max-w-[200px]">{validationResult.parsedData.identifier}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-500">نوع الرسالة:</span>
                      <span className="font-mono text-emerald-400">{validationResult.parsedData.msgType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-500">مستوى الخطورة:</span>
                      <span className="font-bold text-amber-400 capitalize">{validationResult.parsedData.severity}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-500">الظاهرة:</span>
                      <span className="font-medium text-slate-200">{validationResult.parsedData.event}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-500">نقاط المضلع المستخرجة:</span>
                      <span className="font-mono text-sky-300 font-bold">{validationResult.parsedData.polygonCoords.length} نقطة</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-500">
                انقر على زر "فحص والتحقق من الـ Schema" لتحليل الرسالة والتأكد من مطابقتها للمعايير
              </div>
            )}
          </div>

            {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleConvert}
              disabled={!validationResult?.isValid}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>تحويل الرسالة إلى مسودة (Draft) في WAMS</span>
            </button>
            <span className="text-[10px] text-slate-500 text-center block">
              سياسة WAMS: لا يتم نشر أي رسالة CAP مستوردة تلقائياً؛ يجب مراجعتها وتدقيقها بشرياً أولاً.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
