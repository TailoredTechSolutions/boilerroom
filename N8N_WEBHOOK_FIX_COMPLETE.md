# n8n Webhook Fix - Complete Resolution

**Date**: 2025-10-31
**Status**: ✅ FIXED - Ready for Testing

---

## 🔍 Root Cause Analysis

### Problem 1: n8n Webhook Hanging
**Issue**: The n8n webhook at `https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper` was not responding to POST requests, causing indefinite hangs.

**Evidence**:
- Direct curl test showed connection established but no response after 19+ seconds
- SSL handshake completed successfully
- Data uploaded but no response body received
- Connection appeared to timeout without error

**Likely Causes**:
1. n8n workflow may not be ACTIVE (turned off)
2. Webhook trigger node not properly configured
3. n8n instance may be experiencing issues

### Problem 2: No Timeout on Webhook Calls
**Issue**: The `trigger-scrape` edge function called the n8n webhook without any timeout, causing:
- Edge function to wait indefinitely for response
- Jobs stuck in "running" state forever
- No error messages or failure status
- User unable to clear stuck jobs

### Problem 3: Inadequate Cleanup Mechanism
**Issue**: The existing `cleanup-stale-jobs` function had a 45-second timeout, which was too aggressive and could interfere with legitimate scraping jobs.

---

## ✅ Solutions Implemented

### 1. Added Timeout to Webhook Calls

**File**: `supabase/functions/trigger-scrape/index.ts`

**Changes**:
- Added `AbortController` with 10-second timeout
- Wrapped webhook call in try-catch for proper error handling
- Updates job status to "failed" on timeout with descriptive error message
- Clears timeout properly to prevent memory leaks

**Key Code**:
```typescript
// Create AbortController for timeout (10 seconds)
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...}),
    signal: controller.signal  // 👈 This enables timeout
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    // Handle error response
    await supabaseAdmin
      .from('scraping_jobs')
      .update({
        status: 'failed',
        error_message: `N8N webhook failed: ${errorText}`,
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id);
  } else {
    // Success - update to running
    await supabaseAdmin
      .from('scraping_jobs')
      .update({ status: 'running' })
      .eq('id', job.id);
  }
} catch (webhookError) {
  clearTimeout(timeoutId);

  const isTimeout = webhookError instanceof Error && webhookError.name === 'AbortError';
  const errorMessage = isTimeout
    ? 'N8N webhook timeout (10s) - workflow may not be active'
    : `N8N webhook error: ${webhookError instanceof Error ? webhookError.message : 'Unknown error'}`;

  // Update job to failed with error message
  await supabaseAdmin
    .from('scraping_jobs')
    .update({
      status: 'failed',
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    })
    .eq('id', job.id);
}
```

**Benefits**:
- Jobs no longer hang indefinitely
- Clear error messages inform users of the issue
- Jobs properly fail after 10 seconds if webhook doesn't respond
- User can identify that n8n workflow may not be active

---

### 2. Updated Cleanup Timeout

**File**: `supabase/functions/cleanup-stale-jobs/index.ts`

**Changes**:
- Increased timeout from 45 seconds to 5 minutes
- Updated error messages to reflect new timeout
- Updated documentation

**Before**:
```typescript
const timeoutThreshold = new Date(Date.now() - 45 * 1000).toISOString();
error_message: "Job timed out after 45 seconds (auto-cleanup)"
```

**After**:
```typescript
const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000).toISOString();
error_message: "Job timed out after 5 minutes (auto-cleanup)"
```

**Benefits**:
- More reasonable timeout for actual scraping jobs
- Won't interfere with legitimate long-running jobs
- Better balance between cleanup and allowing jobs to complete

---

### 3. Created Manual Cleanup UI

**New File**: `src/hooks/useCleanupJobs.ts`

