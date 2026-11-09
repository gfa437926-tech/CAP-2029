/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { evaluateTrafficOperationalRisk } from '../src/utils/trafficEngine';
import { RoadHazardRecord } from '../server/wamsDataStore';

describe('WAMS Road Traffic Safety & Hazard Engine Tests', () => {
  const sampleRoad: RoadHazardRecord = {
    roadId: 'ROAD-TAR-02',
    highwayNameAr: 'طريق طرطوس - دريكيش',
    segmentAr: 'جسر الخراب وادي قنديل',
    governorate: 'طرطوس',
    status: 'closed_flood',
    detourRouteAr: 'مسار الشيخ بدر البديل',
    reportedHazardAr: 'غمر مائي بارتفاع 40 سم بسبب فيضان مجرى السيل الجبلي',
    reportedAt: new Date().toISOString(),
    dataClassification: 'public',
    provenance: 'verified_production_telemetry'
  };

  it('1. Triggers emergency closure alert for flood hazard', () => {
    const assessment = evaluateTrafficOperationalRisk(sampleRoad, 10, false);

    expect(assessment.roadRiskTier).toBe('closed');
    expect(assessment.urgency).toBe('emergency');
    expect(assessment.safetyAlertAr).toContain('غمر مائي');
  });

  it('2. Triggers caution alert for low visibility conditions', () => {
    const cautiousRoad: RoadHazardRecord = {
      ...sampleRoad,
      status: 'open',
      reportedHazardAr: 'لا يوجد خطر مباشر'
    };
    const assessment = evaluateTrafficOperationalRisk(cautiousRoad, 0.5, false);

    expect(assessment.roadRiskTier).toBe('caution');
    expect(assessment.urgency).toBe('priority');
  });
});
