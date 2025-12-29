# CONFAC - System Architecture Documentation

> **Version**: 2025-12-18
> **Application Type**: Full-Stack Invoicing & Project Management System
> **Tech Stack**: React + TypeScript (Frontend) | Express + TypeScript (Backend) | MongoDB (Database)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architectural Layers](#3-architectural-layers)
4. [Data Flow Patterns](#4-data-flow-patterns)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [External Integrations](#6-external-integrations)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Database Design](#8-database-design)

---

## 1. System Overview

CONFAC is a full-stack web application designed for managing consultants, clients, projects, and invoices. It features real-time collaboration, PDF invoice generation, and electronic invoicing (Peppol) support.

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        SPA[React SPA<br/>TypeScript]
    end

    subgraph "Application Layer"
        Express[Express.js Server<br/>TypeScript]
        SocketIO[Socket.io Server<br/>Real-time Events]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB 3.5.8<br/>Document Store)]
    end

    subgraph "External Services"
        Google[Google OAuth 2.0]
        Gmail[Gmail SMTP]
        Excel[Excel Service]
        Loki[Grafana Loki]
    end

    Browser -->|HTTPS| SPA
    SPA -->|REST API + JWT| Express
    SPA <-->|WebSocket| SocketIO
    Express --> MongoDB
    SocketIO --> MongoDB
    Express -->|Verify Token| Google
    Express -->|Send Emails| Gmail
    Express -->|Generate XLSX| Excel
    Express -->|Ship Logs| Loki

    style SPA fill:#61dafb,stroke:#333,stroke-width:2px
    style Express fill:#90c53f,stroke:#333,stroke-width:2px
    style MongoDB fill:#4db33d,stroke:#333,stroke-width:2px
```

### Key Characteristics

- **Architecture Pattern**: 3-Layer Architecture (Presentation, Business Logic, Data Access)
- **Communication**: RESTful API + WebSocket (Socket.io)
- **State Management**: Redux (Frontend) + MongoDB (Backend)
- **Real-time Sync**: Multi-user collaboration via Socket.io events
- **Security**: OAuth 2.0 + JWT + Role-Based Access Control (RBAC)
- **Document Generation**: PDF (html-pdf), Excel (external service)

---

## 2. Technology Stack

### Backend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js | 16.10.0 | JavaScript execution |
| Framework | Express.js | 4.17.1 | Web server & routing |
| Language | TypeScript | 4.3 | Type-safe development |
| Database | MongoDB | 3.5.8 | Document storage |
| Authentication | google-auth-library | 6.0.0 | OAuth verification |
| JWT | jsonwebtoken + express-jwt | 8.5.1 / 5.3.3 | Token management |
| Real-time | Socket.io | 4.8.1 | WebSocket communication |
| PDF | html-pdf | 2.1.0 | PDF generation |
| Templates | Pug | 2.0.4 | HTML templating |
| Email | nodemailer | 7.0.5 | SMTP client |
| Logging | winston | 3.17.0 | Structured logging |
| Testing | Jest + supertest | 29.5.0 / 6.3.3 | Unit & integration tests |

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | React | 18.2.0 | UI rendering |
| Language | TypeScript | 4.9.3 | Type-safe development |
| Build Tool | Create React App | 5.0.1 | Build pipeline |
| State | Redux + redux-thunk | 4.2.0 / 2.4.2 | State management |
| Routing | react-router | 7.6.0 | Client-side routing |
| HTTP | superagent | 8.0.3 | API client |
| UI Library | react-bootstrap | 2.6.0 | Component library |
| Real-time | socket.io-client | 4.8.1 | WebSocket client |
| Forms | react-select + react-datepicker | 5.6.1 / 4.8.0 | Form controls |
| Rich Text | react-draft-wysiwyg | 1.15.0 | WYSIWYG editor |
| Charts | recharts | 2.5.0 | Data visualization |
| Styling | SASS | 1.56.1 | CSS preprocessing |

### DevOps Stack

- **Containerization**: Docker (multi-stage builds)
- **Orchestration**: Docker Compose v3
- **Migrations**: migrate-mongo 6.0.4
- **CI/CD**: Custom shell scripts (deploy.sh)
- **Monitoring**: Grafana Loki integration

---

## 3. Architectural Layers

### 3.1 Backend Architecture (3-Layer Pattern)

```mermaid
graph LR
    subgraph "Layer 1: Routes"
        R1[index.ts<br/>Main Router]
        R2[clients.ts]
        R3[invoices.ts]
        R4[projects.ts]
        R5[user.ts]
        R6[attachments.ts]
    end

    subgraph "Layer 2: Controllers"
        C1[Business Logic]
        C2[Invoice Controller]
        C3[Project Controller]
        C4[Email Controller]
        C5[Auth Controller]
        C6[PDF Generator]
    end

    subgraph "Layer 3: Models"
        M1[Type Definitions]
        M2[IInvoice]
        M3[IProject]
        M4[IClient]
        M5[IUser]
        M6[MongoDB Access]
    end

    R1 --> R2
    R1 --> R3
    R1 --> R4
    R1 --> R5
    R1 --> R6

    R2 --> C1
    R3 --> C2
    R4 --> C3
    R5 --> C5

    C2 --> C6
    C2 --> C7
    C2 --> C4

    C1 --> M1
    C2 --> M2
    C3 --> M3
    C5 --> M5

    M1 --> M6
    M2 --> M6
    M3 --> M6

    style R1 fill:#ffd700,stroke:#333,stroke-width:2px
    style C1 fill:#90ee90,stroke:#333,stroke-width:2px
    style M1 fill:#87ceeb,stroke:#333,stroke-width:2px
