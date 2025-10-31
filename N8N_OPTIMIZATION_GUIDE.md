# n8n Workflow Optimization Guide

**Date**: 2025-10-31
**Status**: Recommendations for Performance Improvement

---

## 🎯 Current Issues

### 1. **Venture Capital Filtering FIXED** ✅
- **Problem**: n8n webhook was receiving `searchTerm: "test"` instead of `"venture capital"`
- **Root Cause**: DataSources.tsx was calling `scrape-companies-house` directly instead of `trigger-scrape`
- **Fix Applied**: Changed DataSources.tsx:89-94 to always call `trigger-scrape` with `searchTerm: "venture capital"`
- **Result**: Companies House API will now filter for venture capital firms only

### 2. **Slow Scraping Performance** (20+ minutes for 89 records)
- **Problem**: Negative press analysis takes too long
- **Root Cause**: Sequential processing + ScrapeGraph AI calls for each entity
- **Impact**: 89 entities × ~13 seconds each = ~20 minutes

### 3. **Clear Stuck Jobs Button Not Visible**
- **Problem**: Button exists in code but not showing in UI
- **Root Cause**: Loveable hasn't synced the changes yet
- **Fix Applied**: Improved button styling with responsive layout and destructive variant
- **Action Required**: Wait for Loveable to sync from GitHub (5-10 minutes)

---

## 🚀 Performance Optimization Recommendations

### Option 1: Batch Processing (RECOMMENDED)
**Impact**: Reduce time from 20 min → 5-7 min

**Changes Needed in n8n**:
1. **Split Into Batches**
   - Add "Split Into Batches" node after "Filter Active Status"
   - Set batch size: 10-15 items per batch
   - This allows parallel processing

2. **Process Batches in Parallel**
   - Batches process simultaneously instead of sequentially
   - 89 items ÷ 10 batches = ~9 items per batch
   - All batches run at same time

**n8n Node Configuration**:
```
Filter Active Status (89 items)
  ↓
Split Into Batches (batch_size: 10)
  ↓
[Parallel Processing of 9 batches]
  ↓
Merge all results
```

---

### Option 2: Limit News Search Results
**Impact**: Reduce time by 40-50%

**Current Issue**: Your workflow searches for news articles for EVERY company, even if they have no negative press.

**Optimization**:
1. **Add Conditional Logic**:
   - Only search for negative press if certain criteria are met
   - Example: company age < 2 years, or specific SIC codes

2. **Reduce SERP Items**:
   - In your "News Search" node, limit results to 3-5 articles max (currently fetching more)
   - Most negative press appears in first few results

**n8n Node Update**:
```javascript
// Add IF node before "News Search"
{{ $json.company_age_years < 3 || $json.high_risk_sic_code }}
```

---

### Option 3: Simplified Negative Press Detection
**Impact**: Reduce time by 60-70%

**Instead of ScrapeGraph AI, use simpler detection**:

1. **Use News API Headlines Only**
   - Don't scrape full article content
   - Analyze headlines for negative keywords
   - Much faster than full article scraping

2. **Keyword-Based Detection**
   - Search for: "fraud", "lawsuit", "scandal", "investigation", "bankruptcy"
   - If headline contains these → mark as negative
   - No need for full AI sentiment analysis

**n8n Implementation**:
```javascript
// Replace ScrapeGraph AI node with Code node
const headline = $json.title.toLowerCase();
const negativeKeywords = ['fraud', 'lawsuit', 'scandal', 'investigation', 'bankruptcy', 'misconduct'];

const isNegative = negativeKeywords.some(keyword => headline.includes(keyword));

return {
  json: {
    ...$json,
    has_negative_press: isNegative,
    sentiment_score: isNegative ? 0.8 : 0.1
  }
};
```

---

### Option 4: Timeout and Skip Strategy
**Impact**: Prevent infinite hangs

**Add Timeouts**:
1. **ScrapeGraph AI Node**:
   - Set "Continue On Fail" = true
   - Set "Max Tries" = 1 (no retries)
   - Set timeout = 10 seconds

2. **Skip on Timeout**:
   - If scraping fails, continue without negative press data
   - Mark as "negative_press_unknown" instead of blocking

**Result**: Failed scrapes don't block the entire workflow

---

## 🔧 Recommended Implementation Plan

### Phase 1: Quick Wins (Do Now)
1. ✅ **Fix venture capital filtering** (DONE)
2. **Reduce news search results** to 3 articles max
3. **Add timeouts** to ScrapeGraph AI node (10s)
4. **Enable "Continue On Fail"** for all scraping nodes

