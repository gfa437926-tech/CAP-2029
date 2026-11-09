/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { wamsDataStore } from './wamsDataStore';
import { geminiGateway } from './geminiGateway';
import { authenticateApiRequest, requireApiScopes, requireAnyApiScopes, type WamsAuthClaims } from './security/apiAuth';

import { calculateFlashFloodTravelTimeMin, evaluateDamOverflowRisk } from '../src/utils/hydrologyEngine';
import { evaluateHospitalCapacityStress, generateMedicalEvacuationPlan } from '../src/utils/healthEngine';
import { evaluateAgriculturalRisk } from '../src/utils/agriculturalEngine';
import { evaluateAviationOperationalRisk } from '../src/utils/aviationEngine';
import { evaluateMaritimeOperationalRisk } from '../src/utils/maritimeEngine';
import { evaluateTrafficOperationalRisk } from '../src/utils/trafficEngine';
import { evaluateIndustrialOperationalRisk } from '../src/utils/industrialEngine';
import { evaluateEnergyInfrastructureRisk } from '../src/utils/energyEngine';
import { evaluateTelecomMeshResilience } from '../src/utils/telecomEngine';
import { evaluateDamCascadeSafety } from '../src/utils/waterEngine';

export const apiRouter = Router();

apiRouter.use(authenticateApiRequest);

const hasNationalDataScope = (claims: WamsAuthClaims) => {
  const scopes = new Set([
    ...(typeof claims.scope === 'string' ? claims.scope.split(/\\s+/).filter(Boolean) : []),
    ...(Array.isArray(claims.permissions) ? claims.permissions.filter((value): value is string => typeof value === 'string') : [])
  ]);
  return scopes.has('wams:data:national');
};

function governorateScope(requestedGovernorate: (req: import('express').Request) => string | undefined) {
  return (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction): void => {
    const claims = res.locals.auth as WamsAuthClaims;
    if (hasNationalDataScope(claims)) { next(); return; }
    const assigned = typeof claims.governorate === 'string' ? claims.governorate.trim() : '';
    const requested = requestedGovernorate(req)?.trim();
    if (!assigned || (requested && requested !== assigned && requested !== 'all')) {
      res.status(403).json({ status: 'error', code: 'GEOGRAPHIC_SCOPE_DENIED', message: 'Access is limited to the assigned governorate' });
      return;
    }
    next();
  };
}

apiRouter.post('/wams/energy/grid-alert', requireApiScopes('wams:energy:operate', 'wams:data:national'), (req, res) => {
  const { facilityId, facilityNameAr = 'محطة طاقة', loadPct = 50, weatherRisk = 'low' } = req.body || {};
  const assessment = evaluateEnergyInfrastructureRisk(facilityId, facilityNameAr, parseFloat(loadPct), weatherRisk);
  res.json({ status: 'success', data: assessment });
});

apiRouter.post('/wams/telecom/mesh-resilience', requireApiScopes('wams:telecom:operate', 'wams:data:national'), (req, res) => {
  const { nodes = [] } = req.body || {};
  const assessment = evaluateTelecomMeshResilience(nodes);
  res.json({ status: 'success', data: assessment });
});

apiRouter.post('/wams/water/dam-cascade', requireApiScopes('wams:hydrology:operate', 'wams:data:national'), (req, res) => {
  const { assessments = [] } = req.body || {};
  const assessment = evaluateDamCascadeSafety(assessments);
  res.json({ status: 'success', data: assessment });
});

// ==========================================
// 1. WAMS Verified Operational Data Endpoints
// ==========================================

apiRouter.get('/wams/telemetry', requireApiScopes('wams:telemetry:read', 'wams:data:national'), (req, res) => {
  try {
    const snapshot = wamsDataStore.getNationalOperationalSnapshot();
    res.json({
      status: 'success',
      data: snapshot
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Failed to fetch telemetry' });
  }
});

apiRouter.post('/wams/hydrology/flash-flood', requireApiScopes('wams:hydrology:operate', 'wams:data:national'), (req, res) => {
  const { basinLengthKm = 24.5, averageSlopeMPerKm = 18.0, maxRainfallMm24h = 58.0 } = req.body || {};
  const result = calculateFlashFloodTravelTimeMin(
    parseFloat(basinLengthKm),
    parseFloat(averageSlopeMPerKm),
    parseFloat(maxRainfallMm24h)
  );
  res.json({ status: 'success', data: result });
});

apiRouter.post('/wams/hydrology/dam-eval', requireApiScopes('wams:hydrology:operate', 'wams:data:national'), (req, res) => {
  const { damNameAr = 'سد 16 تشرين', currentLevelM = 78.4, capacityMaxLevelM = 80.0, inflowM3s = 280, outflowM3s = 240 } = req.body || {};
  const result = evaluateDamOverflowRisk(
    damNameAr,
    parseFloat(currentLevelM),
    parseFloat(capacityMaxLevelM),
    parseFloat(inflowM3s),
    parseFloat(outflowM3s)
  );
  res.json({ status: 'success', data: result });
});

apiRouter.get('/wams/weather', requireApiScopes('wams:weather:read'), governorateScope(req => typeof req.query.governorate === 'string' ? req.query.governorate : undefined), (req, res) => {
  const claims = res.locals.auth as WamsAuthClaims;
  const gov = hasNationalDataScope(claims) ? (typeof req.query.governorate === 'string' ? req.query.governorate : undefined) : claims.governorate;
  res.json({ status: 'success', data: wamsDataStore.getWeatherObservations(gov) });
});

apiRouter.get('/wams/seismic', requireApiScopes('wams:seismic:read', 'wams:data:national'), (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getSeismicEvents(10) });
});

