/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  generateCapV12Xml, 
  parseAndValidateCapV12, 
  convertAlertToCapRecord 
} from '../src/utils/capV12Engine';
import { AlertItem } from '../src/types/wams';

describe('WAMS National CAP v1.2 Protocol Core Architecture Tests', () => {
  const sampleAlert: AlertItem = {
    id: 'ALERT-SYR-2029-001',
    code: 'WAMS-SYR-2029-MET-001',
    headlineAr: 'تحذير وطني شديد: أمطار غزيرة وسيول مفاجئة على المحافظات الساحلية',
    headlineEn: 'Severe National Warning: Heavy Rain & Flash Floods on Coastal Governorates',
    shortHeadlineAr: 'سيول جارفة في الساحل',
    descriptionAr: 'تتأثر محافظتا اللاذقية وطرطوس بهطولات مطرية غزيرة جداً مصحوبة بعواصف رعدية شديدة ورياح عاتية.',
    descriptionEn: 'Latakia and Tartus are affected by very heavy rainfall accompanied by severe thunderstorms.',
    safetyInstructionsAr: 'الابتعاد عن مجاري السيول والأودية، وإيقاف حركة الملاحة البحرية والقوارب الصغيرة.',
    phenomenon: 'heavy_rain',
    severity: 'severe',
    urgency: 'immediate',
    certainty: 'observed',
    status: 'published',
    issuerOrg: 'المركز الوطني للأرصاد الجوية والمناخ',
    createdBy: 'USER-MET-01',
    issuedAt: '2026-11-08T18:00:00.000Z',
    effectiveAt: '2026-11-08T18:00:00.000Z',
    onsetAt: '2026-11-08T18:30:00.000Z',
    expiresAt: '2026-11-09T18:00:00.000Z',
    areas: [
      {
        id: 'AREA-LATAKIA-COAST',
        nameAr: 'الشريط الساحلي بمحافظة اللاذقية',
        nameEn: 'Latakia Coastal Strip',
        type: 'polygon',
        coordinates: [
          { lat: 35.50, lng: 35.75 },
          { lat: 35.80, lng: 35.90 },
          { lat: 35.60, lng: 36.10 },
          { lat: 35.50, lng: 35.75 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [],
    sourceType: 'manual',
    tags: ['أمطار', 'سيول', 'الساحل', 'طوارئ']
  };

  it('1. Generates valid canonical CAP v1.2 XML matching ITU-T X.1303 specification', () => {
    const xml = generateCapV12Xml(sampleAlert);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">');
    expect(xml).toContain('<status>Actual</status>');
    expect(xml).toContain('<msgType>Alert</msgType>');
    expect(xml).toContain('<scope>Public</scope>');
    expect(xml).toContain('<category>Met</category>');
    expect(xml).toContain('<urgency>Immediate</urgency>');
    expect(xml).toContain('<severity>Severe</severity>');
    expect(xml).toContain('<certainty>Observed</certainty>');
    expect(xml).toContain('<polygon>35.5,35.75 35.8,35.9 35.6,36.1 35.5,35.75</polygon>');
  });

  it('2. Parses and validates canonical CAP v1.2 XML successfully', () => {
    const xml = generateCapV12Xml(sampleAlert);
    const result = parseAndValidateCapV12(xml);

    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.parsedRecord?.status).toBe('Actual');
    expect(result.parsedRecord?.msgType).toBe('Alert');
    expect(result.parsedRecord?.category).toBe('Met');
    expect(result.parsedRecord?.eventAr).toContain('أمطار غزيرة');
  });

  it('3. Rejects invalid XML lacking mandatory CAP v1.2 elements', () => {
    const invalidXml = `<alert><identifier>ID-123</identifier></alert>`;
    const result = parseAndValidateCapV12(invalidXml);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('xmlns='))).toBe(true);
  });

  it('4. Converts internal AlertItem cleanly to CAPMessageRecord', () => {
    const record = convertAlertToCapRecord(sampleAlert);

    expect(record.id).toBe('CAP-REC-ALERT-SYR-2029-001');
    expect(record.validationStatus).toBe('valid');
    expect(record.category).toBe('Met');
    expect(record.areaDesc).toContain('اللاذقية');
    expect(record.rawXml).toContain('urn:oasis:names:tc:emergency:cap:1.2');
  });
});
