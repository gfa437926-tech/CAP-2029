/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coordinates } from '../types/wams';

/**
 * Escapes potentially dangerous characters in HTML strings to prevent Cross-Site Scripting (XSS).
 */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips all HTML tags from an input string.
 */
export function stripHtml(input: string | null | undefined): string {
  if (input == null) return '';
  return String(input).replace(/<[^>]*>/g, '').trim();
}

/**
 * Validates and sanitizes geographic coordinates within valid world bounds (-90 to 90 lat, -180 to 180 lng).
 */
export function sanitizeCoordinate(lat: number, lng: number): Coordinates | null {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6))
  };
}

/**
 * Validates polygon closure and topology. Ensures the polygon has at least 3 points,
 * sanitizes all coordinates, and ensures the last point closes onto the first point.
 */
export function sanitizePolygon(coords: Coordinates[]): Coordinates[] {
  if (!Array.isArray(coords) || coords.length < 3) {
    return [];
  }

  const validPoints: Coordinates[] = [];
  for (const pt of coords) {
    const sanitized = sanitizeCoordinate(pt.lat, pt.lng);
    if (sanitized) {
      validPoints.push(sanitized);
    }
  }

  if (validPoints.length < 3) {
    return [];
  }

  // Ensure closure
  const first = validPoints[0];
  const last = validPoints[validPoints.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    validPoints.push({ lat: first.lat, lng: first.lng });
  }

  return validPoints;
}
