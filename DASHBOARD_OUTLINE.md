# Dashboard Outline & Functionality

## Project Overview
A comprehensive data scraping and entity management platform with IPO intelligence, CRM capabilities, and AI-powered features. Built on React + Vite + TypeScript with Lovable Cloud (Supabase backend).

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system (HSL semantic tokens)
- **UI Components**: Radix UI primitives, shadcn/ui components
- **State Management**: React hooks, TanStack Query
- **Routing**: React Router DOM v6
- **Backend**: Lovable Cloud (Supabase) - Postgres DB, Auth, Edge Functions, Storage
- **Real-time**: Supabase Realtime subscriptions

## Application Structure

### Main Pages & Routes

#### Public Routes
- `/` - Landing page with IPO intelligence, company ticker, hero section
- `/auth` - Authentication (login/signup)
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset with token

#### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard with overview, watchlist, alerts tabs
- `/data-sources` - Data source management & scraping control
- `/crm` - CRM dashboard with deal pipeline, revenue analytics, compliance tracking
- `/lead-generation` - Lead generation and management
- `/investor-intelligence` - Investor analysis and fund scraping
- `/analytics` - Analytics and reporting
- `/compliance` - Compliance tracking and monitoring
- `/sentiment-monitor` - Sentiment analysis monitoring
- `/marketing` - Marketing automation and campaigns
- `/documents` - Document management
- `/content-library` - Content repository
- `/communication-logs` - Communication history
- `/exports` - Data export management
- `/admin` - Admin panel for user/system management
- `/settings` - User settings and preferences
- `/profile` - User profile management
- `/premium` - Premium features and subscription
- `/ai-training` - AI model training interface
- `/knowledge` - Knowledge base management
- `/workflow-builder` - Workflow automation builder
- `/task-scheduler` - Task scheduling interface
- `/registry-management` - Registry source management
- `/rules-scoring` - Scoring rules configuration
- `/data-normalization` - Data normalization tools
- `/credential-vault` - Secure credential storage
- `/performance` - Performance metrics
- `/pipeline-performance` - Pipeline analytics
- `/system-health` - System monitoring
- `/integration-logs` - Integration activity logs
- `/feedback` - User feedback system

## Core Features

### 1. Data Scraping System

**Components**:
- `DataSourceGrid.tsx` - Visual grid for selecting data sources
- `LatestScrapedJobs.tsx` - Recent scraping job monitoring
- `useScrapingJobs.ts` - Hook for job management and real-time updates

**Data Sources**:
- UK Companies House
- Hong Kong ICRIS
- GLEIF (Legal Entity Identifier)
- Direct APIs (via N8N integration)
- Custom registries

**Workflow**:
1. User selects source from DataSourceGrid
2. Triggers scrape via `trigger-scrape` edge function
3. N8N performs external API calls
4. Callback via `scrape-callback` edge function
5. Real-time job updates via Supabase subscriptions
6. Toast notifications on completion/failure

**Edge Functions**:
- `trigger-scrape` - Initiates scraping job (requires auth)
- `scrape-callback` - Receives N8N callback with results
- `cleanup-stale-jobs` - Background cleanup for old jobs

### 2. Entity Management

**Components**:
- `EntitiesTable.tsx` - Main entity data grid
- `CompanyDetailView.tsx` - Detailed entity information modal
- `FilterPanel.tsx` - Advanced filtering controls
- `useEntities.ts` - Entity data management hook

**Entity Data Model**:
```typescript
{
  id: string
  legal_name: string
  registry_id: string
  registry_source: string
  country: string
  status: 'active' | 'inactive' | 'pending'
  score: number
  incorporation_date: string
  address: string
  phone: string
  email: string
  website: string
  lei_code: string
  created_at: string
  updated_at: string
}
```

**Features**:
- Real-time entity updates
- Advanced filtering (status, score range, country, source)
- Bulk export (CSV/JSON)
- Sentiment scoring integration
- Lead qualification

### 3. Authentication System

