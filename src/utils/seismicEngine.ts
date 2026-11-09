/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coordinates } from '../types/wams';

/**
 * Velocity model parameters for Levant/Syrian crustal lithosphere
 * Vp = 6.0 km/s (Compressional Primary P-Wave velocity)
 * Vs = 3.5 km/s (Shear Secondary S-Wave velocity)
 */
const VP_KM_PER_SEC = 6.0;
const VS_KM_PER_SEC = 3.5;

/**
 * Calculates geodesic distance between two lat/lng coordinates (Haversine Formula)
 */
export function calculateGeodesicDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates P-Wave and S-Wave arrival times and lead time window (in seconds)
 */
export function calculatePtoSLeadTimeSec(
  epicenter: Coordinates,
  depthKm: number,
  station: Coordinates
): {
  epicentralDistanceKm: number;
  hypocentralDistanceKm: number;
  pWaveArrivalSec: number;
  sWaveArrivalSec: number;
  sWaveLeadTimeSec: number;
} {
  const epicentralDistanceKm = calculateGeodesicDistanceKm(epicenter, station);
  const hypocentralDistanceKm = Math.sqrt(epicentralDistanceKm * epicentralDistanceKm + depthKm * depthKm);

  const pWaveArrivalSec = hypocentralDistanceKm / VP_KM_PER_SEC;
  const sWaveArrivalSec = hypocentralDistanceKm / VS_KM_PER_SEC;
  const sWaveLeadTimeSec = Math.max(0, sWaveArrivalSec - pWaveArrivalSec);

  return {
    epicentralDistanceKm: Math.round(epicentralDistanceKm * 10) / 10,
    hypocentralDistanceKm: Math.round(hypocentralDistanceKm * 10) / 10,
    pWaveArrivalSec: Math.round(pWaveArrivalSec * 10) / 10,
    sWaveArrivalSec: Math.round(sWaveArrivalSec * 10) / 10,
    sWaveLeadTimeSec: Math.round(sWaveLeadTimeSec * 10) / 10
  };
}

/**
 * Estimates Peak Ground Acceleration (PGA in g) and MMI Intensity using Esteva-Villaverde attenuation
 */
export function evaluateShakeMapIntensity(
  magnitudeMl: number,
  depthKm: number,
  epicentralDistanceKm: number
): {
  pgaG: number;
  mmiIntensityAr: string;
  perceivedShakingAr: string;
  potentialDamageAr: string;
} {
  const hypocentralDistKm = Math.max(5, Math.sqrt(epicentralDistanceKm * epicentralDistanceKm + depthKm * depthKm));

  // Esteva attenuation formula approximation for PGA in cm/s²
  const pgaCms2 = (5600 * Math.exp(0.8 * magnitudeMl)) / Math.pow(hypocentralDistKm + 40, 2.0);
  const pgaG = Math.round((pgaCms2 / 980.665) * 1000) / 1000; // convert cm/s² to g

  let mmiIntensityAr = 'I (غير محسوس)';
  let perceivedShakingAr = 'لا يوجد شعور';
  let potentialDamageAr = 'لا يوجد أي ضرر';

  if (pgaG >= 0.35) {
    mmiIntensityAr = 'IX (عنيف)';
    perceivedShakingAr = 'اهتزاز شديد جداً وعنيف';
    potentialDamageAr = 'أضرار جسيمة بالمباني العادية وتخلخل في المنشآت غير المقاومة للزلازل';
  } else if (pgaG >= 0.18) {
    mmiIntensityAr = 'VIII (شداد)';
    perceivedShakingAr = 'اهتزاز شديد';
    potentialDamageAr = 'أضرار متوسطة إلى طفيفة للمباني المصممة حديثاً';
  } else if (pgaG >= 0.09) {
    mmiIntensityAr = 'VII (قوي)';
    perceivedShakingAr = 'اهتزاز قوي ملموس لدى الجميع';
    potentialDamageAr = 'تساقط قطع طين وتشققات جصية بسيطة';
  } else if (pgaG >= 0.04) {
    mmiIntensityAr = 'VI (معتدل)';
    perceivedShakingAr = 'اهتزاز معتدل يشعر به معظم السكان';
    potentialDamageAr = 'تساقط الأواني والأغراض المعلقة';
  } else if (pgaG >= 0.015) {
    mmiIntensityAr = 'IV - V (خفيف إلى متوسط)';
    perceivedShakingAr = 'شبه اهتزاز الشاحنات المارة';
    potentialDamageAr = 'لا توجد أضرار إنشائية';
  }

  return { pgaG, mmiIntensityAr, perceivedShakingAr, potentialDamageAr };
}

/**
 * Strictly rejects unscientific claims asserting earthquake time prediction
 */
export function rejectUnscientificPredictionClaim(queryText: string): { isPredictionClaim: boolean; ScientificStatementAr: string } {
  const predictionKeywords = [
    /التنبؤ\s+بموعد\s+الزلزال/i,
    /متى\s+سيقع\s+الزلزال/i,
    /توقع\s+ساعة\s+الزلزال/i,
    /predict\s+earthquake\s+time/i
  ];

  const isPredictionClaim = predictionKeywords.some(pattern => pattern.test(queryText));

  return {
    isPredictionClaim,
    ScientificStatementAr: 'التنبيه العلمي الإلزامي: لا يمتلك أي علم أو تقنية في العالم القدرة على التنبؤ بموعد ومكان الزلزال مسبقاً. إن منظومة الإنذار المبكر تبدأ فور رصد موجات P الأولية بعد بدء الحدث التكتوني فقط.'
  };
}
