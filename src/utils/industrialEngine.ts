/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IndustrialHazardAssessmentResult {
  hazardId: string;
  chemicalNameAr: string;
  hazardRiskTier: 'low' | 'moderate' | 'high' | 'critical';
  hazardRiskTierAr: string;
  safetyRadiusKm: number;
  safetyAlertAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Assesses Industrial Hazard Risk based on concentration levels and atmospheric dispersion
 */
export function evaluateIndustrialOperationalRisk(
  hazardId: string,
  chemicalNameAr: string,
  concentrationLevel: number, // 0-100 (normalized)
  windSpeedKmh: number
): IndustrialHazardAssessmentResult {
  let hazardRiskTier: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let hazardRiskTierAr = 'منخفض (Low)';
  let safetyAlertAr = 'ظروف صناعية آمنة';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';
  let safetyRadiusKm = 0.5;

  // Industrial risk logic
  if (concentrationLevel >= 80 || (concentrationLevel >= 50 && windSpeedKmh > 30)) {
    hazardRiskTier = 'critical';
    hazardRiskTierAr = 'خطر صناعي حرج جداً (Critical)';
    safetyAlertAr = 'تحذير إخلاء فوري للمنطقة المجاورة؛ تسرب كيميائي عالي التركيز';
    urgency = 'emergency';
    safetyRadiusKm = 5.0 + (windSpeedKmh / 10);
  } else if (concentrationLevel >= 50) {
    hazardRiskTier = 'high';
    hazardRiskTierAr = 'خطر صناعي مرتفع (High)';
    safetyAlertAr = 'تفعيل بروتوكولات الحماية الشخصية (PPE) والتهوية المغلقة';
    urgency = 'priority';
    safetyRadiusKm = 2.0;
  } else if (concentrationLevel >= 25) {
    hazardRiskTier = 'moderate';
    hazardRiskTierAr = 'خطر صناعي متوسط (Moderate)';
    safetyAlertAr = 'مراقبة مستمرة لمستويات التركيز في محيط المنشأة';
    urgency = 'priority';
  }

  return {
    hazardId,
    chemicalNameAr,
    hazardRiskTier,
    hazardRiskTierAr,
    safetyRadiusKm,
    safetyAlertAr,
    urgency
  };
}
