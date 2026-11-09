export type AlertSeverity = 'informational' | 'minor' | 'moderate' | 'severe' | 'extreme';
export type AlertCertainty = 'observed' | 'likely' | 'possible' | 'unlikely' | 'unknown';
export type AlertUrgency = 'immediate' | 'expected' | 'future' | 'past' | 'unknown';

export type AlertStatus = 
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'updated'
  | 'cancelled'
  | 'expired'
  | 'archived';

export type PhenomenonType = 
  | 'heavy_rain'
  | 'flash_flood'
  | 'thunderstorm'
  | 'gale_winds'
  | 'dust_storm'
  | 'dense_fog'
  | 'snowfall'
  | 'frost_ice'
  | 'heatwave'
  | 'coldwave'
  | 'marine_surge'
  | 'other';

export type UserRole = 
  | 'super_admin'
  | 'administrator'
  | 'alert_creator'
  | 'reviewer'
  | 'approver'
  | 'publisher'
  | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeoArea {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'polygon' | 'circle' | 'admin_region';
  coordinates: Coordinates[];
  center?: Coordinates;
  radiusKm?: number;
  adminCode?: string;
}

export interface AlertVersion {
  versionNumber: number;
  updatedAt: string;
  updatedBy: string;
  changeSummary: string;
  status: AlertStatus;
  headlineAr: string;
  severity: AlertSeverity;
}

export interface AlertItem {
  id: string;
  code: string;
  headlineAr: string;
  headlineEn: string;
  shortHeadlineAr: string;
  descriptionAr: string;
  descriptionEn: string;
  safetyInstructionsAr: string;
  phenomenon: PhenomenonType;
  severity: AlertSeverity;
  urgency: AlertUrgency;
  certainty: AlertCertainty;
  status: AlertStatus;
  issuerOrg: string;
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  publishedBy?: string;
  issuedAt: string;
  effectiveAt: string;
  onsetAt: string;
  expiresAt: string;
  areas: GeoArea[];
  currentVersion: number;
  versionHistory: AlertVersion[];
  capIdentifier?: string;
  sourceType: 'manual' | 'cap_import' | 'cap_feed' | 'api';
  internalNotes?: string;
  tags: string[];
}

export interface CAPMessageRecord {
  id: string;
  identifier: string;
  sender: string;
  sent: string;
  status: 'Actual' | 'Exercise' | 'System' | 'Test' | 'Draft';
  msgType: 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error';
  scope: 'Public' | 'Restricted' | 'Private';
  category: string;
  eventAr: string;
  urgency: string;
  severity: string;
  certainty: string;
  areaDesc: string;
  validationStatus: 'valid' | 'invalid' | 'warning';
  validationErrors?: string[];
  rawXml: string;
  convertedAlertId?: string;
  receivedAt: string;
}

export interface DataSourceItem {
  id: string;
  nameAr: string;
  type: 'manual' | 'cap_feed' | 'rest_api' | 'wmo_gts';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  importedCount: number;
  rejectedCount: number;
  autoDraft: boolean;
  notes: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetEntity: string;
  targetId: string;
  ipAddress: string;
  status: 'success' | 'failure';
  details: string;
}

export interface NotificationJob {
  id: string;
  alertId: string;
  event: 'new_alert' | 'update_alert' | 'escalation' | 'cancellation';
  targetGeoAreas: string[];
  severity: AlertSeverity;
  status: 'queued' | 'dispatching' | 'delivered' | 'failed' | 'retrying';
  recipientsCount: number;
  deliveredCount: number;
  createdAt: string;
  scheduledFor: string;
  retryCount: number;
  errorLog?: string;
}