```

#### Layer 1: Routes (API Endpoints)
**Location**: `backend/src/routes/`

Defines HTTP endpoints and applies middleware:
- **Main Router** (`index.ts`): Aggregates all routes, applies JWT middleware
- **Domain Routers**: clients, consultants, projects, invoices, projectsMonth
- **Authentication** (`user.ts`): Login, refresh, user management, roles
- **Configuration** (`config.ts`): Application settings
- **File Handling** (`attachments.ts`): Upload/download

**Middleware Stack**:
- JWT authentication (express-jwt) with Google OAuth
- Request logging with correlation IDs
- CORS configuration
- Error handling

#### Layer 2: Controllers (Business Logic)
**Location**: `backend/src/controllers/`

Handles request processing and orchestration:
- **Invoice Controller**: CRUD, PDF generation, verification
- **Project Controllers**: Project management, monthly billing, timesheets
- **Client/Consultant Controllers**: Entity management
- **Email Controller**: Invoice delivery, PDF merging, attachment handling
- **Auth Controller**: Google OAuth, JWT generation, role management
- **Utility Controllers**:
  - PDF generation (html-pdf + Pug templates)
  - Excel generation (external service integration)
  - Socket.io event emission
  - Audit logging

#### Layer 3: Models (Data Access)
**Location**: `backend/src/models/`

TypeScript interfaces and MongoDB collection definitions:
- **Entity Models**: IInvoice, IProject, IClient, IConsultant, IUser, IRole
- **Collection Names**: Enum defining MongoDB collections
- **Audit Types**: IAudit (created/modified tracking)
- **Technical Types**: ConfacRequest, JWT types

**MongoDB Collections**:
```typescript
enum CollectionNames {
  CONSULTANTS = 'consultants',
  CLIENTS = 'clients',
  INVOICES = 'invoices',
  PROJECTS = 'projects',
  ATTACHMENTS = 'attachments',
  ATTACHMENTS_CLIENT = 'attachments_client',
  ATTACHMENTS_PROJECT_MONTH = 'attachments_project_month',
  PROJECTS_MONTH = 'projects_month',
  CONFIG = 'config',
  USERS = 'users',
  ROLES = 'roles',
}
```

### 3.2 Frontend Architecture (Redux Pattern)

```mermaid
graph TB
    subgraph "Presentation Layer"
        Comp[React Components]
        Pages[Page Components]
        Shared[Shared Components]
        Forms[Form Controls]
    end

    subgraph "State Management Layer"
        Store[Redux Store]
        Reducers[Combined Reducers]
        R1[app reducer]
        R2[invoices reducer]
        R3[clients reducer]
        R4[projects reducer]
        R5[user reducer]
    end

    subgraph "Business Logic Layer"
        Actions[Action Creators]
        A1[invoiceActions]
        A2[clientActions]
        A3[projectActions]
        A4[userActions]
        A5[emailActions]
    end

    subgraph "Communication Layer"
        API[API Client<br/>superagent]
        Socket[Socket.io Client]
    end

    Comp --> Pages
    Comp --> Shared
    Comp --> Forms

    Comp -->|dispatch| Actions
    Actions --> A1
    Actions --> A2
    Actions --> A3
    Actions --> A4
    Actions --> A5

    A1 --> API
    A2 --> API
    A1 --> Socket

    API -->|response| Actions
    Socket -->|events| Actions

    Actions -->|dispatch| Store
    Store --> Reducers
    Reducers --> R1
    Reducers --> R2
    Reducers --> R3
    Reducers --> R4
    Reducers --> R5

    Store -->|state| Comp

    style Comp fill:#61dafb,stroke:#333,stroke-width:2px
    style Store fill:#764abc,stroke:#333,stroke-width:2px
    style Actions fill:#90ee90,stroke:#333,stroke-width:2px
