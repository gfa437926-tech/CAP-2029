/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HazardCategory = 
  | 'meteorological' // جوية
  | 'hydrological'    // مائية
  | 'geological'     // جيولوجية وزلزالية
  | 'wildfire'       // حرائق
  | 'maritime'       // بحرية
  | 'health'         // صحية
  | 'environmental'  // بيئية
  | 'technological'; // تقنية وصناعية

export type HazardSeverity = 'informational' | 'minor' | 'moderate' | 'severe' | 'extreme';

export type SectorType = 
  | 'meteorology'      // الأرصاد الجوية والمناخ
  | 'emergency_mgmt'   // الطوارئ وإدارة الكوارث والدفاع المدني
  | 'health_services'  // الصحة والإسعاف
  | 'agriculture'      // الزراعة والأمن الغذائي
  | 'aviation'         // الطيران المدني والمطارات
  | 'maritime_ports'   // الموانئ والنقل البحري
  | 'geological'       // المركز الوطني للزلازل والجيولوجيا
  | 'traffic_transit'  // المرور وهندسة الطرق والجسور
  | 'water_resources'  // الموارد المائية والسدود
  | 'environment';     // البيئة والغابات

export type DataClassification = 'public' | 'restricted' | 'sensitive' | 'top_secret';

export interface HazardDefinition {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: HazardCategory;
  primarySector: SectorType;
  participatingSectors: SectorType[];
  dataSources: string[];
  monitoringUnit: string;
  confidenceThreshold: string;
  alertLevels: {
    level: HazardSeverity;
    triggerCondition: string;
    actionRequired: string;
  }[];
  impactedVulnerabilities: string[];
  syrianStandardOrgRef?: string;
}

export interface NationalDataSource {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  ownerMinistry: string;
  category: HazardCategory;
  collectionMethod: 'telemetry' | 'satellite' | 'radar' | 'iot_sensor' | 'field_report' | 'api';
  updateFrequency: string;
  accuracy: string;
  dataClassification: DataClassification;
  fallbackStrategy: string;
  activeStatus: 'active' | 'under_review' | 'planned';
}

export interface SectorOperationalRole {
  sector: SectorType;
  nameAr: string;
  mandateAr: string;
  alertAuthoringPermitted: boolean;
  alertApprovalRequired: boolean;
  publicBroadcastingPermitted: boolean;
  primaryResponseActions: string[];
}
