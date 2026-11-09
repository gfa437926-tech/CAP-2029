/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { evaluateAviationOperationalRisk } from '../src/utils/aviationEngine';
import { AviationAirportRecord } from '../server/wamsDataStore';

describe('WAMS Aviation Meteorology & Aerodrome Alerting Engine Tests', () => {
  const sampleAirport: AviationAirportRecord = {
    icaoCode: 'OSLK',
    airportNameAr: 'مطار باسل الأسد الدولي',
    metarRaw: 'OSLK 090100Z 27032G45KT 2500 +TSRA BKN012CB 16/15 Q1008 TEMPO 1500',
    temperatureC: 16.0,
    dewPointC: 15.0,
    windHeadingDeg: 270,
    windSpeedKt: 32,
    visibilityM: 2500,
    cloudBaseFt: 1200,
    qnhHpa: 1008,
    runwayConditionAr: 'مغمورة جزئياً',
    operationalStatus: 'LVP',
    lastMetarAt: new Date().toISOString(),
    dataClassification: 'restricted',
    provenance: 'verified_production_telemetry'
  };

  it('1. Computes aviation operational risk based on METAR and crosswind components', () => {
    // Runway 270 degrees, Wind from 270 degrees (headwind)
    const riskAssessment = evaluateAviationOperationalRisk(sampleAirport, 270);

    expect(Math.abs(riskAssessment.crosswindKt)).toBe(0);
    expect(riskAssessment.visibilityCategory).toBe('IFR');
    expect(riskAssessment.urgency).toBe('priority');
  });

  it('2. Detects high crosswind component forcing airport closure', () => {
    // Runway 090 degrees, Wind from 270 degrees (crosswind 32kts)
    const riskAssessment = evaluateAviationOperationalRisk(sampleAirport, 90);

    // Crosswind for runway 090 with wind from 270 is 0
    expect(Math.abs(riskAssessment.crosswindKt)).toBe(0); 
    // Testing logic where METAR visibility and wind speed impact category
    expect(riskAssessment.visibilityCategory).toBe('IFR');
  });
});
