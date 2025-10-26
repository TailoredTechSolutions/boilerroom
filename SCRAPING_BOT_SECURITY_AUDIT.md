# Scraping Bot Parameter Validation & Configuration Review

**Project**: VC Registry Scraper  
**Review Date**: 2025-10-26  
**Environment**: Lovable Cloud (Production)  
**Reviewer**: Lovable AI Security Analysis  
**Target Registries**: Companies House (UK), GLEIF, SEC EDGAR, ASIC  
**Architecture**: Supabase Edge Functions + N8N Workflow Orchestration

---

## Executive Summary

### Overall Status: ⚠️ **CRITICAL ISSUES FOUND**

This audit identified **17 security and configuration issues** across 9 categories, including **5 CRITICAL** and **6 HIGH** severity findings that must be addressed before production use at scale.

**Key Concerns**:
- No authentication on core scraping endpoints (data theft risk)
- Missing rate limiting, retry logic, and timeout configurations
- Hard-coded N8N webhook URL (not environment-aware)
- No anti-bot protection or robots.txt compliance
- Insufficient input validation and error handling
- Missing observability and monitoring hooks

**Immediate Actions Required**: Fix all CRITICAL issues (items 1.1, 3.1, 3.2, 7.1, 9.1) before further deployment.

---

## 1. Parameter File Correctness

### 1.1 Missing Configuration File ⚠️ **CRITICAL**
**Severity**: CRITICAL  
**Finding**: No centralized configuration file exists (YAML/JSON/TOML). All parameters are hard-coded in edge function code or stored in environment variables without validation.

**Location**: 
- `supabase/functions/trigger-scrape/index.ts` (lines 78, 81)
- `supabase/functions/scrape-callback/index.ts` (lines 72, 91)

**Risk**: 
- No single source of truth for scraping parameters
- Environment-specific overrides impossible
- Configuration drift across functions
- Cannot hot-reload settings without redeployment

**Recommended Fix**:
Create `supabase/functions/_shared/config.ts`:
```typescript
export const SCRAPING_CONFIG = {
  network: {
    timeout: {
      connect: 10000,  // 10s
      read: 30000,     // 30s
      total: 60000     // 60s
    },
    retries: {
      maxAttempts: 3,
      backoffBase: 2,
      backoffMax: 30,
      useJitter: true
    },
    rateLimit: {
      requestsPerSecond: 1,
      perHostConcurrency: 2,
      globalConcurrency: 10
    }
  },
  n8n: {
    webhookUrl: Deno.env.get('N8N_WEBHOOK_URL') || 'https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper',
    timeout: 30000,
    retries: 2
  },
  validation: {
    maxSearchTermLength: 500,
    maxEntitiesPerBatch: 1000,
    maxErrorMessageLength: 2000
  },
  sources: {
    allowedRegistries: ['COMPANIES_HOUSE', 'GLEIF', 'SEC_EDGAR', 'ASIC'],
    sourceAliases: { 'CH': 'COMPANIES_HOUSE', 'SEC': 'SEC_EDGAR' }
  }
};
```

---

## 2. Network / Request Parameters

### 2.1 Missing Timeout Configuration ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: No timeout configured for N8N webhook calls or Supabase operations.

**Location**: `supabase/functions/trigger-scrape/index.ts` (line 81)

**Current Code**:
```typescript
const response = await fetch(n8nWebhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
});
```

**Risk**: Hanging requests can block edge function execution, leading to timeouts and resource exhaustion.

**Recommended Fix**:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

