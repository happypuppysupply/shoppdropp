#!/bin/bash
# Master Test Runner for ShoppDropp
# Runs all test suites and reports results

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
SKIP_E2E="${SKIP_E2E:-false}"
SKIP_VPS="${SKIP_VPS:-false}"
SKIP_STRIPE="${SKIP_STRIPE:-false}"
SKIP_WEBSOCKET="${SKIP_WEBSOCKET:-false}"

# Test results
declare -A TEST_RESULTS
declare -A TEST_DETAILS
TOTAL_PASSED=0
TOTAL_FAILED=0
TOTAL_SKIPPED=0

# Print banner
print_banner() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║           🧪 SHOPPDROPP TEST SUITE RUNNER 🧪               ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  echo "API URL: $API_URL"
  echo "Started: $(date)"
  echo ""
}

# Run a single test suite
run_test_suite() {
  local name=$1
  local script=$2
  local skip_condition=$3
  
  echo "═══════════════════════════════════════════"
  echo "🔬 Running: $name"
  echo "═══════════════════════════════════════════"
  
  # Check skip condition
  if [ -n "$skip_condition" ] && [ "$skip_condition" == "true" ]; then
    print_warn "SKIPPED (by configuration)"
    TEST_RESULTS["$name"]="SKIPPED"
    TOTAL_SKIPPED=$((TOTAL_SKIPPED + 1))
    echo ""
    return 0
  fi
  
  # Check if script exists
  if [ ! -f "$script" ]; then
    print_error "Test script not found: $script"
    TEST_RESULTS["$name"]="FAILED"
    TEST_DETAILS["$name"]="Script not found"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
    echo ""
    return 1
  fi
  
  # Make executable and run
  chmod +x "$script"
  
  if "$script" > /tmp/test_${name// /_}.log 2>&1; then
    print_success "PASSED"
    TEST_RESULTS["$name"]="PASSED"
    TOTAL_PASSED=$((TOTAL_PASSED + 1))
  else
    local exit_code=$?
    print_error "FAILED (exit code: $exit_code)"
    TEST_RESULTS["$name"]="FAILED"
    TEST_DETAILS["$name"]="See /tmp/test_${name// /_}.log"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
  fi
  
  echo ""
}

# Print summary
print_summary() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                    📊 TEST SUMMARY 📊                      ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  
  printf "%-40s %10s\n" "Test Suite" "Status"
  echo "────────────────────────────────────────   ──────────"
  
  for name in "${!TEST_RESULTS[@]}"; do
    local status="${TEST_RESULTS[$name]}"
    local symbol=""
    
    case $status in
      PASSED) symbol="${GREEN}✓${NC}"; ;;
      FAILED) symbol="${RED}✗${NC}"; ;;
      SKIPPED) symbol="${YELLOW}⊘${NC}"; ;;
    esac
    
    printf "%-40s %b %s%b\n" "$name" "$symbol" "$status" "$NC"
    
    if [ -n "${TEST_DETAILS[$name]}" ]; then
      echo "    └─> ${TEST_DETAILS[$name]}"
    fi
  done
  
  echo ""
  echo "────────────────────────────────────────────────────────────"
  printf "${GREEN}✓ Passed:${NC}  %d\n" $TOTAL_PASSED
  printf "${RED}✗ Failed:${NC}  %d\n" $TOTAL_FAILED
  printf "${YELLOW}⊘ Skipped:${NC} %d\n" $TOTAL_SKIPPED
  echo "────────────────────────────────────────────────────────────"
  printf "${BLUE}Total:${NC}    %d\n" $((TOTAL_PASSED + TOTAL_FAILED + TOTAL_SKIPPED))
  echo ""
  echo "Finished: $(date)"
  echo ""
}

# Wait for services
wait_for_services() {
  echo "⏳ Checking services..."
  echo ""
  
  # Check backend
  if curl -s "$API_URL/health" >/dev/null 2>&1 || curl -s "$API_URL" >/dev/null 2>&1; then
    print_success "Backend is available at $API_URL"
  else
    print_warn "Backend may not be available at $API_URL"
    echo "    Tests will proceed but may fail"
  fi
  
  # Check jq
  if command_exists jq; then
    print_success "jq is installed"
  else
    print_error "jq is required but not installed"
    echo "    Install with: sudo apt-get install jq"
    exit 1
  fi
  
  # Check curl
  if command_exists curl; then
    print_success "curl is installed"
  else
    print_error "curl is required but not installed"
    exit 1
  fi
  
  echo ""
}

# Main execution
main() {
  print_banner
  wait_for_services
  
  # API Tests
  run_test_suite "Authentication" "$SCRIPT_DIR/api/auth.test.sh"
  run_test_suite "Store Management" "$SCRIPT_DIR/api/stores.test.sh"
  run_test_suite "AI Configuration" "$SCRIPT_DIR/api/ai-config.test.sh"
  run_test_suite "User Integrations" "$SCRIPT_DIR/api/integrations.test.sh"
  run_test_suite "Worker Management" "$SCRIPT_DIR/api/workers.test.sh"
  run_test_suite "VPS/Hetzner" "$SCRIPT_DIR/api/vps.test.sh" "$SKIP_VPS"
  run_test_suite "Stripe" "$SCRIPT_DIR/api/stripe.test.sh" "$SKIP_STRIPE"
  
  # Worker Tests
  run_test_suite "Worker Tasks" "$SCRIPT_DIR/worker/task-execution.test.sh"
  
  # WebSocket Tests
  run_test_suite "WebSocket Communication" "$SCRIPT_DIR/websocket/worker-comm.test.sh" "$SKIP_WEBSOCKET"
  
  # E2E Tests
  run_test_suite "End-to-End Flow" "$SCRIPT_DIR/e2e/full-flow.test.sh" "$SKIP_E2E"
  
  print_summary
  
  # Exit with appropriate code
  if [ $TOTAL_FAILED -gt 0 ]; then
    exit 1
  fi
  
  exit 0
}

# Handle arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --api-url)
      API_URL="$2"
      shift 2
      ;;
    --skip-e2e)
      SKIP_E2E="true"
      shift
      ;;
    --skip-vps)
      SKIP_VPS="true"
      shift
      ;;
    --skip-stripe)
      SKIP_STRIPE="true"
      shift
      ;;
    --skip-websocket)
      SKIP_WEBSOCKET="true"
      shift
      ;;
    --help|-h)
      echo "ShoppDropp Test Suite Runner"
      echo ""
      echo "Usage: ./run-all.sh [options]"
      echo ""
      echo "Options:"
      echo "  --api-url URL       Set API base URL (default: http://localhost:3001)"
      echo "  --skip-e2e          Skip end-to-end tests"
      echo "  --skip-vps          Skip VPS/Hetzner tests"
      echo "  --skip-stripe       Skip Stripe tests"
      echo "  --skip-websocket    Skip WebSocket tests"
      echo "  --help, -h          Show this help"
      echo ""
      echo "Environment Variables:"
      echo "  API_URL             API base URL"
      echo "  SKIP_E2E            Skip E2E tests (true/false)"
      echo "  SKIP_VPS            Skip VPS tests (true/false)"
      echo "  SKIP_STRIPE         Skip Stripe tests (true/false)"
      echo "  SKIP_WEBSOCKET      Skip WebSocket tests (true/false)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Run main
main
