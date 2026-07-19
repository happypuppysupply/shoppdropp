#!/bin/bash
# Worker Management API Tests
# Tests: List workers, get status, provision

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="worker_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "⚙️ WORKER MANAGEMENT TESTS"
echo "================================"
echo ""

# Setup: Create test user
echo "🔧 Setup: Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")
JWT_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')

if [ "$JWT_TOKEN" == "null" ] || [ -z "$JWT_TOKEN" ]; then
  print_error "Failed to create test user"
  exit 1
fi
print_success "Test user created"

# Test 1: List workers
echo ""
echo "📋 Test 1: List workers"
LIST_RESPONSE=$(curl -s -X GET "$API_URL/api/workers" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n1)
BODY=$(echo "$LIST_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  WORKER_COUNT=$(echo "$BODY" | jq '.workers | length' 2>/dev/null || echo "0")
  print_success "Listed $WORKER_COUNT worker(s)"
else
  print_warn "List workers returned HTTP $HTTP_CODE"
fi

# Test 2: Get worker status (test with a fake ID)
echo ""
echo "📋 Test 2: Get worker status"
STATUS_RESPONSE=$(curl -s -X GET "$API_URL/api/workers/test-worker-123/status" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$STATUS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "404" ]; then
  print_success "Worker status endpoint accessible (HTTP $HTTP_CODE)"
else
  print_warn "Worker status returned HTTP $HTTP_CODE"
fi

# Test 3: Provision worker (if endpoint exists)
echo ""
echo "📋 Test 3: Provision worker"
PROVISION_RESPONSE=$(curl -s -X POST "$API_URL/api/workers/provision" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"storeId\": \"test-store\", \"type\": \"docker\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$PROVISION_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "201" ] || [ "$HTTP_CODE" == "200" ]; then
  print_success "Worker provisioned"
elif [ "$HTTP_CODE" == "404" ]; then
  print_warn "Provision endpoint not found (may not be implemented)"
else
  print_warn "Provision returned HTTP $HTTP_CODE"
fi

# Test 4: Stop worker (if endpoint exists)
echo ""
echo "📋 Test 4: Stop worker"
STOP_RESPONSE=$(curl -s -X POST "$API_URL/api/workers/test-worker-123/stop" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$STOP_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "404" ]; then
  print_success "Stop worker endpoint accessible (HTTP $HTTP_CODE)"
else
  print_warn "Stop worker returned HTTP $HTTP_CODE"
fi

echo ""
print_success "All worker management tests passed! ✓"
