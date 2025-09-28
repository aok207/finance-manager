# Finance Manager

A modern personal finance management application built with Next.js, featuring transaction tracking, account management, and financial analytics.

## Features

- **Authentication**: Secure sign-in/sign-up with GitHub OAuth integration
- **Account Management**: Create and manage multiple financial accounts
- **Transaction Tracking**: Record and categorize income and expenses
- **Categories**: Organize transactions with custom categories
- **Dashboard**: Visual overview of financial metrics and insights
- **Data Tables**: Advanced filtering, sorting, and pagination for transactions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with GitHub OAuth
- **Data Visualization**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **UI Components**: shadcn ui

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # Shared UI components
│   ├── ui/               # Base UI components
│   └── data-table/       # Reusable data table components
├── db/                   # Database configuration and schemas
│   └── schemas/          # Drizzle ORM schemas
├── lib/                  # Utility libraries and configurations
├── modules/              # Feature-based modules
│   ├── accounts/         # Account management
│   ├── auth/            # Authentication
│   ├── categories/      # Category management
│   ├── dashboard/       # Dashboard functionality
│   └── transactions/    # Transaction management
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Neon PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance-manager
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.sample .env
   ```

   Fill in your environment variables:

   ```env
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   DATABASE_URL=your-postgresql-connection-string
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Set up the database**

   ```bash
   # Generate database migrations
   pnpm db:generate

   # Push schema to database
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations

## Database Schema

The application uses four main database schemas:

- **Users & Sessions** (`auth-schema.ts`) - User authentication and session management
- **Accounts** (`account-schema.ts`) - Financial accounts (checking, savings, etc.)
- **Categories** (`category-schema.ts`) - Transaction categories for organization
- **Transactions** (`transaction-schema.ts`) - Income and expense records

## Authentication

Authentication is handled by Better Auth with support for:

- GitHub OAuth integration
- Session management
- Protected routes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
