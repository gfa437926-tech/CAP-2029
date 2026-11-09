/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateFlashFloodTravelTimeMin, 
  evaluateDamOverflowRisk 
} from '../src/utils/hydrologyEngine';

describe('WAMS Hydrological Flash Flood & Dam Cascade Engine Tests', () => {
  it('1. Computes Kirpich flash flood surge wave travel time and wave velocity', () => {
    // Basin length: 25km, slope: 15 m/km, rainfall: 60mm
    const surge = calculateFlashFloodTravelTimeMin(25, 15, 60);

    expect(surge.travelTimeMinutes).toBeGreaterThan(0);
    expect(surge.waveSpeedKmPerHour).toBeGreaterThan(0);
    expect(surge.floodSeverityTierAr).toBeDefined();
  });

  it('2. Evaluates dam spillway surcharge and downstream risk tier', () => {
    // Overflow emergency warning case: Dam level at 79.5m (Capacity 80m), storage 99.3%
    const damOverflow = evaluateDamOverflowRisk('سد 16 تشرين', 79.5, 80.0, 320, 240);

    expect(damOverflow.storagePct).toBeGreaterThan(98);
    expect(damOverflow.urgency).toBe('emergency');
    expect(damOverflow.spillwayStatusAr).toContain('تحذير مفيض طارئ');
    expect(damOverflow.recommendedSpillwayDischargeM3s).toBeGreaterThan(240);
  });
});