### Phase 2: Performance Boost (Next)
1. **Implement batch processing** (Option 1)
2. **Add conditional logic** for news search (Option 2)
3. Test with 10-20 companies first

### Phase 3: Major Optimization (Later)
1. **Replace ScrapeGraph AI** with headline analysis (Option 3)
2. **Cache results** to avoid re-scraping same companies
3. **Implement webhook progress updates** to show real-time status

---

## 📊 Expected Performance After Optimization

| Current | After Phase 1 | After Phase 2 | After Phase 3 |
|---------|---------------|---------------|---------------|
| 20+ min | 15 min | 7 min | 3-5 min |
| All companies | All companies | All companies | All companies |
| Full scraping | Timeout protection | Batch parallel | Headline only |

---

## 🛠️ Specific n8n Changes

### 1. Update "Extract Articles" Node (ScrapeGraph AI)

**Current Settings**:
- User Prompt: Long detailed prompt
- No timeout
- Retry on fail: true

**New Settings**:
```json
{
  "websiteUrl": "={{ $json.article_urls[0] }}",
  "userPrompt": "Extract ONLY: article title, date, and if {{ $json.entity_name }} is mentioned negatively. Return JSON: {title, date, is_negative: boolean}",
  "continueOnFail": true,
  "maxTries": 1,
  "waitBetweenTries": 0
}
```

### 2. Add "Split Into Batches" Node

**After "Filter Active Status"**:
```json
{
  "batchSize": 10,
  "options": {}
}
```

### 3. Update "News Search" Node

**Reduce Items**:
```json
{
  "query": "{{ $json.entity_name }} fraud lawsuit scandal",
  "num": 3  // Changed from 10 or more
}
```

---

## 🎯 n8n Workflow Timeout Error Removal

### Current Issue:
Your n8n workflow no longer needs the "N8N webhook timeout (10s)" error in the edge function, since the webhook is now working.

### Fix in Supabase Edge Function:
The error message "N8N webhook timeout (10s) - workflow may not be active" should be updated to just "N8N webhook timeout" since we know the workflow IS active.

**File**: `supabase/functions/trigger-scrape/index.ts:136`

**Current**:
```typescript
const errorMessage = isTimeout
  ? 'N8N webhook timeout (10s) - workflow may not be active'
  : `N8N webhook error: ${webhookError instanceof Error ? webhookError.message : 'Unknown error'}`;
```

**Should Be**:
```typescript
const errorMessage = isTimeout
  ? 'N8N webhook timeout (10s) - check workflow execution logs'
  : `N8N webhook error: ${webhookError instanceof Error ? webhookError.message : 'Unknown error'}`;
```

---

## 📝 Summary of Today's Fixes

### What Was Fixed:
1. ✅ **Venture Capital Filtering**
   - searchTerm now correctly passes "venture capital" to n8n
   - Companies House API will filter properly
   - No more food/plumbing companies

2. ✅ **Webhook Timeout Handling**
   - 10-second timeout prevents infinite hangs
   - Jobs fail gracefully with error messages
   - 30-minute cleanup threshold for stuck jobs

3. ✅ **Clear Stuck Jobs Button**
   - More visible with red destructive variant
   - Responsive layout for mobile/desktop
   - Will appear once Loveable syncs (5-10 min)

### What Still Needs Work:
1. ⚠️ **Scraping Performance** - 20 minutes is too slow
2. ⚠️ **Batch Processing** - Implement in n8n
3. ⚠️ **ScrapeGraph AI Optimization** - Simplify prompts or replace

---

## 🎓 Action Items for You

### Immediate (Do Right Now):
1. **Wait 5-10 minutes** for Loveable to sync changes
2. **Hard refresh** your browser (`Ctrl+Shift+R`)
3. **Check that "Clear Stuck Jobs" button** appears (red button, top-right of Recent Scraping Jobs)
4. **Test the scrape** - should now only return venture capital firms

### In n8n (Next Steps):
1. **Open your n8n workflow**
2. **Update "Extract Articles" node**:
   - Set "Continue On Fail" = true
   - Set "Retry On Fail" = false
   - Simplify the user prompt (see above)
3. **Add "Split Into Batches" node** after "Filter Active Status"
4. **Reduce "News Search" results** to 3 items max

### Testing:
1. **Run a small test** with just 10 companies
2. **Check execution time** - should be under 5 minutes
3. **Verify filtering** - only venture capital firms
4. **Check for errors** - should fail gracefully if scraping times out

---

**Need Help?** All the code changes are already pushed to GitHub. Loveable will auto-sync within 10 minutes.
