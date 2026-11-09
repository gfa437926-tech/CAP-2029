/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnergyRiskAssessmentResult {
  facilityId: string;
  facilityNameAr: string;
  riskTier: 'normal' | 'caution' | 'critical';
  riskTierAr: string;
  loadStressPct: number;
  safetyAlertAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Assesses Critical Energy Grid Infrastructure Risk
 */
export function evaluateEnergyInfrastructureRisk(
  facilityId: string,
  facilityNameAr: string,
  loadPct: number,
  weatherRisk: 'low' | 'moderate' | 'high'
): EnergyRiskAssessmentResult {
  let riskTier: 'normal' | 'caution' | 'critical' = 'normal';
  let riskTierAr = 'طبيعي (Normal)';
  let safetyAlertAr = 'جاهزية الشبكة مستقرة';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';

  if (loadPct >= 90 || weatherRisk === 'high') {
    riskTier = 'critical';
    riskTierAr = 'إجهاد حرج (Critical Load)';
    safetyAlertAr = 'خطر انقطاع التغذية؛ تفعيل خطة تخفيف الأحمال';
    urgency = 'emergency';
  } else if (loadPct >= 75 || weatherRisk === 'moderate') {
    riskTier = 'caution';
    riskTierAr = 'تحذير (Caution)';
    safetyAlertAr = 'إجهاد مرتفع للمحولات؛ مراقبة الاستهلاك';
    urgency = 'priority';
  }

  return {
    facilityId,
    facilityNameAr,
    riskTier,
    riskTierAr,
    loadStressPct: loadPct,
    safetyAlertAr,
    urgency
  };
}
