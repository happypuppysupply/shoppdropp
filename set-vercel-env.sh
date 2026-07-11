#!/bin/bash
# Script to set Vercel environment variables
# Run with: ./set-vercel-env.sh

# Set these values
SUPABASE_URL="https://tdokcqkdtwzhjvdkspls.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_HMpZHFGLZU5rUpw7tiJ9gA_TBifmBC2"

# Set preview environment
vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "$SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "$SUPABASE_ANON_KEY"

# Set production environment (optional - you can do this later)
# vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL"
# vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"

echo "Environment variables set!"
