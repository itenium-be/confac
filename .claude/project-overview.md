# CONFAC - Project Overview

## What is CONFAC?

CONFAC is a comprehensive invoicing and project management web application designed for managing freelancers/consultants, clients, and projects - specifically built for Belgian/European businesses. The application handles the complete lifecycle of consultant-client relationships, from project setup through monthly invoicing and payment tracking.

## Core Purpose

The application handles:
- **Invoice & Quotation Management** - Create, edit, and send invoices with PDF generation and EU-compliant e-invoicing (Peppol BIS 3.0)
- **Client Management** - Track client details, banking info, contacts, and terms & conditions
- **Consultant/Freelancer Management** - Manage consultant profiles, rates, and assignments
- **Project Management** - Link consultants to client projects with configurable monthly invoicing workflows
- **User & Role-Based Access Control** - Multi-user system with granular permissions
- **Monthly Invoicing Workflow** - Batch process monthly invoices for ongoing project assignments

## Technology Stack

### Backend
- **Runtime**: Node.js 16.10.0 (locked due to production server requirements)
- **Language**: TypeScript 4.3
- **Framework**: Express.js 4.17
- **Database**: MongoDB 3.5.8 (could upgrade to 4.4.1 max - VAX constraint on production)
- **Authentication**: JWT with Google OAuth integration (google-auth-library)
- **PDF Generation**: html-pdf with Pug templates
- **PDF Merging**: pdf-merge (requires PDFtk server dependency)
- **Email**: nodemailer with Gmail SMTP
- **Real-time**: Socket.IO 4.8 for live updates
- **XML Generation**: fast-xml-parser for e-invoice creation
- **Logging**: winston with daily file rotation

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.3
- **State Management**: Redux with Redux Thunk middleware
- **Routing**: React Router 7.6
- **UI Components**: React Bootstrap 2.6.0
- **Rich Text Editing**: Draft.js
- **Data Visualization**: Recharts
- **Date Handling**: date-fns
- **Drag & Drop**: react-beautiful-dnd
- **Real-time**: Socket.IO client
- **Authentication**: @react-oauth/google
- **File Upload**: react-dropzone
- **Notifications**: react-toastify
- **i18n**: Multilingual support (Dutch, English, French) via custom trans.*.ts files

### DevOps & Infrastructure
- **Database Migration**: migrate-mongo 6.0.4
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git (GitHub repository: itenium-be/confac)
- **Deployment**: Custom bash scripts in deploy/ directory

## Key Features

### 1. Invoice Management (`/invoices`)
- Create, edit, view invoices and quotations
- Generate professional PDFs using customizable Pug templates
- Generate EU-compliant e-invoice XML (Peppol BIS Billing 3.0 standard)
- Support for multiple line item types:
  - Hourly rates
  - Daily rates
  - Kilometers
  - Items
  - Sections (headers)
  - Other custom types
- Discount and tax handling (VAT)
- Multiple attachment support (PDF, XML, custom files)
- Email integration to send invoices directly
- Invoice status tracking

### 2. Quotations (`/quotations`)
- Similar functionality to invoices but marked as quotation type
- Can be converted to invoices
- Version tracking and approval workflow

### 3. Client Management (`/clients`)
- Complete client profiles with company information
- Banking details (IBAN, BIC)
- Tax identification numbers (BTW/VAT)
- Contact information (email, phone, address)
- Attachments (Terms & Conditions, contracts)
- Client-specific invoice templates

### 4. Consultant Management (`/consultants`)
- Manage freelancer/consultant profiles
- Track active projects and assignments
- Consultant rates and billing configurations
- Monthly assignment overview
- Timesheet and expense claim tracking

### 5. Project Management (`/projects`)
- Link consultants to client projects
- Configure project months with:
  - Timesheet requirements
  - Inbound invoice attachments
  - Custom billing rates
- Support for partner tariffs (separate consultant/client billing rates)
- Project timeline and status tracking
- Monthly invoicing workflow integration

