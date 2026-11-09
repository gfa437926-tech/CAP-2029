/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { evaluateIndustrialOperationalRisk } from '../src/utils/industrialEngine';

describe('WAMS Industrial Hazards & CBRN Engine Tests', () => {
  it('1. Triggers critical hazard alert for high chemical concentration and wind', () => {
    const assessment = evaluateIndustrialOperationalRisk(
      'IND-SYR-001',
      'غاز الكلور',
      85,
      40
    );

    expect(assessment.hazardRiskTier).toBe('critical');
    expect(assessment.urgency).toBe('emergency');
    expect(assessment.safetyAlertAr).toContain('إخلاء فوري');
  });

  it('2. Returns moderate risk for lower concentration and safe wind conditions', () => {
    const assessment = evaluateIndustrialOperationalRisk(
      'IND-SYR-002',
      'أمونيا',
      30,
      10
    );

    expect(assessment.hazardRiskTier).toBe('moderate');
    expect(assessment.urgency).toBe('priority');
  });
});
