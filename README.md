# ShoppDropp - AI-Powered Shopify Management Platform

Complete full-stack application with backend API, worker service, and customer dashboard.

## Architecture

```
shoppdropp-backend/    # Node.js API + WebSocket server
shoppdropp-worker/     # Docker-based AI worker service  
shoppdropp-dashboard/  # Next.js customer dashboard
```

## Quick Start

### 1. Supabase Setup

1. Create project at https://supabase.com
2. Run SQL from `shoppdropp-backend/supabase-schema.sql`
3. Get URL and anon/service keys from Project Settings > API

### 2. Stripe Setup

1. Create account at https://stripe.com
2. Create 3 products with recurring prices:
   - Growth ($29/month)
   - Agency ($199/month)
3. Get API keys and webhook secret
4. Configure webhook endpoint: `https://your-api.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`

### 3. Backend Setup

```bash
cd shoppdropp-backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 4. Worker Setup (Optional - Docker)

```bash
cd shoppdropp-worker
docker build -t shoppdropp-worker:latest .
```

### 5. Dashboard Setup

```bash
cd shoppdropp-dashboard
cp .env.local.example .env.local
# Edit with your credentials
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_AGENCY=price_...

JWT_SECRET=your-jwt-secret
PORT=3001
```

### Dashboard (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Customer Flow

1. **Sign Up** → Chooses plan (PayG/Growth/Agency)
2. **Add Store** → Enters Shopify store URL
3. **Configure APIs** → Enters their own:
   - Shopify Admin API credentials
   - Meta Ads access token
   - AutoDS API key
4. **AI Worker Starts** → Provisions VPS (mocked locally)
5. **Automation Runs** → Product research, pricing, ads, inventory

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/stores` | List stores |
| POST | `/api/stores` | Create store |
| POST | `/api/stores/:id/credentials` | Save API credentials |
| GET | `/api/stores/:id/credentials` | List saved credentials |
| POST | `/api/stripe/checkout` | Create checkout session |
| GET | `/api/stripe/subscription` | Get subscription status |
| POST | `/api/stripe/webhook` | Stripe webhooks |
| GET | `/api/workers` | List workers |
| GET | `/api/workers/:id/status` | Worker status |
| WS | `/ws?workerId=:id` | Worker WebSocket |

## WebSocket Protocol

**Worker → Backend:**
- `heartbeat` - Keepalive every 30s
- `task_complete` - Task finished
- `task_failed` - Task error

**Backend → Worker:**
- `config` - Initial configuration
- `execute_task` - Run task
- `stop` - Shutdown worker

## Task Types

- `product_research` - Trend analysis, competitor research
- `catalog_sync` - Shopify product optimization
- `price_optimization` - Dynamic pricing
- `meta_ads_sync` - Meta Ads management
- `inventory_sync` - AutoDS inventory sync

## Deployment

### Backend (VPS/Docker)
```bash
cd shoppdropp-backend
docker build -t shoppdropp-api .
docker run -p 3001:3001 --env-file .env shoppdropp-api
```

### Dashboard (Vercel)
```bash
cd shoppdropp-dashboard
vercel --prod
```

### Workers (Hetzner - when API ready)
- Currently runs locally via Docker
- Will migrate to Hetzner Cloud API for VPS provisioning

## Next Steps

1. **Hetzner API Integration** - Replace local Docker with actual VPS provisioning
2. **AI Model Integration** - Connect to OpenAI/Claude for product optimization
3. **Real API Connections** - Implement actual Shopify/Meta/AutoDS API calls
4. **Monitoring Dashboard** - Add metrics, logs, alerts
5. **Security Hardening** - Encrypt credentials at rest, audit logging

## File Structure

```
shoppdropp/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment config
│   │   ├── db/            # Supabase client
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Worker management
│   │   └── types/         # TypeScript types
│   ├── supabase-schema.sql
│   └── package.json
├── worker/
│   ├── src/
│   │   ├── services/      # Task runner
│   │   └── tasks/         # AI task implementations
│   ├── Dockerfile
│   └── package.json
└── dashboard/
    ├── app/               # Next.js pages
    ├── components/        # React components
    ├── lib/              # API client, utils
    └── package.json
```

## License

Private - All rights reserved.// STAGING DEPLOY: Fri Jul 17 20:21:46 +07 2026
