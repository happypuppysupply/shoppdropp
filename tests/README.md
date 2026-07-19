# ShoppDropp Test Suite

Comprehensive automated testing for the ShoppDropp platform covering API endpoints, worker functionality, WebSocket communication, and end-to-end flows.

## 📁 Test Structure

```
tests/
├── api/                    # Backend API tests
│   ├── auth.test.sh       # Authentication (register, login, JWT)
│   ├── stores.test.sh     # Store CRUD, credentials
│   ├── ai-config.test.sh  # AI provider configuration
│   ├── integrations.test.sh # GitHub, Vercel integrations
│   ├── workers.test.sh    # Worker management
│   ├── vps.test.sh        # VPS/Hetzner provisioning
│   └── stripe.test.sh     # Stripe payments
├── worker/                 # Worker service tests
│   └── task-execution.test.sh # Task runner validation
├── websocket/              # WebSocket communication tests
│   ├── worker-comm.test.sh      # Bash WebSocket tests
│   └── worker-client.test.js   # Node.js WebSocket client
├── e2e/                    # End-to-end integration tests
│   └── full-flow.test.sh  # Complete customer journey
├── utils/                  # Shared utilities
│   └── common.sh          # Helper functions
└── run-all.sh            # Master test runner
```

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
sudo apt-get install jq curl    # Ubuntu/Debian
brew install jq                 # macOS

# Optional (for WebSocket tests)
npm install -g ws uuid          # Node.js WebSocket client
```

### Run All Tests

```bash
cd tests
./run-all.sh
```

### Run with Custom API URL

```bash
./run-all.sh --api-url https://api.shoppdropp.com
# Or
API_URL=https://api.shoppdropp.com ./run-all.sh
```

### Run Specific Test Categories

```bash
# Skip slow/heavy tests
./run-all.sh --skip-e2e --skip-vps --skip-stripe

# Run only API tests
./run-all.sh --skip-e2e --skip-websocket

# Run everything including end-to-end
./run-all.sh
```

## 📊 Test Categories

### 1. Authentication Tests (`api/auth.test.sh`)

Validates:
- User registration
- User login
- JWT token validation
- Invalid credential rejection

**Time:** ~5 seconds

### 2. Store Management Tests (`api/stores.test.sh`)

Validates:
- Create, read, update, delete stores
- Save/get API credentials (Shopify, Meta, CJ Dropshipping)
- Store listing

**Time:** ~10 seconds

### 3. AI Configuration Tests (`api/ai-config.test.sh`)

Validates:
- Configure all 5 AI providers (OpenAI, OpenRouter, Anthropic, Google, Mistral)
- Retrieve configuration
- Model selection

**Time:** ~5 seconds

### 4. Integration Tests (`api/integrations.test.sh`)

Validates:
- GitHub token save/retrieve
- Vercel token save/retrieve
- Integration status endpoints
- CJ Dropshipping credentials

**Time:** ~3 seconds

### 5. Worker Management Tests (`api/workers.test.sh`)

Validates:
- List workers
- Get worker status
- Provision workers
- Stop workers

**Time:** ~5 seconds

### 6. VPS/Hetzner Tests (`api/vps.test.sh`)

Validates:
- Server types endpoint
- VPS provisioning
- Instance listing
- Debug endpoints

**Time:** ~5 seconds
**Note:** Requires Hetzner API key to fully test

### 7. Stripe Tests (`api/stripe.test.sh`)

Validates:
- Checkout session creation
- Subscription status
- Webhook endpoints

**Time:** ~5 seconds
**Note:** Requires Stripe keys for full validation

### 8. Worker Task Tests (`worker/task-execution.test.sh`)

Validates:
- Worker dependencies
- TypeScript compilation
- Task file existence
- Docker configuration

**Time:** ~30 seconds (includes npm build)

### 9. WebSocket Tests (`websocket/`)

Validates:
- Worker WebSocket connection
- Heartbeat exchange
- Task completion simulation
- Auto-reconnect

**Time:** ~10 seconds

### 10. End-to-End Tests (`e2e/full-flow.test.sh`)

Complete customer journey:
1. User registration & login
2. Store creation
3. Integration setup (Shopify, Meta, CJ Dropshipping)
4. AI provider configuration
5. Worker management
6. Verification
7. Cleanup

**Time:** ~30 seconds
**Note:** Creates and deletes real test data

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:3001` | Backend API base URL |
| `SKIP_E2E` | `false` | Skip end-to-end tests |
| `SKIP_VPS` | `false` | Skip VPS/Hetzner tests |
| `SKIP_STRIPE` | `false` | Skip Stripe tests |
| `SKIP_WEBSOCKET` | `false` | Skip WebSocket tests |

