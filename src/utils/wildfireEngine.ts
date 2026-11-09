/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FwiRiskTier = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';

export interface FwiAssessmentResult {
  fwiScore: number;
  fwiRiskTier: FwiRiskTier;
  riskTierAr: string;
  recommendedPrecautionAr: string;
}

/**
 * Calculates Canadian Fire Weather Index (FWI) approximation based on weather metrics
 */
export function calculateFireWeatherIndexFWI(
  tempC: number,
  humidityPct: number,
  windSpeedKmh: number,
  rain24hMm: number
): FwiAssessmentResult {
  // Drought & dryness factor
  const drynessFactor = Math.max(0, (tempC - 10) * 1.8 + (100 - humidityPct) * 0.8 - rain24hMm * 2.5);
  // Wind multiplication factor
  const windFactor = 1 + Math.max(0, windSpeedKmh - 10) * 0.04;

  const rawScore = drynessFactor * windFactor;
  const fwiScore = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));

  let fwiRiskTier: FwiRiskTier = 'low';
  let riskTierAr = 'منخفض (Low)';
  let recommendedPrecautionAr = 'ظروف رطوبة آمنة؛ مراقبة اعتيادية';

  if (fwiScore >= 75) {
    fwiRiskTier = 'extreme';
    riskTierAr = 'خطر كارثي أقصى (Extreme)';
    riskTierAr = 'خطر كارثي أقصى (Extreme)';
    recommendedPrecautionAr = 'تجهيز صهاريج الإطفاء مسبقاً في النقاط الحرجة وتفعيل غرف العمليات الطارئة';
  } else if (fwiScore >= 55) {
    fwiRiskTier = 'very_high';
    riskTierAr = 'مرتفع جداً (Very High)';
    recommendedPrecautionAr = 'حظر إشعال النيران كلياً في الأراضي الحراجية والزراعية المجاورة';
  } else if (fwiScore >= 35) {
    fwiRiskTier = 'high';
    riskTierAr = 'مرتفع (High)';
    recommendedPrecautionAr = 'تجهيز فرق Patrol الميدانية وتنبيه المزارعين';
  } else if (fwiScore >= 18) {
    fwiRiskTier = 'moderate';
    riskTierAr = 'متوسط (Moderate)';
    recommendedPrecautionAr = 'مراقبة هبات الرياح والجفاف السطحي للأوراق';
  }

  return { fwiScore, fwiRiskTier, riskTierAr, recommendedPrecautionAr };
}

/**
 * Calculates Rothermel-based Wildfire Spread Rate in meters per minute
 */
export function calculateWildfireSpreadRateMPerMin(
  windSpeedKmh: number,
  slopeDeg: number,
  fuelTypeFactor: number = 1.2
): {
  spreadRateMPerMin: number;
  spreadRateKmPerHour: number;
  isRapidSpread: boolean;
} {
  // Wind factor effect on head fire spread
  const windEffect = Math.pow(Math.max(0, windSpeedKmh) / 10, 1.4);
  // Terrain slope effect: steeper slopes accelerate head fire spread
  const slopeEffect = Math.exp(Math.tan((Math.max(0, slopeDeg) * Math.PI) / 180) * 3.5);

  const baseRate = 1.8 * fuelTypeFactor;
  const spreadRateMPerMin = Math.round((baseRate + windEffect * 3.2 + (slopeEffect - 1) * 2.5) * 10) / 10;
  const spreadRateKmPerHour = Math.round((spreadRateMPerMin * 0.06) * 100) / 100;

  return {
    spreadRateMPerMin,
    spreadRateKmPerHour,
    isRapidSpread: spreadRateMPerMin >= 10.0
  };
}

/**
 * Classifies thermal hotspots detected by satellite sensors (VIIRS / MODIS)
 */
export function classifyThermalHotspot(
  frpMw: number,
  confidencePct: number
): {
  classification: 'confirmed_wildfire' | 'controlled_agricultural_burn' | 'thermal_anomaly';
  classificationAr: string;
  actionRequiredAr: string;
} {
  if (frpMw >= 25 && confidencePct >= 80) {
    return {
      classification: 'confirmed_wildfire',
      classificationAr: 'حريق حراجي نشط مؤكد الفعالية',
      actionRequiredAr: 'إرسال أفواج الإطفاء والدفاع المدني فوراً إلى الإحداثيات المحددة'
    };
  }

  if (frpMw < 10) {
    return {
      classification: 'controlled_agricultural_burn',
      classificationAr: 'بؤرة حرارية خفيفة (مخلفات زراعية أو مصدر صناعي)',
      actionRequiredAr: 'التحقق الميداني من مركز المنطقة دون إعلان طوارئ'
    };
  }

  return {
    classification: 'thermal_anomaly',
    classificationAr: 'بؤرة حرارية محتملة تحت الفحص',
    actionRequiredAr: 'توجيه طائرة استطلاع أو برج مراقبة حراجي للتحقق البصري'
  };
}
