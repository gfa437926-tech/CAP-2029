/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  calculatePtoSLeadTimeSec, 
  evaluateShakeMapIntensity, 
  rejectUnscientificPredictionClaim,
  calculateGeodesicDistanceKm
} from '../src/utils/seismicEngine';

describe('WAMS Seismic & Tectonic Hazard Early Warning Engine Tests', () => {
  const GhabEpicenter = { lat: 35.421, lng: 36.312 }; // Masyaf / Ghab Fault
  const MasyafStation = { lat: 35.410, lng: 36.300 }; // 1.6 km
  const DamascusStation = { lat: 33.513, lng: 36.276 }; // ~212 km

  it('1. Calculates geodesic distance accurately for seismic epicenters', () => {
    const distNear = calculateGeodesicDistanceKm(GhabEpicenter, MasyafStation);
    expect(distNear).toBeLessThan(5);

    const distFar = calculateGeodesicDistanceKm(GhabEpicenter, DamascusStation);
    expect(distFar).toBeGreaterThan(200);
    expect(distFar).toBeLessThan(230);
  });

  it('2. Computes P-Wave and S-Wave arrival time lead window (P-to-S Lead Time)', () => {
    const result = calculatePtoSLeadTimeSec(GhabEpicenter, 10, DamascusStation);

    expect(result.epicentralDistanceKm).toBeGreaterThan(200);
    expect(result.pWaveArrivalSec).toBeGreaterThan(30);
    expect(result.sWaveArrivalSec).toBeGreaterThan(result.pWaveArrivalSec);
    expect(result.sWaveLeadTimeSec).toBeGreaterThan(20); // ~24s warning time for Damascus for Ghab fault event
  });

  it('3. Estimates ShakeMap PGA acceleration and MMI intensity level', () => {
    // Moderate M4.2 earthquake at 10km depth, 20km distance
    const shakeMap = evaluateShakeMapIntensity(4.2, 10, 20);

    expect(shakeMap.pgaG).toBeGreaterThan(0.01);
    expect(shakeMap.mmiIntensityAr).toBeDefined();
    expect(shakeMap.potentialDamageAr).toBeDefined();
  });

  it('4. Rejects unscientific claims asserting advance earthquake prediction', () => {
    const check1 = rejectUnscientificPredictionClaim('متى سيقع الزلزال القادم في الساحل؟');
    expect(check1.isPredictionClaim).toBe(true);
    expect(check1.ScientificStatementAr).toContain('لا يمتلك أي علم أو تقنية في العالم القدرة على التنبؤ بموعد ومكان الزلزال مسبقاً');

    const check2 = rejectUnscientificPredictionClaim('عرض قراءات محطة التسارع الرقمي بمصياف');
    expect(check2.isPredictionClaim).toBe(false);
  });
});