### Per-Test Configuration

Individual test scripts also accept `API_URL`:

```bash
API_URL=https://staging-api.shoppdropp.com ./api/auth.test.sh
```

## 📋 Running Individual Tests

```bash
# API Tests
./api/auth.test.sh
./api/stores.test.sh
./api/ai-config.test.sh
./api/integrations.test.sh
./api/workers.test.sh
./api/vps.test.sh
./api/stripe.test.sh

# Worker Tests
./worker/task-execution.test.sh

# WebSocket Tests
./websocket/worker-comm.test.sh
node ./websocket/worker-client.test.js

# E2E Tests
./e2e/full-flow.test.sh
```

## 🐛 Debugging Failed Tests

### Check Logs

```bash
# View detailed log for failed test
cat /tmp/test_Authentication.log
cat /tmp/test_Store_Management.log
```

### Verbose Mode

Add `set -x` to test scripts for verbose output:

```bash
#!/bin/bash
set -ex  # Add 'x' for verbose
```

### Manual Verification

```bash
# Test API availability
curl http://localhost:3001/health

# Test with verbose output
curl -v http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Test Data

Tests create temporary data with timestamps:
- Users: `test_<timestamp>@example.com`
- Stores: `Test Store <timestamp>`
- Workers: `test-worker-<timestamp>`

All test data is automatically cleaned up after tests.

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: sudo apt-get install jq curl
      - name: Start services
        run: docker-compose up -d
      - name: Wait for services
        run: sleep 30
      - name: Run tests
        run: |
          cd tests
          ./run-all.sh --skip-vps --skip-stripe
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit
cd tests
./run-all.sh --skip-e2e --skip-vps --skip-stripe --skip-websocket
```

## 🎯 Coverage

| Component | Tests | Status |
|-----------|-------|--------|
| Authentication | ✅ JWT, register, login | ✅ |
| Store Management | ✅ CRUD, credentials | ✅ |
| AI Configuration | ✅ 5 providers | ✅ |
| Integrations | ✅ GitHub, Vercel | ✅ |
| Workers | ✅ List, status, provision | ✅ |
| VPS/Hetzner | ✅ Types, provision | ⚠️ Needs API key |
| Stripe | ✅ Checkout, webhooks | ⚠️ Needs keys |
| WebSocket | ✅ Connection, heartbeat | ✅ |
| E2E Flow | ✅ Full journey | ✅ |

## 🚧 Known Limitations

1. **VPS Tests**: Require Hetzner API key; skipped if not configured
2. **Stripe Tests**: Require valid Stripe keys; will warn if not present
3. **WebSocket Tests**: May fail if WebSocket endpoint requires auth
4. **E2E Tests**: Create real database records; cleanup on success

## 🔄 Test Updates

When adding new features:

1. Add tests for new endpoints in `tests/api/`
2. Update E2E flow if user journey changes
3. Document any new environment variables
4. Update this README

## 💡 Tips

- Use `--skip-e2e` for quick API validation
- Run worker tests before deploying new worker builds
- Always run full suite before production releases
- Check logs in `/tmp/test_*.log` for failures