**Flow**:
- Email/password authentication via Supabase Auth
- Auto-confirm email signups enabled
- Protected routes with `ProtectedRoute.tsx` wrapper
- Session persistence with localStorage
- Auth hooks: `useAuth.tsx`, `useAuthUser.tsx`

**User Management**:
- Profile management
- Premium subscription status
- Role-based access (basic implementation)

### 4. Dashboard System

**Tabs** (`/dashboard`):
- **Overview** (`OverviewTab.tsx`) - KPIs, quick actions, recent activity
- **Watchlist** (`WatchlistTab.tsx`) - Tracked entities
- **Alerts** (`AlertsTab.tsx`) - User notifications and alerts

**KPIs**:
- Watchlist items count
- Total alerts
- Unread alerts
- Entity statistics

### 5. CRM Features

**Components** (`src/components/crm/`):
- `DealPipelineCard.tsx` - Sales pipeline visualization
- `RevenueAnalyticsCard.tsx` - Revenue tracking
- `ComplianceTrackerCard.tsx` - Compliance monitoring
- `CompanyHealthCard.tsx` - Company health metrics
- `IPOMetricsCards.tsx` - IPO-specific analytics
- `MarketIntelligenceCard.tsx` - Market insights
- `CriticalTasksCard.tsx` - Task management

### 6. Lead Generation & Intelligence

**Features**:
- Contact options modal
- Domain checking (`DomainCheckModal.tsx`)
- Lead detail views (`LeadDetailModal.tsx`)
- Investor fund scraping
- Sentiment monitoring integration

### 7. Premium Features

**Components**:
- `PremiumPaywall.tsx` - Access control for premium features
- Premium-gated content in various tabs
- Subscription management

## Database Schema

### Core Tables

**entities**
- Primary entity storage
- RLS policies: users can view all, admin can modify
- Real-time enabled

**scraping_jobs**
- Job tracking and status
- RLS: users see only their jobs
- Fields: source, status, search_term, records_fetched, records_processed, error_message, created_by

**filtering_audit**
- Sentiment filtering audit trail
- Tracks blocked entities
- Sentiment scores and article data

**watchlist**
- User-specific entity tracking
- RLS: users see only their watchlist items

**user_alerts**
- Notification system
- RLS: users see only their alerts
- Read/unread status tracking

**profiles** (if implemented)
- Extended user information
- Links to auth.users via user_id

### Storage Buckets
- Document storage
- Avatar storage
- Export file storage

## Edge Functions

### Data Processing
1. **trigger-scrape** - Initiates external scraping
   - Requires authentication
   - Creates job record with user ID
   - Returns job ID for tracking

2. **scrape-callback** - N8N webhook receiver
   - Accepts: jobId, status, total_count, entities[]
   - Updates job status
   - Optionally inserts entities
   - Triggers sentiment scoring

3. **score-article** - Sentiment analysis
   - AI-powered sentiment scoring
   - Updates filtering_audit table

4. **cleanup-stale-jobs** - Maintenance
   - Background cleanup of old jobs

### Entity Management
5. **entity-action** - Individual entity operations
6. **entity-bulk-export** - Bulk data export
7. **export-entities** - Export with filters

### Communication
8. **send-sms** - SMS notifications
9. **process-callback-inbox** - Callback processing

### Utilities
10. **check-domain** - Domain validation
11. **test-sentiment** - Sentiment testing endpoint

## Real-time Features

### Supabase Subscriptions
- Entity inserts/updates (`useEntities.ts`)
- Scraping job status changes (`useScrapingJobs.ts`)
- Alert notifications (`AlertsTab.tsx`)

### Toast Notifications
- Scrape completion/failure
- Entity updates
- System alerts
- Uses `sonner` library

## UI Component System

### Design System
- **Location**: `src/index.css`, `tailwind.config.ts`
- **Color System**: HSL semantic tokens
- **Theme**: Light/dark mode support via CSS variables
- **Typography**: Custom font scales
- **Spacing**: Standardized spacing system

### Key UI Components (`src/components/ui/`)
- Forms: `input`, `select`, `checkbox`, `radio-group`, `textarea`
- Data Display: `table`, `card`, `badge`, `avatar`
- Feedback: `toast`, `alert`, `dialog`, `sheet`
- Navigation: `dropdown-menu`, `tabs`, `breadcrumb`
- Charts: `chart` (Recharts integration)