Custom React hook for triggering manual cleanup:
```typescript
export const useCleanupJobs = () => {
  const [isLoading, setIsLoading] = useState(false);

  const cleanupStaleJobs = async () => {
    const { data, error } = await supabase.functions.invoke('cleanup-stale-jobs', {
      body: {}
    });

    if (data.cleaned === 0) {
      toast.info('No stuck jobs found to clean up');
    } else {
      toast.success(`Successfully cleaned up ${data.cleaned} stuck job${data.cleaned > 1 ? 's' : ''}`);
    }

    return data;
  };

  return { cleanupStaleJobs, isLoading };
};
```

**Updated File**: `src/pages/DataSources.tsx`

Added "Clear Stuck Jobs" button to the "Recent Scraping Jobs" card header:
```typescript
<Button
  onClick={cleanupStaleJobs}
  disabled={isCleaningUp}
  variant="outline"
  size="sm"
>
  {isCleaningUp ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Cleaning...
    </>
  ) : (
    <>
      <Trash2 className="w-4 h-4 mr-2" />
      Clear Stuck Jobs
    </>
  )}
</Button>
```

**Benefits**:
- Users can manually clear stuck jobs without waiting 5 minutes
- Clear visual feedback with loading state
- Toast notifications inform users of results
- Button shows how many jobs were cleaned

---

## 🎯 What This Fixes

### Before:
1. ❌ Jobs stuck in "running" state indefinitely
2. ❌ No way to clear stuck jobs manually
3. ❌ No error messages explaining why jobs failed
4. ❌ n8n webhook calls hung without timeout
5. ❌ Dashboard appeared broken with frozen jobs

### After:
1. ✅ Jobs fail after 10 seconds if webhook doesn't respond
2. ✅ "Clear Stuck Jobs" button allows manual cleanup
3. ✅ Clear error message: "N8N webhook timeout (10s) - workflow may not be active"
4. ✅ Webhook calls timeout properly with AbortController
5. ✅ Dashboard shows job failures with reasons
6. ✅ Users can identify n8n workflow is not active

---

## 🔧 Next Steps to Fix n8n Webhook

The webhook timeout fixes are in place, but the **root cause** is that the n8n workflow is not responding. Here's what you need to check:

### 1. Verify n8n Workflow is Active

**Steps**:
1. Open n8n at `https://n8n-ffai-u38114.vm.elestio.app`
2. Navigate to your workflow
3. Check the toggle switch in the top-right corner
4. **Ensure it says "Active"** (not "Inactive")

**Why**: Inactive workflows don't respond to webhook triggers.

---

### 2. Check Webhook Trigger Configuration

**Steps**:
1. Open the webhook trigger node in your workflow
2. Verify these settings:
   - **Webhook Path**: `vc-registry-scraper`
   - **HTTP Method**: `POST`
   - **Authentication**: None (or match your setup)
   - **Respond**: Set to "Immediately" or "When Last Node Finishes"

**Expected Configuration**:
```json
{
  "webhookId": "vc-registry-scraper",
  "httpMethod": "POST",
  "path": "vc-registry-scraper",
  "responseMode": "onReceived"
}
```

---

### 3. Test Webhook URL Directly

**Test Production Webhook**:
```bash
curl -X POST "https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "source": "CH",
    "registrySource": "COMPANIES_HOUSE",
    "searchTerm": "test",
    "filters": {},
    "callbackUrl": "https://utzxdzkebdgwxgqhieee.supabase.co/functions/v1/scrape-callback"
  }' \
  --max-time 5
```

**Expected Response** (if active):
```json
{
  "success": true,
  "message": "Workflow triggered"
}
```

**Actual Response** (current):
- Connection hangs with no response
- Timeout after 10+ seconds

---

### 4. Check n8n Execution Logs

**Steps**:
1. In n8n, click "Executions" in the sidebar
2. Look for webhook trigger attempts
3. Check if any executions show as "Running" or "Error"
4. Review error messages if present

---

### 5. Alternative: Use Test Webhook URL

n8n provides both Production and Test webhook URLs:

**Production URL** (current):
```
https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper
```

**Test URL** (alternative):
```
https://n8n-ffai-u38114.vm.elestio.app/webhook-test/vc-registry-scraper
```

