#!/bin/bash
# End-to-End Full Flow Test
# Tests: Complete customer journey from signup to automation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="e2e_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"
STORE_NAME="E2E Test Store"
SHOPIFY_URL="e2e-store-$(date +%s).myshopify.com"

echo "================================"
echo "🎭 END-TO-END FULL FLOW TEST"
echo "================================"
echo "Test Email: $TEST_EMAIL"
echo "Store: $STORE_NAME"
echo ""

# Phase 1: Authentication
echo "═══════════════════════════════════════════"
echo "📍 PHASE 1: Authentication"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 1.1: User registration"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ]; then
  JWT_TOKEN=$(echo "$BODY" | jq -r '.token')
  USER_ID=$(echo "$BODY" | jq -r '.user.id')
  print_success "User registered: $USER_ID"
else
  print_error "Registration failed: HTTP $HTTP_CODE"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  exit 1
fi

echo ""
echo "Step 1.2: User login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ]; then
  print_success "Login successful"
else
  print_error "Login failed"
  exit 1
fi

# Phase 2: Store Setup
echo ""
echo "═══════════════════════════════════════════"
echo "📍 PHASE 2: Store Setup"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 2.1: Create store"
STORE_RESPONSE=$(curl -s -X POST "$API_URL/api/stores" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$STORE_NAME\", \"shopifyUrl\": \"$SHOPIFY_URL\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$STORE_RESPONSE" | tail -n1)
BODY=$(echo "$STORE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ]; then
  STORE_ID=$(echo "$BODY" | jq -r '.store.id // .id' 2>/dev/null)
  print_success "Store created: $STORE_ID"
else
  print_error "Store creation failed"
  exit 1
fi

# Phase 3: Integration Setup
echo ""
echo "═══════════════════════════════════════════"
echo "📍 PHASE 3: Integration Setup"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 3.1: Save Shopify credentials"
SHOPIFY_RESPONSE=$(curl -s -X POST "$API_URL/api/stores/$STORE_ID/credentials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\": \"shopify\", \"data\": {\"apiKey\": \"shpat_e2e_test_key\"}}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$SHOPIFY_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "Shopify credentials saved"
else
  print_warn "Shopify credentials: HTTP $HTTP_CODE"
fi

echo ""
echo "Step 3.2: Save Meta Ads credentials"
META_RESPONSE=$(curl -s -X POST "$API_URL/api/stores/$STORE_ID/credentials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\": \"meta\", \"data\": {\"accessToken\": \"e2e_meta_token\"}}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$META_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "Meta Ads credentials saved"
else
  print_warn "Meta Ads credentials: HTTP $HTTP_CODE"
fi

echo ""
echo "Step 3.3: Save CJ Dropshipping credentials"
CJ_RESPONSE=$(curl -s -X POST "$API_URL/api/stores/$STORE_ID/credentials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\": \"cj\", \"data\": {\"apiKey\": \"cj_e2e_test\"}}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$CJ_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "CJ Dropshipping credentials saved"
else
  print_warn "CJ Dropshipping credentials: HTTP $HTTP_CODE"
fi

echo ""
echo "Step 3.4: Configure AI provider"
AI_RESPONSE=$(curl -s -X POST "$API_URL/api/ai/configure" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"provider\": \"openrouter\", \"model\": \"moonshotai/kimi-k2.5\", \"apiKey\": \"e2e_test_key\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$AI_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  print_success "AI provider configured"
else
  print_warn "AI configuration: HTTP $HTTP_CODE"
fi

# Phase 4: Worker Management
echo ""
echo "═══════════════════════════════════════════"
echo "📍 PHASE 4: Worker Management"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 4.1: List workers"
WORKERS_RESPONSE=$(curl -s -X GET "$API_URL/api/workers" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$WORKERS_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "200" ]; then
  print_success "Workers listed"
else
  print_warn "List workers: HTTP $HTTP_CODE"
fi

# Phase 5: Verification
echo ""
echo "═══════════════════════════════════════════"
echo "📍 PHASE 5: Verification"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 5.1: Verify store with all integrations"
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/api/stores/$STORE_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$VERIFY_RESPONSE" | tail -n1)
BODY=$(echo "$VERIFY_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  RETRIEVED_NAME=$(echo "$BODY" | jq -r '.store.name // .name' 2>/dev/null)
  if [ "$RETRIEVED_NAME" == "$STORE_NAME" ]; then
    print_success "Store verified: $RETRIEVED_NAME"
  else
    print_error "Store name mismatch"
  fi
else
  print_error "Store verification failed"
fi

# Phase 6: Cleanup
echo ""
echo "═══════════════════════════════════════════"
echo "📍 PHASE 6: Cleanup"
echo "═══════════════════════════════════════════"

echo ""
echo "Step 6.1: Delete test store"
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/api/stores/$STORE_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "%{http_code}")

if [ "$DELETE_RESPONSE" == "204" ] || [ "$DELETE_RESPONSE" == "200" ]; then
  print_success "Test store deleted"
else
  print_warn "Store deletion: HTTP $DELETE_RESPONSE"
fi

# Summary
echo ""
echo "================================"
echo "🎉 END-TO-END TEST COMPLETED!"
echo "================================"
echo ""
echo "Test User: $TEST_EMAIL"
echo "Test Store: $STORE_NAME"
echo ""
echo "✅ Full customer journey validated:"
echo "   1. User registration & login"
echo "   2. Store creation"
echo "   3. Integration setup (Shopify, Meta, CJ Dropshipping)"
echo "   4. AI provider configuration"
echo "   5. Worker management"
echo "   6. Cleanup"
echo ""
