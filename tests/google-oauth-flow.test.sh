#!/bin/bash
# Google OAuth + Store + VPS + Worker Flow Test
# Actual user journey: OAuth → Store → VPS → Worker

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="user$(date +%s)@test.com"
STORE_NAME="Store $(date +%s)"
SHOPIFY_URL="shop$(date +%s).myshopify.com"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     GOOGLE OAUTH → STORE → VPS → WORKER FLOW TEST        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "API URL: $API_URL"
echo ""

# STEP 1: AUTH (simulating Google OAuth)
echo "STEP 1: Authentication"
echo "----------------------"
AUTH_BODY="{\"email\": \"$TEST_EMAIL\", \"password\": \"SecurePass123!\", \"plan\": \"growth\"}"
AUTH_FULL=$(curl -s -X POST "$API_URL/api/auth/register" -H "Content-Type: application/json" -d "$AUTH_BODY" -w "\nHTTP_CODE:%{http_code}")
AUTH_CODE=$(echo "$AUTH_FULL" | grep "HTTP_CODE:" | cut -d: -f2)
AUTH_JSON=$(echo "$AUTH_FULL" | sed 's/HTTP_CODE:.*//')

echo "Register response: HTTP $AUTH_CODE"

if [ "$AUTH_CODE" = "201" ] || [ "$AUTH_CODE" = "200" ]; then
  JWT_TOKEN=$(echo "$AUTH_JSON" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  USER_ID=$(echo "$AUTH_JSON" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "✅ User created: $USER_ID"
else
  echo "⚠️  Auth issue: $(echo "$AUTH_JSON" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
  # For testing, create a mock token to test other endpoints
  JWT_TOKEN="test_token_$(date +%s)"
  USER_ID="test_user_$(date +%s)"
fi

echo ""

# STEP 2: CREATE STORE
echo "STEP 2: Create Store"
echo "--------------------"
STORE_BODY="{\"name\": \"$STORE_NAME\", \"shopifyUrl\": \"$SHOPIFY_URL\", \"plan\": \"growth\"}"
STORE_FULL=$(curl -s -X POST "$API_URL/api/stores" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "$STORE_BODY" -w "\nHTTP_CODE:%{http_code}")
STORE_CODE=$(echo "$STORE_FULL" | grep "HTTP_CODE:" | cut -d: -f2)
STORE_JSON=$(echo "$STORE_FULL" | sed 's/HTTP_CODE:.*//')

echo "Store response: HTTP $STORE_CODE"

if [ "$STORE_CODE" = "201" ]; then
  STORE_ID=$(echo "$STORE_JSON" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "✅ Store created: $STORE_ID"
else
  echo "⚠️  Store: $(echo "$STORE_JSON" | head -c 100)"
  STORE_ID="test_store_$(date +%s)"
fi

echo ""

# STEP 3: VPS PROVISIONING
echo "STEP 3: VPS Provisioning (Hetzner)"
echo "----------------------------------"

# Check Hetzner
HETZ_FULL=$(curl -s -X GET "$API_URL/api/hetzner/server-types" -H "Authorization: Bearer $JWT_TOKEN" -w "\nHTTP_CODE:%{http_code}")
HETZ_CODE=$(echo "$HETZ_FULL" | grep "HTTP_CODE:" | cut -d: -f2)

echo "Hetzner check: HTTP $HETZ_CODE"

if [ "$HETZ_CODE" = "200" ]; then
  echo "✅ Hetzner API accessible"
  
  VPS_BODY="{\"name\": \"worker-$STORE_ID\", \"serverType\": \"cax11\", \"location\": \"nbg1\", \"storeId\": \"$STORE_ID\"}"
  VPS_FULL=$(curl -s -X POST "$API_URL/api/vps-simple/create-and-provision" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "$VPS_BODY" -w "\nHTTP_CODE:%{http_code}")
  VPS_CODE=$(echo "$VPS_FULL" | grep "HTTP_CODE:" | cut -d: -f2)
  VPS_JSON=$(echo "$VPS_FULL" | sed 's/HTTP_CODE:.*//')
  
  echo "VPS provision: HTTP $VPS_CODE"
  
  if [ "$VPS_CODE" = "201" ] || [ "$VPS_CODE" = "200" ]; then
    VPS_ID=$(echo "$VPS_JSON" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    echo "✅ VPS provisioned: $VPS_ID"
  else
    echo "⚠️  VPS: $(echo "$VPS_JSON" | head -c 100)"
    VPS_ID="test_vps"
  fi
else
  echo "⚠️  Hetzner not configured"
  VPS_ID="test_vps"
fi

echo ""

# STEP 4: AI CONFIG
echo "STEP 4: AI Provider Configuration"
echo "---------------------------------"
AI_BODY="{\"provider\": \"openrouter\", \"model\": \"moonshotai/kimi-k2.5\", \"apiKey\": \"test_key\"}"
AI_FULL=$(curl -s -X POST "$API_URL/api/ai/configure" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d "$AI_BODY" -w "\nHTTP_CODE:%{http_code}")
AI_CODE=$(echo "$AI_FULL" | grep "HTTP_CODE:" | cut -d: -f2)

echo "AI config: HTTP $AI_CODE"
if [ "$AI_CODE" = "200" ] || [ "$AI_CODE" = "201" ]; then
  echo "✅ AI configured"
else
  echo "⚠️  AI config issue"
fi

echo ""

# STEP 5: WORKER STATUS
echo "STEP 5: Worker Status"
echo "---------------------"
WORKERS_FULL=$(curl -s -X GET "$API_URL/api/workers" -H "Authorization: Bearer $JWT_TOKEN" -w "\nHTTP_CODE:%{http_code}")
WORKERS_CODE=$(echo "$WORKERS_FULL" | grep "HTTP_CODE:" | cut -d: -f2)
WORKERS_JSON=$(echo "$WORKERS_FULL" | sed 's/HTTP_CODE:.*//')

echo "Workers: HTTP $WORKERS_CODE"
if [ "$WORKERS_CODE" = "200" ]; then
  COUNT=$(echo "$WORKERS_JSON" | grep -o '"workers"' | wc -l)
  echo "✅ Workers endpoint working"
else
  echo "⚠️  Workers: requires auth"
fi

# WebSocket check
WS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/ws?workerId=test" 2>/dev/null || echo "000")
echo "WebSocket: HTTP $WS_CODE (expects 400/426 for non-WS)"
if [ "$WS_CODE" = "400" ] || [ "$WS_CODE" = "426" ]; then
  echo "✅ WebSocket endpoint ready"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                      TEST COMPLETE                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Flow: OAuth → Store → VPS → Worker"
echo "User: $USER_ID"
echo "Store: $STORE_ID"
echo "VPS: $VPS_ID"
echo ""
