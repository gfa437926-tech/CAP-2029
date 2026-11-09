/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AISectorId =
  | 'meteorology'
  | 'seismic'
  | 'wildfire'
  | 'floods'
  | 'health'
  | 'agriculture'
  | 'aviation'
  | 'maritime'
  | 'traffic'
  | 'operations';

export interface OperationalEvidenceItem {
  label: string;
  value: string;
  source: string;
  recordId: string;
}

export interface ScientificModelResultItem {
  modelName: string;
  metric: string;
  calculatedValue: string;
  significance: string;
}

export interface GeminiInsightItem {
  category: string;
  findingAr: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface AdvisoryRecommendationItem {
  targetSector: string;
  recommendedActionAr: string;
  urgency: 'routine' | 'priority' | 'emergency';
  requiresHumanSpecialistSignOff: boolean;
}

export interface AIEvidenceMetadata {
  analysisType: string;
  generatedAt: string;
  dataSourcesUsed: string[];
  recordsEvaluatedCount: number;
  missingDataFlags: string[];
  scientificLimitations: string[];
  confidenceScorePct: number;
  modelVersion: string;
  isAdvisoryOnly: boolean;
}

export interface WAMSStructuredIntelligence {
  summaryAr: string;
  operationalEvidence: OperationalEvidenceItem[];
  scientificModelResults: ScientificModelResultItem[];
  geminiAnalyticalInsights: GeminiInsightItem[];
  advisoryRecommendations: AdvisoryRecommendationItem[];
  evidence: AIEvidenceMetadata;
}

export interface CascadingRiskChainStage {
  stage: number;
  hazard: string;
  affectedLayer: string;
  probabilityPct: number;
  dataGrounding: string;
}

export interface CascadingRiskSimulation {
  simulationId: string;
  evaluatedAt: string;
  primaryTrigger: string;
  cascadingChain: CascadingRiskChainStage[];
  interventionsRecommended: {
    priority: number;
    actionAr: string;
  }[];
}

export interface AIAuditLogItem {
  id: string;
  timestamp: string;
  queryOrSector: string;
  userId: string;
  clientIp: string;
  toolsInvoked: string[];
  recordsReadCount: number;
  tokensUsedEstimate: number;
  confidenceScorePct: number;
  executionStatus: 'success' | 'fallback_rule_based' | 'sanitized_blocked';
  latencyMs: number;
}
