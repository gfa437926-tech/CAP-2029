/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DamOverflowAssessmentResult } from './hydrologyEngine';

export interface DamCascadeSafetyResult {
  cascadeStatus: 'stable' | 'warning' | 'alert';
  cascadeStatusAr: string;
  totalDownstreamRisk: 'normal' | 'moderate' | 'high';
  mitigationActionAr: string;
}

/**
 * Assesses Safety of Dam Cascade
 */
export function evaluateDamCascadeSafety(damAssessments: DamOverflowAssessmentResult[]): DamCascadeSafetyResult {
  const isAlert = damAssessments.some(d => d.urgency === 'emergency');
  
  return {
    cascadeStatus: isAlert ? 'alert' : 'stable',
    cascadeStatusAr: isAlert ? 'تحذير سلسلة سدود (Cascade Alert)' : 'سلسلة سدود مستقرة',
    totalDownstreamRisk: isAlert ? 'high' : 'normal',
    mitigationActionAr: isAlert ? 'تفريغ طوارئ منسق' : 'مراقبة روتينية'
  };
}