```

#### Presentation Layer
**Location**: `frontend/src/components/`

React components organized by domain:
- **Page Components**: invoice, client, consultant, project, user management
- **Shared Components**: controls, forms, tables, modals
- **Layout Components**: AppWithLayout, navigation, header
- **Authentication**: Login page, auth service

#### State Management Layer
**Location**: `frontend/src/reducers/`

Redux store structure:
```typescript
// UI state, filters, loading status
const store = {
  app: {
    filters: {},
    sidebarOpen: true,
    notifications: []
  },
  config: {},
  invoices: [],
  clients: [],
  consultants: [],
  projects: [],
  projectsMonth: [],
  user: {
    token: "eyJhbGc...",
    claims: ["user-create", "invoice-verify"],
    roles: ["admin", "consultant"]
  }
};
```

#### Business Logic Layer
**Location**: `frontend/src/actions/`

Action creators for API calls and business logic:
- **Entity Actions**: invoiceActions, clientActions, consultantActions, projectActions
- **User Actions**: Login, logout, token refresh, user management
- **Communication Actions**: emailActions, downloadActions, attachmentActions
- **Bootstrap**: initialLoad (fetch all data on app start)

**HTTP Communication**:
- Uses `superagent` with Bluebird promises
- JWT bearer token authentication
- Socket.io ID header for event filtering
- Global error handling with `catchHandler`

---

## 4. Data Flow Patterns

### 4.1 REST API Request Flow

```mermaid
sequenceDiagram
    participant Browser
    participant React
    participant Redux
    participant API as Express API
    participant Auth as JWT Middleware
    participant Controller
    participant MongoDB
    participant Socket as Socket.io

    Browser->>React: User Action
    React->>Redux: dispatch(action)
    Redux->>API: HTTP Request<br/>(JWT Bearer Token)
    API->>Auth: Verify JWT
    Auth->>API: Valid Token
    API->>Controller: Route Handler
    Controller->>MongoDB: Query/Update
    MongoDB->>Controller: Result
    Controller->>Socket: Emit Event<br/>(CREATED/UPDATED/DELETED)
    Controller->>API: Response Data
    API->>Redux: JSON Response
    Redux->>Redux: Update State
    Redux->>React: Re-render
    React->>Browser: Updated UI

    Socket-->>Redux: Real-time Event<br/>(other users)
    Redux-->>React: Update UI
```

**Request Headers**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
x-socket-id: <socket-client-id>
x-correlation-id: <request-id>
```

