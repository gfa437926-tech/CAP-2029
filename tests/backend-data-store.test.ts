/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { wamsDataStore } from '../server/wamsDataStore';

describe('WAMS National Backend Data Store - Sector Filtering & Spatial BBox Engine', () => {
  it('1. Filters weather observations by specific governorate', () => {
    const latakiaObs = wamsDataStore.getFilteredSectorData('weather', 'اللاذقية');
    expect(latakiaObs.length).toBeGreaterThan(0);
    expect(latakiaObs.every((s: any) => s.governorate.includes('اللاذقية'))).toBe(true);

    const damascusObs = wamsDataStore.getFilteredSectorData('meteorology', 'دمشق');
    expect(damascusObs.length).toBeGreaterThan(0);
    expect(damascusObs.every((s: any) => s.governorate.includes('دمشق'))).toBe(true);
  });

  it('2. Retrieves sector-specific telemetry for medical, aviation, and maritime sectors', () => {
    const hospitals = wamsDataStore.getFilteredSectorData('hospitals', 'اللاذقية');
    expect(hospitals.length).toBeGreaterThan(0);
    expect(hospitals[0].hospitalId).toBeDefined();

    const aviation = wamsDataStore.getFilteredSectorData('aviation');
    expect(aviation.length).toBeGreaterThan(0);
    expect(aviation[0].icaoCode).toBeDefined();

    const maritime = wamsDataStore.getFilteredSectorData('maritime');
    expect(maritime.length).toBeGreaterThan(0);
    expect(maritime[0].portId).toBeDefined();
  });

  it('3. Performs spatial bounding box query (ST_MakeEnvelope emulation)', () => {
    // Latakia/Tartus coastal bounding box
    const bboxResult = wamsDataStore.queryBySpatialBoundingBox(34.5, 35.5, 36.0, 36.2);
    expect(bboxResult.totalFeatures).toBeGreaterThan(0);
    expect(bboxResult.weather.some(w => w.governorate.includes('اللاذقية') || w.governorate.includes('طرطوس'))).toBe(true);
  });
});
