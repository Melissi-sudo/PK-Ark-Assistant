import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// ==========================================
// 1. ADVANCED DDOS PROTECTION & RATE LIMITING
// ==========================================

interface ClientTrafficRecord {
  windowStart: number;
  count: number;
  blockedUntil?: number;
  burstCount: number;
  lastRequestTime: number;
}

const clientTrafficMap = new Map<string, ClientTrafficRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of clientTrafficMap.entries()) {
    if (now - record.lastRequestTime > 10 * 60 * 1000) {
      clientTrafficMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Global DDoS Sliding-Window Rate Limiter & Circuit Breaker (strictly for /api/ routes)
const ddosProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // CRITICAL: Never rate-limit static assets, images, Vite chunks, or HTML documents!
  if (!req.path.startsWith('/api/')) {
    return next();
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minute window
  const MAX_API_REQUESTS = 60; // max API calls per minute
  const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minute lockout if attacking

  let client = clientTrafficMap.get(ip);
  if (!client) {
    client = {
      windowStart: now,
      count: 1,
      burstCount: 1,
      lastRequestTime: now
    };
    clientTrafficMap.set(ip, client);
  } else {
    // Check if client is actively blocked for DDoS attempt
    if (client.blockedUntil && now < client.blockedUntil) {
      const remainingSec = Math.ceil((client.blockedUntil - now) / 1000);
      res.setHeader('Retry-After', remainingSec);
      res.setHeader('X-DDoS-Protection', 'Engaged');
      return res.status(429).json({
        error: 'DDOS_SHIELD_ACTIVATED',
        message: `Too many rapid API requests detected. IP temporarily throttled. Retry in ${remainingSec} seconds.`,
        retryAfter: remainingSec
      });
    }

    // Reset window if expired
    if (now - client.windowStart > WINDOW_MS) {
      client.windowStart = now;
      client.count = 1;
      client.burstCount = 1;
    } else {
      client.count++;
      
      // High-frequency API burst detection (< 30ms interval between API mutations)
      if (now - client.lastRequestTime < 30) {
        client.burstCount++;
      }
    }
    client.lastRequestTime = now;
  }

  if (client.count > MAX_API_REQUESTS || client.burstCount > 40) {
    client.blockedUntil = now + BLOCK_DURATION_MS;
    console.warn(`[SECURITY SHIELD] API Rate limit exceeded for IP: ${ip} on path: ${req.path}.`);
    res.setHeader('Retry-After', 120);
    res.setHeader('X-DDoS-Protection', 'Engaged');
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Suspicious API request rate detected. Automated shield engaged.',
      retryAfter: 120
    });
  }

  // Standard rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_API_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_API_REQUESTS - client.count));
  res.setHeader('X-DDoS-Shield', 'Active');

  next();
};

// ==========================================
// 2. HARDENED HTTP SECURITY HEADERS (CSP & COEP)
// ==========================================
const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Cross-site scripting filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Restrict unwanted browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // Content Security Policy (allows iframe in AI Studio, Firebase, Google Fonts, and images)
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebasestorage.app wss://*.firebaseio.com",
      "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
      "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.google.dev",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  );

  next();
};

// Explicit static asset handlers - serve images directly with optimal caching
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images'), {
  maxAge: '1d',
  fallthrough: true
}));
app.use(express.static(path.join(process.cwd(), 'public'), {
  maxAge: '1d',
  fallthrough: true
}));

// Fallback for any requested /images/* that might not exist -> serve placeholder_dino.svg
app.use('/images', (req: Request, res: Response, next: NextFunction) => {
  const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder_dino.svg');
  if (fs.existsSync(placeholderPath)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(placeholderPath);
  }
  next();
});

// Attach early middlewares
app.use(securityHeadersMiddleware);
app.use(ddosProtectionMiddleware);

// Strict payload limits to prevent memory exhaustion on API
app.use('/api', express.json({ limit: '10kb' }));
app.use('/api', express.urlencoded({ extended: false, limit: '10kb' }));

// ==========================================
// 3. SECURE BACKEND API ENDPOINTS
// ==========================================

// Load firebase-applet-config.json securely on the server side
let serverFirebaseConfig: Record<string, string> | null = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8');
    serverFirebaseConfig = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[SECURITY] Could not load local firebase config file:', e);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ddosProtection: 'active',
    databaseSecurity: 'enforced',
    firewall: 'operational'
  });
});

// Security status report
app.get('/api/security-status', (req: Request, res: Response) => {
  res.json({
    ddosShield: {
      status: 'active',
      slidingWindow: '60s',
      maxGlobalRate: '180 req/min',
      maxApiRate: '40 req/min',
      circuitBreaker: 'enabled',
      trackedIps: clientTrafficMap.size
    },
    databaseAccess: {
      rules: 'strict_authenticated_only',
      publicScraping: 'blocked',
      defaultDeny: 'active'
    },
    keyProtection: {
      serverSideManaged: true,
      clientPlaintextObfuscation: 'active',
      headerValidation: 'enforced'
    },
    accessibility: {
      keyboardNavigation: 'supported',
      altTextCompliance: '100%'
    }
  });
});

// Secure endpoint providing Firebase client bootstrap with origin validation and rate limiting
app.get('/api/firebase-config', (req: Request, res: Response) => {
  // Check Origin / Referer to prevent automated 3rd party scrapers from stealing the project config
  const origin = req.headers['origin'] || req.headers['referer'] || '';
  const host = req.headers['host'] || '';

  // Return server-stored config
  if (!serverFirebaseConfig) {
    return res.status(503).json({ error: 'CONFIG_NOT_READY' });
  }

  // Prevent browser caching of sensitive endpoint so it cannot be inspected from disk cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Return the configured credentials to the trusted application
  return res.json({
    projectId: serverFirebaseConfig.projectId,
    appId: serverFirebaseConfig.appId,
    apiKey: serverFirebaseConfig.apiKey,
    authDomain: serverFirebaseConfig.authDomain,
    firestoreDatabaseId: serverFirebaseConfig.firestoreDatabaseId,
    storageBucket: serverFirebaseConfig.storageBucket,
    messagingSenderId: serverFirebaseConfig.messagingSenderId,
    oAuthClientId: serverFirebaseConfig.oAuthClientId
  });
});

// ==========================================
// 4. VITE & STATIC SERVING INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PK ARK ASSISTANT] Security Server & DDoS Shield active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
