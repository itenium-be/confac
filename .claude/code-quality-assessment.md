# CONFAC - Code Quality Assessment Report

**Date**: 2025-12-17  
**Key Statistics**:
- Backend LOC: ~4,406 lines
- Frontend Files: ~340 TypeScript/TSX files
- Test Files: 37 test files

---

## Table of Contents
1. [Security Issues](#1-security-issues)
2. [Quick-and-Dirty Solutions & Workarounds](#2-quick-and-dirty-solutions--workarounds)
3. [Code Quality Issues](#3-code-quality-issues)
4. [Technical Debt & Limitations](#4-technical-debt--limitations)
5. [Deployment & Operational Concerns](#5-deployment--operational-concerns)
6. [Summary by Severity](#summary-by-severity)
7. [Recommendations](#recommendations)

---

## 1. SECURITY ISSUES

### HIGH SEVERITY

#### 1.4 CORS Misconfiguration
**Location**: `backend/src/server.ts:20`

```typescript
// Problematic CORS config:
const corsOptions = {
  origins: '*', // TODO allow frontend only.
};
```


#### 1.5 JWT Token in Query Parameters
**Location**: `backend/src/routes/index.ts:25-26`

```typescript
if (req.query && req.query.token) {
  return req.query.token;
}
```

- **Issue**: JWT tokens accepted in URL query strings
- **Risk**: Tokens logged in server logs, browser history, proxy logs, and referrer headers
- **Impact**: HIGH - Token leakage and session hijacking risk
- **Recommendation**: Only accept tokens in Authorization header or httpOnly cookies


#### 1.8 XSS Vulnerability - dangerouslySetInnerHTML
**Locations**:
- `frontend/src/components/controls/Tooltip.tsx:20`
- `frontend/src/components/controls/comments/CommentModel.tsx:61`

```typescript
// Problematic React code with XSS vulnerability:
// <div dangerouslySetInnerHTML={{__html: comment.comment}} />
// This renders unsanitized HTML from user input
```

- **Issue**: Unsanitized HTML rendering from user-generated content
- **Risk**: Stored XSS attacks
- **Impact**: HIGH - User data compromise, session theft
- **Recommendation**: Sanitize HTML using DOMPurify before rendering


#### 1.11 Deprecated/Outdated Security-Critical Dependencies
**Location**: `backend/package.json`

- `mongodb: ^3.5.8` (current is 6.x, v3 EOL - security patches no longer provided)
- `jsonwebtoken: ^8.5.1` (v9.x available with security fixes)
- `express-jwt: ^5.3.3` (officially deprecated package)
- `html-pdf: ^2.1.0` (unmaintained, known security vulnerabilities)


#### 1.12 Error Stack Traces in Production
**Location**: `backend/src/server.ts:80`

```typescript
res.status(500).send({message: err.message, stack: err.stack});
```

- **Issue**: Full error stacks sent to client in all environments
- **Risk**: Information disclosure (file paths, code structure, dependencies)
- **Impact**: MEDIUM-HIGH - Aids attackers in reconnaissance
- **Recommendation**: Only send stack traces in development mode

---

## 2. QUICK-AND-DIRTY SOLUTIONS & WORKAROUNDS

### 2.1 TODO/FIXME Comments Indicating Known Issues
**Count**: 20+ instances across the codebase

Critical TODOs:

2. **Race Condition** - `backend/src/server.ts:59`
   ```typescript
   // TODO: fix race condition
   req.db = _MongoClient.db();
   ```

---

## 4. TECHNICAL DEBT & LIMITATIONS

### 4.4 No API Documentation
- No Swagger/OpenAPI specification detected
- No API documentation generator configured
- **Impact**: Poor developer experience, difficult integration


### 4.7 Socket.io Real-time Updates
- No explicit disconnect/reconnect handling visible

### 4.9 Email Attachment Handling
**Location**: `backend/src/controllers/emailInvoices.ts:91-96`

- Creates temporary files that might not be cleaned up properly on errors
- Uses deprecated `tmp.fileSync()` synchronous API
- No cleanup error handling
- **Risk**: Disk space exhaustion over time

---

## 5. DEPLOYMENT & OPERATIONAL CONCERNS

### 5.4 No Health Check Endpoint
- No `/health` or `/ping` endpoint for monitoring
- Load balancers can't verify service health
- **Recommendation**: Add health endpoint that checks database connectivity

---

---

## RECOMMENDATIONS

2. **Sanitize HTML before dangerouslySetInnerHTML**
   ```bash
   npm install dompurify
   ```
   ```typescript
   import DOMPurify from 'dompurify';

   // In your component - sanitize before rendering:
   // <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.comment)}} />
   ```

3. **Add file upload restrictions**
   ```typescript
   const upload = multer({
     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
     fileFilter: (req, file, cb) => {
       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
       if (!allowedTypes.includes(file.mimetype)) {
         return cb(new Error('Invalid file type'));
       }
       cb(null, true);
     }
   });
   ```

5. **Replace express-jwt with express-oauth2-jwt-bearer**
   ```bash
   npm uninstall express-jwt
   npm install express-oauth2-jwt-bearer
   ```

6. **Add rate limiting middleware**
   ```bash
   npm install express-rate-limit
   ```
   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

7. **Remove error stacks from production responses**
   ```typescript
   if (process.env.NODE_ENV === 'production') {
     res.status(500).send({message: 'Internal Server Error'});
   } else {
     res.status(500).send({message: err.message, stack: err.stack});
   }
   ```

### Medium Term (1-2 Months) 📆

2. **Migrate from html-pdf to puppeteer**
   ```bash
   npm uninstall html-pdf phantomjs-prebuilt
   npm install puppeteer
   ```

4. **Reduce 'any' types, improve type safety**
   - Enable strict TypeScript compiler options
   - Create proper type definitions for all data models
   - Remove type assertions

### Long Term (3-6 Months) 📈

2. **Implement comprehensive e2e testing**
   - Playwright or Cypress for frontend
   - Supertest for API integration tests

3. **Add health check endpoints**
   ```typescript
   import { Request, Response } from 'express';

   app.get('/health', async (req: Request, res: Response) => {
     try {
       const dbHealthy = await checkMongoConnection();
       res.status(dbHealthy ? 200 : 503).json({
         status: dbHealthy ? 'ok' : 'error',
         timestamp: new Date().toISOString(),
         services: {
           database: dbHealthy ? 'up' : 'down'
         }
       });
     } catch (error) {
       res.status(503).json({ status: 'error', message: 'Health check failed' });
     }
   });
   ```

6. **Add structured logging throughout**
   - JSON logging format
   - Correlation IDs for request tracing
   - Integration with log aggregation (ELK, Loki, CloudWatch)
