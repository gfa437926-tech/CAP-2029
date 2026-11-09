/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { evaluateAgriculturalRisk } from '../src/utils/agriculturalEngine';
import { AgriculturalRiskRecord } from '../server/wamsDataStore';

describe('WAMS Agricultural Resilience & Frost/Drought Engine Tests', () => {
  const sampleZone: AgriculturalRiskRecord = {
    zoneId: 'AGRI-DAM-01',
    zoneNameAr: 'غوطة دمشق',
    dominantCropsAr: ['قمح', 'أشجار مثمرة'],
    soilMoisturePct: 75,
    frostRiskTier: 'moderate',
    predictedMinTempC: 2.0,
    droughtIndexSpi: -0.2,
    advisoryNoteAr: 'مراقبة الصقيع',
    dataClassification: 'public',
    provenance: 'verified_production_telemetry'
  };

  it('1. Computes frost risk severity for severe freezing conditions', () => {
    // Severe freeze: -3°C
    const assessment = evaluateAgriculturalRisk(sampleZone, -3, 60);

    expect(assessment.frostRiskTier).toBe('severe');
    expect(assessment.urgency).toBe('emergency');
    expect(assessment.recommendedActionAr).toContain('تفعيل غرف العمليات');
  });

  it('2. Detects drought intensification via SPI input adjustment', () => {
    const droughtZone = { ...sampleZone, droughtIndexSpi: -2.0 };
    const assessment = evaluateAgriculturalRisk(droughtZone, 5.0, 30);

    expect(assessment.urgency).toBe('emergency');
    expect(assessment.recommendedActionAr).toContain('جفاف حاد');
  });
});
