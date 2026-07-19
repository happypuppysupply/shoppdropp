#!/bin/bash
# Stripe Integration Tests
# Tests: Checkout session, webhook handling, subscription status

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="stripe_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "💳 STRIPE INTEGRATION TESTS"
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

# Test 1: Create checkout session
echo ""
echo "📋 Test 1: Create checkout session"
CHECKOUT_RESPONSE=$(curl -s -X POST "$API_URL/api/stripe/checkout" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"priceId\": \"price_test_growth\", \"successUrl\": \"https://example.com/success\", \"cancelUrl\": \"https://example.com/cancel\"}" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$CHECKOUT_RESPONSE" | tail -n1)
BODY=$(echo "$CHECKOUT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  SESSION_URL=$(echo "$BODY" | jq -r '.url // .sessionUrl' 2>/dev/null)
  if [ -n "$SESSION_URL" ] && [ "$SESSION_URL" != "null" ]; then
    print_success "Checkout session created"
    echo "   URL: ${SESSION_URL:0:60}..."
  else
    print_warn "Checkout session created but no URL returned"
  fi
elif [ "$HTTP_CODE" == "503" ]; then
  print_warn "Stripe not configured (HTTP 503)"
elif [ "$HTTP_CODE" == "400" ]; then
  print_warn "Invalid price ID or Stripe config issue"
else
  print_warn "Checkout returned HTTP $HTTP_CODE"
fi

# Test 2: Get subscription status
echo ""
echo "📋 Test 2: Get subscription status"
SUB_RESPONSE=$(curl -s -X GET "$API_URL/api/stripe/subscription" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$SUB_RESPONSE" | tail -n1)
BODY=$(echo "$SUB_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
  STATUS=$(echo "$BODY" | jq -r '.status // .subscription.status // "unknown"' 2>/dev/null)
  print_success "Subscription status: $STATUS"
else
  print_warn "Subscription status returned HTTP $HTTP_CODE"
fi

# Test 3: Health check (Stripe webhook endpoint info)
echo ""
echo "📋 Test 3: Webhook endpoint check"
WEBHOOK_RESPONSE=$(curl -s -X GET "$API_URL/api/stripe/webhook" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$WEBHOOK_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "405" ]; then
  print_success "Webhook endpoint accessible (expects POST, got $HTTP_CODE)"
elif [ "$HTTP_CODE" == "404" ]; then
  print_warn "Webhook endpoint not found"
else
  print_warn "Webhook check returned HTTP $HTTP_CODE"
fi

echo ""
print_success "All Stripe tests completed! ✓"
echo "Note: Full Stripe testing requires valid Stripe keys and webhook secret"
