import { createPublicKey, verify as verifySignature } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export interface WamsAuthClaims {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  nbf?: number;
  iat?: number;
  scope?: string;
  permissions?: string[];
  role?: string;
  governorate?: string;
}

const unauthorized = (res: Response) =>
  res.status(401).json({ status: 'error', code: 'UNAUTHENTICATED', message: 'Authentication is required' });

function decodeSegment(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

export function verifyAccessToken(token: string, nowSeconds = Math.floor(Date.now() / 1000)): WamsAuthClaims {
  if (!token || token.length > 16_384) throw new Error('Invalid token size');

  const publicKeyPem = process.env.WAMS_AUTH_PUBLIC_KEY?.replace(/\\n/g, '\n');
  const issuer = process.env.WAMS_AUTH_ISSUER;
  const audience = process.env.WAMS_AUTH_AUDIENCE;
  if (!publicKeyPem || !issuer || !audience) throw new Error('Authentication is not configured');

  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(part => !part)) throw new Error('Malformed token');

  const header = decodeSegment(parts[0]) as { alg?: string; typ?: string };
  if (header.alg !== 'RS256' || (header.typ && header.typ !== 'JWT')) throw new Error('Unsupported token algorithm');

  const signedContent = Buffer.from(parts[0] + '.' + parts[1], 'ascii');
  const signature = Buffer.from(parts[2], 'base64url');
  const publicKey = createPublicKey(publicKeyPem);
  if (publicKey.asymmetricKeyType !== 'rsa' || !verifySignature('RSA-SHA256', signedContent, publicKey, signature)) {
    throw new Error('Invalid token signature');
  }

  const claims = decodeSegment(parts[1]) as Partial<WamsAuthClaims>;
  if (!claims || typeof claims !== 'object' || typeof claims.sub !== 'string' || !claims.sub.trim()) {
    throw new Error('Missing subject');
  }
  if (claims.iss !== issuer) throw new Error('Invalid issuer');
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(audience)) throw new Error('Invalid audience');
  if (typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp <= nowSeconds) {
    throw new Error('Expired or missing expiration');
  }
  if (claims.nbf !== undefined && (typeof claims.nbf !== 'number' || claims.nbf > nowSeconds)) {
    throw new Error('Token is not active');
  }
  if (claims.iat !== undefined && (typeof claims.iat !== 'number' || claims.iat > nowSeconds + 60)) {
    throw new Error('Invalid issued-at time');
  }

  return claims as WamsAuthClaims;
}

export function authenticateApiRequest(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.header('authorization') || '';
  const match = /^Bearer ([A-Za-z0-9._~-]+)$/.exec(authorization);
  if (!match) {
    unauthorized(res);
    return;
  }

  try {
    res.locals.auth = verifyAccessToken(match[1]);
    next();
  } catch {
    unauthorized(res);
  }
}

export function requireApiScopes(...requiredScopes: string[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const claims = res.locals.auth as WamsAuthClaims | undefined;
    if (!claims) {
      unauthorized(res);
      return;
    }

    const granted = new Set<string>([
      ...(typeof claims.scope === 'string' ? claims.scope.split(/\s+/).filter(Boolean) : []),
      ...(Array.isArray(claims.permissions) ? claims.permissions.filter((value): value is string => typeof value === 'string') : [])
    ]);

    if (!requiredScopes.every(scope => granted.has(scope))) {
      res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

export function requireAnyApiScopes(...requiredScopes: string[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const claims = res.locals.auth as WamsAuthClaims | undefined;
    if (!claims) {
      unauthorized(res);
      return;
    }

    const granted = new Set<string>([
      ...(typeof claims.scope === 'string' ? claims.scope.split(/\\s+/).filter(Boolean) : []),
      ...(Array.isArray(claims.permissions) ? claims.permissions.filter((value): value is string => typeof value === 'string') : [])
    ]);

    if (!requiredScopes.some(scope => granted.has(scope))) {
      res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
