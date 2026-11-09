/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { evaluateMaritimeOperationalRisk } from '../src/utils/maritimeEngine';
import { PortConditionRecord } from '../server/wamsDataStore';

describe('WAMS Maritime Safety & Port Operations Engine Tests', () => {
  const samplePort: PortConditionRecord = {
    portId: 'PORT-LAT-01',
    portNameAr: 'مرفأ اللاذقية التجاري',
    seaStateAr: 'شديد الاضطراب',
    waveHeightM: 4.8, // Should trigger severe alert
    windSpeedKmh: 65,
    waterCurrentKt: 3.2,
    navigationStatus: 'all_shipping_suspended',
    anchoredVesselsCount: 14,
    lastUpdated: new Date().toISOString(),
    dataClassification: 'public',
    provenance: 'verified_production_telemetry'
  };

  it('1. Evaluates maritime risk and triggers severe alert for high waves', () => {
    const assessment = evaluateMaritimeOperationalRisk(samplePort);

    expect(assessment.waveSeverityTier).toBe('severe');
    expect(assessment.urgency).toBe('emergency');
    expect(assessment.safetyAlertAr).toContain('تعليق كامل للملاحة');
  });

  it('2. Evaluates maritime risk for safe conditions', () => {
    const safePort: PortConditionRecord = {
      ...samplePort,
      waveHeightM: 1.0,
      windSpeedKmh: 10,
      navigationStatus: 'open'
    };
    const assessment = evaluateMaritimeOperationalRisk(safePort);

    expect(assessment.waveSeverityTier).toBe('normal');
    expect(assessment.urgency).toBe('routine');
  });
});