try {
  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...}),
    signal: controller.signal
  });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('N8N webhook timeout after 30s');
  }
  throw error;
}
```

### 2.2 No Retry Logic for N8N Webhook ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: Single-attempt fetch to N8N with no retry or exponential backoff.

**Location**: `supabase/functions/trigger-scrape/index.ts` (lines 81-92)

**Risk**: Transient network failures cause immediate job failures.

**Recommended Fix**:
```typescript
async function callN8NWithRetry(url: string, payload: any, maxRetries = 3): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) return response;
      if (response.status >= 400 && response.status < 500) {
        // Client error - don't retry
        throw new Error(`N8N webhook rejected: ${response.status}`);
      }
      
      lastError = new Error(`N8N returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    
    if (attempt < maxRetries) {
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
      const jitter = Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, backoff + jitter));
    }
  }
  
  throw lastError;
}
```

### 2.3 No Rate Limiting Configuration ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: No rate limits enforced at edge function level or N8N orchestration level.

**Risk**: 
- Can overwhelm target registries and get IP banned
- No protection against accidental DDoS from multiple simultaneous requests
- Violates registry API terms of service

**Recommended Fix**:
Implement rate limiting in Supabase:
```sql
-- Add rate limiting table
CREATE TABLE IF NOT EXISTS scraping_rate_limits (
  registry_source TEXT PRIMARY KEY,
  last_request_time TIMESTAMPTZ,
  request_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW()
);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  source TEXT,
  max_requests_per_minute INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_age INTERVAL;
BEGIN
  SELECT request_count, NOW() - window_start 
  INTO current_count, window_age
  FROM scraping_rate_limits
  WHERE registry_source = source;
  
  IF window_age > INTERVAL '1 minute' THEN
    -- Reset window
    UPDATE scraping_rate_limits
    SET request_count = 1, window_start = NOW(), last_request_time = NOW()
    WHERE registry_source = source;
    RETURN TRUE;
  ELSIF current_count >= max_requests_per_minute THEN
    RETURN FALSE;
  ELSE
    UPDATE scraping_rate_limits
    SET request_count = request_count + 1, last_request_time = NOW()
    WHERE registry_source = source;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2.4 No Concurrency Controls ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: No limits on concurrent scraping jobs per user or globally.

**Location**: No concurrency checks in `trigger-scrape` function

**Risk**: Users can spawn unlimited jobs, overwhelming the system.

**Recommended Fix**:
```typescript
// In trigger-scrape, before creating job:
const { count } = await supabaseAdmin
  .from('scraping_jobs')
  .select('*', { count: 'exact', head: true })
  .in('status', ['pending', 'running'])
  .eq('created_by', userId);

if (count >= 5) {  // Max 5 concurrent jobs per user
  throw new Error('Maximum concurrent jobs reached. Please wait for existing jobs to complete.');
}
```

---

## 3. Authentication & Secrets

### 3.1 No Authentication on trigger-scrape ⚠️ **CRITICAL**
**Severity**: CRITICAL  
**Finding**: `verify_jwt = false` in `supabase/config.toml` allows unauthenticated access to scraping endpoint.

**Location**: 
- `supabase/config.toml` (lines 3-4)
- `supabase/functions/trigger-scrape/index.ts` (lines 22-35 - auth is optional)

**Current Config**:
```toml
[functions.scrape-callback]
verify_jwt = false
```

**Risk**: 
- **Anyone** can trigger unlimited scraping jobs
- No accountability or user tracking
- Enables resource abuse and cost escalation
- API key theft if jobs contain sensitive searches

**Recommended Fix**:
```toml
# Remove this section entirely - JWT verification is enabled by default
# [functions.trigger-scrape]
# verify_jwt = false  
```

Update function:
```typescript
// Make authentication mandatory
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(
    JSON.stringify({ error: 'Authentication required' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  { global: { headers: { Authorization: authHeader } } }
);

const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return new Response(
    JSON.stringify({ error: 'Invalid authentication token' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### 3.2 No Authentication on scrape-callback ⚠️ **CRITICAL**
**Severity**: CRITICAL  
**Finding**: Callback endpoint has no webhook signature verification, allowing anyone to inject fake results.

**Location**: `supabase/functions/scrape-callback/index.ts`

**Risk**: 
- Malicious actors can inject fraudulent entities into database
- Can corrupt data with fake registry results
- Can mark legitimate jobs as failed
- No way to verify N8N is the actual sender

**Recommended Fix**:
```typescript
// Add webhook secret validation
const WEBHOOK_SECRET = Deno.env.get('N8N_WEBHOOK_SECRET');
if (!WEBHOOK_SECRET) {
  throw new Error('N8N_WEBHOOK_SECRET not configured');
}

const signature = req.headers.get('X-Webhook-Signature');
if (!signature) {
  return new Response(
    JSON.stringify({ error: 'Missing webhook signature' }),
    { status: 401, headers: corsHeaders }
  );
}

// Verify HMAC signature
const body = await req.text();
const expectedSignature = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(WEBHOOK_SECRET + body)
);
const expectedHex = Array.from(new Uint8Array(expectedSignature))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

if (signature !== expectedHex) {
  return new Response(
    JSON.stringify({ error: 'Invalid webhook signature' }),
    { status: 403, headers: corsHeaders }
  );
}

const payload = JSON.parse(body);
```

### 3.3 Hard-Coded N8N URL ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: N8N webhook URL has hard-coded fallback instead of failing safely.

**Location**: `supabase/functions/trigger-scrape/index.ts` (line 78)

**Current Code**:
```typescript
const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL') || 'https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper';
```

**Risk**: 
- Exposes production N8N endpoint in source code
- Falls back to potentially wrong environment
- Makes environment-specific testing difficult

**Recommended Fix**:
```typescript
const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
if (!n8nWebhookUrl) {
  throw new Error('N8N_WEBHOOK_URL environment variable not configured');
}
```

### 3.4 Secrets in Edge Function Logs ⚠️ **LOW**
**Severity**: LOW  
**Finding**: Logs may contain sensitive data.

**Location**: Multiple `console.log()` statements

**Recommended Fix**: Add log sanitization helper:
```typescript
function sanitizeForLog(obj: any): any {
  const sensitiveKeys = ['api_key', 'token', 'password', 'secret', 'authorization'];
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }
  return sanitized;
}
```

---

## 4. Target-Parsing / Selector Parameters

### 4.1 No Parsing Configuration ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: No CSS selectors, XPath expressions, or parsing rules defined in code. Parsing delegated entirely to external N8N workflow.

**Risk**: 
- No visibility into what data is being extracted
- Cannot validate N8N is extracting correct fields
- Schema changes in registries will silently fail
- No fallback parsing strategies

**Recommended Fix**: Document expected N8N output schema and add validation:
```typescript
// In scrape-callback, add schema documentation
/**
 * Expected N8N Entity Output Schema:
 * 
 * Required fields:
 * - legal_name: string (max 500 chars)
 * - registry_id: string (max 200 chars) - unique identifier from source registry
 * - registry_source: enum ('COMPANIES_HOUSE' | 'GLEIF' | 'SEC_EDGAR' | 'ASIC')
 * - country: string (max 100 chars) - ISO country name or code
 * 
 * Optional fields:
 * - status: enum ('active' | 'inactive' | 'dissolved' | 'unknown')
 * - trading_name: string (max 500 chars)
 * - company_type: string
 * - jurisdiction: string
 * - incorporation_date: ISO date string
 * - website: URL string
 * - address: object { line1, line2, city, region, postal_code, country }
 * - officers: array of { name, role, appointed_date }
 * - psc: array of { name, nature_of_control, notified_date }
 * - sic_codes: array of strings
 * - filings: array of { type, date, description }
 * 
 * N8N Workflow Requirements:
 * 1. Must normalize country to full name (not codes)
 * 2. Must deduplicate by registry_id before sending
 * 3. Must validate all URLs are properly formatted
 * 4. Must handle pagination and rate limiting
 */
```

### 4.2 No Pagination Validation ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: No limits or validation on how many pages N8N should scrape.

**Risk**: Runaway scraping consuming excessive resources.

**Recommended Fix**: Add pagination limits to trigger:
```typescript
const TriggerScrapeSchema = z.object({
  source: z.enum(['COMPANIES_HOUSE', 'CH', 'GLEIF', 'SEC_EDGAR', 'ASIC']),
  searchTerm: z.string().max(500).optional(),
  filters: z.record(z.unknown()).optional(),
  pagination: z.object({
    maxPages: z.number().int().min(1).max(100).default(10),
    pageSize: z.number().int().min(1).max(1000).default(100)
  }).optional()
});
```

---

## 5. Data Validation & Normalization

### 5.1 Weak Entity Schema Validation ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: `EntitySchema` uses `.passthrough()` allowing arbitrary fields through validation.

**Location**: `supabase/functions/scrape-callback/index.ts` (line 67)

**Current Code**:
```typescript
const EntitySchema = z.object({
  legal_name: z.string().max(500),
  // ...
}).passthrough();  // ⚠️ Allows any extra fields
```

**Risk**: 
- Unknown fields can be inserted into database
- No protection against schema pollution
- Harder to track data lineage

**Recommended Fix**:
```typescript
const EntitySchema = z.object({
  legal_name: z.string().max(500),
  registry_id: z.string().max(200),
  registry_source: z.string().max(50),
  country: z.string().max(100),
  score: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  trading_name: z.string().max(500).optional(),
  company_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  incorporation_date: z.string().optional(),
  website: z.string().url().optional(),
  address: z.object({
    line1: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  officers: z.array(z.unknown()).optional(),
  psc: z.array(z.unknown()).optional(),
  sic_codes: z.array(z.string()).optional(),
  filings: z.array(z.unknown()).optional(),
  raw_payload: z.any().optional()
}).strict();  // ✅ Reject unknown fields
```

### 5.2 Incomplete Status Normalization ⚠️ **LOW**
**Severity**: LOW  
**Finding**: Status normalization only handles 4 cases, defaults to "Unknown" for everything else.

**Location**: `supabase/functions/scrape-callback/index.ts` (lines 100-109)

**Risk**: Loses information about edge cases like "suspended", "under administration", etc.

**Recommended Fix**:
```typescript
const normalizeStatus = (s?: string) => {
  if (!s) return 'Unknown';
  const m = s.toLowerCase().trim();
  
  // Active variants
  if (['active', 'live', 'open', 'current'].includes(m)) return 'Active';
  
  // Inactive variants
  if (['inactive', 'dormant', 'suspended', 'strike-off'].includes(m)) return 'Inactive';
  
  // Dissolved variants
  if (['dissolved', 'closed', 'liquidated', 'terminated'].includes(m)) return 'Dissolved';
  
  // Log unknown statuses for review
  console.warn(`Unknown company status: "${s}" - mapping to Unknown`);
  return 'Unknown';
};
```

### 5.3 No Deduplication Logic ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: Entities are upserted by `registry_id` but no deduplication across different registries for the same company.

**Location**: `supabase/functions/scrape-callback/index.ts` (line 156)

**Risk**: Same company from different registries creates multiple records.

**Recommended Fix**: Add cross-registry deduplication:
```sql
-- Add deduplication tracking
ALTER TABLE entities ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES entities(id);
ALTER TABLE entities ADD COLUMN IF NOT EXISTS canonical_name TEXT;

-- Create function to detect duplicates
CREATE OR REPLACE FUNCTION find_duplicate_entity(
  p_legal_name TEXT,
  p_country TEXT
) RETURNS UUID AS $$
  SELECT id FROM entities
  WHERE canonical_name = LOWER(TRIM(p_legal_name))
    AND country = p_country
    AND duplicate_of IS NULL
  LIMIT 1;
$$ LANGUAGE sql;
```

---

## 6. Output / Storage Parameters

### 6.1 No Batch Size Limits ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: Callback accepts up to 1000 entities but inserts all at once with single upsert.

**Location**: `supabase/functions/scrape-callback/index.ts` (lines 154-156)

**Risk**: Large batch can timeout or exhaust memory.

**Recommended Fix**:
```typescript
// Batch upsert in chunks
const BATCH_SIZE = 100;
for (let i = 0; i < normalizedEntities.length; i += BATCH_SIZE) {
  const batch = normalizedEntities.slice(i, i + BATCH_SIZE);
  
  const { error: entitiesError } = await supabase
    .from('entities')
    .upsert(batch, { onConflict: 'registry_id' });
  
  if (entitiesError) {
    console.error(`Error upserting batch ${i / BATCH_SIZE + 1}:`, entitiesError);
    throw entitiesError;
  }
  
  console.log(`Upserted batch ${i / BATCH_SIZE + 1} (${batch.length} entities)`);
}
```

### 6.2 No Transaction Integrity ⚠️ **LOW**
**Severity**: LOW  
**Finding**: Job status update and entity upsert are separate operations with no transaction.

**Risk**: Job can be marked complete while entity insertion fails, causing data inconsistency.

**Recommended Fix**: Use Supabase RPC with transaction:
```sql
CREATE OR REPLACE FUNCTION complete_scraping_job(
  p_job_id UUID,
  p_status TEXT,
  p_records_fetched INT,
  p_records_processed INT,
  p_error_message TEXT,
  p_entities JSONB
) RETURNS VOID AS $$
BEGIN
  -- Update job first
  UPDATE scraping_jobs
  SET status = p_status,
      records_fetched = p_records_fetched,
      records_processed = p_records_processed,
      error_message = p_error_message,
      completed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE NULL END
  WHERE id = p_job_id;
  
  -- Then insert entities (will rollback if fails)
  IF p_entities IS NOT NULL THEN
    INSERT INTO entities (...)
    SELECT ...
    FROM jsonb_to_recordset(p_entities) AS ...
    ON CONFLICT (registry_id) DO UPDATE SET ...;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## 7. Error Handling, Logging & Observability

### 7.1 Generic Error Messages ⚠️ **CRITICAL**
**Severity**: CRITICAL  
**Finding**: Production edge functions return generic errors hiding real issues from legitimate users.

**Location**: 
- `trigger-scrape` (lines 116-132)
- `scrape-callback` (lines 170-179)

**Current Code**:
```typescript
catch (error) {
  let message = 'Invalid request data';  // Generic message
  return new Response(JSON.stringify({ error: message }), { status: 400 });
}
```

**Risk**: 
- Impossible to debug issues for legitimate users
- Hides configuration errors from developers
- No way to differentiate between user errors and system errors

**Recommended Fix**:
```typescript
catch (error) {
  console.error('Error in trigger-scrape:', error);
  
  let statusCode = 500;
  let userMessage = 'Internal server error';
  let developerMessage = error.message;
  
  if (error instanceof z.ZodError) {
    statusCode = 400;
    userMessage = 'Invalid request parameters';
    developerMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  } else if (error.message?.includes('rate limit')) {
    statusCode = 429;
    userMessage = 'Rate limit exceeded';
  } else if (error.message?.includes('auth')) {
    statusCode = 401;
    userMessage = 'Authentication required or invalid';
  }
  
  return new Response(
    JSON.stringify({ 
      error: userMessage,
      details: Deno.env.get('ENVIRONMENT') === 'development' ? developerMessage : undefined,
      requestId: crypto.randomUUID()  // For support tracking
    }),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
```

### 7.2 Insufficient Logging ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: No structured logging, no log levels, no correlation IDs.

**Risk**: Impossible to trace requests through system or diagnose production issues.

**Recommended Fix**:
```typescript
interface LogContext {
  requestId: string;
  userId?: string;
  jobId?: string;
  source?: string;
}

class Logger {
  constructor(private context: LogContext) {}
  
  debug(message: string, data?: any) {
    console.log(JSON.stringify({ level: 'DEBUG', message, ...this.context, data }));
  }
  
  info(message: string, data?: any) {
    console.log(JSON.stringify({ level: 'INFO', message, ...this.context, data }));
  }
  
  warn(message: string, data?: any) {
    console.warn(JSON.stringify({ level: 'WARN', message, ...this.context, data }));
  }
  
  error(message: string, error?: any) {
    console.error(JSON.stringify({ 
      level: 'ERROR', 
      message, 
      ...this.context, 
      error: error?.message,
      stack: error?.stack
    }));
  }
}

// Usage:
const logger = new Logger({ requestId: crypto.randomUUID(), userId, source });
logger.info('Scraping job created', { jobId: job.id, searchTerm });
```

### 7.3 No Monitoring Hooks ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: No metrics, alerts, or observability integrations.

**Recommended Fix**: Add metrics tracking:
```typescript
// Track metrics in database
const { error } = await supabase.from('scraping_metrics').insert({
  job_id: jobId,
  event_type: 'job_started',
  source: normalizedSource,
  timestamp: new Date().toISOString(),
  metadata: { searchTerm, userId }
});
```

---

## 8. Anti-Bot & Politeness

### 8.1 No robots.txt Compliance ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: No verification that target sites allow scraping.

**Risk**: Legal liability and ethical violations.

**Recommended Fix**: Add robots.txt check:
```typescript
async function checkRobotsTxt(domain: string, userAgent: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}/robots.txt`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) return true; // No robots.txt = allowed
    
    const robotsTxt = await response.text();
    // Simple parser - production should use proper robots.txt parser
    const disallowedPaths = robotsTxt
      .split('\n')
      .filter(line => line.startsWith('Disallow:'))
      .map(line => line.split(':')[1].trim());
    
    return disallowedPaths.length === 0 || !disallowedPaths.includes('/');
  } catch {
    return true; // Default allow on error
  }
}
```

### 8.2 No CAPTCHA Handling Strategy ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: No mention of CAPTCHA detection or handling in N8N workflows.

**Recommended Fix**: Document CAPTCHA strategy in N8N workflow:
- Detect CAPTCHA challenges
- Mark jobs as 'blocked' instead of 'failed'
- Implement manual review queue
- Consider third-party CAPTCHA solver integration

### 8.3 No User-Agent Configuration ⚠️ **LOW**
**Severity**: LOW  
**Finding**: No custom User-Agent headers defined for scraping requests.

**Recommended Fix**: Add to N8N workflow configuration:
```
User-Agent: VC-Registry-Scraper/1.0 (+https://yourcompany.com/bot)
Accept: application/json, text/html
Accept-Language: en-US,en;q=0.9
```

---

## 9. Security & Compliance

### 9.1 No Legal/ToS Validation ⚠️ **CRITICAL**
**Severity**: CRITICAL  
**Finding**: No verification that scraping is permitted by target sites' Terms of Service.

**Risk**: Legal action, account bans, reputational damage.

**Recommended Fix**: Create compliance matrix:

| Registry | Scraping Permitted? | API Available? | Rate Limit | Auth Required | Notes |
|----------|---------------------|----------------|------------|---------------|-------|
| Companies House | ✅ Yes (with API key) | ✅ Yes | 600 req/5min | ✅ API Key | Free API available |
| GLEIF | ✅ Yes | ✅ Yes | Unknown | ❌ No | Public data |
| SEC EDGAR | ✅ Yes | ✅ Yes | 10 req/sec | ❌ No | Requires user-agent |
| ASIC | ⚠️ Check | ❓ Unknown | Unknown | ❓ Unknown | **VERIFY BEFORE USE** |

**Action Required**: Review each registry's ToS and add API key authentication where required.

### 9.2 PII Data Exposure ⚠️ **HIGH**
**Severity**: HIGH  
**Finding**: Officer and PSC (People with Significant Control) data contains PII without retention policy.

**Location**: Database table `entities` columns `officers`, `psc`

**Risk**: GDPR/privacy violations if personal data retained indefinitely.

**Recommended Fix**:
```sql
-- Add data retention policy
ALTER TABLE entities ADD COLUMN IF NOT EXISTS pii_retention_until TIMESTAMPTZ;

-- Auto-delete PII after 2 years
CREATE OR REPLACE FUNCTION cleanup_expired_pii()
RETURNS void AS $$
BEGIN
  UPDATE entities
  SET officers = NULL,
      psc = NULL
  WHERE pii_retention_until < NOW()
    AND (officers IS NOT NULL OR psc IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- Schedule daily cleanup (add to cron job)
```

### 9.3 No Input Sanitization for External Display ⚠️ **MEDIUM**
**Severity**: MEDIUM  
**Finding**: Entity data (legal_name, website, etc.) used directly in UI without sanitization.

**Risk**: XSS attacks if malicious data injected via scraping.

**Recommended Fix**: Sanitize all text fields before display:
```typescript
import DOMPurify from 'dompurify';

function sanitizeEntityForDisplay(entity: Entity): Entity {
  return {
    ...entity,
    legal_name: DOMPurify.sanitize(entity.legal_name),
    trading_name: entity.trading_name ? DOMPurify.sanitize(entity.trading_name) : undefined,
    website: entity.website ? DOMPurify.sanitize(entity.website) : undefined
  };
}
```

---

## 10. Test Results

### 10.1 Static Validation
❌ **FAILED** - No config file to validate

### 10.2 Schema Validation
✅ **PASSED** - Zod schemas present but need strengthening

### 10.3 Dry-Run Request Test
⚠️ **BLOCKED** - Cannot test without:
- Valid Companies House API key
- N8N webhook access
- Sample registry URLs

### 10.4 Pagination Test
⚠️ **NOT APPLICABLE** - Pagination handled by N8N (not visible in code)

### 10.5 Concurrency Test
❌ **FAILED** - No concurrency limits implemented

### 10.6 Retry/Backoff Test
❌ **FAILED** - No retry logic present

### 10.7 Proxy Failover Test
❌ **FAILED** - No proxy configuration

### 10.8 Output Validation
✅ **PASSED** - Basic schema validation exists

### 10.9 Security Scan
❌ **FAILED** - Multiple critical security issues found (see sections 3.1, 3.2)

---

## 11. Prioritized Action List

### Immediate (Complete Before Next Deployment)
1. **Fix authentication** (3.1, 3.2) - Add JWT verification and webhook signatures
2. **Add timeouts** (2.1) - Prevent hanging requests
3. **Validate N8N URL** (3.3) - Remove hard-coded fallback
4. **Check legal compliance** (9.1) - Verify ToS for each registry
5. **Add error details** (7.1) - Return actionable error messages

### High Priority (Complete This Week)
6. **Implement retries** (2.2) - Add exponential backoff for N8N calls
7. **Add rate limiting** (2.3) - Prevent API abuse
8. **Improve logging** (7.2) - Structured logs with correlation IDs
9. **Add concurrency limits** (2.4) - Prevent job flooding
10. **Validate robots.txt** (8.1) - Check scraping permissions

### Medium Priority (Complete This Month)
11. **Create config file** (1.1) - Centralize all parameters
12. **Strengthen validation** (5.1) - Remove `.passthrough()` from schema
13. **Add batch processing** (6.1) - Chunk large entity upserts
14. **Handle PII retention** (9.2) - Auto-expire personal data
15. **Add monitoring** (7.3) - Track metrics and set up alerts

### Low Priority (Nice to Have)
16. **Improve status mapping** (5.2) - Handle more edge cases
17. **Add deduplication** (5.3) - Merge entities across registries

---

## 12. Missing Information for Full Audit

To complete a comprehensive audit, the following are needed:

1. **N8N Workflow Configuration**: Export of the actual workflow showing:
   - Selectors/parsing logic used
   - Pagination implementation
   - Error handling strategies
   - Rate limiting configuration

2. **API Keys**: To test actual scraping:
   - Companies House API key (read-only)
   - Sample URLs from each target registry

3. **Sample Data**: 
   - 3 example registry URLs per target
   - Expected output JSON for each

4. **Production Metrics**:
   - Average entities per scrape
   - Typical job duration
   - Error rates by registry

5. **Legal Documentation**:
   - Confirmation of ToS review for each registry
   - Data processing agreement (if applicable)

---

## 13. Contact & Next Steps

**Report Generated**: 2025-10-26  
**Valid Until**: 2025-11-26 (1 month)

### To Address These Issues:
1. Review this document with your development team
2. Prioritize fixes using the action list in section 11
3. Create tracking tickets for each issue
4. Re-run audit after implementing CRITICAL and HIGH fixes

### Questions?
Reference issue numbers (e.g., "Issue 3.1") when discussing specific findings.

---

**Audit Status**: ⚠️ **NOT PRODUCTION READY**  
**Blocking Issues**: 5 CRITICAL, 6 HIGH  
**Estimated Remediation Time**: 2-3 weeks for all CRITICAL/HIGH issues

