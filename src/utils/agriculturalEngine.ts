/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgriculturalRiskRecord } from '../../server/wamsDataStore';

export interface FrostRiskAssessmentResult {
  zoneId: string;
  zoneNameAr: string;
  predictedMinTempC: number;
  frostRiskTier: 'none' | 'low' | 'moderate' | 'severe';
  frostRiskTierAr: string;
  recommendedActionAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Calculates Agricultural Frost & Drought Risk (Standardized Precipitation Index - SPI)
 */
export function evaluateAgriculturalRisk(
  zone: AgriculturalRiskRecord,
  currentTempC: number,
  soilMoisturePct: number
): FrostRiskAssessmentResult {
  let frostRiskTier: 'none' | 'low' | 'moderate' | 'severe' = 'none';
  let frostRiskTierAr = 'لا يوجد خطر صقيع';
  let recommendedActionAr = 'لا إجراءات وقائية مطلوبة';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';

  // Frost Logic
  if (currentTempC <= -2) {
    frostRiskTier = 'severe';
    frostRiskTierAr = 'خطر صقيع شديد - تلف مؤكد للمحاصيل الحساسة';
    recommendedActionAr = 'تفعيل غرف العمليات الزراعية، استخدام أجهزة التدفئة الميدانية، والري التكميلي الدافئ';
    urgency = 'emergency';
  } else if (currentTempC <= 1) {
    frostRiskTier = 'moderate';
    frostRiskTierAr = 'خطر صقيع متوسط - ضرر محتمل';
    recommendedActionAr = 'استخدام الرش التكميلي وتغطية البيوت البلاستيكية';
    urgency = 'priority';
  } else if (currentTempC <= 3) {
    frostRiskTier = 'low';
    frostRiskTierAr = 'خطر صقيع منخفض - ضرر طفيف';
    recommendedActionAr = 'مراقبة درجات الحرارة اللحظية';
  }

  // Drought Logic (SPI adjustment)
  if (zone.droughtIndexSpi < -1.5) {
    recommendedActionAr += ' | جفاف حاد: أولوية قصوى لتوزيع مياه الري التكميلي';
    urgency = 'emergency';
  } else if (zone.droughtIndexSpi < -0.5) {
    recommendedActionAr += ' | جفاف متوسط: ترشيد استخدام المياه';
  }

  return {
    zoneId: zone.zoneId,
    zoneNameAr: zone.zoneNameAr,
    predictedMinTempC: currentTempC,
    frostRiskTier,
    frostRiskTierAr,
    recommendedActionAr,
    urgency
  };
}
