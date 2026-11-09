/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  evaluateHospitalCapacityStress, 
  generateMedicalEvacuationPlan 
} from '../src/utils/healthEngine';
import { HospitalReadinessRecord } from '../server/wamsDataStore';

describe('WAMS Emergency Health Operations & Redistribution Engine Tests', () => {
  const sampleHospital: HospitalReadinessRecord = {
    hospitalId: 'HOSP-TEST-01',
    nameAr: 'مستشفى تشرين الجامعي باللاذقية',
    governorate: 'اللاذقية',
    totalBeds: 500,
    availableBeds: 40,
    icuTotal: 50,
    icuAvailable: 3, // High ICU occupancy (47/50 = 94%)
    oxygenReservesHours: 18, // < 24h oxygen reserves (critical threshold)
    generatorFuelDays: 5,
    bloodBankStatus: 'adequate',
    emergencyStatus: 'elevated',
    lastAuditAt: new Date().toISOString(),
    dataClassification: 'sensitive',
    provenance: 'verified_production_telemetry'
  };

  const destinationHospitals: HospitalReadinessRecord[] = [
    {
      hospitalId: 'HOSP-DEST-02',
      nameAr: 'مستشفى الباسل الوطني بطرطوس',
      governorate: 'طرطوس',
      totalBeds: 400,
      availableBeds: 90,
      icuTotal: 40,
      icuAvailable: 12,
      oxygenReservesHours: 72,
      generatorFuelDays: 10,
      bloodBankStatus: 'surplus',
      emergencyStatus: 'routine',
      lastAuditAt: new Date().toISOString(),
      dataClassification: 'sensitive',
      provenance: 'verified_production_telemetry'
    }
  ];

  it('1. Computes medical stress level and flags critical oxygen reserve thresholds', () => {
    const stress = evaluateHospitalCapacityStress(sampleHospital);

    expect(stress.icuOccupancyPct).toBe(94);
    expect(stress.stressLevel).toBe('critical');
    expect(stress.stressLevelAr).toContain('حرج جداً');
  });

  it('2. Generates patient evacuation and redistribution plan during disaster surge', () => {
    const plan = generateMedicalEvacuationPlan(sampleHospital, destinationHospitals, 15);

    expect(plan.hospitalId).toBe('HOSP-TEST-01');
    expect(plan.evacuationTier).toBe('critical_surge');
    expect(plan.evacuationTierAr).toContain('إخلاء طبي عاجل');
    expect(plan.destinationHospitalsAr.length).toBeGreaterThan(0);
    expect(plan.destinationHospitalsAr[0]).toContain('مستشفى الباسل الوطني');
  });
});