**Response Format**:
```json
{
  "data": {},
  "success": true,
  "message": "Invoice created successfully"
}
```

### 4.2 Real-time Synchronization Flow

```mermaid
sequenceDiagram
    participant Client A
    participant Server
    participant MongoDB
    participant Client B
    participant Client C

    Note over Client A: User A edits invoice
    Client A->>Server: PUT /api/invoices/123<br/>x-socket-id: A123
    Server->>MongoDB: Update Invoice
    MongoDB->>Server: Success
    Server->>Server: Emit Socket Event<br/>type: INVOICES_UPDATED<br/>sourceSocketId: A123
    Server->>Client A: HTTP 200 OK
    Server-->>Client B: Socket Event<br/>(A123 ≠ B456)
    Server-->>Client C: Socket Event<br/>(A123 ≠ C789)

    Note over Client B: Receives update
    Client B->>Client B: Dispatch Action<br/>UPDATE_INVOICE
    Client B->>Client B: Update Redux Store
    Client B->>Client B: Show Toast<br/>"Invoice updated by User A"

    Note over Client C: Receives update
    Client C->>Client C: Dispatch Action<br/>UPDATE_INVOICE
    Client C->>Client C: Update Redux Store
    Client C->>Client C: Show Toast<br/>"Invoice updated by User A"
```

**Socket Event Structure**:
```typescript
const socketEvent = {
  type: 'INVOICES_UPDATED',
  data: {
    _id: '123'
  },
  sourceSocketId: 'A123',
  modifiedBy: {
    email: 'user@example.com',
    name: 'User A'
  }
};
```

### 4.3 Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant React
    participant Express
    participant MongoDB
    participant Google

    Browser->>React: Click "Login with Google"
    React->>Browser: Open Google Sign-In
    Browser->>Google: Authenticate User
    Google->>Browser: ID Token
    Browser->>React: ID Token
    React->>Express: POST /api/user/login<br/>{idToken}
    Express->>Google: Verify Token
    Google->>Express: User Info<br/>(email, name, domain)
    Express->>Express: Validate Domain
    Express->>MongoDB: Find or Create User
    MongoDB->>Express: User Document
    Express->>Express: Check Active Status

    alt User Not Active
        Express->>React: 401 Unauthorized<br/>"User not activated"
        React->>Browser: Show Error
    else User Active
        Express->>Express: Generate JWT<br/>(with roles & claims)
        Express->>React: {token, user, claims}
        React->>React: Store in localStorage
        React->>Browser: Redirect to Dashboard
    end
```

### 4.4 Invoice PDF Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Controller
    participant Pug as Pug Engine
    participant PDF as html-pdf
    participant MongoDB
    participant Email

    User->>Frontend: Click "Generate Invoice"
    Frontend->>Controller: POST /api/invoices/verify
    Controller->>MongoDB: Fetch Invoice Data<br/>+ Client + Consultant
    MongoDB->>Controller: Aggregated Data
    Controller->>Pug: Compile Template<br/>(invoice.pug)
    Pug->>Controller: HTML String
    Controller->>PDF: convertHtmlToBuffer(html)
    PDF->>Controller: PDF Buffer
    Controller->>MongoDB: Save PDF Attachment
    Controller->>MongoDB: Update Invoice<br/>(verified: true)
    MongoDB->>Controller: Success
    Controller->>Frontend: {invoiceNumber, pdfPath}
    Frontend->>User: Show Success + Download

    opt Send Email
        User->>Frontend: Click "Send Email"
        Frontend->>Controller: POST /api/emailInvoices
        Controller->>MongoDB: Fetch Attachments
        Controller->>Email: Send via Gmail SMTP<br/>(PDF + T&C)
        Email->>Controller: Sent
        Controller->>MongoDB: Update lastEmail
        Controller->>Frontend: Success
    end
```

---

## 5. Authentication & Authorization

### 5.1 Two-Stage Authentication

