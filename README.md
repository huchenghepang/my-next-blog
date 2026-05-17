# My Next.js Blog

This is a feature-rich Next.js blog application built with modern technologies including TypeScript, Prisma, PostgreSQL/MySQL, and various UI libraries. The application follows Next.js best practices with the App Router architecture and includes comprehensive CI/CD workflows.

## Features

- **Next.js 16** with App Router and Server Components
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **Tailwind CSS** for styling with **Material UI** components
- **Authentication** system with user roles and permissions
- **Rich Text Editor** with Markdown support
- **SEO Optimized** with metadata and sitemap generation
- **Responsive Design** for all device sizes
- **API Routes** for backend functionality
- **Deployment ready** with PM2 and automated workflows

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Material UI
- **Database**: PostgreSQL/MySQL with Prisma ORM
- **Authentication**: Custom authentication system
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React and custom icon fonts
- **Deployment**: PM2, automated GitHub Actions

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/        # Admin dashboard
│   │   ├── (tooltip)/          # Main blog routes
│   │   └── api/                # API routes
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions and libraries
│   ├── prisma/                # Database schema and migrations
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── .github/
│   └── workflows/             # GitHub Actions workflows
├── .env.example               # Environment variables template
├── deploy.sh                  # Deployment script
└── ecosystem.config.js        # PM2 configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL or MySQL database
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-next-blog
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then update the `.env.local` file with your configuration values.

4. Set up the database:
```bash
# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate:dev
```

5. Run the development server:
```bash
pnpm dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

## Development Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm sitemap` - Generate sitemap
- `pnpm zip-dist` - Create distribution ZIP

## Database Schema

The application uses Prisma ORM with the following main entities:

- **Users**: User accounts with authentication and roles
- **Articles**: Blog posts with categories and tags
- **Comments**: User comments on articles
- **Categories**: Article categorization
- **Roles & Permissions**: User authorization system
- **Files**: File uploads and storage information

## API Endpoints

The application provides RESTful API endpoints under `/api/`:

- `/api/article` - Article management
- `/api/auth` - Authentication
- `/api/user` - User management
- `/api/health` - Health check (returns application status)
- `/api/upload` - File uploads
- `/api/tags` - Tag management

## GitHub Actions Workflows

This project includes a comprehensive CI/CD pipeline:

### Workflow Features

- **Linting**: Checks code quality with ESLint
- **Type Checking**: Validates TypeScript compilation
- **Testing**: Runs unit and integration tests
- **Building**: Compiles the Next.js application
- **Security Scanning**: Audits dependencies for vulnerabilities
- **Staging Deployment**: Deploys to staging environment from `develop` branch
- **Production Deployment**: Deploys to production from `main` branch and tags
- **Notifications**: Sends deployment status updates

### Trigger Events

- Push to `main`, `develop`, or `release/*` branches
- Creation of version tags (`v*`)
- Pull requests to `main`

### Environments

- **Staging**: Deployed from `develop` branch
- **Production**: Deployed from `main` branch and version tags

### Required Secrets

Add these secrets to your GitHub repository settings:

#### Required Secrets:
- `SSH_PRIVATE_KEY`: Private key for server access
- `DATABASE_URL`: Database connection string
- `STAGING_DATABASE_URL`: Staging database URL
- `PRODUCTION_DATABASE_URL`: Production database URL
- `NEXT_PUBLIC_BASE_URL`: Base URL for the application
- `STAGING_BASE_URL`: Staging environment URL
- `PRODUCTION_BASE_URL`: Production environment URL

#### Optional Secrets:
- `SLACK_WEBHOOK_URL`: For deployment notifications
- `ENV_COMMON`, `ENVPRODUCTION`, `ENVTEST`, `ENVDEVELOPMENT`: Encoded environment files
- `SERVER_HOST`, `SERVER_USER`: Server connection details
- `HEALTH_CHECK_URL`: URL for health checks

## Deployment

### Manual Deployment

1. Build the application:
```bash
pnpm build
```

2. Use the provided deployment script:
```bash
chmod +x deploy.sh
./deploy.sh production
```

### Automated Deployment

The GitHub Actions workflow automatically deploys:

1. From `develop` branch to staging environment
2. From `main` branch to production environment
3. On version tag creation to production

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Application
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NODE_ENV="development" # or "production"

# Authentication (if using auth system)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Environment Files

The application supports multiple environment files:
- `.env` - General environment variables
- `.env.local` - Local overrides (not committed)
- `.env.development` - Development-specific
- `.env.production` - Production-specific
- `.env.test` - Test environment

## Performance Optimizations

- **Image Optimization**: Using `next/image` with proper sizing
- **Code Splitting**: Automatic with Next.js
- **Caching**: Redis integration for server-side caching
- **Database**: Prisma with connection pooling
- **CDN Ready**: Optimized for CDN deployment

## SEO Features

- Dynamic metadata generation
- Sitemap generation
- Open Graph tags
- Structured data (JSON-LD)
- Semantic HTML structure

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.