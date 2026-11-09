/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlashFloodTravelTimeResult {
  waveSpeedMPerSec: number;
  waveSpeedKmPerHour: number;
  travelTimeMinutes: number;
  travelTimeHours: number;
  floodSeverityTier: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  floodSeverityTierAr: string;
}

export interface DamOverflowAssessmentResult {
  storagePct: number;
  freeboardM: number;
  netInflowM3s: number;
  spillwayStatusAr: string;
  downstreamRiskTierAr: string;
  recommendedSpillwayDischargeM3s: number;
  urgency: 'routine' | 'priority' | 'emergency';
}

/**
 * Calculates Flash Flood Surge Wave Travel Time (Manning-Kirpich Empirical Hydraulic Formula)
 */
export function calculateFlashFloodTravelTimeMin(
  basinLengthKm: number,
  averageSlopeMPerKm: number,
  maxRainfallMm24h: number
): FlashFloodTravelTimeResult {
  const slopeRatio = Math.max(0.001, averageSlopeMPerKm / 1000);
  const lengthMeters = basinLengthKm * 1000;

  // Kirpich time of concentration formula in minutes
  const tcMinutes = 0.0195 * Math.pow(lengthMeters, 0.77) * Math.pow(slopeRatio, -0.385);
  // Rain intensity amplification
  const rainAmplification = Math.max(0.7, Math.min(2.5, maxRainfallMm24h / 40.0));

  const finalTravelTimeMin = Math.round((tcMinutes / rainAmplification) * 10) / 10;
  const finalTravelTimeHours = Math.round((finalTravelTimeMin / 60) * 100) / 100;

  const waveSpeedMPerSec = Math.round((lengthMeters / (finalTravelTimeMin * 60)) * 10) / 10;
  const waveSpeedKmPerHour = Math.round((waveSpeedMPerSec * 3.6) * 10) / 10;

  let floodSeverityTier: 'minor' | 'moderate' | 'severe' | 'catastrophic' = 'minor';
  let floodSeverityTierAr = 'طفيف (Normal Runoff)';

  if (maxRainfallMm24h >= 65 || waveSpeedKmPerHour >= 20) {
    floodSeverityTier = 'catastrophic';
    floodSeverityTierAr = 'سيل جرفي استثنائي كارثي (Catastrophic Flash Surge)';
  } else if (maxRainfallMm24h >= 45) {
    floodSeverityTier = 'severe';
    floodSeverityTierAr = 'سيل جافري شديد (Severe Torrent)';
  } else if (maxRainfallMm24h >= 25) {
    floodSeverityTier = 'moderate';
    floodSeverityTierAr = 'سيل متوسط في الأودية الجبلية (Moderate Torrent)';
  }

  return {
    waveSpeedMPerSec,
    waveSpeedKmPerHour,
    travelTimeMinutes: finalTravelTimeMin,
    travelTimeHours: finalTravelTimeHours,
    floodSeverityTier,
    floodSeverityTierAr
  };
}

/**
 * Evaluates Hydroelectric Dam Overflow & Spillway Surcharge
 */
export function evaluateDamOverflowRisk(
  damNameAr: string,
  currentLevelM: number,
  capacityMaxLevelM: number,
  inflowM3s: number,
  outflowM3s: number
): DamOverflowAssessmentResult {
  const freeboardM = Math.round((capacityMaxLevelM - currentLevelM) * 100) / 100;
  const storagePct = Math.min(100, Math.round((currentLevelM / capacityMaxLevelM) * 1000) / 10);
  const netInflowM3s = Math.round((inflowM3s - outflowM3s) * 10) / 10;

  let spillwayStatusAr = 'بوابات التفريغ مغلقة (طبيعي)';
  let downstreamRiskTierAr = 'آمن (Normal)';
  let urgency: 'routine' | 'priority' | 'emergency' = 'routine';
  let recommendedSpillwayDischargeM3s = outflowM3s;

  if (storagePct >= 95 || freeboardM <= 1.5) {
    spillwayStatusAr = 'تحذير مفيض طارئ (Overflow Warning)';
    downstreamRiskTierAr = 'خطورة غمر مرتفعة للبلدات الواقعة أدنى السد';
    urgency = 'emergency';
    recommendedSpillwayDischargeM3s = Math.max(outflowM3s, inflowM3s * 1.15);
  } else if (storagePct >= 85 || freeboardM <= 3.0) {
    spillwayStatusAr = 'تفريغ محكوم وقائي (Controlled Discharge)';
    downstreamRiskTierAr = 'مراقبة حذرة لمجرى النهر الرئيسي';
    urgency = 'priority';
    recommendedSpillwayDischargeM3s = Math.max(outflowM3s, inflowM3s);
  }

  return {
    storagePct,
    freeboardM,
    netInflowM3s,
    spillwayStatusAr,
    downstreamRiskTierAr,
    recommendedSpillwayDischargeM3s: Math.round(recommendedSpillwayDischargeM3s),
    urgency
  };
}