### Composite Components
- `NavigationSidebar.tsx` - Main app navigation
- `DashboardHeader.tsx` - Header with search and notifications
- `TopEntitiesList.tsx` - Top scored entities
- `CompanyTicker.tsx` - Scrolling company ticker (landing)

## Data Flow

### Scraping Workflow
```
User → DataSourceGrid → trigger-scrape (Edge Function) 
→ N8N → External API → N8N Processing 
→ scrape-callback (Edge Function) → Database Update 
→ Real-time Subscription → UI Update → Toast Notification
```

### Entity Filtering
```
Raw Entity Data → sentiment check → score-article (AI) 
→ filtering_audit record → blocked/passed decision 
→ entities table (if passed)
```

### Authentication Flow
```
Login Form → Supabase Auth → Session Storage 
→ Protected Route Check → Dashboard Access 
→ RLS Policy Enforcement
```

## State Management

### React Hooks Used
- `useState` - Local component state
- `useEffect` - Side effects and subscriptions
- `useQuery` (TanStack) - Server state (`useFilteringAudit.ts`)
- Custom hooks for business logic

### Custom Hooks
- `useScrapingJobs.ts` - Scraping job management
- `useEntities.ts` - Entity CRUD operations
- `useAuth.tsx` - Authentication state
- `useAuthUser.tsx` - Current user data
- `useFilteringAudit.ts` - Filtering statistics
- `use-toast.ts` - Toast notifications

## Security

### Row-Level Security (RLS)
- All tables have RLS enabled
- User-scoped data access
- Admin bypass policies (where applicable)

### Authentication
- JWT-based authentication
- Session persistence
- Auto token refresh
- Protected routes

### Secrets Management
- Environment variables via Lovable Cloud
- API keys stored in Supabase secrets
- No hardcoded credentials

## Integration Points

### External Systems
- **N8N**: Workflow automation for scraping
- **AI Gateway**: Sentiment analysis (via Lovable AI)
- **Stripe**: Payment processing (premium features)
- **Email/SMS**: Communication services

### Callback Mechanism
N8N sends callbacks to `scrape-callback` with:
```json
{
  "jobId": "uuid",
  "status": "completed" | "failed",
  "total_count": number,
  "entities": Array<Entity>
}
```

## Development Guidelines

### Code Organization
- Pages in `src/pages/`
- Reusable components in `src/components/`
- Business logic in `src/hooks/`
- UI primitives in `src/components/ui/`
- Edge functions in `supabase/functions/`

### Styling Rules
- Use semantic tokens from `index.css`
- No direct color values (e.g., `text-white`, `bg-black`)
- HSL color format required
- Responsive design with Tailwind breakpoints

### Database Changes
- Use migration tool for schema changes
- Never manually edit `types.ts` or `client.ts`
- Always consider RLS policies
- Test with actual user sessions

## Known Issues & Considerations

1. **Scraping Jobs Visibility**: Jobs require `created_by` to be visible (RLS)
2. **N8N Callback Format**: Must use snake_case (`total_count` not `totalCount`)
3. **Authentication Required**: All scraping operations need authenticated user
4. **Old Jobs**: Jobs created before auth enforcement won't appear
5. **Real-time Limits**: Supabase realtime has connection limits

## Future Enhancements
- Advanced AI training interface
- Workflow builder completion
- Enhanced sentiment analysis
- Multi-tenant support
- API rate limiting
- Advanced export formats
- Webhook management UI

## Environment Variables
```
VITE_SUPABASE_URL - Supabase project URL
VITE_SUPABASE_PUBLISHABLE_KEY - Anon/public key
VITE_SUPABASE_PROJECT_ID - Project identifier
```

## Deployment
- Automatic deployment via Lovable
- Edge functions auto-deploy on code changes
- Database migrations require user approval
- Frontend builds on every commit

---

**Last Updated**: 2025-10-27
**Project ID**: utzxdzkebdgwxgqhieee
