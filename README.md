# StockHub Inventory Management System

StockHub is a responsive React inventory management application for small businesses. It covers product CRUD, stock tracking, category administration, dashboard reporting, and workspace settings.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
```

## Features

- Dashboard statistics for product count, stock value, low-stock items, and out-of-stock items.
- Stock-by-category and inventory-value-over-time charts.
- Product create, read, update, and delete workflows with image URLs.
- Searchable inventory table with category/status filters, sorting, pagination, row selection, and bulk deletion.
- Stock-in and stock-out movements with quantity validation and automatic inventory updates.
- Movement deletion reverses the original quantity change.
- Category create, rename, and protected deletion. Renaming synchronizes assigned products.
- Settings for business profile, currency, low-stock threshold, notifications, and dark mode.
- Bonus features: CSV import/export, keyboard barcode/SKU scanner, local product image upload, low-stock notifications, dark mode, and an activity log.
- Authentication and RBAC with administrator and staff demo roles.
- Supplier management with vendor contacts and product counts.
- TanStack Query provider configured for cached server-state queries.
- Vitest automated utility tests.
- Loading, error, empty, validation, confirmation, and success feedback states.

## Architecture

- React + Vite with React Router for page navigation.
- Context API (`InventoryContext`) owns shared inventory state and exposes domain actions to pages.
- Service modules under `src/services` provide a structured mock REST-like API boundary.
- `localStorage` is used as the local persistence layer; seed data is used on first launch.
- Reusable UI primitives live under `src/components/common` and feature components under `src/components`.

## Assumptions

The app uses localStorage by default. Set `VITE_API_URL` to enable the hosted supplier API adapter; it expects `/suppliers` REST endpoints with GET, POST, PUT, and DELETE support. Barcode scanning is implemented as a keyboard-compatible SKU workflow, which works with USB scanners that type into an input. Demo accounts are `admin` or `staff`, both using password `stockhub`.
