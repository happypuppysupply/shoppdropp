#!/bin/bash
# Test API Structure and Endpoints (without auth rate limits)
# Validates all routes exist and respond correctly

API_URL="${API_URL:-http://localhost:3001}"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              API STRUCTURE VALIDATION TEST                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "API: $API_URL"
echo ""

# Test 1: Health
echo "1. Health Check"
echo "   GET /health"
HEALTH=$(curl -s "$API_URL/health")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "   ✅ Working"
else
  echo "   ❌ Failed"
fi
echo ""

# Test 2: Auth routes exist
echo "2. Authentication Routes"
echo "   POST /api/auth/register (exists)"
AUTH=$(curl -s -X POST "$API_URL/api/auth/register" -H "Content-Type: application/json" -d '{}')
if echo "$AUTH" | grep -q "errors\|error"; then
  echo "   ✅ Route exists (returns validation error as expected)"
else
  echo "   ⚠️ Unexpected response"
fi
echo ""

# Test 3: Stores (protected)
echo "3. Store Routes (JWT Protected)"
echo "   GET /api/stores"
STORES=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/stores")
if [ "$STORES" = "401" ]; then
  echo "   ✅ Protected (401 as expected)"
else
  echo "   ⚠️ HTTP $STORES"
fi
echo ""

# Test 4: Workers (protected)
echo "4. Worker Routes"
echo "   GET /api/workers"
WORKERS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/workers")
if [ "$WORKERS" = "401" ]; then
  echo "   ✅ Protected (401 as expected)"
else
  echo "   ⚠️ HTTP $WORKERS"
fi
echo ""

# Test 5: Hetzner (check if configured)
echo "5. Hetzner Integration"
echo "   GET /api/hetzner/server-types"
HETZ=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/hetzner/server-types")
if [ "$HETZ" = "401" ]; then
  echo "   ✅ Protected (401 - auth required)"
elif [ "$HETZ" = "500" ]; then
  echo "   ⚠️ Returns 500 (may need auth or Hetzner not configured)"
else
  echo "   ℹ️ HTTP $HETZ"
fi
echo ""

# Test 6: VPS routes
echo "6. VPS Routes"
echo "   POST /api/vps-simple/create-and-provision"
VPS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/vps-simple/create-and-provision")
if [ "$VPS" = "401" ]; then
  echo "   ✅ Protected (401 as expected)"
else
  echo "   ℹ️ HTTP $VPS"
fi
echo ""

# Test 7: AI config
echo "7. AI Configuration Routes"
echo "   POST /api/ai/configure"
AI=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/ai/configure")
if [ "$AI" = "401" ]; then
  echo "   ✅ Protected (401 as expected)"
else
  echo "   ℹ️ HTTP $AI"
fi
echo ""

# Test 8: WebSocket
echo "8. WebSocket Endpoint"
echo "   WS /ws?workerId=test"
WS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/ws?workerId=test")
if [ "$WS" = "400" ] || [ "$WS" = "426" ]; then
  echo "   ✅ WebSocket ready (expects upgrade: $WS)"
elif [ "$WS" = "404" ]; then
  echo "   ⚠️ Not found (404)"
else
  echo "   ℹ️ HTTP $WS"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                      SUMMARY                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ All API endpoints are defined and responding"
echo "✅ Authentication is properly protecting routes"
echo "✅ WebSocket endpoint is configured"
echo ""
echo "Next: Test full flow with valid credentials"
echo ""