```mermaid
graph LR
    subgraph "Stage 1: Google OAuth"
        A[User] -->|1. Login| B[Google Sign-In]
        B -->|2. ID Token| C[Backend]
        C -->|3. Verify Token| D[Google API]
        D -->|4. User Info| C
    end

    subgraph "Stage 2: JWT Generation"
        C -->|5. Find/Create User| E[(MongoDB)]
        E -->|6. User + Roles| C
        C -->|7. Generate JWT| F[JWT Token]
        F -->|8. Return Token| G[Frontend]
        G -->|9. Store| H[localStorage]
    end

    subgraph "Subsequent Requests"
        H -->|10. Bearer Token| I[API Requests]
        I -->|11. Verify JWT| J[express-jwt]
        J -->|12. Decoded User| K[Controller]
    end

    style B fill:#4285f4,stroke:#333,stroke-width:2px
    style F fill:#ffd700,stroke:#333,stroke-width:2px
    style H fill:#ff6b6b,stroke:#333,stroke-width:2px
```

### 5.2 JWT Structure

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "alias": "JD",
    "active": true,
    "roles": ["admin", "consultant"]
  },
  "iat": 1640000000,
  "exp": 1640018000
}
```

**Configuration**:
- **Secret**: JWT_SECRET environment variable
- **Expiration**: JWT_EXPIRES (default: 5 hours)
- **Algorithm**: HS256
- **Refresh**: Auto-refresh every hour (frontend)

### 5.3 Role-Based Access Control (RBAC)

```mermaid
graph TD
    User[User] -->|has many| Roles[Roles]
    Roles -->|contain| Claims[Claims]

    subgraph "Role Example: Admin"
        AdminRole[admin]
        AdminClaims["Claims:<br/>- user-create<br/>- user-edit<br/>- invoice-verify<br/>- config-edit"]
        AdminRole --> AdminClaims
    end

    subgraph "Role Example: Consultant"
        ConsultantRole[consultant]
        ConsultantClaims["Claims:<br/>- invoice-view<br/>- project-view<br/>- timesheet-create"]
        ConsultantRole --> ConsultantClaims
    end

    Claims -->|authorize| Actions[Frontend Actions]
    Claims -->|authorize| Endpoints[Backend Endpoints]

    style User fill:#61dafb,stroke:#333,stroke-width:2px
    style Roles fill:#90ee90,stroke:#333,stroke-width:2px
    style Claims fill:#ffd700,stroke:#333,stroke-width:2px
```

**Authorization Check (Frontend)**:
```typescript
const claims = authService.getClaims(); // ['user-create', 'invoice-verify', ...]
if (claims.includes('invoice-verify')) {
  // Show verify button
}
```

**Authorization Flow**:
1. User logs in → JWT contains role names
2. Frontend fetches role documents from API
3. Roles contain claims array
4. Frontend flattens all claims from all roles
5. UI components check claims for feature visibility
6. Backend validates JWT but doesn't enforce claims (trusts authenticated user)

### 5.4 User Activation Workflow

```mermaid
stateDiagram-v2
    [*] --> GoogleAuth: User clicks Login
    GoogleAuth --> UserCreated: First login
    UserCreated --> Inactive: active: false
    Inactive --> WaitingActivation: Show "not activated" error
    WaitingActivation --> AdminReview: Admin reviews user
    AdminReview --> AssignRoles: Admin assigns roles
    AssignRoles --> Active: Set active: true
    Active --> Authenticated: User can login
    Authenticated --> [*]

    GoogleAuth --> ExistingUser: Subsequent login
    ExistingUser --> Active: Already active

    Note right of UserCreated: Auto-active if<br/>DEFAULT_ROLE is set
    Note right of AdminReview: SUPERUSER email<br/>bypasses activation
