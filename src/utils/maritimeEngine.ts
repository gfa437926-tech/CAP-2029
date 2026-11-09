/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortConditionRecord } from '../../server/wamsDataStore';

export interface MaritimeRiskAssessmentResult {
  portId: string;
  portNameAr: string;
  waveSeverityTier: 'normal' | 'caution' | 'warning' | 'severe';
  waveSeverityTierAr: string;
  navigationStatusAr: string;
  safetyAlertAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Assesses Maritime Operational Risk based on Wave Height and Wind Speed
 */
export function evaluateMaritimeOperationalRisk(
  port: PortConditionRecord
): MaritimeRiskAssessmentResult {
  let waveSeverityTier: 'normal' | 'caution' | 'warning' | 'severe' = 'normal';
  let waveSeverityTierAr = 'بحر هادئ (Normal)';
  let safetyAlertAr = 'ظروف ملاحة طبيعية';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';

  // Maritime risk logic based on wave height
  if (port.waveHeightM >= 4.5 || port.windSpeedKmh >= 60) {
    waveSeverityTier = 'severe';
    waveSeverityTierAr = 'بحر شديد الاضطراب - خطر غرق';
    safetyAlertAr = 'تعليق كامل للملاحة البحرية؛ خطر عالٍ على الأرصفة';
    urgency = 'emergency';
  } else if (port.waveHeightM >= 3.5 || port.windSpeedKmh >= 50) {
    waveSeverityTier = 'warning';
    waveSeverityTierAr = 'بحر هائج (Rough)';
    safetyAlertAr = 'تحذير للملاحة الصغيرة؛ صعوبة في عمليات الشحن';
    urgency = 'priority';
  } else if (port.waveHeightM >= 2.0) {
    waveSeverityTier = 'caution';
    waveSeverityTierAr = 'بحر متوسط الاضطراب';
    safetyAlertAr = 'ملاحة حذرة للسفن الصغيرة';
    urgency = 'priority';
  }

  return {
    portId: port.portId,
    portNameAr: port.portNameAr,
    waveSeverityTier,
    waveSeverityTierAr,
    navigationStatusAr: port.navigationStatus === 'all_shipping_suspended' ? 'متوقفة تماماً' : 'مقيدة',
    safetyAlertAr,
    urgency
  };
}
