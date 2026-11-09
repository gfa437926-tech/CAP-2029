import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeCoordinate, sanitizePolygon } from '../src/utils/sanitize';
import { 
  calculatePolygonAreaSqKm, 
  isPointInPolygon, 
  checkPolygonValidity, 
  calculateCentroid,
  generateSafeQlr
} from '../src/utils/spatialQueryEngine';
import { Coordinates } from '../src/types/wams';

describe('WAMS Security & XSS Sanitization Tests', () => {
  it('should escape dangerous HTML characters to prevent XSS injection in map popups', () => {
    const maliciousInput = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    const escaped = escapeHtml(maliciousInput);

    expect(escaped).not.toContain('<script>');
    expect(escaped).not.toContain('<img');
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).toContain('&lt;img');
    expect(escaped).toContain('&gt;');
  });

  it('should handle null and undefined safely without throwing', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('should sanitize geographic coordinates and reject invalid lat/lng bounds', () => {
    expect(sanitizeCoordinate(21.54, 39.17)).toEqual({ lat: 21.54, lng: 39.17 });
    // Out of bounds
    expect(sanitizeCoordinate(95.0, 39.0)).toBeNull();
    expect(sanitizeCoordinate(-100.0, 39.0)).toBeNull();
    expect(sanitizeCoordinate(25.0, 195.0)).toBeNull();
    // NaN
    expect(sanitizeCoordinate(NaN, 39.0)).toBeNull();
  });

  it('should ensure polygon closure and discard non-polygon structures', () => {
    const openPolygon: Coordinates[] = [
      { lat: 21.0, lng: 39.0 },
      { lat: 22.0, lng: 39.5 },
      { lat: 21.5, lng: 40.0 }
    ];

    const sanitized = sanitizePolygon(openPolygon);
    expect(sanitized.length).toBe(4);
    // Last point must equal first point
    expect(sanitized[sanitized.length - 1]).toEqual(sanitized[0]);

    // Less than 3 points
    expect(sanitizePolygon([{ lat: 10, lng: 10 }])).toEqual([]);
  });
});

describe('WAMS GIS Spatial Math & PostGIS Evaluator Tests', () => {
  const jeddahPolygon: Coordinates[] = [
    { lat: 21.90, lng: 39.05 },
    { lat: 21.80, lng: 39.40 },
    { lat: 21.30, lng: 39.95 },
    { lat: 20.80, lng: 39.60 },
    { lat: 21.15, lng: 38.95 },
    { lat: 21.90, lng: 39.05 }
  ];

  it('should compute real positive geodesic area in square kilometers for polygon', () => {
    const area = calculatePolygonAreaSqKm(jeddahPolygon);
    expect(area).toBeGreaterThan(1000); // Jeddah/Makkah sector is over 1000 km²
    expect(area).toBeLessThan(100000);
  });

  it('should correctly test point-in-polygon spatial intersection (ST_Intersects)', () => {
    // Point inside Jeddah warning zone
    const insidePoint: Coordinates = { lat: 21.50, lng: 39.30 };
    expect(isPointInPolygon(insidePoint, jeddahPolygon)).toBe(true);

    // Point outside (Riyadh)
    const outsidePoint: Coordinates = { lat: 24.71, lng: 46.67 };
    expect(isPointInPolygon(outsidePoint, jeddahPolygon)).toBe(false);
  });

  it('should compute polygon centroid correctly (ST_Centroid)', () => {
    const centroid = calculateCentroid(jeddahPolygon);
    expect(centroid.lat).toBeGreaterThan(20.5);
    expect(centroid.lat).toBeLessThan(22.0);
    expect(centroid.lng).toBeGreaterThan(38.8);
    expect(centroid.lng).toBeLessThan(40.0);
  });

  it('should detect valid polygons vs self-intersecting invalid polygons (ST_IsValid)', () => {
    const valid = checkPolygonValidity(jeddahPolygon);
    expect(valid.isValid).toBe(true);

    // Self-intersecting bowtie polygon (hourglass shape)
    const bowtiePolygon: Coordinates[] = [
      { lat: 20.0, lng: 30.0 },
      { lat: 25.0, lng: 35.0 },
      { lat: 20.0, lng: 35.0 },
      { lat: 25.0, lng: 30.0 },
      { lat: 20.0, lng: 30.0 }
    ];
    const invalid = checkPolygonValidity(bowtiePolygon);
    expect(invalid.isValid).toBe(false);
  });
});

describe('WAMS QGIS Export & Safe Credentials Tests', () => {
  it('should generate QGIS .qlr layer definition file WITHOUT hardcoded passwords', () => {
    const qlrXml = generateSafeQlr();

    expect(qlrXml).toContain('<!DOCTYPE qgis-layer-definition>');
    expect(qlrXml).toContain('providerKey="postgres"');
    // Security assertion: NO plaintext passwords in exported configuration
    expect(qlrXml).not.toContain('password=');
    expect(qlrXml).not.toContain('wams_local_dev_password');
    expect(qlrXml).not.toContain('admin123');
    expect(qlrXml).toContain('srid=4326');
  });

  it('should generate valid GeoJSON structure for export', () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            code: "WAMS-SA-2026-0881",
            severity: "extreme"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[39.05, 21.9], [39.4, 21.8], [39.95, 21.3], [39.05, 21.9]]]
          }
        }
      ]
    };

    const parsed = JSON.parse(JSON.stringify(geojson));
    expect(parsed.type).toBe('FeatureCollection');
    expect(parsed.features.length).toBe(1);
    expect(parsed.features[0].geometry.type).toBe('Polygon');
    expect(parsed.features[0].properties.severity).toBe('extreme');
  });
});
