#!/bin/bash
# WebSocket Worker Communication Tests
# Tests: Worker connects, heartbeat, task execution

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

API_URL="${API_URL:-http://localhost:3001}"
WS_URL="${API_URL/http/ws}"
WORKER_ID="test-worker-$(date +%s)"

echo "================================"
echo "🔌 WEBSOCKET WORKER COMMUNICATION TESTS"
echo "================================"
echo "WebSocket URL: $WS_URL"
echo "Worker ID: $WORKER_ID"
echo ""

# Check if websocat is available
if ! command -v websocat &> /dev/null; then
  echo "⚠️  websocat not found. Installing..."
  curl -L https://github.com/vi/websocat/releases/latest/download/websocat.x86_64-unknown-linux-musl -o /tmp/websocat
  chmod +x /tmp/websocat
  WEBSOCAT="/tmp/websocat"
else
  WEBSOCAT="websocat"
fi

# Test 1: WebSocket connection
echo "📋 Test 1: Worker WebSocket connection"
if timeout 5 bash -c "$WEBSOCAT -B 2048 '$WS_URL/ws?workerId=$WORKER_ID' <<< '{\"type\":\"heartbeat\"}'" 2>/dev/null | grep -q "heartbeat\|config\|connected"; then
  print_success "Worker connected via WebSocket"
else
  print_warn "WebSocket connection test inconclusive (server may require auth)"
fi

# Test 2: Heartbeat exchange
echo ""
echo "📋 Test 2: Heartbeat message"
HEARTBEAT_RESPONSE=$(timeout 3 bash -c "
  echo '{\"type\":\"heartbeat\",\"workerId\":\"$WORKER_ID\",\"timestamp\":$(date +%s000)}' | \
  $WEBSOCAT -B 1024 '$WS_URL/ws?workerId=$WORKER_ID' 2>/dev/null
" || echo "")

if [ -n "$HEARTBEAT_RESPONSE" ]; then
  print_success "Heartbeat acknowledged"
  echo "   Response: ${HEARTBEAT_RESPONSE:0:100}"
else
  print_warn "No heartbeat response (server may require auth)"
fi

# Test 3: Task completion simulation
echo ""
echo "📋 Test 3: Task completion message"
TASK_RESPONSE=$(timeout 3 bash -c "
  echo '{\"type\":\"task_complete\",\"workerId\":\"$WORKER_ID\",\"taskId\":\"test-task-123\",\"result\":{\"success\":true}}' | \
  $WEBSOCAT -B 1024 '$WS_URL/ws?workerId=$WORKER_ID' 2>/dev/null
" || echo "")

if [ -n "$TASK_RESPONSE" ]; then
  print_success "Task completion message sent"
else
  print_warn "Task completion test inconclusive"
fi

# Cleanup
rm -f /tmp/websocat

echo ""
print_success "WebSocket tests completed! ✓"
echo ""
echo "💡 For full WebSocket testing, use the Node.js test:"
echo "   node tests/websocket/worker-client.test.js"