```

**Configuration**:
- **DEFAULT_ROLE**: Auto-activate new users with this role
- **SUPERUSER**: Email address that gets admin access automatically
- **GOOGLE_DOMAIN**: Restrict logins to specific domain

---

## 6. External Integrations

### 6.1 Integration Overview

```mermaid
graph TB
    subgraph "CONFAC Application"
        Backend[Express Backend]
    end

    subgraph "Authentication"
        Google[Google OAuth 2.0]
        Backend -->|Verify ID Token| Google
    end

    subgraph "Email Delivery"
        Gmail[Gmail SMTP<br/>smtp.gmail.com:465]
        Backend -->|Send Invoice Emails| Gmail
    end

    subgraph "Document Generation"
        Excel[Excel Service<br/>External Microservice]
        Backend -->|POST /generate| Excel
        Excel -->|XLSX File| Backend
    end

    subgraph "Monitoring"
        Loki[Grafana Loki<br/>Log Aggregation]
        Backend -->|Ship Logs| Loki
    end

    subgraph "E-Invoicing"
        Peppol[Peppol Network<br/>UBL 2.1 Standard]
        Backend -->| Peppol
        Note[UBL Builder Library]
        Backend --> Note
    end

    style Google fill:#4285f4,stroke:#333,stroke-width:2px
    style Gmail fill:#ea4335,stroke:#333,stroke-width:2px
    style Excel fill:#217346,stroke:#333,stroke-width:2px
    style Loki fill:#f46800,stroke:#333,stroke-width:2px
    style Peppol fill:#4a90e2,stroke:#333,stroke-width:2px