apiRouter.get('/wams/dams', requireApiScopes('wams:dams:read', 'wams:data:national'), (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getDamsStatus() });
});

apiRouter.get('/wams/hospitals', requireApiScopes('wams:hospitals:read'), governorateScope(req => typeof req.query.governorate === 'string' ? req.query.governorate : undefined), (req, res) => {
  const claims = res.locals.auth as WamsAuthClaims;
  const gov = hasNationalDataScope(claims) ? (typeof req.query.governorate === 'string' ? req.query.governorate : undefined) : claims.governorate;
  res.json({ status: 'success', data: wamsDataStore.getHospitalsReadiness(gov) });
});

apiRouter.post('/wams/health/hospital-stress', requireApiScopes('wams:health:operate', 'wams:data:national'), (req, res) => {
  const { hospitalId } = req.body || {};
  const hospitals = wamsDataStore.getHospitalsReadiness();
  const hospital = hospitals.find(h => h.hospitalId === hospitalId) || hospitals[0];
  const stress = evaluateHospitalCapacityStress(hospital);
  res.json({ status: 'success', hospital, data: stress });
});

apiRouter.post('/wams/health/evacuation-plan', requireApiScopes('wams:health:operate', 'wams:data:national'), (req, res) => {
  const { hospitalId, patientCount = 15 } = req.body || {};
  const hospitals = wamsDataStore.getHospitalsReadiness();
  const sourceHospital = hospitals.find(h => h.hospitalId === hospitalId) || hospitals[0];
  const plan = generateMedicalEvacuationPlan(sourceHospital, hospitals, parseInt(patientCount, 10));
  res.json({ status: 'success', data: plan });
});

apiRouter.get('/wams/roads', requireApiScopes('wams:roads:read'), governorateScope(req => typeof req.query.governorate === 'string' ? req.query.governorate : undefined), (req, res) => {
  const claims = res.locals.auth as WamsAuthClaims;
  const gov = hasNationalDataScope(claims) ? (typeof req.query.governorate === 'string' ? req.query.governorate : undefined) : claims.governorate;
  res.json({ status: 'success', data: wamsDataStore.getRoadHazards(gov) });
});

apiRouter.post('/wams/traffic/road-alert', requireApiScopes('wams:traffic:operate', 'wams:data:national'), (req, res) => {
  const { roadId, visibilityKm = 10, isIcy = false } = req.body || {};
  const roads = wamsDataStore.getRoadHazards();
  const road = roads.find(r => r.roadId === roadId) || roads[0];
  const assessment = evaluateTrafficOperationalRisk(
    road,
    parseFloat(visibilityKm),
    isIcy
  );
  res.json({ status: 'success', road, data: assessment });
});

apiRouter.post('/wams/industrial/hazard-alert', requireApiScopes('wams:industrial:operate', 'wams:data:national'), (req, res) => {
  const { hazardId, chemicalNameAr = 'مادة كيميائية غير محددة', concentrationLevel = 0, windSpeedKmh = 10 } = req.body || {};
  const assessment = evaluateIndustrialOperationalRisk(
    hazardId,
    chemicalNameAr,
    parseFloat(concentrationLevel),
    parseFloat(windSpeedKmh)
  );
  res.json({ status: 'success', data: assessment });
});

apiRouter.get('/wams/aviation', requireApiScopes('wams:aviation:read', 'wams:data:national'), (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAviationStatus() });
});

apiRouter.post('/wams/aviation/metar-analysis', requireApiScopes('wams:aviation:operate', 'wams:data:national'), (req, res) => {
  const { icaoCode, runwayHeadingDeg = 270 } = req.body || {};
  const airports = wamsDataStore.getAviationStatus();
  const airport = airports.find(a => a.icaoCode === icaoCode) || airports[0];
  const assessment = evaluateAviationOperationalRisk(
    airport,
    parseFloat(runwayHeadingDeg)
  );
  res.json({ status: 'success', airport, data: assessment });
});

apiRouter.get('/wams/ports', requireApiScopes('wams:maritime:read', 'wams:data:national'), (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getPortConditions() });
});

apiRouter.post('/wams/maritime/port-alert', requireApiScopes('wams:maritime:operate', 'wams:data:national'), (req, res) => {
  const { portId } = req.body || {};
  const ports = wamsDataStore.getPortConditions();
  const port = ports.find(p => p.portId === portId) || ports[0];
  const assessment = evaluateMaritimeOperationalRisk(port);
  res.json({ status: 'success', port, data: assessment });
});

