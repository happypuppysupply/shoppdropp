#!/bin/bash
# Authentication API Tests
# Tests: Register, Login, Token Validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "🔐 AUTHENTICATION TESTS"
echo "================================"
echo "API URL: $API_URL"
echo ""

# Test 1: Register new user
echo "📋 Test 1: Register new user"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ]; then
  print_success "User registered successfully"
  USER_ID=$(echo "$BODY" | jq -r '.user.id' 2>/dev/null || echo "parse_failed")
  JWT_TOKEN=$(echo "$BODY" | jq -r '.token' 2>/dev/null || echo "parse_failed")
else
  print_error "Registration failed (HTTP $HTTP_CODE)"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  exit 1
fi

# Test 2: Login with credentials
echo ""
echo "📋 Test 2: Login with credentials"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  print_success "Login successful"
  JWT_TOKEN=$(echo "$BODY" | jq -r '.token' 2>/dev/null)
else
  print_error "Login failed (HTTP $HTTP_CODE)"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  exit 1
fi

# Test 3: Access protected endpoint
echo ""
echo "📋 Test 3: Access protected endpoint with JWT"
PROTECTED_RESPONSE=$(curl -s -X GET "$API_URL/api/stores" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$PROTECTED_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "JWT token validation passed"
else
  print_error "JWT validation failed (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 4: Reject invalid credentials
echo ""
echo "📋 Test 4: Reject invalid credentials"
INVALID_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"wrongpassword\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$INVALID_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "401" ]; then
  print_success "Invalid credentials correctly rejected"
else
  print_error "Expected 401, got $HTTP_CODE"
  exit 1
fi

# Cleanup: Delete test user (if endpoint exists)
echo ""
echo "📋 Test 5: Cleanup - Delete test user"
curl -s -X DELETE "$API_URL/api/users/$USER_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o /dev/null -w "%{http_code}" 2>/dev/null | grep -q "204\|404" && print_success "Cleanup handled" || print_warn "Cleanup skipped (endpoint may not exist)"

echo ""
print_success "All authentication tests passed! ✓"
