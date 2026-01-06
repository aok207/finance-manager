# AGENTS.md - Coding Guidelines for Finance Manager

This document provides essential information for AI coding agents working in this repository.

## Project Overview

**Type:** Next.js 15 full-stack application with App Router  
**Stack:** React 19, TypeScript, Tailwind CSS v4, Drizzle ORM, PostgreSQL (Neon), Better Auth  
**Package Manager:** pnpm (v10.13.1+) - **ALWAYS use pnpm, never npm, yarn, or bun**

## Build, Lint, and Test Commands

### Development
```bash
pnpm dev              # Start dev server with Turbopack (localhost:3000)
```

### Production
```bash
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server
```

### Code Quality
```bash
pnpm lint             # Run ESLint (next/core-web-vitals + next/typescript)
```

### Database
```bash
pnpm db:generate      # Generate migrations from schema changes
pnpm db:push          # Push schema to database (development)
pnpm db:migrate       # Run migrations (production)
```

### Testing
**⚠️ No testing framework configured.** If tests are needed, install Vitest or Jest first.

## Project Structure

```
finance-manager/
├── app/                    # Next.js App Router (routes)
│   ├── (auth)/            # Route group: sign-in, sign-up
│   ├── (dashboard)/       # Route group: protected pages
│   ├── api/auth/[...all]/ # Better Auth API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + Tailwind config
├── modules/               # Feature modules (business logic)
│   ├── auth/             # Auth pages + UI
│   ├── dashboard/        # Dashboard logic + sections
│   ├── transactions/     # Transaction feature
│   │   ├── api/         # actions.ts, queries.ts (Server Actions)
│   │   ├── pages/       # Transaction pages
│   │   └── ui/          # Transaction components
│   ├── accounts/         # Same structure
│   └── categories/       # Same structure
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components (22 components)
│   └── data-table/       # Reusable TanStack Table
├── db/                    # Database layer
│   ├── schemas/          # Drizzle ORM schemas
│   └── index.ts          # DB connection
├── lib/                   # Utilities
│   ├── utils.ts          # cn() helper
│   ├── auth.ts           # Better Auth server
│   └── auth-client.ts    # Better Auth client
└── public/               # Static assets
```

## Code Style Guidelines

### Component Guidelines

**Always use shadcn/ui components:**
- Check for existing shadcn components before implementing custom ones
- Install new shadcn components if needed: `pnpm dlx shadcn@latest add <component>`
- 22 components already installed in `components/ui/`

**Component patterns:**
- Use PascalCase for component names
- Never use `React.FC` for prop types
- Default exports for pages, named exports for reusable components
- Use "use client" directive for interactive components
- Server Components by default (no directive)

Example:
```typescript
type AddTransactionFormProps = {
  onSuccess?: () => void;
  defaultValues?: TransactionFormValues;
};

export function AddTransactionForm({ onSuccess, defaultValues }: AddTransactionFormProps) {
  // Component implementation
}
```

### Import Guidelines

**Always use absolute imports with `@/` alias:**
```typescript
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createTransaction } from "@/modules/transactions/api/actions";
```

**Never create index files for exports.** Import directly from source files.

**Import order:**
1. External libraries (React, Next.js, third-party)
2. Internal components/utilities (using `@/` alias)
3. Types (inline, not separate unless necessary)

### File Naming Conventions

- **Components:** kebab-case.tsx (e.g., `add-transaction-form.tsx`)
- **Pages:** `page.tsx` (Next.js convention)
- **Layouts:** `layout.tsx` (Next.js convention)
- **API files:** `actions.ts`, `queries.ts`
- **Schemas:** `*-schema.ts` (e.g., `transaction-schema.ts`)

### Naming Conventions

- **Functions/variables:** camelCase (`createTransaction`, `userId`)
- **Components/types:** PascalCase (`AddTransactionForm`, `TransactionType`)
- **Database tables:** snake_case in schema (`user_id`), camelCase in TypeScript
- **Constants:** UPPER_SNAKE_CASE (rarely used)

