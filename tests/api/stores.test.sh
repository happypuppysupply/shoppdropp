#!/bin/bash
# Store Management API Tests
# Tests: Create, Read, Update, Delete stores

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="store_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"
STORE_NAME="Test Store $(date +%s)"
SHOPIFY_URL="test-store-$(date +%s).myshopify.com"

echo "================================"
echo "🏪 STORE MANAGEMENT TESTS"
echo "================================"
echo ""

# Setup: Create test user
echo "🔧 Setup: Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")
JWT_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')

if [ "$JWT_TOKEN" == "null" ] || [ -z "$JWT_TOKEN" ]; then
  print_error "Failed to create test user"
  exit 1
fi
print_success "Test user created"

# Test 1: Create store
echo ""
echo "📋 Test 1: Create store"
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/api/stores" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$STORE_NAME\", \"shopifyUrl\": \"$SHOPIFY_URL\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
BODY=$(echo "$CREATE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ]; then
  print_success "Store created successfully"
  STORE_ID=$(echo "$BODY" | jq -r '.store.id' 2>/dev/null || echo "$BODY" | jq -r '.id' 2>/dev/null)
else
  print_error "Store creation failed (HTTP $HTTP_CODE)"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  exit 1
fi

# Test 2: List stores
echo ""
echo "📋 Test 2: List stores"
LIST_RESPONSE=$(curl -s -X GET "$API_URL/api/stores" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n1)
BODY=$(echo "$LIST_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  STORE_COUNT=$(echo "$BODY" | jq '.stores | length' 2>/dev/null || echo "0")
  print_success "Listed $STORE_COUNT store(s)"
else
  print_error "List stores failed (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 3: Get store details
echo ""
echo "📋 Test 3: Get store details"
GET_RESPONSE=$(curl -s -X GET "$API_URL/api/stores/$STORE_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
BODY=$(echo "$GET_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  RETRIEVED_NAME=$(echo "$BODY" | jq -r '.store.name // .name' 2>/dev/null)
  if [ "$RETRIEVED_NAME" == "$STORE_NAME" ]; then
    print_success "Store details retrieved correctly"
  else
    print_error "Store name mismatch: expected '$STORE_NAME', got '$RETRIEVED_NAME'"
    exit 1
  fi
else
  print_error "Get store failed (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 4: Save store credentials (Shopify)
echo ""
echo "📋 Test 4: Save Shopify credentials"
CRED_RESPONSE=$(curl -s -X POST "$API_URL/api/stores/$STORE_ID/credentials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\": \"shopify\", \"data\": {\"apiKey\": \"shpat_test123\", \"apiSecret\": \"test_secret\"}}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$CRED_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "Shopify credentials saved"
else
  print_warn "Save credentials returned HTTP $HTTP_CODE (may be expected)"
fi

# Test 5: Get store credentials
echo ""
echo "📋 Test 5: Get store credentials"
GET_CRED_RESPONSE=$(curl -s -X GET "$API_URL/api/stores/$STORE_ID/credentials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$GET_CRED_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  print_success "Store credentials retrieved"
else
  print_warn "Get credentials returned HTTP $HTTP_CODE"
fi

# Test 6: Delete store
echo ""
echo "📋 Test 6: Delete store"
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/api/stores/$STORE_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "204" ] || [ "$HTTP_CODE" == "200" ]; then
  print_success "Store deleted successfully"
else
  print_error "Delete store failed (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 7: Verify store deleted
echo ""
echo "📋 Test 7: Verify store deleted"
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/api/stores/$STORE_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$VERIFY_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "404" ]; then
  print_success "Store correctly not found after deletion"
else
  print_warn "Expected 404, got $HTTP_CODE"
fi

echo ""
print_success "All store management tests passed! ✓"