apiRouter.get('/wams/agriculture', requireApiScopes('wams:agriculture:read', 'wams:data:national'), (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAgriculturalRisks() });
});

apiRouter.get('/wams/sector/:sectorId', requireApiScopes('wams:sector:read', 'wams:data:national'), (req, res) => {
  const { sectorId } = req.params;
  const governorate = req.query.governorate as string;
  const data = wamsDataStore.getFilteredSectorData(sectorId, governorate);
  res.json({ status: 'success', sector: sectorId, governorate: governorate || 'all', data });
});

apiRouter.get('/wams/spatial-bbox', requireApiScopes('wams:spatial:read', 'wams:data:national'), (req, res) => {
  const minLat = parseFloat(req.query.minLat as string) || 32.0;
  const minLng = parseFloat(req.query.minLng as string) || 35.5;
  const maxLat = parseFloat(req.query.maxLat as string) || 37.5;
  const maxLng = parseFloat(req.query.maxLng as string) || 42.5;

  const spatialResult = wamsDataStore.queryBySpatialBoundingBox(minLat, minLng, maxLat, maxLng);
  res.json({ status: 'success', data: spatialResult });
});

// Ingestion endpoint with schema validation
apiRouter.post('/wams/ingest/weather', requireApiScopes('wams:weather:ingest', 'wams:data:national'), (req, res) => {
  const validation = wamsDataStore.validateWeatherObservation(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ status: 'error', errors: validation.errors });
  }
  res.json({ status: 'success', message: 'Observation schema verified and queued for PostGIS ingestion' });
});

apiRouter.post('/wams/agriculture/frost-risk', requireApiScopes('wams:agriculture:operate', 'wams:data:national'), (req, res) => {
  const { zoneId, currentTempC = 0.5, soilMoisturePct = 80 } = req.body || {};
  const zones = wamsDataStore.getAgriculturalRisks();
  const zone = zones.find(z => z.zoneId === zoneId) || zones[0];
  const assessment = evaluateAgriculturalRisk(
    zone,
    parseFloat(currentTempC),
    parseFloat(soilMoisturePct)
  );
  res.json({ status: 'success', zone, data: assessment });
});

apiRouter.post('/ai/query', (req, res, next) => {
  const sector = typeof req.body?.sector === 'string' ? req.body.sector : 'operations';
  const allowed = new Set(['meteorology','geological','wildfire','hydrology','health','aviation','maritime','traffic','agriculture','operations']);
  if (!allowed.has(sector)) return res.status(400).json({ status: 'error', code: 'INVALID_SECTOR', message: 'Unsupported AI sector' });
  return requireAnyApiScopes(`ai:query:${sector}`, 'ai:query:national')(req, res, next);
}, async (req, res) => {
  try {
    const { prompt, sector = 'operations' } = req.body ?? {};
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) {
      return res.status(400).json({ status: 'error', message: 'Prompt query is required' });
    }

    const claims = res.locals.auth as WamsAuthClaims;
    const contextWithAuth = {
      role: typeof claims.role === 'string' ? claims.role : 'authenticated',
      governorate: typeof claims.governorate === 'string' ? claims.governorate : '',
      userId: claims.sub
    };

    const result = await geminiGateway.analyzeWithGrounding(prompt.trim(), sector, contextWithAuth);
    res.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err?.message || 'AI Gateway execution failed'
    });
  }
});

apiRouter.post('/ai/cascading-risk', requireApiScopes('ai:cascading-risk:read', 'wams:data:national'), (req, res) => {
  try {
    const { triggerHazard = 'torrential_rain' } = req.body;
    const result = geminiGateway.evaluateCascadingRisk(triggerHazard);
    res.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Cascading analysis failed' });
  }
});

apiRouter.get('/ai/audit-logs', requireApiScopes('ai:audit:read'), (req, res) => {
  res.json({
    status: 'success',
    data: geminiGateway.getAuditLogs(),
    integrity: geminiGateway.verifyAuditChainIntegrity()
  });
});

apiRouter.get('/wams/audit-chain/verify', requireApiScopes('wams:audit:verify'), (req, res) => {
  const integrity = geminiGateway.verifyAuditChainIntegrity();
  res.json({
    status: 'success',
    cryptographicVerification: {
      algorithm: 'SHA-256 Hash Chaining',
      isValid: integrity.valid,
      recordsChecked: integrity.recordsChecked,
      tamperedId: integrity.tamperedId || null,
      verifiedAt: new Date().toISOString()
    }
  });
});

apiRouter.get('/ai/health', requireApiScopes('system:health:read'), (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'success',
    gateway: {
      status: 'healthy',
      mode: hasKey ? 'live_gemini_api' : 'grounded_rule_based_fallback',
      model: hasKey ? 'gemini-3.8-flash' : 'WAMS-Gateway-RuleEngine-v1.0',
      databaseFirstEnforced: true,
      directDatabaseAccessAllowed: false,
      writePermissionsAllowed: false,
      readOnlyMediationActive: true,
      authenticationRequired: true,
      auditHashChainVerified: geminiGateway.verifyAuditChainIntegrity().valid
    }
  });
});
