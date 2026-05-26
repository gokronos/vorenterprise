This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

## SAGRILAFT Admin Dashboard

This project now includes:

- Public PDF viewers for:
	- `/sagrilaft`
	- `/organigrama`
	- `/politica-datos`
- Internal dashboard at `/admin` to update all compliance PDFs.
- User management with roles (`admin`, `editor`) from dashboard.
- SQLite database persistence (users + SAGRILAFT settings).

### 1) Configure admin credentials

Create a `.env.local` file based on `.env.example`:

```bash
DATABASE_PATH=data/vorenterprise.db
ADMIN_USER=admin
ADMIN_PASSWORD=admin12345
ADMIN_SESSION_SECRET=change-this-secret
```

At first startup, the app bootstraps:

- `admin_users` table (and inserts first admin user from env)
- `compliance_documents` table (default docs for SAGRILAFT, Organigrama, Politica de Datos)

### 2) Login to dashboard

- Open `/admin/login`
- Authenticate with your configured credentials
- Update title, description, and PDF URL from the dashboard

### 3) PDF source

- You can use a local file URL like `/documentos/sagrilaft.pdf`
- Or an external PDF URL

### 4) Roles

- `admin`: can create users and update documents.
- `editor`: can update documents.
