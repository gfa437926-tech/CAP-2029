/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HospitalReadinessRecord } from '../../server/wamsDataStore';

export interface MedicalEvacuationPlanResult {
  hospitalId: string;
  hospitalNameAr: string;
  governorate: string;
  icuOccupancyPct: number;
  availableBedsCount: number;
  availableIcuBedsCount: number;
  oxygenReservesHours: number;
  generatorFuelDays: number;
  evacuationTier: 'routine' | 'priority_evacuation' | 'critical_surge';
  evacuationTierAr: string;
  recommendedPatientTransferCount: number;
  destinationHospitalsAr: string[];
}

/**
 * Calculates Medical Stress & ICU Occupancy Index for Syrian Emergency Hospitals
 */
export function evaluateHospitalCapacityStress(hospital: HospitalReadinessRecord): {
  bedOccupancyPct: number;
  icuOccupancyPct: number;
  stressLevel: 'low' | 'moderate' | 'high' | 'critical';
  stressLevelAr: string;
} {
  const bedOccupancyPct = Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 1000) / 10;
  const icuOccupancyPct = Math.round(((hospital.icuTotal - hospital.icuAvailable) / hospital.icuTotal) * 1000) / 10;

  let stressLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let stressLevelAr = 'طبيعي - استيعاب مستقر';

  if (icuOccupancyPct >= 90 || hospital.oxygenReservesHours < 24) {
    stressLevel = 'critical';
    stressLevelAr = 'حرج جداً - إجهاد طبي فائق وتحذير نفاذ أكسجين';
  } else if (icuOccupancyPct >= 80 || hospital.oxygenReservesHours < 48) {
    stressLevel = 'high';
    stressLevelAr = 'مرتفع - ضغط طوارئ وعناية مركزة';
  } else if (icuOccupancyPct >= 65) {
    stressLevel = 'moderate';
    stressLevelAr = 'متوسط - متابعة حركة المرضى';
  }

  return {
    bedOccupancyPct,
    icuOccupancyPct,
    stressLevel,
    stressLevelAr
  };
}

/**
 * Generates Medical Evacuation & Patient Redistribution Plan during Natural Disasters
 */
export function generateMedicalEvacuationPlan(
  sourceHospital: HospitalReadinessRecord,
  surplusHospitals: HospitalReadinessRecord[],
  evacuationPatientCount: number
): MedicalEvacuationPlanResult {
  const stress = evaluateHospitalCapacityStress(sourceHospital);

  let evacuationTier: 'routine' | 'priority_evacuation' | 'critical_surge' = 'routine';
  let evacuationTierAr = 'إحالة اعتيادية مبرمجة';

  if (stress.stressLevel === 'critical' || sourceHospital.icuAvailable <= 2) {
    evacuationTier = 'critical_surge';
    evacuationTierAr = 'إخلاء طبي عاجل وتحويل المرضى للمشافي المساندة';
  } else if (stress.stressLevel === 'high') {
    evacuationTier = 'priority_evacuation';
    evacuationTierAr = 'تحويل وقائي أولوية خفضا للضغط الطارئ';
  }

  const destinationHospitalsAr = surplusHospitals
    .filter(h => h.hospitalId !== sourceHospital.hospitalId && h.availableBeds > 10)
    .sort((a, b) => b.availableBeds - a.availableBeds)
    .map(h => `${h.nameAr} (${h.governorate}) - ${h.availableBeds} أسرة متاحة`);

  return {
    hospitalId: sourceHospital.hospitalId,
    hospitalNameAr: sourceHospital.nameAr,
    governorate: sourceHospital.governorate,
    icuOccupancyPct: stress.icuOccupancyPct,
    availableBedsCount: sourceHospital.availableBeds,
    availableIcuBedsCount: sourceHospital.icuAvailable,
    oxygenReservesHours: sourceHospital.oxygenReservesHours,
    generatorFuelDays: sourceHospital.generatorFuelDays,
    evacuationTier,
    evacuationTierAr,
    recommendedPatientTransferCount: Math.min(evacuationPatientCount, Math.max(1, sourceHospital.totalBeds - sourceHospital.availableBeds)),
    destinationHospitalsAr: destinationHospitalsAr.slice(0, 3)
  };
}
