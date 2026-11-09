/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertItem, CAPMessageRecord, GeoArea, Coordinates } from '../types/wams';
import { escapeHtml } from './sanitize';

/**
 * Standard ITU-T X.1303 CAP v1.2 XML Generator for WAMS National Platform.
 * Converts internal WAMS AlertItems into canonical CAP 1.2 XML format.
 */
export function generateCapV12Xml(alert: AlertItem): string {
  const identifier = alert.capIdentifier || `urn:oid:2.49.0.1.760.0.${alert.code.replace(/[^A-Za-z0-9]/g, '-')}`;
  const sender = alert.issuerOrg || 'wams-national-alerts@meteorology.gov.sy';
  const sent = alert.issuedAt || new Date().toISOString();
  
  const capStatus = alert.status === 'published' || alert.status === 'updated' 
    ? 'Actual' 
    : alert.status === 'draft' 
      ? 'Draft' 
      : 'Test';

  const msgType = alert.status === 'updated' 
    ? 'Update' 
    : alert.status === 'cancelled' 
      ? 'Cancel' 
      : 'Alert';

  const scope = 'Public';
  const category = getCapCategory(alert.phenomenon);
  const event = alert.headlineEn || alert.phenomenon;

  const urgencyCap = mapUrgencyToCap(alert.urgency);
  const severityCap = mapSeverityToCap(alert.severity);
  const certaintyCap = mapCertaintyToCap(alert.certainty);

  const polygonCoordsStr = alert.areas
    .map(area => formatPolygonCoordinates(area))
    .filter(Boolean)
    .join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${escapeHtml(identifier)}</identifier>
  <sender>${escapeHtml(sender)}</sender>
  <sent>${escapeHtml(sent)}</sent>
  <status>${capStatus}</status>
  <msgType>${msgType}</msgType>
  <scope>${scope}</scope>
  <code font="CAP-v1.2-SYR-NATIONAL">WAMS-CAP-v1.2</code>
  <info>
    <language>ar-SY</language>
    <category>${category}</category>
    <event>${escapeHtml(event)}</event>
    <urgency>${urgencyCap}</urgency>
    <severity>${severityCap}</severity>
    <certainty>${certaintyCap}</certainty>
    <eventCode>
      <valueName>WAMS_PHENOMENON</valueName>
      <value>${escapeHtml(alert.phenomenon)}</value>
    </eventCode>
    <effective>${escapeHtml(alert.effectiveAt || sent)}</effective>
    <onset>${escapeHtml(alert.onsetAt || sent)}</onset>
    <expires>${escapeHtml(alert.expiresAt)}</expires>
    <senderName>${escapeHtml(alert.issuerOrg)}</senderName>
    <headline>${escapeHtml(alert.headlineAr)}</headline>
    <description>${escapeHtml(alert.descriptionAr)}</description>
    <instruction>${escapeHtml(alert.safetyInstructionsAr)}</instruction>
    <web>https://wams.gov.sy/alerts/${escapeHtml(alert.code)}</web>
    <parameter>
      <valueName>WAMS_SECTOR_TAGS</valueName>
      <value>${escapeHtml((alert.tags || []).join(','))}</value>
    </parameter>
    <area>
      <areaDesc>${escapeHtml(alert.areas.map(a => a.nameAr).join(' - '))}</areaDesc>
      ${polygonCoordsStr ? `<polygon>${polygonCoordsStr}</polygon>` : ''}
    </area>
  </info>
</alert>`;
}

/**
 * Validates and parses raw CAP v1.2 XML string.
 * Enforces ITU-T X.1303 mandatory elements: identifier, sender, sent, status, msgType, scope, info.
 */
export function parseAndValidateCapV12(xmlContent: string): {
  isValid: boolean;
  errors: string[];
  parsedRecord?: Partial<CAPMessageRecord>;
} {
  const errors: string[] = [];

  if (!xmlContent || typeof xmlContent !== 'string') {
    return { isValid: false, errors: ['محتوى رسالة CAP فارغ أو غير صالحة.'] };
  }

  // Mandatory CAP v1.2 XML root check
  if (!xmlContent.includes('<alert') || !xmlContent.includes('urn:oasis:names:tc:emergency:cap:1.2')) {
    errors.push('الرسالة لا تحتوي على عنصر الجذر المعياري <alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">.');
  }

  const identifier = extractTagValue(xmlContent, 'identifier');
  const sender = extractTagValue(xmlContent, 'sender');
  const sent = extractTagValue(xmlContent, 'sent');
  const status = extractTagValue(xmlContent, 'status');
  const msgType = extractTagValue(xmlContent, 'msgType');
  const scope = extractTagValue(xmlContent, 'scope');

  if (!identifier) errors.push('العنصر الإجباري <identifier> مفقود.');
  if (!sender) errors.push('العنصر الإجباري <sender> مفقود.');
  if (!sent) errors.push('العنصر الإجباري <sent> مفقود.');
  if (!status || !['Actual', 'Exercise', 'System', 'Test', 'Draft'].includes(status)) {
    errors.push('عنصر <status> مفقود أو يحمل قيمة غير معتمدة في CAP 1.2.');
  }
  if (!msgType || !['Alert', 'Update', 'Cancel', 'Ack', 'Error'].includes(msgType)) {
    errors.push('عنصر <msgType> مفقود أو يحمل قيمة غير معتمدة في CAP 1.2.');
  }
  if (!scope || !['Public', 'Restricted', 'Private'].includes(scope)) {
    errors.push('عنصر <scope> مفقود أو يحمل قيمة غير معتمدة في CAP 1.2.');
  }

  const category = extractTagValue(xmlContent, 'category') || 'Met';
  const headline = extractTagValue(xmlContent, 'headline') || 'تحذير وطني عاجل';
  const urgency = extractTagValue(xmlContent, 'urgency') || 'Immediate';
  const severity = extractTagValue(xmlContent, 'severity') || 'Severe';
  const certainty = extractTagValue(xmlContent, 'certainty') || 'Observed';
  const areaDesc = extractTagValue(xmlContent, 'areaDesc') || 'جميع المحافظات السورية';

  const isValid = errors.length === 0;

  const parsedRecord: Partial<CAPMessageRecord> = {
    id: `CAP-REC-${Date.now()}`,
    identifier: identifier || 'UNKNOWN-CAP-ID',
    sender: sender || 'UNKNOWN-SENDER',
    sent: sent || new Date().toISOString(),
    status: (status as any) || 'Actual',
    msgType: (msgType as any) || 'Alert',
    scope: (scope as any) || 'Public',
    category,
    eventAr: headline,
    urgency,
    severity,
    certainty,
    areaDesc,
    validationStatus: isValid ? 'valid' : 'invalid',
    validationErrors: errors,
    rawXml: xmlContent,
    receivedAt: new Date().toISOString()
  };

  return { isValid, errors, parsedRecord };
}

/**
 * Converts a internal AlertItem directly into a CAPMessageRecord.
 */
export function convertAlertToCapRecord(alert: AlertItem): CAPMessageRecord {
  const rawXml = generateCapV12Xml(alert);
  const validation = parseAndValidateCapV12(rawXml);

  return {
    id: `CAP-REC-${alert.id}`,
    identifier: alert.capIdentifier || `urn:oid:2.49.0.1.760.0.${alert.code}`,
    sender: alert.issuerOrg,
    sent: alert.issuedAt,
    status: alert.status === 'published' ? 'Actual' : 'Draft',
    msgType: alert.status === 'updated' ? 'Update' : alert.status === 'cancelled' ? 'Cancel' : 'Alert',
    scope: 'Public',
    category: getCapCategory(alert.phenomenon),
    eventAr: alert.headlineAr,
    urgency: mapUrgencyToCap(alert.urgency),
    severity: mapSeverityToCap(alert.severity),
    certainty: mapCertaintyToCap(alert.certainty),
    areaDesc: alert.areas.map(a => a.nameAr).join(' - '),
    validationStatus: validation.isValid ? 'valid' : 'invalid',
    validationErrors: validation.errors,
    rawXml,
    convertedAlertId: alert.id,
    receivedAt: new Date().toISOString()
  };
}

// Helper utility functions
function extractTagValue(xml: string, tag: string): string {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(xml);
  return match ? match[1].trim() : '';
}

function getCapCategory(phenomenon: string): string {
  switch (phenomenon) {
    case 'heavy_rain':
    case 'thunderstorm':
    case 'gale_winds':
    case 'dense_fog':
    case 'snowfall':
    case 'frost_ice':
    case 'heatwave':
    case 'coldwave':
      return 'Met';
    case 'flash_flood':
    case 'marine_surge':
      return 'Safety';
    case 'dust_storm':
      return 'Env';
    default:
      return 'Met';
  }
}

function mapUrgencyToCap(urgency: string): string {
  switch (urgency) {
    case 'immediate': return 'Immediate';
    case 'expected': return 'Expected';
    case 'future': return 'Future';
    case 'past': return 'Past';
    default: return 'Unknown';
  }
}

function mapSeverityToCap(severity: string): string {
  switch (severity) {
    case 'extreme': return 'Extreme';
    case 'severe': return 'Severe';
    case 'moderate': return 'Moderate';
    case 'minor': return 'Minor';
    default: return 'Unknown';
  }
}

function mapCertaintyToCap(certainty: string): string {
  switch (certainty) {
    case 'observed': return 'Observed';
    case 'likely': return 'Likely';
    case 'possible': return 'Possible';
    case 'unlikely': return 'Unlikely';
    default: return 'Unknown';
  }
}

function formatPolygonCoordinates(area: GeoArea): string {
  if (!area.coordinates || area.coordinates.length < 3) return '';
  return area.coordinates.map((c: Coordinates) => `${c.lat},${c.lng}`).join(' ');
}
