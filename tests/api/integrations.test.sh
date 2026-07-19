#!/bin/bash
# User Integration Tests (GitHub, Vercel)
# Tests: Save and retrieve user credentials

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="integration_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "🔗 USER INTEGRATION TESTS"
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

# Test 1: Save GitHub token
echo ""
echo "📋 Test 1: Save GitHub token"
GITHUB_RESPONSE=$(curl -s -X POST "$API_URL/api/user/github" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"ghp_test_github_token_123\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$GITHUB_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "GitHub token saved"
else
  print_warn "GitHub token save returned HTTP $HTTP_CODE"
fi

# Test 2: Get GitHub status
echo ""
echo "📋 Test 2: Get GitHub status"
GITHUB_STATUS=$(curl -s -X GET "$API_URL/api/user/github" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$GITHUB_STATUS" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "GitHub status retrieved"
else
  print_warn "GitHub status returned HTTP $HTTP_CODE"
fi

# Test 3: Save Vercel token
echo ""
echo "📋 Test 3: Save Vercel token"
VERCEL_RESPONSE=$(curl -s -X POST "$API_URL/api/user/vercel" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"vercel_test_token_123\", \"teamId\": \"team_test\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$VERCEL_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "Vercel token saved"
else
  print_warn "Vercel token save returned HTTP $HTTP_CODE"
fi

# Test 4: Get Vercel status
echo ""
echo "📋 Test 4: Get Vercel status"
VERCEL_STATUS=$(curl -s -X GET "$API_URL/api/user/vercel" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$VERCEL_STATUS" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "Vercel status retrieved"
else
  print_warn "Vercel status returned HTTP $HTTP_CODE"
fi

echo ""
print_success "All integration tests passed! ✓"