### 6. Monthly Invoicing (`/monthly-invoicing`)
- Batch process monthly invoices for ongoing project assignments
- Project month configuration management
- Timesheet validation
- Inbound invoice attachment handling
- Automatic invoice generation based on project month data

### 7. User & Role Management (`/users`, `/roles`)
- Role-based access control (RBAC)
- JWT-based authentication
- Google Workspace/GSuite integration for company domain auth
- User audit trails (created by, modified by timestamps)
- Granular permission management

### 8. Configuration & Admin (`/config`, `/admin`)
- System-wide configuration for company details
- Invoice template customization
- Email settings
- PDF generation settings
- Admin dashboard

### 9. Dashboard (`/`, `/home`)
- Project months overview
- Upcoming invoice reminders
- Recent activity feed
- Key metrics and statistics

## Project Structure

```
confac/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── controllers/         # Route handlers (invoices, clients, consultants, projects, etc.)
│   │   ├── models/              # TypeScript interfaces and data models
│   │   ├── routes/              # Express route definitions
│   │   ├── faker/               # Test data generation utilities
│   │   ├── server.ts            # Express app initialization
│   │   └── config.ts            # Configuration management (env-based)
│   ├── public/                  # Static assets
│   │   └── templates/           # Pug templates for PDF generation
│   ├── .env.sample              # Environment variable template
│   └── package.json
│
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── components/          # React components (organized by feature)
│   │   │   ├── invoice/
│   │   │   ├── client/
│   │   │   ├── consultant/
│   │   │   ├── project/
│   │   │   ├── users/
│   │   │   └── ...
│   │   ├── actions/             # Redux action creators
│   │   ├── reducers/            # Redux reducers
│   │   ├── models.ts            # TypeScript type definitions
│   │   ├── routes.tsx           # React Router configuration
│   │   ├── trans.en.ts          # English translations
│   │   ├── trans.nl.ts          # Dutch translations
│   │   └── trans.fr.ts          # French translations (if exists)
│   └── package.json
│
├── deploy/                       # Deployment scripts and migrations
│   ├── migrations/              # MongoDB migration scripts (migrate-mongo)
│   ├── docker-compose.yml       # Local development Docker setup
│   ├── deploy.sh                # Production deployment script
│   └── migrate.sh               # Migration runner script
│
├── README.md                     # Setup and development instructions
└── .claude/                      # Claude Code-specific documentation
    └── project-overview.md       # This file
```

## Important Technical Details

### Version Lock-In
- **Node.js 16.10.0** - Locked due to production server requirements
- **TypeScript 4.3** (backend) - Compatibility with Node 16
- **MongoDB 3.5.8** (driver version) with Docker image 3.6.3 - Could upgrade to max 4.4.1 (production server lacks VAX instruction set required by newer versions)
- Later MongoDB versions would require breaking changes (e.g., ObjectId vs ObjectID) and @types/mongodb would no longer be necessary

### External Dependencies
- **PDFtk** must be installed on server for PDF merging functionality:
  ```bash
  # Linux
  apt-get install pdftk

  # Windows (using Chocolatey)
  cinst -y pdftk-server
  ```
  More info: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/

- **Fonts** must be present in `/usr/share/fonts` for selectable PDF text
- **Google OAuth** credentials required for authentication
- **Gmail SMTP** credentials required for email functionality

### Database Migrations
- Managed via `migrate-mongo` in the `/deploy` directory
- First time setup: `cd deploy && npm install`
- Create new migration: `cd deploy && npm run create some-name`
- Execute migrations: `cd deploy && npm run up`
- On production server: `cd deploy && ./migrate.sh`
- Rollback: `cd deploy && npm run down`
- MongoDB credentials are read automatically from the `.env` file

### E-Invoice Compliance
- Generated XML follows **Peppol BIS Billing 3.0** standard
- EU regulation for electronic invoicing
- Validation tool: https://ecosio.com/en/peppol-and-xml-document-validator/
- Use ruleset: "OpenPeppol UBL Invoice (2023.11) (aka BIS Billing 3.0.16)"
- Documentation: https://docs.peppol.eu/poacc/billing/3.0

