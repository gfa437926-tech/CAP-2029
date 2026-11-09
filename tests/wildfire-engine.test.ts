/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateFireWeatherIndexFWI, 
  calculateWildfireSpreadRateMPerMin, 
  classifyThermalHotspot 
} from '../src/utils/wildfireEngine';

describe('WAMS Wildfire Risk FWI & Spread Calculation Engine Tests', () => {
  it('1. Computes Fire Weather Index (FWI) risk tier accurately', () => {
    // Extreme dry summer conditions: 38°C, 18% humidity, 45 km/h wind, 0mm rain
    const extremeRisk = calculateFireWeatherIndexFWI(38, 18, 45, 0);

    expect(extremeRisk.fwiScore).toBeGreaterThan(60);
    expect(extremeRisk.fwiRiskTier).toBe('extreme');
    expect(extremeRisk.riskTierAr).toBeDefined();

    // Mild wet conditions: 15°C, 85% humidity, 10 km/h wind, 25mm rain
    const lowRisk = calculateFireWeatherIndexFWI(15, 85, 10, 25);
    expect(lowRisk.fwiRiskTier).toBe('low');
  });

  it('2. Calculates Rothermel fire spread rate taking wind and terrain slope into account', () => {
    // High wind (45 km/h) & steep slope (34 degrees)
    const steepSpread = calculateWildfireSpreadRateMPerMin(45, 34, 1.5);

    expect(steepSpread.spreadRateMPerMin).toBeGreaterThan(10);
    expect(steepSpread.isRapidSpread).toBe(true);

    // Calm wind (5 km/h) & flat terrain (0 degrees)
    const flatSpread = calculateWildfireSpreadRateMPerMin(5, 0, 1.0);
    expect(flatSpread.spreadRateMPerMin).toBeLessThan(steepSpread.spreadRateMPerMin);
  });

  it('3. Classifies satellite thermal hotspots correctly based on FRP and confidence', () => {
    // High FRP (48.6 MW) and High Confidence (92%)
    const confirmed = classifyThermalHotspot(48.6, 92);
    expect(confirmed.classification).toBe('confirmed_wildfire');
    expect(confirmed.actionRequiredAr).toContain('إرسال أفواج الإطفاء');

    // Low FRP (5 MW)
    const minor = classifyThermalHotspot(5, 60);
    expect(minor.classification).toBe('controlled_agricultural_burn');
  });
});
