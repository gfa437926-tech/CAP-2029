/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AviationAirportRecord } from '../../server/wamsDataStore';

export interface AviationRiskAssessmentResult {
  icaoCode: string;
  airportNameAr: string;
  crosswindKt: number;
  runwayStatusAr: string;
  visibilityCategory: 'VFR' | 'IFR' | 'LVP' | 'CLOSED';
  safetyAlertAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Parses raw METAR string to extract essential meteorological data
 */
function parseMetar(metar: string) {
  // Simplified parser for WAMS demonstration
  const windMatch = metar.match(/(\d{3})(\d{2,3})KT/);
  const visibilityMatch = metar.match(/\s(\d{4})\s/);
  
  return {
    windDir: windMatch ? parseInt(windMatch[1], 10) : 0,
    windSpeedKt: windMatch ? parseInt(windMatch[2], 10) : 0,
    visibilityM: visibilityMatch ? parseInt(visibilityMatch[1], 10) : 10000
  };
}

/**
 * Assesses Aviation Operational Risk based on METAR and Runway Conditions
 */
export function evaluateAviationOperationalRisk(
  airport: AviationAirportRecord,
  runwayHeadingDeg: number
): AviationRiskAssessmentResult {
  const { windDir, windSpeedKt, visibilityM } = parseMetar(airport.metarRaw);
  
  // Crosswind Calculation: Vw * sin(alpha)
  const angleDiff = Math.abs(windDir - runwayHeadingDeg);
  const crosswindKt = Math.round(windSpeedKt * Math.sin((angleDiff * Math.PI) / 180));

  let visibilityCategory: 'VFR' | 'IFR' | 'LVP' | 'CLOSED' = 'VFR';
  let safetyAlertAr = 'ظروف جوية طبيعية';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';

  if (visibilityM < 800 || crosswindKt > 25) {
    visibilityCategory = 'CLOSED';
    safetyAlertAr = 'المطار مغلق: رياح جانبية عاتية أو رؤية متدنية جداً';
    urgency = 'emergency';
  } else if (visibilityM < 2000 || crosswindKt > 15) {
    visibilityCategory = 'LVP';
    safetyAlertAr = 'عمليات رؤية منخفضة: تفعيل إجراءات الهبوط الآلي';
    urgency = 'priority';
  } else if (visibilityM < 5000) {
    visibilityCategory = 'IFR';
    safetyAlertAr = 'ظروف رؤية محدودة: الاعتماد على قواعد الطيران الآلي';
    urgency = 'priority';
  }

  return {
    icaoCode: airport.icaoCode,
    airportNameAr: airport.airportNameAr,
    crosswindKt,
    runwayStatusAr: airport.runwayConditionAr,
    visibilityCategory,
    safetyAlertAr,
    urgency
  };
}