**To Use Test URL**:
1. Set environment variable in Supabase:
   ```
   N8N_WEBHOOK_URL=https://n8n-ffai-u38114.vm.elestio.app/webhook-test/vc-registry-scraper
   ```
2. Note: Test webhooks work even when workflow is inactive

---

## 📊 Testing the Fix

### 1. Test Webhook Timeout Handling

**Steps**:
1. Navigate to Data Sources page
2. Click "Run Scrape for UK Companies House"
3. Wait 10 seconds

**Expected Result**:
- Job appears with status "running" initially
- After 10 seconds, job status changes to "failed"
- Error message: "N8N webhook timeout (10s) - workflow may not be active"
- Toast notification shows failure

**Verify in Supabase**:
```sql
SELECT id, status, error_message, started_at, completed_at
FROM scraping_jobs
ORDER BY created_at DESC
LIMIT 5;
```

---

### 2. Test Manual Cleanup

**Steps**:
1. Create some test jobs (will fail due to webhook timeout)
2. Wait for jobs to show as "failed"
3. Click "Clear Stuck Jobs" button in Recent Scraping Jobs section

**Expected Result**:
- Button shows loading state
- Toast notification: "No stuck jobs found to clean up" (if all already failed)
- Or: "Successfully cleaned up X stuck job(s)" (if any were still running)

---

### 3. Test When n8n is Fixed

**After fixing n8n workflow**:
1. Ensure workflow is ACTIVE in n8n
2. Test the webhook with curl (should respond immediately)
3. Click "Run Scrape" in dashboard
4. Job should:
   - Start as "pending"
   - Change to "running"
   - Complete with entities scraped
   - Show "completed" status

---

## 📁 Files Changed

### Modified Files:
1. `supabase/functions/trigger-scrape/index.ts` - Added 10s timeout to webhook calls
2. `supabase/functions/cleanup-stale-jobs/index.ts` - Updated timeout to 5 minutes
3. `src/pages/DataSources.tsx` - Added "Clear Stuck Jobs" button

### New Files:
4. `src/hooks/useCleanupJobs.ts` - Custom hook for cleanup functionality
5. `push_to_github.bat` - Helper script for git push
6. `N8N_WEBHOOK_FIX_COMPLETE.md` - This documentation

---

## 🚀 Deployment

### Changes Pushed to GitHub:
```bash
commit b242b68
Author: Claude Code
Date: 2025-10-31

Fix n8n webhook timeout and add stuck job cleanup

- Added 10-second timeout to n8n webhook calls in trigger-scrape function
- Improved error handling for webhook timeouts with clear error messages
- Updated cleanup-stale-jobs timeout from 45 seconds to 5 minutes
- Created useCleanupJobs hook for manual cleanup functionality
- Added 'Clear Stuck Jobs' button to DataSources page
- Jobs now properly fail with timeout message instead of hanging forever
```

### Loveable Auto-Sync:
- Changes will automatically sync to Loveable
- Dashboard should update within a few minutes
- No manual deployment needed

---

## ⚠️ Important Notes

### The Fix is NOT Complete Until:
1. ✅ Code fixes are deployed (DONE)
2. ⚠️ **n8n workflow is activated and responding** (NOT DONE - THIS IS YOUR RESPONSIBILITY)
3. ⚠️ Webhook responds to test requests
4. ⚠️ Jobs complete successfully end-to-end

### Current State:
- **Backend**: ✅ Fixed - proper timeout and error handling
- **Frontend**: ✅ Fixed - manual cleanup button added
- **n8n Workflow**: ❌ NOT WORKING - needs to be activated/fixed

---

## 🎓 Summary

The dashboard code is now robust and handles webhook failures gracefully. However, **you still need to fix the n8n workflow** for scraping to actually work.

The fixes ensure:
- Jobs don't hang forever when n8n doesn't respond
- Users get clear error messages
- Manual cleanup is available
- System is resilient to external service failures

**Next Action**: Go to your n8n instance and activate the workflow, then test again.

---

**Questions?** Check the files mentioned above or review the git commit for full code changes.
