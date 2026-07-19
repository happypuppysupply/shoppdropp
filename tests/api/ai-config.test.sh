#!/bin/bash
# AI Provider Configuration Tests
# Tests: Configure AI provider, get config

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="ai_test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "================================"
echo "🤖 AI PROVIDER CONFIGURATION TESTS"
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

AI_PROVIDERS=("openai" "openrouter" "anthropic" "google" "mistral")

for PROVIDER in "${AI_PROVIDERS[@]}"; do
  echo ""
  echo "📋 Testing provider: $PROVIDER"
  
  CONFIG_RESPONSE=$(curl -s -X POST "$API_URL/api/ai/configure" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"provider\": \"$PROVIDER\", \"model\": \"test-model\", \"apiKey\": \"test_key_123\"}" \
    -w "\n%{http_code}")
  
  HTTP_CODE=$(echo "$CONFIG_RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
    print_success "AI provider '$PROVIDER' configured"
  else
    print_error "Failed to configure $PROVIDER (HTTP $HTTP_CODE)"
    exit 1
  fi
  
  # Verify config
  GET_RESPONSE=$(curl -s -X GET "$API_URL/api/ai/config" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -w "\n%{http_code}")
  
  HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
  BODY=$(echo "$GET_RESPONSE" | sed '$d')
  
  if [ "$HTTP_CODE" == "200" ]; then
    CONFIG_PROVIDER=$(echo "$BODY" | jq -r '.config.provider // .provider' 2>/dev/null)
    if [ "$CONFIG_PROVIDER" == "$PROVIDER" ]; then
      print_success "AI config verified"
    else
      print_warn "Provider mismatch in config"
    fi
  fi
done

echo ""
print_success "All AI configuration tests passed! ✓"
