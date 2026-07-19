#!/bin/bash
# Common utilities for test scripts

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if jq is installed
check_jq() {
  if ! command_exists jq; then
    echo "Error: jq is required but not installed."
    echo "Install with: sudo apt-get install jq (or equivalent)"
    exit 1
  fi
}

# Wait for service to be available
wait_for_service() {
  local url=$1
  local timeout=${2:-30}
  local interval=${3:-1}
  
  echo "Waiting for $url to be available..."
  local elapsed=0
  
  while [ $elapsed -lt $timeout ]; do
    if curl -s "$url/health" >/dev/null 2>&1 || curl -s "$url" >/dev/null 2>&1; then
      echo "✓ Service is available"
      return 0
    fi
    sleep $interval
    elapsed=$((elapsed + interval))
    echo "  ...waiting ($elapsed/$timeout seconds)"
  done
  
  echo "✗ Service did not become available within $timeout seconds"
  return 1
}

# Generate random string
random_string() {
  local length=${1:-10}
  cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $length | head -n 1
}

# Cleanup function
cleanup() {
  local type=$1
  local id=$2
  local token=$3
  local api_url=${4:-$API_URL}
  
  case $type in
    user)
      curl -s -X DELETE "$api_url/api/users/$id" \
        -H "Authorization: Bearer $token" \
        -o /dev/null 2>/dev/null
      ;;
    store)
      curl -s -X DELETE "$api_url/api/stores/$id" \
        -H "Authorization: Bearer $token" \
        -o /dev/null 2>/dev/null
      ;;
    worker)
      curl -s -X POST "$api_url/api/workers/$id/stop" \
        -H "Authorization: Bearer $token" \
        -o /dev/null 2>/dev/null
      ;;
  esac
}

# Check environment
check_env() {
  local var_name=$1
  local var_value=$2
  
  if [ -z "$var_value" ]; then
    print_error "Environment variable $var_name is not set"
    return 1
  fi
  return 0
}

# Run test with timeout
run_with_timeout() {
  local timeout=$1
  shift
  
  timeout $timeout "$@"
  local exit_code=$?
  
  if [ $exit_code -eq 124 ]; then
    print_error "Test timed out after ${timeout}s"
    return 1
  fi
  
  return $exit_code
}

# Export all functions
export -f print_success print_error print_warn print_info
export -f command_exists check_jq wait_for_service
export -f random_string cleanup check_env run_with_timeout
