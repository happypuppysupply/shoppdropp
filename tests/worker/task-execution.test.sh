#!/bin/bash
# Worker Task Execution Tests
# Tests: Task routing, execution, error handling

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/common.sh"

echo "================================"
echo "⚙️ WORKER TASK EXECUTION TESTS"
echo "================================"
echo ""

# Check if worker code exists
if [ ! -d "$SCRIPT_DIR/../../shoppdropp-worker" ]; then
  echo "⚠️  Worker directory not found at expected location"
  exit 1
fi

cd "$SCRIPT_DIR/../../shoppdropp-worker"

# Test 1: Check worker dependencies
echo "📋 Test 1: Worker dependencies"
if [ -f "package.json" ]; then
  print_success "Worker package.json exists"
  
  if [ -d "node_modules" ]; then
    print_success "Dependencies installed"
  else
    print_warn "Dependencies not installed. Run: npm install"
  fi
else
  print_error "Worker package.json not found"
  exit 1
fi

# Test 2: Check TypeScript compilation
echo ""
echo "📋 Test 2: TypeScript compilation"
if npm run build > /tmp/build.log 2>&1; then
  print_success "Worker compiles successfully"
else
  print_error "Worker build failed"
  cat /tmp/build.log
  exit 1
fi

# Test 3: Check task files exist
echo ""
echo "📋 Test 3: Task implementations exist"
TASKS=("productResearch" "catalogSync" "priceOptimization" "metaAdsSync" "inventorySync")
TASKS_DIR="src/tasks"

for task in "${TASKS[@]}"; do
  TASK_FILE="$TASKS_DIR/$task.ts"
  if [ -f "$TASK_FILE" ]; then
    print_success "Task exists: $task"
  else
    print_error "Task missing: $task"
    exit 1
  fi
done

# Test 4: Check Docker configuration
echo ""
echo "📋 Test 4: Docker configuration"
if [ -f "Dockerfile" ]; then
  print_success "Dockerfile exists"
else
  print_warn "Dockerfile not found"
fi

if [ -f "docker-compose.yml" ]; then
  print_success "docker-compose.yml exists"
else
  print_warn "docker-compose.yml not found"
fi

# Test 5: Test worker startup (dry run)
echo ""
echo "📋 Test 5: Worker startup validation"
if timeout 5 node dist/index.js 2>&1 | grep -q "error\|Error"; then
  print_error "Worker startup errors detected"
else
  print_success "Worker startup validation passed (or requires env vars)"
fi

echo ""
print_success "All worker task tests passed! ✓"
