/**
 * Test Suite for Filter Workflow
 *
 * Tests all filter stages and edge functions with various scenarios
 *
 * Run with:
 *   deno test --allow-net --allow-env supabase/functions/_tests/test-filter-workflow.ts
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// Configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://utzxdzkebdgwxgqhieee.supabase.co";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Test entities
const TEST_ENTITIES = {
  // Should PASS all filters
  nonexistent: {
    entity_name: "Nonexistent Ventures Ltd XYZ123",
    registry_id: "TEST001",
    country: "United Kingdom",
    status: "active"
  },

  // Should FAIL domain check
  google: {
    entity_name: "Google",
    registry_id: "TEST002",
    country: "United States",
    status: "active"
  },

  // Should FAIL negative press check
  enron: {
    entity_name: "Enron",
    registry_id: "TEST003",
    country: "United States",
    status: "active"
  },

  // Should FAIL online presence check
  microsoft: {
    entity_name: "Microsoft",
    registry_id: "TEST004",
    country: "United States",
    status: "active"
  },

  // Should FAIL active status
  inactive: {
    entity_name: "Test Inactive Company",
    registry_id: "TEST005",
    country: "United Kingdom",
    status: "dissolved"
  }
};

/**
 * Helper function to call edge function
 */
async function callEdgeFunction(
  functionName: string,
  payload: any
): Promise<any> {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Function ${functionName} failed: ${response.status} ${await response.text()}`);
  }

  return await response.json();
}

/**
 * Test 1: Domain Availability Check
 */
Deno.test("Domain Availability - Available Domain", async () => {
  const result = await callEdgeFunction("check-domain-availability", {
    domain: "nonexistentventures123xyz.com",
    entity_id: TEST_ENTITIES.nonexistent.registry_id,
  });

  console.log("Domain availability result:", result);

  assertExists(result.available);
  assertExists(result.status);
  assertEquals(result.available, true);
  assertEquals(result.status, "available");
});

Deno.test("Domain Availability - Registered Domain", async () => {
  const result = await callEdgeFunction("check-domain-availability", {
    domain: "google.com",
    entity_id: TEST_ENTITIES.google.registry_id,
  });

  console.log("Domain availability result:", result);

  assertExists(result.available);
  assertEquals(result.available, false);
  assertEquals(result.status, "registered");
});

/**
 * Test 2: Negative Press Check
 */
Deno.test("Negative Press - Clean Entity", async () => {
  const result = await callEdgeFunction("check-negative-press", {
    entity_name: TEST_ENTITIES.nonexistent.entity_name,
    registry_id: TEST_ENTITIES.nonexistent.registry_id,
    country: TEST_ENTITIES.nonexistent.country,
  });

  console.log("Negative press result:", result);

  assertExists(result.has_negative_press);
  assertExists(result.articles);
  assertExists(result.sentiment_score);

  // Should have low/no negative sentiment
  assertEquals(result.has_negative_press, false);
});

Deno.test("Negative Press - Entity with Negative History", async () => {
  const result = await callEdgeFunction("check-negative-press", {
    entity_name: TEST_ENTITIES.enron.entity_name,
    registry_id: TEST_ENTITIES.enron.registry_id,
    country: TEST_ENTITIES.enron.country,
  });

  console.log("Negative press result:", result);

  assertExists(result.has_negative_press);
  assertExists(result.sentiment_score);

  // Enron should have negative press
  // Note: This test may fail if NewsAPI key is not configured
  console.log("Sentiment score:", result.sentiment_score);
});

/**
 * Test 3: Online Presence Check
 */
Deno.test("Online Presence - No Presence", async () => {
  const result = await callEdgeFunction("check-online-presence", {
    entity_name: TEST_ENTITIES.nonexistent.entity_name,
    registry_id: TEST_ENTITIES.nonexistent.registry_id,
    potential_domains: [
      "nonexistentventures123xyz.com",
      "nonexistentventures123xyz.co.uk"
    ],
  });

  console.log("Online presence result:", result);

  assertExists(result.domain_exists);
  assertExists(result.website_active);
  assertExists(result.social_profiles);

  // Should have no online presence
  assertEquals(result.domain_exists, false);
  assertEquals(result.website_active, false);
});

Deno.test("Online Presence - Strong Presence", async () => {
  const result = await callEdgeFunction("check-online-presence", {
    entity_name: TEST_ENTITIES.microsoft.entity_name,
    registry_id: TEST_ENTITIES.microsoft.registry_id,
    potential_domains: [
      "microsoft.com"
    ],
  });

  console.log("Online presence result:", result);

  assertExists(result.domain_exists);
  assertExists(result.website_active);

  // Microsoft should have strong online presence
  assertEquals(result.domain_exists, true);
  assertEquals(result.website_active, true);
});

/**
 * Test 4: Aggregate Filter Results
 */
Deno.test("Aggregate Results - Qualified Entity", async () => {
  // First, create some check results
  const entityId = TEST_ENTITIES.nonexistent.registry_id;

  // Run all checks
  await callEdgeFunction("check-domain-availability", {
    domain: "nonexistentventures123xyz.com",
    entity_id: entityId,
  });

  await callEdgeFunction("check-negative-press", {
    entity_name: TEST_ENTITIES.nonexistent.entity_name,
    registry_id: entityId,
    country: TEST_ENTITIES.nonexistent.country,
  });

  await callEdgeFunction("check-online-presence", {
    entity_name: TEST_ENTITIES.nonexistent.entity_name,
    registry_id: entityId,
    potential_domains: ["nonexistentventures123xyz.com"],
  });

  // Wait a bit for DB writes
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Now aggregate
  const result = await callEdgeFunction("aggregate-filter-results", {
    entity_id: entityId,
  });

  console.log("Aggregated result:", result);

  assertExists(result.overall_status);
  assertExists(result.passed_checks);
  assertExists(result.failed_checks);
  assertExists(result.filter_notes);
  assertExists(result.score);

  console.log(`Status: ${result.overall_status}, Score: ${result.score}`);
  console.log(`Passed: ${result.passed_checks.join(", ")}`);
  console.log(`Failed: ${result.failed_checks.join(", ")}`);
});

/**
 * Test 5: End-to-End Workflow Test
 */
Deno.test("E2E - Full Filter Pipeline", async () => {
  const testEntity = {
    legal_name: "Test E2E Company Ltd",
    registry_id: "TEST_E2E_001",
    status: "active",
    country: "United Kingdom",
  };

  console.log("\n=== Running Full Filter Pipeline ===\n");

  // Step 1: Check active status
  console.log("1. Active Status Check");
  const isActive = testEntity.status.toLowerCase() === "active";
  console.log(`   Result: ${isActive ? "PASS" : "FAIL"}`);

  // Step 2: Domain availability
  console.log("2. Domain Availability Check");
  const domainResult = await callEdgeFunction("check-domain-availability", {
    domain: "teste2ecompanyltd.com",
    entity_id: testEntity.registry_id,
  });
  console.log(`   Result: ${domainResult.available ? "PASS (available)" : "FAIL (taken)"}`);

  // Step 3: Negative press
  console.log("3. Negative Press Check");
  const pressResult = await callEdgeFunction("check-negative-press", {
    entity_name: testEntity.legal_name,
    registry_id: testEntity.registry_id,
    country: testEntity.country,
  });
  console.log(`   Result: ${!pressResult.has_negative_press ? "PASS (clean)" : "FAIL (negative press)"}`);
  console.log(`   Sentiment Score: ${pressResult.sentiment_score}`);

  // Step 4: Online presence
  console.log("4. Online Presence Check");
  const presenceResult = await callEdgeFunction("check-online-presence", {
    entity_name: testEntity.legal_name,
    registry_id: testEntity.registry_id,
    potential_domains: ["teste2ecompanyltd.com"],
  });
  const hasPresence = presenceResult.domain_exists ||
                      presenceResult.website_active ||
                      Object.values(presenceResult.social_profiles).some(v => v === true);
  console.log(`   Result: ${!hasPresence ? "PASS (no presence)" : "FAIL (has presence)"}`);

  // Step 5: Aggregate
  console.log("5. Aggregating Results");
  await new Promise(resolve => setTimeout(resolve, 2000));

  const aggregateResult = await callEdgeFunction("aggregate-filter-results", {
    entity_id: testEntity.registry_id,
  });

  console.log(`\n=== Final Result ===`);
  console.log(`Status: ${aggregateResult.overall_status}`);
  console.log(`Score: ${aggregateResult.score}/100`);
  console.log(`Passed Checks: ${aggregateResult.passed_checks.join(", ")}`);
  console.log(`Failed Checks: ${aggregateResult.failed_checks.join(", ")}`);
  console.log(`\nNotes:`);
  aggregateResult.filter_notes.forEach((note: string) => console.log(`  ${note}`));

  assertExists(aggregateResult.overall_status);
});

/**
 * Test 6: Error Handling
 */
Deno.test("Error Handling - Invalid Domain Format", async () => {
  const result = await callEdgeFunction("check-domain-availability", {
    domain: "invalid domain with spaces",
    entity_id: "TEST_ERROR_001",
  });

  assertExists(result.error);
  assertEquals(result.status, "error");
});

Deno.test("Error Handling - Missing Required Fields", async () => {
  try {
    await callEdgeFunction("check-negative-press", {
      // Missing entity_name
      registry_id: "TEST_ERROR_002",
    });
  } catch (error) {
    assertExists(error);
    console.log("Expected error:", error.message);
  }
});

console.log("\n=== Test Suite Configuration ===");
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Service Key: ${SUPABASE_KEY ? "✓ Configured" : "✗ Missing"}`);
console.log(`\nTest entities prepared: ${Object.keys(TEST_ENTITIES).length}`);
console.log("===========================\n");
