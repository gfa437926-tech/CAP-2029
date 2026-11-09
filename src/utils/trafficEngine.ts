/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadHazardRecord } from '../../server/wamsDataStore';

export interface TrafficRiskAssessmentResult {
  roadId: string;
  highwayNameAr: string;
  roadRiskTier: 'open' | 'caution' | 'closed';
  roadRiskTierAr: string;
  hazardDescriptionAr: string;
  safetyAlertAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Assesses Road Traffic Risk based on weather conditions and reported hazards
 */
export function evaluateTrafficOperationalRisk(
  road: RoadHazardRecord,
  weatherVisibilityKm: number,
  isIcy: boolean
): TrafficRiskAssessmentResult {
  let roadRiskTier: 'open' | 'caution' | 'closed' = 'open';
  let roadRiskTierAr = 'طريق سالك (Open)';
  let safetyAlertAr = 'ظروف مرورية طبيعية';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';

  // Risk assessment logic
  if (road.status === 'closed_flood' || road.status === 'closed_snow' || road.status === 'closed_landslide') {
    roadRiskTier = 'closed';
    roadRiskTierAr = 'طريق مغلق (Closed)';
    safetyAlertAr = `إغلاق الطريق: ${road.reportedHazardAr}`;
    urgency = 'emergency';
  } else if (isIcy || weatherVisibilityKm < 2.0) {
    roadRiskTier = 'caution';
    roadRiskTierAr = 'طريق بحذر (Caution)';
    safetyAlertAr = 'يُنصح بالقيادة بحذر شديد بسبب انعدام الرؤية أو تشكل الجليد';
    urgency = 'priority';
  } else if (road.status === 'caution') {
    roadRiskTier = 'caution';
    roadRiskTierAr = 'طريق بحذر (Caution)';
    safetyAlertAr = road.reportedHazardAr;
    urgency = 'priority';
  }

  return {
    roadId: road.roadId,
    highwayNameAr: road.highwayNameAr,
    roadRiskTier,
    roadRiskTierAr,
    hazardDescriptionAr: road.reportedHazardAr,
    safetyAlertAr,
    urgency
  };
}