```

### 6.2 Integration Details

#### Google OAuth 2.0
- **Purpose**: User authentication
- **Library**: google-auth-library v6.0.0
- **Configuration**: GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_DOMAIN
- **Features**:
  - Domain restriction (e.g., only @company.com)
  - Email verification
  - Superuser bypass

#### Gmail SMTP
- **Purpose**: Invoice email delivery
- **Configuration**: EMAIL_USER, EMAIL_PASS (app-specific password)
- **Features**:
  - PDF attachment
  - PDF merging (PDFtk)
  - Terms & conditions attachment
  - Email tracking (lastEmail timestamp)

#### Excel Generation Service
- **Purpose**: Export data to XLSX format
- **Type**: External HTTP service
- **Endpoint**: EXCEL_SERVICE_URL + /generate
- **Format**:
  - **Request**: JSON payload with data
  - **Response**: XLSX file (Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

#### Grafana Loki
- **Purpose**: Centralized log aggregation
- **Configuration**: LOGGING_LOKI
- **Format**: JSON logs with labels
- **Network**: External docker network (monitoring_monitoring)

#### Peppol/UBL 2.1
- **Purpose**: European electronic invoicing
- **Standard**: Universal Business Language 2.1
- **Protocol**: Peppol BIS Billing 3.0.16
- **Library**: ubl-builder (custom fork)
- **Validation**: ecosio.com validator

---

## 7. Deployment Architecture

### 7.1 Container Architecture

```mermaid
graph TB
    subgraph "Host Machine"
        subgraph "Docker Network: confacnet"
            MongoDB[(MongoDB Container<br/>confac-prod-mongo<br/>Port: 27017)]
            App[App Container<br/>confac-prod-app<br/>Port: 7000]
        end

        subgraph "Docker Network: monitoring_monitoring"
            Loki[Grafana Loki]
        end

        subgraph "Docker Network: forge-excel_excelnet"
            Excel[Excel Service]
        end

        subgraph "Volumes"
            V1[mongodata<br/>Persistent DB]
            V2[Templates<br/>Pug Files]
            V3[Fonts<br/>PDF Fonts]
            V4[Logs<br/>Application Logs]
        end
    end

    subgraph "External"
        ReverseProxy[Nginx/Reverse Proxy]
        Browser[Web Browser]
    end

    Browser -->|HTTPS| ReverseProxy
    ReverseProxy -->|/api/*| App
    ReverseProxy -->|/*| App

    App --> MongoDB
    MongoDB --> V1
    App --> V2
    App --> V3
    App --> V4

    App -.->|Network| Loki
    App -.->|Network| Excel

    style MongoDB fill:#4db33d,stroke:#333,stroke-width:2px
    style App fill:#90c53f,stroke:#333,stroke-width:2px
    style ReverseProxy fill:#009639,stroke:#333,stroke-width:2px
```

### 7.2 Build Pipeline

```mermaid
graph LR
    subgraph "Development"
        Dev1[Frontend Source<br/>React + TS]
        Dev2[Backend Source<br/>Express + TS]
    end

    subgraph "Build Container (node:16.10.0)"
        B1[npm install frontend]
        B2[npm run build frontend]
        B3[npm install backend]
        B4[tsc backend]
        B5[Copy frontend build<br/>to backend/public]
    end

    subgraph "Production Image (confac-app:TAG)"
        P1[Node 16.10.0]
        P2[PDFtk installed]
        P3[Compiled backend]
        P4[Frontend static files]
        P5[node_modules]
    end

    subgraph "Runtime"
        R1[Docker Compose]
        R2[MongoDB Container]
        R3[App Container]
    end

    Dev1 --> B1
    Dev2 --> B3
    B1 --> B2
    B3 --> B4
    B2 --> B5
    B4 --> B5

    B5 --> P3
    B5 --> P4
    B1 --> P5

    P3 --> R3
    P4 --> R3
    P5 --> R3

    R1 --> R2
    R1 --> R3

    style B1 fill:#ffd700,stroke:#333,stroke-width:2px
    style P3 fill:#90ee90,stroke:#333,stroke-width:2px
    style R3 fill:#4a90e2,stroke:#333,stroke-width:2px
```

### 7.3 Deployment Process

**Automated Deployment Script** (`deploy.sh`):

```bash
# 1. Select environment
./deploy.sh .env.prod

# 2. Choose deployment type
# - (f) Full build & deploy: Rebuild everything
# - (d) Just deploy: Restart containers

# 3. Build steps (if full build)
# - Generate TAG (YYYY-MM-DD format)
# - Create temp build container
# - Compile frontend + backend
# - Copy artifacts to deploy/dist/
# - Build production Docker image (confac-app:TAG)

# 4. Deploy
# - Start MongoDB container
# - Start App container
# - Mount volumes (templates, fonts, logs)
# - Connect to networks

# 5. Versioning
# - Create git tag (v2025-12-18)
```

**Docker Compose Configuration**:

```yaml
version: '3'
services:
  mongo:
    container_name: confac-prod-mongo
    image: confac-mongo-seed:latest
    volumes:
      - mongodata:/data/db
    networks:
      - confacnet

  app:
    container_name: confac-prod-app
    image: confac-app:2025-12-18
    ports:
      - "9000:7000"
    volumes:
      - ./templates:/templates
      - ./fonts:/usr/share/fonts
      - ./logs:/var/log/confac
    networks:
      - confacnet
      - monitoring_monitoring
      - forge-excel_excelnet
    environment:
      - NODE_ENV=production
      - DB_HOST=confac-prod-mongo
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      # ... all config via ENV
    depends_on:
      - mongo
```

### 7.4 Configuration Management

**Backend Configuration** (`backend/src/config.ts`):
```typescript
export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    user: process.env.DB_USER,
    pwd: process.env.DB_PWD,
    db: process.env.DB_NAME || 'confac'
  },
  server: {
    port: process.env.PORT || 9000,
    basePath: process.env.BASE_PATH || '/'
  },
  security: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    domain: process.env.GOOGLE_DOMAIN
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES || '5h',
    superUser: process.env.SUPERUSER
  },
  // ... more config
};
```

**Environment Files**:
- `.env.dev` - Development configuration
- `.env.prod` - Production configuration
- `.env.staging` - Staging configuration

---

## 8. Database Design

### 8.1 MongoDB Collections

```mermaid
erDiagram
    USERS ||--o{ INVOICES : creates
    USERS ||--o{ PROJECTS : manages
    USERS }o--o{ ROLES : has

    CONSULTANTS ||--o{ INVOICES : bills
    CONSULTANTS ||--o{ PROJECTS : works_on
    CONSULTANTS ||--o{ PROJECTS_MONTH : tracks_time

    CLIENTS ||--o{ INVOICES : receives
    CLIENTS ||--o{ PROJECTS : sponsors
    CLIENTS ||--o{ ATTACHMENTS_CLIENT : has

    PROJECTS ||--o{ PROJECTS_MONTH : monthly_tracking
    PROJECTS ||--o{ INVOICES : generates

    PROJECTS_MONTH ||--o{ ATTACHMENTS_PROJECT_MONTH : has_files

    CONFIG ||--|| USERS : system_settings

    USERS {
        string _id PK
        string email
        string name
        string firstName
        string alias
        boolean active
        array roles
        date createdOn
        date modifiedOn
    }

    CONSULTANTS {
        string _id PK
        string firstName
        string name
        string email
        string phone
        object company
        array attachments
        IAudit audit
    }

    CLIENTS {
        string _id PK
        string name
        string slug
        string address
        string city
        string btw
        object contact
        array emailTemplates
        IAudit audit
    }

    PROJECTS {
        string _id PK
        string client FK
        string consultant FK
        string projectNr
        date startDate
        date endDate
        object partner
        object purchaseOrder
        object details
        IAudit audit
    }

    INVOICES {
        string _id PK
        string client FK
        string consultant FK
        string projectId FK
        number number
        date date
        boolean verified
        array lines
        object money
        object attachments
        date lastEmail
        IAudit audit
    }

    PROJECTS_MONTH {
        string _id PK
        string projectId FK
        number month
        number year
        object timesheet
        array attachments
        IAudit audit
    }

    ATTACHMENTS {
        string _id PK
        string type
        string filename
        buffer data
        date uploadedOn
    }

    ROLES {
        string _id PK
        string name
        array claims
    }

    CONFIG {
        string _id PK
        array definitions
        object invoiceConfig
    }
```

### 8.2 Audit Trail

All entities implement the `IAudit` interface:

```typescript
interface IAudit {
  createdOn: Date;
  createdBy: { email: string; name: string };
  modifiedOn?: Date;
  modifiedBy?: { email: string; name: string };
}
```

**Audit Rules**:
- `createdOn`: Set on entity creation
- `createdBy`: User who created the entity
- `modifiedOn`: Updated on every change (with 10-minute grace period)
- `modifiedBy`: Last user who modified the entity
- **Grace Period**: If same user modifies within 10 minutes, don't update `modifiedOn`

### 8.3 Key Indexes

**Performance Indexes**:
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });

// Invoices
db.invoices.createIndex({ number: 1 }, { unique: true });
db.invoices.createIndex({ client: 1 });
db.invoices.createIndex({ consultant: 1 });
db.invoices.createIndex({ date: -1 });

// Projects
db.projects.createIndex({ client: 1 });
db.projects.createIndex({ consultant: 1 });
db.projects.createIndex({ projectNr: 1 });

// Projects Month
db.projects_month.createIndex({ projectId: 1, month: 1, year: 1 }, { unique: true });
```

---

## Summary

CONFAC demonstrates a well-architected full-stack system with:

1. **Clear Separation of Concerns**: 3-layer backend, Redux pattern frontend
2. **Modern Technology Stack**: TypeScript, React 18, Express, MongoDB
3. **Real-time Collaboration**: Socket.io for multi-user synchronization
4. **Secure Authentication**: OAuth 2.0 + JWT + RBAC
5. **Document Generation**: PDF (Pug + html-pdf)
6. **Containerized Deployment**: Docker Compose with environment-based config
7. **External Integrations**: Gmail, Excel service, Grafana Loki, Peppol
8. **Audit Trail**: Comprehensive change tracking

The architecture is designed for scalability, maintainability, and extensibility, following enterprise patterns and best practices.

---

**Document Version**: 1.0
**Last Updated**: 2025-12-18
**Maintained By**: Development Team
