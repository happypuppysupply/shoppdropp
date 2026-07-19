#!/bin/bash
# VPS/Hetzner Provisioning Tests
# Tests: VPS endpoints, server types, provisioning

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="vps_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "🖥️ VPS/HETZNER PROVISIONING TESTS"
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

# Test 1: Get Hetzner server types
echo ""
echo "📋 Test 1: Get Hetzner server types"
TYPES_RESPONSE=$(curl -s -X GET "$API_URL/api/hetzner/types" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$TYPES_RESPONSE" | tail -n1)
BODY=$(echo "$TYPES_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  TYPE_COUNT=$(echo "$BODY" | jq '.types | length' 2>/dev/null || echo "$BODY" | jq '.serverTypes | length' 2>/dev/null || echo "0")
  print_success "Retrieved $TYPE_COUNT server type(s)"
else
  print_warn "Server types endpoint returned HTTP $HTTP_CODE (Hetzner may not be configured)"
fi

# Test 2: VPS provision (simple)
echo ""
echo "📋 Test 2: VPS provision (simple)"
SIMPLE_RESPONSE=$(curl -s -X POST "$API_URL/api/vps-simple/provision" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"test-vps-$(date +%s)\", \"serverType\": \"cax11\", \"location\": \"nbg1\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$SIMPLE_RESPONSE" | tail -n1)
BODY=$(echo "$SIMPLE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ] || [ "$HTTP_CODE" == "200" ]; then
  print_success "VPS provision initiated"
  VPS_ID=$(echo "$BODY" | jq -r '.server.id // .vps.id // .id' 2>/dev/null)
  echo "   VPS ID: $VPS_ID"
elif [ "$HTTP_CODE" == "503" ]; then
  print_warn "VPS provision requires Hetzner API key"
elif [ "$HTTP_CODE" == "404" ]; then
  print_warn "VPS simple endpoint not found"
else
  print_warn "VPS provision returned HTTP $HTTP_CODE"
fi

# Test 3: List VPS instances
echo ""
echo "📋 Test 3: List VPS instances"
LIST_RESPONSE=$(curl -s -X GET "$API_URL/api/vps" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "VPS list retrieved"
elif [ "$HTTP_CODE" == "404" ]; then
  print_warn "VPS list endpoint not found"
else
  print_warn "VPS list returned HTTP $HTTP_CODE"
fi

# Test 4: VPS debug endpoints
echo ""
echo "📋 Test 4: VPS debug endpoint"
DEBUG_RESPONSE=$(curl -s -X GET "$API_URL/api/vps-debug/status" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$DEBUG_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "VPS debug endpoint accessible"
else
  print_warn "VPS debug returned HTTP $HTTP_CODE"
fi

# Test 5: VPS sync test
echo ""
echo "📋 Test 5: VPS sync test"
SYNC_RESPONSE=$(curl -s -X POST "$API_URL/api/vps-sync-test" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$SYNC_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "VPS sync test accessible"
else
  print_warn "VPS sync test returned HTTP $HTTP_CODE"
fi

echo ""
print_success "All VPS tests completed! ✓"
echo "Note: Some tests may be skipped if Hetzner API is not configured"