### PDF Generation
- Templates located in `backend/public/templates/`
- Written in Pug templating language
- Customizable per company/client
- Support for company logos, custom headers/footers
- Multiple template versions for different invoice types

### Authentication Flow
1. Google OAuth login for company domain users
2. JWT token generation and validation
3. Token stored in localStorage (frontend)
4. Token sent in Authorization header for API requests
5. express-jwt middleware validates tokens on backend

### Real-time Features
- Socket.IO for real-time updates across users
- Broadcast invoice updates to connected clients
- Live notification system
- Concurrent user activity tracking

## Development Workflow

### Local Setup
1. Clone repository
2. Setup MongoDB with Docker:
   ```bash
   docker volume create mongodata
   docker run -id -p 27017:27017 \
     -e "MONGO_INITDB_ROOT_USERNAME=admin" \
     -e "MONGO_INITDB_ROOT_PASSWORD=pwd" \
     -v mongodata:/data/db \
     --name confac-mongo mongo:3.6.3
   ```
3. Configure backend:
   ```bash
   cd backend
   cp .env.sample .env
   cp -r templates-example templates
   # Edit .env with your settings (MongoDB credentials, etc.)
   ```
   Configuration is managed in `backend/src/config.ts` which reads from `.env` file.

4. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../deploy && npm install  # Required for database migrations
   ```

5. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

### Test Data Generation
- Configure amounts in `backend/src/faker/faker-config.ts`
- Run: `cd backend && npm run faker`
- Generates random clients, consultants, projects, and invoices

### Template Development
- Templates located in `backend/public/templates/` (copied from `templates-example/` during setup)
- Edit Pug templates: `./templates/*.pug`
- Compile HTML: `gulp build`
- Watch for changes: `gulp watch`
- Preview in browser: `npx http-server -o ./dist -o` (opens http://localhost:8080/)
- Note: Gulp commands should be run from the project root or appropriate directory

## Common Workflows

### Creating an Invoice
1. Navigate to `/invoices/create`
2. Select client and consultant
3. Choose invoice type (invoice vs quotation)
4. Add line items (hours, days, expenses)
5. Preview PDF
6. Generate XML e-invoice (optional)
7. Save and optionally send via email

### Monthly Invoicing Process
1. Navigate to `/monthly-invoicing`
2. Select month and year
3. Review project months requiring invoicing
4. Verify timesheets and inbound invoices attached
5. Generate batch invoices
6. Review and send to clients

### Adding a New Client
1. Navigate to `/clients/create`
2. Enter company details
3. Configure bank details and tax numbers
4. Upload Terms & Conditions (optional)
5. Save client profile
6. Assign to projects as needed

## Deployment

Production deployment handled via `deploy/deploy.sh` script:
- SSH connection to production server
- Git pull latest changes
- npm install dependencies
- Build frontend assets
- Run database migrations
- Restart Node.js process
- Health check verification

## Useful Commands

```bash
# Start dev environment
npm start                    # Both frontend and backend

# Database migrations
cd deploy
npm run create migration-name
npm run up
npm run down

# Generate test data
cd backend
npm run faker

# Template compilation
gulp build
gulp watch

# Run tests (if available)
npm test
```

## Key Business Concepts

### Project Month
A "project month" represents a single month of work for a consultant on a client project. It can include:
- Timesheet for hours worked
- Inbound invoice (consultant's invoice to the agency)
- Project-specific configuration (rates, notes)
- Status tracking (invoiced, paid, etc.)

### Partner Tariff
When the consultant's rate (what the agency pays them) differs from the client's rate (what the client pays the agency), this is tracked as a "partner tariff". This allows for margin calculation and proper billing.

### Consultant vs Client
- **Consultant**: The freelancer/contractor doing the work
- **Client**: The end customer receiving the work
- **Agency** (Confac user): The intermediary managing the relationship

## Contact & Support

- Repository: https://github.com/itenium-be/confac
- Organization: itenium-be

---

**Note for Claude Code**: This file provides comprehensive context about the CONFAC project. In new conversations, you can reference this file by asking the user to mention its existence, or you can proactively read it when starting work on the codebase.
