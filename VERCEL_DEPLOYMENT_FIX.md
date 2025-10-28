# Vercel Deployment Fix for Prisma + Supabase

This document outlines the fixes applied to resolve the "works locally, fails on Vercel" Prisma + Supabase deployment issue.

## ✅ Changes Applied

### 1. Updated Prisma Schema with Binary Targets

- Added `linux-musl` binary target for Vercel compatibility
- Updated `prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  // add linux-musl for Vercel
  binaryTargets = ["native", "linux-musl"]
}
```

### 2. Enhanced Prisma Client Singleton

- Updated `src/lib/prisma.ts` with better logging configuration
- Improved error handling and production logging

### 3. Added Runtime Configuration

- Added `export const runtime = 'nodejs'` to API routes that use Prisma
- Ensured all Prisma operations run in Node.js runtime (not Edge)

### 4. Enhanced Error Logging

- Added comprehensive error logging in `src/lib/db.ts`
- Added diagnostic function for debugging connection issues
- Enhanced retry logic with better error detection

## 🔧 Environment Variables Setup (Required)

You need to set these environment variables in Vercel:

### Production Environment Variables

In Vercel → Project → Settings → Environment Variables (Production):

1. **DATABASE_URL** (Pooled connection for runtime queries):

```
postgresql://USER:PASSWORD@db-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

2. **DIRECT_URL** (Direct connection for migrations):

```
postgresql://USER:PASSWORD@db-xxx.supabase.co:5432/postgres?sslmode=require
```

### Preview Environment Variables

Set the same variables for Preview environment if you deploy previews.

## 📋 Deployment Checklist

- [ ] Set DATABASE_URL with pooled connection (port 6543) in Vercel Production
- [ ] Set DIRECT_URL with direct connection (port 5432) in Vercel Production
- [ ] Set same variables for Preview environment if needed
- [ ] Redeploy after setting environment variables
- [ ] Verify @prisma/client is in dependencies (✅ already done)
- [ ] Verify prisma is in devDependencies (✅ already done)

## 🐛 Debugging

If you still see database connection errors:

1. **Check Vercel Function Logs**: Go to Vercel → Project → Functions tab to see detailed error logs
2. **Verify Environment Variables**: Ensure DATABASE_URL and DIRECT_URL are set for Production (not just Development)
3. **Check Runtime Configuration**: All files using Prisma should have `export const runtime = 'nodejs'`
4. **Test Connection**: Use the diagnostic function in `src/lib/db.ts` to test database connectivity

## 🔍 Common Issues

1. **Wrong Environment Scope**: Make sure variables are set for "Production" not just "Development"
2. **Missing Runtime Export**: Any route using Prisma needs `export const runtime = 'nodejs'`
3. **Binary Target Missing**: The `linux-musl` binary target is now included in the schema
4. **Connection Pooling**: Using the pooled URL (port 6543) for runtime queries

## 📝 Files Modified

- `prisma/schema.prisma` - Added binary targets
- `src/lib/prisma.ts` - Enhanced singleton pattern
- `src/lib/db.ts` - Added error logging and diagnostics
- `src/app/api/images/record/route.ts` - Added runtime configuration

## 🚀 Next Steps

1. Set the environment variables in Vercel
2. Redeploy your application
3. Monitor the Vercel Function logs for any remaining issues
4. The enhanced error logging will help identify any remaining problems

The application should now work correctly on Vercel with proper Prisma + Supabase integration.
