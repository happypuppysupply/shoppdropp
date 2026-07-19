#!/bin/bash
# Quick Test - Fast validation for development
# Runs only API tests (skips heavy/slow tests)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

API_URL="${API_URL:-http://localhost:3001}"

echo "═══════════════════════════════════════════"
echo "⚡ QUICK TEST SUITE (API Only)"
echo "═══════════════════════════════════════════"
echo "API URL: $API_URL"
echo ""
echo "This runs only fast API tests, skipping:"
echo "  - Worker compilation"
echo "  - WebSocket tests"
echo "  - End-to-end flows"
echo "  - VPS/Stripe (requires config)"
echo ""
echo "For full test suite, run: ./run-all.sh"
echo ""

PASSED=0
FAILED=0

run_quick_test() {
  local name=$1
  local script=$2
  
  echo "───────────────────────────────────────────"
  echo "🔬 $name"
  
  if bash "$script" > /tmp/quick_test_${name// /_}.log 2>&1; then
    echo "✅ PASSED"
    PASSED=$((PASSED + 1))
  else
    echo "❌ FAILED (see /tmp/quick_test_${name// /_}.log)"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

# Core API tests only (fast ones)
run_quick_test "Authentication" "$SCRIPT_DIR/api/auth.test.sh"
run_quick_test "Store Management" "$SCRIPT_DIR/api/stores.test.sh"
run_quick_test "AI Configuration" "$SCRIPT_DIR/api/ai-config.test.sh"
run_quick_test "User Integrations" "$SCRIPT_DIR/api/integrations.test.sh"
run_quick_test "Worker Management" "$SCRIPT_DIR/api/workers.test.sh"

echo "───────────────────────────────────────────"
echo ""
echo "📊 Quick Test Results:"
echo "  ✅ Passed: $PASSED"
echo "  ❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✨ All quick tests passed!"
  echo ""
  echo "For full validation, including:"
  echo "  - Worker compilation"
  echo "  - WebSocket communication"
  echo "  - End-to-end flows"
  echo "  - VPS/Stripe integration"
echo ""
  echo "Run: ./run-all.sh"
  exit 0
else
  echo "⚠️  Some tests failed. Check logs in /tmp/quick_test_*.log"
  exit 1
fi