### TypeScript Guidelines

**Strict mode enabled** - Always provide types:
```typescript
// Use Zod for validation + type inference
const formSchema = z.object({
  amount: z.number().min(0.01),
  payee: z.string().min(1, "Payee is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Use Drizzle type inference
type Transaction = typeof transactions.$inferSelect;
```

**Path aliases:**
- `@/*` maps to project root
- Always use this for internal imports

### Form Patterns

**Use react-hook-form with Zod validation:**
```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { amount: 0, payee: "" },
});

const onSubmit = async (values: FormValues) => {
  setIsLoading(true);
  try {
    const result = await createTransaction(values);
    if (result.success) {
      toast.success("Transaction created");
      form.reset();
      onClose?.();
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create transaction");
    }
  } catch (error) {
    toast.error("An unexpected error occurred");
  } finally {
    setIsLoading(false);
  }
};
```

**Button loaders required:**
```typescript
<Button type="submit" disabled={isLoading}>
  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  {isLoading ? "Creating..." : "Create Transaction"}
</Button>
```

### Server Actions Pattern

**Use "use server" directive:**
```typescript
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: TransactionInput) {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error("Unauthorized");
    }

    // 2. Perform database operation
    const result = await db.insert(transactions)
      .values({ ...data, userId: session.user.id })
      .returning();

    // 3. Revalidate affected paths
    revalidatePath("/transactions");

    // 4. Return success with data
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}
```

**Always return:** `{ success: boolean, error?: string, data?: T }`

### Error Handling

**Client-side:**
- Use `sonner` for toast notifications
- Always show loading states
- Disable UI during async operations
- Use try/catch with fallback messages

**Server-side:**
- Log errors with `console.error()`
- Return user-friendly error messages
- Never expose internal errors to clients
- Always check authentication first

### Data Fetching

**Server Components (preferred):**
```typescript
// In page.tsx
const { data: transactions = [] } = await getTransactions({ accountId });
```

**After mutations, revalidate:**
```typescript
revalidatePath("/transactions");  // Server-side
router.refresh();                  // Client-side
```

### Styling and Theming

**Use Tailwind CSS with theme variables:**
- Never hardcode colors - use CSS variables
- Support both light and dark modes
- Use theme variables: `bg-background`, `text-foreground`, `border-border`
- Custom colors defined in `app/globals.css`

**Dark mode setup:**
- Uses `next-themes` with class strategy
- Toggle via `<ModeToggle />` component
- All colors auto-adapt via CSS variables

### Database Schema Patterns

**Drizzle ORM conventions:**
```typescript
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: integer("amount").notNull(),
    payee: varchar("payee").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export type Transaction = typeof transactions.$inferSelect;
```

## Critical Rules from .cursor/rules/custom-rule.mdc

1. **Always use shadcn/ui components** - check first before implementing custom ones
2. **Follow existing folder structure** - match patterns in modules/
3. **Never create index files** for exports
4. **Never use React.FC** for component prop types
5. **Never go beyond what's asked** - no demo pages, no README modifications
6. **Always use pnpm** for package management
7. **All forms require client-side validation** using react-hook-form + Zod
8. **All buttons show loader spinners** while submitting
9. **Support light and dark mode** - never hardcode colors without both variants

## Environment Variables Required

```env
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<neon-postgres-connection-string>
GITHUB_CLIENT_ID=<github-oauth-id>
GITHUB_CLIENT_SECRET=<github-oauth-secret>
```

## Common Pitfalls to Avoid

- ❌ Using npm/yarn/bun instead of pnpm
- ❌ Creating index.ts files for exports
- ❌ Hardcoding colors without dark mode support
- ❌ Forgetting "use server" on Server Actions
- ❌ Not showing loading states on buttons
- ❌ Missing Zod validation on forms
- ❌ Not checking authentication in Server Actions
- ❌ Forgetting to revalidatePath after mutations
- ❌ Using React.FC for component types
