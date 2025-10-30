# Webhook Trigger Fix - Implementation Summary

## Problem Identified

The scraping buttons in the InvestorFundScraper dashboard were **not connected to any backend functionality**. They were purely presentational UI elements with no onClick handlers, which meant:

1. No edge function was being called when users clicked "Start Scraping"
2. No jobs were created in the database
3. No webhook requests were sent to n8n
4. The scraping workflow never triggered

## Root Cause

- **Frontend**: Missing `onClick` handlers on all scraping buttons
- **Missing Integration**: No calls to `supabase.functions.invoke()` anywhere in the codebase
- **Backend**: The `trigger-scrape` edge function existed and was properly configured, but was never being called

## Solution Implemented

### 1. Created Custom Hook: `useTriggerScrape.ts`

**Location**: `src/hooks/useTriggerScrape.ts`

**Features**:
- Handles calls to the `trigger-scrape` Supabase edge function
- Manages loading state for UI feedback
- Provides error handling with toast notifications
- Returns success data including `jobId`

**Key Functions**:
```typescript
const { triggerScrape, isLoading } = useTriggerScrape();

await triggerScrape({
  source: 'CH',           // or 'COMPANIES_HOUSE', 'GLEIF', 'SEC_EDGAR', 'ASIC'
  searchTerm: 'venture capital',
  filters: {}
});
```

### 2. Updated InvestorFundScraper Page

**Location**: `src/pages/InvestorFundScraper.tsx`

**Changes**:
- Imported the `useTriggerScrape` hook
- Added `Loader2` icon for loading states
- Created three handler functions:
  - `handleStartFundsScrape()` - For funds scraping
  - `handleStartInvestorsScrape()` - For investors scraping
  - `handleStartCompanyAnalysis()` - For company analysis

**Updated Buttons** (4 total):
1. "Start Scraping Funds" (Funds tab)
2. "Start Scraping Investors" (Investors tab)
3. "Start Analysis" (Company Analysis tab)
4. "Get Started Now" (Bottom CTA)

**Button Features**:
- Shows loading spinner during API call
- Disables button while loading
- Changes text to "Starting Scrape..." or "Starting Analysis..."
- Displays success/error toasts

## How It Works Now

### User Flow:
1. User clicks "Start Scraping Funds" button
2. `handleStartFundsScrape()` is called
3. Hook calls `supabase.functions.invoke('trigger-scrape', {...})`
4. Edge function `trigger-scrape` receives the request
5. Edge function creates a job record in `scraping_jobs` table
6. Edge function sends POST request to n8n webhook at:
   `https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper`
7. n8n workflow is triggered with job data
8. User sees success toast: "Scraping job started successfully! Job ID: xxx"

### Backend Webhook Trigger:

**File**: `supabase/functions/trigger-scrape/index.ts:77-91`

```typescript
const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL') ||
  'https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper';

const response = await fetch(n8nWebhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jobId: job.id,
    source: originalSource,
    registrySource: normalizedSource,
    searchTerm,
    filters,
    callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-callback`
  })
});
```

## Testing the Fix

### To verify the webhook trigger works:

1. **Start the development server**:
   ```bash
   cd boilerroom
   npm run dev
   ```

2. **Navigate to the InvestorFundScraper page**

3. **Click "Start Scraping Funds"**

4. **Verify**:
   - Button shows loading state
   - Toast notification appears
   - Check Supabase dashboard for new job in `scraping_jobs` table
   - Check n8n workflow execution logs

### Expected n8n Payload:

```json
{
  "jobId": "uuid-string",
  "source": "CH",
  "registrySource": "COMPANIES_HOUSE",
  "searchTerm": "venture capital",
  "filters": {},
  "callbackUrl": "https://your-project.supabase.co/functions/v1/scrape-callback"
}
```

## Files Modified

1. **New File**: `src/hooks/useTriggerScrape.ts`
2. **Modified**: `src/pages/InvestorFundScraper.tsx`

## Configuration Requirements

Ensure these environment variables are set:

### Supabase Edge Function Environment:
- `N8N_WEBHOOK_URL` - Your n8n webhook endpoint
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

### Frontend Environment (`.env`):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Anon/public key

## Next Steps

1. **Deploy to Loveable/Production**:
   - Commit changes to GitHub
   - Loveable will auto-sync the changes

2. **Test in Production**:
   - Navigate to the dashboard
   - Click scraping buttons
   - Monitor n8n workflow executions

3. **Monitor Logs**:
   - Check Supabase Function Logs for edge function calls
   - Check n8n execution history
   - Monitor `scraping_jobs` table for new entries

## Debugging Tips

### If webhook still doesn't trigger:

1. **Check Browser Console**:
   ```javascript
   // Should see:
   "Triggering scrape with params: {source: 'CH', searchTerm: '...', filters: {}}"
   "Scrape triggered successfully: {success: true, jobId: '...'}"
   ```

2. **Check Supabase Function Logs**:
   - Go to Supabase Dashboard > Edge Functions > trigger-scrape
   - Look for execution logs
   - Verify webhook POST request

3. **Check n8n Webhook**:
   - Open n8n workflow
   - Check webhook URL matches `N8N_WEBHOOK_URL` env var
   - Check execution history

4. **Check Authentication**:
   - User must be logged in (JWT token required)
   - Check `Authorization` header in network tab

## Success Criteria

✅ Button shows loading state when clicked
✅ Toast notification appears after click
✅ Job record created in `scraping_jobs` table
✅ n8n webhook receives POST request
✅ n8n workflow executes
✅ Callback webhook receives results

---

**Implementation Date**: 2025-10-31
**Status**: ✅ Complete - Ready for Testing
