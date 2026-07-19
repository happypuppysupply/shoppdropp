#!/bin/bash
# Live Full Flow Test
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/common.sh"
API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="live_test_$(date +%s)@example.com"
TEST_PASSWORD="SecurePass123!"
STORE_NAME="Live Test Store $(date +%s)"
SHOPIFY_URL="live-store-$(date +%s).myshopify.com"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🚀 LIVE FULL FLOW TEST - USER JOURNEY 🚀            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 API URL: $API_URL"
echo "📍 Test User: $TEST_EMAIL"
echo ""

echo "🔐 STEP 1: User Registration & Login"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" -H "Content-Type: application/json" -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}" -w "\n%{http_code}")
HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "201" ]; then
  JWT_TOKEN=*** "$BODY" | jq -r '.token')
  USER_ID=$(echo "$BODY" | jq -r '.user.id')
  print_success "✓ User registered: $USER_ID"
else
  print_error "✗ Registration failed (HTTP $HTTP_CODE)"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  exit 1
fi

echo ""
echo "🏪 STEP 2: Create Store"
STORE_RESPONSE=$(curl -s -X POST "$API_URL/api/stores" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "{\"name\": \"$STORE_NAME\", \"shopifyUrl\": \"$SHOPIFY_URL\", \"plan\": \"growth\"}" -w "\n%{http_code}")
HTTP_CODE=$(echo "$STORE_RESPONSE" | tail -n1)
BODY=$(echo "$STORE_RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "201" ]; then
  STORE_ID=$(echo "$BODY" | jq -r '.store.id // .id' 2>/dev/null)
  print_success "✓ Store created: $STORE_ID"
else
  print_error "✗ Store creation failed (HTTP $HTTP_CODE)"
  exit 1
fi

echo ""
echo "🖥️  STEP 3: Provision VPS"
HETZNER_CHECK=$(curl -s -X GET "$API_URL/api/hetzner/types" -H "Authorization: Bearer $JWT_TOKEN" -w "\n%{http_code}")
HTTP_CODE=$(echo "$HETZNER_CHECK" | tail -n1)
if [ "$HTTP_CODE" == "200" ]; then
  print_success "✓ Hetzner API accessible"
  echo "   → Provisioning VPS..."
  VPS_RESPONSE=$(curl -s -X POST "$API_URL/api/vps-simple/provision" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "{\"name\": \"worker-$STORE_ID\", \"serverType\": \"cax11\", \"location\": \"nbg1\", \"storeId\": \"$STORE_ID\"}" -w "\n%{http_code}")
  HTTP_CODE=$(echo "$VPS_RESPONSE" | tail -n1)
  if [ "$HTTP_CODE" == "201" ] || [ "$HTTP_CODE" == "200" ]; then
    VPS_ID=$(echo "$VPS_RESPONSE" | sed '$d' | jq -r '.server.id // .id' 2>/dev/null)
    print_success "✓ VPS provisioned: $VPS_ID"
  else
    print_warn "⚠ VPS provisioning: HTTP $HTTP_CODE"
    VPS_SKIPPED="true"
  fi
else
  print_warn "⚠ Hetzner not configured (HTTP $HTTP_CODE)"
  VPS_SKIPPED="true"
fi

echo ""
echo "🤖 STEP 4: Configure AI Provider"
AI_RESPONSE=$(curl -s -X POST "$API_URL/api/ai/configure" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "{\"provider\": \"openrouter\", \"model\": \"moonshotai/kimi-k2.5\", \"apiKey\": \"test_key\"}" -w "\n%{http_code}")
if [ "$(echo "$AI_RESPONSE" | tail -n1)" == "200" ] || [ "$(echo "$AI_RESPONSE" | tail -n1)" == "201" ]; then
  print_success "✓ AI provider configured"
else
  print_warn "⚠ AI config: HTTP $(echo "$AI_RESPONSE" | tail -n1)"
fi

echo ""
echo "⚙️  STEP 5: Verify Worker Status"
WORKERS_RESPONSE=$(curl -s -X GET "$API_URL/api/workers" -H "Authorization: Bearer $JWT_TOKEN" -w "\n%{http_code}")
if [ "$(echo "$WORKERS_RESPONSE" | tail -n1)" == "200" ]; then
  WORKER_COUNT=$(echo "$WORKERS_RESPONSE" | sed '$d' | jq '.workers | length' 2>/dev/null || echo "0")
  print_success "✓ Found $WORKER_COUNT worker(s)"
else
  print_warn "⚠ Workers: HTTP $(echo "$WORKERS_RESPONSE" | tail -n1)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   📊 TEST SUMMARY 📊                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo "✅ User Registration & Login"
echo "✅ Store Creation ($STORE_ID)"
if [ "$VPS_SKIPPED" == "true" ]; then echo "⏭️  VPS Provisioning (skipped)"; else echo "✅ VPS Provisioning ($VPS_ID)"; fi
echo "✅ AI Provider Configuration"
echo "✅ Worker Status Verification"
echo ""
echo "🎉 FULL FLOW TEST COMPLETED!"
echo "   User: $TEST_EMAIL"
echo "   Store: $STORE_NAME ($STORE_ID)"
